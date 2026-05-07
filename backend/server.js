const app = require('./app');
const { testConnection, isInitialized, connectionError } = require('./config/database');

const DEFAULT_PORT = 5000;
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT;

const bindServer = (port) => new Promise((resolve, reject) => {
  const server = app.listen(port, () => resolve(server));

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && port < DEFAULT_PORT + 10) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use. Trying ${nextPort}...`);
      return resolve(bindServer(nextPort));
    }

    reject(error);
  });
});

// 🚀 Start server with optional DB connection
const startServer = async () => {
  try {
    // Test DB connection but don't fail if it's not working
    if (isInitialized) {
      const dbConnected = await testConnection();
      if (!dbConnected) {
        console.warn('⚠️  Database connection failed, but server will start in degraded mode');
      }
    } else {
      console.warn('⚠️  Database not initialized, server will start in degraded mode');
      if (connectionError) {
        console.warn('⚠️  Error:', connectionError.message);
      }
    }

    const server = await bindServer(PORT);
    const activePort = server.address().port;
    console.log(`🚀 Server running on port ${activePort}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API Health Check: http://localhost:${activePort}/api/health`);
  } catch (error) {
    console.error('❌ Server startup aborted:', error.message || error);
    process.exit(1);
  }
};

startServer();
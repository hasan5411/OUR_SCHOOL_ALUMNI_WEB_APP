const app = require('./app');
const { testConnection } = require('./config/database');

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

// 🚀 Start server ONLY if DB is OK
const startServer = async () => {
  try {
    await testConnection(); // 🔥 must pass first

    const server = await bindServer(PORT);
    const activePort = server.address().port;
    console.log(`🚀 Server running on port ${activePort}`);
  } catch (error) {
    console.error('❌ Server startup aborted:', error.message || error);
    process.exit(1); // 🔥 stop server completely
  }
};

startServer();
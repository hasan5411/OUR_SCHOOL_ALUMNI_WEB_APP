require('dotenv').config();

// Security Configuration - Cyber Security Best Practices
const securityConfig = {
  // Environment Variable Validation
  requiredEnvVars: [
    'SUPABASE_PROJECT_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET_KEY',
    'SESSION_SECRET_KEY',
    'FRONTEND_URL'
  ],

  // Validate required environment variables
  validateEnvVars() {
    const missing = this.requiredEnvVars.filter(key => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    return true;
  },

  // JWT Security
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    expiresIn: process.env.JWT_EXPIRE || '7d',
    algorithm: 'HS256',
    issuer: 'bilbilash-alumni',
    audience: 'bilbilash-users'
  },

  // CORS Security
  cors: {
    origin: process.env.FRONTEND_URL || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count']
  },

  // Rate Limiting
  rateLimiting: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // File Upload Security
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,pdf,doc,docx').split(','),
    filter: (req, file, cb) => {
      const allowedTypes = securityConfig.fileUpload.allowedTypes;
      const fileExt = file.originalname.split('.').pop().toLowerCase();
      
      if (allowedTypes.includes(fileExt)) {
        cb(null, true);
      } else {
        cb(new Error(`File type .${fileExt} is not allowed`), false);
      }
    }
  },

  // Session Security
  session: {
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    }
  },

  // API Security Headers
  headers: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", process.env.SUPABASE_PROJECT_URL],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  },

  // Database Security
  database: {
    ssl: process.env.DB_SSL_REQUIRE === 'true',
    pool: {
      min: parseInt(process.env.DB_POOL_MIN) || 2,
      max: parseInt(process.env.DB_POOL_MAX) || 10
    },
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000
  },

  // Input Validation
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    phone: /^\+?[\d\s\-\(\)]+$/,
    name: /^[a-zA-Z\s]{2,50}$/,
    alphanumeric: /^[a-zA-Z0-9\s\-_]+$/
  },

  // Security Middleware Configuration
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:", "https://avatars.githubusercontent.com"],
        connectSrc: ["'self'", process.env.SUPABASE_PROJECT_URL],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
    enableErrorTracking: process.env.ENABLE_ERROR_TRACKING === 'true',
    format: 'combined'
  },

  // Backup Security
  backup: {
    enabled: process.env.AUTO_BACKUP_ENABLED === 'true',
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS) || 30,
    encryption: true
  }
};

// Initialize security configuration
securityConfig.validateEnvVars();

module.exports = securityConfig;

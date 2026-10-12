import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { prisma } from './config/database';
import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  ...(env.FRONTEND_URL ? [env.FRONTEND_URL] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, curl, mobile apps, or same-origin
    if (!origin) return callback(null, true);

    try {
      const { hostname } = new URL(origin);
      if (
        allowedOrigins.includes(origin) ||
        hostname.endsWith('.vercel.app') ||
        hostname === 'localhost' ||
        hostname === '127.0.0.1'
      ) {
        return callback(null, true);
      }
    } catch {
      // invalid URL format
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Root & Health Check ───────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'After Hours API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/v1',
    },
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: env.NODE_ENV });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorMiddleware);

// ─── Start ────────────────────────────────────────────────────────────────────
// Only start listening when running as a standalone server (not on Vercel)
if (!process.env.VERCEL) {
  async function bootstrap() {
    try {
      await prisma.$connect();
      console.log('Database connected');

      app.listen(env.PORT, () => {
        console.log(`After Hours API running on http://localhost:${env.PORT}`);
        console.log(`Health: http://localhost:${env.PORT}/health`);
        console.log(`OTP Mock Mode: ${env.OTP_MOCK_MODE} (code: ${env.OTP_MOCK_CODE})`);
      });
    } catch (err) {
      console.error('Failed to start:', err);
      await prisma.$disconnect();
      process.exit(1);
    }
  }

  bootstrap();
}

export default app;

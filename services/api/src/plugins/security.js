import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { env } from '../config/env.js';

export const registerSecurityPlugins = async (app) => {
  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || env.corsOrigins.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error('CORS_ORIGIN_NOT_ALLOWED'), false);
    },
    credentials: true,
  });

  await app.register(rateLimit, {
    global: true,
    max: env.rateLimitMax,
    timeWindow: env.rateLimitWindowMs,
  });

  if (env.nodeEnv === 'production') {
    await app.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          mediaSrc: ["'self'", 'https:'],
          frameSrc: ['https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    });
  }
};

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFound } from './middleware/errors.js';
import partSearchRouter from './routes/partSearches.js';

export function createApp() {
  const app = express();
  const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:8081';
  const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        upgradeInsecureRequests: null,
        imgSrc: ["'self'", 'data:', 'https:']
      }
    }
  }));
  app.use(cors({ origin: allowedOrigin }));
  app.use(morgan('dev'));
  app.use(express.json({ limit: '100kb' }));
  app.use('/test', express.static(path.join(currentDirectory, '../public')));

  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok', service: 'mechaniq-picture-search-api' });
  });

  app.use('/api', apiLimiter);
  app.use('/api/v1', partSearchRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

// src/server.js
import express from 'express';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import router from './router/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '200kb',
    }),
  );
  app.use(cors());
  app.use(cookieParser());
  app.use(
    pino({
      transport: { target: 'pino-pretty' },
    }),
  );

  app.use('/uploads', express.static('UPLOAD_DIR'));
  app.use('/api-docs', swaggerDocs());

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

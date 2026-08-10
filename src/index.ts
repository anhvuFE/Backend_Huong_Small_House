import 'express-async-errors';
import { createServer } from 'http';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { connectDatabase } from './config/database';
import env from './config/env';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import logger from './utils/logger';
import swaggerSpec from './docs/swagger';
import { initSocket } from './socket';

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: env.nodeEnv === 'production' ? ['https://smallhouse.vn'] : true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
  exposedHeaders: ['x-access-token'],
  credentials: true
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check ĐẶT TRƯỚC rate limiter để monitor (UptimeRobot/cron-job.org)
// ping giữ dịch vụ không "ngủ" mà không bao giờ bị 429. Không chạm DB -> luôn nhanh.
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

if (env.nodeEnv === 'production') {
  app.use(limiter);
} else {
  logger.info('Rate limiting is disabled in non-production environments');
}

app.use('/api', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.use(notFound);
app.use(errorHandler);

const start = async (): Promise<void> => {
  await connectDatabase();
  const server = createServer(app);
  initSocket(server);
  server.listen(env.port, () => logger.info(`Server listening on port ${env.port}`));
};

void start();

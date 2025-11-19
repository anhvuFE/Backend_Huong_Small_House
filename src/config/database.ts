import mongoose from 'mongoose';
import env from './env';
import logger from '../utils/logger';

mongoose.set('strictQuery', true);

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection failed: %s', (error as Error).message);
    process.exit(1);
  }
};

export default mongoose;

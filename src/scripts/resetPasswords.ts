import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import env from '../config/env';
import logger from '../utils/logger';
import User from '../models/User';
import Admin from '../models/Admin';

const resetPasswords = async (): Promise<void> => {
  await mongoose.connect(env.mongoUri);
  logger.info('Connected to MongoDB');

  const plainPassword = '12345678';
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(plainPassword, salt);

  const [userResult, adminResult] = await Promise.all([
    User.updateMany({}, { password: hashed }),
    Admin.updateMany({}, { password: hashed })
  ]);

  logger.info('Updated %d users and %d admins', userResult.modifiedCount, adminResult.modifiedCount);
  await mongoose.disconnect();
};

resetPasswords()
  .then(() => {
    logger.info('Password reset completed');
    process.exit(0);
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });

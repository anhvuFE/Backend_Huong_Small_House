import dotenv from 'dotenv';

dotenv.config();

const isProduction = (process.env.NODE_ENV || 'development') === 'production';

/**
 * Biến môi trường quan trọng: BẮT BUỘC ở production (thiếu -> throw ngay khi
 * khởi động, tránh chạy bằng secret mặc định dễ đoán). Ở dev dùng fallback.
 */
function requiredSecret(key: string, devFallback: string): string {
  const value = process.env[key];
  if (value && value.trim().length > 0) return value;
  if (isProduction) {
    throw new Error(
      `[env] Missing required environment variable "${key}". Refusing to start in production with an insecure default.`
    );
  }
  return devFallback;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  mongoUri: requiredSecret('MONGO_URI', 'mongodb://127.0.0.1:27017/small-house'),
  jwt: {
    secret: requiredSecret('JWT_SECRET', 'dev-only-insecure-jwt-secret'),
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret: requiredSecret('JWT_REFRESH_SECRET', 'dev-only-insecure-refresh-secret'),
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || 'you@gmail.com',
    pass: process.env.SMTP_PASS || 'app_password',
    from: process.env.SMTP_FROM || 'Small House <no-reply@smallhouse.vn>'
  },
  sepay: {
    apiKey: process.env.SEPAY_API_KEY || 'demo-api-key',
    secret: process.env.SEPAY_SECRET || 'demo-secret',
    endpoint: process.env.SEPAY_ENDPOINT || 'https://api.sepay.vn/v2/payment',
    callbackUrl: process.env.SEPAY_CALLBACK_URL || 'https://example.com/api/payment/sepay/callback',
    returnUrl: process.env.SEPAY_RETURN_URL || 'https://example.com/payment-success'
  },
  cloudinary: {
    url: process.env.CLOUDINARY_URL,
    folder: process.env.CLOUDINARY_FOLDER || 'small-house'
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@smallhouse.vn',
    password: requiredSecret('ADMIN_PASSWORD', '123456')
  }
};

export default env;

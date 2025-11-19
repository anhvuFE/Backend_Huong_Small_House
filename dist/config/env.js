"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 4000,
    mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/small-house',
    jwt: {
        secret: process.env.JWT_SECRET || 'supersecretkey',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'refreshsecret',
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
        password: process.env.ADMIN_PASSWORD || '123456'
    }
};
exports.default = env;
//# sourceMappingURL=env.js.map
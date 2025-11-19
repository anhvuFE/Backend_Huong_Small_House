"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const appError_1 = __importDefault(require("../utils/appError"));
const User_1 = __importDefault(require("../models/User"));
const Admin_1 = __importDefault(require("../models/Admin"));
const env_1 = __importDefault(require("../config/env"));
const PasswordResetToken_1 = __importDefault(require("../models/PasswordResetToken"));
const mail_service_1 = __importDefault(require("./mail.service"));
class AuthService {
    signToken(payload, expiresIn, secret) {
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: expiresIn });
    }
    buildTokens(doc) {
        const payload = { id: doc.id, role: doc.role };
        const accessToken = this.signToken(payload, env_1.default.jwt.expiresIn, env_1.default.jwt.secret);
        const refreshToken = this.signToken(payload, env_1.default.jwt.refreshExpiresIn, env_1.default.jwt.refreshSecret);
        return { accessToken, refreshToken };
    }
    omitPassword(doc) {
        const { password: _password, ...rest } = doc;
        return rest;
    }
    async register(data) {
        const existing = await User_1.default.findOne({ email: data.email });
        if (existing) {
            throw new appError_1.default('Email already registered', 409);
        }
        const user = await User_1.default.create({
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            address: data.address,
            provider: 'local',
            role: 'customer'
        });
        const tokens = this.buildTokens(user);
        const sanitized = this.omitPassword(user.toObject());
        return { user: sanitized, ...tokens };
    }
    async login(email, password) {
        const user = await User_1.default.findOne({ email }).select('+password');
        if (user) {
            const valid = await user.comparePassword(password);
            if (!valid) {
                throw new appError_1.default('Invalid credentials', 401);
            }
            const tokens = this.buildTokens(user);
            const sanitized = this.omitPassword(user.toObject());
            return { user: sanitized, ...tokens };
        }
        const admin = await Admin_1.default.findOne({ email }).select('+password');
        if (!admin) {
            throw new appError_1.default('Account not found', 404);
        }
        const valid = await admin.comparePassword(password);
        if (!valid) {
            throw new appError_1.default('Invalid credentials', 401);
        }
        const tokens = this.buildTokens(admin);
        const sanitized = this.omitPassword(admin.toObject());
        return { user: sanitized, ...tokens };
    }
    refresh(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, env_1.default.jwt.refreshSecret);
            const accessToken = this.signToken(payload, env_1.default.jwt.expiresIn, env_1.default.jwt.secret);
            return { accessToken };
        }
        catch (error) {
            throw new appError_1.default('Invalid refresh token', 401);
        }
    }
    async requestPasswordReset(email) {
        const user = await User_1.default.findOne({ email });
        const admin = user ? null : await Admin_1.default.findOne({ email });
        if (!user && !admin) {
            throw new appError_1.default('Email không tồn tại', 404);
        }
        const rawToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashed = crypto_1.default.createHash('sha256').update(rawToken).digest('hex');
        await PasswordResetToken_1.default.create({
            email,
            token: hashed,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000)
        });
        await mail_service_1.default.sendPasswordReset(email, rawToken);
    }
    async resetPassword(email, token, newPassword) {
        const hashed = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const resetToken = await PasswordResetToken_1.default.findOne({
            email,
            token: hashed,
            used: false,
            expiresAt: { $gt: new Date() }
        });
        if (!resetToken) {
            throw new appError_1.default('Token không hợp lệ hoặc đã hết hạn', 400);
        }
        const user = await User_1.default.findOne({ email }).select('+password');
        if (user) {
            user.password = newPassword;
            await user.save();
        }
        else {
            const admin = await Admin_1.default.findOne({ email }).select('+password');
            if (!admin) {
                throw new appError_1.default('Tài khoản không tồn tại', 404);
            }
            admin.password = newPassword;
            await admin.save();
        }
        resetToken.used = true;
        await resetToken.save();
    }
}
exports.default = new AuthService();
//# sourceMappingURL=auth.service.js.map
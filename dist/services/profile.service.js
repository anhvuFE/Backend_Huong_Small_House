"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const Admin_1 = __importDefault(require("../models/Admin"));
const appError_1 = __importDefault(require("../utils/appError"));
class ProfileService {
    async getProfile(userId) {
        return User_1.default.findById(userId).select('-password');
    }
    async updateProfile(userId, payload) {
        const safePayload = { ...payload };
        delete safePayload.role;
        delete safePayload.status;
        delete safePayload.provider;
        delete safePayload.userId;
        const user = await User_1.default.findByIdAndUpdate(userId, safePayload, { new: true }).select('-password');
        if (!user) {
            throw new appError_1.default('User not found', 404);
        }
        return user;
    }
    async changePassword(userId, currentPassword, newPassword) {
        let account = await User_1.default.findById(userId).select('+password');
        if (!account) {
            account = await Admin_1.default.findById(userId).select('+password');
        }
        if (!account) {
            throw new appError_1.default('User not found', 404);
        }
        const match = await account.comparePassword(currentPassword);
        if (!match) {
            throw new appError_1.default('Mật khẩu hiện tại không đúng', 400);
        }
        account.password = newPassword;
        await account.save();
    }
}
exports.default = new ProfileService();
//# sourceMappingURL=profile.service.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const appError_1 = __importDefault(require("../utils/appError"));
class UserService {
    async listUsers(query) {
        const conditions = {};
        if (query.status) {
            conditions.status = query.status;
        }
        if (query.keyword) {
            const regex = new RegExp(query.keyword, 'i');
            conditions.$or = [{ name: regex }, { email: regex }, { phone: regex }];
        }
        return User_1.default.find(conditions).select('-password').sort({ createdAt: -1 }).exec();
    }
    async getByUserId(userId) {
        const user = await User_1.default.findOne({ userId }).select('-password').exec();
        if (!user) {
            throw new appError_1.default('User not found', 404);
        }
        return user;
    }
    async updateStatus(userId, status) {
        const user = await User_1.default.findOneAndUpdate({ userId }, { status, lockedAt: status === 'locked' ? new Date() : null }, { new: true })
            .select('-password')
            .exec();
        if (!user) {
            throw new appError_1.default('User not found', 404);
        }
        return user;
    }
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map
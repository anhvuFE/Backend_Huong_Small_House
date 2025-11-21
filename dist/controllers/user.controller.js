"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlockUser = exports.lockUser = exports.getUserById = exports.listUsers = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const user_service_1 = __importDefault(require("../services/user.service"));
const parseUserId = (raw) => {
    const userId = Number(raw);
    if (Number.isNaN(userId)) {
        throw new appError_1.default('UserId không hợp lệ', 400);
    }
    return userId;
};
const listUsers = async (req, res) => {
    const users = await user_service_1.default.listUsers({
        status: req.query.status,
        keyword: req.query.q || undefined
    });
    res.json({ success: true, data: users });
};
exports.listUsers = listUsers;
const getUserById = async (req, res) => {
    const userId = parseUserId(req.params.userId);
    const user = await user_service_1.default.getByUserId(userId);
    res.json({ success: true, data: user });
};
exports.getUserById = getUserById;
const lockUser = async (req, res) => {
    const userId = parseUserId(req.params.userId);
    const user = await user_service_1.default.updateStatus(userId, 'locked');
    res.json({ success: true, data: user });
};
exports.lockUser = lockUser;
const unlockUser = async (req, res) => {
    const userId = parseUserId(req.params.userId);
    const user = await user_service_1.default.updateStatus(userId, 'active');
    res.json({ success: true, data: user });
};
exports.unlockUser = unlockUser;
//# sourceMappingURL=user.controller.js.map
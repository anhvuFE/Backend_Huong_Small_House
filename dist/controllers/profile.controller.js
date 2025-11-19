"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getProfile = void 0;
const profile_service_1 = __importDefault(require("../services/profile.service"));
const getProfile = async (req, res) => {
    const profile = await profile_service_1.default.getProfile(req.user.id);
    res.json({ success: true, data: profile });
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    const profile = await profile_service_1.default.updateProfile(req.user.id, req.body);
    res.json({ success: true, data: profile });
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    await profile_service_1.default.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
    res.json({ success: true, message: 'Đã cập nhật mật khẩu' });
};
exports.changePassword = changePassword;
//# sourceMappingURL=profile.controller.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.refresh = exports.login = exports.register = void 0;
const auth_service_1 = __importDefault(require("../services/auth.service"));
const profile_service_1 = __importDefault(require("../services/profile.service"));
const setRefreshCookie = (res, refreshToken) => {
    const secure = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: secure ? 'none' : 'lax',
        secure,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};
const register = async (req, res) => {
    const result = await auth_service_1.default.register(req.body);
    setRefreshCookie(res, result.refreshToken);
    res.status(201).json({ success: true, data: result });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const result = await auth_service_1.default.login(email, password);
    setRefreshCookie(res, result.refreshToken);
    res.json({ success: true, data: result });
};
exports.login = login;
const refresh = async (req, res) => {
    const bodyRefreshToken = req.body.refreshToken;
    const cookieRefreshToken = req.cookies?.refreshToken;
    const refreshToken = bodyRefreshToken || cookieRefreshToken;
    if (!refreshToken) {
        res.status(401).json({ success: false, message: 'Missing refresh token' });
        return;
    }
    const result = auth_service_1.default.refresh(refreshToken);
    setRefreshCookie(res, refreshToken);
    res.json({ success: true, data: result });
};
exports.refresh = refresh;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    await auth_service_1.default.requestPasswordReset(email);
    res.json({ success: true, message: 'Đã gửi email đặt lại mật khẩu' });
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    const { email, token, password } = req.body;
    await auth_service_1.default.resetPassword(email, token, password);
    res.json({ success: true, message: 'Đặt lại mật khẩu thành công' });
};
exports.resetPassword = resetPassword;
const changePassword = async (req, res) => {
    await profile_service_1.default.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
    res.json({ success: true, message: 'Đã cập nhật mật khẩu' });
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map
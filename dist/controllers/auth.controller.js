"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.refresh = exports.login = exports.register = void 0;
const auth_service_1 = __importDefault(require("../services/auth.service"));
const register = async (req, res) => {
    const result = await auth_service_1.default.register(req.body);
    res.status(201).json({ success: true, data: result });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const result = await auth_service_1.default.login(email, password);
    res.json({ success: true, data: result });
};
exports.login = login;
const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    const result = auth_service_1.default.refresh(refreshToken);
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
//# sourceMappingURL=auth.controller.js.map
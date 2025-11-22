"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const auth_controller_1 = require("../controllers/auth.controller");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const registerSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    phone: joi_1.default.string().optional(),
    address: joi_1.default.string().optional()
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required()
});
const forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required()
});
const resetPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    token: joi_1.default.string().required(),
    password: joi_1.default.string().min(6).required()
});
const changePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().min(6).required()
});
router.post('/register', (0, validate_1.validate)(registerSchema), auth_controller_1.register);
router.post('/login', (0, validate_1.validate)(loginSchema), auth_controller_1.login);
router.post('/refresh', auth_controller_1.refresh);
router.post('/forgot-password', (0, validate_1.validate)(forgotPasswordSchema), auth_controller_1.forgotPassword);
router.post('/reset-password', (0, validate_1.validate)(resetPasswordSchema), auth_controller_1.resetPassword);
router.put('/change-password', auth_1.authenticate, (0, validate_1.validate)(changePasswordSchema), auth_controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map
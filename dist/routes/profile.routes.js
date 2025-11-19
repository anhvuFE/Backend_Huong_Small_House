"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const profile_controller_1 = require("../controllers/profile.controller");
const router = (0, express_1.Router)();
const updateProfileSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    phone: joi_1.default.string().optional(),
    address: joi_1.default.string().optional()
});
const changePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().min(6).required()
});
router.get('/', auth_1.authenticate, profile_controller_1.getProfile);
router.put('/', auth_1.authenticate, (0, validate_1.validate)(updateProfileSchema), profile_controller_1.updateProfile);
router.put('/password', auth_1.authenticate, (0, validate_1.validate)(changePasswordSchema), profile_controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=profile.routes.js.map
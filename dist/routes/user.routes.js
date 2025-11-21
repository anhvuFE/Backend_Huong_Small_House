"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), user_controller_1.listUsers);
router.get('/:userId', auth_1.authenticate, (0, auth_1.authorize)('admin'), user_controller_1.getUserById);
router.patch('/:userId/lock', auth_1.authenticate, (0, auth_1.authorize)('admin'), user_controller_1.lockUser);
router.patch('/:userId/unlock', auth_1.authenticate, (0, auth_1.authorize)('admin'), user_controller_1.unlockUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map
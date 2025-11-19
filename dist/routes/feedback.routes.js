"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const feedback_controller_1 = require("../controllers/feedback.controller");
const router = (0, express_1.Router)();
router.post('/', auth_1.optionalAuth, feedback_controller_1.createFeedback);
router.get('/me', auth_1.authenticate, feedback_controller_1.listMyFeedback);
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), feedback_controller_1.listFeedback);
router.get('/:feedbackId', auth_1.authenticate, feedback_controller_1.getFeedbackDetail);
router.patch('/:feedbackId/status', auth_1.authenticate, (0, auth_1.authorize)('admin'), feedback_controller_1.updateFeedbackStatus);
router.post('/:feedbackId/respond', auth_1.authenticate, (0, auth_1.authorize)('admin'), feedback_controller_1.respondFeedback);
exports.default = router;
//# sourceMappingURL=feedback.routes.js.map
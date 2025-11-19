"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const consultation_controller_1 = require("../controllers/consultation.controller");
const router = (0, express_1.Router)();
router.post('/', auth_1.optionalAuth, consultation_controller_1.createConsultation);
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), consultation_controller_1.listConsultations);
router.get('/me', auth_1.authenticate, consultation_controller_1.listMyConsultations);
router.get('/:consultationId', auth_1.authenticate, consultation_controller_1.getConsultationDetail);
router.post('/:consultationId/messages', auth_1.authenticate, consultation_controller_1.userSendMessage);
router.post('/:consultationId/admin/messages', auth_1.authenticate, (0, auth_1.authorize)('admin'), consultation_controller_1.adminSendMessage);
router.post('/:consultationId/close', auth_1.authenticate, (0, auth_1.authorize)('admin'), consultation_controller_1.closeConsultation);
exports.default = router;
//# sourceMappingURL=consultation.routes.js.map
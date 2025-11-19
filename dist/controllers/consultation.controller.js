"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConsultation = exports.adminSendMessage = exports.userSendMessage = exports.getConsultationDetail = exports.listMyConsultations = exports.listConsultations = exports.createConsultation = void 0;
const consultation_service_1 = __importDefault(require("../services/consultation.service"));
const appError_1 = __importDefault(require("../utils/appError"));
const createConsultation = async (req, res) => {
    const payload = {
        userId: req.user?.id,
        name: req.body.name,
        email: req.body.email,
        topic: req.body.topic,
        message: req.body.message
    };
    if (!payload.name || !payload.email || !payload.topic || !payload.message) {
        throw new appError_1.default('Thiếu thông tin tư vấn', 400);
    }
    const consultation = await consultation_service_1.default.create(payload);
    res.status(201).json({ success: true, data: consultation });
};
exports.createConsultation = createConsultation;
const listConsultations = async (_req, res) => {
    const consultations = await consultation_service_1.default.listAll();
    res.json({ success: true, data: consultations });
};
exports.listConsultations = listConsultations;
const listMyConsultations = async (req, res) => {
    const consultations = await consultation_service_1.default.listByUser(req.user.id);
    res.json({ success: true, data: consultations });
};
exports.listMyConsultations = listMyConsultations;
const getConsultationDetail = async (req, res) => {
    const { consultationId } = req.params;
    const consultation = await consultation_service_1.default.getById(consultationId);
    if (!consultation) {
        throw new appError_1.default('Consultation not found', 404);
    }
    if (req.user?.role !== 'admin' && consultation.user?.toString() !== req.user?.id) {
        throw new appError_1.default('Forbidden', 403);
    }
    res.json({ success: true, data: consultation });
};
exports.getConsultationDetail = getConsultationDetail;
const userSendMessage = async (req, res) => {
    const { consultationId } = req.params;
    const consultation = await consultation_service_1.default.getById(consultationId);
    if (!consultation) {
        throw new appError_1.default('Consultation not found', 404);
    }
    if (consultation.user?.toString() !== req.user?.id) {
        throw new appError_1.default('Forbidden', 403);
    }
    const updated = await consultation_service_1.default.userMessage(consultationId, req.body.message);
    res.json({ success: true, data: updated });
};
exports.userSendMessage = userSendMessage;
const adminSendMessage = async (req, res) => {
    const { consultationId } = req.params;
    const updated = await consultation_service_1.default.adminMessage(consultationId, req.body.message);
    res.json({ success: true, data: updated });
};
exports.adminSendMessage = adminSendMessage;
const closeConsultation = async (req, res) => {
    const { consultationId } = req.params;
    const updated = await consultation_service_1.default.closeConsultation(consultationId);
    res.json({ success: true, data: updated });
};
exports.closeConsultation = closeConsultation;
//# sourceMappingURL=consultation.controller.js.map
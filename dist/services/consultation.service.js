"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Consultation_1 = __importDefault(require("../models/Consultation"));
const appError_1 = __importDefault(require("../utils/appError"));
class ConsultationService {
    create(payload) {
        return Consultation_1.default.create({
            user: payload.userId,
            name: payload.name,
            email: payload.email,
            topic: payload.topic,
            messages: [
                {
                    sender: 'user',
                    content: payload.message,
                    createdAt: new Date()
                }
            ]
        });
    }
    listAll() {
        return Consultation_1.default.find().populate('user', 'name email').sort({ updatedAt: -1 }).exec();
    }
    listByUser(userId) {
        return Consultation_1.default.find({ user: userId }).sort({ updatedAt: -1 }).exec();
    }
    async getById(id) {
        return Consultation_1.default.findById(id).populate('user', 'name email').exec();
    }
    async addMessage(id, sender, content) {
        const consultation = await Consultation_1.default.findById(id);
        if (!consultation) {
            throw new appError_1.default('Consultation not found', 404);
        }
        consultation.messages.push({ sender, content, createdAt: new Date() });
        await consultation.save();
        return consultation;
    }
    userMessage(id, content) {
        return this.addMessage(id, 'user', content);
    }
    adminMessage(id, content) {
        return this.addMessage(id, 'admin', content);
    }
    async closeConsultation(id) {
        const consultation = await Consultation_1.default.findByIdAndUpdate(id, { status: 'closed' }, { new: true });
        if (!consultation) {
            throw new appError_1.default('Consultation not found', 404);
        }
        return consultation;
    }
}
exports.default = new ConsultationService();
//# sourceMappingURL=consultation.service.js.map
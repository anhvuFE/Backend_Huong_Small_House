import { IConsultation } from '../models/Consultation';
interface CreateConsultationPayload {
    userId?: string;
    name: string;
    email: string;
    topic: string;
    message: string;
}
declare class ConsultationService {
    create(payload: CreateConsultationPayload): Promise<IConsultation>;
    listAll(): Promise<IConsultation[]>;
    listByUser(userId: string): Promise<IConsultation[]>;
    getById(id: string): Promise<IConsultation | null>;
    private addMessage;
    userMessage(id: string, content: string): Promise<IConsultation>;
    adminMessage(id: string, content: string): Promise<IConsultation>;
    closeConsultation(id: string): Promise<IConsultation>;
}
declare const _default: ConsultationService;
export default _default;
//# sourceMappingURL=consultation.service.d.ts.map
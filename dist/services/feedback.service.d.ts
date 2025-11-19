import { IFeedback } from '../models/Feedback';
interface FeedbackPayload {
    userId?: string;
    name?: string;
    email: string;
    orderId?: number;
    productId?: number;
    message: string;
}
declare class FeedbackService {
    create(payload: FeedbackPayload): Promise<IFeedback>;
    listAll(): Promise<IFeedback[]>;
    listByUser(userId: string): Promise<IFeedback[]>;
    getById(id: string): Promise<IFeedback | null>;
    updateStatus(id: string, status: IFeedback['status']): Promise<IFeedback>;
    respond(id: string, response: string): Promise<IFeedback>;
}
declare const _default: FeedbackService;
export default _default;
//# sourceMappingURL=feedback.service.d.ts.map
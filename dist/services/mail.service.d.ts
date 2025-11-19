import { IOrder } from '../models/Order';
declare class MailService {
    sendOrderConfirmation(order: IOrder): Promise<void>;
    sendPasswordReset(email: string, token: string): Promise<void>;
}
declare const _default: MailService;
export default _default;
//# sourceMappingURL=mail.service.d.ts.map
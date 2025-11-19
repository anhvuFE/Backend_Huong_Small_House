declare class PaymentService {
    createSepayCheckout(orderId: number): Promise<{
        checkoutUrl: string;
    }>;
    handleCallback(payload: Record<string, unknown>): Promise<void>;
}
declare const _default: PaymentService;
export default _default;
//# sourceMappingURL=payment.service.d.ts.map
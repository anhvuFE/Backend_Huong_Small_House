import { IPromotion } from '../models/Promotion';
declare class PromotionService {
    list(): Promise<IPromotion[]>;
    create(payload: Partial<IPromotion>): Promise<IPromotion>;
    validate(code: string): Promise<IPromotion>;
}
declare const _default: PromotionService;
export default _default;
//# sourceMappingURL=promotion.service.d.ts.map
import { IReview } from '../models/Review';
declare class ReviewService {
    list(productId: number): Promise<IReview[]>;
    create(payload: {
        productId: number;
        user: string;
        rating: number;
        comment?: string;
    }): Promise<IReview>;
}
declare const _default: ReviewService;
export default _default;
//# sourceMappingURL=review.service.d.ts.map
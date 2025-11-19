import { Document, Types } from 'mongoose';
export interface IReview extends Document {
    productId: number;
    user: Types.ObjectId;
    rating: number;
    comment?: string;
}
declare const Review: import("mongoose").Model<IReview, {}, {}, {}, Document<unknown, {}, IReview, {}, {}> & IReview & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Review;
//# sourceMappingURL=Review.d.ts.map
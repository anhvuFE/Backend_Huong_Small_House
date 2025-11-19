import { Document } from 'mongoose';
export interface IPromotion extends Document {
    code: string;
    type: 'percent' | 'fixed';
    value: number;
    validUntil: Date;
    usageLimit: number;
    usedCount: number;
}
declare const Promotion: import("mongoose").Model<IPromotion, {}, {}, {}, Document<unknown, {}, IPromotion, {}, {}> & IPromotion & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Promotion;
//# sourceMappingURL=Promotion.d.ts.map
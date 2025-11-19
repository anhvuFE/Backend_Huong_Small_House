import { Document, Types } from 'mongoose';
export interface IFeedback extends Document {
    user?: Types.ObjectId;
    name?: string;
    email: string;
    orderId?: number;
    productId?: number;
    message: string;
    status: 'open' | 'in_progress' | 'resolved';
    response?: string;
}
declare const Feedback: import("mongoose").Model<IFeedback, {}, {}, {}, Document<unknown, {}, IFeedback, {}, {}> & IFeedback & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Feedback;
//# sourceMappingURL=Feedback.d.ts.map
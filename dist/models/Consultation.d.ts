import { Document, Types } from 'mongoose';
export interface IConsultationMessage {
    sender: 'user' | 'admin';
    content: string;
    createdAt: Date;
}
export interface IConsultation extends Document {
    user?: Types.ObjectId;
    name: string;
    email: string;
    topic: string;
    status: 'open' | 'closed';
    messages: IConsultationMessage[];
}
declare const Consultation: import("mongoose").Model<IConsultation, {}, {}, {}, Document<unknown, {}, IConsultation, {}, {}> & IConsultation & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Consultation;
//# sourceMappingURL=Consultation.d.ts.map
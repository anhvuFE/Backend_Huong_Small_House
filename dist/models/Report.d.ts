import { Document } from 'mongoose';
export interface IReport extends Document {
    date: string;
    totalOrders: number;
    totalRevenue: number;
    bestSeller: string;
}
declare const Report: import("mongoose").Model<IReport, {}, {}, {}, Document<unknown, {}, IReport, {}, {}> & IReport & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Report;
//# sourceMappingURL=Report.d.ts.map
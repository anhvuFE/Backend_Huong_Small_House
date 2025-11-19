import { Document } from 'mongoose';
export interface IGuest extends Document {
    name: string;
    email: string;
    phone: string;
    address: string;
}
declare const Guest: import("mongoose").Model<IGuest, {}, {}, {}, Document<unknown, {}, IGuest, {}, {}> & IGuest & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Guest;
//# sourceMappingURL=Guest.d.ts.map
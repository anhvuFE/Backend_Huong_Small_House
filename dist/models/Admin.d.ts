import { Document } from 'mongoose';
export interface IAdmin extends Document {
    email: string;
    password: string;
    role: 'admin';
    comparePassword(password: string): Promise<boolean>;
}
declare const Admin: import("mongoose").Model<IAdmin, {}, {}, {}, Document<unknown, {}, IAdmin, {}, {}> & IAdmin & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Admin;
//# sourceMappingURL=Admin.d.ts.map
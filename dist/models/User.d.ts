import { Document } from 'mongoose';
export interface IUser extends Document {
    userId: number;
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    provider: 'local' | 'google';
    role: 'customer' | 'admin';
    status: 'active' | 'locked';
    lockedAt?: Date;
    comparePassword(password: string): Promise<boolean>;
}
declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=User.d.ts.map
import { Document } from 'mongoose';
export interface IPasswordResetToken extends Document {
    email: string;
    token: string;
    expiresAt: Date;
    used: boolean;
}
declare const PasswordResetToken: import("mongoose").Model<IPasswordResetToken, {}, {}, {}, Document<unknown, {}, IPasswordResetToken, {}, {}> & IPasswordResetToken & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default PasswordResetToken;
//# sourceMappingURL=PasswordResetToken.d.ts.map
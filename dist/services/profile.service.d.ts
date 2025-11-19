import { IUser } from '../models/User';
declare class ProfileService {
    getProfile(userId: string): Promise<IUser | null>;
    updateProfile(userId: string, payload: Partial<IUser>): Promise<IUser>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
}
declare const _default: ProfileService;
export default _default;
//# sourceMappingURL=profile.service.d.ts.map
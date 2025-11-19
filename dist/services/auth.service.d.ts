import { IUser } from '../models/User';
import { IAdmin } from '../models/Admin';
export interface AuthResult {
    user: Partial<IUser> | Partial<IAdmin>;
    accessToken: string;
    refreshToken: string;
}
declare class AuthService {
    private signToken;
    private buildTokens;
    private omitPassword;
    register(data: Partial<IUser>): Promise<AuthResult>;
    login(email: string, password: string): Promise<AuthResult>;
    refresh(token: string): {
        accessToken: string;
    };
    requestPasswordReset(email: string): Promise<void>;
    resetPassword(email: string, token: string, newPassword: string): Promise<void>;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map
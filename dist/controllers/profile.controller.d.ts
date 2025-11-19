import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
export declare const getProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const changePassword: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=profile.controller.d.ts.map
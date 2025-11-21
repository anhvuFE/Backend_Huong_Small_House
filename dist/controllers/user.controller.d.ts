import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
export declare const listUsers: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUserById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const lockUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const unlockUser: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map
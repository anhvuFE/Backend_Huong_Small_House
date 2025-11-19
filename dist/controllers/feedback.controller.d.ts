import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
export declare const createFeedback: (req: AuthRequest, res: Response) => Promise<void>;
export declare const listMyFeedback: (req: AuthRequest, res: Response) => Promise<void>;
export declare const listFeedback: (_req: AuthRequest, res: Response) => Promise<void>;
export declare const getFeedbackDetail: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateFeedbackStatus: (req: AuthRequest, res: Response) => Promise<void>;
export declare const respondFeedback: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=feedback.controller.d.ts.map
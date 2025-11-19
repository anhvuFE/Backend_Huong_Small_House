import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
export declare const createConsultation: (req: AuthRequest, res: Response) => Promise<void>;
export declare const listConsultations: (_req: AuthRequest, res: Response) => Promise<void>;
export declare const listMyConsultations: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getConsultationDetail: (req: AuthRequest, res: Response) => Promise<void>;
export declare const userSendMessage: (req: AuthRequest, res: Response) => Promise<void>;
export declare const adminSendMessage: (req: AuthRequest, res: Response) => Promise<void>;
export declare const closeConsultation: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=consultation.controller.d.ts.map
import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
export declare const createOrder: (req: AuthRequest, res: Response) => Promise<void>;
export declare const listOrders: (_req: Request, res: Response) => Promise<void>;
export declare const listMyOrders: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getOrderDetail: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateOrderStatus: (req: Request, res: Response) => Promise<void>;
export declare const createSepayCheckout: (req: Request, res: Response) => Promise<void>;
export declare const sepayCallback: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=order.controller.d.ts.map
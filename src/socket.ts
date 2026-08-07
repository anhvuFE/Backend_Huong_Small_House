import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import env from './config/env';
import logger from './utils/logger';

let io: Server | null = null;

const ADMIN_ROOM = 'admin';
const userRoom = (userId: string) => `user:${userId}`;
const consultationRoom = (id: string) => `consultation:${id}`;

/**
 * Khởi tạo Socket.IO. Xác thực JWT ở handshake (không bắt buộc — cho phép
 * khách kết nối). Admin vào room 'admin'; user vào room riêng theo id.
 */
export function initSocket(httpServer: HttpServer): void {
  io = new Server(httpServer, {
    cors: {
      origin: env.nodeEnv === 'production' ? ['https://smallhouse.vn'] : true,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (token) {
      try {
        const payload = jwt.verify(token, env.jwt.secret as jwt.Secret) as { id: string; role: string };
        if (payload.role === 'admin') socket.join(ADMIN_ROOM);
        socket.join(userRoom(payload.id));
      } catch {
        /* token hỏng -> vẫn cho kết nối như khách */
      }
    }

    // Tham gia phòng của 1 phiên tư vấn để nhận tin nhắn real-time.
    socket.on('consultation:join', (consultationId: string) => {
      if (typeof consultationId === 'string' && consultationId) {
        socket.join(consultationRoom(consultationId));
      }
    });
    socket.on('consultation:leave', (consultationId: string) => {
      socket.leave(consultationRoom(consultationId));
    });
  });

  logger.info('Socket.IO initialized');
}

export function emitToAdmin(event: string, payload: unknown): void {
  io?.to(ADMIN_ROOM).emit(event, payload);
}

export function emitToUser(userId: string, event: string, payload: unknown): void {
  io?.to(userRoom(userId)).emit(event, payload);
}

export function emitToConsultation(consultationId: string, event: string, payload: unknown): void {
  io?.to(consultationRoom(consultationId)).emit(event, payload);
}

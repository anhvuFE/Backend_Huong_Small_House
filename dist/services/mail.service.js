"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("../config/mail"));
const env_1 = __importDefault(require("../config/env"));
class MailService {
    async sendOrderConfirmation(order) {
        const html = `
      <h1>Xin chào ${order.email}</h1>
      <p>Cảm ơn bạn đã đặt hàng tại Small House.</p>
      <p>Mã đơn hàng: <strong>#${order.orderId}</strong></p>
      <ul>
        ${order.items.map((item) => `<li>${item.name} x ${item.quantity}</li>`).join('')}
      </ul>
      <p>Tổng tiền: ${order.total.toLocaleString('vi-VN')} đ</p>
    `;
        await mail_1.default.sendMail({
            to: order.email,
            from: env_1.default.smtp.from,
            subject: `Xác nhận đơn hàng #${order.orderId}`,
            html
        });
    }
    async sendPasswordReset(email, token) {
        const resetLink = `${process.env.FRONTEND_URL ?? 'https://smallhouse.vn'}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
        const html = `
      <p>Xin chào,</p>
      <p>Bạn hoặc ai đó đã yêu cầu đặt lại mật khẩu trên Small House.</p>
      <p>Nhấn vào liên kết để đặt lại mật khẩu (hiệu lực 30 phút):</p>
      <p><a href=\"${resetLink}\">${resetLink}</a></p>
      <p>Nếu bạn không yêu cầu hành động này, vui lòng bỏ qua email.</p>
    `;
        await mail_1.default.sendMail({
            to: email,
            from: env_1.default.smtp.from,
            subject: 'Đặt lại mật khẩu Small House',
            html
        });
    }
}
exports.default = new MailService();
//# sourceMappingURL=mail.service.js.map
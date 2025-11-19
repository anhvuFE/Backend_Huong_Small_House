"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = __importDefault(require("./env"));
const mailTransporter = nodemailer_1.default.createTransport({
    host: env_1.default.smtp.host,
    port: env_1.default.smtp.port,
    secure: env_1.default.smtp.port === 465,
    auth: {
        user: env_1.default.smtp.user,
        pass: env_1.default.smtp.pass
    }
});
exports.default = mailTransporter;
//# sourceMappingURL=mail.js.map
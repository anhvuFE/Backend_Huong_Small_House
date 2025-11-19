"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const passwordResetTokenSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false }
}, { timestamps: true });
const PasswordResetToken = (0, mongoose_1.model)('PasswordResetToken', passwordResetTokenSchema);
exports.default = PasswordResetToken;
//# sourceMappingURL=PasswordResetToken.js.map
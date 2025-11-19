"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const guestSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
}, { timestamps: true });
const Guest = (0, mongoose_1.model)('Guest', guestSchema);
exports.default = Guest;
//# sourceMappingURL=Guest.js.map
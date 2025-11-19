"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const counterSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
}, { versionKey: false });
const Counter = (0, mongoose_1.model)('Counter', counterSchema);
exports.default = Counter;
//# sourceMappingURL=Counter.js.map
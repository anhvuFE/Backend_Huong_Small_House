"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const autoIncrement_1 = require("../utils/autoIncrement");
const userSchema = new mongoose_1.Schema({
    userId: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: String,
    address: String,
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    status: { type: String, enum: ['active', 'locked'], default: 'active' },
    lockedAt: { type: Date, default: null }
}, { timestamps: true });
userSchema.pre('save', async function (next) {
    if (this.isNew && !this.userId) {
        this.userId = await (0, autoIncrement_1.getNextSequence)('users');
    }
    if (this.isModified('password')) {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
    }
    next();
});
userSchema.methods.comparePassword = async function (password) {
    return bcryptjs_1.default.compare(password, this.password);
};
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map
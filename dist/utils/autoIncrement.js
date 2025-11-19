"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextSequence = void 0;
const Counter_1 = __importDefault(require("../models/Counter"));
const getNextSequence = async (name) => {
    const counter = await Counter_1.default.findByIdAndUpdate(name, { $inc: { seq: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return counter.seq;
};
exports.getNextSequence = getNextSequence;
//# sourceMappingURL=autoIncrement.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const env_1 = __importDefault(require("./env"));
if (env_1.default.cloudinary.url) {
    cloudinary_1.v2.config(env_1.default.cloudinary.url);
}
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.js.map
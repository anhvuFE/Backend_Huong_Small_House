"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signSepayPayload = exports.sepayClient = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const env_1 = __importDefault(require("./env"));
exports.sepayClient = axios_1.default.create({
    baseURL: env_1.default.sepay.endpoint,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': env_1.default.sepay.apiKey
    }
});
const signSepayPayload = (payload) => {
    const raw = JSON.stringify(payload);
    return crypto_1.default.createHmac('sha256', env_1.default.sepay.secret).update(raw).digest('hex');
};
exports.signSepayPayload = signSepayPayload;
//# sourceMappingURL=sepay.js.map
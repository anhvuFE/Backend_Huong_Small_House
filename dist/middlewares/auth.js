"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const appError_1 = __importDefault(require("../utils/appError"));
const authenticate = (req, _res, next) => {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined;
    if (!token) {
        throw new appError_1.default('Unauthorized', 401);
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.default.jwt.secret);
        req.user = payload;
        next();
    }
    catch (error) {
        throw new appError_1.default('Invalid token', 401);
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        throw new appError_1.default('Forbidden', 403);
    }
    next();
};
exports.authorize = authorize;
const optionalAuth = (req, _res, next) => {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined;
    if (token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, env_1.default.jwt.secret);
            req.user = payload;
        }
        catch (error) {
            // ignore invalid token for optional auth
        }
    }
    next();
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const logger_1 = __importDefault(require("../utils/logger"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, _req, res, _next) => {
    const status = err instanceof appError_1.default ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';
    if (!(err instanceof appError_1.default)) {
        logger_1.default.error(err);
    }
    res.status(status).json({
        success: false,
        message
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map
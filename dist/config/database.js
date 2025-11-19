"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("./env"));
const logger_1 = __importDefault(require("../utils/logger"));
mongoose_1.default.set('strictQuery', true);
const connectDatabase = async () => {
    try {
        await mongoose_1.default.connect(env_1.default.mongoUri);
        logger_1.default.info('MongoDB connected');
    }
    catch (error) {
        logger_1.default.error('MongoDB connection failed: %s', error.message);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
exports.default = mongoose_1.default;
//# sourceMappingURL=database.js.map
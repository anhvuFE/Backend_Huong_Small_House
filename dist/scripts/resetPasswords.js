"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = __importDefault(require("../config/env"));
const logger_1 = __importDefault(require("../utils/logger"));
const User_1 = __importDefault(require("../models/User"));
const Admin_1 = __importDefault(require("../models/Admin"));
const resetPasswords = async () => {
    await mongoose_1.default.connect(env_1.default.mongoUri);
    logger_1.default.info('Connected to MongoDB');
    const plainPassword = '12345678';
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashed = await bcryptjs_1.default.hash(plainPassword, salt);
    const [userResult, adminResult] = await Promise.all([
        User_1.default.updateMany({}, { password: hashed }),
        Admin_1.default.updateMany({}, { password: hashed })
    ]);
    logger_1.default.info('Updated %d users and %d admins', userResult.modifiedCount, adminResult.modifiedCount);
    await mongoose_1.default.disconnect();
};
resetPasswords()
    .then(() => {
    logger_1.default.info('Password reset completed');
    process.exit(0);
})
    .catch((error) => {
    logger_1.default.error(error);
    process.exit(1);
});
//# sourceMappingURL=resetPasswords.js.map
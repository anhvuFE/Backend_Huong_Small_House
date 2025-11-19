"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const database_1 = require("./config/database");
const env_1 = __importDefault(require("./config/env"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const logger_1 = __importDefault(require("./utils/logger"));
const swagger_1 = __importDefault(require("./docs/swagger"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.default.nodeEnv === 'production' ? ['https://smallhouse.vn'] : true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api', routes_1.default);
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, { explorer: true }));
app.use(errorHandler_1.errorHandler);
const start = async () => {
    await (0, database_1.connectDatabase)();
    app.listen(env_1.default.port, () => logger_1.default.info(`Server listening on port ${env_1.default.port}`));
};
void start();
//# sourceMappingURL=index.js.map
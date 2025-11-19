"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const report_controller_1 = require("../controllers/report.controller");
const router = (0, express_1.Router)();
router.get('/daily/:date', auth_1.authenticate, (0, auth_1.authorize)('admin'), report_controller_1.getDailyReport);
router.get('/monthly/:year/:month', auth_1.authenticate, (0, auth_1.authorize)('admin'), report_controller_1.getMonthlyReport);
router.get('/yearly/:year', auth_1.authenticate, (0, auth_1.authorize)('admin'), report_controller_1.getYearlyReport);
router.get('/top-products', auth_1.authenticate, (0, auth_1.authorize)('admin'), report_controller_1.getTopProducts);
exports.default = router;
//# sourceMappingURL=report.routes.js.map
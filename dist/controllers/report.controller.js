"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopProducts = exports.getYearlyReport = exports.getMonthlyReport = exports.getDailyReport = void 0;
const report_service_1 = __importDefault(require("../services/report.service"));
const getDailyReport = async (req, res) => {
    const { date } = req.params;
    const report = await report_service_1.default.getDailyReport(date);
    res.json({ success: true, data: report });
};
exports.getDailyReport = getDailyReport;
const getMonthlyReport = async (req, res) => {
    const { year, month } = req.params;
    const report = await report_service_1.default.getMonthlyReport(Number(year), Number(month));
    res.json({ success: true, data: report });
};
exports.getMonthlyReport = getMonthlyReport;
const getYearlyReport = async (req, res) => {
    const { year } = req.params;
    const report = await report_service_1.default.getYearlyReport(Number(year));
    res.json({ success: true, data: report });
};
exports.getYearlyReport = getYearlyReport;
const getTopProducts = async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const report = await report_service_1.default.getTopProducts(limit);
    res.json({ success: true, data: report });
};
exports.getTopProducts = getTopProducts;
//# sourceMappingURL=report.controller.js.map
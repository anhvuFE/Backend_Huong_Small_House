"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = __importDefault(require("../models/Order"));
class ReportService {
    async calculateBestSeller(match) {
        const pipeline = await Order_1.default.aggregate([
            { $match: { status: 'delivered', ...match } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    totalSold: { $sum: '$items.quantity' },
                    name: { $first: '$items.name' }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 1 }
        ]);
        if (!pipeline.length) {
            return 'N/A';
        }
        const top = pipeline[0];
        return top.name ? `${top.name} (#${top._id})` : `Product #${top._id}`;
    }
    async getDailyReport(date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        const match = { createdAt: { $gte: start, $lte: end }, status: 'delivered' };
        const orders = await Order_1.default.find(match).exec();
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const bestSeller = await this.calculateBestSeller({ createdAt: { $gte: start, $lte: end } });
        return { totalOrders, totalRevenue, bestSeller };
    }
    async getMonthlyReport(year, month) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);
        end.setHours(23, 59, 59, 999);
        const match = { createdAt: { $gte: start, $lte: end }, status: 'delivered' };
        const orders = await Order_1.default.find(match).exec();
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const bestSeller = await this.calculateBestSeller({ createdAt: { $gte: start, $lte: end } });
        const dailyBreakdown = await Order_1.default.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$total' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        const breakdown = dailyBreakdown.map((entry) => ({
            date: entry._id,
            totalOrders: entry.totalOrders,
            totalRevenue: entry.totalRevenue
        }));
        return { totalOrders, totalRevenue, bestSeller, dailyBreakdown: breakdown };
    }
    async getYearlyReport(year) {
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31, 23, 59, 59, 999);
        const match = { createdAt: { $gte: start, $lte: end }, status: 'delivered' };
        const orders = await Order_1.default.find(match).exec();
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const bestSeller = await this.calculateBestSeller({ createdAt: { $gte: start, $lte: end } });
        const monthlyBreakdownAgg = await Order_1.default.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$total' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        const monthlyBreakdown = monthlyBreakdownAgg.map((entry) => ({
            month: entry._id,
            totalOrders: entry.totalOrders,
            totalRevenue: entry.totalRevenue
        }));
        return { totalOrders, totalRevenue, bestSeller, monthlyBreakdown };
    }
    async getTopProducts(limit) {
        const pipeline = await Order_1.default.aggregate([
            { $match: { status: 'delivered' } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    name: { $first: '$items.name' },
                    totalSold: { $sum: '$items.quantity' }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: limit }
        ]);
        const products = pipeline.map((item) => ({
            productId: item._id,
            name: item.name ?? `Product #${item._id}`,
            totalSold: item.totalSold
        }));
        return { products };
    }
}
exports.default = new ReportService();
//# sourceMappingURL=report.service.js.map
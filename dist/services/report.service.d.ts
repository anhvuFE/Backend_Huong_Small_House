interface DailyReport {
    totalOrders: number;
    totalRevenue: number;
    bestSeller: string;
}
interface DailyBreakdownEntry {
    date: string;
    totalOrders: number;
    totalRevenue: number;
}
interface MonthlyReport extends DailyReport {
    dailyBreakdown: DailyBreakdownEntry[];
}
interface MonthlyBreakdownEntry {
    month: string;
    totalOrders: number;
    totalRevenue: number;
}
interface YearlyReport extends DailyReport {
    monthlyBreakdown: MonthlyBreakdownEntry[];
}
interface TopProduct {
    productId: number;
    name: string;
    totalSold: number;
}
declare class ReportService {
    private calculateBestSeller;
    getDailyReport(date: string): Promise<DailyReport>;
    getMonthlyReport(year: number, month: number): Promise<MonthlyReport>;
    getYearlyReport(year: number): Promise<YearlyReport>;
    getTopProducts(limit: number): Promise<{
        products: TopProduct[];
    }>;
}
declare const _default: ReportService;
export default _default;
//# sourceMappingURL=report.service.d.ts.map
import Order from '../models/Order';
import User from '../models/User';

interface DateRange {
  start: Date;
  end: Date;
}

interface UserStats {
  totalUsers: number;
  newUsers: number;
  lockedUsers: number;
  activeCustomers: number;
}

interface TopCustomer {
  userId: number;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
}

interface DailyReport {
  totalOrders: number;
  totalRevenue: number;
  bestSeller: string;
  userStats: UserStats;
  topCustomers: TopCustomer[];
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

class ReportService {
  private async calculateBestSeller(match: Record<string, unknown>): Promise<string> {
    const pipeline = await Order.aggregate([
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

  private async buildUserStats(range: DateRange): Promise<UserStats> {
    const [{ totalUsers, lockedUsers }, newUsers, activeCustomersAgg] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            lockedUsers: { $sum: { $cond: [{ $eq: ['$status', 'locked'] }, 1, 0] } }
          }
        }
      ]).then((result) => ({
        totalUsers: result[0]?.totalUsers ?? 0,
        lockedUsers: result[0]?.lockedUsers ?? 0
      })),
      User.countDocuments({ createdAt: { $gte: range.start, $lte: range.end } }),
      Order.aggregate([
        {
          $match: {
            status: 'delivered',
            user: { $ne: null },
            createdAt: { $gte: range.start, $lte: range.end }
          }
        },
        { $group: { _id: '$user' } }
      ])
    ]);

    return {
      totalUsers,
      lockedUsers,
      newUsers,
      activeCustomers: activeCustomersAgg.length
    };
  }

  private async getTopCustomers(range: DateRange, limit = 5): Promise<TopCustomer[]> {
    const pipeline = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          user: { $ne: null },
          createdAt: { $gte: range.start, $lte: range.end }
        }
      },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$total' },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$user.userId',
          name: '$user.name',
          email: '$user.email',
          totalOrders: 1,
          totalSpent: 1
        }
      }
    ]);

    return pipeline;
  }

  private async buildBaseReport(range: DateRange): Promise<DailyReport> {
    const match = { createdAt: { $gte: range.start, $lte: range.end }, status: 'delivered' };
    const orders = await Order.find(match).exec();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const bestSeller = await this.calculateBestSeller({ createdAt: { $gte: range.start, $lte: range.end } });
    const [userStats, topCustomers] = await Promise.all([
      this.buildUserStats(range),
      this.getTopCustomers(range)
    ]);

    return { totalOrders, totalRevenue, bestSeller, userStats, topCustomers };
  }

  async getDailyReport(date: string): Promise<DailyReport> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const base = await this.buildBaseReport({ start, end });
    return { ...base };
  }

  async getMonthlyReport(year: number, month: number): Promise<MonthlyReport> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    end.setHours(23, 59, 59, 999);

    const match = { createdAt: { $gte: start, $lte: end }, status: 'delivered' };
    const base = await this.buildBaseReport({ start, end });

    const dailyBreakdown = await Order.aggregate([
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

    const breakdown: DailyBreakdownEntry[] = dailyBreakdown.map((entry) => ({
      date: entry._id,
      totalOrders: entry.totalOrders,
      totalRevenue: entry.totalRevenue
    }));

    return { ...base, dailyBreakdown: breakdown };
  }

  async getYearlyReport(year: number): Promise<YearlyReport> {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);

    const match = { createdAt: { $gte: start, $lte: end }, status: 'delivered' };
    const base = await this.buildBaseReport({ start, end });

    const monthlyBreakdownAgg = await Order.aggregate([
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

    const monthlyBreakdown: MonthlyBreakdownEntry[] = monthlyBreakdownAgg.map((entry) => ({
      month: entry._id,
      totalOrders: entry.totalOrders,
      totalRevenue: entry.totalRevenue
    }));

    return { ...base, monthlyBreakdown };
  }

  async getTopProducts(limit: number): Promise<{ products: TopProduct[] }> {
    const pipeline = await Order.aggregate([
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

    const products: TopProduct[] = pipeline.map((item) => ({
      productId: item._id,
      name: item.name ?? `Product #${item._id}`,
      totalSold: item.totalSold
    }));

    return { products };
  }
}

export default new ReportService();

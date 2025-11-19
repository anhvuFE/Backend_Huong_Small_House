import { Request, Response } from 'express';
import reportService from '../services/report.service';

export const getDailyReport = async (req: Request, res: Response): Promise<void> => {
  const { date } = req.params as { date: string };
  const report = await reportService.getDailyReport(date);
  res.json({ success: true, data: report });
};

export const getMonthlyReport = async (req: Request, res: Response): Promise<void> => {
  const { year, month } = req.params as { year: string; month: string };
  const report = await reportService.getMonthlyReport(Number(year), Number(month));
  res.json({ success: true, data: report });
};

export const getYearlyReport = async (req: Request, res: Response): Promise<void> => {
  const { year } = req.params as { year: string };
  const report = await reportService.getYearlyReport(Number(year));
  res.json({ success: true, data: report });
};

export const getTopProducts = async (req: Request, res: Response): Promise<void> => {
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  const report = await reportService.getTopProducts(limit);
  res.json({ success: true, data: report });
};

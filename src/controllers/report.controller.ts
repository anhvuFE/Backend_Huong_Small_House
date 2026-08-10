import { Request, Response } from 'express';
import reportService from '../services/report.service';
import AppError from '../utils/appError';
import { parseNumericId } from '../utils/numericId';

export const getDailyReport = async (req: Request, res: Response): Promise<void> => {
  const { date } = req.params as { date: string };
  const report = await reportService.getDailyReport(date);
  res.json({ success: true, data: report });
};

export const getMonthlyReport = async (req: Request, res: Response): Promise<void> => {
  const { year, month } = req.params as { year: string; month: string };
  const y = parseNumericId(year, 'year');
  const m = Number(month);
  if (!Number.isInteger(m) || m < 1 || m > 12) {
    throw new AppError('Invalid month', 400);
  }
  const report = await reportService.getMonthlyReport(y, m);
  res.json({ success: true, data: report });
};

export const getYearlyReport = async (req: Request, res: Response): Promise<void> => {
  const { year } = req.params as { year: string };
  const report = await reportService.getYearlyReport(parseNumericId(year, 'year'));
  res.json({ success: true, data: report });
};

export const getTopProducts = async (req: Request, res: Response): Promise<void> => {
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  const report = await reportService.getTopProducts(limit);
  res.json({ success: true, data: report });
};

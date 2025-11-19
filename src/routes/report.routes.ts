import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { getDailyReport, getMonthlyReport, getTopProducts, getYearlyReport } from '../controllers/report.controller';

const router = Router();

router.get('/daily/:date', authenticate, authorize('admin'), getDailyReport);
router.get('/monthly/:year/:month', authenticate, authorize('admin'), getMonthlyReport);
router.get('/yearly/:year', authenticate, authorize('admin'), getYearlyReport);
router.get('/top-products', authenticate, authorize('admin'), getTopProducts);

export default router;

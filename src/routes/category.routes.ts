import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  createCategory,
  getCategory,
  listCategories,
  updateCategory,
  deleteCategory
} from '../controllers/product.controller';

// Category dưới dạng resource first-class ('/api/categories'). Dùng lại các
// controller sẵn có; giữ '/products/categories/*' để tương thích ngược.
const router = Router();

router.get('/', listCategories);
router.get('/all', listCategories);
router.post('/', authenticate, authorize('admin'), createCategory);
router.get('/:categoryId', getCategory);
router.put('/:categoryId', authenticate, authorize('admin'), updateCategory);
router.delete('/:categoryId', authenticate, authorize('admin'), deleteCategory);

export default router;

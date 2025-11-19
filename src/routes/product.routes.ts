import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  createCategory,
  createProduct,
  deleteProduct,
  getProduct,
  listCategories,
  listProducts,
  updateProduct
} from '../controllers/product.controller';

const router = Router();

router.get('/', listProducts);
router.get('/categories/all', listCategories);
router.post('/categories', authenticate, authorize('admin'), createCategory);
router.post('/', authenticate, authorize('admin'), createProduct);
router.get('/:productId', getProduct);
router.put('/:productId', authenticate, authorize('admin'), updateProduct);
router.delete('/:productId', authenticate, authorize('admin'), deleteProduct);

export default router;

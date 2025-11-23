import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  createCategory,
  createProduct,
  deleteProduct,
  getProduct,
  getCategory,
  listCategories,
  listProducts,
  updateProduct,
  updateCategory
} from '../controllers/product.controller';
import { uploadMultipleImages } from '../middlewares/upload';

const router = Router();

router.get('/', listProducts);
router.get('/categories/all', listCategories);
router.post('/categories', authenticate, authorize('admin'), createCategory);
router.get('/categories/:categoryId', getCategory);
router.put('/categories/:categoryId', authenticate, authorize('admin'), updateCategory);
router.post('/', authenticate, authorize('admin'), uploadMultipleImages('images', 6), createProduct);
router.get('/:productId', getProduct);
router.put(
  '/:productId',
  authenticate,
  authorize('admin'),
  uploadMultipleImages('images', 6),
  updateProduct
);
router.delete('/:productId', authenticate, authorize('admin'), deleteProduct);

export default router;

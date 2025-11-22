import { Router } from 'express';
import Joi from 'joi';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createBlog, deleteBlog, getBlog, listAllBlogs, listBlogs, updateBlog } from '../controllers/blog.controller';
import { uploadSingleImage } from '../middlewares/upload';

const router = Router();

const blogSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().optional(),
  content: Joi.string().required(),
  excerpt: Joi.string().optional(),
  thumbnail: Joi.string().uri().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  published: Joi.boolean().optional()
});

const updateBlogSchema = blogSchema.fork(['title', 'content'], (schema) => schema.optional());

router.get('/', listBlogs);
router.get('/all', authenticate, authorize('admin'), listAllBlogs);
router.get('/:blogId', getBlog);
router.post(
  '/',
  authenticate,
  authorize('admin'),
  uploadSingleImage('thumbnail'),
  validate(blogSchema),
  createBlog
);
router.put(
  '/:blogId',
  authenticate,
  authorize('admin'),
  uploadSingleImage('thumbnail'),
  validate(updateBlogSchema),
  updateBlog
);
router.delete('/:blogId', authenticate, authorize('admin'), deleteBlog);

export default router;

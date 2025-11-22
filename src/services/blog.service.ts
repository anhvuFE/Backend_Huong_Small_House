import Blog, { IBlog } from '../models/Blog';
import AppError from '../utils/appError';
import slugify from '../utils/slugify';

class BlogService {
  listBlogs(): Promise<IBlog[]> {
    return Blog.find({ published: true }).sort({ createdAt: -1 }).exec();
  }

  listAllBlogs(): Promise<IBlog[]> {
    return Blog.find().sort({ createdAt: -1 }).exec();
  }

  async getBlog(blogId: number): Promise<IBlog | null> {
    return Blog.findOne({ blogId }).exec();
  }

  async createBlog(payload: Partial<IBlog>): Promise<IBlog> {
    const slug = payload.slug || slugify(payload.title || '');
    if (!slug) {
      throw new AppError('Slug is required', 400);
    }
    const exists = await Blog.findOne({ slug }).exec();
    if (exists) {
      throw new AppError('Slug đã tồn tại', 409);
    }
    const blog = await Blog.create({ ...payload, slug });
    return blog;
  }

  async updateBlog(blogId: number, payload: Partial<IBlog>): Promise<IBlog> {
    const updatePayload = { ...payload };
    if (payload.title && !payload.slug) {
      updatePayload.slug = slugify(payload.title);
    }

    if (updatePayload.slug) {
      const exists = await Blog.findOne({ slug: updatePayload.slug, blogId: { $ne: blogId } }).exec();
      if (exists) {
        throw new AppError('Slug đã tồn tại', 409);
      }
    }

    const blog = await Blog.findOneAndUpdate({ blogId }, updatePayload, { new: true }).exec();
    if (!blog) {
      throw new AppError('Blog không tồn tại', 404);
    }
    return blog;
  }

  async deleteBlog(blogId: number): Promise<void> {
    const deleted = await Blog.findOneAndDelete({ blogId }).exec();
    if (!deleted) {
      throw new AppError('Blog không tồn tại', 404);
    }
  }
}

export default new BlogService();

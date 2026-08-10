import { Request, Response } from 'express';
import blogService from '../services/blog.service';
import { uploadImageBuffer } from '../utils/cloudinaryUpload';
import { parseNumericId } from '../utils/numericId';

export const listBlogs = async (_req: Request, res: Response): Promise<void> => {
  const blogs = await blogService.listBlogs();
  res.json({ success: true, data: blogs });
};

export const listAllBlogs = async (_req: Request, res: Response): Promise<void> => {
  const blogs = await blogService.listAllBlogs();
  res.json({ success: true, data: blogs });
};

export const getBlog = async (req: Request, res: Response): Promise<void> => {
  const blog = await blogService.getBlog(parseNumericId(req.params.blogId, 'blogId'));
  if (!blog) {
    res.status(404).json({ success: false, message: 'Blog not found' });
    return;
  }
  res.json({ success: true, data: blog });
};

export const createBlog = async (req: Request, res: Response): Promise<void> => {
  const payload = { ...req.body };
  if (req.file) {
    const uploaded = await uploadImageBuffer(req.file, 'blogs');
    payload.thumbnail = uploaded.url;
  }

  const blog = await blogService.createBlog(payload);
  res.status(201).json({ success: true, data: blog });
};

export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  const payload = { ...req.body };
  if (req.file) {
    const uploaded = await uploadImageBuffer(req.file, 'blogs');
    payload.thumbnail = uploaded.url;
  }

  const blog = await blogService.updateBlog(parseNumericId(req.params.blogId, 'blogId'), payload);
  res.json({ success: true, data: blog });
};

export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  await blogService.deleteBlog(parseNumericId(req.params.blogId, 'blogId'));
  res.status(204).send();
};

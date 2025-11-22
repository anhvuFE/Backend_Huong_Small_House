import { Request, Response } from 'express';
import productService from '../services/product.service';
import { uploadImagesBuffer } from '../utils/cloudinaryUpload';
import { IProductImage } from '../models/Product';

const parseImagesField = (value: unknown): IProductImage[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value as IProductImage[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as IProductImage[]) : [];
    } catch (error) {
      return [];
    }
  }
  return [];
};

export const listProducts = async (_req: Request, res: Response): Promise<void> => {
  const products = await productService.listProducts();
  res.json({ success: true, data: products });
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.params as { productId: string };
  const product = await productService.getProduct(Number(productId));
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  res.json({ success: true, data: product });
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const baseImages = parseImagesField((req.body as { images?: unknown }).images);
  const files = (req.files as Express.Multer.File[] | undefined) || [];
  const uploaded = files.length ? await uploadImagesBuffer(files, 'products') : [];

  const images: IProductImage[] = [
    ...baseImages,
    ...uploaded.map((img) => ({ url: img.url }))
  ];

  const product = await productService.createProduct({ ...req.body, images });
  res.status(201).json({ success: true, data: product });
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const rawImages = (req.body as { images?: unknown }).images;
  const baseImages = parseImagesField(rawImages);
  const files = (req.files as Express.Multer.File[] | undefined) || [];
  const uploaded = files.length ? await uploadImagesBuffer(files, 'products') : [];

  const images: IProductImage[] = [
    ...baseImages,
    ...uploaded.map((img) => ({ url: img.url }))
  ];

  const payload =
    rawImages !== undefined || files.length
      ? { ...req.body, images }
      : { ...req.body };

  const product = await productService.updateProduct(Number(req.params.productId), {
    ...payload
  });
  res.json({ success: true, data: product });
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  await productService.deleteProduct(Number(req.params.productId));
  res.status(204).send();
};

export const listCategories = async (_req: Request, res: Response): Promise<void> => {
  const categories = await productService.listCategories();
  res.json({ success: true, data: categories });
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const category = await productService.createCategory(req.body);
  res.status(201).json({ success: true, data: category });
};

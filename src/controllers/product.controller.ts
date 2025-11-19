import { Request, Response } from 'express';
import productService from '../services/product.service';

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
  const product = await productService.createProduct(req.body);
  res.status(201).json({ success: true, data: product });
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const product = await productService.updateProduct(Number(req.params.productId), req.body);
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

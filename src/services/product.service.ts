import Category, { ICategory } from '../models/Category';
import Product, { IProduct } from '../models/Product';
import AppError from '../utils/appError';
import slugify from '../utils/slugify';

class ProductService {
  listProducts(): Promise<IProduct[]> {
    return Product.find().exec();
  }

  async getProduct(productId: number): Promise<IProduct | null> {
    return Product.findOne({ productId }).exec();
  }

  async createProduct(payload: Partial<IProduct>): Promise<IProduct> {
    const product = await Product.create(payload);
    return product;
  }

  async updateProduct(productId: number, payload: Partial<IProduct>): Promise<IProduct | null> {
    const product = await Product.findOneAndUpdate({ productId }, payload, { new: true });
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async deleteProduct(productId: number): Promise<void> {
    const result = await Product.findOneAndDelete({ productId });
    if (!result) {
      throw new AppError('Product not found', 404);
    }
  }

  listCategories(): Promise<ICategory[]> {
    return Category.find().exec();
  }

  async createCategory(payload: Partial<ICategory>): Promise<ICategory> {
    const slug = payload.slug || slugify(payload.name || '');
    const exists = await Category.findOne({ slug }).exec();
    if (exists) {
      throw new AppError('Category already exists', 409);
    }
    const category = await Category.create({ ...payload, slug });
    return category;
  }
}

export default new ProductService();

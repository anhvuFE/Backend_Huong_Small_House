import Category, { ICategory } from '../models/Category';
import Product, { IProduct } from '../models/Product';
import AppError from '../utils/appError';
import slugify from '../utils/slugify';

// Chỉ nhận các field hợp lệ từ client — chặn mass-assignment (vd productId,
// rating) khiến hỏng bộ đếm auto-increment / trùng khóa / gian lận đánh giá.
const pickProductFields = (payload: Partial<IProduct>): Partial<IProduct> => {
  const clean: Partial<IProduct> = {};
  if (payload.name !== undefined) clean.name = payload.name;
  if (payload.brand !== undefined) clean.brand = payload.brand;
  if (payload.categoryId !== undefined) clean.categoryId = payload.categoryId;
  if (payload.description !== undefined) clean.description = payload.description;
  if (payload.price !== undefined) clean.price = payload.price;
  if (payload.stock !== undefined) clean.stock = payload.stock;
  if (payload.images !== undefined) clean.images = payload.images;
  return clean;
};

export interface ListProductsQuery {
  category?: number;
  search?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface ListProductsResult {
  items: IProduct[];
  total: number;
  paginated: boolean;
  page: number;
  limit: number;
}

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  rating: { rating: -1 },
  newest: { createdAt: -1 }
};

class ProductService {
  async listProducts(query: ListProductsQuery = {}): Promise<ListProductsResult> {
    const filter: Record<string, unknown> = {};

    if (typeof query.category === 'number' && !Number.isNaN(query.category)) {
      filter.categoryId = query.category;
    }
    if (query.brand) {
      filter.brand = query.brand;
    }
    if (query.search) {
      // Escape ký tự đặc biệt để tránh ReDoS / regex lỗi từ input người dùng.
      const escaped = query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const rx = new RegExp(escaped, 'i');
      filter.$or = [{ name: rx }, { brand: rx }, { description: rx }];
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const price: Record<string, number> = {};
      if (query.minPrice !== undefined) price.$gte = query.minPrice;
      if (query.maxPrice !== undefined) price.$lte = query.maxPrice;
      filter.price = price;
    }

    const sort = (query.sort && SORT_MAP[query.sort]) || { createdAt: -1 };

    const paginated = query.page !== undefined || query.limit !== undefined;
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;

    let q = Product.find(filter).sort(sort);
    if (paginated) {
      q = q.skip((page - 1) * limit).limit(limit);
    }

    const [items, total] = await Promise.all([
      q.exec(),
      paginated ? Product.countDocuments(filter) : Promise.resolve(0)
    ]);

    return { items, total: paginated ? total : items.length, paginated, page, limit };
  }

  async getProduct(productId: number): Promise<IProduct | null> {
    return Product.findOne({ productId }).exec();
  }

  async createProduct(payload: Partial<IProduct>): Promise<IProduct> {
    const product = await Product.create(pickProductFields(payload));
    return product;
  }

  async updateProduct(productId: number, payload: Partial<IProduct>): Promise<IProduct | null> {
    const product = await Product.findOneAndUpdate({ productId }, pickProductFields(payload), { new: true });
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

  async getCategory(categoryId: number): Promise<ICategory | null> {
    return Category.findOne({ categoryId }).exec();
  }

  async updateCategory(categoryId: number, payload: Partial<ICategory>): Promise<ICategory> {
    const updatePayload = { ...payload };
    if (payload.name && !payload.slug) {
      updatePayload.slug = slugify(payload.name);
    }

    if (updatePayload.slug) {
      const exists = await Category.findOne({ slug: updatePayload.slug, categoryId: { $ne: categoryId } });
      if (exists) {
        throw new AppError('Category already exists', 409);
      }
    }

    const category = await Category.findOneAndUpdate({ categoryId }, updatePayload, { new: true }).exec();
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }

  async deleteCategory(categoryId: number): Promise<void> {
    const category = await Category.findOneAndDelete({ categoryId }).exec();
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    await Product.deleteMany({ categoryId }).exec();
  }
}

export default new ProductService();

import { ICategory } from '../models/Category';
import { IProduct } from '../models/Product';
declare class ProductService {
    listProducts(): Promise<IProduct[]>;
    getProduct(productId: number): Promise<IProduct | null>;
    createProduct(payload: Partial<IProduct>): Promise<IProduct>;
    updateProduct(productId: number, payload: Partial<IProduct>): Promise<IProduct | null>;
    deleteProduct(productId: number): Promise<void>;
    listCategories(): Promise<ICategory[]>;
    createCategory(payload: Partial<ICategory>): Promise<ICategory>;
    getCategory(categoryId: number): Promise<ICategory | null>;
    updateCategory(categoryId: number, payload: Partial<ICategory>): Promise<ICategory>;
    deleteCategory(categoryId: number): Promise<void>;
}
declare const _default: ProductService;
export default _default;
//# sourceMappingURL=product.service.d.ts.map
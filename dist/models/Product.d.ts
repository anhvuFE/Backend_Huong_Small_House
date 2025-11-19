import { Document } from 'mongoose';
export interface IProductImage {
    url: string;
    alt?: string;
}
export interface IProduct extends Document {
    productId: number;
    name: string;
    brand: string;
    categoryId: number;
    description: string;
    price: number;
    stock: number;
    images: IProductImage[];
    rating: number;
}
declare const Product: import("mongoose").Model<IProduct, {}, {}, {}, Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Product;
//# sourceMappingURL=Product.d.ts.map
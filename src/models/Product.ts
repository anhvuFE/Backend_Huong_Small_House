import { Schema, model, Document } from 'mongoose';
import { getNextSequence } from '../utils/autoIncrement';

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

const productSchema = new Schema<IProduct>(
  {
    productId: { type: Number, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    categoryId: { type: Number, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [
      {
        url: { type: String, required: true },
        alt: String
      }
    ],
    rating: { type: Number, default: 5 }
  },
  { timestamps: true }
);

productSchema.pre('save', async function (next) {
  if (this.isNew && !this.productId) {
    this.productId = await getNextSequence('products');
  }
  next();
});

const Product = model<IProduct>('Product', productSchema);

export default Product;

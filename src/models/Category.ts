import { Schema, model, Document } from 'mongoose';
import { getNextSequence } from '../utils/autoIncrement';

export interface ICategory extends Document {
  categoryId: number;
  name: string;
  slug: string;
}

const categorySchema = new Schema<ICategory>(
  {
    categoryId: { type: Number, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

categorySchema.pre('save', async function (next) {
  if (this.isNew && !this.categoryId) {
    this.categoryId = await getNextSequence('categories');
  }
  next();
});

const Category = model<ICategory>('Category', categorySchema);

export default Category;

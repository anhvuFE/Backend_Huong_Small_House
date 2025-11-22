import { Schema, model, Document } from 'mongoose';
import { getNextSequence } from '../utils/autoIncrement';

export interface IBlog extends Document {
  blogId: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnail?: string;
  tags?: string[];
  published: boolean;
}

const blogSchema = new Schema<IBlog>(
  {
    blogId: { type: Number, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: String,
    thumbnail: String,
    tags: [{ type: String }],
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

blogSchema.pre('save', async function (next) {
  if (this.isNew && !this.blogId) {
    this.blogId = await getNextSequence('blogs');
  }
  next();
});

const Blog = model<IBlog>('Blog', blogSchema);

export default Blog;

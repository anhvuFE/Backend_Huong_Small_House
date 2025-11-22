import { Document } from 'mongoose';
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
declare const Blog: import("mongoose").Model<IBlog, {}, {}, {}, Document<unknown, {}, IBlog, {}, {}> & IBlog & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Blog;
//# sourceMappingURL=Blog.d.ts.map
import { IBlog } from '../models/Blog';
declare class BlogService {
    listBlogs(): Promise<IBlog[]>;
    listAllBlogs(): Promise<IBlog[]>;
    getBlog(blogId: number): Promise<IBlog | null>;
    createBlog(payload: Partial<IBlog>): Promise<IBlog>;
    updateBlog(blogId: number, payload: Partial<IBlog>): Promise<IBlog>;
    deleteBlog(blogId: number): Promise<void>;
}
declare const _default: BlogService;
export default _default;
//# sourceMappingURL=blog.service.d.ts.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Blog_1 = __importDefault(require("../models/Blog"));
const appError_1 = __importDefault(require("../utils/appError"));
const slugify_1 = __importDefault(require("../utils/slugify"));
class BlogService {
    listBlogs() {
        return Blog_1.default.find({ published: true }).sort({ createdAt: -1 }).exec();
    }
    listAllBlogs() {
        return Blog_1.default.find().sort({ createdAt: -1 }).exec();
    }
    async getBlog(blogId) {
        return Blog_1.default.findOne({ blogId }).exec();
    }
    async createBlog(payload) {
        const slug = payload.slug || (0, slugify_1.default)(payload.title || '');
        if (!slug) {
            throw new appError_1.default('Slug is required', 400);
        }
        const exists = await Blog_1.default.findOne({ slug }).exec();
        if (exists) {
            throw new appError_1.default('Slug đã tồn tại', 409);
        }
        const blog = await Blog_1.default.create({ ...payload, slug });
        return blog;
    }
    async updateBlog(blogId, payload) {
        const updatePayload = { ...payload };
        if (payload.title && !payload.slug) {
            updatePayload.slug = (0, slugify_1.default)(payload.title);
        }
        if (updatePayload.slug) {
            const exists = await Blog_1.default.findOne({ slug: updatePayload.slug, blogId: { $ne: blogId } }).exec();
            if (exists) {
                throw new appError_1.default('Slug đã tồn tại', 409);
            }
        }
        const blog = await Blog_1.default.findOneAndUpdate({ blogId }, updatePayload, { new: true }).exec();
        if (!blog) {
            throw new appError_1.default('Blog không tồn tại', 404);
        }
        return blog;
    }
    async deleteBlog(blogId) {
        const deleted = await Blog_1.default.findOneAndDelete({ blogId }).exec();
        if (!deleted) {
            throw new appError_1.default('Blog không tồn tại', 404);
        }
    }
}
exports.default = new BlogService();
//# sourceMappingURL=blog.service.js.map
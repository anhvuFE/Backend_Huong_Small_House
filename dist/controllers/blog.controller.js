"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlog = exports.listAllBlogs = exports.listBlogs = void 0;
const blog_service_1 = __importDefault(require("../services/blog.service"));
const cloudinaryUpload_1 = require("../utils/cloudinaryUpload");
const listBlogs = async (_req, res) => {
    const blogs = await blog_service_1.default.listBlogs();
    res.json({ success: true, data: blogs });
};
exports.listBlogs = listBlogs;
const listAllBlogs = async (_req, res) => {
    const blogs = await blog_service_1.default.listAllBlogs();
    res.json({ success: true, data: blogs });
};
exports.listAllBlogs = listAllBlogs;
const getBlog = async (req, res) => {
    const blog = await blog_service_1.default.getBlog(Number(req.params.blogId));
    if (!blog) {
        res.status(404).json({ success: false, message: 'Blog not found' });
        return;
    }
    res.json({ success: true, data: blog });
};
exports.getBlog = getBlog;
const createBlog = async (req, res) => {
    const payload = { ...req.body };
    if (req.file) {
        const uploaded = await (0, cloudinaryUpload_1.uploadImageBuffer)(req.file, 'blogs');
        payload.thumbnail = uploaded.url;
    }
    const blog = await blog_service_1.default.createBlog(payload);
    res.status(201).json({ success: true, data: blog });
};
exports.createBlog = createBlog;
const updateBlog = async (req, res) => {
    const payload = { ...req.body };
    if (req.file) {
        const uploaded = await (0, cloudinaryUpload_1.uploadImageBuffer)(req.file, 'blogs');
        payload.thumbnail = uploaded.url;
    }
    const blog = await blog_service_1.default.updateBlog(Number(req.params.blogId), payload);
    res.json({ success: true, data: blog });
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res) => {
    await blog_service_1.default.deleteBlog(Number(req.params.blogId));
    res.status(204).send();
};
exports.deleteBlog = deleteBlog;
//# sourceMappingURL=blog.controller.js.map
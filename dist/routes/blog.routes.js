"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const blog_controller_1 = require("../controllers/blog.controller");
const upload_1 = require("../middlewares/upload");
const router = (0, express_1.Router)();
const blogSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    slug: joi_1.default.string().optional(),
    content: joi_1.default.string().required(),
    excerpt: joi_1.default.string().optional(),
    thumbnail: joi_1.default.string().uri().optional(),
    tags: joi_1.default.array().items(joi_1.default.string()).optional(),
    published: joi_1.default.boolean().optional()
});
const updateBlogSchema = blogSchema.fork(['title', 'content'], (schema) => schema.optional());
router.get('/', blog_controller_1.listBlogs);
router.get('/all', auth_1.authenticate, (0, auth_1.authorize)('admin'), blog_controller_1.listAllBlogs);
router.get('/:blogId', blog_controller_1.getBlog);
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), (0, upload_1.uploadSingleImage)('thumbnail'), (0, validate_1.validate)(blogSchema), blog_controller_1.createBlog);
router.put('/:blogId', auth_1.authenticate, (0, auth_1.authorize)('admin'), (0, upload_1.uploadSingleImage)('thumbnail'), (0, validate_1.validate)(updateBlogSchema), blog_controller_1.updateBlog);
router.delete('/:blogId', auth_1.authenticate, (0, auth_1.authorize)('admin'), blog_controller_1.deleteBlog);
exports.default = router;
//# sourceMappingURL=blog.routes.js.map
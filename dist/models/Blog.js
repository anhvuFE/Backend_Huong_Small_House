"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoIncrement_1 = require("../utils/autoIncrement");
const blogSchema = new mongoose_1.Schema({
    blogId: { type: Number, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: String,
    thumbnail: String,
    tags: [{ type: String }],
    published: { type: Boolean, default: true }
}, { timestamps: true });
blogSchema.pre('save', async function (next) {
    if (this.isNew && !this.blogId) {
        this.blogId = await (0, autoIncrement_1.getNextSequence)('blogs');
    }
    next();
});
const Blog = (0, mongoose_1.model)('Blog', blogSchema);
exports.default = Blog;
//# sourceMappingURL=Blog.js.map
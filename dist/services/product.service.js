"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../models/Category"));
const Product_1 = __importDefault(require("../models/Product"));
const appError_1 = __importDefault(require("../utils/appError"));
const slugify_1 = __importDefault(require("../utils/slugify"));
class ProductService {
    listProducts() {
        return Product_1.default.find().exec();
    }
    async getProduct(productId) {
        return Product_1.default.findOne({ productId }).exec();
    }
    async createProduct(payload) {
        const product = await Product_1.default.create(payload);
        return product;
    }
    async updateProduct(productId, payload) {
        const product = await Product_1.default.findOneAndUpdate({ productId }, payload, { new: true });
        if (!product) {
            throw new appError_1.default('Product not found', 404);
        }
        return product;
    }
    async deleteProduct(productId) {
        const result = await Product_1.default.findOneAndDelete({ productId });
        if (!result) {
            throw new appError_1.default('Product not found', 404);
        }
    }
    listCategories() {
        return Category_1.default.find().exec();
    }
    async createCategory(payload) {
        const slug = payload.slug || (0, slugify_1.default)(payload.name || '');
        const exists = await Category_1.default.findOne({ slug }).exec();
        if (exists) {
            throw new appError_1.default('Category already exists', 409);
        }
        const category = await Category_1.default.create({ ...payload, slug });
        return category;
    }
    async getCategory(categoryId) {
        return Category_1.default.findOne({ categoryId }).exec();
    }
    async updateCategory(categoryId, payload) {
        const updatePayload = { ...payload };
        if (payload.name && !payload.slug) {
            updatePayload.slug = (0, slugify_1.default)(payload.name);
        }
        if (updatePayload.slug) {
            const exists = await Category_1.default.findOne({ slug: updatePayload.slug, categoryId: { $ne: categoryId } });
            if (exists) {
                throw new appError_1.default('Category already exists', 409);
            }
        }
        const category = await Category_1.default.findOneAndUpdate({ categoryId }, updatePayload, { new: true }).exec();
        if (!category) {
            throw new appError_1.default('Category not found', 404);
        }
        return category;
    }
}
exports.default = new ProductService();
//# sourceMappingURL=product.service.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = exports.listCategories = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.listProducts = void 0;
const product_service_1 = __importDefault(require("../services/product.service"));
const listProducts = async (_req, res) => {
    const products = await product_service_1.default.listProducts();
    res.json({ success: true, data: products });
};
exports.listProducts = listProducts;
const getProduct = async (req, res) => {
    const { productId } = req.params;
    const product = await product_service_1.default.getProduct(Number(productId));
    if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
    }
    res.json({ success: true, data: product });
};
exports.getProduct = getProduct;
const createProduct = async (req, res) => {
    const product = await product_service_1.default.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    const product = await product_service_1.default.updateProduct(Number(req.params.productId), req.body);
    res.json({ success: true, data: product });
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    await product_service_1.default.deleteProduct(Number(req.params.productId));
    res.status(204).send();
};
exports.deleteProduct = deleteProduct;
const listCategories = async (_req, res) => {
    const categories = await product_service_1.default.listCategories();
    res.json({ success: true, data: categories });
};
exports.listCategories = listCategories;
const createCategory = async (req, res) => {
    const category = await product_service_1.default.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
};
exports.createCategory = createCategory;
//# sourceMappingURL=product.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoIncrement_1 = require("../utils/autoIncrement");
const productSchema = new mongoose_1.Schema({
    productId: { type: Number, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    categoryId: { type: Number, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [
        {
            url: { type: String, required: true },
            alt: String
        }
    ],
    rating: { type: Number, default: 5 }
}, { timestamps: true });
productSchema.pre('save', async function (next) {
    if (this.isNew && !this.productId) {
        this.productId = await (0, autoIncrement_1.getNextSequence)('products');
    }
    next();
});
const Product = (0, mongoose_1.model)('Product', productSchema);
exports.default = Product;
//# sourceMappingURL=Product.js.map
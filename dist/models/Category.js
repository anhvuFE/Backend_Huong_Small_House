"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoIncrement_1 = require("../utils/autoIncrement");
const categorySchema = new mongoose_1.Schema({
    categoryId: { type: Number, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }
}, { timestamps: true });
categorySchema.pre('save', async function (next) {
    if (this.isNew && !this.categoryId) {
        this.categoryId = await (0, autoIncrement_1.getNextSequence)('categories');
    }
    next();
});
const Category = (0, mongoose_1.model)('Category', categorySchema);
exports.default = Category;
//# sourceMappingURL=Category.js.map
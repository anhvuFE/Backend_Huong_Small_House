"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("../config/env"));
const logger_1 = __importDefault(require("../utils/logger"));
const User_1 = __importDefault(require("../models/User"));
const Admin_1 = __importDefault(require("../models/Admin"));
const Category_1 = __importDefault(require("../models/Category"));
const Product_1 = __importDefault(require("../models/Product"));
const Promotion_1 = __importDefault(require("../models/Promotion"));
const Counter_1 = __importDefault(require("../models/Counter"));
const categories = [
    { name: 'Vitamin tổng hợp', slug: 'vitamin' },
    { name: 'Sức khỏe tiêu hóa', slug: 'digestive-health' },
    { name: 'Tăng cường miễn dịch', slug: 'immune-support' }
];
const products = [
    {
        name: 'Small House Multivitamin',
        brand: 'Small House',
        categorySlug: 'vitamin',
        description: 'Bổ sung 12 loại vitamin thiết yếu.',
        price: 350000,
        stock: 120,
        images: [{ url: 'https://placehold.co/600x400?text=Multivitamin' }]
    },
    {
        name: 'Probiotic Daily',
        brand: 'Huong Small',
        categorySlug: 'digestive-health',
        description: 'Hỗ trợ hệ tiêu hóa khỏe mạnh.',
        price: 280000,
        stock: 80,
        images: [{ url: 'https://placehold.co/600x400?text=Probiotic' }]
    },
    {
        name: 'Vitamin C 1000mg',
        brand: 'Small House',
        categorySlug: 'immune-support',
        description: 'Tăng sức đề kháng với vitamin C nguyên chất.',
        price: 190000,
        stock: 200,
        images: [{ url: 'https://placehold.co/600x400?text=Vitamin+C' }]
    }
];
const promotions = [
    {
        code: 'WELCOME10',
        type: 'percent',
        value: 10,
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        usageLimit: 100
    },
    {
        code: 'FREESHIP',
        type: 'fixed',
        value: 30000,
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
        usageLimit: 200
    }
];
const seed = async () => {
    await mongoose_1.default.connect(env_1.default.mongoUri);
    logger_1.default.info('Connected to MongoDB');
    await Promise.all([
        User_1.default.deleteMany({}),
        Admin_1.default.deleteMany({}),
        Category_1.default.deleteMany({}),
        Product_1.default.deleteMany({}),
        Promotion_1.default.deleteMany({}),
        Counter_1.default.deleteMany({})
    ]);
    const admin = await Admin_1.default.create({ email: 'admin@gmail.com', password: '12345678' });
    const user = await User_1.default.create({
        name: 'Xanh Nguyen',
        email: 'xanh@gmail.com',
        password: '12345678',
        phone: '0987654321',
        address: '123 Nguyen Trai, Hanoi'
    });
    logger_1.default.info('Created admin %s and user %s', admin.email, user.email);
    const createdCategories = [];
    for (const category of categories) {
        const created = await Category_1.default.create(category);
        createdCategories.push({ slug: created.slug, categoryId: created.categoryId });
    }
    logger_1.default.info('Seeded %d categories', createdCategories.length);
    for (const product of products) {
        const category = createdCategories.find((c) => c.slug === product.categorySlug);
        if (!category)
            continue;
        await Product_1.default.create({
            name: product.name,
            brand: product.brand,
            categoryId: category.categoryId,
            description: product.description,
            price: product.price,
            stock: product.stock,
            images: product.images
        });
    }
    logger_1.default.info('Seeded products');
    await Promotion_1.default.insertMany(promotions);
    logger_1.default.info('Seeded promotions');
    await mongoose_1.default.disconnect();
    logger_1.default.info('Seed finished');
};
seed()
    .then(() => process.exit(0))
    .catch((error) => {
    logger_1.default.error(error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map
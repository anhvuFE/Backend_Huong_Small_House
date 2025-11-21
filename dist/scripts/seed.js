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
const Order_1 = __importDefault(require("../models/Order"));
const categories = [
    { name: 'Vitamin', slug: 'vitamin' },
    { name: 'Collagen', slug: 'collagen' },
    { name: 'Xương khớp', slug: 'bone-support' },
    { name: 'Giảm cân', slug: 'weight-loss' },
    { name: 'Tăng đề kháng', slug: 'immunity' },
    { name: 'Tiêu hóa', slug: 'digestive' },
    { name: 'Tim mạch', slug: 'heart-health' },
    { name: 'Làm đẹp', slug: 'beauty' },
    { name: 'Giấc ngủ', slug: 'sleep' }
];
const products = [
    {
        name: 'Vitamin C 1000mg Kirkland',
        brand: 'Kirkland',
        categorySlug: 'vitamin',
        description: 'Bổ sung vitamin C tinh khiết giúp tăng cường đề kháng.',
        price: 450000,
        stock: 100,
        images: [{ url: 'https://placehold.co/600x400?text=Vitamin+C' }]
    },
    {
        name: 'Collagen Youtheory Type 1 2 & 3',
        brand: 'Youtheory',
        categorySlug: 'collagen',
        description: 'Hỗ trợ da, tóc và xương khớp săn chắc.',
        price: 680000,
        stock: 50,
        images: [{ url: 'https://placehold.co/600x400?text=Collagen' }]
    },
    {
        name: 'Glucosamine Chondroitin MSM',
        brand: "Doctor's Best",
        categorySlug: 'bone-support',
        description: 'Chăm sóc xương khớp và hỗ trợ vận động.',
        price: 720000,
        stock: 30,
        images: [{ url: 'https://placehold.co/600x400?text=Bone+Support' }]
    },
    {
        name: 'Omega 3 Fish Oil 1000mg',
        brand: 'Nature Made',
        categorySlug: 'heart-health',
        description: 'Dầu cá hỗ trợ tim mạch và trí não khỏe mạnh.',
        price: 550000,
        stock: 80,
        images: [{ url: 'https://placehold.co/600x400?text=Omega+3' }]
    },
    {
        name: 'Probiotics 50 Billion CFU',
        brand: 'Garden of Life',
        categorySlug: 'digestive',
        description: 'Men vi sinh hỗ trợ hệ tiêu hóa khỏe mạnh.',
        price: 890000,
        stock: 40,
        images: [{ url: 'https://placehold.co/600x400?text=Probiotic' }]
    },
    {
        name: 'Viên uống giảm cân Green Tea Extract',
        brand: 'Applied Nutrition',
        categorySlug: 'weight-loss',
        description: 'Chiết xuất trà xanh hỗ trợ kiểm soát cân nặng lành mạnh.',
        price: 420000,
        stock: 60,
        images: [{ url: 'https://placehold.co/600x400?text=Green+Tea' }]
    },
    {
        name: 'Vitamin D3 5000 IU',
        brand: 'NOW Foods',
        categorySlug: 'vitamin',
        description: 'Bổ sung vitamin D3 hỗ trợ xương và miễn dịch.',
        price: 320000,
        stock: 120,
        images: [{ url: 'https://placehold.co/600x400?text=Vitamin+D3' }]
    },
    {
        name: 'Biotin 10000mcg cho tóc và móng',
        brand: 'Sports Research',
        categorySlug: 'beauty',
        description: 'Biotin nuôi dưỡng tóc và móng chắc khỏe.',
        price: 380000,
        stock: 70,
        images: [{ url: 'https://placehold.co/600x400?text=Biotin' }]
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
const buildOrder = (userId, products, date, items) => {
    const orderItems = items.map((item) => {
        const product = products.find((p) => p.productId === item.productId);
        if (!product) {
            throw new Error(`Missing product ${item.productId} for seed order`);
        }
        return {
            productId: product.productId,
            name: product.name,
            quantity: item.quantity,
            price: product.price
        };
    });
    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
        user: userId,
        items: orderItems,
        total,
        paymentMethod: 'COD',
        paymentStatus: 'paid',
        status: 'delivered',
        email: 'xanh@gmail.com',
        createdAt: date,
        updatedAt: date
    };
};
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
    const seededProducts = await Product_1.default.find({}).exec();
    const year = new Date().getFullYear();
    const ordersPayload = [
        buildOrder(user._id.toString(), seededProducts, new Date(year, 0, 10, 9, 30), [
            { productId: seededProducts[0].productId, quantity: 2 },
            { productId: seededProducts[1].productId, quantity: 1 }
        ]),
        buildOrder(user._id.toString(), seededProducts, new Date(year, 1, 5, 14, 15), [
            { productId: seededProducts[2].productId, quantity: 1 },
            { productId: seededProducts[3].productId, quantity: 2 }
        ]),
        buildOrder(user._id.toString(), seededProducts, new Date(year, 2, 18, 11, 45), [
            { productId: seededProducts[4].productId, quantity: 1 },
            { productId: seededProducts[0].productId, quantity: 1 }
        ]),
        buildOrder(user._id.toString(), seededProducts, new Date(year, 3, 22, 16, 5), [
            { productId: seededProducts[5].productId, quantity: 3 }
        ]),
        buildOrder(user._id.toString(), seededProducts, new Date(year, 4, 9, 10, 20), [
            { productId: seededProducts[6].productId, quantity: 2 }
        ]),
        buildOrder(user._id.toString(), seededProducts, new Date(year, 5, 14, 13, 50), [
            { productId: seededProducts[7].productId, quantity: 1 },
            { productId: seededProducts[1].productId, quantity: 1 }
        ]),
        buildOrder(user._id.toString(), seededProducts, new Date(year, 6, 2, 15, 10), [
            { productId: seededProducts[2].productId, quantity: 2 }
        ]),
        buildOrder(user._id.toString(), seededProducts, new Date(year, 7, 21, 18, 40), [
            { productId: seededProducts[3].productId, quantity: 1 },
            { productId: seededProducts[4].productId, quantity: 2 }
        ]),
        buildOrder(user._id.toString(), seededProducts, new Date(year, 8, 12, 9, 5), [
            { productId: seededProducts[0].productId, quantity: 1 },
            { productId: seededProducts[6].productId, quantity: 1 }
        ]),
        buildOrder(user._id.toString(), seededProducts, new Date(year, 9, 3, 17, 25), [
            { productId: seededProducts[5].productId, quantity: 1 },
            { productId: seededProducts[7].productId, quantity: 2 }
        ]),
        buildOrder(user._id.toString(), seededProducts, new Date(year, 10, 8, 8, 40), [
            { productId: seededProducts[4].productId, quantity: 1 }
        ]),
        buildOrder(user._id.toString(), seededProducts, new Date(year, 11, 15, 19, 0), [
            { productId: seededProducts[1].productId, quantity: 2 },
            { productId: seededProducts[6].productId, quantity: 1 }
        ])
    ];
    await Order_1.default.insertMany(ordersPayload);
    logger_1.default.info('Seeded %d orders across months', ordersPayload.length);
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
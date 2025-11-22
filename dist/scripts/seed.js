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
const Blog_1 = __importDefault(require("../models/Blog"));
const slugify_1 = __importDefault(require("../utils/slugify"));
const autoIncrement_1 = require("../utils/autoIncrement");
const force = process.env.SEED_FORCE === 'true';
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
    // Vitamin
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
        name: 'Vitamin D3 5000 IU',
        brand: 'NOW Foods',
        categorySlug: 'vitamin',
        description: 'Bổ sung vitamin D3 hỗ trợ xương và miễn dịch.',
        price: 320000,
        stock: 120,
        images: [{ url: 'https://placehold.co/600x400?text=Vitamin+D3' }]
    },
    // Collagen
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
        name: 'Collagen Peptides Powder Vital Proteins',
        brand: 'Vital Proteins',
        categorySlug: 'collagen',
        description: 'Bột collagen peptides dễ pha, hỗ trợ da và khớp.',
        price: 750000,
        stock: 60,
        images: [{ url: 'https://placehold.co/600x400?text=Collagen+Peptides' }]
    },
    // Xương khớp
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
        name: 'Calcium Magnesium Zinc with D3',
        brand: 'Puritan Pride',
        categorySlug: 'bone-support',
        description: 'Bổ sung canxi, magie, kẽm và vitamin D3 cho xương chắc khỏe.',
        price: 390000,
        stock: 80,
        images: [{ url: 'https://placehold.co/600x400?text=Calcium+D3' }]
    },
    // Giảm cân
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
        name: 'CLA 1000mg hỗ trợ chuyển hoá',
        brand: 'MuscleTech',
        categorySlug: 'weight-loss',
        description: 'CLA giúp hỗ trợ chuyển hóa chất béo, kết hợp chế độ ăn lành mạnh.',
        price: 510000,
        stock: 70,
        images: [{ url: 'https://placehold.co/600x400?text=CLA+1000mg' }]
    },
    // Tăng đề kháng
    {
        name: 'Zinc Picolinate 50mg',
        brand: 'NOW Foods',
        categorySlug: 'immunity',
        description: 'Kẽm hỗ trợ miễn dịch và sức khỏe tổng thể.',
        price: 260000,
        stock: 90,
        images: [{ url: 'https://placehold.co/600x400?text=Zinc' }]
    },
    {
        name: 'Elderberry Sambucus Gummies',
        brand: 'Nature Made',
        categorySlug: 'immunity',
        description: 'Kẹo dẻo chiết xuất elderberry tăng cường miễn dịch.',
        price: 340000,
        stock: 110,
        images: [{ url: 'https://placehold.co/600x400?text=Elderberry' }]
    },
    // Tiêu hóa
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
        name: 'Digestive Enzymes Ultra',
        brand: 'NOW Foods',
        categorySlug: 'digestive',
        description: 'Enzyme hỗ trợ tiêu hóa cho bữa ăn nhiều đạm và chất béo.',
        price: 480000,
        stock: 65,
        images: [{ url: 'https://placehold.co/600x400?text=Digestive+Enzymes' }]
    },
    // Tim mạch
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
        name: 'CoQ10 200mg Ubiquinone',
        brand: 'Qunol',
        categorySlug: 'heart-health',
        description: 'Hỗ trợ sức khỏe tim mạch và năng lượng tế bào.',
        price: 620000,
        stock: 55,
        images: [{ url: 'https://placehold.co/600x400?text=CoQ10' }]
    },
    // Làm đẹp
    {
        name: 'Biotin 10000mcg cho tóc và móng',
        brand: 'Sports Research',
        categorySlug: 'beauty',
        description: 'Biotin nuôi dưỡng tóc và móng chắc khỏe.',
        price: 380000,
        stock: 70,
        images: [{ url: 'https://placehold.co/600x400?text=Biotin' }]
    },
    {
        name: 'Hyaluronic Acid with Vitamin C',
        brand: 'Puritan Pride',
        categorySlug: 'beauty',
        description: 'Hỗ trợ cấp ẩm và đàn hồi cho da.',
        price: 350000,
        stock: 85,
        images: [{ url: 'https://placehold.co/600x400?text=Hyaluronic' }]
    },
    // Giấc ngủ
    {
        name: 'Melatonin 5mg Fast Dissolve',
        brand: 'Natrol',
        categorySlug: 'sleep',
        description: 'Hỗ trợ giấc ngủ ngon và sâu hơn.',
        price: 210000,
        stock: 95,
        images: [{ url: 'https://placehold.co/600x400?text=Melatonin' }]
    },
    {
        name: 'Magnesium Glycinate Calm',
        brand: 'Doctor\'s Best',
        categorySlug: 'sleep',
        description: 'Magie giúp thư giãn cơ và cải thiện chất lượng giấc ngủ.',
        price: 330000,
        stock: 75,
        images: [{ url: 'https://placehold.co/600x400?text=Magnesium+Calm' }]
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
const defaultUser = {
    name: 'Xanh Nguyen',
    email: 'xanh@gmail.com',
    password: '12345678',
    phone: '0987654321',
    address: '123 Nguyen Trai, Hanoi'
};
const extraUsers = [
    { name: 'Lan Nguyen', email: 'lan@gmail.com', password: '12345678', phone: '0900000001' },
    { name: 'Minh Tran', email: 'minh@gmail.com', password: '12345678', phone: '0900000002' },
    { name: 'Hoa Le', email: 'hoa@gmail.com', password: '12345678', phone: '0900000003' },
    { name: 'Tuan Pham', email: 'tuan@gmail.com', password: '12345678', phone: '0900000004' }
];
const blogs = [
    {
        title: 'Top 5 thực phẩm bổ sung cho mùa đông khỏe mạnh',
        content: 'Nội dung bài viết về các loại vitamin D, Omega-3, kẽm...',
        excerpt: 'Vitamin D, Omega-3, kẽm… là bộ ba nên có vào mùa đông.',
        thumbnail: 'https://placehold.co/800x450?text=Winter+Supplements',
        tags: ['vitamin', 'omega3', 'health']
    },
    {
        title: 'Hướng dẫn chọn collagen phù hợp cho da',
        content: 'Phân biệt collagen type 1,2,3 và cách dùng tối ưu.',
        excerpt: 'Collagen type 1,2,3 khác nhau thế nào và dùng ra sao?',
        thumbnail: 'https://placehold.co/800x450?text=Collagen+Guide',
        tags: ['collagen', 'beauty']
    },
    {
        title: '5 mẹo hỗ trợ giảm cân an toàn',
        content: 'Ưu tiên protein, ngủ đủ giấc, thêm CLA và trà xanh...',
        excerpt: 'Kết hợp ăn uống, ngủ, vận động và bổ sung CLA/trà xanh.',
        thumbnail: 'https://placehold.co/800x450?text=Weight+Loss+Tips',
        tags: ['weight-loss', 'green-tea']
    },
    {
        title: 'Probiotic có thật sự cần thiết?',
        content: 'Lợi ích cho tiêu hóa, miễn dịch và liều dùng khuyến nghị.',
        excerpt: 'Men vi sinh giúp cân bằng hệ vi khuẩn đường ruột.',
        thumbnail: 'https://placehold.co/800x450?text=Probiotic',
        tags: ['digestive', 'probiotic']
    },
    {
        title: 'Bảo vệ tim mạch với Omega-3',
        content: 'DHA/EPA là gì, liều khuyến nghị và lưu ý khi dùng.',
        excerpt: 'Omega-3 hỗ trợ tim mạch, trí não và giảm viêm.',
        thumbnail: 'https://placehold.co/800x450?text=Omega+3',
        tags: ['heart', 'omega3']
    },
    {
        title: 'Dấu hiệu thiếu kẽm và cách bổ sung',
        content: 'Rụng tóc, móng giòn, giảm miễn dịch là dấu hiệu thiếu kẽm.',
        excerpt: 'Kẽm giúp miễn dịch và làn da khỏe.',
        thumbnail: 'https://placehold.co/800x450?text=Zinc',
        tags: ['immunity', 'zinc']
    },
    {
        title: 'Melatonin: hỗ trợ giấc ngủ tự nhiên',
        content: 'Cơ chế hoạt động, liều dùng, khi nào nên dùng melatonin.',
        excerpt: 'Melatonin giúp ngủ ngon hơn, dùng đúng liều và thời điểm.',
        thumbnail: 'https://placehold.co/800x450?text=Melatonin',
        tags: ['sleep', 'melatonin']
    },
    {
        title: 'Biotin và mái tóc chắc khỏe',
        content: 'Biotin hỗ trợ tóc, móng và chuyển hóa năng lượng.',
        excerpt: 'Bổ sung biotin đúng liều để tóc và móng khỏe hơn.',
        thumbnail: 'https://placehold.co/800x450?text=Biotin',
        tags: ['beauty', 'hair']
    },
    {
        title: 'Enzyme tiêu hóa có cần cho người lớn?',
        content: 'Khi ăn nhiều đạm/chất béo, enzyme hỗ trợ tiêu hóa tốt hơn.',
        excerpt: 'Enzyme hữu ích cho bữa ăn giàu đạm, giảm đầy bụng.',
        thumbnail: 'https://placehold.co/800x450?text=Digestive+Enzymes',
        tags: ['digestive', 'enzymes']
    },
    {
        title: 'CoQ10: nguồn năng lượng cho tế bào',
        content: 'CoQ10 hỗ trợ tim mạch, năng lượng và chống oxy hóa.',
        excerpt: 'CoQ10 tốt cho tim, đặc biệt người lớn tuổi.',
        thumbnail: 'https://placehold.co/800x450?text=CoQ10',
        tags: ['heart', 'coq10']
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
    const buildBlogsWithIds = async () => {
        const docs = [];
        for (const [index, blog] of blogs.entries()) {
            const slug = (0, slugify_1.default)(blog.title) || `blog-${index + 1}`;
            const blogId = await (0, autoIncrement_1.getNextSequence)('blogs');
            docs.push({ ...blog, slug, blogId });
        }
        return docs;
    };
    const ensureDefaultUsers = async () => {
        const usersToEnsure = [defaultUser, ...extraUsers];
        for (const userPayload of usersToEnsure) {
            const exists = await User_1.default.findOne({ email: userPayload.email }).exec();
            if (!exists) {
                await User_1.default.create(userPayload);
                logger_1.default.info('Seeded user %s', userPayload.email);
            }
        }
        const adminExists = await Admin_1.default.findOne({ email: 'admin@gmail.com' }).exec();
        if (!adminExists) {
            await Admin_1.default.create({ email: 'admin@gmail.com', password: '12345678' });
            logger_1.default.info('Seeded admin %s', 'admin@gmail.com');
        }
    };
    const [productCount, categoryCount, userCount, blogCount] = await Promise.all([
        Product_1.default.countDocuments(),
        Category_1.default.countDocuments(),
        User_1.default.countDocuments(),
        Blog_1.default.countDocuments()
    ]);
    if (!force && (productCount > 0 || categoryCount > 0 || userCount > 0)) {
        await ensureDefaultUsers();
        let added = 0;
        if (blogCount === 0) {
            const blogsWithIds = await buildBlogsWithIds();
            await Blog_1.default.insertMany(blogsWithIds);
            added = blogs.length;
        }
        else {
            // Top up missing blogs if some already exist
            for (const [index, blog] of blogs.entries()) {
                const slug = (0, slugify_1.default)(blog.title) || `blog-${index + 1}`;
                const exists = await Blog_1.default.findOne({ slug }).exec();
                if (!exists) {
                    const blogId = await (0, autoIncrement_1.getNextSequence)('blogs');
                    await Blog_1.default.create({ ...blog, slug, blogId });
                    added += 1;
                }
            }
        }
        logger_1.default.info('Existing data detected (products: %d, categories: %d, users: %d). Added %d blogs.', productCount, categoryCount, userCount, added);
        await mongoose_1.default.disconnect();
        return;
    }
    await Promise.all([
        User_1.default.deleteMany({}),
        Admin_1.default.deleteMany({}),
        Category_1.default.deleteMany({}),
        Product_1.default.deleteMany({}),
        Promotion_1.default.deleteMany({}),
        Blog_1.default.deleteMany({}),
        Counter_1.default.deleteMany({})
    ]);
    const admin = await Admin_1.default.create({ email: 'admin@gmail.com', password: '12345678' });
    const user = await User_1.default.create(defaultUser);
    await User_1.default.insertMany(extraUsers);
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
    const blogsWithIds = await buildBlogsWithIds();
    for (const blogDoc of blogsWithIds) {
        await Blog_1.default.create(blogDoc);
    }
    logger_1.default.info('Seeded blogs (%d)', blogs.length);
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
    for (const order of ordersPayload) {
        await Order_1.default.create(order);
    }
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
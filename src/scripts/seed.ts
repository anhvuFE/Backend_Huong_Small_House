import mongoose from 'mongoose';
import env from '../config/env';
import logger from '../utils/logger';
import User from '../models/User';
import Admin from '../models/Admin';
import Category from '../models/Category';
import Product from '../models/Product';
import Promotion from '../models/Promotion';
import Counter from '../models/Counter';

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

const seed = async (): Promise<void> => {
  await mongoose.connect(env.mongoUri);
  logger.info('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Admin.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Promotion.deleteMany({}),
    Counter.deleteMany({})
  ]);

  const admin = await Admin.create({ email: 'admin@gmail.com', password: '12345678' });
  const user = await User.create({
    name: 'Xanh Nguyen',
    email: 'xanh@gmail.com',
    password: '12345678',
    phone: '0987654321',
    address: '123 Nguyen Trai, Hanoi'
  });

  logger.info('Created admin %s and user %s', admin.email, user.email);

  const createdCategories = [] as Array<{ slug: string; categoryId: number }>;
  for (const category of categories) {
    const created = await Category.create(category);
    createdCategories.push({ slug: created.slug, categoryId: created.categoryId });
  }
  logger.info('Seeded %d categories', createdCategories.length);

  for (const product of products) {
    const category = createdCategories.find((c) => c.slug === product.categorySlug);
    if (!category) continue;
    await Product.create({
      name: product.name,
      brand: product.brand,
      categoryId: category.categoryId,
      description: product.description,
      price: product.price,
      stock: product.stock,
      images: product.images
    });
  }
  logger.info('Seeded products');

  await Promotion.insertMany(promotions);
  logger.info('Seeded promotions');

  await mongoose.disconnect();
  logger.info('Seed finished');
};

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });

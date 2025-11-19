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

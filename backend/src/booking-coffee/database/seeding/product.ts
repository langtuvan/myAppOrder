import { Product } from '../../product/schemas/product.schema';
import { CategorySeedData } from './category';

interface ProductSeed extends Omit<Product, '_id' | 'images' | 'category'> {
  _id: string;
  category: string; // reference to CategorySeedData _id
}

export const productSeedData: ProductSeed[] = [
  // Coffee 693187dcb1d786ad0201e2d0
  {
    _id: '693187dcb1d786ad0201e2d1',
    name: 'Phin Sữa Đá',
    description:
      'A compact and efficient smartphone with all the essential features.',
    price: 39000,
    category: '693187dcb1d786ad0201e2d0',
    stock: 35,
    sku: 'COF-001',
    isAvailable: true,
  },
  {
    _id: '693187dcb1d786ad0201e2d2',
    name: 'Phin Đen Đá',
    description: 'A powerful laptop for professionals and creatives.',
    price: 45000,
    category: '693187dcb1d786ad0201e2d0',
    stock: 20,
    sku: 'COF-002',
    isAvailable: true,
  },
  {
    _id: '693187dcb1d786ad0201e2d3',
    name: 'Bạc Xỉu',
    description: 'A versatile tablet for work and entertainment on the go.',
    price: 40000,
    category: '693187dcb1d786ad0201e2d0',
    stock: 15,
    sku: 'COF-003',
    isAvailable: true,
  },
  // phidi 693187dcb1d786ad0201e2d1
  {
    _id: '693187dcb1d786ad0201e2d4',
    name: 'PhinDi Hạnh Nhân',
    description: 'A set of wireless earbuds with excellent sound quality.',
    price: 60000,
    category: '693187dcb1d786ad0201e2d1',
    stock: 50,
    sku: 'PDI-001',
    isAvailable: true,
  },
  {
    _id: '693187dcb1d786ad0201e2d5',
    name: 'PhinDi Kem Sữa',
    description: 'A stylish smartwatch with fitness tracking features.',
    price: 75000,
    category: '693187dcb1d786ad0201e2d1',
    stock: 30,
    sku: 'PDI-002',
    isAvailable: true,
  },
  {
    _id: '693187dcb1d786ad0201e2d6',
    name: 'PhinDi Socola',
    description: 'A high-capacity power bank for charging devices on the go.',
    price: 50000,
    category: '693187dcb1d786ad0201e2d1',
    stock: 40,
    sku: 'PDI-003',
    isAvailable: true,
  },
  // Tea 693187dcb1d786ad0201e2d2
  {
    _id: '693187dcb1d786ad0201e2d7',
    name: 'Trà Sen Vàng',
    description:
      'A selection of premium loose-leaf teas from around the world.',
    price: 55000,
    category: '693187dcb1d786ad0201e2d2',
    stock: 25,
    sku: 'TEA-001',
    isAvailable: true,
  },
  {
    _id: '693187dcb1d786ad0201e2d8',
    name: 'Trà Thạch Đào',
    description: 'A compact Bluetooth speaker with rich sound quality.',
    price: 65000,
    category: '693187dcb1d786ad0201e2d2',
    stock: 18,
    sku: 'TEA-002',
    isAvailable: true,
  },
  {
    _id: '693187dcb1d786ad0201e2d9',
    name: 'Trà Thạch Vải',
    description: 'A durable and stylish laptop backpack for everyday use.',
    price: 70000,
    category: '693187dcb1d786ad0201e2d2',
    stock: 22,
    sku: 'TEA-003',
    isAvailable: true,
  },
  {
    _id: '693187dcb1d786ad0201e2da',
    name: 'Trà Xanh Đậu Đỏ',
    description:
      'A set of high-quality kitchen knives for all your cooking needs.',
    price: 80000,
    category: '693187dcb1d786ad0201e2d2',
    stock: 12,
    sku: 'TEA-004',
    isAvailable: true,
  },
  // Freeze 693187dcb1d786ad0201e2d3
  {
    _id: '693187dcb1d786ad0201e2db',
    name: 'Kem Trà Xanh',
    description:
      'A high-performance gaming console for immersive entertainment.',
    price: 90000,
    category: '693187dcb1d786ad0201e2d3',
    stock: 10,
    sku: 'FRZ-001',
    isAvailable: true,
  },
  {
    _id: '693187dcb1d786ad0201e2dc',
    name: 'Caramen Phin Freeze',
    description:
      'A comfortable and ergonomic office chair for long work hours.',
    price: 85000,
    category: '693187dcb1d786ad0201e2d3',
    stock: 14,
    sku: 'FRZ-002',
    isAvailable: true,
  },
  {
    _id: '693187dcb1d786ad0201e2dd',
    name: 'Cookies and Cream',
    description: 'A versatile DSLR camera for capturing stunning photos.',

    price: 95000,
    category: '693187dcb1d786ad0201e2d3',
    stock: 8,
    sku: 'FRZ-003',
    isAvailable: true,
  },
  {
    _id: '693187dcb1d786ad0201e2de',
    name: 'Freeze Socola',
    description: 'A smart home assistant for managing your connected devices.',
    price: 80000,
    category: '693187dcb1d786ad0201e2d3',
    stock: 16,
    sku: 'FRZ-004',
    isAvailable: true,
  },
  {
    _id: '693187dcb1d786ad0201e2df',
    name: 'Classic Phin Freeze',
    description:
      'A high-quality 4K UHD television for an immersive viewing experience.',
    price: 110000,
    category: '693187dcb1d786ad0201e2d3',
    stock: 10,
    sku: 'FRZ-005',
    isAvailable: true,
  },
  // Bánh 693187dcb1d786ad0201e2d4
  {
    _id: '693187dcb1d786ad0201e2e0',
    name: 'Bánh Mì Patê',
    description: 'A versatile blender for smoothies, soups, and more.',
    price: 40000,
    category: '693187dcb1d786ad0201e2d4',
    stock: 30,
    sku: 'BNH-001',
    isAvailable: true,
  },
  {
    _id: '693187dcb1d786ad0201e2e1',
    name: 'Bánh Gà Phô Mai',
    description: 'A reliable and efficient vacuum cleaner for a spotless home.',
    price: 45000,
    category: '693187dcb1d786ad0201e2d4',
    stock: 25,
    sku: 'BNH-002',
    isAvailable: true,
  },
  {
    _id: '693187dcb1d786ad0201e2e2',
    name: 'Bò xốt phô mai',
    description: 'A comfortable and stylish pair of wireless headphones.',
    price: 50000,
    category: '693187dcb1d786ad0201e2d4',
    stock: 20,
    sku: 'BNH-003',
    isAvailable: true,
  },
];

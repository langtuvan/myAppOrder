import { ProductService } from '../../product-service/schemas/product-service.schema';
import { CategorySeedData } from './category';

const productServicesSeed: ProductService[] = [
  //   _id: '693187dcb1d786ad0201e2c3',
  //  name: 'Coffee in Bed',
  {
    _id: '648f1b2f5e3a2c00123abcd1',
    category: CategorySeedData[0]._id,
    name: { en: 'Little Recharge', vi: 'Nạp lại nhỏ' },
    description: {
      en: 'A small recharge service for your devices.',
      vi: 'Dịch vụ nạp lại nhỏ cho thiết bị của bạn.',
    },
    price: 35000,
    isActive: true,
    duration: 60,
  },
  {
    _id: '648f1b2f5e3a2c00123abcd2',
    category: CategorySeedData[0]._id,
    name: { en: 'Take a Break', vi: 'Nghỉ ngơi' },
    description: {
      en: 'Relax and unwind with break service.',
      vi: 'Thư giãn và nghỉ ngơi với dịch vụ nghỉ ngơi',
    },
    price: 45000,
    isActive: true,
    duration: 240,
  },
  {
    _id: '648f1b2f5e3a2c00123abcd3',
    category: CategorySeedData[0]._id,
    name: { en: 'Mini Staycation', vi: 'Kỳ nghỉ ngắn' },
    description: {
      en: 'A short nap service to recharge your energy.',
      vi: 'Dịch vụ ngủ trưa ngắn để tăng cường năng lượng của bạn.',
    },
    price: 75000,
    isActive: true,
    duration: 120,
  },
  {
    _id: '648f1b2f5e3a2c00123abcd4',
    category: CategorySeedData[0]._id,
    name: { en: 'One Day Getaway', vi: 'Nạp lại đầy đủ' },
    description: {
      en: 'A full recharge service for your devices and mind.',
      vi: 'Dịch vụ nạp lại đầy đủ cho thiết bị và tâm trí của bạn.',
    },
    price: 85000,
    isActive: true,
    duration: 180,
  },
  {
    _id: '648f1b2f5e3a2c00123abcd5',
    category: CategorySeedData[0]._id,
    name: { en: 'Weekend Retreat', vi: 'Nghỉ dưỡng cuối tuần' },
    description: {
      en: 'A weekend getaway service to refresh your body and mind.',
      vi: 'Dịch vụ nghỉ dưỡng cuối tuần để làm mới cơ thể và tâm trí của bạn.',
    },
    price: 120000,
    isActive: true,
    duration: 360,
  },
  //  _id: '693187dcb1d786ad0201e2c5',
  //  name: 'Level Seat',
  {
    _id: '648f1b2f5e3a2c00123abcd6',
    category: CategorySeedData[2]._id,
    name: { en: 'Take a Break', vi: 'Nghỉ ngơi' },
    description: {
      en: 'A comfortable basic seat for your work or study needs.',
      vi: 'Một chiếc ghế cơ bản thoải mái cho nhu cầu làm việc hoặc học tập của bạn.',
    },
    price: 55000,
    isActive: true,
    duration: 240,
  },
  {
    _id: '648f1b2f5e3a2c00123abcd7',
    category: CategorySeedData[2]._id,
    name: { en: 'Mini Staycation', vi: 'Kỳ nghỉ ngắn' },
    description: {
      en: 'An upgraded premium seat for enhanced comfort and support.',
      vi: 'Một chiếc ghế cao cấp nâng cấp cho sự thoải mái và hỗ trợ tốt hơn.',
    },
    price: 65000,
    isActive: true,
    duration: 300,
  },
  {
    _id: '648f1b2f5e3a2c00123abcd8',
    category: CategorySeedData[2]._id,
    name: { en: 'Little Recharge', vi: 'Ghế cơ bản' },
    description: {
      en: 'A comfortable basic seat for your work or study needs.',
      vi: 'Một chiếc ghế cơ bản thoải mái cho nhu cầu làm việc hoặc học tập của bạn.',
    },
    price: 40000,
    isActive: true,
    duration: 180,
  },
];

export default productServicesSeed;

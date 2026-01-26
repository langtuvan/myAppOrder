import {
  Amenity,
  AmenityStatus,
} from '../../amenities/schemas/amenities.schema';
import { LANGGUAGE } from '../variable';

export const AmenitiesData: Amenity[] = [
  // General Amenities
  {
    _id: '64b7f0f5c2a1f2a5d6e8b123',
    code: 'wifi',
    name: { [LANGGUAGE.EN]: 'Wi-Fi', [LANGGUAGE.VI]: 'Wi-Fi' },
    description: {
      [LANGGUAGE.EN]: 'Wifi',
      [LANGGUAGE.VI]: 'Wifi',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  {
    _id: '64b7f0f5c2a1f2a5d6e8b124',
    code: 'bed-and-mattress',
    name: { [LANGGUAGE.EN]: 'Bed and Mattress', [LANGGUAGE.VI]: 'Giường nệm' },
    description: {
      [LANGGUAGE.EN]: 'Bed and Mattress',
      [LANGGUAGE.VI]: ' Giường nệm',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  {
    _id: '64b7f0f5c2a1f2a5d6e8b125',
    code: 'clock',
    name: {
      [LANGGUAGE.EN]: 'Clock',
      [LANGGUAGE.VI]: 'Đồng hồ',
    },
    description: {
      [LANGGUAGE.EN]: 'Clock',
      [LANGGUAGE.VI]: 'Đồng hồ',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  // Hotel Amenities
  {
    _id: '64b7f0f5c2a1f2a5d6e8b126',
    code: 'soft-blanket',
    name: { [LANGGUAGE.EN]: 'Soft Blanket', [LANGGUAGE.VI]: 'Chăn Mềm' },
    description: {
      [LANGGUAGE.EN]: 'Soft blanket for comfort',
      [LANGGUAGE.VI]: 'Chăn mềm để thoải mái',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  {
    _id: '64b7f0f5c2a1f2a5d6e8b127',
    code: 'tissue-paper',
    name: {
      [LANGGUAGE.EN]: 'Tissue Paper',
      [LANGGUAGE.VI]: 'Khăn giấy',
    },
    description: {
      [LANGGUAGE.EN]: 'Tissue paper for hygiene',
      [LANGGUAGE.VI]: 'Khăn giấy để vệ sinh',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  {
    _id: '64b7f0f5c2a1f2a5d6e8b128',
    code: 'tea-table',
    name: {
      [LANGGUAGE.EN]: 'Tea Table',
      [LANGGUAGE.VI]: 'Bàn trà',
    },
    description: {
      [LANGGUAGE.EN]: 'Tea table for serving',
      [LANGGUAGE.VI]: 'Bàn trà để phục vụ',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  {
    _id: '64b7f0f5c2a1f2a5d6e8b129',
    code: 'cushion',
    name: { [LANGGUAGE.EN]: 'Cushion', [LANGGUAGE.VI]: 'Gối tựa' },
    description: {
      [LANGGUAGE.EN]: 'Cushion for comfort',
      [LANGGUAGE.VI]: 'Gối tựa để thoải mái',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  // Coffee Shop Amenities
  {
    _id: '64b7f0f5c2a1f2a5d6e8b12d',
    code: 'work-desk',
    name: {
      [LANGGUAGE.EN]: 'Work Desk',
      [LANGGUAGE.VI]: 'Bàn làm việc',
    },
    description: {
      [LANGGUAGE.EN]: 'Work desk for productivity',
      [LANGGUAGE.VI]: 'Bàn làm việc để tăng năng suất',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  {
    _id: '64b7f0f5c2a1f2a5d6e8b12e',
    code: 'bathroom-tv',
    name: {
      [LANGGUAGE.EN]: 'Bathroom / TV',
      [LANGGUAGE.VI]: 'Phòng tắm / TV',
    },
    description: {
      [LANGGUAGE.EN]: 'Bathroom with TV',
      [LANGGUAGE.VI]: 'Phòng tắm có TV',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  {
    _id: '64b7f0f5c2a1f2a5d6e8b12f',
    code: 'fan',
    name: {
      [LANGGUAGE.EN]: 'Fan',
      [LANGGUAGE.VI]: 'Quạt',
    },
    description: {
      [LANGGUAGE.EN]: 'Fan for air circulation',
      [LANGGUAGE.VI]: 'Quạt để lưu thông không khí',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  {
    _id: '64b7f0f5c2a1f2a5d6e8b130',
    code: 'power-outlet',
    name: {
      [LANGGUAGE.EN]: 'Power Outlet',
      [LANGGUAGE.VI]: 'Ổ điện',
    },
    description: {
      [LANGGUAGE.EN]: 'Power outlet for charging devices',
      [LANGGUAGE.VI]: 'Ổ điện để sạc thiết bị',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  {
    _id: '64b7f0f5c2a1f2a5d6e8b131',
    code: 'mineral-water',
    name: {
      [LANGGUAGE.EN]: 'Mineral Water',
      [LANGGUAGE.VI]: 'Nước suối',
    },
    description: {
      [LANGGUAGE.EN]: 'Bottled mineral water',
      [LANGGUAGE.VI]: 'Nước khoáng đóng chai',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  {
    _id: '64b7f0f5c2a1f2a5d6e8b132',
    code: 'reading-lamp',
    name: {
      [LANGGUAGE.EN]: 'Reading Lamp',
      [LANGGUAGE.VI]: 'Đèn đọc sách',
    },
    description: {
      [LANGGUAGE.EN]: 'Reading lamp for better visibility',
      [LANGGUAGE.VI]: 'Đèn đọc sách để nhìn rõ hơn',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  // liên hệ nhân viên
  {
    _id: '64b7f0f5c2a1f2a5d6e8b133',
    code: 'contact-staff',
    name: {
      [LANGGUAGE.EN]: 'Contact Staff',
      [LANGGUAGE.VI]: 'Liên hệ nhân viên',
    },
    description: {
      [LANGGUAGE.EN]: 'Contact staff for assistance',
      [LANGGUAGE.VI]: 'Liên hệ nhân viên để được hỗ trợ',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  // giấy a4 ,a5
  {
    _id: '64b7f0f5c2a1f2a5d6e8b134',
    code: 'a4-a5-paper',
    name: {
      [LANGGUAGE.EN]: 'A4/A5 Paper',
      [LANGGUAGE.VI]: 'Giấy A4/A5',
    },
    description: {
      [LANGGUAGE.EN]: 'A4 and A5 size paper',
      [LANGGUAGE.VI]: 'Giấy kích thước A4 và A5',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  // nước sát khuẩn
  {
    _id: '64b7f0f5c2a1f2a5d6e8b135',
    code: 'hand-sanitizer',
    name: {
      [LANGGUAGE.EN]: 'Hand Sanitizer',
      [LANGGUAGE.VI]: 'Nước sát khuẩn',
    },
    description: {
      [LANGGUAGE.EN]: 'Hand sanitizer for hygiene',
      [LANGGUAGE.VI]: 'Nước sát khuẩn để vệ sinh',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  // máy chiếu
  {
    _id: '64b7f0f5c2a1f2a5d6e8b136',
    code: 'projector',
    name: {
      [LANGGUAGE.EN]: 'Projector',
      [LANGGUAGE.VI]: 'Máy chiếu',
    },
    description: {
      [LANGGUAGE.EN]: 'Projector for presentations',
      [LANGGUAGE.VI]: 'Máy chiếu để thuyết trình',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  // bút
  {
    _id: '64b7f0f5c2a1f2a5d6e8b137',
    code: 'pen',
    name: {
      [LANGGUAGE.EN]: 'Pen',
      [LANGGUAGE.VI]: 'Bút',
    },
    description: {
      [LANGGUAGE.EN]: 'Pen for writing',
      [LANGGUAGE.VI]: 'Bút để viết',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  // nước suối, trà đá miễn phí
  {
    _id: '64b7f0f5c2a1f2a5d6e8b138',
    code: 'free-drinks',
    name: {
      [LANGGUAGE.EN]: 'Free Drinks',
      [LANGGUAGE.VI]: 'Nước uống miễn phí',
    },
    description: {
      [LANGGUAGE.EN]: 'Free bottled water and iced tea',
      [LANGGUAGE.VI]: 'Nước suối đóng chai và trà đá miễn phí',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  // máy lạnh
  {
    _id: '64b7f0f5c2a1f2a5d6e8b139',
    code: 'air-conditioner',
    name: {
      [LANGGUAGE.EN]: 'Air Conditioner',
      [LANGGUAGE.VI]: 'Máy lạnh',
    },
    description: {
      [LANGGUAGE.EN]: 'Air conditioner for cooling',
      [LANGGUAGE.VI]: 'Máy lạnh để làm mát',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  // bàn ghế
  {
    _id: '64b7f0f5c2a1f2a5d6e8b13a',
    code: 'tables-and-chairs',
    name: {
      [LANGGUAGE.EN]: 'Tables and Chairs',
      [LANGGUAGE.VI]: 'Bàn ghế',
    },
    description: {
      [LANGGUAGE.EN]: 'Tables and chairs for seating',
      [LANGGUAGE.VI]: 'Bàn ghế để ngồi',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
  // máy in, scanner
  {
    _id: '64b7f0f5c2a1f2a5d6e8b13b',
    code: 'printer-scanner',
    name: {
      [LANGGUAGE.EN]: 'Printer / Scanner',
      [LANGGUAGE.VI]: 'Máy in / Scanner',
    },
    description: {
      [LANGGUAGE.EN]: 'Printer / Scanner for printing documents',
      [LANGGUAGE.VI]: 'Máy in / Scanner để in tài liệu',
    },
    status: AmenityStatus.ON,
    isActive: true,
  },
];

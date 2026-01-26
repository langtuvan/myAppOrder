import { Faculty } from '../../faculty/schemas/faculty.schema';
import { LANGGUAGE } from '../variable';

const brandName = 'Nobita Coffee';
export const FacultyIds = [
  '69317c85b1d786ad0201e2b1',
  '69317c85b1d786ad0201e2b2',
  '69317c85b1d786ad0201e2b3',
  '69317c85b1d786ad0201e2b4',
];

// name is brandName + branch location
const generateName = (location: string) => {
  return `${brandName} ${location}`;
};

const faculties: Faculty[] = [
  {
    // object id
    _id: FacultyIds[0],
    code: 'central',
    name: {
      [LANGGUAGE.EN]: generateName('Le Dai Hanh'),
      [LANGGUAGE.VI]: generateName('Lê Đại Hành'),
    },
    department: 'central',
    dean: 'Dr. John Smith',
    deanEmail: 'john.smith@university.edu',
    deanPhone: '+1-555-1234',
    description: {
      [LANGGUAGE.EN]:
        'The main library of the university, offering extensive resources and study spaces.',
      [LANGGUAGE.VI]:
        'Thư viện chính của trường đại học, cung cấp nhiều tài nguyên và không gian học tập.',
    },
    location: {
      [LANGGUAGE.EN]: '123 University Ave, City, Country',
      [LANGGUAGE.VI]: '123 Đại lộ Đại học, Thành phố, Quốc gia',
    },
    isActive: true,
    rooms: [],
    head: null,
    totalRooms: 2,
  },
  {
    _id: FacultyIds[1],
    code: 'espresso-corner',
    name: {
      [LANGGUAGE.EN]: generateName('Lac Long Quan'),
      [LANGGUAGE.VI]: generateName('Lạc Long Quân'),
    },
    department: 'café',
    dean: 'Ms. Emma Wilson',
    deanEmail: 'emma.wilson@espressocorner.com',
    deanPhone: '+1-555-3456',
    description: {
      [LANGGUAGE.EN]:
        'Premium coffee shop featuring specialty espresso drinks, pastries, and a comfortable seating area for remote work and meetings.',
      [LANGGUAGE.VI]:
        'Quán cà phê cao cấp với các thức uống espresso đặc biệt, bánh nướng, và khu vực ngồi thoải mái cho làm việc từ xa và họp.',
    },
    location: {
      [LANGGUAGE.EN]: '456 Main Street, Downtown District',
      [LANGGUAGE.VI]: '456 Đường Chính, Quận Trung tâm',
    },
    isActive: true,
    rooms: [],
    head: null,
    totalRooms: 3,
  },
  {
    _id: FacultyIds[2],
    code: 'brew-hub',
    name: {
      [LANGGUAGE.EN]: generateName('Brew Hub'),
      [LANGGUAGE.VI]: generateName('Brew Hub'),
    },
    department: 'café',
    dean: 'Mr. Michael Chen',
    deanEmail: 'michael.chen@brewhub.com',
    deanPhone: '+1-555-7890',
    description: {
      [LANGGUAGE.EN]:
        'Artisanal coffee roastery and café with barista training workshops, single-origin beans, and coffee equipment retail.',
      [LANGGUAGE.VI]:
        'Tiệm rang cà phê thủ công và quán cà phê với các hội thảo đào tạo barista, hạt cà phê nguyên gốc, và bán lẻ thiết bị cà phê.',
    },
    location: {
      [LANGGUAGE.EN]: 'Brew Hub Complex, 789 Coffee Lane, Industrial Zone',
      [LANGGUAGE.VI]: 'Khu Brew Hub, 789 Đường Cà phê, Khu Công nghiệp',
    },
    isActive: true,
    rooms: [],
    head: null,
    totalRooms: 4,
  },
  {
    _id: FacultyIds[3],
    code: 'aeon-mall',
    name: {
      [LANGGUAGE.EN]: generateName('Aeon Mall'),
      [LANGGUAGE.VI]: generateName('Aeon Mall'),
    },
    department: 'café',
    dean: 'Mr. David Lee',
    deanEmail: 'david.lee@aeonmall.com',
    deanPhone: '+1-555-5678',
    description: {
      [LANGGUAGE.EN]:
        'Modern coffee shop with fast service and quality beverages in a shopping mall setting.',
      [LANGGUAGE.VI]:
        'Quán cà phê hiện đại với dịch vụ nhanh chóng và đồ uống chất lượng trong môi trường trung tâm mua sắm.',
    },
    location: {
      [LANGGUAGE.EN]: 'Aeon Mall, Floor 3, Café Zone',
      [LANGGUAGE.VI]: 'Aeon Mall, Tầng 3, Khu Cà phê',
    },
    isActive: true,
    rooms: [],
    head: null,
    totalRooms: 3,
  },
];

export default faculties;

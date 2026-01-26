import { Room, RoomStatus, RoomType } from '../../room/schemas/room.schema';
import { LANGGUAGE } from '../variable';
import { FacultyIds } from './faculties';

const roomIds = [
  '79317c85b1d786ad0201e2b1',
  '79317c85b1d786ad0201e2b2',
  '79317c85b1d786ad0201e2b3',
  '79317c85b1d786ad0201e2b4',
  '79317c85b1d786ad0201e2b5',
  '79317c85b1d786ad0201e2b6',
  '79317c85b1d786ad0201e2b7',
  '79317c85b1d786ad0201e2b8',
  '79317c85b1d786ad0201e2b9',
];

const rooms: Room[] = [
  // Central Library Rooms
  {
    _id: roomIds[0],
    faculty: FacultyIds[0],
    code: 'central-reception',
    roomNumber: 'R-001',
    name: {
      [LANGGUAGE.EN]: 'Room 101',
      [LANGGUAGE.VI]: 'Phòng 101',
    },
    type: RoomType.STORE,
    capacity: 10,
    status: RoomStatus.ON,
    floor: 1,
    building: 'A',
    amenities: ['Reception Desk', 'Waiting Area', 'Computer Terminal'],
    description: 'Main reception area for customer service',
  },
  {
    _id: roomIds[1],
    faculty: FacultyIds[0],
    code: 'central-repair',
    roomNumber: 'R-002',
    name: {
      [LANGGUAGE.EN]: 'Room 102',
      [LANGGUAGE.VI]: 'Phòng 102',
    },
    type: RoomType.STORE,
    capacity: 5,
    status: RoomStatus.ON,
    floor: 1,
    building: 'A',
    amenities: ['Workbenches', 'Repair Tools', 'Testing Equipment'],
    description: 'Main repair and diagnostic workshop',
  },

  // Aeon Mall Rooms
  {
    _id: roomIds[2],
    faculty: FacultyIds[3],
    code: 'aeon-reception',
    roomNumber: 'AM-101',
    name: {
      [LANGGUAGE.EN]: 'Room 101',
      [LANGGUAGE.VI]: 'Phòng 101',
    },
    type: RoomType.STORE,
    capacity: 8,
    status: RoomStatus.ON,
    floor: 3,
    building: 'Aeon Mall',
    amenities: ['Service Counter', 'Display Monitors', 'Seating Area'],
    description: 'Customer reception and consultation area',
  },
  {
    _id: roomIds[3],
    faculty: FacultyIds[3],
    code: 'aeon-repair-1',
    roomNumber: 'AM-102',
    name: {
      [LANGGUAGE.EN]: 'Repair Workshop',
      [LANGGUAGE.VI]: 'Xưởng sửa chữa',
    },
    type: RoomType.STORE,
    capacity: 4,
    status: RoomStatus.ON,
    floor: 3,
    building: 'Aeon Mall',
    amenities: ['Repair Tools', 'Testing Equipment', 'Parts Storage'],
    description: 'Primary repair and maintenance station',
  },
  {
    _id: roomIds[4],
    faculty: FacultyIds[3],
    code: 'aeon-storage',
    roomNumber: 'AM-103',
    name: {
      [LANGGUAGE.EN]: 'Storage Room',
      [LANGGUAGE.VI]: 'Phòng lưu trữ',
    },
    type: RoomType.STORE,
    capacity: 2,
    status: RoomStatus.ON,
    floor: 3,
    building: 'Aeon Mall',
    amenities: ['Shelving Units', 'Inventory System', 'Climate Control'],
    description: 'Storage room for computer parts and accessories',
  },

  // Vincom Plaza Rooms
  {
    _id: roomIds[5],
    faculty: FacultyIds[4],
    code: 'vincom-reception',
    roomNumber: 'VC-201',
    name: {
      [LANGGUAGE.EN]: 'Room 201',
      [LANGGUAGE.VI]: 'Phòng 201',
    },
    type: RoomType.STORE,
    capacity: 6,
    status: RoomStatus.ON,
    floor: 2,
    building: 'Vincom Plaza',
    amenities: ['Service Counter', 'Customer Seating', 'Digital Display'],
    description: 'Front desk and customer consultation area',
  },
  {
    _id: roomIds[6],
    faculty: FacultyIds[4],
    code: 'vincom-repair-1',
    roomNumber: 'VC-202',
    name: {
      [LANGGUAGE.EN]: 'Repair Workshop 1',
      [LANGGUAGE.VI]: 'Xưởng sửa chữa 1',
    },
    type: RoomType.STORE,
    capacity: 5,
    status: RoomStatus.ON,
    floor: 2,
    building: 'Vincom Plaza',
    amenities: ['Workstations', 'Diagnostic Tools', 'Testing Devices'],
    description: 'Main repair and diagnostic workshop',
  },
  {
    _id: roomIds[7],
    faculty: FacultyIds[4],
    code: 'vincom-repair-2',
    roomNumber: 'VC-203',
    name: {
      [LANGGUAGE.EN]: 'Repair Workshop 2',
      [LANGGUAGE.VI]: 'Xưởng sửa chữa 2',
    },

    type: RoomType.STORE,
    capacity: 5,
    status: RoomStatus.ON,
    floor: 2,
    building: 'Vincom Plaza',
    amenities: ['Advanced Tools', 'Component Testing', 'Soldering Station'],
    description: 'Advanced repair station for complex issues',
  },
  {
    _id: roomIds[8],
    faculty: FacultyIds[4],
    code: 'vincom-storage',
    roomNumber: 'VC-204',
    name: {
      [LANGGUAGE.EN]: 'Storage Room',
      [LANGGUAGE.VI]: 'Phòng lưu trữ',
    },
    type: RoomType.STORE,
    capacity: 2,
    status: RoomStatus.ON,
    floor: 2,
    building: 'Vincom Plaza',
    amenities: ['Storage Racks', 'Inventory Management', 'Security System'],
    description: 'Parts and accessories inventory storage',
  },
];

export default rooms;

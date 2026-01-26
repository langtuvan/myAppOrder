import { ProductService } from '../../product-service/schemas/product-service.schema';
import { Booking, BookingStatus } from '../schemas/booking.schema';

export class BookingResponseDto {
  _id: string;
  trackingNumber: string;
  items: { productId: ProductService; quantity: number; price: number }[];
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  faculty: any;
  date: string;
  hour: number;
  minute: number;
  notes: string;
  status?: BookingStatus;

  constructor(booking: Booking) {
    this._id = booking._id;
    this.trackingNumber = booking.trackingNumber;
    this.items = booking.items;
    this.customerId = booking.customerId;
    this.customerName = booking.customerName;
    this.customerEmail = booking.customerEmail;
    this.customerPhone = booking.customerPhone;
    this.faculty = booking.faculty;
    this.date = booking.date;
    this.hour = booking.hour;
    this.minute = booking.minute;
    this.notes = booking.notes;
    this.status = booking.status;
  }
}

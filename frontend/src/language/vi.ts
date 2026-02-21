import { en } from "./en";

export const vi: typeof en = {
  common: {
    save: "Lưu",
    update: "Cập Nhật",
    back: "Quay Lại",
    list: "Danh Sách",
    edit: "Chỉnh Sửa",
    add: "Thêm Mới",
    manage: "Quản Lý",
    active: "Hoạt Động",
    inactive: "Không Hoạt Động",
  },
  welcome: "Chào mừng",
  inventory: {
    inventory: {
      title: "Tồn Kho",
      list: "Tồn Kho Hiện Tại",
      form: {
        product: "Mặt Hàng",
        warehouse: "Kho",
        quantity: "Số Lượng",
        isActive: "Hoạt động",
      },
    },
    categories: {
      title: "Phân Loại Mặt Hàng",
      list: "Danh Sách Phân Loại Mặt Hàng",
      form: {
        type: "Loại Phân Loại",
        name: "Tên Phân Loại",
        description: "Mô Tả",
        images: "Hình Ảnh",
        isActive: "Hoạt Động",
        createdAt: "Ngày Tạo",
        updatedAt: "Ngày Cập Nhật",
      },
    },
    products: {
      title: "Mặt Hàng",
      list: "Danh Sách Mặt Hàng",
      form: {
        name: "Tên Mặt Hàng",
        category: "Phân Loại",
        price: "Giá",
      },
    },
    warehouses: {
      title: "Kho",
      list: "Quản Lý Kho",
      form: {
        name: "Tên Kho",
        location: "Vị trí",
        description: "Mô tả",
        isActive: "Hoạt động",
      },
    },
    suppliers: {
      title: "Nhà Cung Cấp",
      list: "Quản Lý Nhà Cung Cấp",
      form: {
        name: "Tên Nhà Cung Cấp",
        contactPerson: "Thông Tin Liên Hệ",
        email: "Email",
        phone: "Số Điện Thoại",
        address: "Địa Chỉ",
        city: "Thành Phố",
        country: "Quốc Gia",
        postalCode: "Mã Bưu Điện",
        companyName: "Tên Công Ty",
        taxId: "Mã Số Thuế",
        description: "Mô tả",
        isActive: "Hoạt động",
      },
    },
    goodsReceipts: {
      title: "Nhập Kho",
      list: "Danh Sách Nhập Kho",
      form: {},
    },
  },
  system: {
    users: {
      title: "Người Dùng",
      list: "Danh Sách Người Dùng",
      form: {},
    },
    roles: {
      title: "Vai Trò",
      list: "Danh Sách Vai Trò",
      form: {
        name: "Tên Vai Trò",
        description: "Mô Tả",
        permissions: "Quyền Hạn",
        isActive: "Hoạt Động",
        createdAt: "Ngày Tạo",
        updatedAt: "Ngày Cập Nhật",
        deleted: "Đã Xóa",
        _id: "ID",
        id: "ID",
      },
    },
  },
};

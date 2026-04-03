import { type User } from "@/types/user";
import { type Category } from "@/types/category";
import { Product } from "@/types/product";
import { Inventory } from "@/types/inventory";
import { Warehouse } from "@/types/warehouse";
import { Supplier } from "@/types/supplier";
import { GoodsReceipt } from "@/types/goodReceipt";
import { IssueReceipt, IssueReceiptItem } from "@/types/issueReceipt";
import { Role } from "@/types/role";

type Language = {
  common: {
    save: string;
    back: string;
    list: string;
    add: string;
    edit: string;
    manage: string;
    update: string;
    active: string;
    inactive: string;
  };
  welcome: string;
  admin: {
    navigation: any;
    order: {
      orderList: string;
      addOrder: string;
    }
    inventory: {
      name: string;
      navigation: any;
      categories: {
        title: string;
        list: string;
        column: Record<keyof Category, string>;
      };
      products: {
        title: string;
        list: string;
        column: Record<keyof Product, string>;
      };
      inventory: {
        title: string;
        list: string;
        column: Record<keyof Inventory, string>;
      };
      warehouses: {
        title: string;
        list: string;
        column: Record<keyof Warehouse, string>;
      };
      suppliers: {
        title: string;
        list: string;
        column: Record<keyof Supplier, string>;
      };
      goodsReceipts: {
        title: string;
        list: string;
        column: Record<keyof GoodsReceipt, string>;
      };
      issueReceipts: {
        title: string;
        list: string;
        column: Record<keyof IssueReceipt, string>;
      };
    };
    system: {
      name: string;
      navigation: any;
      users: {
        title: string;
        list: string;
        column: Record<keyof User, string>;
      };
      roles: {
        title: string;
        list: string;
        column: Record<keyof Role, string>;
      };
    };
  };
  validation: any;
};

export const en: Language = {
  common: {
    save: "Save",
    back: "Back",
    list: "List",
    add: "Add",
    edit: "Edit",
    manage: "Manage",
    update: "Update",
    active: "Active",
    inactive: "Inactive",
  },
  welcome: "Welcome",
  admin: {
    navigation: {
      report: "Report",
      order: "Order",
      inventory: "Inventory",
      system: "System",
    },
    order: {
      orderList: "Order List",
      addOrder: "Add Order",
    },
    inventory: {
      name: "Inventory Management",
      navigation: {
        categories: "Categories",
        products: "Products",
        inventory: "Inventory",
        warehouses: "Warehouses",
        suppliers: "Suppliers",
        goodsReceipts: "Goods Receipts",
        issueReceipts: "Issue Receipts",
      },
      categories: {
        title: "Category",
        list: "Category List",
        column: {
          _id: "ID",
          type: "Type",
          name: "Category Name",
          description: "Description",
          images: "Images",
          isActive: "Is Active",
          createdAt: "Created At",
          updatedAt: "Updated At",
        },
      },
      products: {
        title: "Product",
        list: "Product List",
        column: {
          _id: "ID",
          name: "Product Name",
          description: "Description",
          category: "Category",
          isActive: "Is Active",
          createdAt: "Created At",
          updatedAt: "Updated At",
          price: "Price",
          images: "Images",
          imageSrc: "Image Source",
          sku: "SKU",
          stock: "Stock",
          isAvailable: "Is Available",
        },
      },
      inventory: {
        title: "Inventory",
        list: "Inventory List",
        column: {
          product: "Product",
          warehouse: "Warehouse",
          quantity: "Quantity",
          isActive: "Is Active",
          batchNumber: "Batch Number",
          expiryDate: "Expiry Date",
          notes: "Notes",
          maxStockLevel: "Max Stock Level",
          minStockLevel: "Min Stock Level",
          reservedQuantity: "Reserved Quantity",
          sku: "SKU",
          _id: "ID",
        },
      },
      warehouses: {
        title: "Warehouse",
        list: "Warehouses",
        column: {
          name: "Warehouse Name",
          location: "Location",
          description: "Description",
          isActive: "Is Active",
          _id: "ID",
        },
      },
      suppliers: {
        title: "Supplier",
        list: "Suppliers",
        column: {
          name: "Supplier Name",
          contactPerson: "Contact Person",
          email: "Email",
          phone: "Phone",
          address: "Address",
          city: "City",
          country: "Country",
          postalCode: "Postal Code",
          companyName: "Company Name",
          taxId: "Tax ID",
          description: "Description",
          isActive: "Is Active",
          _id: "ID",
        },
      },
      goodsReceipts: {
        title: "Goods Receipts",
        list: "Goods Receipts List",
        column: {
          supplier: "Supplier",
          note: "Note",
          _id: "ID",
          code: "Code",
          createdAt: "Created At",
          updatedAt: "Updated At",
          createdBy: "Created By",
          invoiceDate: "Invoice Date",
          invoiceNumber: "Invoice Number",
          items: "Items",
          status: "Status",
        },
      },
      issueReceipts: {
        title: "Issue Receipts",
        list: "Issue Receipts List",
        column: {
          _id: "ID",
          code: "Code",
          customer: "Customer",
          warehouse: "Warehouse",
          status: "Status",
          note: "Note",
          createdBy: "Created By",
          items: "Items",
          // delivery
          deliveryNote: "Delivery Note",
          deliveryDate: "Delivery Date",
          deliveryPrice: "Delivery Price",
        },
      },
    },
    system: {
      name: "System Management",
      navigation: {
        users: "Users",
        roles: "Roles",
      },
      users: {
        title: "User",
        list: "User List",
        column: {
          _id: "ID",
          name: "Name",
          email: "Email",
          role: "Role",
          isActive: "Is Active",
          createdAt: "Created At",
          updatedAt: "Updated At",
          address: "Address",
          age: "Age",
          deleted: "Deleted",
          gender: "Gender",
          id: "ID",
          password: "Password",
          refreshToken: "Refresh Token",
        },
      },
      roles: {
        title: "Role",
        list: "Role List",
        column: {
          _id: "ID",
          id: "ID",
          name: "Role Name",
          description: "Description",
          isActive: "Is Active",
          deleted: "Deleted",
          permissions: "Permissions",
          createdAt: "Created At",
          updatedAt: "Updated At",
        },
      },
    },
  },

  validation: {
    mixed: {
      required: "This field is required",
      oneOf: "Must be one of the following values: ${values}",
    },
    string: {
      length: "Must be exactly ${length} characters",
      min: "Must be at least ${min} characters",
      max: "Must be at most ${max} characters",
      email: "Must be a valid email address",
      url: "Must be a valid URL",
    },
    number: {
      min: "Must be greater than or equal to ${min}",
      max: "Must be less than or equal to ${max}",
      integer: "Must be an integer",
      positive: "Must be a positive number",
      negative: "Must be a negative number",
    },
  },
};

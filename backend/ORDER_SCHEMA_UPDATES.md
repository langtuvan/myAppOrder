# Order Schema Updates - Frontend-Backend Alignment

## Overview

Updated the backend order schema in `src/modules/orderItem/schemas/order.schema.ts` to match the frontend order types defined in `frontend/src/types/oder.ts`.

## Changes Made

### 1. **Added New Enums**

- `StatusColor`: Maps order statuses to color codes (red, yellow, blue, etc.)
- `All` status added to `OrderStatus` enum

### 2. **Added Helper Constants**

- `paymentMethods`: Array of available payment methods with metadata
  - Cash, eTransfer, QR Code
- `deliveryMethods`: Array of delivery options with pricing and turnaround information
  - None Delivery ($0)
  - Standard ($20,000, 3-5 business days)
  - Express ($30,000, 1-2 business days)

### 3. **Restructured Order Schema with Nested Objects**

#### Created `BillingInfo` nested schema

```typescript
{
  subTotal: number;
  deliveryPrice: number;
  discount: number;
  totalAmount: number;
  customerPay: number;
  customerPayCod: number;
}
```

#### Created `PaymentInfo` nested schema

```typescript
{
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentCardNumber?: string;
  paymentCode?: string;
}
```

#### Created `DeliveryInfo` nested schema

```typescript
{
  deliveryMethod?: DeliveryMethod;
  province?: string;
  ward?: string;
  address?: string;
  receiptPhone?: string;
  receiptNote?: string;
}
```

### 4. **Reorganized Order Class**

**New Structure:**

- `_id`: Order unique identifier (UUIDv7)
- `trackingNumber`: Optional tracking ID
- `orderType`: Website, In-Store, or Delivery
- `orderExport`: Quick or Normal export
- `items`: Array of OrderItems
- `notes`: Optional order notes
- `status`: Current order status
- `customer`: Reference to customer (replaces flat customer fields)
- `billing`: Nested BillingInfo object
- `payment`: Nested PaymentInfo object
- `delivery`: Nested DeliveryInfo object
- User references and timestamps

**Backward Compatibility:**

- Kept optional `customerName`, `customerPhone`, `customerEmail` fields for backward compatibility
- New `customer` field should be used for customer references going forward

### 5. **Updated OrderItem Class**

- Added optional `date` field for item-level timestamp tracking

### 6. **Updated Order Service**

#### Updated `calculateOrderTotals()` method

- Now accesses `billing.deliveryPrice` and `billing.discount` from nested objects
- Simplified calculation (removed separate taxes calculation)

#### Updated `create()` method

- Initialize nested `billing` and `payment` objects with defaults
- Assign values to nested structure (e.g., `payment.paymentStatus` instead of `root.paymentStatus`)
- Update billing totals before saving order
- Properly initialize payment info for different order types

## Migration Notes

### For DTOs

The DTOs in `src/modules/orderItem/dto/order.dto.ts` may need updating to reflect the new nested structure:

- Create nested DTOs for BillingInfoDto, PaymentInfoDto, DeliveryInfoDto
- Update CreateOrderDto to use these nested structures
- Update validation decorators accordingly

### For API Responses

Update response DTOs and transformers to work with the new nested structure.

### For Existing Data

- Existing orders in the database will continue to work due to backward-compatible fields
- Consider a migration script to normalize old flat fields into nested structure
- Plan data migration for `customerName/Phone/Email` → `customer` reference

### For Frontend Integration

The new schema structure now matches the frontend types exactly:

```typescript
// Order with properly structured billing, payment, and delivery info
{
  _id: "01HZKY7X5Q8B9J2M6N4P7R1S3T",
  orderType: "website",
  billing: {
    subTotal: 100000,
    deliveryPrice: 20000,
    discount: 5000,
    totalAmount: 115000,
    customerPay: 0,
    customerPayCod: 115000
  },
  payment: {
    paymentMethod: "cash",
    paymentStatus: "unpaid"
  },
  delivery: {
    deliveryMethod: "standard",
    province: "HCM",
    address: "123 Main St"
  }
}
```

## Files Modified

1. `backend/src/modules/orderItem/schemas/order.schema.ts`
   - Added new enums and constants
   - Created nested schema classes
   - Reorganized Order and OrderItem classes
   - Added schema factories for nested types

2. `backend/src/modules/orderItem/order.service.ts`
   - Updated `calculateOrderTotals()` to use nested structure
   - Updated `create()` method to initialize and populate nested objects
   - Updated DELIVERY order type handling

## Next Steps

1. Update orderItem DTOs to match nested structure
2. Update response transformers/mappers
3. Update tests to reflect new schema structure
4. Plan data migration for existing orders
5. Update API documentation
6. Test order creation and updating workflows

# Order Service - API Documentation

## Base URL
```
http://localhost:3004
```

---

## Order APIs

### 1. Create Order
```
Method: POST
URL: http://localhost:3004/orders
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "userId": "user-uuid-here",
  "shippingAddressId": "address-uuid-here",
  "items": [
    {
      "productId": "product-uuid-1",
      "productName": "Premium Wireless Headphones",
      "productSku": "HEADPHONES-001",
      "quantity": 2,
      "unitPrice": 299.99
    },
    {
      "productId": "product-uuid-2",
      "productName": "USB-C Cable",
      "productSku": "CABLE-001",
      "quantity": 1,
      "unitPrice": 19.99
    }
  ],
  "shippingCharge": 10.00,
  "tax": 0.00,
  "discount": 0.00
}
```

### 2. Get All Orders
```
Method: GET
URL: http://localhost:3004/orders
Query Parameters (optional):
  - userId: user-uuid (filter by user)
  - status: PENDING (filter by status)
  - paymentStatus: PAID (filter by payment status)
  - page: 1 (pagination)
  - limit: 10 (items per page)
Headers: None
Body: None
```

### 3. Get Order by ID
```
Method: GET
URL: http://localhost:3004/orders/order-uuid-here
Headers: None
Body: None
```

### 4. Get Order by Order Number
```
Method: GET
URL: http://localhost:3004/orders/number/ORD-1722768000000-1234
Headers: None
Body: None
```

### 5. Get Orders by User ID
```
Method: GET
URL: http://localhost:3004/orders/user/user-uuid-here
Headers: None
Body: None
```

### 6. Update Order
```
Method: PUT
URL: http://localhost:3004/orders/order-uuid-here
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "status": "CONFIRMED",
  "paymentStatus": "PAID",
  "shippingCharge": 15.00,
  "tax": 5.00,
  "discount": 10.00
}
```

### 7. Delete Order
```
Method: DELETE
URL: http://localhost:3004/orders/order-uuid-here
Headers: None
Body: None
```

### 8. Update Order Status
```
Method: PUT
URL: http://localhost:3004/orders/order-uuid-here/status
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "status": "SHIPPED"
}
```

Valid statuses: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED

### 9. Update Payment Status
```
Method: PUT
URL: http://localhost:3004/orders/order-uuid-here/payment-status
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "paymentStatus": "PAID"
}
```

Valid payment statuses: PENDING, PAID, FAILED, REFUNDED

### 10. Get Order Statistics
```
Method: GET
URL: http://localhost:3004/orders/statistics/summary
Query Parameters (optional):
  - userId: user-uuid (filter by user)
Headers: None
Body: None
```

---

## Order Status Flow

```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
          ↓
        CANCELLED
```

## Payment Status Flow

```
PENDING → PAID
          ↓
        FAILED
          ↓
        REFUNDED
```

---

## Important Notes

- **Order Numbers** are automatically generated in format: `ORD-{timestamp}-{random}`
- **Totals are automatically calculated**: subtotal, totalAmount
- **Order items are cascaded** when order is deleted
- **Unique constraints**: orderNumber is unique
- **Status validation**: Only valid status values are accepted
- **Transaction safety**: Order creation with items is atomic
- Use valid UUIDs for all ID parameters
- Service runs on **port 3004**

---

## Response Examples

### Create Order Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "orderNumber": "ORD-1722768000000-1234",
  "userId": "user-uuid-here",
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "totalItems": 3,
  "subtotal": 619.97,
  "shippingCharge": 10.00,
  "tax": 0.00,
  "discount": 0.00,
  "totalAmount": 629.97,
  "shippingAddressId": "address-uuid-here",
  "items": [
    {
      "id": "item-uuid-1",
      "orderId": "550e8400-e29b-41d4-a716-446655440000",
      "productId": "product-uuid-1",
      "productName": "Premium Wireless Headphones",
      "productSku": "HEADPHONES-001",
      "quantity": 2,
      "unitPrice": 299.99,
      "totalPrice": 599.98,
      "createdAt": "2026-08-04T12:00:00.000Z"
    }
  ],
  "createdAt": "2026-08-04T12:00:00.000Z",
  "updatedAt": "2026-08-04T12:00:00.000Z"
}
```

### Get All Orders Response
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "orderNumber": "ORD-1722768000000-1234",
      "userId": "user-uuid-here",
      "status": "PENDING",
      "paymentStatus": "PENDING",
      "totalItems": 3,
      "totalAmount": 629.97,
      "items": []
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Order Statistics Response
```json
{
  "totalOrders": 150,
  "pendingOrders": 25,
  "confirmedOrders": 30,
  "deliveredOrders": 80,
  "cancelledOrders": 15,
  "totalRevenue": 15000.00
}
```

---

## Testing Flow

### Recommended Testing Order:
1. **Create order** (API #1)
2. **Get order by ID** (API #3)
3. **Get order by order number** (API #4)
4. **Get orders by user** (API #5)
5. **Update order status** (API #8) to CONFIRMED
6. **Update payment status** (API #9) to PAID
7. **Get order statistics** (API #10)
8. **Update order** (API #6) to change shipping/tax
9. **Get all orders** (API #2) with filters
10. **Delete order** (API #7) - only for testing

---

## Error Handling

### Common Error Responses

**400 Bad Request - Invalid Data**
```json
{
  "statusCode": 400,
  "message": ["Validation error details"],
  "error": "Bad Request"
}
```

**404 Not Found - Order Not Found**
```json
{
  "statusCode": 404,
  "message": "Order not found",
  "error": "Not Found"
}
```

**400 Bad Request - Invalid Status**
```json
{
  "statusCode": 400,
  "message": "Invalid order status",
  "error": "Bad Request"
}
```

# Product Service - API Documentation

## Base URL
```
http://localhost:3003
```

---

## Product APIs

### 1. Create Product (Admin Only)
```
Method: POST
URL: http://localhost:3003/products
Headers: 
  Content-Type: application/json
  Authorization: Bearer <admin-jwt-token>
Body (raw JSON):
{
  "categoryId": "category-uuid-here",
  "name": "Premium Wireless Headphones",
  "slug": "premium-wireless-headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "sku": "HEADPHONES-001",
  "price": 299.99,
  "brand": "TechBrand",
  "thumbnail": "https://example.com/thumbnail.jpg",
  "weight": 0.5,
  "status": "ACTIVE"
}
```

### 2. Get All Products (Public)
```
Method: GET
URL: http://localhost:3003/products
Query Parameters (optional):
  - categoryId: category-uuid (filter by category)
  - status: ACTIVE (filter by status)
  - search: wireless (search in name, description, sku)
  - page: 1 (pagination)
  - limit: 10 (items per page)
Headers: None
Body: None
```

### 3. Get Product by ID (Public)
```
Method: GET
URL: http://localhost:3003/products/product-uuid-here
Headers: None
Body: None
```

### 4. Get Product by Slug (Public)
```
Method: GET
URL: http://localhost:3003/products/slug/premium-wireless-headphones
Headers: None
Body: None
```

### 5. Update Product (Admin Only)
```
Method: PUT
URL: http://localhost:3003/products/product-uuid-here
Headers: 
  Content-Type: application/json
  Authorization: Bearer <admin-jwt-token>
Body (raw JSON):
{
  "name": "Premium Wireless Headphones Pro",
  "price": 349.99,
  "status": "ACTIVE"
}
```

### 6. Delete Product (Admin Only)
```
Method: DELETE
URL: http://localhost:3003/products/product-uuid-here
Headers: 
  Authorization: Bearer <admin-jwt-token>
Body: None
```

### 7. Add Product Image (Admin Only)
```
Method: POST
URL: http://localhost:3003/products/product-uuid-here/images
Headers: 
  Content-Type: application/json
  Authorization: Bearer <admin-jwt-token>
Body (raw JSON):
{
  "imageUrl": "https://example.com/product-image.jpg",
  "isPrimary": true,
  "displayOrder": 0
}
```

### 8. Remove Product Image (Admin Only)
```
Method: DELETE
URL: http://localhost:3003/products/images/image-uuid-here
Headers: 
  Authorization: Bearer <admin-jwt-token>
Body: None
```

### 9. Set Primary Image (Admin Only)
```
Method: PUT
URL: http://localhost:3003/products/images/image-uuid-here/primary
Headers: 
  Authorization: Bearer <admin-jwt-token>
Body: None
```

### 10. Update Image Order (Admin Only)
```
Method: PUT
URL: http://localhost:3003/products/images/image-uuid-here/order
Headers: 
  Content-Type: application/json
  Authorization: Bearer <admin-jwt-token>
Body (raw JSON):
{
  "displayOrder": 5
}
```

---

## Category APIs

### 11. Create Category (Admin Only)
```
Method: POST
URL: http://localhost:3003/categories
Headers: 
  Content-Type: application/json
  Authorization: Bearer <admin-jwt-token>
Body (raw JSON):
{
  "name": "Electronics",
  "slug": "electronics",
  "description": "Electronic devices and accessories"
}
```

### 12. Get All Categories (Public)
```
Method: GET
URL: http://localhost:3003/categories
Headers: None
Body: None
```

### 13. Get Category by ID (Public)
```
Method: GET
URL: http://localhost:3003/categories/category-uuid-here
Headers: None
Body: None
```

### 14. Get Category by Slug (Public)
```
Method: GET
URL: http://localhost:3003/categories/slug/electronics
Headers: None
Body: None
```

### 15. Update Category (Admin Only)
```
Method: PUT
URL: http://localhost:3003/categories/category-uuid-here
Headers: 
  Content-Type: application/json
  Authorization: Bearer <admin-jwt-token>
Body (raw JSON):
{
  "name": "Electronics & Gadgets",
  "description": "Electronic devices, gadgets, and accessories"
}
```

### 16. Delete Category (Admin Only)
```
Method: DELETE
URL: http://localhost:3003/categories/category-uuid-here
Headers: 
  Authorization: Bearer <admin-jwt-token>
Body: None
```

---

## Authentication Setup

### Get Admin Token from Identity Service
```
Method: POST
URL: http://localhost:3001/auth/login
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Copy the `accessToken` from the response and use it in the `Authorization: Bearer <token>` header for admin endpoints.

---

## Testing Flow

### Recommended Testing Order:
1. **Get admin token** from identity service
2. **Create category** (API #11)
3. **Create product** (API #1) using the category ID
4. **Add images** to product (API #7)
5. **Get all products** (API #2)
6. **Get product by ID** (API #3)
7. **Search products** (API #2 with search parameter)
8. **Update product** (API #5)
9. **Update image order** (API #10)
10. **Set primary image** (API #9)
11. **Get categories** (API #12)
12. **Delete product** (API #6)
13. **Delete category** (API #15)

---

## Important Notes

- **Admin endpoints** require JWT token from identity service with ADMIN role
- **Public endpoints** can be accessed without authentication
- **Slug and SKU** must be unique for products
- **Category slug** must be unique
- **Image operations** are cascaded when product is deleted
- Use valid UUIDs for all ID parameters
- Service runs on **port 3003**

---

## Response Examples

### Create Product Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "categoryId": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Premium Wireless Headphones",
  "slug": "premium-wireless-headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "sku": "HEADPHONES-001",
  "price": 299.99,
  "brand": "TechBrand",
  "thumbnail": "https://example.com/thumbnail.jpg",
  "weight": 0.5,
  "status": "ACTIVE",
  "category": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Electronics",
    "slug": "electronics"
  },
  "images": [],
  "createdAt": "2026-08-03T12:00:00.000Z",
  "updatedAt": "2026-08-03T12:00:00.000Z"
}
```

### Get All Products Response
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Premium Wireless Headphones",
      "slug": "premium-wireless-headphones",
      "sku": "HEADPHONES-001",
      "price": 299.99,
      "status": "ACTIVE",
      "category": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Electronics",
        "slug": "electronics"
      },
      "images": []
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

### Create Category Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Electronics",
  "slug": "electronics",
  "description": "Electronic devices and accessories",
  "products": [],
  "createdAt": "2026-08-03T12:00:00.000Z",
  "updatedAt": "2026-08-03T12:00:00.000Z"
}
```

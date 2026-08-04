# Notification Service

A comprehensive notification service built with NestJS, MongoDB/Mongoose, and Nodemailer for the Nexora e-commerce platform. This service handles email notifications, order confirmations, shipping updates, and user communications.

## 🚀 Features

- **Email Notifications**: SMTP-based email sending with Nodemailer
- **Notification Management**: Track and manage all notifications with MongoDB
- **Multiple Notification Types**: EMAIL, SMS, PUSH, IN_APP support
- **Priority System**: LOW, MEDIUM, HIGH, URGENT priority levels
- **Status Tracking**: PENDING, SENT, FAILED, RETRYING status management
- **Retry Mechanism**: Automatic retry for failed notifications
- **Template Support**: Pre-built templates for common notifications
- **Statistics**: Real-time notification statistics and analytics
- **MongoDB Integration**: Persistent storage with Mongoose ODM

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- SMTP email server (Gmail, SendGrid, etc.)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sabarim6369/Nexora-Enterprise-Distributed-Commerce-Platform.git
   cd Nexora/notification-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/notification_db
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=noreply@nexora.com
   FRONTEND_URL=http://localhost:3000
   PORT=3006
   NODE_ENV=development
   ```

## 🏃 Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The service will start on `http://localhost:3006` by default.

## 📚 API Documentation

## Base URL
```
http://localhost:3006
```

---

## Notification Management APIs

### 1. Create Notification
```
Method: POST
URL: http://localhost:3006/notifications
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "type": "EMAIL",
  "recipient": "user@example.com",
  "subject": "Order Confirmation",
  "content": "<h1>Your order has been confirmed</h1>",
  "priority": "HIGH",
  "userId": "user-uuid",
  "orderId": "order-uuid",
  "category": "ORDER"
}
```

### 2. Get All Notifications
```
Method: GET
URL: http://localhost:3006/notifications
Query Parameters (optional):
  - type: EMAIL (filter by type)
  - status: SENT (filter by status)
  - userId: user-uuid (filter by user)
  - orderId: order-uuid (filter by order)
  - recipient: email (filter by recipient)
  - category: ORDER (filter by category)
Headers: None
Body: None
```

### 3. Get Notification Statistics
```
Method: GET
URL: http://localhost:3006/notifications/statistics
Headers: None
Body: None
```

### 4. Get Notification by ID
```
Method: GET
URL: http://localhost:3006/notifications/notification-uuid-here
Headers: None
Body: None
```

### 5. Get Notifications by Recipient
```
Method: GET
URL: http://localhost:3006/notifications/recipient/user@example.com
Headers: None
Body: None
```

### 6. Get Notifications by User ID
```
Method: GET
URL: http://localhost:3006/notifications/user/user-uuid-here
Headers: None
Body: None
```

### 7. Update Notification
```
Method: PATCH
URL: http://localhost:3006/notifications/notification-uuid-here
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "status": "SENT",
  "priority": "HIGH"
}
```

### 8. Retry Failed Notification
```
Method: PATCH
URL: http://localhost:3006/notifications/notification-uuid-here/retry
Headers: None
Body: None
```

### 9. Delete Notification
```
Method: DELETE
URL: http://localhost:3006/notifications/notification-uuid-here
Headers: None
Body: None
```

---

## Email APIs

### 10. Send Custom Email
```
Method: POST
URL: http://localhost:3006/notifications/email/send
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "to": "user@example.com",
  "subject": "Custom Email",
  "html": "<h1>Hello World</h1>",
  "text": "Hello World",
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"]
}
```

### 11. Send Order Confirmation Email
```
Method: POST
URL: http://localhost:3006/notifications/email/order-confirmation
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "orderNumber": "ORD-1722768000000-1234",
  "customerEmail": "user@example.com",
  "userId": "user-uuid",
  "orderId": "order-uuid",
  "totalAmount": 299.99
}
```

### 12. Send Shipping Notification Email
```
Method: POST
URL: http://localhost:3006/notifications/email/shipping-notification
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "orderNumber": "ORD-1722768000000-1234",
  "customerEmail": "user@example.com",
  "userId": "user-uuid",
  "orderId": "order-uuid",
  "trackingNumber": "TRACK123456",
  "estimatedDelivery": "2026-08-10"
}
```

### 13. Send Password Reset Email
```
Method: POST
URL: http://localhost:3006/notifications/email/password-reset
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "email": "user@example.com",
  "resetToken": "reset-token-here"
}
```

### 14. Send Welcome Email
```
Method: POST
URL: http://localhost:3006/notifications/email/welcome
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "email": "user@example.com",
  "userName": "John Doe",
  "userId": "user-uuid"
}
```

### 15. Verify Email Connection
```
Method: GET
URL: http://localhost:3006/notifications/email/verify
Headers: None
Body: None
```

---

## Notification Types

- **EMAIL**: Email notifications via SMTP
- **SMS**: SMS notifications (future implementation)
- **PUSH**: Push notifications (future implementation)
- **IN_APP**: In-app notifications (future implementation)

## Notification Status

- **PENDING**: Notification queued for sending
- **SENT**: Successfully sent
- **FAILED**: Failed to send (can be retried)
- **RETRYING**: Currently retrying after failure

## Notification Priority

- **LOW**: Low priority notifications
- **MEDIUM**: Default priority
- **HIGH**: High priority notifications
- **URGENT**: Critical notifications

---

## Important Notes

- **Email Configuration**: Requires valid SMTP credentials
- **MongoDB**: Must be running before starting the service
- **Retry Logic**: Failed notifications can be retried via API
- **Templates**: Pre-built templates for common use cases
- **Extensible**: Easy to add new notification types
- Service runs on **port 3006**

---

## Response Examples

### Create Notification Response
```json
{
  "_id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "EMAIL",
  "status": "PENDING",
  "priority": "HIGH",
  "recipient": "user@example.com",
  "subject": "Order Confirmation",
  "content": "<h1>Your order has been confirmed</h1>",
  "userId": "user-uuid",
  "orderId": "order-uuid",
  "category": "ORDER",
  "retryCount": 0,
  "createdAt": "2026-08-04T12:00:00.000Z",
  "updatedAt": "2026-08-04T12:00:00.000Z"
}
```

### Statistics Response
```json
{
  "total": 150,
  "pending": 25,
  "sent": 120,
  "failed": 5,
  "byType": {
    "EMAIL": 150,
    "SMS": 0,
    "PUSH": 0
  }
}
```

### Send Email Response
```json
{
  "success": true,
  "messageId": "<message-id@smtp.gmail.com>"
}
```

---

## Testing Flow

### Recommended Testing Order:
1. **Verify email connection** (API #15)
2. **Send welcome email** (API #14)
3. **Send custom email** (API #10)
4. **Create notification** (API #1)
5. **Get all notifications** (API #2)
6. **Get notification by ID** (API #4)
7. **Get notifications by user** (API #6)
8. **Send order confirmation** (API #11)
9. **Send shipping notification** (API #12)
10. **Get statistics** (API #3)
11. **Retry failed notification** (API #8)
12. **Delete notification** (API #9)

---

## 🗄️ Database Schema

### Notification Model
- `_id`: MongoDB ObjectId
- `type`: EMAIL, SMS, PUSH, IN_APP
- `status`: PENDING, SENT, FAILED, RETRYING
- `priority`: LOW, MEDIUM, HIGH, URGENT
- `recipient`: Email address or phone number
- `subject`: Notification subject
- `content`: HTML/text content
- `templateId`: Template identifier
- `metadata`: Additional data (object)
- `retryCount`: Number of retry attempts
- `errorMessage`: Error message if failed
- `sentAt`: Timestamp when sent
- `userId`: Associated user ID
- `orderId`: Associated order ID
- `category`: Notification category
- `createdAt`, `updatedAt`: Timestamps

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/notification_db` |
| `EMAIL_HOST` | SMTP host | Required |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_SECURE` | Use SSL/TLS | `false` |
| `EMAIL_USER` | SMTP username | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | SMTP password | Required |
| `EMAIL_FROM` | Default from address | `noreply@nexora.com` |
| `FRONTEND_URL` | Frontend URL for links | `http://localhost:3000` |
| `PORT` | Server port | `3006` |
| `NODE_ENV` | Environment mode | `development` |

---

## 🧪 Testing

### Run Unit Tests
```bash
npm run test
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Run Test Coverage
```bash
npm run test:cov
```

---

## 📦 Project Structure

```
notification-service/
├── src/
│   ├── notifications/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── dto/
│   │   └── notifications.module.ts
│   ├── email/
│   │   ├── email.service.ts
│   │   └── email.module.ts
│   ├── app.module.ts
│   └── main.ts
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the Nexora E-Commerce Platform**

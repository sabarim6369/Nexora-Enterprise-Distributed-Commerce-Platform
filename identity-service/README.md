# Identity Service

A robust, enterprise-grade authentication and user management service built with NestJS, Prisma, and PostgreSQL. This service handles user registration, authentication, authorization, and profile management for the Nexora e-commerce platform.

## 🚀 Features

- **User Authentication**: JWT-based authentication with access and refresh tokens
- **User Management**: Complete CRUD operations with role-based access control
- **Address Management**: User address book with default address support
- **Role-Based Access Control**: Admin and Customer roles with appropriate permissions
- **Security**: Password hashing with bcrypt, token rotation, and session management
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Validation**: Request validation with class-validator and class-transformer

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sabarim6369/Nexora-Enterprise-Distributed-Commerce-Platform.git
   cd Nexora/identity-service
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
   DATABASE_URL="postgresql://postgres:password@localhost:5432/identity_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="15m"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
   JWT_REFRESH_EXPIRES_IN="7d"
   PORT=3001
   NODE_ENV="development"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
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

The service will start on `http://localhost:3001` by default.

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "CUSTOMER"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout All Devices
```http
POST /auth/logout-all
Authorization: Bearer <access_token>
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>
```

### User Management Endpoints

#### Get All Users (Admin Only)
```http
GET /users
Authorization: Bearer <admin_access_token>
```

#### Get User Profile
```http
GET /users/:id
Authorization: Bearer <access_token>
```

#### Update User Profile
```http
PUT /users/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "Updated Name",
  "lastName": "Updated Last Name",
  "phone": "+9876543210"
}
```

#### Delete User (Admin Only)
```http
DELETE /users/:id
Authorization: Bearer <admin_access_token>
```

#### Change User Status (Admin Only)
```http
PATCH /users/:id/status
Authorization: Bearer <admin_access_token>
Content-Type: application/json

{
  "status": "ACTIVE"
}
```

### Address Management Endpoints

#### Create Address
```http
POST /addresses
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "phone": "+1234567890",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "postalCode": "10001",
  "isDefault": true
}
```

#### Get All Addresses
```http
GET /addresses
Authorization: Bearer <access_token>
```

#### Update Address
```http
PUT /addresses/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "fullName": "John Updated",
  "addressLine1": "456 New Street"
}
```

#### Delete Address
```http
DELETE /addresses/:id
Authorization: Bearer <access_token>
```

#### Set Default Address
```http
PUT /addresses/:id/default
Authorization: Bearer <access_token>
```

## 🔐 Security Features

- **JWT Authentication**: Access tokens (15min) and refresh tokens (7 days)
- **Password Hashing**: bcrypt with salt rounds of 10
- **Role-Based Access Control**: Admin and Customer roles
- **Token Rotation**: New refresh tokens issued on refresh
- **Session Management**: Ability to logout from specific or all devices
- **Input Validation**: All requests validated using class-validator
- **SQL Injection Prevention**: Prisma ORM with parameterized queries

## 🗄️ Database Schema

### User Model
- `id`: UUID primary key
- `email`: Unique email address
- `passwordHash`: Hashed password
- `firstName`, `lastName`: User name
- `phone`: Unique phone number
- `role`: CUSTOMER or ADMIN
- `status`: ACTIVE, INACTIVE, or BLOCKED
- `isVerified`: Email verification status
- `createdAt`, `updatedAt`: Timestamps

### Address Model
- `id`: UUID primary key
- `userId`: Foreign key to User
- `fullName`, `phone`: Contact information
- `addressLine1`, `addressLine2`: Street address
- `city`, `state`, `country`, `postalCode`: Location details
- `isDefault`: Default address flag
- `createdAt`, `updatedAt`: Timestamps

### RefreshToken Model
- `id`: UUID primary key
- `userId`: Foreign key to User
- `token`: Unique refresh token
- `expiresAt`: Token expiration time
- `createdAt`: Creation timestamp

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

## 📦 Project Structure

```
identity-service/
├── src/
│   ├── auth/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── strategies/
│   │   ├── guards/
│   │   ├── decorators/
│   │   ├── dto/
│   │   └── auth.module.ts
│   ├── users/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   └── users.module.ts
│   ├── addresses/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   └── addresses.module.ts
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env
├── package.json
└── tsconfig.json
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for access tokens | Required |
| `JWT_EXPIRES_IN` | Access token expiration time | `15m` |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | Required |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration time | `7d` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- NestJS Framework
- Prisma ORM
- PostgreSQL Database
- JWT Authentication

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for the Nexora E-Commerce Platform**

# Booking Backend

A robust NestJS backend application with MongoDB for managing bookings, receptions, and orders. Built with a modular architecture featuring authentication, role-based access control, and comprehensive API documentation.

## 🚀 Features

### Core Modules

- **Authentication & Authorization**: JWT-based auth with CASL RBAC for fine-grained permissions
- **User Management**: Users, roles, and permissions management
- **Booking System**: Complete booking flow with orders, items, and reception management
- **Catalog**: Categories, products, and product services
- **Resources**: Rooms and amenities management
- **Customer Management**: Customer profiles with exams and faculty associations

### Technical Highlights

- **Security**: Request validation, payload whitelisting, and global error handling
- **Documentation**: Auto-generated Swagger docs with organized endpoints
- **Automation**: Daily cron job for seeding reception data
- **Monitoring**: Health checks and logging system
- **Static Assets**: Serves client application from `src/client`

## 📋 Prerequisites

- Node.js (v16 or higher recommended)
- MongoDB (v4.4 or higher)
- pnpm, npm, or yarn package manager

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd myAppOrder/backend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/booking-db

   # Security
   JWT_SECRET=your-secure-secret-key-change-this
   JWT_EXPIRES_IN=24h

   # CORS (semicolon-separated for multiple origins)
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB**

   Ensure MongoDB is running on your system:

   ```bash
   # If using MongoDB as a service
   mongod
   ```

## 🚦 Running the Application

### Development Mode

```bash
pnpm start:dev
# or
npm run start:dev
```

Hot-reload enabled for faster development.

### Production Mode

```bash
# Build the application
pnpm build

# Start production server
pnpm start:prod
# or
npm run start:prod
```

### Debug Mode

```bash
pnpm start:debug
# or
npm run start:debug
```

Runs with Node.js debugger attached on port 9229.

## 📚 API Documentation

Once the application is running, access the interactive Swagger documentation:

**Swagger UI**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

All API endpoints are prefixed with `/api`. The documentation includes:

- Grouped endpoints by domain
- Request/response schemas
- Authentication requirements
- Try-it-out functionality

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── auth/              # Authentication module
│   ├── users/             # User management
│   ├── roles/             # Role definitions
│   ├── permissions/       # Permission system
│   ├── booking/           # Booking logic
│   ├── reception/         # Reception management
│   ├── orders/            # Order processing
│   ├── categories/        # Product categories
│   ├── products/          # Product catalog
│   ├── rooms/             # Room management
│   ├── amenities/         # Amenity resources
│   ├── customers/         # Customer profiles
│   ├── exams/             # Exam records
│   ├── faculty/           # Faculty management
│   ├── logger/            # Logging service
│   ├── health/            # Health checks
│   ├── client/            # Static client files
│   └── main.ts            # Application entry point
├── .env                   # Environment variables
├── package.json           # Dependencies
└── README.md             # This file
```

## 🔐 Security & Authorization

### Authentication Flow

1. User logs in with credentials via `/api/auth/login`
2. Server returns JWT token
3. Include token in `Authorization: Bearer <token>` header for protected routes

### Role-Based Access Control (RBAC)

- Powered by CASL for granular permissions
- Guards execute in order: JWT Guard → CASL Guard
- Use `@CheckPermission()` decorator to protect endpoints
- Permissions are evaluated based on user roles

### Validation & Security Features

- Global validation pipes with whitelisting
- Mongoose error interceptor for database errors
- CORS configuration for controlled access
- Environment-based security settings

## 🔄 Automated Tasks

### Reception Seeding

- **Schedule**: Daily at 01:00 AM
- **Action**: Seeds up to 15 example receptions
- **Requirements**: Ensure prerequisite data exists (customers, faculties, users)
- **Purpose**: Provides sample data for development and testing

## 🌍 Environment Variables

| Variable         | Required | Default     | Description                                |
| ---------------- | -------- | ----------- | ------------------------------------------ |
| `PORT`           | No       | 5000        | Server port                                |
| `MONGODB_URI`    | Yes      | -           | MongoDB connection string                  |
| `NODE_ENV`       | No       | development | Environment (development/production)       |
| `JWT_SECRET`     | Yes      | -           | Secret key for JWT signing                 |
| `JWT_EXPIRES_IN` | No       | 24h         | JWT token expiration                       |
| `CORS_ORIGIN`    | No       | \*          | Allowed CORS origins (semicolon-separated) |

## 📜 Available Scripts

| Command            | Description                               |
| ------------------ | ----------------------------------------- |
| `pnpm start:dev`   | Start in development mode with hot-reload |
| `pnpm start`       | Start production build                    |
| `pnpm start:prod`  | Build and start in production mode        |
| `pnpm build`       | Compile TypeScript to JavaScript          |
| `pnpm start:debug` | Start with debugger attached              |
| `pnpm test`        | Run unit tests                            |
| `pnpm test:e2e`    | Run end-to-end tests                      |
| `pnpm lint`        | Run ESLint                                |
| `pnpm format`      | Format code with Prettier                 |

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Verify MongoDB is running: `mongod --version`
- Check connection string in `.env`
- Ensure MongoDB port (default 27017) is not blocked

### Port Already in Use

- Change `PORT` in `.env`
- Kill process using port: `lsof -ti:5000 | xargs kill -9` (macOS/Linux)

### JWT Token Errors

- Verify `JWT_SECRET` is set in `.env`
- Ensure token is included in Authorization header
- Check token expiration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style and conventions
- Keep linting and type checks passing
- Add tests for new features
- Update documentation as needed

## 📄 License

[Specify your license here]

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

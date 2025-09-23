# GrowNet Learning Platform - Backend API

A comprehensive backend API for the Ethiopian learning platform built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Course Management**: Full CRUD operations for courses with enrollment tracking
- **Review System**: Rating and review system with statistics
- **Comment System**: Threaded comments for course discussions
- **Booking System**: Tutor booking functionality
- **User Management**: Complete user profiles and management
- **Real-time Data**: Live enrollment counts and rating statistics
- **Ethiopian Focus**: Designed specifically for Ethiopian educational content

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Development**: Nodemon, ts-node

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/grownet_learning?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key"
   ```

4. **Set up PostgreSQL database**:
   ```bash
   # Create database
   createdb grownet_learning
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE grownet_learning;
   \q
   ```

5. **Run database migrations**:
   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database with demo data**:
   ```bash
   npm run seed
   ```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3001`

## 📊 Database Management

### View Database
```bash
npm run studio
```

### Reset Database
```bash
npx prisma migrate reset
npm run seed
```

### Generate Prisma Client
```bash
npx prisma generate
```

## 🔐 Demo Credentials

After seeding, you can use these credentials:

- **Admin**: `admin@grownet.et` / `admin123`
- **Student**: `student@grownet.et` / `student123`
- **Tutor**: `tutor@grownet.et` / `tutor123`
- **Employer**: `employer@grownet.et` / `employer123`

## 📚 API Documentation

### Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-domain.com/api`

### Authentication
All protected endpoints require a Bearer token:
```
Authorization: Bearer <your-jwt-token>
```

### Main Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user profile
- `PUT /auth/profile` - Update user profile

#### Courses
- `GET /courses` - Get all courses (with filtering)
- `GET /courses/:id` - Get specific course
- `POST /courses` - Create new course (tutor/admin)
- `PUT /courses/:id` - Update course (owner/admin)
- `DELETE /courses/:id` - Delete course (owner/admin)

#### Enrollments
- `POST /enrollments` - Enroll in course
- `GET /enrollments/my-courses` - Get user's enrolled courses
- `PUT /enrollments/:id/progress` - Update progress
- `DELETE /enrollments/:id` - Unenroll from course

#### Reviews
- `GET /reviews/course/:courseId` - Get course reviews
- `GET /reviews/course/:courseId/stats` - Get rating statistics
- `POST /reviews` - Submit review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

#### Comments
- `GET /comments/course/:courseId` - Get course comments
- `POST /comments` - Post comment
- `PUT /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

#### Bookings
- `POST /bookings` - Book tutoring session
- `GET /bookings/my-bookings` - Get user's bookings
- `PUT /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Cancel booking

#### Users
- `GET /users` - Get all users (admin)
- `GET /users/:id` - Get user profile
- `GET /users/:id/courses` - Get user's courses
- `GET /users/:id/enrollments` - Get user's enrollments

### Response Format
```json
{
  "message": "Success message",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Format
```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "details": [ ... ]
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure access and refresh tokens
- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Configurable cross-origin requests
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **XSS Protection**: Helmet.js security headers

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── routes/          # API route handlers
│   ├── middleware/      # Custom middleware
│   ├── utils/          # Utility functions
│   ├── server.ts       # Main server file
│   └── seed.ts         # Database seeder
├── prisma/
│   └── schema.prisma   # Database schema
├── .env               # Environment variables
├── package.json       # Dependencies
└── README.md         # This file
```

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_REFRESH_SECRET` | Refresh token secret | Required |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## 🚀 Deployment

### Using Docker (Recommended)
```bash
# Build image
docker build -t grownet-backend .

# Run with environment variables
docker run -p 3001:3001 --env-file .env grownet-backend
```

### Using PM2
```bash
npm install -g pm2
npm run build
pm2 start dist/server.js --name "grownet-backend"
```

### Using Heroku
```bash
# Set environment variables
heroku config:set DATABASE_URL="your-postgres-url"
heroku config:set JWT_SECRET="your-secret"

# Deploy
git push heroku main
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📈 Monitoring

### Health Check
```bash
curl http://localhost:3001/health
```

### Database Status
```bash
# Check database connection
npm run studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@grownet.et
- Documentation: [API Docs](./BACKEND_API_SPEC.md)
- Issues: GitHub Issues

---

**GrowNet Learning Platform** - Empowering Ethiopian Education Through Technology 🇪🇹

# 🚀 GrowNet Learning Platform - Complete Backend Setup Guide

This guide will help you set up the real backend database and connect it to your Ethiopian learning platform.

## 📋 Prerequisites

Before starting, make sure you have:
- Node.js (v18 or higher) installed
- PostgreSQL (v13 or higher) installed
- Git installed
- A terminal/command prompt

## 🔧 Step 1: Install PostgreSQL

### Windows:
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember your postgres user password
4. Default port is 5432

### macOS:
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 🗄️ Step 2: Create Database

1. **Open PostgreSQL command line**:
   ```bash
   # Windows
   psql -U postgres
   
   # macOS/Linux
   sudo -u postgres psql
   ```

2. **Create the database**:
   ```sql
   CREATE DATABASE grownet_learning;
   CREATE USER grownet_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE grownet_learning TO grownet_user;
   \q
   ```

## 📦 Step 3: Install Backend Dependencies

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

## ⚙️ Step 4: Configure Environment

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the .env file** with your database credentials:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://grownet_user:your_secure_password@localhost:5432/grownet_learning?schema=public"
   
   # JWT Configuration (generate secure keys)
   JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key-min-32-characters-long"
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # CORS Configuration
   FRONTEND_URL="http://localhost:3000"
   ```

## 🏗️ Step 5: Set Up Database Schema

1. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

2. **Run database migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Seed the database with demo data**:
   ```bash
   npm run seed
   ```

## 🚀 Step 6: Start the Backend Server

1. **Development mode** (with auto-reload):
   ```bash
   npm run dev
   ```

2. **Production mode**:
   ```bash
   npm run build
   npm start
   ```

The server will start on `http://localhost:3001`

## 🔄 Step 7: Switch Frontend to Production Mode

1. **Navigate to frontend directory**:
   ```bash
   cd ..  # Go back to main directory
   ```

2. **Copy the production environment**:
   ```bash
   cp .env.production .env
   ```

3. **Verify the .env file contains**:
   ```env
   REACT_APP_MODE=production
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. **Start the frontend**:
   ```bash
   npm start
   ```

## ✅ Step 8: Test the Connection

1. **Check backend health**:
   ```bash
   curl http://localhost:3001/health
   ```

2. **Test user registration**:
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123",
       "role": "STUDENT"
     }'
   ```

3. **Open your browser** and go to `http://localhost:3000`

## 🎯 Demo Credentials

After seeding, you can use these real database credentials:

- **Admin**: `admin@grownet.et` / `admin123`
- **Student**: `student@grownet.et` / `student123`  
- **Tutor**: `tutor@grownet.et` / `tutor123`
- **Employer**: `employer@grownet.et` / `employer123`

## 🔍 Database Management

### View Database in Browser:
```bash
cd backend
npm run studio
```
This opens Prisma Studio at `http://localhost:5555`

### Reset Database:
```bash
cd backend
npx prisma migrate reset
npm run seed
```

### Backup Database:
```bash
pg_dump -U grownet_user -h localhost grownet_learning > backup.sql
```

### Restore Database:
```bash
psql -U grownet_user -h localhost grownet_learning < backup.sql
```

## 🌐 API Endpoints

With the backend running, you now have access to:

### Authentication:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Courses:
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (tutor/admin)
- `GET /api/courses/:id` - Get specific course

### Enrollments:
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/my-courses` - Get user's courses

### Reviews:
- `GET /api/reviews/course/:courseId` - Get course reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews/course/:courseId/stats` - Get rating stats

### And many more! See `BACKEND_API_SPEC.md` for complete documentation.

## 🎉 What You Now Have

✅ **Real Database**: PostgreSQL with persistent data  
✅ **Real Authentication**: JWT-based user management  
✅ **Real Enrollments**: Actual student enrollment tracking  
✅ **Real Reviews**: Persistent rating and review system  
✅ **Real Comments**: Course discussion system  
✅ **Real Bookings**: Tutor booking functionality  
✅ **Admin Panel**: User and course management  
✅ **API Documentation**: Complete REST API  

## 🔧 Troubleshooting

### Database Connection Issues:
1. Check PostgreSQL is running: `pg_isready`
2. Verify credentials in `.env` file
3. Check firewall settings for port 5432

### Backend Won't Start:
1. Check Node.js version: `node --version`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check port 3001 is available: `lsof -i :3001`

### Frontend Can't Connect:
1. Verify backend is running on port 3001
2. Check CORS settings in backend
3. Verify `.env` has `REACT_APP_MODE=production`

### Migration Errors:
1. Reset database: `npx prisma migrate reset`
2. Generate client: `npx prisma generate`
3. Run migrations: `npx prisma migrate dev`

## 🚀 Deployment Options

### Local Development:
- Backend: `npm run dev` (port 3001)
- Frontend: `npm start` (port 3000)

### Production Deployment:
- **Heroku**: Use provided Procfile
- **DigitalOcean**: Deploy with PM2
- **AWS**: Use Elastic Beanstalk
- **Vercel**: Frontend deployment
- **Railway**: Full-stack deployment

## 📞 Support

If you encounter any issues:
1. Check the logs in terminal
2. Verify all environment variables
3. Ensure PostgreSQL is running
4. Check the troubleshooting section above

---

**Congratulations! 🎉**  
You now have a fully functional Ethiopian learning platform with real database connectivity!

The system will automatically switch between demo mode (localStorage) and production mode (real database) based on your environment configuration.

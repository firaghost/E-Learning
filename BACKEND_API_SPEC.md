# GrowNet Learning Platform - Backend API Specification

## Overview
This document outlines the complete backend API specification for the GrowNet Learning Platform. The frontend is designed to work with both demo mode (using local data) and production mode (using these real API endpoints).

## Base URL
- **Production**: `https://api.grownet.et/v1`
- **Development**: `http://localhost:3001/api/v1`

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "student" | "tutor" | "employer" | "admin"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "created_at": "datetime",
    "updated_at": "datetime"
  },
  "token": "string",
  "refreshToken": "string"
}
```

#### POST /auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "created_at": "datetime",
    "updated_at": "datetime"
  },
  "token": "string",
  "refreshToken": "string"
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "refreshToken": "string"
}
```

#### GET /auth/me
Get current user information (requires authentication).

**Response:**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}
```

#### POST /auth/logout
Logout user and invalidate token (requires authentication).

### Course Endpoints

#### GET /courses
Get all published courses.

**Query Parameters:**
- `category` (optional): Filter by category
- `difficulty` (optional): Filter by difficulty level
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

**Response:**
```json
{
  "courses": [
    {
      "id": "string",
      "title": "string",
      "category": "string",
      "description": "string",
      "content_url": "string",
      "created_by": "string",
      "instructor_name": "string",
      "duration": "string",
      "difficulty_level": "Beginner" | "Intermediate" | "Advanced",
      "tags": ["string"],
      "thumbnail_url": "string",
      "price": "number",
      "enrollment_count": "number",
      "average_rating": "number",
      "total_ratings": "number",
      "is_published": "boolean",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

#### GET /courses/:id
Get a specific course by ID.

#### POST /courses
Create a new course (requires authentication - tutor/admin only).

**Request Body:**
```json
{
  "title": "string",
  "category": "string",
  "description": "string",
  "content_url": "string",
  "duration": "string",
  "difficulty_level": "Beginner" | "Intermediate" | "Advanced",
  "tags": ["string"],
  "thumbnail_url": "string",
  "price": "number"
}
```

#### PUT /courses/:id
Update a course (requires authentication - course owner/admin only).

#### DELETE /courses/:id
Delete a course (requires authentication - course owner/admin only).

#### GET /courses/search
Search courses by title, description, or tags.

**Query Parameters:**
- `q`: Search query string

#### POST /courses/:id/enroll
Enroll in a course (requires authentication).

#### GET /users/:userId/courses
Get enrolled courses for a user (requires authentication).

### Tutor Endpoints

#### GET /tutors
Get all active tutors.

**Response:**
```json
{
  "tutors": [
    {
      "id": "string",
      "name": "string",
      "subject": "string",
      "description": "string",
      "level": "string",
      "contact_info": "string",
      "experience": "string",
      "rating": "number",
      "hourly_rate": "number",
      "availability": ["string"],
      "specializations": ["string"],
      "languages": ["string"],
      "created_by": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ]
}
```

#### POST /tutors
Create tutor profile (requires authentication).

#### PUT /tutors/:id
Update tutor profile (requires authentication - tutor owner/admin only).

#### DELETE /tutors/:id
Delete tutor profile (requires authentication - tutor owner/admin only).

### Booking Endpoints

#### POST /bookings
Create a new booking (requires authentication).

**Request Body:**
```json
{
  "tutor_id": "string",
  "subject": "string",
  "session_type": "individual" | "group",
  "duration": "number",
  "preferred_date": "string",
  "preferred_time": "string",
  "notes": "string"
}
```

#### GET /bookings/student/:studentId
Get bookings for a student (requires authentication).

#### GET /bookings/tutor/:tutorId
Get bookings for a tutor (requires authentication).

#### PUT /bookings/:id/status
Update booking status (requires authentication).

**Request Body:**
```json
{
  "status": "pending" | "confirmed" | "completed" | "cancelled"
}
```

### News Endpoints

#### GET /news
Get published news articles.

**Query Parameters:**
- `category` (optional): Filter by category
- `featured` (optional): Get only featured articles
- `page` (optional): Page number
- `limit` (optional): Items per page

#### GET /news/:id
Get specific news article.

#### POST /news
Create news article (requires authentication - admin only).

#### PUT /news/:id
Update news article (requires authentication - admin only).

#### DELETE /news/:id
Delete news article (requires authentication - admin only).

### User Management Endpoints

#### GET /users
Get all users (requires authentication - admin only).

#### GET /users/:id
Get specific user (requires authentication).

#### PUT /users/:id
Update user profile (requires authentication).

#### DELETE /users/:id
Delete user account (requires authentication - admin only).

### File Upload Endpoints

#### POST /upload/image
Upload image file (requires authentication).

**Request:** Multipart form data with image file

**Response:**
```json
{
  "url": "string",
  "filename": "string",
  "size": "number"
}
```

#### POST /upload/document
Upload document file (requires authentication).

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'tutor', 'employer', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Courses Table
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  content_url VARCHAR(500),
  created_by UUID REFERENCES users(id),
  instructor_name VARCHAR(255),
  duration VARCHAR(100),
  difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
  tags TEXT[],
  thumbnail_url VARCHAR(500),
  price DECIMAL(10,2) DEFAULT 0,
  enrollment_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tutors Table
```sql
CREATE TABLE tutors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  description TEXT,
  level VARCHAR(100),
  contact_info VARCHAR(255),
  experience VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 5.0,
  hourly_rate DECIMAL(10,2) DEFAULT 0,
  availability TEXT[],
  specializations TEXT[],
  languages TEXT[],
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id),
  student_name VARCHAR(255),
  tutor_id UUID REFERENCES tutors(id),
  tutor_name VARCHAR(255),
  subject VARCHAR(100),
  session_type VARCHAR(50) CHECK (session_type IN ('individual', 'group')),
  duration INTEGER,
  scheduled_date DATE,
  scheduled_time TIME,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  meeting_link VARCHAR(500),
  notes TEXT,
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### News Table
```sql
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT,
  category VARCHAR(100),
  author_id UUID REFERENCES users(id),
  author_name VARCHAR(255),
  thumbnail_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

### Backend Environment Variables
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/grownet_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=production

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10MB

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL (for CORS)
FRONTEND_URL=https://grownet-learning.vercel.app
```

## Deployment Instructions

### Frontend (Vercel)
1. Set environment variable: `REACT_APP_MODE=demo`
2. Deploy to Vercel for demo/showcase

### Backend (Production)
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy to cloud provider (AWS, DigitalOcean, etc.)
4. Set frontend environment: `REACT_APP_MODE=production`
5. Set `REACT_APP_API_URL` to backend URL

This specification provides a complete backend API that the frontend can connect to for full functionality.

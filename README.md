# Mentor – Backend API (Server Side)

This is the backend service for the Mentor E-Learning Platform.
It provides a secure REST API for user authentication, course management, enrollment, and profile handling.

This backend is built with Node.js, Express, and MongoDB and follows a clean, modular structure with versioned API routes (/api/v1/...).

Frontend Repository: [https://github.com/Tahmied/Mentor](url)

Live Frontend: [https://mentor-faf09.web.app/](url)

# About the Project

The Mentor backend powers the entire E-learning platform by handling user accounts, course creation, enrollment, video/course details, and auth-protected operations.

The API follows a versioned and scalable structure, with routes beginning under:

```bash
/api/v1/users
/api/v1/course
```

The backend uses JWT-based authentication and middleware to protect routes.

# Features

## User Management

- Register new users
- Login / Logout
- Check if user exists
- Fetch authenticated user details
- Get user profile
- Update user profile

## Course Management

- Create new courses
- Edit course details
- Delete courses
- Fetch all courses
- Fetch single course by ID
- Get courses created by user
- Get courses enrolled by user

## Enrollment System

- Enroll in a course
- Check enrollment status

## Security & Architecture

- JWT authentication
- Middleware-based access control
- Versioned API routing
- Clean controller/service separation

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- CORS
- dotenv


# Installation

## Clone and enter the project:

```bash
git clone https://github.com/Tahmied/Mentor-Backend.git
cd Mentor-Backend
```

## Install dependencies:

```bash
npm install
```

# Environment Variables

Create a .env file in the root folder:

```env
PORT = 
MONGODB_URI = 
ACCESS_TOKEN_KEY = 
ACCESS_TOKEN_EXPIRY = 

REFRESH_TOKEN_KEY = 
REFRESH_TOKEN_EXPIRY = 
SERVER_SECRET = 

CORS_ORIGIN=
```

# User Routes (/api/v1/users)

| Method | Endpoint             | Protected | Description              |
| ------ | -------------------- | --------- | ------------------------ |
| POST   | `/register`          | ❌         | Register a new user      |
| POST   | `/login`             | ❌         | Login user               |
| POST   | `/logout`            | ✔️        | Logout                   |
| GET    | `/logincheck`        | ❌         | Check login status       |
| GET    | `/me`                | ✔️        | Get authenticated user   |
| POST   | `/checkExistingUser` | ❌         | Check if an email exists |
| GET    | `/profile`           | ✔️        | Get full user profile    |
| POST   | `/update-profile`    | ✔️        | Update user profile      |

# Course Routes (/api/v1/course)

| Method | Endpoint                      | Protected | Description                           |
| ------ | ----------------------------- | --------- | ------------------------------------- |
| GET    | `/getAllCourses`              | ❌         | Get all courses                       |
| GET    | `/my-courses`                 | ✔️        | Get courses created by logged-in user |
| POST   | `/addCourse`                  | ✔️        | Create a new course                   |
| PUT    | `/updateCourse/:courseId`     | ✔️        | Update a course                       |
| DELETE | `/delete/:courseId`           | ✔️        | Delete a course                       |
| GET    | `/my-enrollments`             | ✔️        | Get user's enrolled courses           |
| GET    | `/:courseId`                  | ❌         | Get course by ID                      |
| POST   | `/:courseId/enroll`           | ✔️        | Enroll in a course                    |
| GET    | `/check-enrollment/:courseId` | ✔️        | Check if user is enrolled             |


# Middleware
findUser (Authentication Middleware)

This middleware:

- Validates JWT token
- Extracts user data
- Attaches the user to req.user
- Blocks access if invalid

Used on all protected routes.

# Running the Server

Start development server:

```bash
npm run dev
```

Start production server:


```bash
npm start
```

# Contributing

**Contributions are welcome!**
This backend will continue evolving with features such as:

- Admin role & dashboard
- Payment integration
- Rate limiting & security hardening
- Analytics endpoints
- Course progress tracking

Feel free to fork the repo and open a pull request.

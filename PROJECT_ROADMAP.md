# Task Management Application - Complete Roadmap & Implementation Guide

## 📋 Project Overview

You're building a **Trello-like task management application** with:
- **Frontend:** React (Responsive UI)
- **Backend:** Express.js (RESTful API)
- **Database:** MongoDB Atlas (Cloud)
- **Deployment:** Vercel (Frontend) + Render/Railway (Backend)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Vercel                            │
│                (React Frontend)                      │
│     - Login/Register Pages                           │
│     - Task Board (Drag & Drop)                       │
│     - Admin Dashboard                                │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/CORS
                   ↓
┌─────────────────────────────────────────────────────┐
│               Render/Railway                         │
│              (Express.js Backend)                    │
│     - Authentication APIs (JWT)                      │
│     - User Management APIs                           │
│     - Task Management APIs                           │
│     - Role-Based Access Control                      │
└──────────────────┬──────────────────────────────────┘
                   │ Mongoose Driver
                   ↓
┌─────────────────────────────────────────────────────┐
│              MongoDB Atlas Cloud                     │
│     - Users Collection                               │
│     - Tasks Collection                               │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Directory Structure

```
task-management-app/
├── backend/                     # Express.js backend
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js         # User schema
│   │   │   └── Task.js         # Task schema
│   │   ├── routes/
│   │   │   ├── auth.js         # Auth endpoints
│   │   │   └── tasks.js        # Task endpoints
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT verification
│   │   │   └── roles.js        # Role checking
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── db.js               # MongoDB connection
│   │   └── server.js           # Express app setup
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── frontend/                    # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── LoginPage.jsx
    │   │   ├── TaskBoard.jsx
    │   │   ├── TaskCard.jsx
    │   │   ├── Column.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── pages/
    │   ├── services/
    │   │   └── api.js          # API calls
    │   ├── App.jsx
    │   └── index.jsx
    ├── .env.example
    ├── .gitignore
    └── package.json
```

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed with bcryptjs),
  role: String (enum: ["user", "admin"]),
  createdAt: Date,
  updatedAt: Date
}
```

### Tasks Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String (enum: ["To Do", "Doing", "Done"]),
  createdBy: ObjectId (User reference),
  assignedTo: ObjectId (User reference, can be null),
  createdAt: Date,
  updatedAt: Date
}
```

---

## � MongoDB Security (Important for Deployment)

### Development (Current Setup)
- Network Access: `0.0.0.0/0` (Allow from Anywhere)
- ✅ Easy for development
- ⚠️ Not secure for production

### Production Deployment (TODO - Day 6)
**BEFORE deploying to production, you MUST:**
1. Get your **Render/Railway server's IP address**
2. Go to MongoDB Atlas → Network Access
3. **Remove** the `0.0.0.0/0` rule
4. **Add only** your server's IP address (e.g., `1.2.3.4/32`)
5. This restricts access to only your deployed server

**Why?** Production databases should NOT be accessible from anywhere - only from your server.

---

## �🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT)
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get tasks (filtered by user or all if admin)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task status or details
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/assign` - Normal user assigns an unassigned task to themselves
- `PATCH /api/tasks/:id/reassign` - Admin can reassign any task

### Admin Only
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a single user by ID

---

## 🚀 Phase-by-Phase Implementation

### ⏱️ Timeline: 7 Days

**Day 1-2:** Backend Setup
- Database design & MongoDB Atlas setup
- User authentication system
- Basic task API structure

### Progress Log

#### 2026-09-03
- ✅ Added Mongoose and verified the MongoDB Atlas connection
- ✅ Added the shared `connectDB` module in `backend/src/db.js`
- ✅ Resolved the local Node.js DNS/SRV issue with public DNS servers (`1.1.1.1`, `8.8.8.8`)
- ✅ Removed the unnecessary npm `require` dependency

#### 2026-09-04
- ✅ Created the Express server entry point in `backend/src/server.js`
- ✅ Added dotenv, JSON parsing, CORS, and the `/api/health` endpoint
- ✅ Connected the Express startup flow to MongoDB with `connectDB()`
- ✅ Verified the health endpoint returns a JSON response in the browser
- ✅ Created and reviewed the `User` model with password hashing, password comparison, roles, and timestamps
- ✅ Created and reviewed the `Task` model with status validation, user references, and timestamps
- ⬜ Remove the temporary `backend/test-connection.js` file after final connection verification

#### 2026-09-05
- ✅ Added JWT authentication middleware with protected-route and role-restriction support
- ✅ Added authentication controllers for user registration and login
- ✅ Added and mounted `/api/auth/register` and `/api/auth/login` routes
- ✅ Verified registration and login APIs with Postman
- ✅ Verified login returns a JWT and the expected user data without exposing the password

#### 2026-09-08
- ✅ Implemented task CRUD operations in `backend/src/controllers/taskController.js`
- ✅ Added protected task routes in `backend/src/routes/taskRoutes.js`
- ✅ Added admin-only user listing routes in `backend/src/routes/userRoutes.js`
- ✅ Implemented admin user lookup in `backend/src/controllers/userController.js`
- ✅ Mounted `/api/tasks` and `/api/users` in `backend/src/server.js`
- ✅ Added the admin seed script in `backend/scripts/seedAdmin.js`
- ✅ Verified `npm run seed:admin` completes successfully and creates the seeded admin account
- ⬜ Start the frontend React project and build the login/register + task board UI

**Day 2-3:** Frontend Setup & Integration
- React project initialization
- Login/Register functionality
- Connect to backend APIs

**Day 3-4:** Core Features
- Task board UI with drag-and-drop
- Admin dashboard
- Full role-based permissions

**Day 5-6:** Deployment
- Backend to Render/Railway
- Frontend to Vercel
- Environment variable configuration

**Day 7:** Documentation & Final Polish
- Write README
- Add screenshots
- Prepare submission

---

## 🔑 Key Concepts Explained

### JWT Authentication
- User logs in → Backend creates JWT token
- Token stored in localStorage
- Token sent with each request in `Authorization` header
- Backend verifies token before processing request

### Role-Based Access Control (RBAC)
```
Normal User:
- Can create tasks
- Can only assign unassigned tasks to themselves
- Can only edit/view their own tasks

Admin:
- Can view ALL users
- Can view ALL tasks
- Can reassign ANY task to ANY user
- Can manage all permissions
```

### Drag-and-Drop
- Use `react-beautiful-dnd` or `react-dnd` library
- Drag task card → Drop in different column
- Triggers API call to update task status in database
- On page refresh, tasks remain in correct status (data persists)

---

## 💡 Implementation Tips

1. **Start with Backend First**
   - Get authentication working
   - Test APIs with Postman/Thunder Client
   - Verify database operations

2. **Use Environment Variables**
   - `.env` file for sensitive data (passwords, API keys)
   - Never commit `.env` to git
   - Use `.env.example` for reference

3. **Error Handling**
   - Implement try-catch in all async functions
   - Send meaningful error messages
   - Log errors for debugging

4. **Security**
   - Hash passwords with bcryptjs
   - Verify JWT on protected routes
   - Validate user input
   - Use CORS properly

5. **Testing Before Deployment**
   - Test all APIs locally
   - Test role-based access
   - Test drag-and-drop with real data
   - Verify responsive design on mobile

---

## 📦 Required npm Packages

### Backend
```
express
mongoose
bcryptjs
jsonwebtoken
dotenv
cors
```

### Frontend
```
react
react-router-dom
react-beautiful-dnd
axios (or fetch)
```

---

## 🎯 Success Criteria

- ✅ Users can register/login
- ✅ Tasks can be created, edited, deleted
- ✅ Drag-and-drop works and persists
- ✅ Admin can see all tasks and users
- ✅ Admin can reassign tasks
- ✅ Normal users cannot access admin features
- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on Render/Railway
- ✅ Both can communicate successfully
- ✅ README with setup instructions
- ✅ Screenshots included
- ✅ Submission file with URLs and credentials

---

## 📚 Next Steps

1. ✅ Review this roadmap
2. 🔄 Continue Phase 1: Backend Setup
   - ✅ Initialize the backend package
   - ✅ Connect to MongoDB Atlas
   - ✅ Create the Express server entry point
   - ✅ Create the User and Task models
   - ✅ Build user authentication
   - ⬜ Build task APIs
3. ⬜ Move to Phase 2: Frontend
4. ⬜ Integration, Deployment, Documentation

The next implementation task is to build the task APIs.

---

## 📝 Development Reminders

Keep these items in mind while implementing the remaining features:

### Authentication
- When logging in, explicitly include the hidden password field with `User.findOne({ email }).select("+password")` because `password` uses `select: false` in the User model.
- Never return the password field in API responses.
- Public registration must always create users with the default `"user"` role.
- Admin accounts must be created through a seed script or directly in the database, not public registration.

### Temporary Development Files
- Remove `backend/test-connection.js` after connection testing is complete.
- Do not commit `.env`, database credentials, or temporary test files.
- Create an `.env.example` file containing variable names only before sharing the repository.

### Before Deployment
- Replace the development JWT secret with a strong production secret.
- Restrict MongoDB Atlas network access instead of leaving `0.0.0.0/0` enabled.
- Test authentication, role permissions, task assignment, and status persistence.
- Confirm the frontend uses the deployed backend URL.

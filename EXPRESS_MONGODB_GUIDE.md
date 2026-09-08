# Express.js & MongoDB Quick-Start Guide

## 🌐 What is Express.js?

Express.js is a **minimal web framework for Node.js** that makes building web servers and APIs easy.

### Why Express.js?
- **Simple & Fast** - Built on Node.js
- **RESTful APIs** - Perfect for building backend APIs
- **Middleware** - Handle authentication, logging, etc.
- **Routing** - Organize endpoints easily
- **Popular** - Large community, lots of examples

---

## 📦 Setting Up MongoDB Atlas (Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click "Try Free"
3. Sign up with email or Google
4. Verify email

### Step 2: Create a Free Cluster
1. Choose "M0 Free" tier (free forever)
2. Select your region (closest to you)
3. Create cluster (takes ~10 minutes)

### Step 3: Add Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (for development)
   - For production, add specific IPs

### Step 4: Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username and password
   - **Save these!** You'll need them in .env

### Step 5: Get Connection String
1. Click "Databases" → "Connect"
2. Select "Drivers"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<username>` with your database user
6. Save as `MONGODB_URI` in `.env`

---

## 🛠️ Express.js Basics

### Basic Express Server
```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Understanding Requests & Responses
```javascript
// GET request - retrieve data
app.get('/api/tasks', (req, res) => {
  res.json({ tasks: [] }); // Send JSON response
});

// POST request - create data
app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body; // Get data from request body
  res.status(201).json({ success: true }); // Send response with status code
});

// PUT request - update data
app.put('/api/tasks/:id', (req, res) => {
  const id = req.params.id; // Get ID from URL
  res.json({ updated: true });
});

// DELETE request - delete data
app.delete('/api/tasks/:id', (req, res) => {
  res.json({ deleted: true });
});
```

### URL Parameters vs Query Parameters
```javascript
// URL Parameter: /api/tasks/123
app.get('/api/tasks/:id', (req, res) => {
  console.log(req.params.id); // "123"
});

// Query Parameter: /api/tasks?status=done
app.get('/api/tasks', (req, res) => {
  console.log(req.query.status); // "done"
});
```

---

## 🗄️ MongoDB & Mongoose Basics

### What is Mongoose?
Mongoose is a library that makes MongoDB easier to use with Node.js by adding structure and validation.

### Connecting to MongoDB
```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));
```

### Creating a Schema & Model
```javascript
const mongoose = require('mongoose');

// Define schema (structure of data)
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['To Do', 'Doing', 'Done'],
    default: 'To Do'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create model (like a class/table)
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
```

### CRUD Operations with MongoDB

#### Create (INSERT)
```javascript
const task = new Task({
  title: 'Buy groceries',
  description: 'Milk, eggs, bread',
  status: 'To Do'
});

await task.save(); // Save to database
// OR
const task = await Task.create({
  title: 'Buy groceries',
  description: 'Milk, eggs, bread'
});
```

#### Read (SELECT)
```javascript
// Get all tasks
const allTasks = await Task.find();

// Get one task
const oneTask = await Task.findById(id);

// Get tasks with filter
const todoTasks = await Task.find({ status: 'To Do' });

// Get with populate (get related user data)
const tasks = await Task.find().populate('assignedTo');
```

#### Update (UPDATE)
```javascript
// Method 1: Find and update
const updated = await Task.findByIdAndUpdate(
  id,
  { status: 'Doing' },
  { new: true } // Return updated document
);

// Method 2: Find, modify, save
const task = await Task.findById(id);
task.status = 'Doing';
await task.save();
```

#### Delete (DELETE)
```javascript
await Task.findByIdAndDelete(id);
// OR
await Task.deleteOne({ _id: id });
```

---

## 🔐 Password Hashing & JWT Authentication

### Hashing Passwords with bcryptjs
```javascript
const bcryptjs = require('bcryptjs');

// Hash password before saving to database
const hashedPassword = await bcryptjs.hash(password, 10);

// Verify password during login
const isMatch = await bcryptjs.compare(passwordFromUser, hashedPassword);
if (isMatch) {
  // Password is correct
}
```

### JWT (JSON Web Tokens)
```javascript
const jwt = require('jsonwebtoken');

// Create token when user logs in
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' } // Token expires in 7 days
);

// Verify token (middleware)
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded.userId); // Get user ID from token
```

### Authentication Middleware
```javascript
const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = decoded;
    next(); // Continue to next function
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Use middleware on protected routes
app.get('/api/profile', auth, (req, res) => {
  // Only accessible if valid token provided
  res.json({ userId: req.user.userId });
});
```

---

## 🎯 Project Structure Best Practices

### Keep Code Organized
```
backend/src/
├── models/           # Database schemas (User.js, Task.js)
├── routes/           # API endpoints (auth.js, tasks.js)
├── middleware/       # Authentication, validation
├── controllers/      # Business logic
├── db.js            # Database connection
└── server.js        # Express app setup
```

### Separation of Concerns
```javascript
// BAD: Everything in one file
app.post('/api/tasks', (req, res) => {
  // Validate input
  // Connect to database
  // Save to database
  // Send response
});

// GOOD: Separate into files
// routes/tasks.js
router.post('/', taskController.createTask);

// controllers/taskController.js
exports.createTask = async (req, res) => {
  // Validate input
  // Save to database
  // Send response
};
```

---

## 🧪 Testing APIs Without Frontend

### Using Postman
1. Download Postman (postman.com)
2. Create new request
3. Set method (GET, POST, etc.)
4. Enter URL (http://localhost:5000/api/tasks)
5. Go to "Body" tab and select "raw" + "JSON"
6. Add JSON data and send

### Using Thunder Client (VS Code Extension)
1. Install "Thunder Client" extension in VS Code
2. Click Thunder Client icon
3. Create new request
4. Very similar to Postman

### Example POST Request
```
URL: http://localhost:5000/api/tasks
Method: POST
Headers:
  Content-Type: application/json

Body (raw JSON):
{
  "title": "Complete project",
  "description": "Build task management app",
  "status": "To Do"
}
```

---

## 🚨 Common Errors & Solutions

### CORS Error in Browser
```javascript
// Fix: Add CORS middleware
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000' // React app URL
}));
```

### "Cannot find module" Error
```bash
# Fix: Install the package
npm install package-name
```

### Mongoose Connection Error
```javascript
// Fix: Check your .env file
// Make sure MONGODB_URI is correct
// Make sure password has no special characters or escape them
```

### JWT Token Error
```javascript
// Always send token with Bearer prefix
// Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 📝 Environment Variables (.env)

Create `.env` file in backend root:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskdb?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
```

Never commit `.env` to GitHub! Add to `.gitignore`:
```
.env
node_modules/
```

---

## 🔄 Request-Response Flow

```
1. Frontend sends request
   GET /api/tasks
   Headers: { Authorization: "Bearer token123" }

2. Backend receives request
   req.url = "/api/tasks"
   req.headers.authorization = "Bearer token123"
   req.method = "GET"

3. Backend processes
   - Verify token (middleware)
   - Query database
   - Format response

4. Backend sends response
   res.status(200).json({ tasks: [...] })

5. Frontend receives response
   status: 200
   data: { tasks: [...] }

6. Frontend updates UI with data
```

---

## 💪 You've Got This!

Express.js is very beginner-friendly. The basic flow is:
1. **Receive** request from frontend
2. **Process** data (query database, validate, etc.)
3. **Send** response back

That's it! Everything else is just variations of this pattern.

Ready to build Phase 1 of the project? Let me know! 🚀

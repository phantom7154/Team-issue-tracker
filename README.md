# Team Issue Tracker

A full-stack issue tracking platform designed to help teams create, assign, track, and manage software issues through a centralized dashboard.

Built with **React, Node.js, Express.js, and MongoDB**, the application provides authentication, issue management, filtering, team workload tracking, and issue discussions through comments.

---

## Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Protected API routes
- Authorization for issue and comment operations
- Secure password handling

### Issue Management
- Create new issues
- Edit existing issues
- Delete issues
- Assign issues to team members
- Manage issue status
- Set issue priority
- View detailed issue information

### Issue Status Workflow

Issues can move through the following states:

- Open
- In Progress
- Resolved
- Closed

### Priority Management

Issues support four priority levels:

- Low
- Medium
- High
- Critical

### Search & Filtering
- Search issues by title
- Filter by status
- Filter by priority
- Paginated issue listing

### Dashboard
- Total issue count
- Issue status statistics
- Priority breakdown
- Team workload tracking

### Comments
- Add comments to issues
- View comments with author information
- Delete own comments
- Automatically remove associated comments when an issue is deleted

---

## Tech Stack

### Frontend

- React
- React Router
- JavaScript
- CSS
- Axios

### Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication

### Database

- MongoDB
- Mongoose

### Development Tools

- Git
- GitHub
- Postman
- VS Code

---

## Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │                     │
                    │ Dashboard           │
                    │ Issues              │
                    │ Issue Details       │
                    │ Authentication      │
                    └──────────┬──────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌─────────────────────┐
                    │   Express Server    │
                    │                     │
                    │ Routes              │
                    │ Controllers         │
                    │ Middleware          │
                    │ JWT Authentication  │
                    └──────────┬──────────┘
                               │
                               │ Mongoose
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │                     │
                    │ Users               │
                    │ Issues              │
                    │ Comments            │
                    └─────────────────────┘
```

## Project Structure

```text
team-issue-tracker/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── IssueForm.jsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Issues.jsx
│   │   │   └── IssueDetails.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── issueController.js
│   │   └── commentController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Issue.js
│   │   └── Comment.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── issueRoutes.js
│   │   └── commentRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## Data Model

### User

```text
User
├── _id
├── name
├── email
└── password
```

### Issue

```text
Issue
├── _id
├── title
├── description
├── status
├── priority
├── createdBy → User
├── assignedTo → User
└── timestamps
```

### Comment

```text
Comment
├── _id
├── content
├── issue → Issue
├── author → User
└── timestamps
```

### Relationships

```text
User
 │
 ├──────────────┐
 │              │
 ▼              ▼
createdBy    assignedTo
 │              │
 └────── Issue ─┘
          │
          │
          ▼
       Comments
          │
          ▼
        User
        author
```

## API Endpoints

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |

### Users

| Method | Endpoint     | Description                    |
| ------ | ------------ | ------------------------------ |
| GET    | `/api/users` | Get users for issue assignment |

### Issues

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| GET    | `/api/issues`     | Get issues           |
| GET    | `/api/issues/:id` | Get a specific issue |
| POST   | `/api/issues`     | Create an issue      |
| PUT    | `/api/issues/:id` | Update an issue      |
| DELETE | `/api/issues/:id` | Delete an issue      |

### Comments

| Method | Endpoint                        | Description        |
| ------ | ------------------------------- | ------------------ |
| GET    | `/api/issues/:issueId/comments` | Get issue comments |
| POST   | `/api/issues/:issueId/comments` | Add a comment      |
| DELETE | `/api/comments/:commentId`      | Delete a comment   |

All protected endpoints require a valid JWT authentication token.

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB or a MongoDB Atlas account
- Git

### Installation
1. Clone the repository
```
git clone https://github.com/your-username/team-issue-tracker.git
cd team-issue-tracker
```
2. Install backend dependencies
```
cd server
npm install
```
3. Configure environment variables

Create a .env file inside the server directory:

```
PORT=5000


MONGO_URI=your_mongodb_connection_string


JWT_SECRET=your_jwt_secret


CLIENT_URL=http://localhost:5173
```

Do not commit .env to Git.

4. Start the backend
npm run dev

The backend will run on:
`http://localhost:5000`

5. Install frontend dependencies

Open another terminal:

```
cd client
npm install
```

6. Start the frontend

`npm run dev`

The frontend will typically run on:
`http://localhost:5173`

## Authentication Flow

The application uses JWT-based authentication.

```
User Login
    │
    ▼
POST /api/auth/login
    │
    ▼
Express validates credentials
    │
    ▼
JWT generated
    │
    ▼
Frontend stores authentication state
    │
    ▼
JWT sent with protected API requests
    │
    ▼
Auth Middleware verifies token
    │
    ▼
Request processed
```

## Authorization

Authentication and authorization are handled separately.

### Authentication

Determines:

`"Who is this user?"`

JWT middleware verifies the user's token.

### Authorization

Determines:

`"Is this user allowed to perform this action?"`

For example, when deleting an issue:

```
DELETE /api/issues/:id
        │
        ▼
Verify JWT
        │
        ▼
Find issue
        │
        ▼
Check issue.createdBy
        │
        ├── Same user → Delete
        │
        └── Different user → 403 Forbidden
```

The same principle is applied to comment deletion.

## Database Optimization

MongoDB indexes are added to frequently queried fields.

1. Issue indexes
- status
- priority
- assignedTo
- createdBy
- status + priority
2. Comment index
- issue

These indexes help MongoDB locate frequently filtered or related documents more efficiently as the dataset grows.

## Validation & Security

The backend performs validation instead of relying solely on frontend validation.

Implemented measures include:

- JWT authentication
- Protected API routes
- Authorization checks
- Mongoose schema validation
- Password hashing
- Password fields excluded from user responses
- Environment variables for secrets
- Helmet security headers
- CORS configuration
- API 404 handling
- Centralized error handling
- Input length restrictions
- Enum validation for issue status and priority

Example Issue
```
{
    "title": "Payment API timeout",
    "description": "Payment requests are timing out intermittently.",
    "status": "In Progress",
    "priority": "Critical",
    "createdBy": "user_id",
    "assignedTo": "user_id"
}
```
Example Comment
```
{
    "content": "I will investigate the timeout logs.",
    "issue": "issue_id",
    "author": "user_id"
}
```

## Application Workflow
```
Register
   │
   ▼
Login
   │
   ▼
Dashboard
   │
   ├───────────────┐
   │               │
   ▼               ▼
Issues          Statistics
   │
   ├── Search
   ├── Filter
   ├── Create
   └── Assign
        │
        ▼
   Issue Details
        │
        ├── Edit
        ├── Delete
        └── Comments
               │
               ├── Add
               └── Delete
```
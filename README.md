# FormForge - No-Code Dynamic Form Builder

FormForge is a modern, responsive, MERN stack web application built for creating and managing dynamic forms, similar to Typeform or Google Forms.

## Prerequisites
- Node.js (v16+)
- MongoDB (Running locally on port 27017, or update `server/.env`)

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, React Router, Axios, Lucide React
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)

## Setup Instructions

### 1. Clone & Install Dependencies
Navigate into both `client` and `server` folders and install the packages.

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure Environment
In the `server/` directory, there is an `.env` file already created:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/formforge
```

### 3. Seed Sample Data (Optional)
To populate the database with a sample "Internship Application Form":
```bash
cd server
node seed.js
```

### 4. Run the Application

**Terminal 1 (Backend Server):**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```
*(Note: If you want hot-reloading on backend, use `npx nodemon server.js`)*

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Client runs on http://localhost:3000
```

---

## Application Structure & Navigation
1. **Admin Dashboard** (`/`): View all created forms, duplicate, or delete them.
2. **Form Builder** (`/builder/:id`): Add 7 different field types dynamically via drag-and-drop mechanics.
3. **Public Form** (`/form/:id`): The live form to share with users where responses are collected.
4. **Responses Viewer** (`/responses/:id`): View submissions in a tabular format and **Export to CSV**.


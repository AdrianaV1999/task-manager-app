# 🗂️ Task Manager App

A full-stack task management application built with **React + Vite** on the frontend and **Node.js/Express** with **MongoDB** on the backend. The app features **user authentication**, **task CRUD operations**, **advanced filtering and sorting**, and detailed **task statistics** for enhanced productivity. The responsive UI is built using **Tailwind CSS**.

**Live Site** : https://task-manager-9whx.onrender.com/

---

## Features

- **User authentication** with JWT (JSON Web Tokens) for secure login and registration  
- **Protected routes** via middleware to restrict access to authenticated users only  
- **Full CRUD functionality** for tasks:  
  - Create tasks with title, description, priority, due date  
  - Read tasks filtered by status: All, Today, This Week  
  - Filter tasks by priority: Low, Medium, High  
  - Update and delete tasks  
- **Task statistics** showing counts and percentages of completed, pending, and total tasks  
- **Recent activity** tracking user task actions  
- User profile management: view and update profile and password  
- Responsive UI with sidebar, navbar, modals, and task lists  
- Static dummy data and CSS classes used for UI styling  

---

## Project Structure

### Frontend

#### Components

- **Layout** – Main layout wrapper for the app  
- **Navbar** – Top navigation bar with user info and logout  
- **Sidebar** – Side menu with navigation links  
- **Login** & **SignUp** – Authentication forms for users  
- **Profile** – User profile page for updating info and password  
- **TaskModal** – Modal dialog to create or edit tasks  
- **TaskItem** – Displays an individual task with action buttons  
- **TaskStatistics** – Shows statistics like completed tasks, pending tasks, totals, and percentages  
- **RecentActivity** – Lists recent user tasks  

#### Pages

- **Dashboard** – Main page showing tasks with filtering options  
- **CompletePage** – Displays all completed tasks  
- **PendingPage** – Displays all pending tasks  

#### Core File

- **App.jsx** – Root component managing routing, global state, and context providers  

#### Assets

- **assets/dummy.jsx** – Static dummy data and CSS utility classes used throughout components for consistent styling  

---

### Backend

- **Models**:  
  - `userModel.js` – User schema with fields for name, email, and password  
  - `taskModel.js` – Task schema including title, description, priority, dueDate, owner reference, completion status, and timestamps  
- **Controllers**:  
  - `userController.js` – Handles user registration, login, profile updates, password changes, and fetching current user  
  - `taskController.js` – CRUD operations for tasks with filtering capabilities  
- **Middleware**:  
  - `Auth.js` – JWT authentication middleware securing private API routes  
- **Routes**:  
  - `userRouter.js` – Routes for user-related API endpoints (register, login, profile, password)  
  - `taskRouter.js` – Routes for task CRUD operations, all protected by authentication middleware  
- **Config**:  
  - `db.js` – MongoDB connection configuration  
- **Server**:  
  - `server.js` – Express app initialization, middleware setup, route mounting, and server startup  

---

## Data Handling

- Backend persists user and task data in MongoDB database  
- Frontend consumes secure RESTful API endpoints using JWT for authentication  
- UI utilizes static dummy data from `assets/dummy.jsx` for styling and placeholder content  

---

## Tech Stack

- **Frontend:** React + Vite  
- **Backend:** Node.js + Express  
- **Database:** MongoDB with Mongoose ODM  
- **Authentication:** JWT (jsonwebtoken)  
- **Middleware:** Custom authentication middleware  
- **Styling:** Tailwind CSS with utility classes and static dummy data  

---




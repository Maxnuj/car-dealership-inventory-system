# Car Dealership Inventory System

A full-stack web application for managing vehicle inventory in a car dealership. The system enables secure user authentication, vehicle inventory management, purchasing and restocking operations, and advanced search functionality through a responsive React frontend and a robust Express backend.

---

## Features

### Authentication
- User Registration
- User Login
- JWT-based Authentication
- Protected Routes
- Role-Based Authorization (Admin/User)

### Vehicle Management
- Add New Vehicle
- Edit Vehicle Details
- Archive (Delete) Vehicle
- View Available Inventory

### Inventory Management
- Purchase Vehicles
- Restock Inventory
- Automatic Quantity Updates
- Purchase Disabled When Stock Reaches Zero

### Search
- Search by Make
- Search by Model
- Search by Category
- Search by Price Range
- Combined Search Filters

---

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- PostgreSQL
- Prisma ORM

### Authentication
- JSON Web Token (JWT)
- bcrypt

### Testing
- Jest
- Supertest

---

## Project Structure

```
car-dealership-inventory-system/
│
├── client/                 # React Frontend
│   ├── src/
│   ├── public/
│   └── ...
│
├── server/                 # Express Backend
│   ├── prisma/
│   ├── src/
│   └── ...
│
├── docs/                   # Project Documentation
│
├── package.json
└── README.md
```

---

## Prerequisites

Before running the project, ensure the following are installed:

- Node.js (v22 or later)
- npm (v10 or later)
- PostgreSQL (v16 or later)

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/Maxnuj/car-dealership-inventory-system.git
cd car-dealership-inventory-system
```

### Install Dependencies

```bash
npm install
```

---

## Environment Variables

### Backend

Create a file named:

```
server/.env
```

Example:

```env
NODE_ENV=development
PORT=4000

DATABASE_URL=postgresql://username:password@localhost:5432/car_dealership

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h

CORS_ORIGIN=http://localhost:5173
```

---

### Frontend

Create:

```
client/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

---

## Database Setup

Generate Prisma Client

```bash
npx prisma generate
```

Run Database Migrations

```bash
npx prisma migrate dev
```

(Optional) Open Prisma Studio

```bash
npx prisma studio
```

---

## Running the Application

### Start Backend

```bash
npm run dev --workspace=@car-dealership/server
```

### Start Frontend

```bash
npm run dev --workspace=@car-dealership/client
```

Open the application in your browser:

```
http://localhost:5173
```

---

## Build Project

### Backend

```bash
npm run build --workspace=@car-dealership/server
```

### Frontend

```bash
npm run build --workspace=@car-dealership/client
```

---

## Running Tests

Run Backend Tests

```bash
npm run test --workspace=@car-dealership/server
```

Current Status:

- ✅ 31 Tests Passing

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |

---

### Vehicles

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/vehicles` | Get all vehicles |
| GET | `/api/vehicles/:id` | Get vehicle details |
| POST | `/api/vehicles` | Add vehicle (Admin) |
| PUT | `/api/vehicles/:id` | Update vehicle (Admin) |
| DELETE | `/api/vehicles/:id` | Archive vehicle (Admin) |

---

### Inventory

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/vehicles/:id/purchase` | Purchase vehicle |
| POST | `/api/vehicles/:id/restock` | Restock inventory (Admin) |

---

### Search

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/vehicles/search` | Search vehicles using make, model, category, and price range |

---

## Authentication

The application uses **JWT (JSON Web Tokens)** for authentication.

Protected endpoints require the following HTTP header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Screenshots

Add screenshots of the following pages:

- Login Page
![Login](images/image.png)
- Registration Page
![Registration](images/image-1.png)
- Dashboard
![Dashboard](images/image-2.png)
- Vehicle Management
![Management](images/image-3.png)
- Search
![Search](images/image-4.png)
- Purchase Workflow
![purchase](images/image-5.png)
![Restock](images/image-6.png)

---

## Future Enhancements

- Vehicle Image Upload
- Sales Analytics Dashboard
- Pagination
- Sorting Options
- Docker Deployment
- Email Notifications
- Cloud Deployment

---

## Author

**Manuj Kumar**

BE Computer Science & Engineering  
Chandigarh University

---

## License

This project was developed for academic purposes as part of the AI-Assisted Software Development assignment.
# SKP SAINIK PUBLIC SCHOOL - Web Portal

A comprehensive school management system featuring a modern frontend for students, parents, and teachers, and a dedicated backend for data management.

## 📁 Project Structure

- **/frontend**: Next.js application with Prisma/SQLite for UI-related data.
- **/backend**: Express.js server using a JSON-based database for core business logic.
- **database_schema.sql**: SQL reference for the system's data model.

---

## 🚀 Getting Started

Follow these steps to set up the project on your local machine.

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### 2. Backend Setup
The backend handles authentication, student records, and circulars using a lightweight JSON database.

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start the server
node server.js
```
The backend will run on **http://localhost:5000**.

> [!IMPORTANT]
> **Initialize the Database**: After starting the backend, visit [http://localhost:5000/api/init](http://localhost:5000/api/init) in your browser to seed the initial admin user and sample data.

### 3. Frontend Setup
The frontend provides the user interface and uses Prisma with SQLite for session and local data.

```bash
# Navigate to frontend (from root)
cd ../frontend

# Install dependencies
npm install

# Set up the database (if dev.db is missing)
npx prisma generate
npx prisma db push

# Start the development server
npm run dev
```
The frontend will run on **http://localhost:3000**.

---

## 🛠️ Configuration

### Environment Variables
For the **frontend**, ensure you have a `.env` file in the `/frontend` directory:
```env
DATABASE_URL="file:./prisma/dev.db"
```

### Credentials (Post-Initialization)
After running the `/api/init` route, you can log in with:
- **Email**: `admin@skpsainik.edu.in`
- **Password**: `password123`
- **Role**: `admin`

---

## 📞 Support
For any issues regarding setup, please contact the development team.
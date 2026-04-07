# SKP Sainik Public School - Web Portal

![School Logo](scl%20logo.png)

A comprehensive, premium School Management System designed for **SKP Sainik Public School**. This platform features a high-density, modern UI/UX and a robust backend for managing student identities, academic records, and financial transactions.

---

## 🏗️ Technical Architecture

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, Framer Motion, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, Prisma ORM.
- **Database**: PostgreSQL.
- **Authentication**: JWT-based & Google OAuth2 integration.

---

## 🚀 Getting Started

Follow these steps to set up the project on your local machine.

### 1. Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **PostgreSQL Instance** (Local or Cloud)

### 2. Repository Setup
```bash
git clone https://github.com/your-username/skp-school-web.git
cd skp-school-web
```

### 3. Backend Configuration
The backend handles the core logic and database communication.

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```
2. **Environment Setup**:
   Create a `.env` file in the `/backend` directory and add the following:
   ```env
   # Database connection
   DATABASE_URL="postgresql://user:password@localhost:5432/spsschool_db"

   # Security
   JWT_SECRET="your_secure_random_key"

   # Google OAuth (Get from Google Cloud Console)
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

   # App URLs
   FRONTEND_URL="http://localhost:3000"
   BACKEND_URL="http://localhost:5000"
   ```
3. **Database Initialization**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. **Start the Server**:
   ```bash
   npm run dev
   ```
   The backend will run on **http://localhost:5000**.

### 4. Frontend Configuration
The frontend provides the premium user experience for cadets and admins.

1. **Install Dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at **http://localhost:3000**.

---

## 🌟 Key Features

- **🛡️ Digital ID & Profile**: Automated digital identity cards for every cadet with instant profile picture updates.
- **💰 Fee Management System**:
  - Class-wise global fee structure configuration.
  - Automated monthly fee generation for the entire student body.
  - Multi-step secure public payment portal.
- **📊 Admin Dashboard**: Real-time analytics for revenue, student attendance, and staff management.
- **📰 Notice & Notice Board**: Dynamic, scrolling ticker for school-wide alerts and recent circulars.
- **📁 Multimedia Gallery**: Categorized photo and video gallery manageble via the admin panel.
- **🛍️ Stationery Store**: Integrated e-shop for school supplies and uniform items.

---

## 📁 Directory Overview

```text
├── backend/
│   ├── prisma/             # Database schema and migrations
│   ├── uploads/            # Student and Staff profile pictures
│   ├── server.js           # Main Express server logic
│   └── .env                # Backend sensitive configuration
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # High-end UI components
│   │   └── lib/            # API services and global utilities
│   └── tailwind.config.ts  # Visual theme and tokens
└── README.md
```

---

## 🛡️ Security & Roles
- **Admin**: Full access to finance, student data, and site content.
- **Teacher**: Access to attendance management and academic results.
- **Student (Cadet)**: Access to personal digital ID, fee history, and result cards.
- **Guest**: Access to admissions, fee structure, and school information.

---

## 📞 Support & Maintenance
For any technical issues or feature requests, contact the development team at [support@skpschool.com](mailto:support@skpschool.com).

*Built with ❤️ for SKP Sainik Public School.*
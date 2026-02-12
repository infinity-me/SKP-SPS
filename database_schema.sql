-- Database Schema for SKP SAINIK PUBLIC SCHOOL

-- 1. Users & Authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
    school_id VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Profile
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    admission_no VARCHAR(50) UNIQUE NOT NULL,
    class VARCHAR(20),
    section VARCHAR(10),
    roll_no INTEGER,
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    parent_name VARCHAR(255)
);

-- 3. Teachers Profile
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    staff_id VARCHAR(50) UNIQUE NOT NULL,
    designation VARCHAR(100),
    qualification VARCHAR(255),
    subjects TEXT[]
);

-- 4. Fees Management
CREATE TABLE fees (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(100), -- Tuition, Activity, Exam, etc.
    due_date DATE,
    status VARCHAR(50) CHECK (status IN ('paid', 'pending', 'partial')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Transactions (Razorpay Integration)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    fee_id INTEGER REFERENCES fees(id),
    payment_id VARCHAR(255) UNIQUE, -- Razorpay Payment ID
    order_id VARCHAR(255) UNIQUE, -- Razorpay Order ID
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50),
    method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. School Communication
CREATE TABLE circulars (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(255),
    category VARCHAR(50),
    posted_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Results & Performance
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    subject VARCHAR(100),
    marks_obtained INTEGER,
    total_marks INTEGER,
    grade VARCHAR(5),
    term VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Gallery & CMS
CREATE TABLE gallery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    image_url VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

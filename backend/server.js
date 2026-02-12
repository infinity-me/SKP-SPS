const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
    const { email, password, role } = req.body;
    const users = db.users.findMany();
    const user = users.find(u => u.email === email && u.password === password && u.role === role);

    if (user) {
        return res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId
            },
            token: "jwt_" + Math.random().toString(36).substring(7),
        });
    }
    return res.status(401).json({ success: false, message: "Invalid credentials" });
});

// Student Routes
app.get('/api/students', (req, res) => {
    res.json({ success: true, data: db.students.findMany() });
});

// Fee Routes
app.get('/api/fees', (req, res) => {
    const { studentId } = req.query;
    let fees = db.fees.findMany();
    if (studentId) {
        fees = fees.filter(f => f.studentId === parseInt(studentId));
    }
    res.json({ success: true, data: fees });
});

// Circular Routes
app.get('/api/circulars', (req, res) => {
    res.json({ success: true, data: db.circulars.findMany() });
});

app.post('/api/circulars', async (req, res) => {
    const circular = await db.circulars.create(req.body);
    res.json({ success: true, message: "Circular posted", data: circular });
});

// Admission Routes
app.post('/api/admission', async (req, res) => {
    const submission = await db.admissions.create({ ...req.body, status: "pending" });
    res.json({
        success: true,
        message: "Application submitted! Tracking ID: SPS-" + submission.id,
        data: submission
    });
});

app.get('/api/admission', (req, res) => {
    res.json({ success: true, data: db.admissions.findMany() });
});

// Init/Seed Route
app.get('/api/init', async (req, res) => {
    const users = db.users.findMany();
    if (users.length > 0) return res.json({ success: true, message: "Already initialized" });

    const admin = await db.users.create({ name: "Super Admin", email: "admin@skpsainik.edu.in", password: "password123", role: "admin" });
    const teacher = await db.users.create({ name: "Abhishek Maurya", email: "abhishek@skpsainik.edu.in", password: "password123", role: "teacher" });
    const studentUser = await db.users.create({ name: "Rahul Sharma", email: "rahul@student.edu.in", password: "password123", role: "student", schoolId: "SPS2026001" });

    await db.students.create({ userId: studentUser.id, admissionNo: "SPS2026001", class: "9th", section: "A", parentName: "Mr. Sharma" });
    await db.circulars.create({ title: "Annual Sports Meet 2026", category: "Sports", description: "The annual sports meet will be held on Feb 25th." });

    res.json({ success: true, message: "System initialized and seeded." });
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});

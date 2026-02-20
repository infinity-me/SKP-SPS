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

app.post('/api/students', async (req, res) => {
    const student = await db.students.create(req.body);
    res.json({ success: true, data: student });
});

app.put('/api/students/:id', async (req, res) => {
    const student = await db.students.update(req.params.id, req.body);
    res.json({ success: true, data: student });
});

app.delete('/api/students/:id', async (req, res) => {
    await db.students.delete(req.params.id);
    res.json({ success: true, message: "Student deleted" });
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

app.post('/api/fees', async (req, res) => {
    const fee = await db.fees.create(req.body);
    res.json({ success: true, data: fee });
});

// Circular Routes
app.get('/api/circulars', (req, res) => {
    res.json({ success: true, data: db.circulars.findMany() });
});

app.post('/api/circulars', async (req, res) => {
    const circular = await db.circulars.create(req.body);
    res.json({ success: true, message: "Circular posted", data: circular });
});

app.put('/api/circulars/:id', async (req, res) => {
    const circular = await db.circulars.update(req.params.id, req.body);
    res.json({ success: true, data: circular });
});

app.delete('/api/circulars/:id', async (req, res) => {
    await db.circulars.delete(req.params.id);
    res.json({ success: true, message: "Circular deleted" });
});

// Admission Routes
app.get('/api/admission', (req, res) => {
    res.json({ success: true, data: db.admissions.findMany() });
});

app.post('/api/admission', async (req, res) => {
    const submission = await db.admissions.create({ ...req.body, status: "pending" });
    res.json({
        success: true,
        message: "Application submitted! Tracking ID: SPS-" + submission.id,
        data: submission
    });
});

app.put('/api/admission/:id', async (req, res) => {
    const admission = await db.admissions.update(req.params.id, req.body);
    res.json({ success: true, data: admission });
});

// Photo/Gallery Routes
app.get('/api/photos', (req, res) => {
    res.json({ success: true, data: db.photos.findMany() });
});

app.post('/api/photos', async (req, res) => {
    const photo = await db.photos.create(req.body);
    res.json({ success: true, data: photo });
});

app.delete('/api/photos/:id', async (req, res) => {
    await db.photos.delete(req.params.id);
    res.json({ success: true, message: "Photo deleted" });
});

// Stationery Store Routes
app.get('/api/stationery', (req, res) => {
    res.json({ success: true, data: db.stationery.findMany() });
});

app.post('/api/stationery', async (req, res) => {
    const item = await db.stationery.create(req.body);
    res.json({ success: true, data: item });
});

app.put('/api/stationery/:id', async (req, res) => {
    const item = await db.stationery.update(req.params.id, req.body);
    res.json({ success: true, data: item });
});

app.delete('/api/stationery/:id', async (req, res) => {
    await db.stationery.delete(req.params.id);
    res.json({ success: true, message: "Item deleted" });
});

// Order Routes
app.get('/api/orders', (req, res) => {
    res.json({ success: true, data: db.orders.findMany() });
});

app.post('/api/orders', async (req, res) => {
    const order = await db.orders.create({ ...req.body, status: "pending", createdAt: new Date().toISOString() });
    res.json({ success: true, message: "Order placed successfully", data: order });
});

app.put('/api/orders/:id', async (req, res) => {
    const order = await db.orders.update(req.params.id, req.body);
    res.json({ success: true, data: order });
});

// Init/Seed Route
app.get('/api/init', async (req, res) => {
    const users = db.users.findMany();
    if (users.length > 0) return res.json({ success: true, message: "Already initialized" });

    const admin = await db.users.create({ name: "Super Admin", email: "admin@skpsainik.edu.in", password: "password123", role: "admin" });
    const teacher = await db.users.create({ name: "Abhishek Maurya", email: "abhishek@skpsainik.edu.in", password: "password123", role: "teacher" });
    const studentUser = await db.users.create({ name: "Rahul Sharma", email: "rahul@student.edu.in", password: "password123", role: "student", schoolId: "SPS2026001" });

    await db.students.create({ userId: studentUser.id, admissionNo: "SPS2026001", firstName: "Rahul", lastName: "Sharma", class: "9th", section: "A", parentName: "Mr. Sharma" });
    await db.circulars.create({ title: "Annual Sports Meet 2026", category: "Sports", description: "The annual sports meet will be held on Feb 25th.", date: new Date().toISOString() });

    // Seed Stationery
    await db.stationery.create({ name: "School Diary 2026", category: "Books", price: 150, stock: 500, description: "Official SKP Sainik School diary for assignments and notes.", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400&auto=format&fit=crop" });
    await db.stationery.create({ name: "Biology Lab Coat", category: "Uniform", price: 450, stock: 100, description: "Standard white lab coat for senior science students.", image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=400&auto=format&fit=crop" });
    await db.stationery.create({ name: "Geometry Box set", category: "Stationery", price: 120, stock: 200, description: "Complete set with compass, divider, and rulers.", image: "https://images.unsplash.com/photo-1583484963886-cfe2bef37f52?q=80&w=400&auto=format&fit=crop" });

    res.json({ success: true, message: "System initialized and seeded." });
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});

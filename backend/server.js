require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* =========================
   🔐 AUTH ROUTES
========================= */

// LOGIN
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Wrong password" });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* =========================
   🔐 AUTH MIDDLEWARE
========================= */

const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};


/* =========================
   👨‍🎓 STUDENTS
========================= */

app.get('/api/students', auth, async (req, res) => {
    const students = await prisma.student.findMany({
        include: { user: true }
    });
    res.json({ success: true, data: students });
});

app.post('/api/students', auth, async (req, res) => {
    try {
        const { firstName, lastName, admissionNo, class: className, section, parentName, phone } = req.body;
        
        const hashedPassword = await bcrypt.hash("student123", 10);
        
        const user = await prisma.user.create({
            data: {
                name: `${firstName} ${lastName}`,
                email: `student_${admissionNo}@skpschool.com`,
                phone,
                password: hashedPassword,
                role: "student",
                studentProfile: {
                    create: {
                        admissionNo,
                        class: className,
                        section,
                        parentName,
                    }
                }
            },
            include: { studentProfile: true }
        });

        res.json({ success: true, data: user.studentProfile });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/students/:id', auth, async (req, res) => {
    const student = await prisma.student.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
    });
    res.json({ success: true, data: student });
});

app.delete('/api/students/:id', auth, async (req, res) => {
    await prisma.student.delete({
        where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true, message: "Student deleted" });
});


/* =========================
   👩‍🏫 TEACHERS
========================= */

app.get('/api/teachers', auth, async (req, res) => {
    const teachers = await prisma.teacher.findMany({
        include: { user: true }
    });
    res.json({ success: true, data: teachers });
});

app.post('/api/teachers', auth, async (req, res) => {
    const teacher = await prisma.teacher.create({
        data: req.body
    });
    res.json({ success: true, data: teacher });
});


/* =========================
   💰 FEES
========================= */

app.get('/api/fees', auth, async (req, res) => {
    const { studentId } = req.query;

    const fees = await prisma.fee.findMany({
        where: studentId ? { studentId: parseInt(studentId) } : {},
        include: { student: true }
    });

    res.json({ success: true, data: fees });
});

app.post('/api/fees', auth, async (req, res) => {
    const fee = await prisma.fee.create({
        data: req.body
    });
    res.json({ success: true, data: fee });
});


/* =========================
   📢 CIRCULARS
========================= */

app.get('/api/circulars', async (req, res) => {
    const circulars = await prisma.circular.findMany();
    res.json({ success: true, data: circulars });
});

app.post('/api/circulars', auth, async (req, res) => {
    const circular = await prisma.circular.create({
        data: req.body
    });
    res.json({ success: true, data: circular });
});

app.put('/api/circulars/:id', auth, async (req, res) => {
    const circular = await prisma.circular.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
    });
    res.json({ success: true, data: circular });
});

app.delete('/api/circulars/:id', auth, async (req, res) => {
    await prisma.circular.delete({
        where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true, message: "Deleted" });
});


/* =========================
   📝 ADMISSIONS
========================= */

app.get('/api/admission', async (req, res) => {
    const data = await prisma.admission.findMany();
    res.json({ success: true, data });
});

app.post('/api/admission', async (req, res) => {
    const submission = await prisma.admission.create({
        data: {
            ...req.body,
            status: "pending"
        }
    });

    res.json({
        success: true,
        message: "Application submitted!",
        data: submission
    });
});


/* =========================
   🖼 PHOTOS
========================= */

app.get('/api/photos', async (req, res) => {
    const data = await prisma.photo.findMany();
    res.json({ success: true, data });
});

app.post('/api/photos', auth, async (req, res) => {
    const photo = await prisma.photo.create({
        data: req.body
    });
    res.json({ success: true, data: photo });
});


/* =========================
   🛒 STATIONERY
========================= */

app.get('/api/stationery', async (req, res) => {
    const data = await prisma.stationery.findMany();
    res.json({ success: true, data });
});

app.post('/api/stationery', auth, async (req, res) => {
    const item = await prisma.stationery.create({
        data: req.body
    });
    res.json({ success: true, data: item });
});


/* =========================
   📦 ORDERS
========================= */

app.get('/api/orders', auth, async (req, res) => {
    const data = await prisma.order.findMany();
    res.json({ success: true, data });
});

app.post('/api/orders', async (req, res) => {
    const order = await prisma.order.create({
        data: {
            ...req.body,
            status: "pending",
            createdAt: new Date()
        }
    });

    res.json({ success: true, data: order });
});


/* =========================
   📊 ANALYTICS
========================= */

app.get('/api/analytics', auth, async (req, res) => {
    try {
        const [studentCount, teacherCount, revenue, pending] = await Promise.all([
            prisma.student.count(),
            prisma.teacher.count(),
            prisma.fee.aggregate({ _sum: { amount: true }, where: { status: 'paid' } }),
            prisma.fee.aggregate({ _sum: { amount: true }, where: { status: 'pending' } })
        ]);

        const recentAdmissions = await prisma.admission.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: {
                studentCount,
                teacherCount,
                totalRevenue: revenue._sum.amount || 0,
                pendingFees: pending._sum.amount || 0,
                recentAdmissions
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* =========================
   🌱 INIT (SEED DATA)
========================= */

app.get('/api/init', async (req, res) => {
    const users = await prisma.user.findMany();

    if (users.length > 0) {
        return res.json({ success: true, message: "Already initialized" });
    }

    const hashed = await bcrypt.hash("password123", 10);

    const admin = await prisma.user.create({
        data: {
            name: "Admin",
            email: "admin@school.com",
            password: hashed,
            role: "admin"
        }
    });

    res.json({ success: true, message: "Seeded successfully", admin });
});


/* =========================
   🚀 START SERVER
========================= */

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
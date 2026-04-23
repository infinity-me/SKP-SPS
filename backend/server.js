require('dotenv').config();
console.log("JWT_SECRET available:", !!process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');

const prisma = require('./db');

const fs = require('fs');
const chatRoutes = require('./routes/chat');
const { requireRole } = require('./middleware/roleAuth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 📦 Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

// 📁 Multer Config for Avatar Uploads
// Use memory storage to store files in Postgres DB instead of ephemeral local disk
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) return cb(null, true);
        cb(new Error('Only images (jpg, png, webp) are allowed!'));
    }
});

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

app.use(session({
    secret: process.env.JWT_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;

        let user = await prisma.user.findUnique({
            where: { email }
        });

        if (user) {
            if (!user.googleId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId }
                });
            }
        } else {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    googleId,
                    role: "guest",
                    isVerified: true
                }
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
});

/* =========================
   🔐 AUTH ROUTES
========================= */

// LOGIN
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Check if role matches (if provided)
        if (role && user.role !== role) {
            return res.status(400).json({ success: false, message: `This account is registered as a ${user.role}, not a ${role}.` });
        }

        if (!user.password) {
            return res.status(400).json({ success: false, message: "This account uses Google login. Please use 'Continue with Google'." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
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
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: "Server error during login." });
    }
});

// GOOGLE AUTH
app.post('/api/auth/google', async (req, res) => {
    try {
        const { idToken, role = "guest" } = req.body;
        
        // In a real app, verify the token with googleClient.verifyIdToken
        // For development/demo purposes without a client ID, we'll simulate verification
        // if no client ID is provided in .env
        let payload;
        if (process.env.GOOGLE_CLIENT_ID) {
            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        } else {
            // Simulation for demo
            payload = {
                email: "guest_demo@gmail.com",
                name: "Guest User",
                sub: "google123456"
            };
        }

        const { email, name, sub: googleId } = payload;

        let user = await prisma.user.findUnique({
            where: { email }
        });

        if (user) {
            // Link google ID if not linked
            if (!user.googleId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId }
                });
            }
        } else {
            // Create guest user
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    googleId,
                    role: "guest",
                    isVerified: true
                }
            });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ success: true, token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// REGISTER GUEST
app.post('/api/auth/register-guest', async (req, res) => {
    try {
        const { name, email, password = "guest_password_123" } = req.body;
        
        let user = await prisma.user.findUnique({ where: { email } });
        
        if (user) {
            // If already a guest, just log them in
            if (user.role === 'guest') {
                const token = jwt.sign(
                    { userId: user.id, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );
                return res.json({ success: true, token, user });
            } else {
                // If student or teacher, they should use appropriate login
                return res.status(400).json({ 
                    success: false, 
                    message: `This email is registered as a ${user.role}. Please use the ${user.role} login option.` 
                });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "guest",
                isVerified: true
            }
        });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ success: true, token, user });
    } catch (err) {
        console.error("Guest Registration Error:", err);
        res.status(500).json({ success: false, message: "Server error during registration." });
    }
});

// REDIRECT GOOGLE AUTH (STANDARD OAUTH2 FLOW)
app.get('/api/auth/google', (req, res, next) => {
    const { role } = req.query;
    // Store role in state to use it after callback
    const state = role ? Buffer.from(JSON.stringify({ role })).toString('base64') : undefined;
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        state
    })(req, res, next);
});

app.get('/api/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        let role = req.user.role; // Default to user's existing role
        
        // Try to get role from state if we want to force it (e.g. for guest signup)
        try {
            if (req.query.state) {
                const state = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
                if (state.role) role = state.role;
            }
        } catch (e) {}

        const token = jwt.sign(
            { userId: req.user.id, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Redirect back to frontend with token
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        res.redirect(`${frontendUrl}/login?token=${token}&role=${req.user.role}`);
    }
);

// 🤖 CHATBOT ROUTE
const botRuleRoutes = require('./routes/botRule');
app.use('/api/chat', chatRoutes);
app.use('/api/bot-rules', botRuleRoutes);

// VERIFY SCHOOL ID (Check existence for student/teacher)
app.get('/api/auth/verify-id', async (req, res) => {
    try {
        const { role, id } = req.query;

        if (role === 'student') {
            const student = await prisma.student.findUnique({
                where: { admissionNo: id },
                include: { user: true }
            });
            if (student) {
                return res.json({ success: true, exists: true, email: student.user.email });
            }
        } else if (role === 'teacher') {
            const teacher = await prisma.teacher.findUnique({
                where: { staffId: id },
                include: { user: true }
            });
            if (teacher) {
                return res.json({ success: true, exists: true, email: teacher.user.email });
            }
        }

        res.json({ success: false, message: "ID not found in school records" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* =========================
   🌐 PUBLIC DATA ROUTES
========================= */

// GET PUBLIC TEACHERS
app.get('/api/public/teachers', async (req, res) => {
    try {
        const teachers = await prisma.teacher.findMany({
            include: { user: true },
            orderBy: { id: 'asc' }
        });
        // Select only safe data for public
        const publicTeachers = teachers.map(t => ({
            id: t.id,
            name: t.user.name,
            designation: t.designation,
            qualification: t.qualification,
            profilePic: t.user.profilePic
        }));
        res.json({ success: true, data: publicTeachers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET PUBLIC TOPPERS (Students)
app.get('/api/public/toppers', async (req, res) => {
    try {
        const toppers = await prisma.student.findMany({
            where: { isTopper: true },
            include: { user: true },
            orderBy: [{ topperYear: 'desc' }, { topperPercent: 'desc' }]
        });
        const publicToppers = toppers.map(s => ({
            id: s.id,
            name: s.user.name,
            class: s.class,
            topperYear: s.topperYear,
            topperPercent: s.topperPercent,
            topperRank: s.topperRank,
            topperMarks: s.topperMarks,
            topperClass: s.topperClass,
            photo: s.photo,
            profilePic: s.user.profilePic
        }));
        res.json({ success: true, data: publicToppers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── BOARD TOPPERS (dedicated model) ──────────────────────────────────────────

// Seed defaults — idempotent (safe to run on every restart)
async function seedBoardToppers() {
    const seeds = [
        { name: "Anshu Yadav",     boardClass: "Class X", year: "2026", rank: "Joint 1st Rank", marks: "570/600", percentage: "95" },
        { name: "Nimmi Prajapati", boardClass: "Class X", year: "2026", rank: "Joint 1st Rank", marks: "570/600", percentage: "95" },
        { name: "Neelu Yadav",     boardClass: "Class X", year: "2026", rank: "2nd Rank",       marks: "560/600", percentage: "93.33" },
    ];
    for (const s of seeds) {
        const exists = await prisma.boardTopper.findFirst({ where: { name: s.name, year: s.year } });
        if (!exists) await prisma.boardTopper.create({ data: s });
    }

    // Deduplicate: remove extras keeping only the lowest id per name+year
    const all = await prisma.boardTopper.findMany({ orderBy: { id: 'asc' } });
    const seen = new Map();
    for (const t of all) {
        const key = `${t.name}||${t.year}`;
        if (seen.has(key)) {
            await prisma.boardTopper.delete({ where: { id: t.id } });
        } else {
            seen.set(key, true);
        }
    }
}
seedBoardToppers().catch(console.error);


// Public GET — no auth needed
app.get('/api/board-toppers', async (req, res) => {
    try {
        const toppers = await prisma.boardTopper.findMany({ orderBy: [{ year: 'desc' }, { createdAt: 'asc' }] });
        res.json({ success: true, data: toppers });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET PUBLIC RULES (From Circulars)
app.get('/api/public/rules', async (req, res) => {
    try {
        const rules = await prisma.circular.findMany({
            where: { category: 'Rules' },
            orderBy: { date: 'desc' }
        });
        res.json({ success: true, data: rules });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET PUBLIC STATS (Counts)
app.get('/api/public/stats', async (req, res) => {
    try {
        const [studentCount, teacherCount] = await Promise.all([
            prisma.student.count(),
            prisma.teacher.count()
        ]);
        res.json({ 
            success: true, 
            data: { 
                students: studentCount, 
                teachers: teacherCount 
            } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET PUBLIC NOTICES (Active)
app.get('/api/public/notices', async (req, res) => {
    try {
        const notices = await prisma.circular.findMany({
            where: { category: { not: 'Rules' } }, // Exclude rules as they are in the About section
            take: 5,
            orderBy: { date: 'desc' }
        });
        res.json({ success: true, data: notices });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET PUBLIC UPCOMING EVENTS
app.get('/api/public/events/upcoming', async (req, res) => {
    try {
        const now = new Date();
        const events = await prisma.calendarEvent.findMany({
            where: { date: { gte: now } },
            take: 3,
            orderBy: { date: 'asc' }
        });
        res.json({ success: true, data: events });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET PUBLIC RECENT PHOTOS
app.get('/api/public/photos/recent', async (req, res) => {
    try {
        const photos = await prisma.photo.findMany({
            take: 6,
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: photos });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* =========================
   🔐 AUTH MIDDLEWARE
========================= */

const auth = (req, res, next) => {
    let token = req.header('Authorization') || req.headers.authorization;

    if (!token) return res.status(401).json({ message: "No token provided" });

    // Handle "Bearer <token>" format
    if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Auth mismatch:", err.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// ── BOARD TOPPERS admin routes (auth required) ────────────────────────────────
app.get('/api/admin/board-toppers', auth, requireRole('admin', 'teacher'), async (req, res) => {
    try {
        const toppers = await prisma.boardTopper.findMany({ orderBy: [{ year: 'desc' }, { createdAt: 'asc' }] });
        res.json({ success: true, data: toppers });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/board-toppers', auth, requireRole('admin'), async (req, res) => {
    try {
        const { name, boardClass, year, rank, marks, percentage, photo } = req.body;
        if (!name || !boardClass || !year || !percentage) return res.status(400).json({ error: 'name, boardClass, year, percentage are required' });
        const topper = await prisma.boardTopper.create({ data: { name, boardClass, year, rank, marks, percentage, photo } });
        res.json({ success: true, data: topper });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/board-toppers/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const { name, boardClass, year, rank, marks, percentage, photo } = req.body;
        const topper = await prisma.boardTopper.update({
            where: { id: parseInt(req.params.id) },
            data: { name, boardClass, year, rank, marks, percentage, photo }
        });
        res.json({ success: true, data: topper });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/board-toppers/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        await prisma.boardTopper.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});
// ─────────────────────────────────────────────────────────────────────────────

// GET CURRENT USER PROFILE
app.get('/api/auth/me', auth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            include: {
                studentProfile: {
                    include: {
                        fees: {
                            orderBy: { dueDate: 'desc' }
                        }
                    }
                },
                teacherProfile: true
            }
        });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPLOAD AVATAR (NEW)
app.post('/api/auth/upload-avatar', auth, (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
        } else if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file received" });
        
        // Convert image buffer to DataURI so it can be stored persistently in Neon Postgres
        const base64Image = req.file.buffer.toString('base64');
        const avatarUrl = `data:${req.file.mimetype};base64,${base64Image}`;
        
        // Update user profile record
        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: { profilePic: avatarUrl }
        });

        res.json({ success: true, avatarUrl, user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE PROFILE
app.put('/api/auth/profile', auth, async (req, res) => {
    try {
        const { name, phone, profilePic, achievements } = req.body;
        
        // Update basic user info
        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: { 
                name, 
                phone,
                profilePic 
            }
        });

        // Update role-specific info (achievements)
        if (updatedUser.role === 'student') {
            await prisma.student.update({
                where: { userId: updatedUser.id },
                data: { achievements }
            });
        } else if (updatedUser.role === 'teacher') {
            await prisma.teacher.update({
                where: { userId: updatedUser.id },
                data: { achievements }
            });
        }

        res.json({ success: true, user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* =========================
   👨‍🎓 STUDENTS
========================= */

app.get('/api/students', auth, async (req, res) => {
    const students = await prisma.student.findMany({
        include: { user: true }
    });
    res.json({ success: true, data: students });
});

app.post('/api/students', auth, requireRole('admin'), async (req, res) => {
    try {
        const { firstName, lastName, admissionNo, class: className, section, parentName, phone, isTopper, topperYear, topperPercent, topperRank, topperMarks, topperClass, photo } = req.body;
        
        const hashedPassword = await bcrypt.hash("student123", 10);
        const finalPhone = phone && phone.trim() !== "" ? phone.trim() : null;

        const user = await prisma.user.create({
            data: {
                name: `${firstName} ${lastName}`,
                email: `student_${admissionNo}@skpschool.com`,
                phone: finalPhone,
                password: hashedPassword,
                role: "student",
                studentProfile: {
                    create: {
                        admissionNo,
                        class: className,
                        section,
                        parentName,
                        phone: finalPhone,
                        photo,
                        isTopper: isTopper === true || isTopper === 'true',
                        topperYear,
                        topperPercent,
                        topperRank,
                        topperMarks,
                        topperClass
                    }
                }
            },
            include: { studentProfile: true }
        });

        res.json({ success: true, data: user.studentProfile });
    } catch (err) {
        console.error("Student create error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/students/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const { admissionNo, class: className, section, parentName, phone, firstName, lastName, isTopper, topperYear, topperPercent, topperRank, topperMarks, topperClass, photo } = req.body;
        
        const studentId = parseInt(req.params.id);
        const finalPhone = phone && phone.trim() !== "" ? phone.trim() : null;
        
        const student = await prisma.student.update({
            where: { id: studentId },
            data: {
                admissionNo,
                class: className,
                section,
                parentName,
                phone: finalPhone,
                photo,
                isTopper: isTopper === true || isTopper === 'true',
                topperYear,
                topperPercent,
                topperRank,
                topperMarks,
                topperClass
            },
            include: { user: true }
        });
        
        // Optionally update the linked user details if needed
        if (student.userId && (firstName || lastName || finalPhone)) {
            const updateName = (firstName && lastName) ? `${firstName} ${lastName}` : student.user.name;
            await prisma.user.update({
                where: { id: student.userId },
                data: {
                    name: updateName,
                    phone: finalPhone
                }
            });
        }
        
        res.json({ success: true, data: student });
    } catch (err) {
        console.error("Student update error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/students/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const studentId = parseInt(req.params.id);
        // Cascade delete in a transaction to avoid FK constraint errors
        await prisma.$transaction(async (tx) => {
            const student = await tx.student.findUnique({ where: { id: studentId } });
            if (!student) throw new Error('Student not found');
            await tx.result.deleteMany({ where: { studentId } });
            await tx.attendance.deleteMany({ where: { studentId } });
            await tx.fee.deleteMany({ where: { studentId } });
            await tx.student.delete({ where: { id: studentId } });
            await tx.user.delete({ where: { id: student.userId } });
        });
        res.json({ success: true, message: "Student and all related records deleted" });
    } catch (err) {
        console.error("Student delete error:", err);
        res.status(500).json({ error: err.message });
    }
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

app.post('/api/teachers', auth, requireRole('admin'), async (req, res) => {
    try {
        const { firstName, lastName, name, email, phone, staffId, designation, qualification, subject, experience, photo } = req.body;
        
        // Handle if name is passed instead of firstName/lastName (like from our new form)
        let fName = firstName;
        let lName = lastName;
        if (name && !firstName && !lastName) {
            const parts = name.split(" ");
            fName = parts[0];
            lName = parts.slice(1).join(" ");
        }

        if (!staffId || !designation) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        const hashedPassword = await bcrypt.hash("teacher123", 10);
        const finalPhone = phone && phone.trim() !== "" ? phone.trim() : null;
        const finalEmail = email && email.trim() !== "" ? email.trim() : `teacher_${staffId}@skpschool.com`;
        
        const user = await prisma.user.create({
            data: {
                name: `${fName} ${lName}`.trim(),
                email: finalEmail,
                phone: finalPhone,
                password: hashedPassword,
                role: "teacher",
                isVerified: true,
                teacherProfile: {
                    create: { staffId, designation, qualification: qualification || "", subject, experience, photo }
                }
            },
            include: { teacherProfile: true }
        });
        res.json({ success: true, data: user.teacherProfile });
    } catch (err) {
        console.error("Teacher create error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/teachers/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const { staffId, designation, qualification, subject, experience, photo, name, phone, email } = req.body;
        const teacherId = parseInt(req.params.id);
        const finalPhone = phone && phone.trim() !== "" ? phone.trim() : null;
        
        const teacher = await prisma.teacher.update({
            where: { id: teacherId },
            data: {
                staffId, designation, qualification: qualification || "", subject, experience, photo
            },
            include: { user: true }
        });

        if (teacher.userId && (name || finalPhone || email)) {
            await prisma.user.update({
                where: { id: teacher.userId },
                data: { name: name || teacher.user.name, phone: finalPhone, email: email || teacher.user.email }
            });
        }
        res.json({ success: true, data: teacher });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/teachers/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const teacherId = parseInt(req.params.id);
        await prisma.$transaction(async (tx) => {
            const teacher = await tx.teacher.findUnique({ where: { id: teacherId } });
            if (!teacher) throw new Error('Teacher not found');
            await tx.teacher.delete({ where: { id: teacherId } });
            await tx.user.delete({ where: { id: teacher.userId } });
        });
        res.json({ success: true, message: "Teacher deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* =========================
   👩‍🏫 TEACHER APPLICATIONS
========================= */

app.get('/api/teacher-application', auth, async (req, res) => {
    try {
        const applications = await prisma.teacherApplication.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: applications });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/teacher-application', async (req, res) => {
    try {
        const application = await prisma.teacherApplication.create({
            data: {
                ...req.body,
                status: "pending"
            }
        });
        res.json({ 
            success: true, 
            message: "Application submitted successfully!", 
            data: application 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/teacher-application/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await prisma.teacherApplication.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* =========================
   💰 FEES
========================= */

// GET ALL FEES (Extended with student name)
app.get('/api/fees', auth, async (req, res) => {
    try {
        const { studentId } = req.query;
        const fees = await prisma.fee.findMany({
            where: studentId ? { studentId: parseInt(studentId) } : {},
            include: { 
                student: {
                    include: { user: true }
                } 
            },
            orderBy: { dueDate: 'desc' }
        });
        res.json({ success: true, data: fees });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE FEE
app.post('/api/fees', auth, requireRole('admin'), async (req, res) => {
    try {
        const fee = await prisma.fee.create({
            data: req.body
        });
        res.json({ success: true, data: fee });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE FEE
app.put('/api/fees/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const fee = await prisma.fee.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        res.json({ success: true, data: fee });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (duplicate DELETE removed — see below after fee-structure)

/* =========================
   📊 FEE STRUCTURE CRUD (NEW)
========================= */

app.get('/api/fee-structure', async (req, res) => {
    try {
        const structure = await prisma.feeStructure.findMany({
            orderBy: { className: 'asc' }
        });
        res.json({ success: true, data: structure });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/fee-structure', auth, requireRole('admin'), async (req, res) => {
    try {
        const { className, feeType, amount, description } = req.body;
        const newItem = await prisma.feeStructure.create({
            data: { className, feeType, amount: parseFloat(amount), description }
        });
        res.json({ success: true, data: newItem });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/fee-structure/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await prisma.feeStructure.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/fee-structure/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.feeStructure.delete({ where: { id: parseInt(id) } });
        res.json({ success: true, message: "Structure removed" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* =========================
   💳 AUTOMATED FEE GENERATION & PAYMENT (NEW)
========================= */

// LOOKUP PENDING FEES BY ADMISSION NO
app.get('/api/fees/lookup/:admissionNo', async (req, res) => {
    try {
        const { admissionNo } = req.params;
        const student = await prisma.student.findUnique({
            where: { admissionNo },
            include: { 
                user: true,
                fees: {
                    where: { status: 'pending' },
                    orderBy: { dueDate: 'asc' }
                }
            }
        });
        
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });
        res.json({ success: true, student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PAY A FEE (MOCK)
app.post('/api/fees/pay/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await prisma.fee.update({
            where: { id: parseInt(id) },
            data: { status: 'paid' }
        });
        res.json({ success: true, message: "Payment successful (Mock)", data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// BULK GENERATE MONTHLY FEES BASED ON STRUCTURE
app.post('/api/fees/generate', auth, requireRole('admin'), async (req, res) => {
    try {
        const { month, year } = req.body; // e.g. "April", 2026
        const structures = await prisma.feeStructure.findMany();
        const students = await prisma.student.findMany();
        
        let count = 0;
        for (const student of students) {
            // Find tuition structure for this student's class
            const classStructure = structures.filter(s => s.className === student.class);
            
            for (const item of classStructure) {
                // Check if already exists to avoid duplicates
                const existing = await prisma.fee.findFirst({
                    where: {
                        studentId: student.id,
                        type: `${item.feeType} (${month} ${year})`
                    }
                });
                
                if (!existing) {
                    await prisma.fee.create({
                        data: {
                            studentId: student.id,
                            amount: item.amount,
                            type: `${item.feeType} (${month} ${year})`,
                            status: 'pending',
                            dueDate: new Date(year, new Date(Date.parse(month + " 1, " + year)).getMonth() + 1, 10) // 10th of next month
                        }
                    });
                    count++;
                }
            }
        }
        
        res.json({ success: true, message: `Generated ${count} fee records for ${month} ${year}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE FEE
app.delete('/api/fees/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        await prisma.fee.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ success: true, message: "Fee record deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* =========================
   📢 CIRCULARS
========================= */

app.get('/api/circulars', async (req, res) => {
    const circulars = await prisma.circular.findMany();
    res.json({ success: true, data: circulars });
});

app.post('/api/circulars', auth, requireRole('admin'), async (req, res) => {
    const circular = await prisma.circular.create({
        data: req.body
    });
    res.json({ success: true, data: circular });
});

app.put('/api/circulars/:id', auth, requireRole('admin'), async (req, res) => {
    const circular = await prisma.circular.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
    });
    res.json({ success: true, data: circular });
});

app.delete('/api/circulars/:id', auth, requireRole('admin'), async (req, res) => {
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

app.post('/api/photos', auth, requireRole('admin'), async (req, res) => {
    const photo = await prisma.photo.create({
        data: req.body
    });
    res.json({ success: true, data: photo });
});

app.delete('/api/photos/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        await prisma.photo.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ success: true, message: "Photo deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* =========================
   🛒 STATIONERY
========================= */

app.get('/api/stationery', async (req, res) => {
    const data = await prisma.stationery.findMany();
    res.json({ success: true, data });
});

app.post('/api/stationery', auth, requireRole('admin'), async (req, res) => {
    const item = await prisma.stationery.create({
        data: req.body
    });
    res.json({ success: true, data: item });
});

app.put('/api/stationery/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const item = await prisma.stationery.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/stationery/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        await prisma.stationery.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ success: true, message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* =========================
   📦 ORDERS
========================= */

app.get('/api/orders', auth, requireRole('admin'), async (req, res) => {
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

app.put('/api/orders/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const order = await prisma.order.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* =========================
   📅 CALENDAR
========================= */

app.get('/api/calendar', async (req, res) => {
    try {
        const events = await prisma.calendarEvent.findMany({
            orderBy: { date: 'asc' }
        });
        res.json({ success: true, data: events });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/calendar', auth, requireRole('admin'), async (req, res) => {
    try {
        const event = await prisma.calendarEvent.create({
            data: {
                ...req.body,
                date: new Date(req.body.date)
            }
        });
        res.json({ success: true, data: event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/calendar/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const event = await prisma.calendarEvent.update({
            where: { id: parseInt(req.params.id) },
            data: {
                ...req.body,
                date: req.body.date ? new Date(req.body.date) : undefined
            }
        });
        res.json({ success: true, data: event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/calendar/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        await prisma.calendarEvent.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ success: true, message: "Event deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* =========================
   📊 ANALYTICS
========================= */

app.get('/api/analytics', auth, requireRole('admin'), async (req, res) => {
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
   📢 NOTICES
========================= */

// Public: get all active notices
app.get('/api/notices', async (req, res) => {
    try {
        const notices = await prisma.notice.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: notices });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: get ALL notices (including inactive)
app.get('/api/notices/all', auth, requireRole('admin'), async (req, res) => {
    try {
        const notices = await prisma.notice.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: notices });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: create a notice
app.post('/api/notices', auth, requireRole('admin'), async (req, res) => {
    try {
        const notice = await prisma.notice.create({ data: req.body });
        res.json({ success: true, data: notice });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: toggle active / update
app.put('/api/notices/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const updated = await prisma.notice.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: delete a notice
app.delete('/api/notices/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        await prisma.notice.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* =========================
   📄 PAGES (CMS)
========================= */

app.get('/api/pages', async (req, res) => {
    try {
        const pages = await prisma.page.findMany({
            orderBy: { lastModified: 'desc' }
        });
        res.json({ success: true, data: pages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/pages/:id', async (req, res) => {
    try {
        const page = await prisma.page.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!page) return res.status(404).json({ success: false, message: "Page not found" });
        res.json({ success: true, data: page });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/pages', auth, requireRole('admin'), async (req, res) => {
    try {
        const page = await prisma.page.create({
            data: req.body
        });
        res.json({ success: true, data: page });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/pages/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const page = await prisma.page.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        res.json({ success: true, data: page });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/pages/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        await prisma.page.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ success: true, message: "Page deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/pages/slug/:slug', async (req, res) => {
    try {
        const page = await prisma.page.findUnique({
            where: { slug: req.params.slug }
        });
        if (!page) return res.status(404).json({ success: false, message: "Page not found" });
        res.json({ success: true, data: page });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* =========================
   📢 POPUP SETTINGS
========================= */

app.get('/api/settings/popup', async (req, res) => {
    try {
        let popup = await prisma.popupSetting.findUnique({
            where: { id: 1 }
        });
        
        if (!popup) {
            // Create default if it doesn't exist
            popup = await prisma.popupSetting.create({
                data: {
                    id: 1,
                    isActive: true,
                    title: "Admissions Open",
                    subtitle: "For Session 2026-2027",
                    buttonText: "Apply Now",
                    buttonLink: "/admission",
                    images: []
                }
            });
        }
        res.json({ success: true, data: popup });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/settings/popup', auth, requireRole('admin'), async (req, res) => {
    try {
        const { isActive, title, subtitle, buttonText, buttonLink, images } = req.body;
        
        const popup = await prisma.popupSetting.upsert({
            where: { id: 1 },
            update: { isActive, title, subtitle, buttonText, buttonLink, images },
            create: {
                id: 1,
                isActive,
                title,
                subtitle,
                buttonText,
                buttonLink,
                images
            }
        });
        
        res.json({ success: true, data: popup });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* =========================
   📋 ATTENDANCE
========================= */

// GET (filter by studentId or date)
app.get('/api/attendance', auth, requireRole('admin', 'teacher'), async (req, res) => {
    try {
        const { studentId, date } = req.query;
        const where = {};
        if (studentId) where.studentId = parseInt(studentId);
        if (date) where.date = { gte: new Date(date), lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) };
        const records = await prisma.attendance.findMany({
            where,
            include: { student: { include: { user: true } } },
            orderBy: { date: 'desc' }
        });
        res.json({ success: true, data: records });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE single attendance record
app.post('/api/attendance', auth, requireRole('admin', 'teacher'), async (req, res) => {
    try {
        const { studentId, date, status, period } = req.body;
        if (!studentId || !date || !status) {
            return res.status(400).json({ success: false, message: "studentId, date, and status are required." });
        }
        const record = await prisma.attendance.create({
            data: { studentId: parseInt(studentId), date: new Date(date), status, period: period ? parseInt(period) : null }
        });
        res.json({ success: true, data: record });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// BULK attendance for a whole class on one date
app.post('/api/attendance/bulk', auth, requireRole('admin', 'teacher'), async (req, res) => {
    try {
        const { records } = req.body; // [{ studentId, date, status, period }, ...]
        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ success: false, message: "records array is required." });
        }
        const created = await prisma.attendance.createMany({
            data: records.map(r => ({
                studentId: parseInt(r.studentId),
                date: new Date(r.date),
                status: r.status,
                period: r.period ? parseInt(r.period) : null
            })),
            skipDuplicates: true
        });
        res.json({ success: true, message: `${created.count} records created.`, count: created.count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE attendance
app.put('/api/attendance/:id', auth, requireRole('admin', 'teacher'), async (req, res) => {
    try {
        const { status, period } = req.body;
        const record = await prisma.attendance.update({
            where: { id: parseInt(req.params.id) },
            data: { status, period: period ? parseInt(period) : undefined }
        });
        res.json({ success: true, data: record });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE attendance
app.delete('/api/attendance/:id', auth, requireRole('admin', 'teacher'), async (req, res) => {
    try {
        await prisma.attendance.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true, message: "Attendance record deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* =========================
   📊 RESULTS
========================= */

// GET student's OWN results (student role)
app.get('/api/results/my', auth, async (req, res) => {
    try {
        const studentProfile = await prisma.student.findFirst({
            where: { userId: req.user.id }
        });
        if (!studentProfile) return res.status(404).json({ error: "Student profile not found" });
        const results = await prisma.result.findMany({
            where: { studentId: studentProfile.id },
            orderBy: [{ term: 'asc' }, { subject: 'asc' }]
        });
        res.json({ success: true, data: results, student: studentProfile });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET (filter by studentId or term) — Admin/Teacher
app.get('/api/results', auth, requireRole('admin', 'teacher'), async (req, res) => {
    try {
        const { studentId, term } = req.query;
        const where = {};
        if (studentId) where.studentId = parseInt(studentId);
        if (term) where.term = term;
        const results = await prisma.result.findMany({
            where,
            include: { student: { include: { user: true } } },
            orderBy: { id: 'desc' }
        });
        res.json({ success: true, data: results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE result
app.post('/api/results', auth, requireRole('admin', 'teacher'), async (req, res) => {
    try {
        const { studentId, subject, marks, total, term } = req.body;
        if (!studentId || !subject || marks === undefined || !total || !term) {
            return res.status(400).json({ success: false, message: "studentId, subject, marks, total, and term are required." });
        }
        const result = await prisma.result.create({
            data: { studentId: parseInt(studentId), subject, marks: parseInt(marks), total: parseInt(total), term }
        });
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE result
app.put('/api/results/:id', auth, requireRole('admin', 'teacher'), async (req, res) => {
    try {
        const { subject, marks, total, term } = req.body;
        const result = await prisma.result.update({
            where: { id: parseInt(req.params.id) },
            data: {
                subject,
                marks: marks !== undefined ? parseInt(marks) : undefined,
                total: total !== undefined ? parseInt(total) : undefined,
                term
            }
        });
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE result
app.delete('/api/results/:id', auth, requireRole('admin', 'teacher'), async (req, res) => {
    try {
        await prisma.result.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true, message: "Result deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});






/* =========================
   🎓 ADMISSION SETTINGS
========================= */

// Default seats config
const DEFAULT_SEATS = {
    "Nursery": 40, "LKG": 40, "UKG": 40,
    "Class I": 40, "Class II": 40, "Class III": 40,
    "Class IV": 40, "Class V": 40, "Class VI": 35,
    "Class VII": 35, "Class VIII": 35, "Class IX": 30,
    "Class X": 30, "Class XI": 25, "Class XII": 25
};

// Helper: get or create the singleton row
async function getOrCreateAdmissionSetting() {
    let setting = await prisma.admissionSetting.findUnique({ where: { id: 1 } });
    if (!setting) {
        setting = await prisma.admissionSetting.create({
            data: { id: 1, isOpen: true, seats: DEFAULT_SEATS, bannerText: "Admissions Open for Session 2026–27", lastDateText: "Last Date: 31 May 2026" }
        });
    }
    return setting;
}

// GET admission settings (public)
app.get('/api/admissions/settings', async (req, res) => {
    try {
        const setting = await getOrCreateAdmissionSetting();
        res.json({ success: true, data: setting });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT admission settings (admin)
app.put('/api/admissions/settings', auth, requireRole('admin'), async (req, res) => {
    try {
        const { isOpen, bannerText, lastDateText, seats } = req.body;
        const setting = await prisma.admissionSetting.upsert({
            where: { id: 1 },
            update: { isOpen, bannerText, lastDateText, seats },
            create: { id: 1, isOpen, bannerText, lastDateText, seats: seats || DEFAULT_SEATS }
        });
        res.json({ success: true, data: setting });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH just the toggle (quick action)
app.patch('/api/admissions/settings/toggle', auth, requireRole('admin'), async (req, res) => {
    try {
        const current = await getOrCreateAdmissionSetting();
        const setting = await prisma.admissionSetting.update({
            where: { id: 1 },
            data: { isOpen: !current.isOpen }
        });
        res.json({ success: true, data: setting, message: `Admissions ${setting.isOpen ? 'OPENED' : 'CLOSED'}` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* =========================
   📝 SITE CONTENT EDITOR
========================= */

// Seed default content keys on first use
const DEFAULT_CONTENT = [
    { key: 'hero_title', label: 'Hero Title', value: 'SKP SAINIK PUBLIC SCHOOL', section: 'homepage' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', value: 'Nurturing Excellence, Building Character', section: 'homepage' },
    { key: 'hero_cta', label: 'Hero Button Text', value: 'Apply for Admission', section: 'homepage' },
    { key: 'about_tagline', label: 'About Tagline', value: 'Where Discipline Meets Excellence', section: 'homepage' },
    { key: 'principal_name', label: "Principal's Name", value: 'Dr. Rajendra Prasad Maurya', section: 'about' },
    { key: 'principal_message', label: "Principal's Short Message", value: 'Our mission is to build future leaders who are disciplined, compassionate, and academically excellent.', section: 'about' },
    { key: 'admission_last_date', label: 'Admission Last Date', value: '31 May 2026', section: 'homepage' },
    { key: 'phone_primary', label: 'Primary Phone', value: '9454331861', section: 'contact' },
    { key: 'phone_secondary', label: 'Secondary Phone', value: '8449790561', section: 'contact' },
    { key: 'email', label: 'School Email', value: 'skpspsmanihari09@gmail.com', section: 'contact' },
    { key: 'address', label: 'School Address', value: 'Village Manihari, Deoria, Uttar Pradesh – 274001', section: 'contact' },
    { key: 'footer_tagline', label: 'Footer Tagline', value: 'Dedicated to academic excellence and character building since 2009.', section: 'homepage' },
];

// GET all site content (public)
app.get('/api/site-content', async (req, res) => {
    try {
        let content = await prisma.siteContent.findMany({ orderBy: { section: 'asc' } });
        // Seed defaults if empty
        if (content.length === 0) {
            await prisma.siteContent.createMany({ data: DEFAULT_CONTENT, skipDuplicates: true });
            content = await prisma.siteContent.findMany({ orderBy: { section: 'asc' } });
        }
        // Return as object map for easy frontend use
        const map = {};
        content.forEach(c => { map[c.key] = c.value; });
        res.json({ success: true, data: content, map });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET by section (public)
app.get('/api/site-content/:section', async (req, res) => {
    try {
        const content = await prisma.siteContent.findMany({ where: { section: req.params.section } });
        const map = {};
        content.forEach(c => { map[c.key] = c.value; });
        res.json({ success: true, data: content, map });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update content key (admin)
app.put('/api/site-content/:key', auth, requireRole('admin'), async (req, res) => {
    try {
        const { value } = req.body;
        const content = await prisma.siteContent.upsert({
            where: { key: req.params.key },
            update: { value },
            create: { key: req.params.key, value, label: req.params.key, section: req.body.section || 'homepage' }
        });
        res.json({ success: true, data: content });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH bulk update multiple keys at once (admin)
app.patch('/api/site-content', auth, requireRole('admin'), async (req, res) => {
    try {
        const updates = req.body; // { key: value, key2: value2 }
        const results = await Promise.all(
            Object.entries(updates).map(([key, value]) =>
                prisma.siteContent.upsert({
                    where: { key },
                    update: { value: String(value) },
                    create: { key, value: String(value), label: key, section: 'homepage' }
                })
            )
        );
        res.json({ success: true, updated: results.length });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* =========================
   🖼️  GALLERY CATEGORIES
========================= */

const DEFAULT_CATEGORIES = [
    { name: 'All', slug: 'all', order: 0 },
    { name: 'Events', slug: 'events', order: 1 },
    { name: 'Sports', slug: 'sports', order: 2 },
    { name: 'Academic', slug: 'academic', order: 3 },
    { name: 'Cultural', slug: 'cultural', order: 4 },
    { name: 'Infrastructure', slug: 'infrastructure', order: 5 },
];

// GET all categories (public)
app.get('/api/gallery/categories', async (req, res) => {
    try {
        let cats = await prisma.photoCategory.findMany({ orderBy: { order: 'asc' } });
        if (cats.length === 0) {
            await prisma.photoCategory.createMany({ data: DEFAULT_CATEGORIES, skipDuplicates: true });
            cats = await prisma.photoCategory.findMany({ orderBy: { order: 'asc' } });
        }
        res.json({ success: true, data: cats });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST add category (admin)
app.post('/api/gallery/categories', auth, requireRole('admin'), async (req, res) => {
    try {
        const { name, order } = req.body;
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const maxOrder = await prisma.photoCategory.aggregate({ _max: { order: true } });
        const cat = await prisma.photoCategory.create({
            data: { name, slug, order: order ?? (maxOrder._max.order ?? 0) + 1 }
        });
        res.status(201).json({ success: true, data: cat });
    } catch (err) {
        if (err.code === 'P2002') return res.status(400).json({ error: 'Category already exists' });
        res.status(500).json({ error: err.message });
    }
});

// PUT rename/reorder category (admin)
app.put('/api/gallery/categories/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const { name, order } = req.body;
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const cat = await prisma.photoCategory.update({
            where: { id: parseInt(req.params.id) },
            data: { name, slug, order }
        });
        res.json({ success: true, data: cat });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE category (admin) — photos become uncategorized
app.delete('/api/gallery/categories/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const cat = await prisma.photoCategory.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!cat) return res.status(404).json({ error: 'Category not found' });
        if (cat.slug === 'all') return res.status(400).json({ error: 'Cannot delete the All category' });
        // Move photos in this category to "Uncategorized"
        await prisma.photo.updateMany({ where: { category: cat.name }, data: { category: 'Uncategorized' } });
        await prisma.photoCategory.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true, message: `Category "${cat.name}" deleted. Photos moved to Uncategorized.` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* =========================
   🏥 HEALTH CHECK
========================= */
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
    } catch (err) {
        res.status(503).json({ status: 'degraded', db: 'unreachable', error: err.message });
    }
});


/* =========================
   🚨 GLOBAL ERROR HANDLER
========================= */
// Catches any unhandled errors thrown in route handlers
app.use((err, req, res, next) => {
    const isDbError = err.message && (
        err.message.includes("Can't reach database") ||
        err.message.includes("connect ECONNREFUSED") ||
        err.message.includes("ENOTFOUND") ||
        err.message.includes("P1001") ||
        err.message.includes("P1002")
    );

    if (isDbError) {
        console.error('🔴 DB unreachable:', err.message);
        return res.status(503).json({
            error: 'Database is currently waking up. Please try again in 30 seconds.',
            code: 'DB_UNAVAILABLE'
        });
    }

    console.error('🔴 Unhandled error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

/* =========================
   🚀 START SERVER
========================= */

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
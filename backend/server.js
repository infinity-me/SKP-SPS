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

app.post('/api/students', auth, async (req, res) => {
    try {
        const { firstName, lastName, admissionNo, class: className, section, parentName, phone } = req.body;
        
        const hashedPassword = await bcrypt.hash("student123", 10);
        
        // Handle empty string for phone to avoid unique constraint violations
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

app.put('/api/students/:id', auth, async (req, res) => {
    try {
        const { admissionNo, class: className, section, parentName, phone, firstName, lastName } = req.body;
        
        const studentId = parseInt(req.params.id);
        const finalPhone = phone && phone.trim() !== "" ? phone.trim() : null;
        
        // Update the student fields
        const student = await prisma.student.update({
            where: { id: studentId },
            data: {
                admissionNo,
                class: className,
                section,
                parentName
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

app.put('/api/teacher-application/:id', auth, async (req, res) => {
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
app.post('/api/fees', auth, async (req, res) => {
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
app.put('/api/fees/:id', auth, async (req, res) => {
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

// DELETE FEE
app.delete('/api/fees/:id', auth, async (req, res) => {
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

app.post('/api/fee-structure', auth, async (req, res) => {
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

app.put('/api/fee-structure/:id', auth, async (req, res) => {
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

app.delete('/api/fee-structure/:id', auth, async (req, res) => {
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
app.post('/api/fees/generate', auth, async (req, res) => {
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

app.delete('/api/fees/:id', auth, async (req, res) => {
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

app.delete('/api/photos/:id', auth, async (req, res) => {
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

app.post('/api/stationery', auth, async (req, res) => {
    const item = await prisma.stationery.create({
        data: req.body
    });
    res.json({ success: true, data: item });
});

app.put('/api/stationery/:id', auth, async (req, res) => {
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

app.delete('/api/stationery/:id', auth, async (req, res) => {
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

app.put('/api/orders/:id', auth, async (req, res) => {
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

app.post('/api/calendar', auth, async (req, res) => {
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

app.put('/api/calendar/:id', auth, async (req, res) => {
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

app.delete('/api/calendar/:id', auth, async (req, res) => {
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
app.get('/api/notices/all', auth, async (req, res) => {
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
app.post('/api/notices', auth, async (req, res) => {
    try {
        const notice = await prisma.notice.create({ data: req.body });
        res.json({ success: true, data: notice });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: toggle active / update
app.put('/api/notices/:id', auth, async (req, res) => {
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
app.delete('/api/notices/:id', auth, async (req, res) => {
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

app.post('/api/pages', auth, async (req, res) => {
    try {
        const page = await prisma.page.create({
            data: req.body
        });
        res.json({ success: true, data: page });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/pages/:id', auth, async (req, res) => {
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

app.delete('/api/pages/:id', auth, async (req, res) => {
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
   🚀 START SERVER
========================= */

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
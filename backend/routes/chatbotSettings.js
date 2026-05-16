const express = require('express');
const router = express.Router();
const prisma = require('../db');
const jwt = require('jsonwebtoken');
const { requireRole } = require('../middleware/roleAuth');

// Inline auth middleware
const auth = (req, res, next) => {
    let token = req.header('Authorization') || req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'No token provided' });
    if (token.startsWith('Bearer ')) token = token.split(' ')[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Default settings (used when no row exists yet)
const DEFAULTS = {
    id: 1,
    schoolFullName: 'SKP Sainik Public School, Manihari, Kannauj, UP',
    founded: '2009 by Shri Satyadev Kushwaha',
    affiliation: 'CBSE',
    principal: 'Mrs. Shobha Sharma',
    phone: '+91 9454331861',
    email: 'skpspsmanihari09@gmail.com',
    admissionInfo: 'Admissions open for 2026-27: Classes Nursery to XII',
    admissionPage: 'skpsps.in/admission',
    customSystemNote: '',
    botPersonality: 'Friendly, professional, and disciplined — like a helpful school counsellor.',
};

// GET chatbot settings (public — used by chat.js too)
router.get('/', async (req, res) => {
    try {
        let settings = await prisma.chatbotSetting.findUnique({ where: { id: 1 } });
        if (!settings) {
            // Return defaults without writing to DB yet
            settings = DEFAULTS;
        }
        res.json({ success: true, data: settings });
    } catch (err) {
        console.error('[ChatbotSettings] GET error:', err.message);
        res.json({ success: true, data: DEFAULTS });
    }
});

// PUT chatbot settings (admin only)
router.put('/', auth, requireRole('admin'), async (req, res) => {
    try {
        const {
            schoolFullName, founded, affiliation, principal,
            phone, email, admissionInfo, admissionPage,
            customSystemNote, botPersonality
        } = req.body;

        const settings = await prisma.chatbotSetting.upsert({
            where: { id: 1 },
            update: {
                schoolFullName, founded, affiliation, principal,
                phone, email, admissionInfo, admissionPage,
                customSystemNote, botPersonality
            },
            create: {
                id: 1,
                schoolFullName: schoolFullName || DEFAULTS.schoolFullName,
                founded: founded || DEFAULTS.founded,
                affiliation: affiliation || DEFAULTS.affiliation,
                principal: principal || DEFAULTS.principal,
                phone: phone || DEFAULTS.phone,
                email: email || DEFAULTS.email,
                admissionInfo: admissionInfo || DEFAULTS.admissionInfo,
                admissionPage: admissionPage || DEFAULTS.admissionPage,
                customSystemNote: customSystemNote || '',
                botPersonality: botPersonality || DEFAULTS.botPersonality,
            }
        });
        res.json({ success: true, data: settings });
    } catch (err) {
        console.error('[ChatbotSettings] PUT error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

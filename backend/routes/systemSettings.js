const express = require('express');
const router = express.Router();
const prisma = require('../db');
const jwt = require('jsonwebtoken');
const { requireRole } = require('../middleware/roleAuth');

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

const DEFAULTS = {
    id: 1,
    schoolName: 'SKP Sainik Public School',
    registrationNo: 'REGN-2026-UP-001',
    primaryEmail: 'skpspsmanihari09@gmail.com',
    phone: '9454331861, 8449790561',
    address: 'Manihari, Kannauj, Uttar Pradesh',
    website: 'https://skpsps.in',
    principalName: 'Mrs. Shobha Sharma',
    established: '2009',
    affiliation: 'CBSE',
    notifyAdmission: true,
    notifyFeePayment: true,
    notifyNewTeacher: false,
    notifySystemAlerts: true,
    emailDigestFreq: 'Daily',
    twoFactorAuth: false,
    ipWhitelisting: false,
    sessionTimeout: 60,
    allowedIPs: '',
    primaryColor: '#0a2342',
    accentColor: '#d4af37',
    logoUrl: '',
    faviconUrl: '',
    schoolTagline: "Shaping Tomorrow's Leaders Today",
};

// GET — public (used by frontend homepage etc.)
router.get('/', async (req, res) => {
    try {
        let s = await prisma.systemSetting.findUnique({ where: { id: 1 } });
        res.json({ success: true, data: s || DEFAULTS });
    } catch (err) {
        console.error('[SystemSettings] GET:', err.message);
        res.json({ success: true, data: DEFAULTS });
    }
});

// PUT — admin only
router.put('/', auth, requireRole('admin'), async (req, res) => {
    try {
        const {
            schoolName, registrationNo, primaryEmail, phone, address,
            website, principalName, established, affiliation,
            notifyAdmission, notifyFeePayment, notifyNewTeacher, notifySystemAlerts, emailDigestFreq,
            twoFactorAuth, ipWhitelisting, sessionTimeout, allowedIPs,
            primaryColor, accentColor, logoUrl, faviconUrl, schoolTagline,
        } = req.body;

        const data = {
            schoolName, registrationNo, primaryEmail, phone, address,
            website, principalName, established, affiliation,
            notifyAdmission: Boolean(notifyAdmission),
            notifyFeePayment: Boolean(notifyFeePayment),
            notifyNewTeacher: Boolean(notifyNewTeacher),
            notifySystemAlerts: Boolean(notifySystemAlerts),
            emailDigestFreq,
            twoFactorAuth: Boolean(twoFactorAuth),
            ipWhitelisting: Boolean(ipWhitelisting),
            sessionTimeout: parseInt(sessionTimeout) || 60,
            allowedIPs: allowedIPs || '',
            primaryColor, accentColor, logoUrl, faviconUrl, schoolTagline,
        };

        const settings = await prisma.systemSetting.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data },
        });

        res.json({ success: true, data: settings });
    } catch (err) {
        console.error('[SystemSettings] PUT:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

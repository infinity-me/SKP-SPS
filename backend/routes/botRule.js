const express = require('express');
const router = express.Router();
const prisma = require('../db');
const jwt = require('jsonwebtoken');
const { requireRole } = require('../middleware/roleAuth');

// Inline auth middleware (same logic as server.js auth)
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

// GET all rules
router.get('/', async (req, res) => {
    try {
        const rules = await prisma.botRule.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: rules });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE rule (admin only)
router.post('/', auth, requireRole('admin'), async (req, res) => {
    try {
        const { trigger, response, category, language } = req.body;
        const rule = await prisma.botRule.create({
            data: { trigger, response, category, language }
        });
        res.json({ success: true, data: rule });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE rule (admin only)
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { trigger, response, category, language, isActive } = req.body;
        const rule = await prisma.botRule.update({
            where: { id: parseInt(id) },
            data: { trigger, response, category, language, isActive }
        });
        res.json({ success: true, data: rule });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE rule (admin only)
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        await prisma.botRule.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ success: true, message: "Rule deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

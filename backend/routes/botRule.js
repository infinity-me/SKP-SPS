const express = require('express');
const router = express.Router();
const prisma = require('../db');

// Middleware for auth will be handled in server.js but we can add it here if needed
// For now, let's assume it's protected

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

// CREATE rule
router.post('/', async (req, res) => {
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

// UPDATE rule
router.put('/:id', async (req, res) => {
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

// DELETE rule
router.delete('/:id', async (req, res) => {
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

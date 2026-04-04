const express = require('express');
const prisma = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();


// 🔹 Create Student
router.post('/', auth, async (req, res) => {
    try {
        const student = await prisma.student.create({
            data: req.body
        });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 🔹 Get All Students
router.get('/', auth, async (req, res) => {
    const students = await prisma.student.findMany();
    res.json(students);
});

module.exports = router;
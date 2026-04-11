require('dotenv').config();
const prisma = require('../db');
async function checkData() {
  const teachers = await prisma.teacher.findMany({ include: { user: true } });
  console.log('Teachers:', JSON.stringify(teachers, null, 2));

  const students = await prisma.student.findMany({ include: { user: true } });
  console.log('Students:', JSON.stringify(students.filter(s => s.achievements), null, 2));

  const circulars = await prisma.circular.findMany();
  console.log('Circulars:', JSON.stringify(circulars, null, 2));
}
checkData().catch(console.error).finally(() => prisma.$disconnect());

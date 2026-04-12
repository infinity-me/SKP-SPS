const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialRules = [
    {
        trigger: "uniform, clothes, dress",
        response: "SKP SPS Uniform: Boys - White shirt, Khaki trousers/shorts. Girls - Khaki skirt/trousers and white shirt. Blazer/Sweater in winter. Clean uniform is mandatory daily.",
        category: "Administrative"
    },
    {
        trigger: "timing, school time, opening, closing",
        response: "School Hours: Summer (7:30 AM to 1:30 PM), Winter (8:30 AM to 2:30 PM). Please ensure students arrive 10 minutes before the bell.",
        category: "Administrative"
    },
    {
        trigger: "hostel, staying, residential",
        response: "We offer premium hostel facilities for boys and girls with 24/7 security, balanced meals, and supervised study hours. Contact the Warden at +91 8449790561.",
        category: "Administrative"
    },
    {
        trigger: "ncc, training, military",
        response: "SKP SPS is proud to offer NCC training. We focus on physical fitness, leadership, and discipline to prepare students for defense services.",
        category: "Academic"
    },
    {
        trigger: "vacation, summer break, winter break",
        response: "Vacation dates are announced via circulars in the Student Portal. Generally, Summer Break is in June and Winter Break is in late December.",
        category: "General"
    }
];

async function seed() {
    console.log("Seeding Bot Rules...");
    for (const rule of initialRules) {
        await prisma.botRule.create({
            data: { ...rule, language: "English" }
        });
    }
    console.log("Seeding complete!");
}

seed().catch(e => console.error(e)).finally(() => prisma.$disconnect());

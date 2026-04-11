const prisma = require('../db');

/**
 * Aggregates public and personal context for the AI Chatbot
 */
async function getChatContext(userId = null) {
    let context = "";

    // 1. PUBLIC CONTEXT (Always included)
    try {
        const notices = await prisma.notice.findMany({ where: { isActive: true }, take: 5, orderBy: { createdAt: 'desc' } });
        const events = await prisma.calendarEvent.findMany({ take: 5, orderBy: { date: 'asc' }, where: { date: { gte: new Date() } } });
        const feeStructure = await prisma.feeStructure.findMany();

        context += "\n--- PUBLIC SCHOOL UPDATES ---\n";
        context += "Active Notices: " + notices.map(n => n.message).join(" | ") + "\n";
        context += "Upcoming Events: " + events.map(e => `${e.title} on ${e.date.toDateString()}`).join(" | ") + "\n";
        context += "Fee Structure: " + feeStructure.map(f => `${f.className}: ${f.feeType} = ₹${f.amount}`).join(" | ") + "\n";
    } catch (err) {
        console.error("Error fetching public context:", err);
    }

    // 2. PERSONAL CONTEXT (If authenticated)
    if (userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    studentProfile: {
                        include: {
                            fees: { where: { status: 'pending' } },
                            attendance: { take: 10, orderBy: { date: 'desc' } },
                            results: true
                        }
                    },
                    teacherProfile: true
                }
            });

            if (user && user.studentProfile) {
                const s = user.studentProfile;
                context += "\n--- PERSONAL STUDENT DATA ---\n";
                context += `Name: ${user.name}, Class: ${s.class}-${s.section}, Admission No: ${s.admissionNo}\n`;
                context += `Pending Fees: ${s.fees.length > 0 ? s.fees.map(f => `${f.type}: ₹${f.amount}`).join(", ") : "None"}\n`;
                context += `Recent Attendance: ${s.attendance.map(a => `${a.date.toDateString()}: ${a.status}`).join(", ")}\n`;
                context += `Latest Results: ${s.results.map(r => `${r.subject}: ${r.marks}/${r.total} (${r.term})`).join(", ")}\n`;
            } else if (user && user.teacherProfile) {
                context += "\n--- PERSONAL TEACHER DATA ---\n";
                context += `Staff ID: ${user.teacherProfile.staffId}, Designation: ${user.teacherProfile.designation}\n`;
            }
        } catch (err) {
            console.error("Error fetching personal context:", err);
        }
    }

    return context;
}

module.exports = { getChatContext };

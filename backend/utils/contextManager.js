const prisma = require('../db');

/**
 * Builds a clean, structured context string for the AI chatbot.
 * Includes live school data (notices, events, fee structure) and
 * personal student/teacher data when the user is authenticated.
 */
async function getChatContext(userId = null) {
    const lines = [];

    // ── 1. PUBLIC SCHOOL CONTEXT ─────────────────────────────────────────────
    try {
        const [notices, events, feeStructures] = await Promise.all([
            prisma.notice.findMany({
                where: { isActive: true },
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { message: true, createdAt: true }
            }),
            prisma.calendarEvent.findMany({
                take: 6,
                orderBy: { date: 'asc' },
                where: { date: { gte: new Date() } },
                select: { title: true, date: true, description: true }
            }),
            prisma.feeStructure.findMany({
                select: { className: true, feeType: true, amount: true }
            })
        ]);

        // Notices
        if (notices.length > 0) {
            lines.push("=== LATEST SCHOOL NOTICES ===");
            notices.forEach(n => {
                lines.push(`- ${n.message}`);
            });
        } else {
            lines.push("=== LATEST SCHOOL NOTICES ===\n- No active notices at this time.");
        }

        // Events
        if (events.length > 0) {
            lines.push("\n=== UPCOMING EVENTS & HOLIDAYS ===");
            events.forEach(e => {
                const dateStr = new Date(e.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
                lines.push(`- ${e.title} on ${dateStr}${e.description ? ` (${e.description})` : ''}`);
            });
        } else {
            lines.push("\n=== UPCOMING EVENTS & HOLIDAYS ===\n- No upcoming events scheduled.");
        }

        // Fee Structure
        if (feeStructures.length > 0) {
            lines.push("\n=== FEE STRUCTURE ===");
            // Group by className
            const grouped = {};
            feeStructures.forEach(f => {
                if (!grouped[f.className]) grouped[f.className] = [];
                grouped[f.className].push(`${f.feeType}: ₹${f.amount}`);
            });
            Object.entries(grouped).forEach(([cls, fees]) => {
                lines.push(`Class ${cls}: ${fees.join(' | ')}`);
            });
        } else {
            lines.push("\n=== FEE STRUCTURE ===\n- Please contact the school office for current fee details.");
        }

    } catch (err) {
        console.error("[ContextManager] Error fetching public context:", err.message);
        lines.push("Note: Live school data is temporarily unavailable.");
    }

    // ── 2. PERSONAL CONTEXT (authenticated users only) ────────────────────────
    if (userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    studentProfile: {
                        include: {
                            fees: {
                                where: { status: 'pending' },
                                select: { type: true, amount: true, dueDate: true }
                            },
                            attendance: {
                                take: 10,
                                orderBy: { date: 'desc' },
                                select: { date: true, status: true }
                            },
                            results: {
                                select: { subject: true, marks: true, total: true, term: true }
                            }
                        }
                    },
                    teacherProfile: {
                        select: { staffId: true, designation: true, subject: true }
                    }
                }
            });

            if (user?.studentProfile) {
                const s = user.studentProfile;
                lines.push("\n=== YOUR PERSONAL DATA ===");
                lines.push(`Name: ${user.name}`);
                lines.push(`Class: ${s.class}-${s.section} | Admission No: ${s.admissionNo}`);

                if (s.fees.length > 0) {
                    lines.push(`Pending Fees: ${s.fees.map(f => `${f.type} ₹${f.amount}${f.dueDate ? ` (due ${new Date(f.dueDate).toLocaleDateString('en-IN')})` : ''}`).join(', ')}`);
                } else {
                    lines.push("Pending Fees: None (all clear!)");
                }

                if (s.attendance.length > 0) {
                    const presentCount = s.attendance.filter(a => a.status === 'present').length;
                    lines.push(`Recent Attendance (last ${s.attendance.length} days): ${presentCount} present, ${s.attendance.length - presentCount} absent`);
                }

                if (s.results.length > 0) {
                    lines.push("Latest Results:");
                    s.results.slice(0, 5).forEach(r => {
                        lines.push(`  ${r.subject}: ${r.marks}/${r.total} (${r.term})`);
                    });
                }

            } else if (user?.teacherProfile) {
                const t = user.teacherProfile;
                lines.push("\n=== YOUR STAFF DATA ===");
                lines.push(`Staff ID: ${t.staffId} | Designation: ${t.designation}`);
                if (t.subject) lines.push(`Subject: ${t.subject}`);
            }

        } catch (err) {
            console.error("[ContextManager] Error fetching personal context:", err.message);
        }
    }

    return lines.join('\n');
}

module.exports = { getChatContext };

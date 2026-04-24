const express = require('express');
const router = express.Router();
const prisma = require('../db');
const axios = require('axios');
const { detectIntent, INTENTS, AI_PREFERRED_INTENTS } = require('../utils/intentMatcher');
const { getChatContext } = require('../utils/contextManager');
const jwt = require('jsonwebtoken');

// ─── Auth Helper ───────────────────────────────────────────────────────────────
const getUserIdFromToken = (req) => {
    let token = req.header('Authorization') || req.headers.authorization;
    if (!token) return null;
    if (token.startsWith('Bearer ')) token = token.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    } catch (err) {
        return null;
    }
};

// ─── Groq AI Client ───────────────────────────────────────────────────────────
async function getGroqResponse(message, context, history = [], focusHint = null) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key missing in environment.");

    const systemPrompt = `You are the official AI assistant for SKP Sainik Public School, Manihari (UP), India.

PERSONALITY:
- Friendly, professional, and disciplined — like a helpful school counsellor.
- You always respond in the same language the user writes in (English / Hindi / Hinglish).
- You are concise: give direct, to-the-point answers. Avoid filler sentences.

STRICT RULES:
1. Answer ONLY what is asked. Do not pad with unsolicited information.
2. Never use markdown syntax (no **, no ##, no bullet dashes with hyphens preceded by newline). Use plain readable text with newlines where needed.
3. If the user asks something not related to the school or education, politely decline and redirect.
4. If specific data is not in the SCHOOL CONTEXT, say "Please contact the school office for this detail." — do NOT make up data.
5. Do not repeat the greeting if one already exists in the conversation history.
6. Keep responses under 120 words unless a detailed explanation is genuinely required.
${focusHint ? `\nFOCUS: The user is specifically asking about: ${focusHint}. Prioritise this topic in your answer.` : ''}

SCHOOL CONTEXT (Live data from database):
${context || 'No specific school data available right now.'}

SCHOOL QUICK FACTS (always accurate):
- Full Name: SKP Sainik Public School, Manihari, Kannauj, UP
- Founded: 2009 by Shri Satyadev Kushwaha
- Affiliation: CBSE
- Principal: Mrs. Shobha Sharma
- Phone: +91 9454331861
- Email: skpspsmanihari09@gmail.com
- Admissions open for 2026-27: Classes Nursery to XII
- Admission page: skpsps.in/admission
`;

    const messages = [
        { role: "system", content: systemPrompt },
        // Include last 6 messages of history for context
        ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: message }
    ];

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: "llama-3.1-8b-instant",
                messages,
                temperature: 0.5,   // Lower = more factual, less creative rambling
                max_tokens: 512,    // Enough for a detailed answer, prevents walls of text
                top_p: 0.9
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000  // 15s timeout
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (err) {
        console.error("Groq API Error:", err.response?.data || err.message);
        throw err;
    }
}

// ─── Fast-Track Reply Helpers (used to AUGMENT AI calls, not replace them) ────
function buildFocusHint(intent) {
    const hints = {
        [INTENTS.FEES]: "school fee structure and payment details",
        [INTENTS.NOTICES]: "latest school notices and announcements",
        [INTENTS.EVENTS]: "upcoming school events and holidays",
        [INTENTS.RESULTS]: "student exam results and marks",
        [INTENTS.ADMISSION]: "admissions process and requirements",
        [INTENTS.CONTACT]: "school contact information and address",
        [INTENTS.ABOUT]: "school history and information"
    };
    return hints[intent] || null;
}

// ─── Main Chat Route ──────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, message: "Please type a message." });
        }

        const userId = getUserIdFromToken(req);
        console.log(`[CHAT] User: ${userId || 'guest'} | Message: "${message}"`);

        // ── Step 1: Check Manual Bot Rules (Admin overrides always win) ───────
        try {
            const customRules = await prisma.botRule.findMany({ where: { isActive: true } });
            for (const rule of customRules) {
                const triggers = rule.trigger.split(',').map(t => t.trim().toLowerCase());
                if (triggers.some(t => message.toLowerCase().includes(t))) {
                    console.log(`[CHAT] Matched bot rule: "${rule.trigger}"`);
                    return res.json({ success: true, reply: rule.response });
                }
            }
        } catch (ruleErr) {
            console.warn("[CHAT] Could not fetch bot rules:", ruleErr.message);
        }

        // ── Step 2: Detect Intent ─────────────────────────────────────────────
        const intent = detectIntent(message);
        console.log(`[CHAT] Intent detected: ${intent || 'none → AI'}`);

        // ── Step 3: Fetch live DB context ─────────────────────────────────────
        const context = await getChatContext(userId);

        // ── Step 4: Pure fast-track for non-AI intents (greeting, contact, admission) ──
        if (intent === INTENTS.GREETING) {
            // Only greet if this is the very first message (no prior history)
            if (!history || history.length <= 1) {
                return res.json({ success: true, reply: "Namaste! Welcome to SKP Sainik Public School. I can help you with admissions, fees, notices, events, results, and more. What would you like to know?" });
            }
            // Already greeted — let AI handle naturally
        }

        if (intent === INTENTS.CONTACT && (!history || history.length < 3)) {
            return res.json({
                success: true,
                reply: "You can reach us at:\nPhone: +91 9454331861\nEmail: skpspsmanihari09@gmail.com\nAddress: SKP Sainik Public School, Manihari, Kannauj, Uttar Pradesh."
            });
        }

        if (intent === INTENTS.ADMISSION && (!history || history.length < 3)) {
            return res.json({
                success: true,
                reply: "Admissions are open for 2026-27 (Classes Nursery to XII).\nApply online at: skpsps.in/admission\nOr call us at +91 9454331861."
            });
        }

        // ── Step 5: AI handles everything else (with a focus hint if intent found) ──
        const focusHint = buildFocusHint(intent);
        const reply = await getGroqResponse(message, context, history || [], focusHint);

        console.log(`[CHAT] Reply generated (${reply.length} chars)`);
        return res.json({ success: true, reply });

    } catch (err) {
        console.error("[CHAT] Fatal error:", err.message || err);

        // User-friendly fallback — no raw stack traces
        const fallback = "I'm having a little trouble right now. Please try again in a moment, or contact us directly at +91 9454331861.";
        return res.status(500).json({ success: false, message: fallback });
    }
});

module.exports = router;

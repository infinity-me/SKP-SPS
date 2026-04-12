const express = require('express');
const router = express.Router();
const prisma = require('../db');
const axios = require('axios');
const { detectIntent, INTENTS } = require('../utils/intentMatcher');
const { getChatContext } = require('../utils/contextManager');
const jwt = require('jsonwebtoken');

// Helper to check auth
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

/**
 * Groq AI Client Wrapper - Using 8B Instant for extreme speed and reliability
 */
async function getGroqResponse(message, context, history = []) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key missing");

    const systemPrompt = `
You are the "Smart Brain" of SKP Sainik Public School, Manihari. 
Character: Disciplined, premium, helpful, and highly intelligent.
Capabilities: You can reason, understand context, and answer complex questions.

Instructions:
- Detect the user's language and respond in the same (English, Hindi, or Hinglish).
- Use the provided SCHOOL CONTEXT to answer school-specific questions.
- If data is missing in context, use your general knowledge but mention it's general info.
- Keep responses concise and avoid markdown formatting like bolding (use plain text).
- Do NOT repeat greetings if they already exist in history.

SCHOOL CONTEXT:
${context}
    `;

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: systemPrompt },
                ...history.slice(-5).map(m => ({ role: m.role, content: m.content })),
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 1024
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (err) {
        console.error("Groq API Error:", err.response?.data || err.message);
        throw err;
    }
}

router.post('/', async (req, res) => {
    try {
        const { message, history } = req.body;
        const userId = getUserIdFromToken(req);

        console.log("--- HYBRID CHAT START ---");
        
        // 1. Check for manual BotRules in database first (Custom overrides)
        const customRules = await prisma.botRule.findMany({ where: { isActive: true } });
        for (const rule of customRules) {
            const triggers = rule.trigger.split(',').map(t => t.trim().toLowerCase());
            if (triggers.some(t => message.toLowerCase().includes(t))) {
                console.log("Matched Manual Rule:", rule.trigger);
                return res.json({ success: true, reply: rule.response });
            }
        }

        // 2. Detect Intent for Fast-Track responses
        const intent = detectIntent(message);
        
        // 3. Get Context from DB
        const context = await getChatContext(userId);

        // 4. Logic: Use Rules for simple things, AI for "thinking"
        let reply = "";

        if (intent && intent !== INTENTS.HELP) {
            console.log("Fast-Track Intent:", intent);
            switch (intent) {
                case INTENTS.GREETING:
                    reply = "Namaste! Welcome to SKP Sainik Public School. How can I assist you today?";
                    break;
                
                case INTENTS.FEES:
                    // Improved parsing of context string
                    const feeSearch = context.split("Fee Structure: ")[1]?.split("\n")[0];
                    const personalFeeMatch = context.match(/Pending Fees: (.*)/);
                    reply = "School Fee Info:\n";
                    if (personalFeeMatch) reply += `Your ${personalFeeMatch[0]}\n`;
                    reply += "Regular Structure: " + (feeSearch || "Please contact the school office for current class-wise fee details.");
                    reply += "\n\nYou can pay at the counter or via bank transfer.";
                    break;

                case INTENTS.NOTICES:
                    const noticeMatch = context.match(/Active Notices: (.*)/);
                    reply = "Latest Notices:\n" + (noticeMatch && noticeMatch[1].length > 5 ? noticeMatch[1].replace(/ \| /g, '\n- ') : "No recent notices. Check back soon!");
                    break;

                case INTENTS.EVENTS:
                    const eventMatch = context.match(/Upcoming Events: (.*)/);
                    reply = "Upcoming Events:\n" + (eventMatch && eventMatch[1].length > 5 ? eventMatch[1].replace(/ \| /g, '\n- ') : "Please check the academic calendar.");
                    break;

                case INTENTS.RESULTS:
                    const resMatch = context.match(/Latest Results: (.*)/);
                    if (userId && resMatch) {
                        reply = "Your Results:\n- " + resMatch[1].replace(/, /g, '\n- ');
                    } else {
                        reply = "Results are released on the Student Portal. Please login to view your marks.";
                    }
                    break;

                case INTENTS.ADMISSION:
                    reply = "Admissions are OPEN for 2026-27! Classes Nursery-XII. Visit skpsps.in/admission or call +91 9454331861.";
                    break;

                case INTENTS.CONTACT:
                    reply = "Contact: +91 9454331861 | Email: skpspsmanihari09@gmail.com | Manihari, Kannauj (UP).";
                    break;

                case INTENTS.ABOUT:
                    reply = "SKP Sainik Public School was founded in 2009 by Shri Satyadev Kushwaha. We are a premier CBSE military-style school. Our Principal is Mrs. Shobha Sharma.";
                    break;

                default:
                    // Fallback to AI if intent is detected but not handled
                    reply = await getGroqResponse(message, context, history);
            }
        } else {
            console.log("Switching to AI for thinking...");
            try {
                reply = await getGroqResponse(message, context, history);
            } catch (aiErr) {
                reply = "I'm having trouble thinking. Try asking about fees, notices, or admissions.";
            }
        }

        res.json({ success: true, reply });

    } catch (err) {
        console.error("CHAT ERROR:", err);
        res.status(500).json({ success: false, message: "System busy. Please try later." });
    }
});

module.exports = router;

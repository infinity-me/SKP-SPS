const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getChatContext } = require('../utils/contextManager');
const jwt = require('jsonwebtoken');

// Helper to check auth (Optional for chat, but needed for personal data)
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

router.post('/', async (req, res) => {
    try {
        const { message, history } = req.body;
        const userId = getUserIdFromToken(req);

        console.log("--- CHAT REQUEST START ---");
        console.log("User Logged In:", !!userId);
        
        // 1. Get Dynamic Context from DB
        let dbContext = "";
        try {
            dbContext = await getChatContext(userId);
            console.log("Successfully retrieved DB context.");
        } catch (ctxErr) {
            console.error("Context Retrieval Failed:", ctxErr);
            // We continue even if context fails, the bot can still use its general knowledge
        }

        // 2. Initialize Gemini (Inside handler to ensure fresh env vars)
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
            throw new Error("Gemini API Key is missing or using placeholder.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 3. Build Base System Prompt
        const systemPrompt = `
You are the Official AI Concierge for SKP SAINIK PUBLIC SCHOOL, Manihari (UP). 
School Info: Founded in 2009 by Shri Satyadev Kushwaha (Chairman). Principal: Mrs. Shobha Sharma. 
Values: Military discipline, academic rigour, character building. Affiliation: CBSE. 
Facilities: Smart Classes, Science/Computer Labs, NCC, Hostel, Sports Ground.

Instructions:
- Be respectful, helpful, and premium in tone.
- Handle English, Hindi, and Hinglish naturally. Detect the user's language and respond accordingly.
- ACADEMIC ASSISTANCE: You are also a knowledgeable academic assistant. Feel free to answer general questions about Mathematics, Science, History, Geography, and other subjects using your internal knowledge.
- SCHOOL CONTEXT: Use the provided CONTEXT for school-specific queries (notices, fees, events). If a school-related question is not covered in the context, suggest contacting skpspsmanihari09@gmail.com or +91 9454331861, 8449790561.
- Keep responses concise but informative.
- FORMATTING: Use PLAIN TEXT only. Do NOT use Markdown bolding (like **word**), italics, or other markdown symbols. Use simple dashes (-) for lists.
- CRITICAL: Do NOT repeat your introductory welcome message or "Namaste" in every response. If the conversation history shows you have already introduced yourself, jump straight to the user's answer.

RECENT SCHOOL DATA & USER CONTEXT:
${dbContext || "No recent updates available at the moment."}
        `;

        // 4. Generate Content
        console.log("Sending prompt to Gemini...");
        
        // Format history for context
        const formattedHistory = (history || [])
            .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n');

        const fullPrompt = `${systemPrompt}\n\nConversation History:\n${formattedHistory}\n\nUser: ${message}\nAssistant:`;
        
        let responseText = "";
        try {
            const result = await model.generateContent(fullPrompt);
            if (!result || !result.response) {
                throw new Error("Empty response object received from Gemini.");
            }
            
            // Check for safety block or other finish reasons
            const response = await result.response;
            const candidate = response.candidates?.[0];
            
            if (candidate?.finishReason === "SAFETY") {
                responseText = "I'm sorry, I cannot answer that question as it violates my safety guidelines.";
            } else if (candidate?.finishReason && candidate.finishReason !== "STOP") {
                throw new Error(`Gemini finish reason: ${candidate.finishReason}`);
            } else {
                responseText = response.text();
            }
        } catch (genErr) {
            console.warn("Primary model (gemini-1.5-flash) failed, trying fallback...", genErr.message);
            try {
                const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
                const fallbackResult = await fallbackModel.generateContent(fullPrompt);
                const fallbackResponse = await fallbackResult.response;
                responseText = fallbackResponse.text();
            } catch (fallbackErr) {
                console.error("Fallback model also failed:", fallbackErr.message);
                throw new Error(`Gemini API Error: ${genErr.message} (Fallback failed: ${fallbackErr.message})`);
            }
        }

        console.log("Chat response generated successfully.");
        res.json({ success: true, reply: responseText });
    } catch (err) {
        console.error("CRITICAL CHAT ERROR:", err.message);
        if (err.stack) console.error(err.stack);
        
        if (err.status === 404) {
            console.error("404 Error Detail: The model name or API version might be incorrect for this key.");
        }
        res.status(500).json({ 
            success: false, 
            message: "Our AI brain is currently being updated. Please try again in a few minutes.",
            debug: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

module.exports = router;

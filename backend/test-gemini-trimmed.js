require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    try {
        console.log("Testing Gemini API with trimmed key...");
        const apiKey = process.env.GEMINI_API_KEY.trim();
        console.log("API Key found and trimmed:", !!apiKey);
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent("Hello, are you working?");
        console.log("Response:", result.response.text());
        console.log("SUCCESS");
    } catch (err) {
        console.error("TEST FAILED");
        console.error("Message:", err.message);
        if (err.status) console.error("Status:", err.status);
    }
}

test();

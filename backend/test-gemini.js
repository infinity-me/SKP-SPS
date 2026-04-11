require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    try {
        console.log("Testing Gemini API...");
        console.log("API Key found:", !!process.env.GEMINI_API_KEY);
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const result = await model.generateContent("Hello, are you working?");
        console.log("Response:", result.response.text());
        console.log("SUCCESS");
    } catch (err) {
        console.error("TEST FAILED");
        console.error(err);
    }
}

test();

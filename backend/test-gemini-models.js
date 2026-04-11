require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    try {
        console.log("Listing available models...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // List models is only available in some versions or via client
        // But we can try to find the right name
        
        const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro", "gemini-1.5-pro"];
        
        for (const m of models) {
            try {
                console.log(`Trying model: ${m}`);
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Hi");
                console.log(`SUCCESS with ${m}:`, result.response.text());
                return;
            } catch (e) {
                console.log(`FAILED with ${m}:`, e.message);
            }
        }
    } catch (err) {
        console.error("TOTAL FAILURE");
        console.error(err);
    }
}

test();

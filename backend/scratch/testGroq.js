require('dotenv').config();
const axios = require('axios');

async function testGroq() {
    console.log("Testing Groq with key:", process.env.GROQ_API_KEY ? "EXISTS" : "MISSING");
    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: "Say hello" }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Success! Response:", response.data.choices[0].message.content);
    } catch (err) {
        console.error("Failed!", err.response?.data || err.message);
    }
}

testGroq();

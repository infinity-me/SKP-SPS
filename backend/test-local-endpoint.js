const axios = require('axios');

async function test() {
    try {
        console.log("Testing local backend /api/chat endpoint...");
        const res = await axios.post('http://localhost:5000/api/chat', {
            message: "hi",
            history: []
        });
        console.log("Response Success:", res.data.success);
        console.log("Reply:", res.data.reply);
    } catch (err) {
        console.error("ERROR Status:", err.response?.status);
        console.error("ERROR Data:", JSON.stringify(err.response?.data));
        console.error("ERROR Message:", err.message);
    }
}

test();

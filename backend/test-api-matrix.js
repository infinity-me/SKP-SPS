require('dotenv').config();

async function testVersions() {
    const key = process.env.GEMINI_API_KEY;
    const versions = ['v1', 'v1beta'];
    const models = ['gemini-1.5-flash', 'gemini-1.0-pro'];
    
    for (const v of versions) {
        for (const m of models) {
            const url = `https://generavelanguage.googleapis.com/${v}/models/${m}:generateContent?key=${key}`;
            console.log(`Testing ${v} with ${m}...`);
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: "Hi" }] }]
                    })
                });
                
                const data = await response.json();
                console.log(`Status ${v}/${m}:`, response.status);
                if (response.status === 200) {
                    console.log("SUCCESS!");
                    return;
                }
            } catch (err) {
                console.log(`Error ${v}/${m}:`, err.message);
            }
        }
    }
}

testVersions();

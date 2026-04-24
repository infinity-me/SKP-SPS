/**
 * Rule-Based Intent Matcher for SKP SPS School
 * Supports English, Hindi, and Hinglish keywords
 * 
 * DESIGN: Intents are ONLY matched for very specific, short queries.
 * Anything that looks like a complex question goes straight to the AI.
 */

const INTENTS = {
    FEES: 'FEES',
    NOTICES: 'NOTICES',
    EVENTS: 'EVENTS',
    RESULTS: 'RESULTS',
    ADMISSION: 'ADMISSION',
    CONTACT: 'CONTACT',
    ABOUT: 'ABOUT',
    GREETING: 'GREETING',
    HELP: 'HELP'
};

// Stricter patterns — only match SHORT, unambiguous queries
const KEYWORDS = {
    // Greeting only on very short messages
    [INTENTS.GREETING]: [/^(hi|hello|hey|namaste|namashkar|नमस्ते|सलाम)\s*[!.?]*$/i],

    // Fee queries
    [INTENTS.FEES]: [/\bfee(s)?\b/i, /\bshulk\b/i, /\bpaisa\b/i, /\bdue(s)?\b/i, /\bpending fee\b/i, /\bफीस\b/i, /\bशुल्क\b/i],

    // Notice queries
    [INTENTS.NOTICES]: [/\bnotice(s)?\b/i, /\bcircular(s)?\b/i, /\bannouncement(s)?\b/i, /\bसूचना\b/i, /\bनोटिस\b/i],

    // Event / holiday queries
    [INTENTS.EVENTS]: [/\bevent(s)?\b/i, /\bholiday(s)?\b/i, /\bchutti\b/i, /\bvacation\b/i, /\bcalendar\b/i, /\bछुट्टी\b/i, /\bकार्यक्रम\b/i],

    // Result queries
    [INTENTS.RESULTS]: [/\bresult(s)?\b/i, /\bmarks?\b/i, /\bscore(s)?\b/i, /\bgrade(s)?\b/i, /\breport card\b/i, /\bपरिणाम\b/i, /\bरिजल्ट\b/i],

    // Admission queries
    [INTENTS.ADMISSION]: [/\badmission(s)?\b/i, /\bapply\b/i, /\bregistration\b/i, /\bदाखिला\b/i, /\bप्रवेश\b/i],

    // Contact queries
    [INTENTS.CONTACT]: [/\bcontact\b/i, /\bphone number\b/i, /\bmobile number\b/i, /\baddress\b/i, /\blocation\b/i, /\bsangpark\b/i, /\bसंपर्क\b/i, /\bफोन\b/i],

    // About school queries — only match "about school" or "about skp", not bare "about"
    [INTENTS.ABOUT]: [/\babout\s+(skp|the school|sainik)\b/i, /\bwho\s+(is|are)\s+the principal\b/i, /\bschool ki jankari\b/i, /\bस्कूल के बारे\b/i],
};

// These intents should pass through to AI for richer context-aware answers
const AI_PREFERRED_INTENTS = new Set([INTENTS.FEES, INTENTS.RESULTS, INTENTS.NOTICES, INTENTS.EVENTS]);

function detectIntent(message) {
    const text = message.trim();

    // If the message is long (> 60 chars), it's a complex question — always use AI
    if (text.length > 60) return null;

    // If message contains a question word at the start, prefer AI
    if (/^(what|how|why|when|where|which|can|is|are|do|does|tell me|explain|kaise|kyun|kab|kya hoga|batao|bata do)/i.test(text)) {
        return null;
    }

    for (const [intent, patterns] of Object.entries(KEYWORDS)) {
        for (const pattern of patterns) {
            if (pattern.test(text)) {
                return intent;
            }
        }
    }

    return null;
}

module.exports = {
    detectIntent,
    INTENTS,
    AI_PREFERRED_INTENTS
};

/**
 * Rule-Based Intent Matcher for SKP SPS School
 * Supports English, Hindi, and Hinglish keywords
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

const KEYWORDS = {
    [INTENTS.GREETING]: [/hi\b/i, /hello/i, /namaste/i, /hey/i, /namashkar/i, /नमस्ते/],
    [INTENTS.FEES]: [/fee/i, /paisa/i, /shulk/i, /money/i, /due/i, /pending/i, /pay/i, /फीस/i, /शुल्क/i, /पैसा/i],
    [INTENTS.NOTICES]: [/notice/i, /circular/i, /update/i, /news/i, /announcement/i, /सूचना/i, /नोटिस/i],
    [INTENTS.EVENTS]: [/event/i, /calendar/i, /holiday/i, /chut+i/i, /vacation/i, /function/i, /program/i, /छुट्टी/i, /कार्यक्रम/i],
    [INTENTS.RESULTS]: [/result/i, /marks/i, /score/i, /grade/i, /pass/i, /fail/i, /report/i, /परिणाम/i, /रिजल्ट/i],
    [INTENTS.ADMISSION]: [/admiss/i, /apply/i, /join/i, /regis/i, /admission/i, /दाखिला/i, /प्रवेश/i],
    [INTENTS.CONTACT]: [/contact/i, /phone/i, /call/i, /mobile/i, /address/i, /location/i, /where/i, /number/i, /संपर्क/i, /फोन/i],
    [INTENTS.ABOUT]: [/about/i, /who/i, /school/i, /principal/i, /chairman/i, /history/i, /found/i, /बारे/i],
    [INTENTS.HELP]: [/help/i, /kya/i, /what/i, /assist/i, /مدد/i, /मदद/i]
};

function detectIntent(message) {
    const text = message.toLowerCase();
    
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
    INTENTS
};

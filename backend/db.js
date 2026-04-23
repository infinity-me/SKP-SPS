require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

// Use WebSocket transport (HTTPS/443) - bypasses ISP blocks on port 5432/6543
neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = true;

// PrismaNeon takes a config object, NOT a Pool instance
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Warm-up check on startup
(async () => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Database connected via Neon WebSocket driver');
    } catch (err) {
        console.error('⚠️  DB startup check failed:', err.message.substring(0, 200));
    }
})();

module.exports = prisma;
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addAdmin() {
    try {
        const id = "admin";
        const password = "admin_here_sps.aman";
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await prisma.user.findUnique({
            where: { email: id }
        });

        if (existingUser) {
            console.log("Admin account already exists.");
            return;
        }

        const newUser = await prisma.user.create({
            data: {
                name: "Admin User",
                email: id,
                password: hashedPassword,
                role: "admin"
            }
        });

        console.log("Admin account created successfully:", newUser.email);
    } catch (error) {
        console.error("Error creating admin account:", error);
    } finally {
        await prisma.$disconnect();
    }
}

addAdmin();

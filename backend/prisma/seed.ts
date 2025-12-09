import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const adminEmail = 'admin@admin.com'
    const adminPassword = 'admin'
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    const user = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            password: hashedPassword, // Reset password if user exists
            role: 'ADMIN' // Ensure role is ADMIN
        },
        create: {
            email: adminEmail,
            name: 'Admin',
            password: hashedPassword,
            role: 'ADMIN',
            firstLogin: false, // Don't force change password on first login for verify
        },
    })

    console.log('Admin user created/updated:', user)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

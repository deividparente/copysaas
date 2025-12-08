import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('Raiar@2026', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@raiar.com' },
        update: {},
        create: {
            name: 'Administrador',
            email: 'admin@raiar.com',
            password: adminPassword,
            role: 'ADMIN',
            firstLogin: false, // Admin already has password set
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create test user
    const userPassword = await bcrypt.hash('Raiar@2026', 10);
    const user = await prisma.user.upsert({
        where: { email: 'usuario@raiar.com' },
        update: {},
        create: {
            name: 'Usuário Teste',
            email: 'usuario@raiar.com',
            password: userPassword,
            role: 'USER',
            firstLogin: true,
        },
    });
    console.log('✅ Test user created:', user.email);

    // Create categories
    const category1 = await prisma.category.create({
        data: {
            name: 'Vendas',
            order: 1,
        },
    });

    const category2 = await prisma.category.create({
        data: {
            name: 'Suporte',
            order: 2,
        },
    });

    console.log('✅ Categories created');

    // Create subcategories
    const subcat1 = await prisma.subcategory.create({
        data: {
            name: 'Prospecção',
            categoryId: category1.id,
            order: 1,
        },
    });

    const subcat2 = await prisma.subcategory.create({
        data: {
            name: 'Fechamento',
            categoryId: category1.id,
            order: 2,
        },
    });

    const subcat3 = await prisma.subcategory.create({
        data: {
            name: 'FAQ',
            categoryId: category2.id,
            order: 1,
        },
    });

    console.log('✅ Subcategories created');

    // Create messages
    await prisma.message.createMany({
        data: [
            {
                content: 'Olá! Tudo bem? Gostaria de conhecer nossos produtos?',
                subcategoryId: subcat1.id,
                order: 1,
            },
            {
                content: 'Estamos com uma promoção especial este mês. Posso te enviar mais detalhes?',
                subcategoryId: subcat1.id,
                order: 2,
            },
            {
                content: 'Parabéns pela decisão! Vou preparar sua proposta agora.',
                subcategoryId: subcat2.id,
                order: 1,
            },
            {
                content: 'Para finalizar, preciso apenas confirmar alguns dados. Pode ser?',
                subcategoryId: subcat2.id,
                order: 2,
            },
            {
                content: 'Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.',
                subcategoryId: subcat3.id,
                order: 1,
            },
            {
                content: 'Você pode entrar em contato conosco pelo email suporte@raiar.com',
                subcategoryId: subcat3.id,
                order: 2,
            },
        ],
    });

    console.log('✅ Messages created');
    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📧 Login credentials:');
    console.log('Admin: admin@raiar.com / Raiar@2026');
    console.log('User: usuario@raiar.com / Raiar@2026');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.upsert({
        where: {
            email: 'admin@example.com',
        },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin',
        },
    });

    console.log('Seed completed');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });
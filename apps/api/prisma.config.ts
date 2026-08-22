import 'dotenv/config';

import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        seed: 'pnpm exec tsx apps/prisma/seed/index.ts',
    },
});

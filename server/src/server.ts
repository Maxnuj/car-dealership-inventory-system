import { env } from './config/env.js';
import { prisma } from './config/prisma.js';
import { createApp } from './app.js';

const server = createApp().listen(env.PORT, () => console.info(`API listening on port ${env.PORT}`));

const shutdown = async (): Promise<void> => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

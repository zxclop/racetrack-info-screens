import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export const registerAppPlugins = async (app: FastifyInstance) => {
  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
};

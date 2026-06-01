import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export function registerHealthCheckController(app: FastifyInstance): void {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/health',
    {
      schema: {
        response: {
          200: z.string(),
        },
      },
    },
    (_req, res) => {
      res.send('OK');
    }
  );
}

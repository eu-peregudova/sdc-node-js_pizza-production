import 'dotenv/config';
import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { ErrorWithStatus } from '@pizza/api-contracts';
import { registerReadyController } from './controllers/orderController.js';
import PgBoss from 'pg-boss';
import { registerStaleOrderWorker } from './jobs/StaleOrderJob.js';
import { PizzaLogRepository } from './repositories/pizzaLogRepository.js';

export function createApp(boss: PgBoss) {
  const app = fastify({
    logger: true,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  registerReadyController(app, boss);

  app.setErrorHandler((error: ErrorWithStatus, _req, res) => {
    if (error.statusCode === 400 || error.statusCode === 404) {
      return res.status(error.statusCode).send(error.message);
    }

    console.error('Error occurred:', error);
    return res.status(500).send('Internal Server Error');
  });

  return app;
}

const start = async () => {
  const boss = new PgBoss(process.env.DATABASE_URL!);
  await boss.start();

  await registerStaleOrderWorker(boss, new PizzaLogRepository());
  const app = createApp(boss);

  try {
    await app.listen({ port: 3001 });
    console.log('Ordering Service listening on port 3001');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

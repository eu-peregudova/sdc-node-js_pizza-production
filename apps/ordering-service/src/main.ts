import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { ErrorWithStatus } from '@pizza/api-contracts';
import { registerReadyController } from './controllers/orderController.js';

export function createApp() {
  const app = fastify({
    logger: true,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  registerReadyController(app);

  app.setErrorHandler((error: ErrorWithStatus, _req, res) => {
    if (error.statusCode === 400 || error.statusCode === 404) {
      return res.status(error.statusCode).send(error.message);
    }

    console.error('Error occurred:', error);
    return res.status(500).send('Internal Server Error');
  });

  return app;
}

const app = createApp();
const start = async () => {
  try {
    await app.listen({ port: 3001 });
    console.log('Ordering Service listening on port 3001');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

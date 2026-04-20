import fastify from 'fastify';
import { registerHealthCheckController } from './controllers/healthCheckController';
import { registerIngredientStockController } from './controllers/ingredientStockController';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { ErrorWithStatus } from './shared/types';

export function createApp() {
  const app = fastify();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  registerHealthCheckController(app);
  registerIngredientStockController(app);

  app.setErrorHandler((error: ErrorWithStatus, _req, res) => {
    if (error.statusCode === 400) {
      return res.status(400).send(error.message);
    }

    return res.status(500).send('Internal Server Error');
  });

  return app;
}

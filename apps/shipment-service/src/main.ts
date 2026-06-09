import fastify from 'fastify';
import { registerHealthCheckController } from './controllers/healthCheckController.js';
import { registerShipmentController } from './controllers/shipmentController.js';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { ErrorWithStatus } from '@pizza/api-contracts';
import { registerIngredientController } from './controllers/ingredientController.js';

export function createApp() {
  const app = fastify();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  registerHealthCheckController(app);
  registerShipmentController(app);
  registerIngredientController(app);

  app.setErrorHandler((error: ErrorWithStatus, _req, res) => {
    if (error.statusCode === 400) {
      return res.status(400).send(error.message);
    }

    console.error(error);
    return res.status(500).send('Internal Server Error');
  });

  return app;
}

import fastify from 'fastify';
import { registerHealthCheckController } from './controllers/healthCheckController';
import { registerShipmentController } from './controllers/shipmentController';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { ErrorWithStatus } from './shared/types';
import dotenv from 'dotenv';
import path from 'node:path';

export function initializeEnv() {
  const result = dotenv.config({
    path: path.resolve(process.cwd(), '.env'),
  });

  return result;
}

export function createApp() {
  const app = fastify();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  registerHealthCheckController(app);
  registerShipmentController(app);

  app.setErrorHandler((error: ErrorWithStatus, _req, res) => {
    if (error.statusCode === 400) {
      return res.status(400).send(error.message);
    }

    return res.status(500).send('Internal Server Error');
  });

  return app;
}

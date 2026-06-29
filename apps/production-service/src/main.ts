import fastify from 'fastify';
import { registerAvailabilityController } from './controllers/availabilityController.js';
import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod';

export function createApp() {
  const app = fastify();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  registerAvailabilityController(app);

  return app;
}

const app = createApp();
const start = async () => {
  try {
    await app.listen({ port: 3002 });
    console.log('Production Service listening on port 3002');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

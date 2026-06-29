import './envinit.js';
import { createApp } from './main.js';

const app = createApp();

app
  .listen({
    port: 8080,
    host: 'localhost',
  })
  .then(() => {
    console.info('Server listening on port 8080');
  })
  .catch((error: unknown) => {
    console.error('Server error', error);
    process.exit(1);
  });

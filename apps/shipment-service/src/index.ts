import './envinit.js';
import PgBoss from 'pg-boss';
import { createApp } from './main.js';
import { ShipmentRepository } from './repositories/shipmentRepository.js';
import { startExpirationJob } from './jobs/ExpirationJob.js';

async function main() {
  const boss = new PgBoss(process.env.DATABASE_URL!);
  await boss.start();

  const shipmentRepo = new ShipmentRepository();
  await startExpirationJob(boss, shipmentRepo);
  console.info('[ExpirationJob] Scheduled');

  const app = createApp();
  await app.listen({ port: 8080, host: 'localhost' });
  console.info('Server listening on port 8080');
}

main().catch((error: unknown) => {
  console.error('Server error', error);
  process.exit(1);
});

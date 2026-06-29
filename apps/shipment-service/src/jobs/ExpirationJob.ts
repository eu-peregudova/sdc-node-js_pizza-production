import PgBoss from 'pg-boss';
import { ShipmentRepository } from '../repositories/shipmentRepository.js';

const JOB_NAME = 'expiration-job';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function startExpirationJob(boss: PgBoss, shipmentRepo: ShipmentRepository): Promise<void> {
  await boss.createQueue(JOB_NAME);
  await boss.schedule(JOB_NAME, '0 0 * * *');

  await boss.work(JOB_NAME, async () => {
    const cutoff = new Date(Date.now() - ONE_WEEK_MS);
    await shipmentRepo.deleteExpiredShipments(cutoff);
  });
}

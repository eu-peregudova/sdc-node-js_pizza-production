import PgBoss from 'pg-boss';
import { PizzaLogRepository } from '../repositories/pizzaLogRepository.js';

const JOB_NAME = 'stale-order-job';
const TWO_HOURS_SECONDS = 2 * 60 * 60;

export async function registerStaleOrderWorker(boss: PgBoss, repo: PizzaLogRepository): Promise<void> {
  await boss.createQueue(JOB_NAME);
  await boss.work<{ orderId: string }>(JOB_NAME, async ([ job ]) => {
    const { orderId } = job.data;
    const order = await repo.getOrderById(orderId);

    if (order && order.status === 'ready') {
      await repo.updateOrderStatus(orderId, 'stale');
    }
  });
}

export async function scheduleStaleOrderJob(boss: PgBoss, orderId: string): Promise<void> {
  await boss.send(JOB_NAME, { orderId }, { startAfter: TWO_HOURS_SECONDS });
}

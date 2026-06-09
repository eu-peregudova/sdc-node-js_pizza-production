import { FastifyInstance } from 'fastify';
import { shipmentSchema, PartialShipmentError } from '@pizza/api-contracts';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ShipmentRepository } from '../repositories/shipmentRepository.js';
import { ShipmentService } from '../services/ShipmentService.js';
import z from 'zod';

export function registerShipmentController(app: FastifyInstance): void {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/shipment',
    {
      schema: {
        body: shipmentSchema,
        response: {
          200: z.array(z.string()),
          422: z.object({
            error: z.string(),
            successfulIds: z.array(z.string()),
            failedShipments: shipmentSchema.array(),
          }),
        },
      },
    },
    async (req, res) => {
      try {
        const shipment = req.body;

        const service = new ShipmentService(new ShipmentRepository());
        const result = await service.registerShipment({
          ...shipment,
          timestamp: new Date(),
        });

        res.send(result);
      } catch (err) {
        if (err instanceof PartialShipmentError) {
          res.status(422).send({
            error: err.message,
            successfulIds: err.successfulShipmentIds,
            failedShipments: err.failedShipments,
          });
        } else {
          throw err;
        }
      }
    }
  );
}

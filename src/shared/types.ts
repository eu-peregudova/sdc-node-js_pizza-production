import z from 'zod';

export class ErrorWithStatus extends Error {
  statusCode?: number;

  constructor(message: string) {
    super(message);
  }
}

export class PartialShipmentError extends ErrorWithStatus {
  successfulShipmentIds: string[];
  failedShipments: Shipment[];

  constructor(
    message: string,
    successfulShipmentIds: string[],
    failedShipments: Shipment[]
  ) {
    super(message);
    this.statusCode = 422;
    this.successfulShipmentIds = successfulShipmentIds;
    this.failedShipments = failedShipments;
  }
}

export enum TargetWarehouse {
  SMALL = 'S',
  STANDARD = 'M',
  LARGE = 'L',
}

export const shipmentSchema = z.object({
  targetWarehouse: z.enum([TargetWarehouse.SMALL, TargetWarehouse.STANDARD, TargetWarehouse.LARGE]),
  ingredients: z.array(
    z.object({
      id: z.string(),
      units: z.number(),
    })
  ),
});

export type Shipment = z.infer<typeof shipmentSchema> & {
  timestamp: Date;
};

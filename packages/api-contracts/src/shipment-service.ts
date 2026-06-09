import z from 'zod';

/**
 * Error class with status code
 */
export class ErrorWithStatus extends Error {
  statusCode?: number;

  constructor(message: string) {
    super(message);
  }
}

/**
 * Target warehouse size enumeration
 */
export enum TargetWarehouse {
  SMALL = 'S',
  STANDARD = 'M',
  LARGE = 'L',
}

/**
 * Ingredient in a shipment
 */
export const ingredientSchema = z.object({
  id: z.string().describe('Ingredient ID'),
  units: z.coerce.number().describe('Number of units'),
});

export type Ingredient = z.infer<typeof ingredientSchema>;

/**
 * Shipment schema and type
 */
export const shipmentSchema = z.object({
  targetWarehouse: z.enum([TargetWarehouse.SMALL, TargetWarehouse.STANDARD, TargetWarehouse.LARGE]).describe('Target warehouse size'),
  ingredients: z.array(ingredientSchema).describe('List of ingredients in the shipment'),
});

export type Shipment = z.infer<typeof shipmentSchema> & {
  timestamp: Date;
};

/**
 * Partial shipment error - some shipments succeeded, some failed
 */
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

/**
 * Ingredient availability
 */
export const ingredientAvailabilitySchema = z.object({
  id: z.string().describe('Ingredient ID'),
  available: z.boolean().describe('Whether ingredient is available'),
  units: z.coerce.number().nonnegative().describe('Available units'),
});

export type IngredientAvailability = z.infer<typeof ingredientAvailabilitySchema>;

/**
 * Response for GET /ingredients/availability
 */
export const checkIngredientAvailabilityResponseSchema = z.array(ingredientAvailabilitySchema).describe('Availability of requested ingredients');

export type CheckIngredientAvailabilityResponse = z.infer<typeof checkIngredientAvailabilityResponseSchema>;


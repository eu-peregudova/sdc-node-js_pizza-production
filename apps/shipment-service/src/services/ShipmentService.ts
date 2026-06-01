import { ErrorWithStatus, PartialShipmentError, Shipment, TargetWarehouse } from '../shared/types.js';
import { ShipmentRepository } from '../repositories/shipmentRepository.js';
import { WarehouseDecision } from './warehouses/BaseWarehouse.js';
import { WarehouseLarge } from './warehouses/WarehouseLarge.js';
import { WarehouseSmall } from './warehouses/WarehouseSmall.js';
import { WarehouseStandard } from './warehouses/WarehouseStandard.js';


export class ShipmentService {
  private UNIVERSALLY_ACCEPTED_SHIPMENT_SIZE = 400;
  private repository: ShipmentRepository;
  private warehouseMap = {
    [TargetWarehouse.SMALL]: WarehouseSmall,
    [TargetWarehouse.STANDARD]: WarehouseStandard,
    [TargetWarehouse.LARGE]: WarehouseLarge,
  };

  constructor(repository?: ShipmentRepository) {
    this.repository = repository || new ShipmentRepository();
  }

  async registerShipment(shipment: Shipment): Promise<string[]> {
    const warehouse = new this.warehouseMap[shipment.targetWarehouse]();

    const decision = warehouse.checkShipment(shipment);

    if (decision === WarehouseDecision.REJECT) {
      const error = new ErrorWithStatus('Warehouse cannot accept the shipment');
      error.statusCode = 400;
      throw error;
    }

    if (decision === WarehouseDecision.SPLIT) {
      const shipments = this.splitShipment(shipment);
      const allShipmentIds: string[] = [];
      const failedSplits: Shipment[] = [];
      
      for (const splitShip of shipments) {
        try {
          const ids = await this.registerShipment(splitShip);
          allShipmentIds.push(...ids);
        } catch (err) {
          failedSplits.push(splitShip);
        }
      }
      
      if (failedSplits.length > 0) {
        throw new PartialShipmentError(
          `Failed to process ${failedSplits.length} of ${shipments.length} split shipments`,
          allShipmentIds,
          failedSplits
        );
      }
      
      return allShipmentIds;
    }

    if (decision === WarehouseDecision.SEND) {
      const shipmentId = await this.repository.createShipment(shipment);
      return [shipmentId];
    }

    return [];
  }

  private splitShipment(shipment: Shipment): Shipment[] {
    let currentAmount = 0;
    let currentIngredients: { id: string; units: number }[] = [];
    const leftoverIngredients: { id: string; units: number }[] = [...shipment.ingredients];
    const shipments = [];

    for (const ingredient of leftoverIngredients) {
      if (currentAmount + ingredient.units > this.UNIVERSALLY_ACCEPTED_SHIPMENT_SIZE) {
        const unitsLeft = currentAmount + ingredient.units - this.UNIVERSALLY_ACCEPTED_SHIPMENT_SIZE;

        shipments.push({
          ...shipment,
          ingredients: [
            ...currentIngredients,
            {
              id: ingredient.id,
              units: ingredient.units - unitsLeft,
            },
          ],
        });

        if (unitsLeft) {
          leftoverIngredients.push({
            id: ingredient.id,
            units: unitsLeft,
          });
        }

        currentIngredients = [];
        currentAmount = 0;
      } else {
        currentAmount += ingredient.units;
        currentIngredients.push(ingredient);
      }
    }

    if (currentIngredients.length) {
      shipments.push({
        ...shipment,
        ingredients: currentIngredients,
      });
    }

    return shipments;
  }
}

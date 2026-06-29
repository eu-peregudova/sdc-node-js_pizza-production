import { Shipment } from '@pizza/api-contracts';

export enum WarehouseDecision {
  REJECT = 'reject',
  SPLIT = 'split',
  SEND = 'send',
}

export class BaseWarehouse {
  constructor(
    private startTimeUTC: string,
    private endTimeUTC: string,
    private minimalAmount: number,
    private maximumAmount: number
  ) {}

  checkShipment(shipment: Shipment): any {
    const shipmentHours = shipment.timestamp.getUTCHours();
    const shipmentMinutes = shipment.timestamp.getUTCMinutes();
    const shipmentSeconds = shipment.timestamp.getUTCSeconds();

    const [startHours, startMinutes, startSeconds] = this.startTimeUTC.split(':').map(Number);
    const [endHours, endMinutes, endSeconds] = this.endTimeUTC.split(':').map(Number);

    const shipmentTotalSeconds = shipmentHours * 3600 + shipmentMinutes * 60 + shipmentSeconds;
    const startTotalSeconds = startHours * 3600 + startMinutes * 60 + startSeconds;
    const endTotalSeconds = endHours * 3600 + endMinutes * 60 + endSeconds;

    if (shipmentTotalSeconds < startTotalSeconds || shipmentTotalSeconds > endTotalSeconds) {
      return WarehouseDecision.REJECT;
    }

    let totalUnits = 0;

    for (const ingredient of shipment.ingredients) {
      totalUnits += ingredient.units;
    }

    if (totalUnits > this.maximumAmount) {
      return WarehouseDecision.SPLIT;
    } else if (totalUnits < this.minimalAmount) {
      return WarehouseDecision.REJECT;
    }

    return WarehouseDecision.SEND;
  }
}

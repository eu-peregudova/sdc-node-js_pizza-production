import { BaseWarehouse } from './BaseWarehouse';

export class WarehouseSmall extends BaseWarehouse {
  constructor() {
    super('00:00:00', '23:59:59', 1, 500);
  }
}

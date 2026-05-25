import { BaseWarehouse } from './BaseWarehouse';

export class WarehouseStandard extends BaseWarehouse {
  constructor() {
    super('06:00:00', '22:00:00', 50, 1000);
  }
}

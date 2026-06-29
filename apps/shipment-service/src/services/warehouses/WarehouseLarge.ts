import { BaseWarehouse } from './BaseWarehouse.js';

export class WarehouseLarge extends BaseWarehouse {
  constructor() {
    super('08:00:00', '20:00:00', 100, 2000);
  }
}

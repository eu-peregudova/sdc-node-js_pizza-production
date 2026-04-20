import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Shipment, TargetWarehouse } from '../shared/types';
import { ShipmentService } from './ShipmentService';
import { ShipmentRepository } from '../repositories/shipmentRepository';

describe('ShipmentService', () => {
  let service: ShipmentService;
  let mockRepository: ShipmentRepository;

  beforeEach(() => {
    mockRepository = {
      createShipment: vi.fn().mockResolvedValue('mocked-shipment-id'),
      getShipmentById: vi.fn(),
      getAllShipments: vi.fn(),
      deleteShipment: vi.fn(),
      getWarehouseIdByName: vi.fn(),
    } as unknown as ShipmentRepository;

    service = new ShipmentService(mockRepository);
  });

  describe('splitShipment', () => {
    it('should split shipment when ingredients exceed maximum size', () => {
      const shipment: Shipment = {
        timestamp: new Date(),
        targetWarehouse: TargetWarehouse.SMALL,
        ingredients: [
          { id: '123456', units: 300 },
          { id: '1234', units: 202 },
          { id: '123', units: 505 },
        ],
      };

      const result = (service as any).splitShipment(shipment);

      expect(result).toHaveLength(3);
      expect(result[0].ingredients).toEqual([
        { id: '123456', units: 300 },
        { id: '1234', units: 100 },
      ]);
      expect(result[1].ingredients).toEqual([{ id: '123', units: 400 }]);
      expect(result[2].ingredients).toEqual([
        { id: '1234', units: 102 },
        { id: '123', units: 105 },
      ]);

      result.forEach((s: Shipment) => {
        expect(s.timestamp).toEqual(shipment.timestamp);
      });

      const totalUnits = result.reduce(
        (sum: number, s: Shipment) => sum + s.ingredients.reduce((acc, ing) => acc + ing.units, 0),
        0
      );
      const originalTotal = shipment.ingredients.reduce((sum, ing) => sum + ing.units, 0);
      expect(totalUnits).toBe(originalTotal);
    });

    it('should not split shipment when ingredients fit within maximum size', () => {
      const shipment: Shipment = {
        timestamp: new Date(),
        targetWarehouse: TargetWarehouse.LARGE,
        ingredients: [
          { id: '123456', units: 200 },
          { id: '1234', units: 100 },
        ],
      };

      const result = (service as any).splitShipment(shipment);

      expect(result).toHaveLength(1);
      expect(result[0].ingredients).toEqual(shipment.ingredients);
    });

    it('should handle shipment with single large ingredient', () => {
      const shipment: Shipment = {
        timestamp: new Date(),
        targetWarehouse: TargetWarehouse.SMALL,
        ingredients: [{ id: '123456', units: 1000 }],
      };

      const result = (service as any).splitShipment(shipment);

      expect(result).toHaveLength(3);
      expect(result[0].ingredients[0].units).toBe(400);
      expect(result[1].ingredients[0].units).toBe(400);
      expect(result[2].ingredients[0].units).toBe(200);
    });
  });

  describe('registerShipment', () => {
    it('should return array with single ID when shipment is accepted', async () => {
      const shipment: Shipment = {
        timestamp: new Date(),
        targetWarehouse: TargetWarehouse.LARGE,
        ingredients: [
          { id: 'ing-1', units: 100 },
          { id: 'ing-2', units: 50 },
        ],
      };

      const WarehouseLarge = (await import('../services/warehouses/WarehouseLarge.js')).WarehouseLarge;
      const originalCheck = WarehouseLarge.prototype.checkShipment;
      vi.spyOn(WarehouseLarge.prototype, 'checkShipment').mockReturnValue('send' as any);

      try {
        const result = await service.registerShipment(shipment);
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(1);
        expect(result[0]).toBe('mocked-shipment-id');
      } finally {
        WarehouseLarge.prototype.checkShipment = originalCheck;
      }
    });

    it('should return array of IDs when shipment is split successfully', async () => {
      let callCount = 0;
      (mockRepository.createShipment as any).mockImplementation(() => {
        callCount++;
        return Promise.resolve(`shipment-${callCount}`);
      });

      const smallShipment: Shipment = {
        timestamp: new Date(),
        targetWarehouse: TargetWarehouse.SMALL,
        ingredients: [
          { id: 'ing-1', units: 300 },
          { id: 'ing-2', units: 300 },
        ],
      };

      const WarehouseSmall = (await import('../services/warehouses/WarehouseSmall.js')).WarehouseSmall;
      const originalCheck = WarehouseSmall.prototype.checkShipment;
      
      vi.spyOn(WarehouseSmall.prototype, 'checkShipment').mockImplementation((shipment: Shipment) => {
        const totalUnits = shipment.ingredients.reduce((sum, ing) => sum + ing.units, 0);
        if (totalUnits > 400) {
          return 'split' as any;
        }
        return 'send' as any;
      });

      try {
        const result = await service.registerShipment(smallShipment);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(1);
        result.forEach((id) => {
          expect(typeof id).toBe('string');
        });
      } finally {
        WarehouseSmall.prototype.checkShipment = originalCheck;
      }
    });

    it('should throw PartialShipmentError when some splits fail', async () => {
      const { PartialShipmentError } = await import('../shared/types.js');
      let callCount = 0;
      (mockRepository.createShipment as any).mockImplementation(() => {
        callCount++;
        if (callCount === 2) {
          throw new Error('Database error');
        }
        return Promise.resolve(`shipment-${callCount}`);
      });

      const smallShipment: Shipment = {
        timestamp: new Date(),
        targetWarehouse: TargetWarehouse.SMALL,
        ingredients: [
          { id: 'ing-1', units: 300 },
          { id: 'ing-2', units: 300 },
        ],
      };

      const WarehouseSmall = (await import('../services/warehouses/WarehouseSmall.js')).WarehouseSmall;
      const originalCheck = WarehouseSmall.prototype.checkShipment;
      
      vi.spyOn(WarehouseSmall.prototype, 'checkShipment').mockImplementation((shipment: Shipment) => {
        const totalUnits = shipment.ingredients.reduce((sum, ing) => sum + ing.units, 0);
        if (totalUnits > 400) {
          return 'split' as any;
        }
        return 'send' as any;
      });

      try {
        await expect(service.registerShipment(smallShipment)).rejects.toThrow(PartialShipmentError);
      } finally {
        WarehouseSmall.prototype.checkShipment = originalCheck;
      }
    });
  });
});

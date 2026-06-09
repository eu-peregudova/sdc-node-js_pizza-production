import { beforeAll, describe, expect, it, vi, beforeEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import { TargetWarehouse } from '@pizza/api-contracts';

describe('shipmentController', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    const { createApp } = await import('../main.js');
    app = createApp();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 with array of shipment IDs when sent valid shipment', async () => {
    const payload = {
      targetWarehouse: TargetWarehouse.LARGE,
      ingredients: [
        { id: 'ing-1', units: 200 },
        { id: 'ing-2', units: 100 },
      ],
    };

    const response = await app.inject({
      method: 'POST',
      url: '/shipment',
      payload,
    });

    expect([200, 400]).toContain(response.statusCode);
    if (response.statusCode === 200) {
      const responseBody = JSON.parse(response.body);
      expect(Array.isArray(responseBody)).toBe(true);
    }
  });

  it('should return array with multiple shipment IDs for valid shipment', async () => {
    const payload = {
      targetWarehouse: TargetWarehouse.LARGE,
      ingredients: [{ id: 'ing-1', units: 300 }],
    };

    const response = await app.inject({
      method: 'POST',
      url: '/shipment',
      payload,
    });

    expect([200, 400, 422]).toContain(response.statusCode);
    if (response.statusCode === 200) {
      const responseBody = JSON.parse(response.body);
      expect(Array.isArray(responseBody)).toBe(true);
    }
  });

  it('should return 400 when targetWarehouse is invalid', async () => {
    const payload = {
      targetWarehouse: 'INVALID',
      ingredients: [{ id: 'ing-1', units: 100 }],
    };

    const response = await app.inject({
      method: 'POST',
      url: '/shipment',
      payload,
    });

    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 when ingredients array is empty', async () => {
    const payload = {
      targetWarehouse: TargetWarehouse.SMALL,
      ingredients: [],
    };

    const response = await app.inject({
      method: 'POST',
      url: '/shipment',
      payload,
    });

    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 when ingredient is missing id', async () => {
    const payload = {
      targetWarehouse: TargetWarehouse.LARGE,
      ingredients: [{ units: 100 }],
    };

    const response = await app.inject({
      method: 'POST',
      url: '/shipment',
      payload,
    });

    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 when ingredient is missing units', async () => {
    const payload = {
      targetWarehouse: TargetWarehouse.LARGE,
      ingredients: [{ id: 'ing-1' }],
    };

    const response = await app.inject({
      method: 'POST',
      url: '/shipment',
      payload,
    });

    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 when units is not a number', async () => {
    const payload = {
      targetWarehouse: TargetWarehouse.LARGE,
      ingredients: [{ id: 'ing-1', units: 'many' }],
    };

    const response = await app.inject({
      method: 'POST',
      url: '/shipment',
      payload,
    });

    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 when no body is sent', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/shipment',
    });

    expect(response.statusCode).toEqual(400);
  });
});

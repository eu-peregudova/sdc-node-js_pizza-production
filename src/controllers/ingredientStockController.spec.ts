import { beforeAll, afterEach, describe, expect, it } from 'vitest';
import { createApp } from '../main';
import { FastifyInstance } from 'fastify';
import { readData, writeData } from '../shared/data.utils';
import { INGREDIENT_URL } from '../shared/constants';

describe('ingredientStockController', () => {
  let app: FastifyInstance;
  let data: unknown;

  beforeAll(() => {
    app = createApp();
    data = readData(INGREDIENT_URL);
  });

  afterEach(() => {
    writeData(INGREDIENT_URL, data);
  });

  it('should return 200 with updated ingredients when sent valid data', async () => {
    const payload = {
      bread: 1,
    };

    const response = await app.inject({
      method: 'POST',
      url: '/ingredient',
      payload,
    });

    expect(response.statusCode).toEqual(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toHaveProperty('bread', 1);
  });

  it('should return 400 when there are no ingredients', async () => {
    const payload = undefined;

    const response = await app.inject({
      method: 'POST',
      url: '/ingredient',
      payload,
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toContain('Invalid input');
  });

  it('should return 400 when ingredient is sent incorrectly', async () => {
    const payload = { cheese: 'many wheels' };

    const response = await app.inject({
      method: 'POST',
      url: '/ingredient',
      payload,
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toContain('Invalid input');
  });
});

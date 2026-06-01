import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../main.js';
import { FastifyInstance } from 'fastify';

describe('healthCheckController', () => {
  let app: FastifyInstance;

  beforeAll(() => {
    app = createApp();
  });

  it('should return OK', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.body).toEqual('OK');
  });
});

import dotenv from 'dotenv';
import path from 'node:path';

export function initializeEnv() {
  const result = dotenv.config({
    path: path.resolve(process.cwd(), '.env'),
  });

  return result;
}

initializeEnv();

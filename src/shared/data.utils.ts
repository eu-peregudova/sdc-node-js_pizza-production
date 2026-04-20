import fs from 'node:fs';
import { ErrorWithStatus } from './types';

export function writeData(pathToData: string, data: unknown): void {
  try {
    fs.writeFileSync(pathToData, JSON.stringify(data));
  } catch (error: unknown) {
    const fileError = error as ErrorWithStatus;
    fileError.statusCode = 400;
    fileError.message = 'Cannot write the data';
    throw fileError;
  }
}

export function readData(pathToData: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(pathToData, 'utf-8'));
  } catch (error: unknown) {
    const fileError = error as ErrorWithStatus;
    fileError.statusCode = 400;
    fileError.message = 'Cannot read the data';
    throw fileError;
  }
}

import fs from 'fs';
import path from 'path';
import { AppConfig } from '../../../shared/schema';

export const loadConfig = (): AppConfig => {
  const configPath = path.join(__dirname, '../data/config.json');
  const rawData = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(rawData);
};

export const config = loadConfig();

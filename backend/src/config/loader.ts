import { AppConfig } from '../../../shared/schema';
import configData from '../data/config.json';

export const config = configData as AppConfig;
export const loadConfig = () => config;

import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { resolve } from 'path';
import { EnvConfig } from './interfaces';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const options = { folder: './config' };
    const filePath = `.${process.env.NODE_ENV || 'development'}.env`;
    console.log(filePath);
    const envFile = resolve(__dirname, '../../', options.folder, filePath);
    console.log(envFile);

    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}

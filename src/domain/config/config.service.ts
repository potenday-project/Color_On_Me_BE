import { Injectable } from '@nestjs/common';
import { EnvConfig } from './env-config';

@Injectable()
export class ConfigService {
    private readonly envConfig!: EnvConfig;

    constructor() {
        this.envConfig = process.env as EnvConfig;
    }

    get(key: string): string {
        return this.envConfig[key];
    }
}

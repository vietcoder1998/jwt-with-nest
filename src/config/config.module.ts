import {
  ConfigurableModuleAsyncOptions,
  DynamicModule,
  Module,
} from '@nestjs/common';
import { ConfigurableModuleClass } from './config.module-definition';
import { ConfigService } from './config.service';
import { ConfigModuleOptions } from './interfaces/config-module-options.interface';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule extends ConfigurableModuleClass {
  static register(options: ConfigModuleOptions): DynamicModule {
    return {
      // your custom logic here
      ...super.register(options),
    };
  }

  static registerAsync(
    options: ConfigurableModuleAsyncOptions<ConfigModuleOptions>,
  ): DynamicModule {
    return {
      // your custom logic here
      ...super.registerAsync(options),
    };
  }
}

export { ConfigModule };

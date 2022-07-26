import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ConfigModuleOptions } from './interfaces/config-module-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>().build();

export const ASYNC_OPTIONS_TYPE = {
  folder: '',
  config: '',
};
export const OPTIONS_TYPE = {
  folder: '',
  config: '',
};

import { Provider } from '@nestjs/common';
import { JwtModuleOptions } from '@nestjs/jwt';
import { ProviderInjector } from '../const/provider.const';
import { Environment } from '../type/environment.type';

export const JwtAccessProvider: Provider<JwtModuleOptions> = {
  provide: ProviderInjector.JWT_ACCESS_CONFIG_PROVIDER,
  inject: [ProviderInjector.ENV_PROVIDER],
  useFactory: (environment: Environment): JwtModuleOptions => {
    return {
      secret: environment.JWT_ACCESS_SECRET,
      global: true,
      signOptions: {
        expiresIn: environment.ACCESS_TOKEN_EXPIRES,
      },
    };
  },
};

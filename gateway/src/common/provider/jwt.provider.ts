import { Provider } from '@nestjs/common';
import { JwtModuleOptions } from '@nestjs/jwt';
import { ProviderInjector } from '../const/provider.const';
import { Environment } from '../type/environment.type';

export const JwtProvider: Provider<JwtModuleOptions> = {
  provide: ProviderInjector.JWT_CONFIG_PROVIDER,
  inject: [ProviderInjector.ENV_PROVIDER],
  useFactory: (environment: Environment): JwtModuleOptions => {
    return {
      secret: environment.JWT_SECRET,
      global: true,
      signOptions: {
        expiresIn: environment.ACCESS_TOKEN_EXPIRES,
      },
    };
  },
};

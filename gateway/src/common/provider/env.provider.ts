import { ConfigService } from '@nestjs/config';
import { ProviderInjector } from '../const/provider.const';
import { Environment } from '../type/environment.type';
import { Provider } from '@nestjs/common';

export const EnvProvider: Provider<Environment> = {
  provide: ProviderInjector.ENV_PROVIDER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Environment => {
    return {
      KAFKA_BROKER_HOST_1: configService.get<string>('KAFKA_BROKER_HOST_1')!,
      KAFKA_BROKER_PORT_1: configService.get<number>('KAFKA_BROKER_PORT_1')!,
      KAFKA_CLIENT_ID: configService.get<string>('KAFKA_CLIENT_ID')!,
      KAFKA_GROUP_ID: configService.get<string>('KAFKA_GROUP_ID')!,
      ORDER_SERVICE_HOST: configService.get<string>('ORDER_SERVICE_HOST')!,
      ORDER_SERVICE_PORT: configService.get<number>('ORDER_SERVICE_PORT')!,
      PAYMENT_SERVICE_HOST: configService.get<string>('PAYMENT_SERVICE_HOST')!,
      PAYMENT_SERVICE_PORT: configService.get<number>('PAYMENT_SERVICE_PORT')!,
      USER_SERVICE_HOST: configService.get<string>('USER_SERVICE_HOST')!,
      USER_SERVICE_PORT: configService.get<number>('USER_SERVICE_PORT')!,
      SERVER_PORT: configService.get<number>('SERVER_PORT')!,
      ACCESS_TOKEN_EXPIRES: configService.get<number>('ACCESS_TOKEN_EXPIRES')!,
      REFRESH_TOKEN_EXPIRES: configService.get<number>(
        'REFRESH_TOKEN_EXPIRES',
      )!,
      JWT_SECRET: configService.get<string>('JWT_SECRET')!,
    };
  },
};

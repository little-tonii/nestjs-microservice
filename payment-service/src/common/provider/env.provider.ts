import { ConfigService } from '@nestjs/config';
import { ProviderConst } from '../const/provider.const';
import { Environment } from '../type/environment.type';
import { Provider } from '@nestjs/common';

export const EnvProvider: Provider<Environment> = {
  provide: ProviderConst.ENV_PROVIDER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Environment => {
    return {
      SERVER_PORT: configService.get<number>('SERVER_PORT')!,
      POSTGRES_DB: configService.get<string>('POSTGRES_DB')!,
      POSTGRES_USER: configService.get<string>('POSTGRES_USER')!,
      POSTGRES_PASSWORD: configService.get<string>('POSTGRES_PASSWORD')!,
      POSTGRES_HOST: configService.get<string>('POSTGRES_HOST')!,
      POSTGRES_PORT: configService.get<number>('POSTGRES_PORT')!,
      KAFKA_BROKER_HOST_1: configService.get<string>('KAFKA_BROKER_HOST_1')!,
      KAFKA_BROKER_PORT_1: configService.get<number>('KAFKA_BROKER_PORT_1')!,
      KAFKA_CLIENT_ID: configService.get<string>('KAFKA_CLIENT_ID')!,
      KAFKA_GROUP_ID: configService.get<string>('KAFKA_GROUP_ID')!,
    };
  },
};

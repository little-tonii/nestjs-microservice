import { Provider } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProviderConst } from '../const/provider.const';
import { Environment } from '../type/environment.type';

export const DatabaseConfigProvider: Provider<TypeOrmModuleOptions> = {
  provide: ProviderConst.DATABASE_CONFIG_PROVIDER,
  inject: [ProviderConst.ENV_PROVIDER],
  useFactory: (environment: Environment): TypeOrmModuleOptions => {
    return {
      type: 'postgres',
      host: environment.POSTGRES_HOST,
      port: environment.POSTGRES_PORT,
      username: environment.POSTGRES_USER,
      password: environment.POSTGRES_PASSWORD,
      database: environment.POSTGRES_DB,
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    };
  },
};

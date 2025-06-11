import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { OrderModule } from './order/order.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ClientProvider, ClientsModule } from '@nestjs/microservices';
import { ProviderInjector } from './common/const/provider.const';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forRootAsync({
      imports: [CommonModule],
      inject: [ProviderInjector.DATABASE_CONFIG_PROVIDER],
      useFactory: (databaseConfig: TypeOrmModuleOptions) => databaseConfig,
    }),
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: ProviderInjector.KAFKA_PROVIDER,
          imports: [CommonModule],
          inject: [ProviderInjector.KAFKA_CONFIG_PROVIDER],
          useFactory: (kafkaConfig: ClientProvider) => kafkaConfig,
        },
      ],
    }),
    OrderModule,
  ],
})
export class AppModule {}

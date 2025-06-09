import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { PaymentModule } from './payment/payment.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProviderConst } from './common/const/provider.const';
import { ClientProvider, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forRootAsync({
      imports: [CommonModule],
      inject: [ProviderConst.DATABASE_CONFIG_PROVIDER],
      useFactory: (databaseConfig: TypeOrmModuleOptions) => databaseConfig,
    }),
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: ProviderConst.KAFKA_PROVIDER,
          imports: [CommonModule],
          inject: [ProviderConst.KAFKA_CONFIG_PROVIDER],
          useFactory: (kafkaConfig: ClientProvider) => kafkaConfig,
        },
      ],
    }),
    PaymentModule,
  ],
})
export class AppModule {}

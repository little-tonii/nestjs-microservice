import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ClientProvider, ClientsModule } from '@nestjs/microservices';
import { ProviderInjector } from './common/const/provider.const';

@Module({
  imports: [
    CommonModule,
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
    AuthModule,
  ],
})
export class AppModule {}

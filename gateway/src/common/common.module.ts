import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvProvider } from './provider/env.provider';
import { KafkaConfigProvider } from './provider/kafka-config.provider';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessProvider } from './provider/jwt.provider';
import { JwtAcessStrategy } from './utils/jwt.util';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true }),
  ],
  providers: [
    EnvProvider,
    KafkaConfigProvider,
    JwtAccessProvider,
    JwtAcessStrategy,
  ],
  exports: [
    EnvProvider,
    KafkaConfigProvider,
    JwtAccessProvider,
    JwtAcessStrategy,
  ],
})
export class CommonModule {}

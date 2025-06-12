import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvProvider } from './provider/env.provider';
import { KafkaConfigProvider } from './provider/kafka-config.provider';
import { JwtProvider } from './provider/jwt.provider';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [EnvProvider, KafkaConfigProvider, JwtProvider],
  exports: [EnvProvider, KafkaConfigProvider, JwtProvider],
})
export class CommonModule {}

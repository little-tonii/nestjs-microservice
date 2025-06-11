import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvProvider } from './provider/env.provider';
import { KafkaConfigProvider } from './provider/kafka-config.provider';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [EnvProvider, KafkaConfigProvider],
  exports: [EnvProvider, KafkaConfigProvider],
})
export class CommonModule {}

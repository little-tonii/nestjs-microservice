import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvProvider } from './provider/env.provider';
import { DatabaseConfigProvider } from './provider/database-config.provider';
import { KafkaConfigProvider } from './provider/kafka-config.provider';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [EnvProvider, DatabaseConfigProvider, KafkaConfigProvider],
  exports: [EnvProvider, DatabaseConfigProvider, KafkaConfigProvider],
})
export class CommonModule {}

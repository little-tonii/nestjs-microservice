import { Module } from '@nestjs/common';
import { AuthProducer } from './kafka/auth.producer';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';

@Module({
  providers: [AuthProducer, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

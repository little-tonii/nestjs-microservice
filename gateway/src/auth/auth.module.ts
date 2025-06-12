import { Module } from '@nestjs/common';
import { AuthProducer } from './kafka/auth.producer';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  providers: [AuthProducer, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

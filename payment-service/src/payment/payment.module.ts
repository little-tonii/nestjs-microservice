import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/payment.entity';
import { PaymentProducer } from './kafka/payment.producer';
import { PaymentConsumer } from './kafka/payment.consumer';
import { PaymentService } from './service/payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [PaymentProducer, PaymentService],
  controllers: [PaymentConsumer],
})
export class PaymentModule {}

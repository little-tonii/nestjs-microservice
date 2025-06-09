import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../entity/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentProducer } from '../message/payment.producer';
import { OrderCreatedMessage } from '../dto/payment.consumer';
import { PaymentStatus } from '../entity/payment-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly paymentProducer: PaymentProducer,
  ) {}

  async createPayment(payload: OrderCreatedMessage): Promise<void> {
    const randomStatus = Math.round(Math.random());
    const newPayment = new PaymentEntity();
    newPayment.orderId = payload.id;
    newPayment.status = randomStatus
      ? PaymentStatus.SUCCESS
      : PaymentStatus.FAILURE;
    const createdPayment = await this.paymentRepository.save(newPayment);
    if (randomStatus) {
      this.paymentProducer.producePaymentSuccessEvent({
        orderId: createdPayment.orderId,
      });
    } else {
      this.paymentProducer.producePaymentFailureEvent({
        orderId: createdPayment.orderId,
      });
    }
  }
}

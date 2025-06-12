import { Controller } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KafkaMessage } from 'src/common/const/kafka.const';
import { OrderCreatedMessage } from '../payload/payment.consumer';

@Controller()
export class PaymentConsumer {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern(KafkaMessage.ORDER_CREATED)
  async handleOrderCreatedEvent(
    @Payload() payload: OrderCreatedMessage,
  ): Promise<void> {
    await this.paymentService.createPayment(payload);
  }
}

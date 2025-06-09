import { Controller } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KafkaTopic } from 'src/common/const/kafka.const';
import { OrderCreatedMessage } from '../dto/payment.consumer';

@Controller()
export class PaymentConsumer {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern(KafkaTopic.ORDER_CREATED)
  async handleOrderCreatedEvent(
    @Payload() payload: OrderCreatedMessage,
  ): Promise<void> {
    await this.paymentService.createPayment(payload);
  }
}

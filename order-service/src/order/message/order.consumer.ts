import { Controller } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  PaymentFailureMessage,
  PaymentSuccessMessage,
} from '../dto/order.consumer';
import { KafkaTopic } from 'src/common/const/kafka.const';

@Controller()
export class OrderConsumer {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern(KafkaTopic.PAYMENT_SUCCESS)
  async handlePaymentSuccessEvent(
    @Payload() payload: PaymentSuccessMessage,
  ): Promise<void> {
    await this.orderService.confirmOrder(payload.orderId);
  }

  @EventPattern(KafkaTopic.PAYMENT_FAILURE)
  async handlePaymentFailureEvent(
    @Payload() payload: PaymentFailureMessage,
  ): Promise<void> {
    await this.orderService.cancelOrder(payload.orderId);
  }
}

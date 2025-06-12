import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ProviderInjector } from 'src/common/const/provider.const';
import {
  PaymentFailureMessage,
  PaymentSuccessMessage,
} from '../payload/payment.producer';
import { KafkaMessage } from 'src/common/const/kafka.const';

@Injectable()
export class PaymentProducer {
  constructor(
    @Inject(ProviderInjector.KAFKA_PROVIDER)
    private readonly kafkaClient: ClientKafka,
  ) {}

  producePaymentSuccessEvent(payload: PaymentSuccessMessage): void {
    this.kafkaClient.emit<KafkaMessage, PaymentSuccessMessage>(
      KafkaMessage.PAYMENT_SUCCESS,
      payload,
    );
  }

  producePaymentFailureEvent(payload: PaymentFailureMessage): void {
    this.kafkaClient.emit<KafkaMessage, PaymentFailureMessage>(
      KafkaMessage.PAYMENT_FAILURE,
      payload,
    );
  }
}

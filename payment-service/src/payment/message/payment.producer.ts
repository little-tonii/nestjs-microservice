import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ProviderInjector } from 'src/common/const/provider.const';
import {
  PaymentFailureMessage,
  PaymentSuccessMessage,
} from '../dto/payment.producer';
import { KafkaTopic } from 'src/common/const/kafka.const';

@Injectable()
export class PaymentProducer {
  constructor(
    @Inject(ProviderInjector.KAFKA_PROVIDER)
    private readonly kafkaClient: ClientKafka,
  ) {}

  producePaymentSuccessEvent(payload: PaymentSuccessMessage): void {
    this.kafkaClient.emit<KafkaTopic, PaymentSuccessMessage>(
      KafkaTopic.PAYMENT_SUCCESS,
      payload,
    );
  }

  producePaymentFailureEvent(payload: PaymentFailureMessage): void {
    this.kafkaClient.emit<KafkaTopic, PaymentFailureMessage>(
      KafkaTopic.PAYMENT_FAILURE,
      payload,
    );
  }
}

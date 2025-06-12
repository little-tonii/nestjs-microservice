import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ProviderInjector } from 'src/common/const/provider.const';
import { OrderCreatedMessage } from '../payload/order.producer';
import { KafkaMessage } from 'src/common/const/kafka.const';

@Injectable()
export class OrderProducer {
  constructor(
    @Inject(ProviderInjector.KAFKA_PROVIDER)
    private readonly kafkaClient: ClientKafka,
  ) {}

  produceOrderCreatedEvent(payload: OrderCreatedMessage): void {
    this.kafkaClient.emit<KafkaMessage, OrderCreatedMessage>(
      KafkaMessage.ORDER_CREATED,
      payload,
    );
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ProviderInjector } from 'src/common/const/provider.const';
import { OrderCreatedMessage } from '../dto/order.producer';
import { KafkaTopic } from 'src/common/const/kafka.const';

@Injectable()
export class OrderProducer {
  constructor(
    @Inject(ProviderInjector.KAFKA_PROVIDER)
    private readonly kafkaClient: ClientKafka,
  ) {}

  produceOrderCreatedEvent(payload: OrderCreatedMessage): void {
    this.kafkaClient.emit<KafkaTopic, OrderCreatedMessage>(
      KafkaTopic.ORDER_CREATED,
      payload,
    );
  }
}

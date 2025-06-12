import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ProviderInjector } from 'src/common/const/provider.const';
import { KafkaMessage } from 'src/common/const/kafka.const';
import { lastValueFrom, timeout } from 'rxjs';
import { UserCreateMessage, UserGetByEmailMessage } from '../dto/auth.request';

@Injectable()
export class AuthProducer {
  constructor(
    @Inject(ProviderInjector.KAFKA_PROVIDER)
    private readonly kafkaClient: ClientKafka,
  ) {
    this.kafkaClient.subscribeToResponseOf(
      KafkaMessage.USER_GET_BY_EMAIL_REQUEST,
    );
    this.kafkaClient.subscribeToResponseOf(KafkaMessage.USER_CREATE_REQUEST);
  }

  async produceUserGetByEmailEvent(
    payload: UserGetByEmailMessage,
  ): Promise<string> {
    return await lastValueFrom(
      this.kafkaClient
        .send(KafkaMessage.USER_GET_BY_EMAIL_REQUEST, payload)
        .pipe<string>(timeout(KafkaMessage.RESPONSE_TIMEOUT)),
    );
  }

  async produceUserCreateEvent(payload: UserCreateMessage): Promise<string> {
    return await lastValueFrom(
      this.kafkaClient
        .send(KafkaMessage.USER_CREATE_REQUEST, payload)
        .pipe<string>(timeout(KafkaMessage.RESPONSE_TIMEOUT)),
    );
  }
}

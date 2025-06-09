import { Provider } from '@nestjs/common';
import { ClientProvider, Transport } from '@nestjs/microservices';
import { ProviderConst } from '../const/provider.const';
import { Environment } from '../type/environment.type';

export const KafkaConfigProvider: Provider<ClientProvider> = {
  provide: ProviderConst.KAFKA_CONFIG_PROVIDER,
  inject: [ProviderConst.ENV_PROVIDER],
  useFactory: (environment: Environment): ClientProvider => {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [
            `${environment.KAFKA_BROKER_HOST_1}:${environment.KAFKA_BROKER_PORT_1}`,
          ],
          clientId: environment.KAFKA_CLIENT_ID,
        },
        consumer: {
          groupId: environment.KAFKA_GROUP_ID,
          allowAutoTopicCreation: true,
        },
      },
    };
  },
};

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Environment } from './common/type/environment.type';
import { ProviderInjector } from './common/const/provider.const';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const environment = app.get<Environment>(ProviderInjector.ENV_PROVIDER);

  app.connectMicroservice<MicroserviceOptions>({
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
  });

  await app.startAllMicroservices();
  await app.listen(environment.SERVER_PORT);
}

void bootstrap();

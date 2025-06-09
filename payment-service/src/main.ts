import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerConst } from './common/const/swagger.const';
import { Environment } from './common/type/environment.type';
import { ProviderConst } from './common/const/provider.const';
import { CorsOptions } from 'cors';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const environment = app.get<Environment>(ProviderConst.ENV_PROVIDER);

  // microservice with kafka transport configuration
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

  // cors configuration
  const corsOptions: CorsOptions = {
    origin: '*',
    methods: '*',
    credentials: true,
    allowedHeaders: '*',
  };
  app.enableCors(corsOptions);

  // swagger configuration
  const config = new DocumentBuilder()
    .setTitle(SwaggerConst.TITLE)
    .setDescription(SwaggerConst.DESCRIPTION)
    .setVersion(SwaggerConst.VERSION)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SwaggerConst.BASE_PATH, app, documentFactory, {
    jsonDocumentUrl: SwaggerConst.JSON_DOCUMENT_URL,
    yamlDocumentUrl: SwaggerConst.YAML_DOCUMENT_URL,
  });

  await app.startAllMicroservices();
  await app.listen(environment.SERVER_PORT);
}

void bootstrap();

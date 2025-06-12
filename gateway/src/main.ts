import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Environment } from './common/type/environment.type';
import { ProviderInjector } from './common/const/provider.const';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CorsOptions } from 'cors';
import { SwaggerConfig } from './common/const/swagger.const';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/utils/exception-filter.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const environment = app.get<Environment>(ProviderInjector.ENV_PROVIDER);

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
    .setTitle(SwaggerConfig.TITLE)
    .setDescription(SwaggerConfig.DESCRIPTION)
    .setVersion(SwaggerConfig.VERSION)
    // .addBearerAuth(
    //   {
    //     name: 'Authorization',
    //     bearerFormat: 'Bearer',
    //     scheme: 'Bearer',
    //     type: 'http',
    //     in: 'Header',
    //   },
    //   'access-token',
    // )
    .addOAuth2(
      {
        type: SwaggerConfig.OAUTH2,
        flows: {
          password: {
            tokenUrl: SwaggerConfig.TOKEN_URL,
            scopes: {},
          },
        },
      },
      SwaggerConfig.OAUTH2_NAME,
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SwaggerConfig.SWAGGER_URL, app, documentFactory, {
    jsonDocumentUrl: SwaggerConfig.JSON_DOCUMENT_URL,
    yamlDocumentUrl: SwaggerConfig.YAML_DOCUMENT_URL,
  });

  await app.startAllMicroservices();
  await app.listen(environment.SERVER_PORT);
}

void bootstrap();

import { ClientKafka } from '@nestjs/microservices';
import { AuthProducer } from './auth.producer';
import { Test, TestingModule } from '@nestjs/testing';
import { ProviderInjector } from 'src/common/const/provider.const';
import { mock, MockProxy } from 'jest-mock-extended';
import { KafkaMessage } from 'src/common/const/kafka.const';
import { UserCreateMessage, UserGetByEmailMessage } from '../dto/auth.request';
import { NEVER, of, TimeoutError } from 'rxjs';
import {
  UserCreatedMessage,
  UserGotByEmailMessage,
} from '../dto/auth.response';

describe('AuthProducer', () => {
  let authProducer: AuthProducer;
  let mockKafkaClient: MockProxy<ClientKafka>;

  beforeEach(async () => {
    mockKafkaClient = mock<ClientKafka>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProviderInjector.KAFKA_PROVIDER,
          useValue: mockKafkaClient,
        },
        AuthProducer,
      ],
    }).compile();
    authProducer = module.get<AuthProducer>(AuthProducer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authProducer).toBeDefined();
  });

  describe('onModuleInit (Implicitly called by constructor)', () => {
    it('should subscribe to the correct response topics upon initialization', () => {
      expect(mockKafkaClient.subscribeToResponseOf.mock.calls).toEqual([
        [KafkaMessage.USER_GET_BY_EMAIL_REQUEST],
        [KafkaMessage.USER_CREATE_REQUEST],
      ]);
    });
  });

  describe('produceUserGetByEmailEvent', () => {
    it('should send an event to the correct topic and return the emitted value', async () => {
      const payload: UserGetByEmailMessage = { email: 'test@example.com' };
      const mockResponse = JSON.stringify({
        id: 1,
        email: 'test@gmail.com',
        password: 'password',
        refreshToken: 'refreshToken',
        tokenVersion: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserGotByEmailMessage);
      mockKafkaClient.send.mockReturnValue(of(mockResponse));

      const result = await authProducer.produceUserGetByEmailEvent(payload);

      expect(mockKafkaClient.send.mock.calls.length).toBe(1);
      expect(mockKafkaClient.send.mock.calls[0][0]).toBe(
        KafkaMessage.USER_GET_BY_EMAIL_REQUEST,
      );
      expect(mockKafkaClient.send.mock.calls[0][1]).toBe(payload);
      expect(result).toBe(mockResponse);
    });

    it('should throw TimeoutError if response takes too long', async () => {
      const payload: UserGetByEmailMessage = { email: 'test@gmail.com' };
      mockKafkaClient.send.mockReturnValue(NEVER);

      await expect(
        authProducer.produceUserGetByEmailEvent(payload),
      ).rejects.toThrow(TimeoutError);
    }, 6000);
  });

  describe('produceUserCreateEvent', () => {
    it('should send an event to the correct topic and return the emitted value', async () => {
      const payload: UserCreateMessage = {
        email: 'test@gmail.com',
        password: 'hashedPassword',
      };
      const mockResponse = JSON.stringify({ id: 1 } as UserCreatedMessage);
      mockKafkaClient.send.mockReturnValue(of(mockResponse));

      const result = await authProducer.produceUserCreateEvent(payload);

      expect(mockKafkaClient.send.mock.calls.length).toBe(1);
      expect(mockKafkaClient.send.mock.calls[0][0]).toBe(
        KafkaMessage.USER_CREATE_REQUEST,
      );
      expect(mockKafkaClient.send.mock.calls[0][1]).toBe(payload);
      expect(result).toBe(mockResponse);
    });

    it('should throw TimeoutError if response takes too long', async () => {
      const payload: UserCreateMessage = {
        email: 'test@gmail.com',
        password: 'hashedPassword',
      };
      mockKafkaClient.send.mockReturnValue(NEVER);

      await expect(
        authProducer.produceUserCreateEvent(payload),
      ).rejects.toThrow(TimeoutError);
    }, 6000);
  });
});

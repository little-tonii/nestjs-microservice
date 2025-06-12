import { mock, MockProxy } from 'jest-mock-extended';
import { AuthService } from './auth.service';
import { AuthProducer } from '../kafka/auth.producer';
import { JwtService } from '@nestjs/jwt';
import { Environment } from 'src/common/type/environment.type';
import { Test, TestingModule } from '@nestjs/testing';
import { ProviderInjector } from 'src/common/const/provider.const';
import {
  ConflictException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  UserCreateMessage,
  UserGetByEmailMessage,
  UserRegisterRequest,
} from '../dto/auth.request';
import {
  ServiceErrorMessage,
  UserCreatedMessage,
  UserGotByEmailMessage,
  UserRegisterResponse,
} from '../dto/auth.response';
import * as typeChecker from 'src/common/utils/type-checker.util';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

const isServiceErrorMessageSpy = jest.spyOn(
  typeChecker,
  'isServiceErrorMessage',
);

describe('AuthService', () => {
  let authService: AuthService;
  let mockAuthProducer: MockProxy<AuthProducer>;
  let mockJwtService: MockProxy<JwtService>;
  let mockEnvironment: MockProxy<Environment>;

  beforeEach(async () => {
    mockAuthProducer = mock<AuthProducer>();
    mockJwtService = mock<JwtService>();
    mockEnvironment = mock<Environment>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: JwtService, useValue: mockJwtService },

        { provide: AuthProducer, useValue: mockAuthProducer },
        {
          provide: ProviderInjector.ENV_PROVIDER,
          useValue: mockEnvironment,
        },
        AuthService,
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('registerUser', () => {
    const body: UserRegisterRequest = {
      email: 'test@gmail.com',
      password: 'password',
    };
    const hashedPassword = 'hashedPassword';

    it('should successfully register a new user if the email is available', async () => {
      const getUserError = {
        code: HttpStatus.NOT_FOUND,
        message: 'User not found',
      } as ServiceErrorMessage;
      mockAuthProducer.produceUserGetByEmailEvent.mockResolvedValue(
        JSON.stringify(getUserError),
      );

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const createUserData = { id: 1 } as UserCreatedMessage;
      mockAuthProducer.produceUserCreateEvent.mockResolvedValue(
        JSON.stringify(createUserData),
      );

      const result = await authService.registerUser(body);

      expect(result).toEqual({ id: 1 } as UserRegisterResponse);
      expect(
        mockAuthProducer.produceUserGetByEmailEvent.mock.calls.length,
      ).toBe(1);
      expect(
        mockAuthProducer.produceUserGetByEmailEvent.mock.calls[0][0],
      ).toEqual({ email: body.email } as UserGetByEmailMessage);
      expect((bcrypt.hash as jest.Mock).mock.calls.length).toBe(1);
      expect(bcrypt.hash as jest.Mock).toHaveBeenCalledWith(body.password, 12);
      expect(mockAuthProducer.produceUserCreateEvent.mock.calls.length).toBe(1);
      expect(mockAuthProducer.produceUserCreateEvent.mock.calls[0][0]).toEqual({
        email: body.email,
        password: hashedPassword,
      } as UserCreateMessage);
    });

    it('should throw ConflictException if the email is already in use', async () => {
      const getUserData = {
        id: 1,
        email: 'test@gmail.com',
        password: 'hashedPassword',
        refreshToken: 'refreshToken',
        tokenVersion: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserGotByEmailMessage;
      mockAuthProducer.produceUserGetByEmailEvent.mockResolvedValue(
        JSON.stringify(getUserData),
      );

      await expect(authService.registerUser(body)).rejects.toThrow(
        new ConflictException('Email is already used'),
      );

      expect(bcrypt.hash as jest.Mock).not.toHaveBeenCalled();
      expect(mockAuthProducer.produceUserCreateEvent.mock.calls.length).toBe(0);
    });

    it('should throw an error wrapped by ExceptionWrapper if get-user-by-email fails with a system error', async () => {
      const getUserError: ServiceErrorMessage = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error from user service',
      };
      mockAuthProducer.produceUserGetByEmailEvent.mockResolvedValue(
        JSON.stringify(getUserError),
      );

      isServiceErrorMessageSpy.mockReturnValue(true);

      await expect(authService.registerUser(body)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(isServiceErrorMessageSpy).toHaveBeenCalledWith(getUserError);
    });

    it('should throw an error wrapped by ExceptionWrapper if create-user fails', async () => {
      const getUserError: ServiceErrorMessage = {
        code: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
      mockAuthProducer.produceUserGetByEmailEvent.mockResolvedValue(
        JSON.stringify(getUserError),
      );
      isServiceErrorMessageSpy.mockReturnValueOnce(true);

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const createUserError: ServiceErrorMessage = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error from user service',
      };
      mockAuthProducer.produceUserCreateEvent.mockResolvedValue(
        JSON.stringify(createUserError),
      );
      isServiceErrorMessageSpy.mockReturnValueOnce(true);

      await expect(authService.registerUser(body)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});

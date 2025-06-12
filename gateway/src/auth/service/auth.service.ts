import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthProducer } from '../kafka/auth.producer';
import { UserLoginRequest, UserRegisterRequest } from '../dto/auth.request';
import {
  ServiceErrorMessage,
  UserCreatedMessage,
  UserGotByEmailMessage,
  UserLoginResponse,
  UserRegisterResponse,
} from '../dto/auth.response';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { ExceptionWrapper } from 'src/common/utils/status.util';
import { Environment } from 'src/common/type/environment.type';
import { ProviderInjector } from 'src/common/const/provider.const';
import { JwtService } from '@nestjs/jwt';
import { Claims } from 'src/common/utils/jwt.util';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ProviderInjector.ENV_PROVIDER)
    private readonly environment: Environment,
    private readonly authProducer: AuthProducer,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(body: UserRegisterRequest): Promise<UserRegisterResponse> {
    const getUserResponse = await this.authProducer.produceUserGetByEmailEvent({
      email: body.email,
    });
    const getUserError = plainToInstance(ServiceErrorMessage, getUserResponse);
    if (getUserError.message) {
      if (getUserError.code != HttpStatus.NOT_FOUND.valueOf()) {
        throw ExceptionWrapper(getUserError);
      }
    } else {
      throw new ConflictException('Email is already used');
    }
    const createUserResponse = await this.authProducer.produceUserCreateEvent({
      email: body.email,
      password: await bcrypt.hash(body.password, 12),
    });
    const createUserError = plainToInstance(
      ServiceErrorMessage,
      createUserResponse,
    );
    if (createUserError.message) {
      throw ExceptionWrapper(createUserError);
    }
    const data = plainToInstance(UserCreatedMessage, createUserResponse);
    return {
      id: data.id,
    };
  }

  async loginUser(body: UserLoginRequest): Promise<UserLoginResponse> {
    const getUserResponse = await this.authProducer.produceUserGetByEmailEvent({
      email: body.email,
    });
    const getUserError = plainToInstance(ServiceErrorMessage, getUserResponse);
    if (getUserError.message) {
      if (getUserError.code == HttpStatus.NOT_FOUND.valueOf()) {
        throw new UnauthorizedException('Email or password is incorrect');
      }
      if (getUserError.code != HttpStatus.NOT_FOUND.valueOf()) {
        throw ExceptionWrapper(getUserError);
      }
    }
    const getUserData = plainToInstance(UserGotByEmailMessage, getUserResponse);
    if (!(await bcrypt.compare(body.password, getUserData.password))) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    const claims: Claims = {
      id: getUserData.id,
      email: getUserData.email,
      version: getUserData.tokenVersion,
    };
    const accessToken = await this.jwtService.signAsync(claims);
    const refreshToken = await this.jwtService.signAsync(claims, {
      expiresIn: this.environment.REFRESH_TOKEN_EXPIRES,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}

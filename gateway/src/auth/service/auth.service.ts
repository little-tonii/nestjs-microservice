import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthProducer } from '../kafka/auth.producer';
import { UserRegisterRequest } from '../dto/auth.request';
import {
  ServiceErrorMessage,
  UserCreatedMessage,
  UserRegisterResponse,
} from '../dto/auth.response';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { ExceptionWrapper } from 'src/common/utils/status.util';

@Injectable()
export class AuthService {
  constructor(private readonly authProducer: AuthProducer) {}

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
}

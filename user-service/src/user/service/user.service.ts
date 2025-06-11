import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import {
  UserCreateMessage,
  UserGetByEmailMessage,
} from '../payload/user.request';
import {
  ServiceErrorMessage,
  UserCreatedMessage,
  UserGotByEmailMessage,
} from '../payload/user.response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUserByEmail(
    payload: UserGetByEmailMessage,
  ): Promise<UserGotByEmailMessage | ServiceErrorMessage> {
    try {
      const user = await this.userRepository.findOneBy({
        email: payload.email,
      });
      if (user) {
        return {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        } as UserGotByEmailMessage;
      } else {
        return {
          message: 'User not found',
          code: HttpStatus.NOT_FOUND,
        } as ServiceErrorMessage;
      }
    } catch (e) {
      return {
        message: e instanceof Error ? e.message : String(e),
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      } as ServiceErrorMessage;
    }
  }

  async createUser(
    payload: UserCreateMessage,
  ): Promise<UserCreatedMessage | ServiceErrorMessage> {
    try {
      const newUser = await this.userRepository.save({
        email: payload.email,
        password: payload.password,
      });
      return {
        id: newUser.id,
      } as UserCreatedMessage;
    } catch (e) {
      return {
        message: e instanceof Error ? e.message : String(e),
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      } as ServiceErrorMessage;
    }
  }
}

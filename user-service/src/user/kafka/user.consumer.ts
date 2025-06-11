import { Controller } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  UserCreateMessage,
  UserGetByEmailMessage,
} from '../payload/user.request';
import { KafkaMessage } from 'src/common/const/kafka.const';
import {
  ServiceErrorMessage,
  UserCreatedMessage,
  UserGotByEmailMessage,
} from '../payload/user.response';

@Controller()
export class UserConsumer {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(KafkaMessage.USER_GET_BY_EMAIL_REQUEST)
  async handleUserGetByEmailEvent(
    @Payload() payload: UserGetByEmailMessage,
  ): Promise<UserGotByEmailMessage | ServiceErrorMessage> {
    return await this.userService.findUserByEmail(payload);
  }

  @MessagePattern(KafkaMessage.USER_CREATE_REQUEST)
  async handleCreateUserEvent(
    @Payload() payload: UserCreateMessage,
  ): Promise<UserCreatedMessage | ServiceErrorMessage> {
    return await this.userService.createUser(payload);
  }
}

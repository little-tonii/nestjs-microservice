import {
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ServiceErrorMessage } from 'src/auth/dto/auth.response';

export function ExceptionWrapper(error: ServiceErrorMessage) {
  switch (error.code) {
    case HttpStatus.NOT_FOUND.valueOf():
      return new NotFoundException(error.message);
    case HttpStatus.INTERNAL_SERVER_ERROR.valueOf():
      return new InternalServerErrorException(error.message);
    default:
      return new InternalServerErrorException('No status code match');
  }
}

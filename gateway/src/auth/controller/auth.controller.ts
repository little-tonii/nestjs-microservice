import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserRegisterRequest } from '../dto/auth.request';
import { UserRegisterResponse } from '../dto/auth.response';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: UserRegisterResponse })
  @HttpCode(HttpStatus.CREATED)
  @ApiBadRequestResponse({ type: BadRequestException })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorException })
  async regsiter(
    @Body() body: UserRegisterRequest,
  ): Promise<UserRegisterResponse> {
    return await this.authService.registerUser(body);
  }
}

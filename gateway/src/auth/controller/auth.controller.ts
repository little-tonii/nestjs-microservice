import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserLoginRequest, UserRegisterRequest } from '../dto/auth.request';
import { UserLoginResponse, UserRegisterResponse } from '../dto/auth.response';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from 'src/common/utils/exception-filter.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: UserRegisterResponse })
  @HttpCode(HttpStatus.CREATED)
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  async regsiter(
    @Body() body: UserRegisterRequest,
  ): Promise<UserRegisterResponse> {
    return await this.authService.registerUser(body);
  }

  @Post('login')
  @ApiOkResponse({ type: UserLoginResponse })
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ type: ErrorResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  async login(@Body() body: UserLoginRequest): Promise<UserLoginResponse> {
    return await this.authService.loginUser(body);
  }
}

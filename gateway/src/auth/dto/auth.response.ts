import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserRegisterResponse {
  @ApiProperty()
  id: number;
}

export class UserLoginResponse {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  token_type: string;
}

export class GetUserInfoResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetAccessTokenResponse {
  @ApiProperty()
  accessToken: string;
}

export class UserGotByEmailMessage {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  password: string;

  @IsNumber()
  tokenVersion: number;

  @IsString()
  @IsOptional()
  refreshToken: string | null;
}

export class UserCreatedMessage {
  @IsNumber()
  id: number;
}

export class ServiceErrorMessage {
  @IsString()
  message: string;

  @IsNumber()
  code: number;
}

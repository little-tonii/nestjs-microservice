import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserRegisterResponse {
  @ApiProperty()
  id: number;
}

export class UserLoginResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
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

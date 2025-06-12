import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class UserRegisterRequest {
  @IsEmail()
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @Length(8)
  @ApiProperty()
  password: string;
}

export class UserLoginRequest {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class UserCreateMessage {
  email: string;
  password: string;
}

export class UserGetByEmailMessage {
  email: string;
}

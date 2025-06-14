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
  username: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  grant_type: string = 'password';
}

export class UserCreateMessage {
  email: string;
  password: string;
}

export class UserGetByEmailMessage {
  email: string;
}

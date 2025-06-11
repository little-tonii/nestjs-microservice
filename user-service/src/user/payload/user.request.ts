import { IsEmail, IsString } from 'class-validator';

export class UserCreateMessage {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UserGetByEmailMessage {
  @IsEmail()
  @IsString()
  email: string;
}

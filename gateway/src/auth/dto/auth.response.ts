import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class UserRegisterResponse {
  @ApiProperty()
  id: number;
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

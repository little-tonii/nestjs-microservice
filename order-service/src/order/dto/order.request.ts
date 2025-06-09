import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateOrderRequest {
  @IsString()
  @ApiProperty()
  information: string;
}

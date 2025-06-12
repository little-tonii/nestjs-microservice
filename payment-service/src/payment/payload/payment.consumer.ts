import { IsNumber, IsString } from 'class-validator';

export class OrderCreatedMessage {
  @IsNumber()
  id: number;

  @IsString()
  information: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderResponse {
  @ApiProperty()
  id: number;
}

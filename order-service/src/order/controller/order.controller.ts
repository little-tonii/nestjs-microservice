import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { CreateOrderRequest } from '../dto/order.request';
import { CreateOrderResponse } from '../dto/order.response';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('Orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiBody({ type: CreateOrderRequest })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CreateOrderResponse })
  async createOrder(
    @Body() body: CreateOrderRequest,
  ): Promise<CreateOrderResponse> {
    return await this.orderService.createOrder(body);
  }
}

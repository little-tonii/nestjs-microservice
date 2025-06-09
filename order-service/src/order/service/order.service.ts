import { Repository } from 'typeorm';
import { OrderEntity } from '../entity/order.entity';
import { Injectable } from '@nestjs/common';
import { OrderProducer } from '../message/order.producer';
import { CreateOrderRequest } from '../dto/order.request';
import { CreateOrderResponse } from '../dto/order.response';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from '../entity/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly orderProducer: OrderProducer,
  ) {}

  async createOrder(body: CreateOrderRequest): Promise<CreateOrderResponse> {
    const newOrder = await this.orderRepository.save({
      information: body.information,
    });
    this.orderProducer.produceOrderCreatedEvent({
      id: newOrder.id,
      information: newOrder.information,
    });
    return {
      id: newOrder.id,
    };
  }

  async confirmOrder(orderId: number): Promise<void> {
    await this.orderRepository.update(orderId, {
      status: OrderStatus.CONFIRMED,
    });
    // after 5s set status to delivered
    setTimeout(() => {
      void this.orderRepository.update(orderId, {
        status: OrderStatus.DELIVERED,
      });
    }, 5000);
  }

  async cancelOrder(orderId: number): Promise<void> {
    await this.orderRepository.update(orderId, {
      status: OrderStatus.CANCELLED,
    });
  }
}

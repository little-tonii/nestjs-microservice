import { Repository } from 'typeorm';
import { OrderEntity } from '../entity/order.entity';
import { Injectable } from '@nestjs/common';
import { OrderProducer } from '../kafka/order.producer';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from '../entity/order-status.enum';
import {
  CreateOrderMessage,
  PaymentFailureMessage,
  PaymentSuccessMessage,
} from '../payload/order.consumer';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly orderProducer: OrderProducer,
  ) {}

  async createOrder(payload: CreateOrderMessage): Promise<void> {
    // const newOrder = await this.orderRepository.save({
    //   information: body.information,
    // });
    // this.orderProducer.produceOrderCreatedEvent({
    //   id: newOrder.id,
    //   information: newOrder.information,
    // });
  }

  async confirmOrder(payload: PaymentSuccessMessage): Promise<void> {
    await this.orderRepository.update(payload.orderId, {
      status: OrderStatus.CONFIRMED,
    });
    // after 5s set status to delivered
    setTimeout(() => {
      void this.orderRepository.update(payload.orderId, {
        status: OrderStatus.DELIVERED,
      });
    }, 5000);
  }

  async cancelOrder(payload: PaymentFailureMessage): Promise<void> {
    await this.orderRepository.update(payload.orderId, {
      status: OrderStatus.CANCELLED,
    });
  }
}

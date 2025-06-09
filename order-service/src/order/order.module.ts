import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { OrderService } from './service/order.service';
import { OrderProducer } from './message/order.producer';
import { OrderController } from './controller/order.controller';
import { OrderConsumer } from './message/order.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  providers: [OrderService, OrderProducer],
  controllers: [OrderController, OrderConsumer],
})
export class OrderModule {}

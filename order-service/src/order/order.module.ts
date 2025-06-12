import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { OrderService } from './service/order.service';
import { OrderProducer } from './kafka/order.producer';
import { OrderConsumer } from './kafka/order.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  providers: [OrderService, OrderProducer],
  controllers: [OrderConsumer],
})
export class OrderModule {}

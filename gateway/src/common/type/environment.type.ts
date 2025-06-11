export interface Environment {
  SERVER_PORT: number;
  ORDER_SERVICE_HOST: string;
  ORDER_SERVICE_PORT: number;
  PAYMENT_SERVICE_HOST: string;
  PAYMENT_SERVICE_PORT: number;
  USER_SERVICE_HOST: string;
  USER_SERVICE_PORT: number;
  KAFKA_BROKER_HOST_1: string;
  KAFKA_BROKER_PORT_1: number;
  KAFKA_CLIENT_ID: string;
  KAFKA_GROUP_ID: string;
}

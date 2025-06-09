export interface Environment {
  SERVER_PORT: number;
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  KAFKA_BROKER_HOST_1: string;
  KAFKA_BROKER_PORT_1: number;
  KAFKA_CLIENT_ID: string;
  KAFKA_GROUP_ID: string;
}

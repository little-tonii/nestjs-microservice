export class UserGotByEmailMessage {
  id: number;
  email: string;
  password: string;
  tokenVersion: number;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ServiceErrorMessage {
  message: string;
  code: number;
}

export class UserCreatedMessage {
  id: number;
}

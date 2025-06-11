export class UserGotByEmailMessage {
  id: number;
  email: string;
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

import { ServiceErrorMessage } from 'src/auth/dto/auth.response';

export function isServiceErrorMessage(
  obj: unknown,
): obj is ServiceErrorMessage {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as ServiceErrorMessage).code === 'number' &&
    typeof (obj as ServiceErrorMessage).message === 'string'
  );
}

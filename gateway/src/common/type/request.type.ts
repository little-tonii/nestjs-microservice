import { Request } from 'express';
import { Claims } from '../utils/jwt.util';

export interface RequestWithClaims extends Request {
  claims: Claims;
}

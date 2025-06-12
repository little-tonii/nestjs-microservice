import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyType } from '../utils/jwt.util';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(StrategyType.JWT_REFRESH) {}

@Injectable()
export class JwtAccessGuard extends AuthGuard(StrategyType.JWT_ACCESS) {}

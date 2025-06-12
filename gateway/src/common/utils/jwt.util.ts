import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Environment } from '../type/environment.type';
import { Inject, Injectable } from '@nestjs/common';
import { ProviderInjector } from '../const/provider.const';

export interface Claims {
  id: number;
  email: string;
  version: number;
}

export enum StrategyType {
  JWT_REFRESH = 'jwt-refresh',
  JWT_ACCESS = 'jwt',
}

@Injectable()
export class JwtAcessStrategy extends PassportStrategy(
  Strategy,
  StrategyType.JWT_ACCESS,
) {
  constructor(
    @Inject(ProviderInjector.ENV_PROVIDER)
    private readonly environment: Environment,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.JWT_ACCESS_SECRET,
    });
  }

  validate(payload: Claims): Claims {
    return payload;
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  StrategyType.JWT_REFRESH,
) {
  constructor(
    @Inject(ProviderInjector.ENV_PROVIDER)
    private readonly environment: Environment,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.JWT_REFRESH_SECRET,
    });
  }

  validate(payload: Claims): Claims {
    return payload;
  }
}

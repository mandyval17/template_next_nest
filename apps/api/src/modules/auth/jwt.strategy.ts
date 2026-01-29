import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { tokenPayloadSchema } from './auth.schemas';
import { AuthService } from './auth.service';

function extractFromCookieOrBearer(req: Request): string | null {
  const token = req?.cookies?.[AuthService.accessCookieName()];
  if (token) return token;
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req) ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly auth: AuthService,
  ) {
    super({
      jwtFromRequest: extractFromCookieOrBearer,
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET') ?? 'access-secret',
    });
  }

  async validate(payload: unknown) {
    const parsed = tokenPayloadSchema.safeParse(payload);
    if (!parsed.success) throw new UnauthorizedException('Invalid token payload');
    if (parsed.data.type !== 'access') throw new UnauthorizedException('Invalid token type');
    const user = await this.auth.me(parsed.data.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}

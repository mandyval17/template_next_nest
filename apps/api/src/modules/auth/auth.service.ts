import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type ms from 'ms';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthTokensResult, TokenPayload, User } from './auth.schemas';
import type { LoginDto, RegisterDto } from './dto';

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';
const SALT_ROUNDS = 10;
const USED_REFRESH_MAX = 50_000;
const usedRefreshTokens = new Map<string, string>();

function markTokenUsed(token: string, userId: string): void {
  if (usedRefreshTokens.size >= USED_REFRESH_MAX) usedRefreshTokens.clear();
  usedRefreshTokens.set(token, userId);
}

function parseExpiresToMs(expires: string): number {
  const n = parseInt(expires, 10);
  if (expires.endsWith('d')) return n * 24 * 60 * 60 * 1000;
  if (expires.endsWith('h')) return n * 60 * 60 * 1000;
  if (expires.endsWith('m')) return n * 60 * 1000;
  return n * 1000;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) { }

  async register(dto: RegisterDto): Promise<User> {
    const { email, password } = dto;
    try {
      const user = await this.prisma.user.create({
        data: { email, passwordHash: await bcrypt.hash(password, SALT_ROUNDS) },
      });
      return { id: user.id, email: user.email };
    } catch (error) {
      const prismaError = error as { code?: string; meta?: { target?: string[] } };
      if (prismaError?.code === 'P2002') {
        throw new BadRequestException('Email already registered');
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Registration failed',
      );
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    return { id: user.id, email: user.email };
  }

  async login(dto: LoginDto): Promise<AuthTokensResult> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const access = this.issueAccess(user.id, user.email);
    const refresh = await this.issueAndStoreRefresh(user.id);
    const accessMaxAgeMs = parseExpiresToMs(this.config.get<string>('JWT_ACCESS_EXPIRES') ?? '15m');
    const refreshMaxAgeMs = parseExpiresToMs(
      this.config.get<string>('JWT_REFRESH_EXPIRES') ?? '7d',
    );
    return {
      user: { id: user.id, email: user.email },
      accessToken: access,
      refreshToken: refresh.token,
      accessMaxAgeMs,
      refreshMaxAgeMs,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.revokeAllRefreshTokensForUser(userId);
  }

  private async revokeAllRefreshTokensForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }

  async refresh(refreshToken: string | null | undefined): Promise<AuthTokensResult> {
    if (!refreshToken) throw new UnauthorizedException('No refresh token');
    const userIdFromReuse = usedRefreshTokens.get(refreshToken);
    if (userIdFromReuse) {
      usedRefreshTokens.delete(refreshToken);
      await this.revokeAllRefreshTokensForUser(userIdFromReuse);
      throw new UnauthorizedException('Refresh token reused; all sessions revoked');
    }
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored)
        await this.prisma.refreshToken.delete({ where: { id: stored.id } }).catch(() => { });
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    await this.prisma.refreshToken.delete({ where: { id: stored.id } });
    markTokenUsed(refreshToken, stored.userId);
    const user: User = { id: stored.user.id, email: stored.user.email };
    const access = this.issueAccess(user.id, user.email);
    const next = await this.issueAndStoreRefresh(user.id);
    const accessMaxAgeMs = parseExpiresToMs(this.config.get<string>('JWT_ACCESS_EXPIRES') ?? '15m');
    const refreshMaxAgeMs = parseExpiresToMs(
      this.config.get<string>('JWT_REFRESH_EXPIRES') ?? '7d',
    );
    return {
      user,
      accessToken: access,
      refreshToken: next.token,
      accessMaxAgeMs,
      refreshMaxAgeMs,
    };
  }

  async me(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  private issueAccess(userId: string, email: string): string {
    const payload: TokenPayload = { sub: userId, email, type: 'access' };
    const expiresIn =
      (this.config.get<string>('JWT_ACCESS_EXPIRES') ?? '15m') as ms.StringValue;
    return this.jwt.sign(payload, { expiresIn });
  }

  private async issueAndStoreRefresh(userId: string) {
    const expiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES') ?? '7d';
    const refreshMaxAgeMs = parseExpiresToMs(expiresIn);
    const expiresAt = new Date(Date.now() + refreshMaxAgeMs);
    const token = randomUUID();
    await this.prisma.refreshToken.create({
      data: { token, userId, expiresAt },
    });
    return { token, expiresAt };
  }

  static accessCookieName(): string {
    return ACCESS_COOKIE;
  }

  static refreshCookieName(): string {
    return REFRESH_COOKIE;
  }
}

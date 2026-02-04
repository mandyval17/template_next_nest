import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ZodSerializerDto } from 'nestjs-zod';
import { AuthService } from './auth.service';
import { authCookieOptions, clearAuthCookieOptions } from './cookie.util';
import { LoginDto, MeResponseDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';

const ACCESS = AuthService.accessCookieName();
const REFRESH = AuthService.refreshCookieName();

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) { }

  @Post('register')
  @ZodSerializerDto(MeResponseDto)
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.login(dto);
    res.cookie(ACCESS, result.accessToken, authCookieOptions(result.accessMaxAgeMs));
    res.cookie(REFRESH, result.refreshToken, authCookieOptions(result.refreshMaxAgeMs));
    return { user: result.user };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: Request & { user?: { id: string } },
    @Res({ passthrough: true }) res: Response,
  ) {
    if (req.user?.id) await this.auth.logout(req.user.id);
    res.cookie(ACCESS, '', clearAuthCookieOptions());
    res.cookie(REFRESH, '', clearAuthCookieOptions());
    return { ok: true };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.refresh(req.cookies?.[REFRESH]);
    res.cookie(ACCESS, result.accessToken, authCookieOptions(result.accessMaxAgeMs));
    res.cookie(REFRESH, result.refreshToken, authCookieOptions(result.refreshMaxAgeMs));
    return { user: result.user };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ZodSerializerDto(MeResponseDto)
  async me(@Req() req: Request & { user?: { id: string; email: string } }) {
    if (!req.user) throw new UnauthorizedException();
    return this.auth.me(req.user.id);
  }
}

const BASE = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'lax' as const,
  path: '/',
  ...(process.env['COOKIE_DOMAIN'] && { domain: process.env['COOKIE_DOMAIN'] }),
};

export function authCookieOptions(maxAgeMs: number) {
  return { ...BASE, maxAge: maxAgeMs };
}

export function clearAuthCookieOptions() {
  return { ...BASE, maxAge: 0 };
}

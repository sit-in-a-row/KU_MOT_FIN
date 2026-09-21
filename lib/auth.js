import crypto from 'node:crypto';

export const ADMIN_SESSION_COOKIE = 'ku_admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

// 로컬 개발(next dev)에서만 사용하는 임시 관리자 계정이다.
// production/Vercel에서는 절대 사용되지 않고, 반드시 환경변수를 설정해야 한다.
const DEV_ADMIN_USERNAME = 'finance';
const DEV_ADMIN_PASSWORD = 'finance1234';
const DEV_SESSION_SECRET = 'ku-finance-local-dev-session-secret-only';

function isDevelopment() {
  return process.env.NODE_ENV !== 'production';
}

function resolvedAuthConfig() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;

  if (username && password && secret) {
    return {
      configured: true,
      usingDevFallback: false,
      username,
      password,
      secret,
    };
  }

  if (isDevelopment()) {
    return {
      configured: true,
      usingDevFallback: true,
      username: DEV_ADMIN_USERNAME,
      password: DEV_ADMIN_PASSWORD,
      secret: DEV_SESSION_SECRET,
    };
  }

  return {
    configured: false,
    usingDevFallback: false,
    username: '',
    password: '',
    secret: '',
  };
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a ?? ''));
  const right = Buffer.from(String(b ?? ''));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function getAuthStatus() {
  const config = resolvedAuthConfig();
  return {
    configured: config.configured,
    usingDevFallback: config.usingDevFallback,
  };
}

export function authIsConfigured() {
  return resolvedAuthConfig().configured;
}

export function validateAdminCredentials(username, password) {
  const config = resolvedAuthConfig();
  if (!config.configured) return false;
  return safeEqual(username, config.username) && safeEqual(password, config.password);
}

function sign(encodedPayload) {
  const config = resolvedAuthConfig();
  if (!config.configured) throw new Error('Auth environment variables are not configured.');
  return crypto
    .createHmac('sha256', config.secret)
    .update(encodedPayload)
    .digest('base64url');
}

export function createSessionToken(username) {
  const config = resolvedAuthConfig();
  if (!config.configured) throw new Error('Auth environment variables are not configured.');
  const payload = {
    username,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token) {
  const config = resolvedAuthConfig();
  if (!config.configured || !token) return null;
  const [encoded, signature] = String(token).split('.');
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  if (!safeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload?.username || !payload?.exp) return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;
    if (!safeEqual(payload.username, config.username)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};

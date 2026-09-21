import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  authIsConfigured,
  createSessionToken,
  sessionCookieOptions,
  validateAdminCredentials,
} from '../../../../lib/auth';

export async function POST(request) {
  if (!authIsConfigured()) {
    return NextResponse.json(
      { ok: false, message: '관리자 로그인 환경변수가 설정되지 않았습니다.' },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: '잘못된 요청입니다.' }, { status: 400 });
  }

  const username = String(body?.username ?? '').trim();
  const password = String(body?.password ?? '');

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.json({ ok: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, username });
  response.cookies.set(ADMIN_SESSION_COOKIE, createSessionToken(username), sessionCookieOptions);
  return response;
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, getAuthStatus, verifySessionToken } from '../../../../lib/auth';

export async function GET() {
  const authStatus = getAuthStatus();
  if (!authStatus.configured) {
    return NextResponse.json({
      authenticated: false,
      configured: false,
      usingDevFallback: false,
      username: null,
    });
  }

  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);
  return NextResponse.json({
    authenticated: Boolean(session),
    configured: true,
    usingDevFallback: authStatus.usingDevFallback,
    username: session?.username ?? null,
  });
}

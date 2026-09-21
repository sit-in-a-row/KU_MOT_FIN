'use client';

import { useEffect, useState } from 'react';

export default function LoginControl() {
  const [session, setSession] = useState({
    authenticated: false,
    configured: true,
    usingDevFallback: false,
    username: null,
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function refreshSession() {
    try {
      const response = await fetch('/api/auth/session', { cache: 'no-store' });
      const data = await response.json();
      setSession(data);
    } catch {
      setSession({ authenticated: false, configured: true, usingDevFallback: false, username: null });
    }
  }

  useEffect(() => {
    refreshSession();
  }, []);

  async function login(e) {
    e.preventDefault();
    if (!session.configured) return;

    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.message || '로그인에 실패했습니다.');
        return;
      }
      setSession((prev) => ({ ...prev, authenticated: true, username: data.username }));
      setForm({ username: '', password: '' });
      setOpen(false);
      window.dispatchEvent(new Event('ku-auth-changed'));
    } catch {
      setError('로그인 요청 중 오류가 발생했습니다.');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setSession((prev) => ({ ...prev, authenticated: false, username: null }));
      setBusy(false);
      window.dispatchEvent(new Event('ku-auth-changed'));
    }
  }

  function openLogin() {
    setError('');
    if (session.usingDevFallback) {
      setForm({ username: 'finance', password: '' });
    }
    setOpen(true);
  }

  return (
    <>
      {session.authenticated ? (
        <div className="admin-login-state">
          <span className="admin-badge">관리자</span>
          <button className="nav-login-button" type="button" onClick={logout} disabled={busy}>로그아웃</button>
        </div>
      ) : (
        <button className="nav-login-button" type="button" onClick={openLogin}>로그인</button>
      )}

      {open && (
        <div className="modal-backdrop" onMouseDown={() => setOpen(false)}>
          <div className="modal auth-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="auth-kicker">ADMINISTRATOR</div>
            <h3>재무국 관리자 로그인</h3>
            <p className="help auth-description">관리자 계정으로 로그인하면 공지사항 등록 기능이 활성화된다.</p>

            {session.usingDevFallback && (
              <div className="auth-dev-note">
                로컬 테스트 계정 <strong>finance</strong> / <strong>finance1234</strong>
              </div>
            )}

            {!session.configured ? (
              <div className="auth-error">
                운영 서버의 관리자 환경변수가 설정되지 않았다. Vercel에 ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET을 등록해야 한다.
              </div>
            ) : (
              <form onSubmit={login}>
                <div className="field">
                  <label htmlFor="admin-username">아이디</label>
                  <input id="admin-username" autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
                </div>
                <div className="field" style={{ marginTop: 14 }}>
                  <label htmlFor="admin-password">비밀번호</label>
                  <input id="admin-password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
                {error && <div className="auth-error">{error}</div>}
                <div className="form-actions">
                  <button className="btn btn-red" type="submit" disabled={busy}>{busy ? '확인 중…' : '로그인'}</button>
                  <button className="btn btn-muted" type="button" onClick={() => setOpen(false)}>취소</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

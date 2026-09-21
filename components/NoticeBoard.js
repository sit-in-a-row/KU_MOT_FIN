'use client';

import { useEffect, useMemo, useState } from 'react';

const seedNotices = [
  { id: 'seed-1', title: '재무국 포털 시범 운영 안내', category: '공지', author: '재무국', date: '2026-09-21', body: '식대지원 및 비용지급요청 기능을 한 곳에서 확인할 수 있도록 시범 페이지를 개설했습니다.' },
  { id: 'seed-2', title: '식대지원 신청 시 증빙자료 첨부 안내', category: '안내', author: '재무국', date: '2026-09-21', body: '영수증 사진과 참석인원 사진을 각각 첨부해 주세요.' },
];

export default function NoticeBoard() {
  const [notices, setNotices] = useState(seedNotices);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ title: '', category: '공지', body: '' });

  async function refreshAuth() {
    try {
      const response = await fetch('/api/auth/session', { cache: 'no-store' });
      const data = await response.json();
      setIsAdmin(Boolean(data?.authenticated));
      if (!data?.authenticated) setOpen(false);
    } catch {
      setIsAdmin(false);
      setOpen(false);
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('ku-finance-notices');
    if (saved) {
      try { setNotices(JSON.parse(saved)); } catch {}
    }
    refreshAuth();
    window.addEventListener('ku-auth-changed', refreshAuth);
    return () => window.removeEventListener('ku-auth-changed', refreshAuth);
  }, []);

  const sorted = useMemo(() => [...notices].sort((a,b) => b.date.localeCompare(a.date)), [notices]);

  function persist(next) {
    setNotices(next);
    localStorage.setItem('ku-finance-notices', JSON.stringify(next));
  }

  function addNotice(e) {
    e.preventDefault();
    if (!isAdmin || !form.title.trim() || !form.body.trim()) return;
    const today = new Date().toISOString().slice(0,10);
    const next = [{ id: crypto.randomUUID(), title: form.title.trim(), category: form.category, author: '재무국', date: today, body: form.body.trim() }, ...notices];
    persist(next);
    setForm({ title: '', category: '공지', body: '' });
    setOpen(false);
  }

  return (
    <>
      <div className="section-title-row">
        <div>
          <h2 className="section-title">재무국 공지사항</h2>
          <p className="section-desc">비용 지급, 식대 지원 등 재무국 공지사항 한눈에 모아보기</p>
        </div>
        {isAdmin && <button className="btn btn-outline" onClick={() => setOpen(true)}>+ 공지 등록</button>}
      </div>
      <div className="notice-card">
        <table className="notice-table">
          <thead><tr><th>구분</th><th>제목</th><th>작성자</th><th>등록일</th></tr></thead>
          <tbody>
            {sorted.map(n => (
              <tr key={n.id} onClick={() => setSelected(n)} style={{cursor:'pointer'}}>
                <td><span className="notice-tag">{n.category}</span></td>
                <td>{n.title}</td><td>{n.author}</td><td>{n.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && isAdmin && <div className="modal-backdrop" onMouseDown={() => setOpen(false)}>
        <div className="modal" onMouseDown={e => e.stopPropagation()}>
          <h3>공지사항 등록</h3>
          <form onSubmit={addNotice}>
            <div className="field"><label>구분</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>공지</option><option>안내</option><option>중요</option></select></div>
            <div className="field" style={{marginTop:14}}><label>제목</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="공지 제목" /></div>
            <div className="field" style={{marginTop:14}}><label>내용</label><textarea value={form.body} onChange={e=>setForm({...form,body:e.target.value})} placeholder="공지 내용을 입력하세요." /></div>
            <div className="form-actions"><button className="btn btn-red" type="submit">등록</button><button className="btn btn-muted" type="button" onClick={()=>setOpen(false)}>취소</button></div>
          </form>
        </div>
      </div>}

      {selected && <div className="modal-backdrop" onMouseDown={() => setSelected(null)}>
        <div className="modal" onMouseDown={e=>e.stopPropagation()}>
          <span className="notice-tag">{selected.category}</span>
          <h3 style={{marginTop:12}}>{selected.title}</h3>
          <div className="help" style={{marginBottom:18}}>{selected.author} · {selected.date}</div>
          <div style={{whiteSpace:'pre-wrap', lineHeight:1.8}}>{selected.body}</div>
          <div className="form-actions"><button className="btn btn-muted" onClick={()=>setSelected(null)}>닫기</button></div>
        </div>
      </div>}
    </>
  );
}

'use client';

import { useMemo, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { makeBandPostText } from '../../lib/band';

export default function MealSupportPage() {
  const [form, setForm] = useState({ date:'', participants:'', amount:'', bank:'', account:'', holder:'' });
  const [receipt, setReceipt] = useState(null);
  const [people, setPeople] = useState(null);
  const [status, setStatus] = useState('');
  const bandText = useMemo(() => makeBandPostText(form), [form]);

  const onFile = (setter) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return setter(null);
    setter({ file, url: URL.createObjectURL(file) });
  };

  async function saveDraft(e) {
    e.preventDefault();
    const payload = { ...form, receiptName: receipt?.file?.name || '', participantsPhotoName: people?.file?.name || '', createdAt: new Date().toISOString() };
    const drafts = JSON.parse(localStorage.getItem('ku-meal-drafts') || '[]');
    drafts.unshift(payload);
    localStorage.setItem('ku-meal-drafts', JSON.stringify(drafts));
    setStatus('임시저장 완료: 현재 브라우저에 저장했다. 사진 자체는 브라우저 보안상 파일명만 기록된다.');
  }

  async function copyBandText() {
    await navigator.clipboard.writeText(bandText);
    setStatus('BAND 게시용 문구를 클립보드에 복사했다.');
  }

  async function tryBandPublish() {
    setStatus('');
    const res = await fetch('/api/band/publish', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, text: bandText }) });
    const data = await res.json();
    setStatus(data.message || 'BAND 연동 설정이 필요하다.');
  }

  return <div className="site-shell">
    <Header />
    <section className="subhero"><div className="subhero-inner"><a className="back-link" href="/">← 홈으로</a><h1>식대지원</h1><p>필요 정보를 입력하면 재무국 검토용 기록과 BAND 게시 형식을 동시에 준비한다.</p></div></section>
    <main className="main">
      <div className="panel">
        <form onSubmit={saveDraft}>
          <div className="form-grid">
            <div className="field"><label>일시</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required /></div>
            <div className="field"><label>금액</label><input type="number" min="0" inputMode="numeric" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="예: 48000" required /></div>
            <div className="field full"><label>대상</label><input value={form.participants} onChange={e=>setForm({...form,participants:e.target.value})} placeholder="예: 16기 홍길동, 16기 김고려, 15기 이안암" required /><div className="help">BAND에 그대로 들어갈 참석자 표기를 입력한다.</div></div>
            <div className="field"><label>은행</label><input value={form.bank} onChange={e=>setForm({...form,bank:e.target.value})} placeholder="예: 신한은행" required /></div>
            <div className="field"><label>예금주</label><input value={form.holder} onChange={e=>setForm({...form,holder:e.target.value})} placeholder="예: 홍길동" required /></div>
            <div className="field full"><label>계좌번호</label><input value={form.account} onChange={e=>setForm({...form,account:e.target.value})} placeholder="숫자 및 하이픈 입력" required /></div>
            <div className="field full">
              <label>증빙 사진</label>
              <div className="upload-grid">
                <div className="upload-box"><strong>영수증 사진</strong><div className="help" style={{margin:'5px 0 10px'}}>JPG, PNG 등 이미지 파일</div><input type="file" accept="image/*" onChange={onFile(setReceipt)} required />{receipt && <img className="preview" src={receipt.url} alt="영수증 미리보기" />}</div>
                <div className="upload-box"><strong>참석인원 사진</strong><div className="help" style={{margin:'5px 0 10px'}}>참석인원 확인이 가능한 사진</div><input type="file" accept="image/*" onChange={onFile(setPeople)} required />{people && <img className="preview" src={people.url} alt="참석인원 미리보기" />}</div>
              </div>
            </div>
          </div>
          <div className="form-actions"><button className="btn btn-red" type="submit">임시저장</button><button className="btn btn-outline" type="button" onClick={copyBandText}>BAND 문구 복사</button><button className="btn btn-muted" type="button" onClick={tryBandPublish}>BAND 전송 테스트</button></div>
          {status && <div className="status info">{status}</div>}
        </form>
        <div className="band-preview"><label>BAND 게시 미리보기</label><pre>{bandText}</pre><div className="help" style={{marginTop:12}}>추후 BAND API access token과 band_key를 서버 환경변수로 설정하면, 현재의 “BAND 전송 테스트” 버튼을 실제 게시 기능으로 전환할 수 있다.</div></div>
      </div>
    </main>
    <Footer />
  </div>;
}

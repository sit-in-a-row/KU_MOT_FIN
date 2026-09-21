import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NoticeBoard from '../components/NoticeBoard';

export default function Home() {
  return (
    <div className="site-shell">
      <Header />
      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow">KOREA UNIVERSITY · GRADUATE STUDENT COUNCIL</div>
          <h1>고려대학교 기술경영전문대학원</h1>
          <h2>17대 원우회 재무국</h2>
          <p>재무국 공지사항 확인 및 식대지원, 비용지급 요청 등을 위한 페이지입니다.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/meal-support">식대지원 신청</Link>
            <a className="btn btn-ghost" href="https://docs.google.com/forms/d/e/1FAIpQLSeIh2es3oVLrQslJRJvYXLysQLnt2BNDD59EqZBNIyX7Kc8uw/viewform" target="_blank" rel="noopener noreferrer">비용지급요청 ↗</a>
          </div>
        </div>
      </section>
      <main className="main">
        <section className="section" id="notice"><NoticeBoard /></section>
        <section className="section">
          <div className="section-title-row"><div><h2 className="section-title">비용 지급 요청</h2></div></div>
          <div className="grid-two">
            <div className="feature"><div className="feature-index">01</div><h3>식대지원</h3><p>
              지급일: 익월 10일 이내 지급 <br/>
              - 10일 이내 지급 불가 시 단체방 공지<br/>
              - MOT BAND 연동 (추후 API키 신청한거 나오면 연동해놓겠습니당)
 </p><Link className="btn btn-red" href="/meal-support">신청 작성하기</Link></div>
            <div className="feature"><div className="feature-index">02</div><h3>기타 비용지급요청</h3><p>
              <strong>★ 영수증은 품목 혹은 가맹점이 보이게 캡처하셔서 첨부해 주세요. ★<br/></strong>
              지급일 : 신청 익월 첫 번째 주 일요일 이내<br/>
              - 원우회 운영과 관련하여 사업비를 지출하신 경우<br/>
              - 경조사비 지원을 신청하는 경우<br/>
              </p><a className="btn btn-outline" href="https://docs.google.com/forms/d/e/1FAIpQLSeIh2es3oVLrQslJRJvYXLysQLnt2BNDD59EqZBNIyX7Kc8uw/viewform" target="_blank" rel="noopener noreferrer">요청서 열기 ↗</a></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

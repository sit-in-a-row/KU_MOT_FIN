import Header from '../../components/Header';
import Footer from '../../components/Footer';

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeIh2es3oVLrQslJRJvYXLysQLnt2BNDD59EqZBNIyX7Kc8uw/viewform';

export default function PaymentRequestPage() {
  return (
    <div className="site-shell">
      <Header />
      <section className="subhero">
        <div className="subhero-inner">
          <a className="back-link" href="/">← 홈으로</a>
          <h1>비용지급요청</h1>
          <p>비용 지급 요청은 기존 Google 설문지를 통해 접수한다.</p>
        </div>
      </section>
      <main className="main">
        <section className="external-form-card">
          <div className="external-form-kicker">GOOGLE FORM</div>
          <h2>비용지급요청서 작성</h2>
          <p>
            아래 버튼을 누르면 기존 비용지급요청 Google 설문지로 이동한다.
            설문 작성과 증빙자료 첨부는 Google 페이지에서 진행한다.
          </p>
          <a
            className="btn btn-red external-form-button"
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            비용지급요청서 열기 ↗
          </a>
          <div className="help external-form-help">새 탭에서 Google 설문지가 열린다.</div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

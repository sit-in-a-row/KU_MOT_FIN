import Link from 'next/link';
import LoginControl from './LoginControl';

export default function Header() {
  return (
    <>
      <div className="topline" />
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="홈으로 이동">
            <img
              className="brand-logo"
              src="/ku-mot-logo.png"
              alt="고려대학교 기술경영전문대학원"
            />
            <div className="brand-office">
              <div className="brand-title">17대 원우회</div>
              <div className="brand-sub">재무국</div>
            </div>
          </Link>
          <nav className="nav">
            <Link href="/#notice">공지사항</Link>
            <Link href="/meal-support">식대지원</Link>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeIh2es3oVLrQslJRJvYXLysQLnt2BNDD59EqZBNIyX7Kc8uw/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >비용지급요청 ↗</a>
            <LoginControl />
          </nav>
        </div>
      </header>
    </>
  );
}

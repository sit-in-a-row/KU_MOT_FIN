import './globals.css';

export const metadata = {
  title: '고려대학교 대학원 원우회 재무국',
  description: '재무국 공지 및 지원 요청 포털',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

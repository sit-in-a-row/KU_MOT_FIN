export async function POST(request) {
  const body = await request.json();
  const accessToken = process.env.BAND_ACCESS_TOKEN;
  const bandKey = process.env.BAND_KEY;

  if (!accessToken || !bandKey) {
    return Response.json({
      ok: false,
      configured: false,
      message: '현재는 BAND API 미설정 상태다. BAND_ACCESS_TOKEN과 BAND_KEY를 설정하면 이 라우트에서 실제 게시 API를 호출하도록 확장할 수 있다.',
      preview: body.text || ''
    }, { status: 200 });
  }

  // 실제 BAND API 연동 시 이 구간에 서버 측 요청을 구현한다.
  // access token은 절대 브라우저 코드에 노출하지 않는다.
  return Response.json({
    ok: false,
    configured: true,
    message: 'BAND 환경변수는 설정되어 있으나 실제 게시 호출은 아직 비활성화되어 있다. API 발급 후 endpoint/권한을 확인해 이 부분만 연결하면 된다.'
  }, { status: 501 });
}

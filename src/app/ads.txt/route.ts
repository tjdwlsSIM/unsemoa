/**
 * /ads.txt — 애드센스가 "이 도메인의 광고 판매자"를 확인하는 파일. 없으면 애드센스 대시보드에
 * "수익 손실 위험" 경고가 뜨고 광고 단가가 떨어진다. 퍼블리셔 ID env 하나에서 만들어 어긋날 일이 없다.
 */
export const dynamic = "force-static";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export function GET() {
  if (!CLIENT) return new Response("Not Found", { status: 404 });
  // ca-pub-123 → pub-123. f08c47fec0942fa0은 구글의 고정 인증 ID
  return new Response(`google.com, ${CLIENT.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

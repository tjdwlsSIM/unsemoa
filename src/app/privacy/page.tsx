import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${site.name}의 개인정보 처리 방침과 광고 쿠키 안내.`,
  alternates: { canonical: "/privacy" },
};

const EFFECTIVE = "2026년 9월 29일";

// 애드센스 정책상 "구글 등 제3자가 쿠키로 광고를 게재한다"는 고지와 해제 방법 안내가 반드시 있어야 한다.
const SECTIONS: { heading: string; body: ReactNode[] }[] = [
  {
    heading: "1. 수집하는 정보",
    body: [
      `${site.name}는 회원가입이 없고, 이름·연락처 같은 개인정보를 받지 않습니다.`,
      "사주·궁합에 입력한 생년월일과 태어난 시간은 주소창(URL)에 담겨 그 자리에서 계산에만 쓰이며, 서버나 데이터베이스에 저장하지 않습니다.",
      "'내 띠로 저장'을 누르면 고른 띠 하나가 이용자 기기의 브라우저 저장소(localStorage)에만 기록됩니다. 이 값은 서버로 전송되지 않으며 브라우저 데이터를 지우면 함께 사라집니다.",
    ],
  },
  {
    heading: "2. 자동으로 남는 기록",
    body: [
      "사이트를 운영하는 호스팅 서버에는 보안과 장애 대응을 위해 접속 시각, IP 주소, 브라우저 종류, 요청한 주소가 일정 기간 자동으로 기록될 수 있습니다. 요청한 주소에는 입력한 생년월일이 포함될 수 있습니다.",
      "결과 페이지의 주소를 공유하면 받는 사람도 같은 생년월일을 보게 됩니다. 공유 전에 확인해 주세요.",
    ],
  },
  {
    heading: "3. 광고와 쿠키",
    body: [
      "이 사이트는 Google 애드센스로 광고를 게재합니다. Google을 비롯한 제3자 광고 공급업체는 쿠키를 사용해 이용자가 이 사이트나 다른 사이트를 방문한 기록을 바탕으로 광고를 보여줄 수 있습니다.",
      <>
        Google의 광고 쿠키 사용 방식은{" "}
        <a href="https://policies.google.com/technologies/ads?hl=ko" className="text-plum underline" rel="noopener" target="_blank">
          Google 광고 정책
        </a>
        에서 확인할 수 있습니다.
      </>,
      <>
        맞춤 광고를 원하지 않으면{" "}
        <a href="https://adssettings.google.com" className="text-plum underline" rel="noopener" target="_blank">
          Google 광고 설정
        </a>
        에서 끌 수 있고, 다른 제3자 공급업체의 쿠키는{" "}
        <a href="https://www.aboutads.info/choices/" className="text-plum underline" rel="noopener" target="_blank">
          aboutads.info
        </a>
        에서 해제할 수 있습니다. 브라우저 설정에서 쿠키를 차단해도 사이트의 운세 기능은 그대로 이용할 수 있습니다.
      </>,
    ],
  },
  {
    heading: "4. 방침의 변경",
    body: [`이 방침은 ${EFFECTIVE}부터 적용됩니다. 내용이 바뀌면 이 페이지에 먼저 알립니다.`],
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">개인정보처리방침</h1>
      <p className="mt-2 text-[13px] text-muted">시행일 {EFFECTIVE}</p>
      <div className="mt-8 space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-xl font-bold">{s.heading}</h2>
            <div className="mt-3 space-y-3">
              {s.body.map((p, i) => (
                <p key={i} className="leading-loose">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

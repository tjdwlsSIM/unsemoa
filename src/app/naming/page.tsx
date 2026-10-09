import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이름풀이 · 작명",
  description: "이름에 담긴 오행의 기운과 수리를 풀어보는 이름풀이. 운세모아에서 곧 만나보실 수 있습니다.",
  alternates: { canonical: "/naming" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="text-5xl">✍️</p>
      <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">이름풀이 · 작명</h1>
      <p className="mt-3 text-base leading-relaxed text-muted">
        이름의 한자 획수로 보는 수리(數理)와 발음에 담긴 오행을 사주와 맞춰보는 기능입니다. 지금 준비 중입니다.
      </p>
      <p className="mx-auto mt-6 max-w-sm rounded-2xl border border-line bg-card shadow-sm px-4 py-4 text-base leading-relaxed text-muted">
        이름풀이는 사주의 부족한 오행을 이름으로 보완한다는 관점에서 출발합니다. 먼저{" "}
        <Link href="/saju" className="text-plum underline">
          사주팔자 풀이
        </Link>
        로 내게 어떤 기운이 부족한지부터 확인해 보세요.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-night min-h-11 px-5 py-2.5 text-base font-semibold text-white hover:bg-night-2"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}

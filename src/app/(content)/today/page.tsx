import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import FortuneDetail, { ScoreStars } from "@/components/FortuneDetail";
import { SignMark } from "@/components/marks";
import ShareButtons from "@/components/ShareButtons";
import { type Tti, formatKoreanDate, fortuneMood, getAllDailyFortunes, luckyOf, todayKST } from "@/lib/fortune";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const date = todayKST();
  return {
    title: `오늘의 운세 (${date})`,
    description: `${formatKoreanDate(date)} 띠별·별자리별 오늘의 운세. 총운, 애정운, 금전운, 직장운, 건강운과 행운의 색·숫자까지 무료로 확인하세요.`,
    alternates: { canonical: "/today" },
  };
}

export default function TodayPage() {
  const date = todayKST();
  const tti = getAllDailyFortunes("tti", date);
  const zodiac = getAllDailyFortunes("zodiac", date);
  const best = luckyOf(tti);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="text-center">
        <p className="text-sm text-plum">{formatKoreanDate(date)}</p>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">오늘의 운세</h1>
        <p className="mt-2 text-base leading-relaxed text-muted">
          열두 띠와 열두 별자리의 오늘 흐름입니다. 매일 자정에 새로 바뀝니다.
        </p>
        <p
          className="mx-auto mt-4 flex max-w-sm items-center justify-center gap-3 rounded-2xl px-4 py-2 text-base"
          style={{ background: `${(best.sign as Tti).color}55` }}
        >
          <SignMark sign={best.sign} kind="tti" size={56} mood="happy" />
          <span>
            오늘의 행운의 띠는 <b>{best.sign.name}</b>
          </span>
        </p>
      </header>

      {/* 띠 요약 — 원하는 띠로 바로 점프 */}
      <nav aria-label="띠 바로가기" className="mt-6" data-tti-list>
        <ul className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
          {tti.map((f) => (
            <li key={f.sign.id}>
              <a
                href={`#${f.sign.id}`}
                className="flex flex-col items-center rounded-2xl border border-line bg-card px-1 py-2 text-[13px] shadow-sm transition-colors hover:border-plum-light"
              >
                <SignMark sign={f.sign} kind="tti" size={44} mood={fortuneMood(f.score)} />
                <span className="font-medium">{f.sign.name}</span>
                <ScoreStars score={f.score} />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} />

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold">띠별 오늘의 운세</h2>
        <div className="mt-4 space-y-4">
          {tti.map((f, i) => (
            <div key={f.sign.id}>
              <FortuneDetail f={f} />
              {i === 5 && <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID} />}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-xl font-bold">별자리별 오늘의 운세</h2>
          <Link href="/horoscope" className="inline-flex min-h-11 items-center text-base font-medium text-plum hover:underline">
            자세히 →
          </Link>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {zodiac.map((f) => (
            <li key={f.sign.id}>
              <Link
                href={`/horoscope/${f.sign.id}`}
                className="flex h-full flex-col rounded-2xl border border-line bg-card shadow-sm p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="flex items-center gap-2 font-semibold whitespace-nowrap">
                    <SignMark sign={f.sign} kind="zodiac" size={36} />
                    {f.sign.name}
                  </span>
                  <ScoreStars score={f.score} />
                </div>
                <p className="mt-2 text-base leading-relaxed text-muted">{f.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <ShareButtons title={`오늘의 운세 (${date})`} text="운세모아에서 오늘의 운세를 확인해 보세요." />
      </div>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} />

      <section className="mt-10 rounded-2xl border border-line bg-card shadow-sm p-5">
        <h2 className="font-display text-lg font-bold">운세를 더 자세히 보고 싶다면</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {[
            { href: "/saju", label: "사주팔자 풀이", desc: "생년월일시로 타고난 기운 보기" },
            { href: "/gunghap", label: "궁합 보기", desc: "두 사람의 인연 확인하기" },
            { href: "/tarot", label: "타로점", desc: "카드가 알려주는 오늘의 답" },
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block rounded-lg bg-paper p-3 transition-colors hover:bg-night/5">
                <span className="text-sm font-semibold">{l.label}</span>
                <span className="mt-0.5 block text-[13px] text-muted">{l.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

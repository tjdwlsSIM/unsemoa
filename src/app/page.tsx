import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import Animal from "@/components/Animal";
import { ScoreStars, tint } from "@/components/FortuneDetail";
import { MenuIcon, ZodiacGlyph } from "@/components/marks";
import { MyTtiCard } from "@/components/MyTti";
import {
  TTI,
  type Tti,
  cardYears,
  dayIndex,
  formatKoreanDate,
  fortuneMood,
  getAllDailyFortunes,
  luckyOf,
  todayKST,
  type DailyFortune,
} from "@/lib/fortune";
import { GUIDE } from "@/lib/guide";
import { nav, site } from "@/lib/site";

// 날짜가 바뀌면 새로 생성 (KST 자정 이후 첫 요청 기준)
export const revalidate = 3600;

/** 행운 동물의 말풍선 — 인사만. 운세 결과는 말풍선 밖 텍스트로 전한다. */
const GREETINGS = [
  "안녕하세요! 오늘도 반가워요.",
  "좋은 아침이에요. 오늘 하루도 힘내요!",
  "어서 오세요. 차 한잔하고 가요.",
  "오늘 하루, 제 기운 조금 나눠 드릴게요.",
  "반가워요! 천천히 둘러보세요.",
];

/** 저장된 "내 띠" 카드 — 12띠 모두 여기서 만들고 MyTtiCard가 하나만 보여 준다 */
function MyCard({ f }: { f: DailyFortune }) {
  const t = f.sign as Tti;
  return (
    <section className="mx-auto max-w-5xl px-4 pt-6" aria-label="내 띠 오늘의 운세">
      <Link
        href={`/tti/${t.id}`}
        className="flex items-center gap-3 rounded-2xl border-2 bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
        style={{ borderColor: t.color }}
      >
        <Animal id={t.id} mood={fortuneMood(f.score)} size={80} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-plum">★ 내 띠</p>
          <p className="flex flex-wrap items-center gap-x-2 font-display text-xl">
            {t.name} 오늘의 운세 <ScoreStars score={f.score} />
          </p>
          <p className="mt-1 line-clamp-2 text-base leading-relaxed text-muted">{f.summary}</p>
        </div>
        <span aria-hidden className="shrink-0 text-xl text-plum">
          →
        </span>
      </Link>
    </section>
  );
}

export default function Home() {
  const date = todayKST();
  const tti = getAllDailyFortunes("tti", date);
  const zodiac = getAllDailyFortunes("zodiac", date);
  const best = luckyOf(tti);
  const greeting = GREETINGS[dayIndex(date) % GREETINGS.length];

  return (
    <>
      {/* 히어로 — 오늘의 행운 동물 */}
      <section className="bg-gradient-to-b from-[#fff1d6] to-transparent">
        <div className="mx-auto grid max-w-5xl items-center gap-6 px-4 py-8 sm:grid-cols-[auto_1fr] sm:gap-10 sm:py-12">
          <div className="flex flex-col items-center">
            <p className="relative rounded-2xl border-2 border-night bg-card px-4 py-2 text-base font-medium shadow-sm after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-night after:content-['']">
              {greeting}
            </p>
            <div className="mt-3 motion-safe:animate-pop">
              <Animal id={best.sign.id as Tti["id"]} mood="happy" size={180} priority />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-base text-plum">{formatKoreanDate(date)}</p>
            <h1 className="mt-1 font-display text-xl">
              오늘의 운세, <span className="text-plum">{site.name}</span>에서
            </h1>
            <p className="mt-2 font-display text-3xl leading-snug sm:text-4xl">
              오늘의 행운 동물은 <span className="whitespace-nowrap">{best.sign.name}</span>
            </p>
            <div className="mt-2 flex justify-center sm:justify-start">
              <ScoreStars score={best.score} size="lg" />
            </div>
            <p className="mt-3 text-base leading-relaxed">{best.summary}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Link
                href="/saju"
                className="inline-flex min-h-11 items-center rounded-full bg-gold px-5 py-2.5 text-base font-semibold text-night hover:bg-gold-light"
              >
                내 사주 무료로 보기
              </Link>
              <Link
                href="/today"
                className="inline-flex min-h-11 items-center rounded-full border-2 border-night/15 bg-card px-5 py-2.5 text-base font-semibold hover:border-night/40"
              >
                오늘의 운세 전체보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MyTtiCard cards={Object.fromEntries(tti.map((f) => [f.sign.id, <MyCard key={f.sign.id} f={f} />]))} />

      {/* 내 띠 고르기 */}
      <section className="mx-auto max-w-6xl px-4 pt-4 pb-6" aria-labelledby="pick-tti">
        <h2 id="pick-tti" className="font-display text-2xl">
          내 띠 고르기
        </h2>
        <p className="mt-1 text-base text-muted">
          태어난 해의 동물을 누르면 오늘의 띠 운세로 이동합니다. 거기서 &lsquo;내 띠로 저장&rsquo;을 누르면 다음부터 이
          화면 맨 위에 바로 떠요.
        </p>
        <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 xl:grid-cols-12">
          {TTI.map((t) => (
            <li key={t.id}>
              <Link
                href={`/tti/${t.id}`}
                className="flex h-full flex-col items-center rounded-2xl px-1 pt-1 pb-2 text-center transition-colors hover:bg-cream"
              >
                <Animal id={t.id} size={64} />
                <span className="text-base font-semibold">{t.name}</span>
                <span className="text-[13px] leading-snug whitespace-nowrap text-muted">{cardYears(t, date, [13, 48])}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto max-w-5xl px-4">
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} />
      </div>

      {/* 오늘의 띠별 운세 */}
      {/* 구역 배경을 번갈아 깔아 어디서 구역이 바뀌는지 보이게 */}
      <div className="border-y border-line bg-cream/70">
        <section className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl">오늘의 띠별 운세</h2>
              <p className="mt-1 text-base text-muted">12지신으로 보는 오늘의 흐름</p>
            </div>
            <Link href="/today" className="inline-flex min-h-11 items-center text-base font-medium text-plum hover:underline">
              전체보기 →
            </Link>
          </div>

          <ul className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {tti.map((f) => (
              <li key={f.sign.id}>
                <Link
                  href={`/tti/${f.sign.id}`}
                  className="block h-full rounded-2xl border border-line border-t-[6px] bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                  style={tint((f.sign as Tti).color)}
                >
                  <div className="flex items-center gap-2">
                    <Animal id={f.sign.id as Tti["id"]} mood={fortuneMood(f.score)} size={64} />
                    <div className="min-w-0">
                      <p className="font-semibold">{f.sign.name}</p>
                      <ScoreStars score={f.score} />
                    </div>
                  </div>
                  <p className="mt-1 text-[13px] text-muted">{cardYears(f.sign as Tti, date)}</p>
                  <p className="mt-2 line-clamp-3 text-base leading-relaxed text-muted">{f.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 별자리 */}
      <section className="mx-auto max-w-5xl px-4 pb-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-xl font-bold sm:text-2xl">오늘의 별자리 운세</h2>
          <Link href="/horoscope" className="inline-flex min-h-11 items-center text-base font-medium text-plum hover:underline">
            전체보기 →
          </Link>
        </div>
        <ul className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {zodiac.map((f) => (
            <li key={f.sign.id}>
              <Link
                href={`/horoscope/${f.sign.id}`}
                className="flex h-full flex-col items-center rounded-2xl border border-line bg-card shadow-sm px-2 py-3 text-center transition-colors hover:border-plum-light"
              >
                <ZodiacGlyph symbol={f.sign.emoji} size={40} />
                <span className="mt-1 text-sm font-medium">{f.sign.name}</span>
                <span className="text-[13px] text-muted">{f.sign.period}</span>
                <ScoreStars score={f.score} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto max-w-5xl px-4">
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID} />
      </div>

      {/* 카테고리 */}
      {/* 구역 배경을 번갈아 깔아 어디서 구역이 바뀌는지 보이게 */}
      <div className="border-y border-line bg-cream/70">
        <section className="mx-auto max-w-5xl px-4 py-6">
          <h2 className="font-display text-xl font-bold sm:text-2xl">운세 전체 메뉴</h2>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex h-full flex-col rounded-2xl border border-line bg-card shadow-sm p-4 transition-colors hover:border-plum-light"
                >
                  <MenuIcon href={item.href} size={44} />
                  <span className="mt-2 font-semibold">{item.label}</span>
                  <span className="mt-1 text-[13px] leading-relaxed text-muted">{item.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 운세 사전 */}
      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-bold sm:text-2xl">운세 사전</h2>
            <p className="mt-1 text-sm text-muted">오행·십신·만세력, 용어부터 알고 보기</p>
          </div>
          <Link href="/guide" className="inline-flex min-h-11 items-center text-base font-medium text-plum hover:underline">
            전체보기 →
          </Link>
        </div>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {GUIDE.slice(0, 4).map((g) => (
            <li key={g.slug}>
              <Link href={`/guide/${g.slug}`} className="flex h-full flex-col rounded-2xl border border-line bg-card shadow-sm p-4 hover:border-plum-light">
                <span className="text-xl">{g.emoji}</span>
                <span className="mt-1.5 font-semibold">{g.title}</span>
                <span className="mt-1 text-[13px] leading-relaxed text-muted">{g.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* SEO용 소개 문단 */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border border-line bg-card shadow-sm p-5">
          <h2 className="font-display text-lg font-bold">운세모아는 어떤 곳인가요?</h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            운세모아는 사주팔자, 오늘의 운세, 띠별·별자리 운세, 타로점, 궁합 풀이를 한 곳에서 무료로 볼 수 있는 종합 운세
            사이트입니다. 생년월일시를 입력하면 만세력으로 천간지지를 계산해 사주를 풀이하고, 12지신과 12별자리를 기준으로
            매일 새로운 운세를 안내합니다. 절기를 기준으로 연주와 월주를 계산하기 때문에 입춘 전후에 태어난 분들의 사주도
            정확하게 나옵니다.
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted">
            오행·십신·만세력 같은 용어가 낯설다면{" "}
            <Link href="/guide" className="text-plum underline">
              운세 사전
            </Link>
            에서 개념부터 확인해 보세요. 모든 운세는 전통 명리학과 점성술 해석을 바탕으로 한 참고용 정보입니다.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4">
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} />
      </div>
    </>
  );
}

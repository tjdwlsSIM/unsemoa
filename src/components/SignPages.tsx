import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import FortuneDetail, { ScoreStars, signColor, tint } from "@/components/FortuneDetail";
import { SignMark } from "@/components/marks";
import { SaveMyTti } from "@/components/MyTti";
import ShareButtons from "@/components/ShareButtons";
import {
  type SignKind,
  type Tti,
  TTI,
  cardYears,
  formatKoreanDate,
  fortuneMood,
  getAllDailyFortunes,
  getDailyFortune,
  getYearFortunes,
  yearLabel,
  signs,
  todayKST,
} from "@/lib/fortune";

/** 띠/별자리 목록 페이지 — /tti, /horoscope가 공유한다. */
export function SignListPage({ kind, title, intro }: { kind: SignKind; title: string; intro: string }) {
  const date = todayKST();
  const list = getAllDailyFortunes(kind, date);
  const base = kind === "tti" ? "/tti" : "/horoscope";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="text-center">
        <p className="text-sm text-plum">{formatKoreanDate(date)}</p>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mx-auto mt-2 max-w-md text-base leading-relaxed text-muted">{intro}</p>
      </header>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} />

      <ul className="mt-6 grid gap-2 sm:grid-cols-2" data-tti-list={kind === "tti" || undefined}>
        {list.map((f) => (
          <li key={f.sign.id}>
            <Link
              href={`${base}/${f.sign.id}`}
              className="flex h-full flex-col rounded-2xl border border-line border-t-[6px] bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              style={tint(signColor(f))}
            >
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="flex items-center gap-2 font-semibold whitespace-nowrap">
                  <SignMark sign={f.sign} kind={kind} size={64} mood={fortuneMood(f.score)} />
                  {f.sign.name}
                </span>
                <ScoreStars score={f.score} />
              </div>
              <p className="mt-0.5 text-[13px] text-muted">
                {f.sign.period}
                {kind === "tti" && ` · ${cardYears(f.sign as Tti, date)}`}
              </p>
              <p className="mt-2 text-base leading-relaxed text-muted">{f.summary}</p>
            </Link>
          </li>
        ))}
      </ul>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} />
    </div>
  );
}

/** 띠/별자리 상세 페이지 — /tti/[id], /horoscope/[id]가 공유한다. */
export function SignDetailPage({ kind, id }: { kind: SignKind; id: string }) {
  const date = todayKST();
  const sign = signs(kind).find((s) => s.id === id)!;
  const f = getDailyFortune(sign, kind, date);
  const base = kind === "tti" ? "/tti" : "/horoscope";
  const others = signs(kind).filter((s) => s.id !== id);
  const tti = kind === "tti" ? (TTI.find((t) => t.id === id) as Tti) : null;
  const yearFortunes = tti ? getYearFortunes(tti, date) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-[13px] text-muted">
        <Link href={base} className="inline-flex min-h-11 items-center hover:underline">
          {kind === "tti" ? "띠별 운세" : "별자리 운세"}
        </Link>
        <span className="mx-1">›</span>
        <span>{sign.name}</span>
      </nav>

      <header className="mt-4 text-center">
        <div className="flex justify-center motion-safe:animate-pop">
          <SignMark sign={sign} kind={kind} size={140} mood={fortuneMood(f.score)} priority />
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{sign.name} 오늘의 운세</h1>
        <p className="mt-1 text-sm text-plum">{formatKoreanDate(date)}</p>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted">{sign.trait}.</p>
        {tti && <SaveMyTti id={tti.id} />}
      </header>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} />

      <div className="mt-6">
        <FortuneDetail f={f} headingLevel={2} />
      </div>

      {yearFortunes.length > 0 && (
        <section className="mt-6 rounded-2xl border border-line bg-card shadow-sm p-5">
          <h2 className="font-display text-lg font-bold">년생별 오늘의 운세</h2>
          <ul className="mt-3 divide-y divide-line">
            {yearFortunes.map((y) => (
              <li key={y.year} className="py-3 text-base leading-relaxed">
                <b className="text-plum">{yearLabel(y.year)}</b> — {y.text}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8">
        <ShareButtons title={`${sign.name} 오늘의 운세`} text={f.summary} />
      </div>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} />

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold">다른 {kind === "tti" ? "띠" : "별자리"} 운세도 보기</h2>
        <ul className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {others.map((s) => (
            <li key={s.id}>
              <Link
                href={`${base}/${s.id}`}
                className="flex flex-col items-center rounded-2xl border border-line bg-card px-1 py-2 text-[13px] shadow-sm transition-colors hover:border-plum-light"
              >
                <SignMark sign={s} kind={kind} size={44} />
                <span className="mt-0.5 text-center font-medium">{s.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-line bg-card shadow-sm p-5">
        <h2 className="font-display text-lg font-bold">더 정확하게 보고 싶다면</h2>
        <p className="mt-2 text-base leading-relaxed text-muted">
          {kind === "tti" ? "띠" : "별자리"} 운세는 태어난 해(또는 달)만으로 보는 큰 흐름입니다. 생년월일시를 모두 넣어 계산하는{" "}
          <Link href="/saju" className="text-plum underline">
            사주팔자 풀이
          </Link>
          로 보면 나에게만 해당하는 기운을 훨씬 자세히 확인할 수 있습니다.
        </p>
      </section>
    </div>
  );
}

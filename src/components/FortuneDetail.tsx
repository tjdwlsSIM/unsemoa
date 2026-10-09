import { SignMark } from "@/components/marks";
import { type DailyFortune, type Tti, cardYears, fortuneMood } from "@/lib/fortune";

/** 띠는 대표 파스텔, 별자리는 금색 계열 */
export const signColor = (f: Pick<DailyFortune, "kind" | "sign">) => (f.kind === "tti" ? (f.sign as Tti).color : "#e8ce8b");

/** 카드 바탕 — 위쪽에 대표색을 옅게 번지게 깐다. 흰 카드만 늘어서면 밋밋해서. */
export const tint = (color: string) => ({
  borderTopColor: color,
  background: `linear-gradient(170deg, ${color}40, var(--color-card) 50%)`,
});

export function ScoreStars({ score, size = "sm" }: { score: number; size?: "sm" | "lg" }) {
  return (
    // 좁은 카드에선 숫자가 별 아래로 내려가도록 wrap
    <span
      role="img"
      aria-label={`운세 점수 5점 만점에 ${score}점`}
      className="inline-flex shrink-0 flex-wrap items-center justify-center gap-x-1 whitespace-nowrap"
    >
      <span aria-hidden className={`leading-none text-gold ${size === "lg" ? "text-2xl" : "text-base"}`}>
        {"★".repeat(score)}
        <span className="text-line">{"★".repeat(5 - score)}</span>
      </span>
      <span aria-hidden className={`font-semibold text-night-2 ${size === "lg" ? "text-base" : "text-[13px]"}`}>
        {score}/5
      </span>
    </span>
  );
}

const FIELDS = [
  { key: "love", label: "애정운", emoji: "💗" },
  { key: "money", label: "금전운", emoji: "💰" },
  { key: "work", label: "직장·학업운", emoji: "💼" },
  { key: "health", label: "건강운", emoji: "🌿" },
] as const;

/** 오늘의 운세 상세 카드. /today · /tti/[id] · /horoscope/[id]가 같이 쓴다. */
export default function FortuneDetail({ f, headingLevel = 3 }: { f: DailyFortune; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <article
      id={f.sign.id}
      className="scroll-mt-32 overflow-hidden rounded-2xl border border-line border-t-[6px] bg-card p-5 shadow-sm"
      style={tint(signColor(f))}
    >
      <header className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
        <SignMark sign={f.sign} kind={f.kind} size={84} mood={fortuneMood(f.score)} />
        <div className="min-w-0 flex-1">
          <H className="font-display text-xl">{f.sign.name}</H>
          <ScoreStars score={f.score} size="lg" />
          <p className="mt-0.5 text-[13px] text-muted">
            {f.sign.period}
            {f.kind === "tti" && (
              <>
                {" · "}
                <span className="whitespace-nowrap">{cardYears(f.sign as Tti, f.date)}</span>
              </>
            )}
          </p>
        </div>
      </header>

      <p className="mt-4 leading-relaxed">{f.summary}</p>

      <dl className="mt-4 grid gap-2 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key} className="rounded-lg bg-paper/80 p-3">
            <dt className="text-[13px] font-semibold text-plum">
              {field.emoji} {field.label}
            </dt>
            <dd className="mt-1 text-base leading-relaxed text-muted">{f[field.key]}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-4 flex flex-wrap gap-1.5 text-[13px]">
        {[
          `행운의 색 ${f.luckyColor}`,
          `행운의 숫자 ${f.luckyNumber}`,
          `행운의 물건 ${f.luckyItem}`,
          `가면 좋은 곳 ${f.luckyPlace}`,
        ].map((t) => (
          <li key={t} className="rounded-full bg-night/5 px-2.5 py-1 text-night-2">
            {t}
          </li>
        ))}
      </ul>
    </article>
  );
}

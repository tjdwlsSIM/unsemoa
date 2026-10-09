import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import BirthFields, { type BirthParams, birthLabel, birthParams, birthQuery, parseBirth } from "@/components/BirthFields";
import Animal from "@/components/Animal";
import ShareButtons from "@/components/ShareButtons";
import { gunghapMood, ttiOfJi } from "@/lib/fortune";
import { calcGunghap } from "@/lib/gunghap";
import { site } from "@/lib/site";

const DESCRIPTION =
  "두 사람의 생년월일만 넣으면 띠 궁합(삼합·육합·충·해)과 일간 오행 관계로 연애·결혼 궁합을 풀어 드립니다. 무료 궁합 보기.";

/** 쿼리 → 두 사람 생년월일. 둘 다 유효할 때만 결과 */
async function inputs(searchParams: PageProps<"/gunghap">["searchParams"]) {
  const sp = await searchParams;
  const [pa, pb] = [birthParams(sp, "a"), birthParams(sp, "b")];
  return { pa, pb, a: parseBirth(pa.date, pa.hour, pa.cal, pa.leap), b: parseBirth(pb.date, pb.hour, pb.cal, pb.leap) };
}

// 결과 주소는 공유 미리보기에 "말띠 × 원숭이띠 궁합 81점"과 전용 이미지가 뜨게 한다. 색인은 canonical로 /gunghap 하나.
export async function generateMetadata({ searchParams }: PageProps<"/gunghap">): Promise<Metadata> {
  const base = { description: DESCRIPTION, alternates: { canonical: "/gunghap" } };
  const { a, b } = await inputs(searchParams);
  if (!a || !b) return { ...base, title: "궁합 무료 보기" };
  const g = calcGunghap(a, b);
  const title = `${g.a.animal}띠 × ${g.b.animal}띠 궁합 ${g.score}점`;
  const og = `/gunghap/og?a=${ttiOfJi(g.a.ji).id}&b=${ttiOfJi(g.b.ji).id}&s=${g.score}`;
  return {
    ...base,
    title,
    // openGraph는 레이아웃 값을 통째로 덮어써서 공통 필드도 다시 적는다
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: site.name,
      title,
      description: `${g.grade}. 띠 관계와 일간 오행으로 본 두 사람의 연애·결혼 궁합 풀이를 확인해 보세요.`,
      images: [{ url: og, width: 1200, height: 630, alt: title }],
    },
  };
}

function Form({ pa, pb, className = "mx-auto mt-6 max-w-md" }: { pa: BirthParams; pb: BirthParams; className?: string }) {
  return (
    <form action="/gunghap" method="get" className={`${className} space-y-3`}>
      <BirthFields prefix="a" label="첫 번째 사람" defaults={pa} />
      <BirthFields prefix="b" label="두 번째 사람" defaults={pb} />
      <button
        type="submit"
        className="w-full rounded-full bg-gold px-5 py-3 font-semibold text-night transition-colors hover:bg-gold-light"
      >
        궁합 확인하기
      </button>
      <p className="text-center text-[13px] leading-relaxed text-muted">
        시간을 몰라도 궁합은 나옵니다. 입력한 정보는 어디에도 저장되지 않습니다.
      </p>
    </form>
  );
}

const barColor = (s: number) => (s >= 80 ? "var(--color-gold)" : s >= 65 ? "var(--color-plum-light)" : "var(--color-muted)");

// 결과 예시 — 87년 토끼띠 × 94년 개띠(묘술 육합)를 실제로 계산한 값
const SAMPLE = calcGunghap({ year: 1987, month: 3, day: 10, hour: null }, { year: 1994, month: 8, day: 15, hour: null });

/** 넓은 화면에서 입력 칸 옆을 채우는 "이런 걸 봐 드려요". 휴대폰에선 폼이 먼저라 숨긴다. */
function Preview() {
  const g = SAMPLE;
  return (
    <aside className="hidden rounded-2xl border border-line bg-card p-5 shadow-sm md:block">
      <p className="text-[13px] font-semibold text-plum">결과 예시</p>
      <h2 className="mt-1 font-display text-lg">이런 걸 봐 드려요</h2>
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-paper p-3">
        <div className="flex shrink-0 items-end">
          <Animal id={ttiOfJi(g.a.ji).id} mood={gunghapMood(g.score)} size={52} />
          <Animal id={ttiOfJi(g.b.ji).id} mood={gunghapMood(g.score)} size={52} className="-ml-2 -scale-x-100" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] text-muted">
            {g.a.animal}띠 × {g.b.animal}띠
          </p>
          <p className="font-display text-2xl leading-tight">
            {g.score}
            <span className="text-base">점</span> <span className="text-base">{g.grade}</span>
          </p>
          <p className="text-[13px] text-plum">{g.ji.headline}</p>
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {[
          ["띠 관계", "삼합·육합·충·해·파 중 어디에 해당하는지"],
          ["일간 오행", "두 사람의 타고난 기운이 서로 살리는지 부딪히는지"],
          ["연애할 때와 결혼 후", "처음 끌림부터 오래 가는 힘까지"],
          ["한 가지 조언", "이 조합이 지켜야 할 것 하나"],
        ].map(([k, v]) => (
          <li key={k} className="rounded-lg bg-paper p-2.5">
            <span className="block text-sm font-semibold text-night">{k}</span>
            <span className="text-[13px] text-muted">{v}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default async function GunghapPage({ searchParams }: PageProps<"/gunghap">) {
  const { pa, pb, a, b } = await inputs(searchParams);

  if (!a || !b) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="text-center">
          {/* 토끼와 개 — 묘술(卯戌) 육합, 붙어 있으면 편안한 사이 */}
          <div className="flex items-end justify-center gap-1 motion-safe:animate-pop">
            <Animal id="rabbit" mood="happy" size={100} priority className="-rotate-6" />
            <svg width={32} height={32} viewBox="0 0 48 48" aria-hidden className="mb-12 shrink-0">
              <path
                d="M24 38 C10 29 9 17 16 14 C20 12 24 15 24 19 C24 15 28 12 32 14 C39 17 38 29 24 38 Z"
                fill="#ee8fa5"
                stroke="#3d3553"
                strokeWidth={3}
                strokeLinejoin="round"
              />
            </svg>
            <Animal id="dog" mood="happy" size={100} priority className="rotate-6 -scale-x-100" />
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl">궁합 무료 보기</h1>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted">
            두 사람의 생년월일로 띠 궁합과 일간(日干) 오행 관계를 함께 봅니다. 연애할 때와 결혼했을 때가 어떻게 다른지까지
            풀어 드립니다.
          </p>
        </header>
        {(pa.date || pb.date) && (
          <p className="mx-auto mt-4 max-w-md rounded-lg bg-plum/10 px-4 py-3 text-center text-base text-plum">
            두 사람의 생년월일을 모두 입력해 주세요. 1930년 ~ 2030년 사이만 계산할 수 있습니다.
            {(pa.cal === "lunar" || pb.cal === "lunar") &&
              " 음력은 그 해에 없는 윤달이나, 29일까지인 달의 30일은 계산되지 않습니다."}
          </p>
        )}
        <div className="mt-6 md:grid md:grid-cols-2 md:items-start md:gap-4">
          <Form pa={pa} pb={pb} className="mx-auto max-w-md" />
          <Preview />
        </div>
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} />
        <section className="mt-10 rounded-2xl border border-line bg-card shadow-sm p-5">
          <h2 className="font-display text-lg font-bold">궁합은 무엇을 보나요?</h2>
          <p className="mt-2 text-base leading-relaxed text-muted">
            전통적으로 궁합은 두 사람의 태어난 해가 만드는 지지(地支) 관계를 먼저 봅니다. 서로를 끌어당기는{" "}
            <b>삼합(三合)</b>과 <b>육합(六合)</b>, 부딪히는 <b>충(沖)</b>, 사소하게 어긋나는 <b>해(害)</b>가 대표적입니다.
            여기에 두 사람의 일간이 이루는 <Link href="/guide/ohaeng" className="text-plum underline">오행</Link>의 상생·상극
            관계를 더하면 관계의 결이 훨씬 또렷해집니다.
          </p>
        </section>
      </div>
    );
  }

  const g = calcGunghap(a, b);
  const mood = gunghapMood(g.score);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="text-center">
        {/* 두 사람의 띠 캐릭터가 서로를 바라본다 */}
        <div className="flex items-end justify-center gap-1 motion-safe:animate-pop">
          <div className="-rotate-6">
            <Animal id={ttiOfJi(g.a.ji).id} mood={mood} size={120} priority />
          </div>
          <svg width={40} height={40} viewBox="0 0 48 48" aria-hidden className="mb-14 shrink-0">
            <path
              d="M24 38 C10 29 9 17 16 14 C20 12 24 15 24 19 C24 15 28 12 32 14 C39 17 38 29 24 38 Z"
              fill="#ee8fa5"
              stroke="#3d3553"
              strokeWidth={3}
              strokeLinejoin="round"
            />
          </svg>
          <div className="rotate-6">
            <Animal id={ttiOfJi(g.b.ji).id} mood={mood} size={120} priority className="-scale-x-100" />
          </div>
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">두 사람의 궁합</h1>
        <p className="mt-2 text-base text-muted">
          {g.a.animal}띠 ({a.year}년생) × {g.b.animal}띠 ({b.year}년생)
        </p>
        {(a.lunar || b.lunar) && (
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            {birthLabel(a)}
            <br />
            {birthLabel(b)}
          </p>
        )}

        <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-line bg-card shadow-sm p-6">
          <p className="font-display text-5xl text-night">
            {g.score}
            <span className="text-2xl">점</span>
          </p>
          <p className="mt-2 text-lg font-semibold">{g.grade}</p>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-paper">
            <div className="h-full rounded-full" style={{ width: `${g.score}%`, background: barColor(g.score) }} />
          </div>
        </div>
      </header>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} />

      <section className="mt-6 rounded-2xl border border-line bg-card shadow-sm p-5">
        <p className="text-[13px] font-semibold text-plum">띠 관계</p>
        <h2 className="mt-1 font-display text-xl font-bold">{g.ji.headline}</h2>
        <p className="mt-3 leading-relaxed">{g.ji.detail}</p>
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-card shadow-sm p-5">
        <p className="text-[13px] font-semibold text-plum">일간 관계 · {g.gan.label}</p>
        <h2 className="mt-1 font-display text-xl font-bold">
          {g.a.dayPillar}일주 × {g.b.dayPillar}일주
        </h2>
        <p className="mt-3 leading-relaxed">{g.gan.detail}</p>
      </section>

      <div className="mt-4 space-y-4">
        {g.sections.map((s, i) => (
          <div key={s.title}>
            <section className="rounded-2xl border border-line bg-card shadow-sm p-5">
              <h2 className="font-display text-lg font-bold">{s.title}</h2>
              <p className="mt-2 leading-relaxed">{s.body}</p>
            </section>
            {i === 0 && <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID} />}
          </div>
        ))}
      </div>

      <section className="mt-4 rounded-xl border border-gold bg-gold/5 p-5">
        <h2 className="font-display text-lg font-bold">이 조합을 위한 한 가지 조언</h2>
        <p className="mt-2 leading-relaxed">{g.advice}</p>
      </section>

      <div className="mt-8">
        <ShareButtons title="두 사람의 궁합" text={`${g.score}점 — ${g.grade}`} />
      </div>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} />

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold">다른 궁합도 보기</h2>
        <Form pa={pa} pb={pb} />
      </section>

      <section className="mt-10 rounded-2xl border border-line bg-card shadow-sm p-5">
        <h2 className="font-display text-lg font-bold">이어서 보면 좋은 운세</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            { href: `/saju?${birthQuery(pa)}`, label: "내 사주팔자 보기", desc: "타고난 성격과 오행의 균형" },
            { href: "/tarot", label: "타로점 보기", desc: "이 관계에 대한 카드의 답" },
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

      <p className="mt-8 text-center text-[13px] leading-relaxed text-muted">
        궁합은 두 사람의 관계를 읽는 하나의 참고일 뿐, 인연의 가능성을 단정하지 않습니다.
      </p>
    </div>
  );
}

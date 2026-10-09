import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import BirthFields, { type BirthParams, birthLabel, birthParams, birthQuery, parseBirth } from "@/components/BirthFields";
import Animal from "@/components/Animal";
import ShareButtons from "@/components/ShareButtons";
import { ttiOf, ttiOfJi, zodiacOf } from "@/lib/fortune";
import {
  GAN,
  GAN_HANJA,
  JI,
  JI_HANJA,
  OHAENG,
  OHAENG_COLOR,
  calcSaju,
  ganOhaeng,
  ganSipsin,
  jiOhaeng,
  jiSipsin,
  pillars,
} from "@/lib/saju";
import { DAY_MASTER, OHAENG_MEANING, SIPSIN_DESC, readOhaeng } from "@/lib/sajuText";

const DESCRIPTION =
  "생년월일시를 넣으면 만세력으로 사주팔자(천간지지)를 계산해 드립니다. 일간으로 보는 타고난 성격, 오행의 균형, 십신 분석까지 무료로 확인하세요.";

const inputs = async (searchParams: PageProps<"/saju">["searchParams"]) => {
  const p = birthParams(await searchParams);
  return { p, birth: parseBirth(p.date, p.hour, p.cal, p.leap) };
};

// 결과 주소를 공유하면 미리보기 제목에 일간 풀이가 보이게 한다. 색인은 canonical로 /saju 하나.
export async function generateMetadata({ searchParams }: PageProps<"/saju">): Promise<Metadata> {
  const { birth } = await inputs(searchParams);
  const master = birth && DAY_MASTER[calcSaju(birth).day.gan];
  return {
    title: master ? `나의 사주: ${master.title} — ${master.image}` : "사주팔자 무료 풀이",
    description: DESCRIPTION,
    alternates: { canonical: "/saju" },
  };
}

function Form({ p, className = "mx-auto mt-6 max-w-md" }: { p: BirthParams; className?: string }) {
  return (
    <form action="/saju" method="get" className={className}>
      <BirthFields defaults={p} />
      <button
        type="submit"
        className="mt-4 w-full rounded-full bg-gold px-5 py-3 font-semibold text-night transition-colors hover:bg-gold-light"
      >
        내 사주 풀어보기
      </button>
      <p className="mt-3 text-center text-[13px] leading-relaxed text-muted">
        입력한 정보는 어디에도 저장되지 않습니다. 계산은 주소창의 값만으로 이루어집니다.
      </p>
    </form>
  );
}

// 결과 예시 — 지어낸 표가 아니라 1990년 5월 12일 사시생을 실제로 계산한 값
const SAMPLE = pillars(calcSaju({ year: 1990, month: 5, day: 12, hour: 10 }));

/** 넓은 화면에서 입력 칸 옆을 채우는 "이런 걸 풀어 드려요". 휴대폰에선 폼이 먼저라 숨긴다. */
function Preview() {
  const tile = "mt-1 block rounded-md py-1.5 font-serif text-lg leading-none font-bold text-white";
  return (
    <aside className="hidden rounded-2xl border border-line bg-card p-5 shadow-sm md:block">
      <p className="text-[13px] font-semibold text-plum">결과 예시</p>
      <h2 className="mt-1 font-display text-lg">이런 걸 풀어 드려요</h2>
      <div className="mt-3 grid grid-cols-4 gap-1.5 text-center" aria-hidden>
        {SAMPLE.map(({ label, p }) => (
          <div key={label}>
            <p className="text-[13px] text-muted">{label}</p>
            <span className={tile} style={{ background: OHAENG_COLOR[ganOhaeng(p.gan)] }}>
              {GAN_HANJA[p.gan]}
            </span>
            <span className={tile} style={{ background: OHAENG_COLOR[jiOhaeng(p.ji)] }}>
              {JI_HANJA[p.ji]}
            </span>
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {[
          ["사주팔자 여덟 글자", "만세력으로 계산한 연·월·일·시 기둥"],
          ["타고난 성격", "나를 나타내는 글자, 일간으로 본 성향"],
          ["오행의 균형", "다섯 기운 중 넘치는 것과 모자란 것"],
          ["십신 분석", "주변 글자들이 나와 맺는 관계"],
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

export default async function SajuPage({ searchParams }: PageProps<"/saju">) {
  const { p, birth } = await inputs(searchParams);

  if (!birth) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="text-center">
          {/* 여의주를 품은 용 — 사주로 타고난 기운을 본다는 뜻으로 */}
          <div className="flex justify-center motion-safe:animate-pop">
            <Animal id="dragon" mood="happy" size={112} priority />
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl">사주팔자 무료 풀이</h1>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted">
            태어난 연·월·일·시를 각각 천간과 지지 두 글자로 바꾼 여덟 글자가 사주팔자입니다. 생년월일시를 넣으면 만세력으로
            계산해 드립니다.
          </p>
        </header>
        {p.date && (
          <p className="mx-auto mt-4 max-w-md rounded-lg bg-plum/10 px-4 py-3 text-center text-base text-plum">
            생년월일을 다시 확인해 주세요. 1930년 ~ 2030년 사이만 계산할 수 있습니다.
            {p.cal === "lunar" && " 음력은 그 해에 없는 윤달이나, 29일까지인 달의 30일은 계산되지 않습니다."}
          </p>
        )}
        <div className="mt-6 md:grid md:grid-cols-2 md:items-start md:gap-4">
          <Form p={p} className="mx-auto max-w-md" />
          <Preview />
        </div>
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} />
        <section className="mt-10 rounded-2xl border border-line bg-card shadow-sm p-5">
          <h2 className="font-display text-lg font-bold">사주팔자란?</h2>
          <p className="mt-2 text-base leading-relaxed text-muted">
            사주(四柱)는 네 개의 기둥이라는 뜻으로 태어난 해·달·날·시를 가리키고, 팔자(八字)는 그 네 기둥을 이루는 여덟 글자를
            말합니다. 각 기둥은 하늘의 기운인 천간(天干) 한 글자와 땅의 기운인 지지(地支) 한 글자로 이루어집니다. 이 여덟
            글자에 담긴 <Link href="/guide/ohaeng" className="text-plum underline">오행</Link>의 균형과{" "}
            <Link href="/guide/sipsin" className="text-plum underline">십신</Link>의 관계를 읽어 타고난 성향과 삶의 흐름을
            해석합니다.
          </p>
        </section>
      </div>
    );
  }

  const saju = calcSaju(birth);
  const list = pillars(saju);
  const dayGan = saju.day.gan;
  const master = DAY_MASTER[dayGan];
  const oh = readOhaeng(saju);
  // 사주의 띠는 연지를 따른다. 입춘 전 생일은 양력 연도로 세는 띠와 달라진다.
  const tti = ttiOfJi(saju.year.ji);
  const solarTti = ttiOf(birth.year);
  const ttiDiffers = tti.id !== solarTti.id;
  const zodiac = zodiacOf(birth.month, birth.day);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="text-center">
        <div className="flex justify-center motion-safe:animate-pop">
          <Animal id={tti.id} mood="happy" size={120} priority />
        </div>
        <p className="mt-1 text-base text-plum">{birthLabel(birth)} 생</p>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">나의 사주팔자</h1>
        <p className="mt-2 text-sm text-muted">
          {tti.name} · {zodiac.name} · 일간 {GAN[dayGan]}({GAN_HANJA[dayGan]})
          {birth.hour === null && " · 시주 제외"}
        </p>
        {ttiDiffers && (
          <p className="mx-auto mt-3 max-w-md rounded-lg bg-plum/10 px-4 py-2.5 text-base leading-relaxed text-plum">
            입춘({saju.sajuYear + 1}년 2월 초) 이전에 태어나셔서 사주상 띠는 <b>{tti.name}</b>입니다. 흔히 쓰는 양력 기준으로는{" "}
            {solarTti.name}이지만, 명리학에서는 한 해가 입춘에 바뀌기 때문입니다.{" "}
            <Link href="/guide/jeolgi" className="underline">
              왜 그런가요?
            </Link>
          </p>
        )}
      </header>

      {/* 사주팔자 표 */}
      <section className="mt-6">
        <h2 className="sr-only">사주팔자 여덟 글자</h2>
        <div className={`grid gap-2 ${list.length === 4 ? "grid-cols-4" : "grid-cols-3"}`}>
          {list.map(({ label, p }) => (
            <div key={label} className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm text-center">
              <p className="bg-cream py-1.5 text-[13px] font-semibold text-night">{label}</p>
              <div className="p-2">
                <div
                  className="rounded-lg py-3 text-white"
                  style={{ background: OHAENG_COLOR[ganOhaeng(p.gan)] }}
                  title={`천간 ${GAN[p.gan]} · ${ganOhaeng(p.gan)}`}
                >
                  <span className="block font-serif text-2xl leading-none font-bold">{GAN_HANJA[p.gan]}</span>
                  <span className="mt-1 block text-[13px]">{GAN[p.gan]}</span>
                </div>
                <div
                  className="mt-1.5 rounded-lg py-3 text-white"
                  style={{ background: OHAENG_COLOR[jiOhaeng(p.ji)] }}
                  title={`지지 ${JI[p.ji]} · ${jiOhaeng(p.ji)}`}
                >
                  <span className="block font-serif text-2xl leading-none font-bold">{JI_HANJA[p.ji]}</span>
                  <span className="mt-1 block text-[13px]">{JI[p.ji]}</span>
                </div>
                <p className="mt-2 text-[13px] leading-tight text-muted">
                  {label === "일주" ? "나 자신" : ganSipsin(dayGan, p.gan)}
                  <br />
                  {jiSipsin(dayGan, p.ji)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-[13px] text-muted">
          위가 천간(하늘의 기운), 아래가 지지(땅의 기운)입니다. 색은 오행을 나타냅니다.
        </p>
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} />

      {/* 일간 해석 */}
      <section className="mt-8 rounded-2xl border border-line bg-card shadow-sm p-5">
        <p className="text-[13px] font-semibold text-plum">나를 나타내는 글자 · 일간(日干)</p>
        <h2 className="mt-1 font-display text-xl font-bold">
          {master.title} — {master.image}
        </h2>
        <p className="mt-3 leading-relaxed">{master.personality}</p>
        <dl className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            ["강점", master.strength],
            ["주의할 점", master.weakness],
            ["어울리는 일", master.career],
            ["연애할 때", master.love],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-paper p-3">
              <dt className="text-[13px] font-semibold text-plum">{k}</dt>
              <dd className="mt-1 text-base leading-relaxed text-muted">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 오행 분포 */}
      <section className="mt-6 rounded-2xl border border-line bg-card shadow-sm p-5">
        <h2 className="font-display text-xl font-bold">오행의 균형</h2>
        <ul className="mt-4 space-y-2">
          {OHAENG.map((o) => {
            const n = oh.counts[o];
            return (
              <li key={o} className="flex items-center gap-3">
                <span className="w-6 shrink-0 text-sm font-semibold">{o}</span>
                <span className="h-5 flex-1 overflow-hidden rounded-full bg-paper">
                  <span
                    className="block h-full rounded-full transition-all"
                    style={{ width: `${(n / oh.total) * 100}%`, background: OHAENG_COLOR[o], minWidth: n ? "8%" : 0 }}
                  />
                </span>
                <span className="w-16 shrink-0 text-right text-[13px] text-muted">
                  {n}개 · {OHAENG_MEANING[o].keyword}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 leading-relaxed">{oh.summary}</p>
        <p className="mt-3 rounded-lg bg-paper p-3 text-base leading-relaxed text-muted">{oh.advice}</p>
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID} />

      {/* 십신 */}
      <section className="mt-6 rounded-2xl border border-line bg-card shadow-sm p-5">
        <h2 className="font-display text-xl font-bold">십신(十神) 분석</h2>
        <p className="mt-2 text-base leading-relaxed text-muted">
          일간인 나를 기준으로 나머지 글자들이 어떤 관계에 있는지를 나타냅니다.{" "}
          <Link href="/guide/sipsin" className="text-plum underline">
            십신이 무엇인가요?
          </Link>
        </p>
        <ul className="mt-4 space-y-2">
          {[...new Set(list.flatMap(({ p }) => [ganSipsin(dayGan, p.gan), jiSipsin(dayGan, p.ji)]))].map((s) => (
            <li key={s} className="rounded-lg bg-paper p-3">
              <span className="text-sm font-semibold text-plum">{s}</span>
              <span className="mt-0.5 block text-base leading-relaxed text-muted">{SIPSIN_DESC[s]}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8">
        <ShareButtons title="나의 사주팔자" text={`${master.title} — ${master.image}`} />
      </div>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} />

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold">다른 생년월일로 보기</h2>
        <Form p={p} />
      </section>

      <section className="mt-10 rounded-2xl border border-line bg-card shadow-sm p-5">
        <h2 className="font-display text-lg font-bold">이어서 보면 좋은 운세</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {[
            { href: `/gunghap?${birthQuery({ ...p, hour: undefined }, "a")}`, label: "궁합 보기", desc: "상대 생년월일만 넣으면 끝" },
            { href: `/tti/${tti.id}`, label: `${tti.name} 오늘 운세`, desc: "내 띠의 오늘 흐름" },
            { href: `/horoscope/${zodiac.id}`, label: `${zodiac.name} 오늘 운세`, desc: "내 별자리의 오늘 흐름" },
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
        절기를 기준으로 계산하므로 입춘 이전 생일은 전년도 간지가 적용됩니다.
        <br />본 풀이는 전통 명리학 해석에 따른 참고용 정보입니다.
      </p>
    </div>
  );
}

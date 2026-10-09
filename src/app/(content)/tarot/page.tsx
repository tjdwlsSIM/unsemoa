import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { MenuIcon } from "@/components/marks";
import ShareButtons from "@/components/ShareButtons";
import TarotBoard from "@/components/TarotBoard";
import { type Drawn, MAJOR, SPREAD, meaning, parseSpread } from "@/lib/tarot";

const DESCRIPTION =
  "메이저 아르카나 22장으로 보는 무료 타로점. 카드를 직접 뽑아 과거·현재·미래의 흐름과 정방향·역방향 해석을 확인하세요.";

const cardName = (d: Drawn) => d.card.name + (d.reversed ? "(역)" : "");
const spreadOf = async (sp: PageProps<"/tarot">["searchParams"]) => {
  const { cards } = await sp;
  return parseSpread(typeof cards === "string" ? cards : undefined);
};

// 결과 주소(?cards=…)는 공유 미리보기 제목에 카드 이름이 보이게 한다. 검색 색인은 canonical로 /tarot 하나.
export async function generateMetadata({ searchParams }: PageProps<"/tarot">): Promise<Metadata> {
  const drawn = await spreadOf(searchParams);
  return {
    title: drawn ? `타로점 결과: ${drawn.map(cardName).join(" · ")}` : "무료 타로점",
    description: DESCRIPTION,
    alternates: { canonical: "/tarot" },
  };
}

function Result({ drawn }: { drawn: Drawn[] }) {
  return (
    <div>
      <ol className="grid gap-3 sm:grid-cols-3">
        {drawn.map((d, i) => (
          <li key={d.card.no} className="rounded-2xl border border-line bg-card p-4 text-center shadow-sm">
            <p className="text-[13px] font-semibold text-plum">
              {SPREAD[i].label} · {SPREAD[i].hint}
            </p>
            <p className={`mt-3 text-4xl ${d.reversed ? "rotate-180" : ""}`}>{d.card.symbol}</p>
            <p className="mt-2 font-display text-lg font-bold">
              {d.card.name}
              {d.reversed && <span className="ml-1 text-[13px] font-normal text-plum">(역방향)</span>}
            </p>
            <p className="text-[13px] text-muted">{d.card.en}</p>
            <p className="mt-2 flex flex-wrap justify-center gap-1">
              {d.card.keywords.map((k) => (
                <span key={k} className="rounded-full bg-paper px-2 py-0.5 text-[13px] text-night-2">
                  {k}
                </span>
              ))}
            </p>
            <p className="mt-3 text-left text-base leading-relaxed text-muted">{meaning(d)}</p>
          </li>
        ))}
      </ol>

      <section className="mt-6 rounded-xl border border-gold bg-gold/5 p-5">
        <h2 className="font-display text-lg font-bold">세 장을 함께 읽으면</h2>
        <p className="mt-2 leading-relaxed">
          <b>{drawn[0].card.name}</b>에서 출발해 지금은 <b>{drawn[1].card.name}</b>의 자리에 있습니다. 이대로 흘러가면{" "}
          <b>{drawn[2].card.name}</b>에 닿습니다. 미래 카드는 정해진 결말이 아니라 지금의 방향이 가리키는 곳이니, 바꾸고
          싶다면 현재 카드가 말하는 것부터 손대면 됩니다.
        </p>
      </section>

      <div className="mt-6 space-y-3">
        <ShareButtons title="타로점 결과" text={drawn.map(cardName).join(" · ")} />
        <Link
          href="/tarot"
          className="flex min-h-11 w-full items-center justify-center rounded-full border border-line bg-card px-5 py-3 text-sm font-semibold transition-colors hover:border-plum-light"
        >
          새로 카드 뽑기
        </Link>
      </div>
    </div>
  );
}

export default async function TarotPage({ searchParams }: PageProps<"/tarot">) {
  const drawn = await spreadOf(searchParams);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="text-center">
        <div className="flex justify-center">
          <MenuIcon href="/tarot" size={64} />
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl">{drawn ? "타로점 결과" : "무료 타로점"}</h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted">
          {drawn
            ? "고른 세 장이 말하는 과거·현재·미래의 흐름입니다."
            : "묻고 싶은 것을 마음속으로 떠올린 뒤, 카드 세 장을 고르세요. 과거·현재·미래의 흐름을 읽어 드립니다."}
        </p>
      </header>

      <div className="mt-8">{drawn ? <Result drawn={drawn} /> : <TarotBoard />}</div>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID} />

      <section className="mt-10 rounded-2xl border border-line bg-card shadow-sm p-5">
        <h2 className="font-display text-lg font-bold">타로 카드는 어떻게 읽나요?</h2>
        <p className="mt-2 text-base leading-relaxed text-muted">
          타로는 78장으로 이루어져 있고, 그중 인생의 큰 주제를 담은 22장을 메이저 아르카나라고 부릅니다. 바보(0번)에서
          시작해 세계(21번)로 끝나는 이 22장은 한 사람이 성장해 가는 여정을 순서대로 보여줍니다. 카드가 거꾸로 나오는
          역방향은 나쁜 뜻이 아니라, 그 카드의 기운이 막혀 있거나 안쪽으로 향하고 있다는 신호로 읽습니다.
        </p>
        <p className="mt-3 text-base leading-relaxed text-muted">
          세 장 뽑기는 가장 기본이 되는 배열법입니다. 첫 장은 지금 상황을 만든 배경, 둘째 장은 현재 놓인 자리, 셋째 장은
          이대로 갔을 때 향하는 방향을 뜻합니다. 미래 카드가 마음에 들지 않더라도 이미 정해진 결말이 아니라, 현재의 선택을
          바꾸면 함께 바뀌는 흐름으로 보는 것이 타로의 기본 태도입니다.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-card shadow-sm p-5">
        <h2 className="font-display text-lg font-bold">메이저 아르카나 22장</h2>
        <ul className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {MAJOR.map((c) => (
            <li key={c.no} className="rounded-lg bg-paper px-2.5 py-2 text-[13px]">
              <span className="mr-1">{c.symbol}</span>
              <span className="font-medium">
                {c.no}. {c.name}
              </span>
              <span className="mt-0.5 block text-[13px] text-muted">{c.keywords.join(" · ")}</span>
            </li>
          ))}
        </ul>
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} />

      <section className="mt-10 rounded-2xl border border-line bg-card shadow-sm p-5">
        <h2 className="font-display text-lg font-bold">이어서 보면 좋은 운세</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {[
            { href: "/today", label: "오늘의 운세", desc: "띠별·별자리별 오늘 흐름" },
            { href: "/saju", label: "사주팔자 풀이", desc: "타고난 기운 확인하기" },
            { href: "/gunghap", label: "궁합 보기", desc: "두 사람의 인연 보기" },
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

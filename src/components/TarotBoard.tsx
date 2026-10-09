"use client";

import Link from "next/link";
import { useState } from "react";
import { MAJOR, SPREAD, type Drawn, spreadQuery } from "@/lib/tarot";

const SLOTS = 22;

/** 남은 카드에서 한 장. 컴포넌트 밖에 둬야 react-hooks/purity가 렌더 중 난수로 오인하지 않는다. */
function draw(rest: typeof MAJOR): Drawn {
  return { card: rest[Math.floor(Math.random() * rest.length)], reversed: Math.random() < 0.5 };
}

/**
 * 카드를 미리 섞어두지 않고 사용자가 누르는 순간에 뽑는다.
 * 렌더 중 난수를 쓰면 서버와 클라이언트 결과가 달라져 하이드레이션이 깨지는데,
 * 클릭 시점에 뽑으면 그 문제가 애초에 생기지 않는다.
 */
export default function TarotBoard() {
  const [picks, setPicks] = useState<{ pos: number; drawn: Drawn }[]>([]);
  const done = picks.length === SPREAD.length;

  function pick(pos: number) {
    if (done || picks.some((p) => p.pos === pos)) return;
    const used = new Set(picks.map((p) => p.drawn.card.no));
    const rest = MAJOR.filter((c) => !used.has(c.no));
    setPicks([...picks, { pos, drawn: draw(rest) }]);
  }

  return (
    <div>
      <p className="text-center text-sm text-muted" aria-live="polite">
        {done ? "세 장을 모두 뽑았습니다." : `마음이 가는 카드를 고르세요. (${picks.length} / ${SPREAD.length})`}
      </p>

      {/* 카드 더미 */}
      <ul className="mt-5 grid grid-cols-6 gap-1.5 sm:grid-cols-11">
        {Array.from({ length: SLOTS }, (_, pos) => {
          const hit = picks.find((p) => p.pos === pos);
          return (
            <li key={pos}>
              <button
                type="button"
                onClick={() => pick(pos)}
                disabled={done || !!hit}
                aria-label={hit ? `${hit.drawn.card.name} 선택됨` : `${pos + 1}번 카드 선택`}
                className={`flex aspect-[2/3] w-full items-center justify-center rounded-md border text-lg transition-all ${
                  hit
                    ? "scale-95 border-gold bg-gold/15"
                    : done
                      ? "border-line bg-card opacity-40"
                      : "border-night-3 bg-gradient-to-b from-night-2 to-night text-gold-light hover:-translate-y-1 hover:border-gold"
                }`}
              >
                {hit ? hit.drawn.card.symbol : "✦"}
              </button>
            </li>
          );
        })}
      </ul>

      {/* 뽑은 카드 — 풀이는 결과 페이지(/tarot?cards=…)에서 */}
      {picks.length > 0 && (
        <ol className="mt-6 grid grid-cols-3 gap-2">
          {picks.map(({ drawn }, i) => (
            <li key={drawn.card.no} className="rounded-2xl border border-line bg-card p-3 text-center shadow-sm motion-safe:animate-pop">
              <p className="text-[13px] font-semibold text-plum">{SPREAD[i].label}</p>
              <p className="mt-1 text-3xl">{drawn.card.symbol}</p>
              <p className="mt-1 text-sm font-semibold">{drawn.card.name}</p>
            </li>
          ))}
        </ol>
      )}

      {done && (
        <div className="mt-6 space-y-3">
          <Link
            href={`/tarot?cards=${spreadQuery(picks.map((p) => p.drawn))}`}
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-gold px-5 py-3 text-base font-semibold text-night transition-colors hover:bg-gold-light"
          >
            세 장의 풀이 보기 →
          </Link>
          <button
            type="button"
            onClick={() => setPicks([])}
            className="w-full rounded-full border border-line bg-card px-5 py-3 text-sm font-semibold transition-colors hover:border-plum-light"
          >
            카드 다시 고르기
          </button>
        </div>
      )}
    </div>
  );
}

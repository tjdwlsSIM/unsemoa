/**
 * 띠·별자리·메뉴를 나타내는 그림. 모두 장식이다 — 이름은 항상 옆에 텍스트로 따로 쓴다.
 * 선 굵기·둥근 끝·남색 외곽선을 캐릭터와 맞췄다.
 */
import type { ReactNode } from "react";
import Animal from "@/components/Animal";
import type { Mood, Sign, SignKind, TtiId } from "@/lib/fortune";

/** 띠면 캐릭터, 별자리면 둥근 기호 배지 */
export function SignMark({
  sign,
  kind,
  size = 48,
  mood,
  priority,
}: {
  sign: Sign;
  kind: SignKind;
  size?: number;
  mood?: Mood;
  priority?: boolean;
}) {
  if (kind === "tti") return <Animal id={sign.id as TtiId} mood={mood} size={size} priority={priority} />;
  return <ZodiacGlyph symbol={sign.emoji} size={size} />;
}

/** ♈ 같은 기호를 이모지가 아닌 글자로(VS15) 그려 캐릭터 톤에 맞춘다 */
export function ZodiacGlyph({ symbol, size = 48 }: { symbol: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full border-[3px] border-night bg-gold-light/50 font-sans leading-none text-night"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {symbol}
      {"︎"}
    </span>
  );
}

const INK = "#3d3553";
const S = { stroke: INK, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;

const MENU: Record<string, { bg: string; draw: ReactNode }> = {
  "/today": {
    bg: "#f7e3a6",
    draw: (
      <>
        <circle cx={24} cy={24} r={8} {...S} fill="#f6c453" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <path key={a} d="M24 9 L24 12" {...S} transform={`rotate(${a} 24 24)`} />
        ))}
      </>
    ),
  },
  "/saju": {
    bg: "#f3dcc2",
    draw: (
      <>
        <rect x={13} y={11} width={22} height={26} rx={3} {...S} fill="#fff6e6" />
        <path d="M18 18 H30 M18 24 H30 M18 30 H25" {...S} />
      </>
    ),
  },
  "/tarot": {
    bg: "#d9d2ee",
    draw: (
      <>
        <rect x={15} y={10} width={18} height={28} rx={3} {...S} fill="#fff" transform="rotate(-8 24 24)" />
        <path d="M24 19 L26 23 L30 24 L26 25 L24 29 L22 25 L18 24 L22 23 Z" {...S} strokeWidth={2} fill="#c8a24a" />
      </>
    ),
  },
  "/gunghap": {
    bg: "#f8d0da",
    draw: <path d="M24 36 C12 28 11 18 17 15 C21 13 24 16 24 19 C24 16 27 13 31 15 C37 18 36 28 24 36 Z" {...S} fill="#ee8fa5" />,
  },
  "/tti": {
    bg: "#cdeede",
    draw: (
      <>
        <ellipse cx={24} cy={29} rx={7} ry={6} {...S} fill="#fff" />
        <circle cx={15} cy={21} r={3.2} {...S} fill="#fff" />
        <circle cx={21} cy={15} r={3.2} {...S} fill="#fff" />
        <circle cx={27} cy={15} r={3.2} {...S} fill="#fff" />
        <circle cx={33} cy={21} r={3.2} {...S} fill="#fff" />
      </>
    ),
  },
  "/horoscope": {
    bg: "#cfe0f4",
    draw: <path d="M24 11 L27.5 19.5 L36.5 20.3 L29.7 26.2 L31.8 35 L24 30.4 L16.2 35 L18.3 26.2 L11.5 20.3 L20.5 19.5 Z" {...S} fill="#f6c453" />,
  },
  "/guide": {
    bg: "#e5e9c4",
    draw: (
      <>
        <path d="M24 16 C20 13 15 13 11 14 V34 C15 33 20 33 24 36 C28 33 33 33 37 34 V14 C33 13 28 13 24 16 Z" {...S} fill="#fff" />
        <path d="M24 16 V36" {...S} />
      </>
    ),
  },
};

/** 메뉴 아이콘 — site.ts nav의 href로 찾는다. 없는 href면 아무것도 그리지 않는다. */
export function MenuIcon({ href, size = 44 }: { href: string; size?: number }) {
  const m = MENU[href];
  if (!m) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <circle cx={24} cy={24} r={23} fill={m.bg} />
      {m.draw}
    </svg>
  );
}

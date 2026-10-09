/**
 * 12지신이 둥글게 모인 대표 이미지 — app/icon.tsx · app/opengraph-image.tsx(next/og)가 같이 쓴다.
 * next/og(satori)용이라 Tailwind 대신 인라인 style만 쓴다.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ReactNode } from "react";
import { type Mood, type TtiId, TTI } from "@/lib/fortune";

/** 캐릭터를 next/og에 넣을 이미지로 — satori는 webp를 못 읽어서 png를 data URL로 */
export function animalImage(id: TtiId, size: number, mood: Mood = "happy") {
  const png = readFileSync(join(process.cwd(), "public/animals/png", `${id}-${mood}.png`));
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`data:image/png;base64,${png.toString("base64")}`} width={size} height={size} alt="" />;
}

export default function ZodiacRing({
  width,
  height,
  animal,
  rx,
  ry,
  children,
}: {
  width: number;
  height: number;
  /** 캐릭터 한 마리 크기(px) */
  animal: number;
  rx: number;
  ry: number;
  children?: ReactNode;
}) {
  return (
    <div style={{ width, height, display: "flex", position: "relative", background: "#fdf8ee" }}>
      {TTI.map((t, i) => {
        // 쥐가 12시 방향, 시계방향으로 자축인묘…
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return (
          <div
            key={t.id}
            style={{
              position: "absolute",
              left: width / 2 + rx * Math.cos(a) - animal / 2,
              top: height / 2 + ry * Math.sin(a) - animal / 2,
              display: "flex",
            }}
          >
            {animalImage(t.id, animal)}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          // satori는 inset을 모른다
          left: 0,
          top: 0,
          width,
          height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

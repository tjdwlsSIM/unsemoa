import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Animal from "@/components/Animal";
import { MOODS, TTI } from "@/lib/fortune";

// 개발용 — 12지신 x 3표정을 한눈에. 검색·사이트맵 제외.
export const metadata: Metadata = {
  title: "캐릭터 시트 (개발용)",
  robots: { index: false, follow: false },
};

/** 한 칸에 필요한 세 파일(512 webp · 256 webp · og용 png) 중 없는 것 */
const missingFiles = (file: string) =>
  [`${file}.webp`, `256/${file}.webp`, `png/${file}.png`].filter((f) => !existsSync(join(process.cwd(), "public/animals", f)));

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold">12지신 캐릭터 시트</h1>
      <p className="mt-1 text-base text-muted">96px(256 파일) · 마지막 열은 160px(512 파일) · 누락 파일은 빨간 칸</p>
      <table className="mt-6 w-full border-collapse text-center">
        <thead>
          <tr className="text-[13px] text-muted">
            <th className="py-2">띠</th>
            {MOODS.map((m) => (
              <th key={m}>{m}</th>
            ))}
            <th className="max-sm:hidden">happy 160</th>
          </tr>
        </thead>
        <tbody>
          {TTI.map((t) => (
            <tr key={t.id} className="border-t border-line" style={{ background: `${t.color}33` }}>
              <th className="px-2 font-semibold whitespace-nowrap">{t.name}</th>
              {MOODS.map((m) => {
                const missing = missingFiles(`${t.id}-${m}`);
                return (
                  <td key={m} className={`py-2 ${missing.length ? "bg-red-100 text-[13px] font-semibold text-red-700" : ""}`}>
                    {missing.length ? (
                      missing.map((f) => <p key={f}>누락: {f}</p>)
                    ) : (
                      <Animal id={t.id} mood={m} size={96} className="mx-auto max-sm:size-20" />
                    )}
                  </td>
                );
              })}
              <td className="max-sm:hidden">
                <Animal id={t.id} mood="happy" size={160} className="mx-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

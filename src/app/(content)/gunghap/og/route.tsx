/**
 * 궁합 결과 공유 미리보기 이미지 — /gunghap?adate=…&bdate=… 의 og:image.
 * 카톡으로 결과를 보내면 "두 띠 캐릭터 + 점수"가 카드로 떠서 받은 사람이 눌러 보게 만든다.
 * 생년월일 대신 띠·점수만 받는다(미리보기 이미지 주소에 생일을 남기지 않으려고).
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { animalImage } from "@/components/ZodiacRing";
import { TTI, gunghapMood } from "@/lib/fortune";
import { gradeOf } from "@/lib/gunghap";
import { site } from "@/lib/site";

const bold = await readFile(join(process.cwd(), "src/fonts/Pretendard-Bold.subset.woff"));

export function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const a = TTI.find((t) => t.id === q.get("a"));
  const b = TTI.find((t) => t.id === q.get("b"));
  const score = Number(q.get("s"));
  if (!a || !b || !Number.isInteger(score) || score < 0 || score > 100) return new Response("Bad Request", { status: 400 });
  const mood = gunghapMood(score);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(#fff1d6, #fdf8ee)",
          color: "#232a4a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {animalImage(a.id, 250, mood)}
          <svg width={90} height={90} viewBox="0 0 48 48" style={{ margin: "0 12px" }}>
            <path
              d="M24 38 C10 29 9 17 16 14 C20 12 24 15 24 19 C24 15 28 12 32 14 C39 17 38 29 24 38 Z"
              fill="#ee8fa5"
              stroke="#3d3553"
              strokeWidth={3}
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: "flex", transform: "scaleX(-1)" }}>{animalImage(b.id, 250, mood)}</div>
        </div>
        {/* satori: 자식이 여럿인 div는 display:flex가 필요해서 글자는 한 덩어리로 */}
        <div style={{ marginTop: 8, fontSize: 44, color: "#5a5e72" }}>{`${a.name} × ${b.name}`}</div>
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 120, fontWeight: 700, lineHeight: 1.1 }}>
          {score}
          <span style={{ fontSize: 56, marginLeft: 6 }}>점</span>
        </div>
        <div style={{ marginTop: 10, padding: "8px 28px", borderRadius: 999, background: "#c8a24a", fontSize: 36 }}>
          {`${gradeOf(score)} · ${site.name}`}
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: [{ name: "Pretendard", data: bold, weight: 700, style: "normal" }] },
  );
}

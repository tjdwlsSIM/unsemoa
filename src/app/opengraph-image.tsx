import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import ZodiacRing from "@/components/ZodiacRing";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/og는 woff2를 못 읽어서 같은 서브셋의 woff를 쓴다
const bold = await readFile(join(process.cwd(), "src/fonts/Pretendard-Bold.subset.woff"));

export default function Image() {
  return new ImageResponse(
    (
      <ZodiacRing width={size.width} height={size.height} animal={112} rx={470} ry={225}>
        <div style={{ fontSize: 96, fontWeight: 700, color: "#232a4a", letterSpacing: -2 }}>{site.name}</div>
        <div style={{ marginTop: 12, fontSize: 36, color: "#5a5e72" }}>{site.tagline}</div>
        <div
          style={{
            marginTop: 28,
            padding: "10px 28px",
            borderRadius: 999,
            background: "#c8a24a",
            color: "#232a4a",
            fontSize: 32,
          }}
        >
          오늘의 운세 · 사주 · 궁합 무료
        </div>
      </ZodiacRing>
    ),
    { ...size, fonts: [{ name: "Pretendard", data: bold, weight: 700, style: "normal" }] },
  );
}

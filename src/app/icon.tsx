import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import ZodiacRing from "@/components/ZodiacRing";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

const bold = await readFile(join(process.cwd(), "src/fonts/Pretendard-Bold.subset.woff"));

// 작은 크기(16px 탭)에서도 알아보도록 가운데에 큰 "운" 한 글자
export default function Icon() {
  return new ImageResponse(
    (
      <ZodiacRing width={512} height={512} animal={104} rx={196} ry={196}>
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: 999,
            background: "#c8a24a",
            border: "8px solid #3d3553",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 120,
            fontWeight: 700,
            color: "#232a4a",
          }}
        >
          운
        </div>
      </ZodiacRing>
    ),
    { ...size, fonts: [{ name: "Pretendard", data: bold, weight: 700, style: "normal" }] },
  );
}

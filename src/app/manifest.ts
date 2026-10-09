import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// 홈 화면에 추가하면 앱처럼 열린다 — 매일 운세 보러 오는 사람에게 주소창 대신 아이콘 하나
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} – ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fdf8ee",
    theme_color: "#fdf8ee",
    lang: "ko",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}

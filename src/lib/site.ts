export const site = {
  name: "운세모아",
  tagline: "사주·타로·궁합·오늘의 운세를 한 곳에",
  description:
    "사주팔자, 오늘의 운세, 띠별·별자리 운세, 타로점, 궁합까지 무료로 한 번에. 매일 새로워지는 운세모아에서 오늘의 흐름을 확인하세요.",
  // 배포 도메인 확정되면 여기만 바꾸면 sitemap/robots/OG 전부 따라감
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://unsemoa.com",
};

export const nav = [
  { href: "/today", label: "오늘의 운세", emoji: "🔮", desc: "띠·별자리별 오늘의 흐름" },
  { href: "/saju", label: "사주풀이", emoji: "📜", desc: "생년월일시로 보는 사주팔자" },
  { href: "/tarot", label: "타로점", emoji: "🃏", desc: "카드 한 장에 담긴 오늘의 답" },
  { href: "/gunghap", label: "궁합", emoji: "💞", desc: "두 사람의 연애·결혼 궁합" },
  { href: "/tti", label: "띠별 운세", emoji: "🐉", desc: "12지신으로 보는 운세" },
  { href: "/horoscope", label: "별자리 운세", emoji: "✨", desc: "12별자리 오늘·이번주" },
  // /naming은 기능 완성 전까지 숨김 (페이지는 noindex로 남아 있음). 다시 열 때 여기 한 줄만 되살리면 된다.
  { href: "/guide", label: "운세 사전", emoji: "📖", desc: "오행·십신·만세력 용어 설명" },
] as const;

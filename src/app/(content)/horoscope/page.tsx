import type { Metadata } from "next";
import { SignListPage } from "@/components/SignPages";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "별자리 운세",
  description: "양자리부터 물고기자리까지 12별자리 오늘의 운세. 총운·애정운·금전운·직장운·건강운을 무료로 확인하세요.",
  alternates: { canonical: "/horoscope" },
};

export default function Page() {
  return (
    <SignListPage
      kind="zodiac"
      title="별자리 운세"
      intro="태어난 날짜로 정해지는 열두 별자리의 오늘 흐름입니다. 별자리를 선택하면 자세한 풀이를 볼 수 있습니다."
    />
  );
}

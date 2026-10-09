import type { Metadata } from "next";
import { SignListPage } from "@/components/SignPages";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "띠별 운세",
  description: "쥐띠부터 돼지띠까지 12지신 띠별 오늘의 운세. 총운·애정운·금전운·직장운·건강운을 무료로 확인하세요.",
  alternates: { canonical: "/tti" },
};

export default function Page() {
  return (
    <SignListPage
      kind="tti"
      title="띠별 운세"
      intro="태어난 해의 지지(地支)로 보는 열두 띠의 오늘 흐름입니다. 띠를 선택하면 자세한 풀이를 볼 수 있습니다."
    />
  );
}

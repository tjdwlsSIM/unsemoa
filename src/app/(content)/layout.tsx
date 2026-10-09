import type { ReactNode } from "react";
import SideBar from "@/components/SideBar";

// 곁칸에 오늘 운세가 들어가서, 사전처럼 날짜와 무관한 페이지도 한 시간마다 새로 만든다
export const revalidate = 3600;

/**
 * 운세 콘텐츠 페이지 공통 틀. 휴대폰은 한 칸 그대로, 넓은 화면(lg 이상)은 본문 + 오른쪽 곁칸(300px).
 * 폭은 헤더와 같은 max-w-5xl이라 좌우 끝선이 맞는다. 본문 쪽 여백(px-4)은 각 페이지가 가진다.
 */
export default function ContentLayout({ children }: { children: ReactNode }) {
  return (
    // 페이지 윗부분에 홈 히어로와 같은 따뜻한 색을 번지게 깔고, 아래로 갈수록 바탕 무늬가 드러난다
    <div style={{ backgroundImage: "linear-gradient(#fff1d6, transparent 420px)" }}>
      <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-4 lg:pr-4">
        <div className="min-w-0">{children}</div>
        <SideBar />
      </div>
    </div>
  );
}

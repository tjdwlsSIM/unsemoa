"use client";

/**
 * 애드센스 슬롯. 퍼블리셔 ID(NEXT_PUBLIC_ADSENSE_CLIENT)가 없으면 아무것도 렌더하지 않는다.
 * 심사 전·로컬 개발에서 빈 광고 요청을 날리면 계정에 불리하므로 env로 잠가둔다.
 *
 * push()는 인라인 <script>가 아니라 effect에서 부른다. React는 클라이언트 렌더로 넣은 <script>를 실행하지 않아서,
 * 인라인 방식이면 첫 방문 페이지에만 광고가 뜨고 링크로 옮겨 간 페이지는 전부 빈 칸이 된다.
 * 경로가 바뀌면 <ins>를 새로 만들어(key) 새 광고를 요청한다.
 *
 * 높이를 미리 잡아둬서 광고가 뜰 때 본문이 밀리지 않게(CLS) 한다. 채울 광고가 없으면(unfilled) 자리째 숨긴다.
 */
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: object[];
  }
}

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function AdSlot({
  slot,
  label = "광고",
  format = "auto",
  className = "my-8",
}: {
  slot?: string;
  label?: string;
  /** vertical: 곁칸용 세로 광고(300x600 등) */
  format?: "auto" | "vertical";
  className?: string;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!CLIENT || !slot) return;
    try {
      (window.adsbygoogle ||= []).push({});
    } catch {
      // 개발 모드 이중 실행 등으로 이미 채워진 <ins>에 다시 push하면 던진다 — 광고 하나 빠질 뿐 페이지는 멀쩡하다
    }
  }, [pathname, slot]);

  if (!CLIENT || !slot) return null;
  return (
    <aside className={`${className} has-[ins[data-ad-status=unfilled]]:hidden`} aria-label={label}>
      <p className="mb-1 text-center text-[13px] tracking-widest text-muted">SPONSORED</p>
      <ins
        key={pathname}
        className={`adsbygoogle block ${format === "vertical" ? "min-h-[600px]" : "min-h-[100px]"}`}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(format === "auto" && { "data-full-width-responsive": "true" })}
      />
    </aside>
  );
}

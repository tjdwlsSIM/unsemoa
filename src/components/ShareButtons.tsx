"use client";

import { useState } from "react";

/**
 * 공유 버튼. 카카오 SDK 대신 Web Share API를 쓴다.
 * 모바일에서 공유 시트를 띄우면 카카오톡이 그 안에 이미 들어 있어서,
 * 앱 키 발급·SDK 로딩·도메인 등록 없이 같은 결과를 얻는다.
 * 데스크톱처럼 지원이 없는 환경은 링크 복사로 떨어진다.
 */
export default function ShareButtons({ title, text }: { title: string; text?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // 사용자가 공유 시트를 닫은 경우 — 복사로 떨어뜨리지 않고 조용히 종료
        return;
      }
    }
    await copy();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        type="button"
        onClick={share}
        className="rounded-full bg-night min-h-11 px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-night-2"
      >
        결과 공유하기
      </button>
      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className="rounded-full border border-line bg-card min-h-11 px-5 py-2.5 text-base font-semibold transition-colors hover:border-plum-light"
      >
        {copied ? "복사됐어요" : "링크 복사"}
      </button>
    </div>
  );
}

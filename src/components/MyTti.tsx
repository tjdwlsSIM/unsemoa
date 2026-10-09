"use client";

/**
 * 내 띠 — 한 번 저장하면 첫 화면에 그 띠의 오늘 운세가 맨 먼저 뜬다. 매일 들어올 이유를 한 단계 줄인다.
 * 이 기기 브라우저(localStorage)에만 두고 서버로는 보내지 않는다.
 */
import { type ReactNode, useSyncExternalStore } from "react";

const KEY = "unsemoa:my-tti";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb); // 다른 탭에서 바꾼 것도 반영
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

// 사생활 보호 모드 등에서 저장소 접근이 막히면 던진다 — 그냥 "저장 안 됨"으로 본다
function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function write(id: string | null) {
  try {
    if (id) localStorage.setItem(KEY, id);
    else localStorage.removeItem(KEY);
  } catch {
    // 저장이 막힌 브라우저 — 버튼만 그대로 남는다
  }
  listeners.forEach((l) => l());
}

const useMyTti = () => useSyncExternalStore(subscribe, read, () => null);

/** /tti/[id]의 저장 버튼. 이미 내 띠면 누를 때 해제한다. */
export function SaveMyTti({ id }: { id: string }) {
  const saved = useMyTti() === id;
  return (
    <div className="mt-4 flex flex-col items-center gap-1">
      <button
        type="button"
        aria-pressed={saved}
        onClick={() => write(saved ? null : id)}
        className={`inline-flex min-h-11 items-center rounded-full border-2 px-5 text-base font-semibold transition-colors ${
          saved ? "border-gold bg-gold text-night" : "border-night/15 bg-card hover:border-gold"
        }`}
      >
        {saved ? "★ 내 띠로 저장됨" : "☆ 내 띠로 저장"}
      </button>
      <p className="text-[13px] text-muted" aria-live="polite">
        {saved ? "다음부터 첫 화면에서 바로 보여 드려요." : "저장하면 첫 화면에 내 띠 운세가 먼저 떠요."}
      </p>
    </div>
  );
}

/** 첫 화면 카드. 띠별 카드는 서버에서 다 만들어 두고, 여기선 저장된 띠 하나만 고른다. */
export function MyTtiCard({ cards }: { cards: Record<string, ReactNode> }) {
  const id = useMyTti();
  return id && id in cards ? cards[id] : null;
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 text-ink backdrop-blur">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex min-h-11 items-center gap-2">
            <span className="font-display text-2xl text-night">{site.name}</span>
            <span className="hidden text-[13px] text-muted sm:inline">{site.tagline}</span>
          </Link>
          <Link
            href="/saju"
            className="inline-flex min-h-11 items-center rounded-full bg-gold px-4 text-sm font-semibold text-night transition-colors hover:bg-gold-light"
          >
            무료 사주보기
          </Link>
        </div>

        {/* 모바일 우선: 가로 스크롤 카테고리 바 (햄버거 메뉴 없이 한 번에 노출) */}
        <nav aria-label="주요 메뉴" className="no-scrollbar -mx-4 overflow-x-auto px-4">
          <ul className="flex w-max gap-1 pb-2">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center rounded-full px-3.5 text-base whitespace-nowrap transition-colors ${
                      active ? "bg-gold/25 font-semibold text-night" : "text-muted hover:bg-cream hover:text-night"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

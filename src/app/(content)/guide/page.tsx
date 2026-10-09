import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { MenuIcon } from "@/components/marks";
import { GUIDE } from "@/lib/guide";

export const metadata: Metadata = {
  title: "운세 사전",
  description:
    "사주팔자, 천간지지, 오행, 십신, 만세력, 24절기, 십이지 띠 궁합까지. 운세를 보다 만나는 용어를 처음부터 쉽게 풀어 설명합니다.",
  alternates: { canonical: "/guide" },
};

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="text-center">
        <div className="flex justify-center">
          <MenuIcon href="/guide" size={64} />
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl">운세 사전</h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted">
          사주 풀이를 보다 보면 낯선 말이 자주 나옵니다. 오행, 십신, 만세력, 절기 같은 개념을 처음 보는 사람도 이해할 수 있게
          정리했습니다.
        </p>
      </header>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} />

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {GUIDE.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guide/${g.slug}`}
              className="flex h-full flex-col rounded-2xl border border-line bg-card shadow-sm p-5 transition-shadow hover:shadow-md"
            >
              <span className="text-2xl">{g.emoji}</span>
              <h2 className="mt-2 font-display text-lg font-bold">{g.title}</h2>
              <p className="mt-1.5 text-base leading-relaxed text-muted">{g.summary}</p>
            </Link>
          </li>
        ))}
      </ul>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} />
    </div>
  );
}

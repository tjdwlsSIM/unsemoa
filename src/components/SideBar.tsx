/**
 * 넓은 화면(lg 이상) 오른쪽 곁칸 — (content) 그룹 레이아웃이 붙인다. 휴대폰에서는 렌더만 되고 보이지 않는다.
 * 본문 옆 빈 공간을 오늘의 띠 운세 바로가기로 채우고, 아래쪽 세로 광고는 스크롤을 따라온다.
 */
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import Animal from "@/components/Animal";
import { ScoreStars } from "@/components/FortuneDetail";
import { MenuIcon } from "@/components/marks";
import { MyTtiCard } from "@/components/MyTti";
import { type DailyFortune, type Tti, fortuneMood, getAllDailyFortunes, luckyOf, todayKST } from "@/lib/fortune";
import { nav } from "@/lib/site";

const box = "rounded-2xl border border-line bg-card p-4 shadow-sm";

/** 사진 한 장 + 이름 + 별점의 짧은 카드. 내 띠·행운 동물이 같이 쓴다. */
function SignCard({ f, label }: { f: DailyFortune; label: string }) {
  const t = f.sign as Tti;
  return (
    <Link
      href={`/tti/${t.id}`}
      className={`${box} flex items-center gap-3 transition-shadow hover:shadow-md`}
      style={{ background: `linear-gradient(135deg, ${t.color}55, var(--color-card) 70%)` }}
    >
      <Animal id={t.id} mood={label === "오늘의 행운 동물" ? "happy" : fortuneMood(f.score)} size={64} />
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-plum">{label}</p>
        <p className="font-display text-lg leading-tight">{t.name}</p>
        <ScoreStars score={f.score} />
      </div>
    </Link>
  );
}

export default function SideBar() {
  const tti = getAllDailyFortunes("tti", todayKST());

  return (
    <aside aria-label="오늘의 띠 운세 바로가기" className="hidden py-8 lg:block">
      <div className="space-y-3">
        <MyTtiCard cards={Object.fromEntries(tti.map((f) => [f.sign.id, <SignCard key={f.sign.id} f={f} label="★ 내 띠" />]))} />
        <SignCard f={luckyOf(tti)} label="오늘의 행운 동물" />

        <section className={box} data-side-tti>
          <h2 className="font-display text-base">띠별 오늘 운세</h2>
          <ul className="mt-2 grid grid-cols-3 gap-1">
            {tti.map((f) => (
              <li key={f.sign.id}>
                <Link
                  href={`/tti/${f.sign.id}`}
                  className="flex flex-col items-center rounded-xl py-1.5 text-[13px] transition-colors hover:bg-cream"
                >
                  <Animal id={f.sign.id as Tti["id"]} mood={fortuneMood(f.score)} size={48} />
                  <span className="font-medium">{f.sign.name}</span>
                  <span className="text-gold" aria-label={`5점 만점에 ${f.score}점`}>
                    {"★".repeat(f.score)}
                    <span className="text-line">{"★".repeat(5 - f.score)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 여기부터는 스크롤을 따라온다 (헤더 높이만큼 띄움) */}
      <div className="sticky top-32 mt-3 space-y-3">
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDE} format="vertical" className="" />
        <nav aria-label="다른 운세" className={box}>
          <h2 className="font-display text-base">다른 운세 보기</h2>
          <ul className="mt-2 space-y-0.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-cream">
                  <MenuIcon href={item.href} size={32} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

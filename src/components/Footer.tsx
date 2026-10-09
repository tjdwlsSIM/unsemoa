import Link from "next/link";
import Animal from "@/components/Animal";
import { TTI } from "@/lib/fortune";
import { nav, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-cream text-muted">
      {/* 12지신이 푸터 경계선 위에 나란히 서 있다 (장식) */}
      <div aria-hidden className="absolute inset-x-0 bottom-full flex justify-center">
        {TTI.map((t) => (
          <Animal key={t.id} id={t.id} mood="happy" size={48} className="-mx-px size-7 sm:size-12" />
        ))}
      </div>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="font-display text-xl text-night">{site.name}</p>
        <p className="mt-2 max-w-md text-base leading-relaxed">{site.description}</p>

        {/* 맨 위 메뉴와 같은 반응(둥근 금색 배경). 배경 여백(px-3.5)만큼 바깥으로 당겨 글자 시작선을 제목에 맞춘다 */}
        <ul className="-mx-3.5 mt-6 grid grid-cols-2 gap-x-4 text-base sm:grid-cols-4">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center rounded-full px-3.5 transition-colors hover:bg-gold/25 hover:text-night focus-visible:bg-gold/25 focus-visible:text-night"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 border-t border-line pt-6 text-[13px] leading-relaxed">
          본 사이트의 운세 콘텐츠는 전통 명리학·점성술 해석을 바탕으로 한 참고용 정보이며, 의학·법률·투자 등의 전문적 판단을 대신하지 않습니다.
          <br />
          <Link href="/privacy" className="inline-flex min-h-11 items-center font-semibold hover:text-night hover:underline">
            개인정보처리방침
          </Link>
          <br />© {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}

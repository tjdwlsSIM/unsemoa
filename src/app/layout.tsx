import type { Metadata, Viewport } from "next";
import { Gowun_Dodum, Noto_Serif_KR } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { site } from "@/lib/site";
import "./globals.css";

// 본문: Pretendard KS X 1001 서브셋(굵기당 ~270KB). 라이선스 src/fonts/LICENSE-Pretendard.txt (OFL)
const sans = localFont({
  variable: "--font-pretendard",
  display: "swap",
  src: [
    { path: "../fonts/Pretendard-Regular.subset.woff2", weight: "400" },
    { path: "../fonts/Pretendard-Medium.subset.woff2", weight: "500" },
    { path: "../fonts/Pretendard-Bold.subset.woff2", weight: "700" },
  ],
});
// 제목: 둥근 고운돋움(OFL, src/fonts/LICENSE-GowunDodum.txt). next/font가 빌드 때 받아 자체 서빙한다.
const display = Gowun_Dodum({ variable: "--font-gowun", subsets: ["latin"], weight: "400" });
// 사주표 한자 전용 명조
const serif = Noto_Serif_KR({ variable: "--font-kr-serif", subsets: ["latin"], weight: ["700"], preload: false });

const ADSENSE = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} – ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  keywords: ["운세", "사주", "무료사주", "사주팔자", "오늘의 운세", "타로", "궁합", "띠별 운세", "별자리 운세", "만세력"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: site.name,
    title: `${site.name} – ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  ...(ADSENSE ? { other: { "google-adsense-account": ADSENSE } } : {}),
};

export const viewport: Viewport = { themeColor: "#fdf8ee" };

/** 검색 결과에 사이트 이름과 검색창이 노출되도록 하는 구조화 데이터 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  description: site.description,
  inLanguage: "ko-KR",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${sans.variable} ${display.variable} ${serif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {ADSENSE && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}

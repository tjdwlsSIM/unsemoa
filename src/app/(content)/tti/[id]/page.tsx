import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SignDetailPage } from "@/components/SignPages";
import { TTI, type Tti, findSign, fortuneBirthYears, todayKST, yearLabel } from "@/lib/fortune";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return TTI.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: PageProps<"/tti/[id]">): Promise<Metadata> {
  const { id } = await params;
  const sign = findSign("tti", id) as Tti | undefined;
  if (!sign) return {};
  const date = todayKST();
  const years = fortuneBirthYears(sign, date);
  const thisYear = Number(date.slice(0, 4));
  // 제목엔 검색이 가장 많은 40~50대 두 해만: "72년생 84년생 쥐띠 오늘의 운세"
  const main = years.filter((y) => thisYear - y >= 40 && thisYear - y < 60).reverse();
  return {
    title: `${main.map(yearLabel).join(" ")} ${sign.name} 오늘의 운세 (${date})`,
    description: `${years.map(yearLabel).join("·")} ${sign.name} 오늘의 운세. 년생별 한 줄 운세와 총운·애정운·금전운·직장운·건강운, 행운의 색·숫자. ${sign.trait}.`,
    alternates: { canonical: `/tti/${id}` },
  };
}

export default async function Page({ params }: PageProps<"/tti/[id]">) {
  const { id } = await params;
  if (!findSign("tti", id)) notFound();
  return <SignDetailPage kind="tti" id={id} />;
}

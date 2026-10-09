import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SignDetailPage } from "@/components/SignPages";
import { ZODIAC, findSign, todayKST } from "@/lib/fortune";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return ZODIAC.map((z) => ({ id: z.id }));
}

export async function generateMetadata({ params }: PageProps<"/horoscope/[id]">): Promise<Metadata> {
  const { id } = await params;
  const sign = findSign("zodiac", id);
  if (!sign) return {};
  return {
    title: `${sign.name} 오늘의 운세 (${todayKST()})`,
    description: `${sign.name}(${sign.period}) 오늘의 총운·애정운·금전운·직장운·건강운. ${sign.trait}.`,
    alternates: { canonical: `/horoscope/${id}` },
  };
}

export default async function Page({ params }: PageProps<"/horoscope/[id]">) {
  const { id } = await params;
  if (!findSign("zodiac", id)) notFound();
  return <SignDetailPage kind="zodiac" id={id} />;
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import { GUIDE, findGuide } from "@/lib/guide";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guide/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.summary,
    keywords: g.keywords,
    alternates: { canonical: `/guide/${slug}` },
    openGraph: { title: g.title, description: g.summary, type: "article" },
  };
}

export default async function GuideArticlePage({ params }: PageProps<"/guide/[slug]">) {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) notFound();

  const related = g.related.map(findGuide).filter((x) => x !== undefined);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <nav className="text-[13px] text-muted">
        <Link href="/guide" className="inline-flex min-h-11 items-center hover:underline">
          운세 사전
        </Link>
        <span className="mx-1">›</span>
        <span>{g.title}</span>
      </nav>

      <header className="mt-4">
        <p className="text-4xl">{g.emoji}</p>
        <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl">{g.title}</h1>
        <p className="mt-2 leading-relaxed text-muted">{g.summary}</p>
      </header>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} />

      <div className="mt-6 space-y-8">
        {g.sections.map((s, i) => (
          <section key={s.heading}>
            <h2 className="font-display text-xl font-bold">{s.heading}</h2>
            <div className="mt-3 space-y-3">
              {s.body.map((p) => (
                <p key={p.slice(0, 20)} className="leading-loose">
                  {p}
                </p>
              ))}
            </div>
            {i === 1 && <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID} />}
          </section>
        ))}
      </div>

      <div className="mt-10">
        <ShareButtons title={g.title} text={g.summary} />
      </div>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} />

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-lg font-bold">함께 읽으면 좋은 글</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/guide/${r.slug}`} className="block h-full rounded-lg border border-line bg-card p-3 hover:border-plum-light">
                  <span className="text-lg">{r.emoji}</span>
                  <span className="mt-1 block text-sm font-semibold">{r.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 rounded-2xl border border-line bg-card shadow-sm p-5 text-center">
        <p className="text-base leading-relaxed text-muted">개념을 익혔다면 직접 확인해 볼 차례입니다.</p>
        <Link
          href="/saju"
          className="mt-3 inline-block rounded-full bg-gold min-h-11 px-5 py-2.5 text-base font-semibold text-night hover:bg-gold-light"
        >
          내 사주 무료로 풀어보기
        </Link>
      </section>
    </div>
  );
}

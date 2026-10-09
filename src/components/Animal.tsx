import Image from "next/image";
import { type Mood, type TtiId, TTI } from "@/lib/fortune";

const MOOD_LABEL: Record<Mood, string> = { happy: "웃는 표정", normal: "기본 표정", worried: "걱정하는 표정" };

/**
 * 12지신 캐릭터 — public/animals/의 webp. 파일이 이미 크기별로 준비돼 있어 최적화기는 거치지 않는다.
 * 128px 이하는 256px 파일(2x 화면 대응), 그보다 크면 512px 파일. priority는 첫 화면의 큰 캐릭터에만.
 */
export default function Animal({
  id,
  mood = "normal",
  size = 96,
  priority = false,
  className,
}: {
  id: TtiId;
  mood?: Mood;
  size?: number;
  priority?: boolean;
  className?: string;
}) {
  const name = TTI.find((t) => t.id === id)!.name;
  return (
    <Image
      src={`/animals/${size <= 128 ? "256/" : ""}${id}-${mood}.webp`}
      alt={`${name} 캐릭터(${MOOD_LABEL[mood]})`}
      width={size}
      height={size}
      // Next 16에서 priority는 폐기. 문서 권장대로 img 자체에 우선순위를 건다(정적 페이지에서도 확실히 붙는다)
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      unoptimized
      className={className}
    />
  );
}

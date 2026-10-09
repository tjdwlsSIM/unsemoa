/**
 * 궁합 — 띠(지지) 관계 + 일간(천간) 오행 관계를 합산해 점수와 풀이를 낸다.
 *
 * 지지 관계: 삼합/육합/충/해/파 — 전통 명리의 표준 분류.
 * 천간 관계: 두 사람 일간의 오행 상생·상극과 천간합.
 * 생년월일만으로 결정되므로 같은 입력이면 항상 같은 결과가 나온다.
 */

import { josa, withJosa } from "./josa.ts";
import { GAN, JI, JI_ANIMAL, calcSaju, ganOhaeng, ganYang, type BirthInput } from "./saju.ts";

// 지지 인덱스: 자0 축1 인2 묘3 진4 사5 오6 미7 신8 유9 술10 해11

/** 삼합(三合) — 신자진·해묘미·인오술·사유축. 12지를 4로 나눈 나머지가 같다. */
const isSamhap = (a: number, b: number) => a !== b && a % 4 === b % 4;
/** 육합(六合) — 자축·인해·묘술·진유·사신·오미. 두 지지의 합이 13(또는 1). */
const isYukhap = (a: number, b: number) => (a + b) % 12 === 1;
/** 충(沖) — 정반대편, 6칸 차이. */
const isChung = (a: number, b: number) => Math.abs(a - b) === 6;
/** 해(害) — 자미·축오·인사·묘진·신해·유술. 합이 7 또는 19. */
const isHae = (a: number, b: number) => (a + b) % 12 === 7 && Math.abs(a - b) !== 6;
/** 파(破) — 규칙으로 안 떨어져서 표로 둔다. */
const PA: [number, number][] = [
  [0, 9],
  [1, 4],
  [2, 11],
  [3, 6],
  [5, 8],
  [7, 10],
];
const isPa = (a: number, b: number) => PA.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

export type JiRelation = {
  key: "삼합" | "육합" | "같은띠" | "무난" | "파" | "해" | "충";
  score: number;
  headline: string;
  detail: string;
};

function jiRelation(a: number, b: number): JiRelation {
  const pair = `${JI_ANIMAL[a]}띠와 ${JI_ANIMAL[b]}띠`;
  if (isSamhap(a, b))
    return {
      key: "삼합",
      score: 94,
      headline: "삼합(三合) — 타고난 천생연분",
      detail: `${pair}${josa(pair, "은/는")} 삼합으로 묶인 사이입니다. 열두 띠 관계 중 가장 좋은 조합으로, 서로의 부족한 부분을 자연스럽게 메워줍니다. 처음 만났을 때부터 이유 없이 편했다면 그 이유가 여기에 있습니다.`,
    };
  if (isYukhap(a, b))
    return {
      key: "육합",
      score: 88,
      headline: "육합(六合) — 붙어 있으면 편안한 사이",
      detail: `${pair}${josa(pair, "은/는")} 육합 관계입니다. 삼합이 뜨겁게 끌어당기는 인연이라면 육합은 오래 함께해도 지치지 않는 인연입니다. 큰 사건 없이 잔잔하게 이어지는 관계가 많습니다.`,
    };
  if (isChung(a, b))
    return {
      key: "충",
      score: 48,
      headline: "충(沖) — 끌리지만 부딪히는 사이",
      detail: `${pair}${josa(pair, "은/는")} 정면으로 마주 보는 충 관계입니다. 강하게 끌리는 만큼 충돌도 잦습니다. 다만 충은 '나쁜 궁합'이라기보다 변화를 크게 만드는 관계라, 서로를 인정하면 오히려 함께 크게 성장합니다.`,
    };
  if (isHae(a, b))
    return {
      key: "해",
      score: 58,
      headline: "해(害) — 사소한 데서 어긋나는 사이",
      detail: `${pair}${josa(pair, "은/는")} 해 관계입니다. 큰 다툼보다는 작은 서운함이 쌓이기 쉽습니다. 말하지 않고 넘어간 것들이 문제가 되는 유형이라, 그때그때 짚고 넘어가는 습관이 필요합니다.`,
    };
  if (isPa(a, b))
    return {
      key: "파",
      score: 63,
      headline: "파(破) — 좋았다가 멀어지길 반복하는 사이",
      detail: `${pair}${josa(pair, "은/는")} 파 관계입니다. 관계의 기복이 있는 편이라 가까워졌다 멀어지기를 반복합니다. 거리를 일정하게 유지하는 쪽이 오래갑니다.`,
    };
  if (a === b)
    return {
      key: "같은띠",
      score: 76,
      headline: "같은 띠 — 거울 같은 사이",
      detail: `둘 다 ${JI_ANIMAL[a]}띠입니다. 말하지 않아도 통하는 부분이 많지만, 단점까지 똑같아서 같은 지점에서 같이 흔들립니다. 서로의 약점을 보완해줄 제3의 조언자가 있으면 좋습니다.`,
    };
  return {
    key: "무난",
    score: 72,
    headline: "무난한 조합",
    detail: `${pair}${josa(pair, "은/는")} 특별히 부딪히지도, 강하게 끌어당기지도 않는 조합입니다. 띠보다는 두 사람이 쌓아온 시간이 관계를 결정합니다.`,
  };
}

export type GanRelation = { score: number; label: string; detail: string };

/** 오행 상생: 목→화→토→금→수→목 / 상극: 목→토→수→화→금→목 */
function ganRelation(ganA: number, ganB: number): GanRelation {
  const O = ["목", "화", "토", "금", "수"];
  const ia = O.indexOf(ganOhaeng(ganA));
  const ib = O.indexOf(ganOhaeng(ganB));
  const diff = ((ib - ia) % 5 + 5) % 5;
  const na = `${GAN[ganA]}(${ganOhaeng(ganA)})`;
  const nb = `${GAN[ganB]}(${ganOhaeng(ganB)})`;

  // 천간합 — 갑기·을경·병신·정임·무계
  if (Math.abs(ganA - ganB) === 5)
    return {
      score: 12,
      label: "천간합",
      detail: `두 사람의 일간이 ${withJosa(na, "과/와")} ${withJosa(nb, "으로/로")} 천간합을 이룹니다. 서로를 끌어당기는 힘이 강해 인연이 쉽게 끊어지지 않습니다.`,
    };
  if (diff === 1)
    return { score: 9, label: "상생(내가 줌)", detail: `${withJosa(na, "이/가")} ${withJosa(nb, "을/를")} 살려주는 관계입니다. 앞사람이 베풀고 뒷사람이 힘을 얻는 흐름입니다.` };
  if (diff === 4)
    return { score: 9, label: "상생(내가 받음)", detail: `${withJosa(nb, "이/가")} ${withJosa(na, "을/를")} 살려주는 관계입니다. 뒷사람이 앞사람의 든든한 버팀목이 됩니다.` };
  if (diff === 0)
    return {
      score: 3,
      label: "같은 오행",
      detail: `두 사람 모두 ${ganOhaeng(ganA)}의 기운입니다. 코드가 잘 맞지만 같은 방향으로만 가서 한쪽이 양보할 일이 생깁니다.`,
    };
  return {
    score: -8,
    label: "상극",
    detail: `${withJosa(na, "과/와")} ${withJosa(nb, "은/는")} 서로 눌러주는 관계입니다. 긴장이 있는 만큼 서로를 다듬어주기도 해서, 감정만 앞세우지 않으면 오히려 단단해집니다.`,
  };
}

export type Gunghap = {
  score: number;
  grade: string;
  ji: JiRelation;
  gan: GanRelation;
  a: { ji: number; gan: number; animal: string; dayPillar: string };
  b: { ji: number; gan: number; animal: string; dayPillar: string };
  sections: { title: string; body: string }[];
  advice: string;
};

export const gradeOf = (s: number) =>
  s >= 90 ? "천생연분" : s >= 80 ? "아주 좋은 궁합" : s >= 70 ? "좋은 궁합" : s >= 60 ? "노력하면 좋아지는 궁합" : "쉽지 않은 궁합";

export function calcGunghap(personA: BirthInput, personB: BirthInput): Gunghap {
  const sa = calcSaju(personA);
  const sb = calcSaju(personB);
  const ji = jiRelation(sa.year.ji, sb.year.ji);
  const gan = ganRelation(sa.day.gan, sb.day.gan);
  const score = Math.max(5, Math.min(99, ji.score + gan.score));

  const animalA = JI_ANIMAL[sa.year.ji];
  const animalB = JI_ANIMAL[sb.year.ji];
  const sameYang = ganYang(sa.day.gan) === ganYang(sb.day.gan);

  const sections = [
    {
      title: "첫인상과 끌림",
      body:
        ji.key === "삼합" || ji.key === "육합"
          ? `처음부터 경계심 없이 가까워지는 조합입니다. ${animalA}띠 쪽이 먼저 마음을 열고, ${animalB}띠 쪽이 그 편안함에 머무르는 그림이 자주 나옵니다.`
          : ji.key === "충"
            ? `첫인상이 강렬합니다. 좋든 싫든 기억에 남는 상대라, 무관심으로 끝나는 경우가 거의 없습니다. 다만 끌림이 곧 편안함은 아니라는 점을 기억하세요.`
            : `서서히 스며드는 유형입니다. 첫 만남의 온도는 미지근해도 볼수록 괜찮아지는 조합이라, 성급하게 판단하지 않는 편이 좋습니다.`,
    },
    {
      title: "연애할 때",
      body: `${gan.detail} ${
        sameYang
          ? "두 사람 모두 같은 음양이라 주도권을 두고 부딪힐 수 있습니다. 결정권을 영역별로 나눠두면 다툼이 크게 줄어듭니다."
          : "음양이 달라 한쪽이 끌고 한쪽이 받쳐주는 균형이 자연스럽게 잡힙니다."
      }`,
    },
    {
      title: "결혼과 오래 가는 힘",
      body:
        score >= 80
          ? `장기전에 강한 조합입니다. 연애보다 결혼 이후에 더 안정되는 유형으로, 생활 리듬이 맞춰지면 웬만한 외부 변수에 흔들리지 않습니다.`
          : score >= 65
            ? `서로의 기본 성향이 다른 만큼 초반 조율이 필요합니다. 그 시기를 넘기면 오히려 서로에게 없는 것을 채워주는 관계가 됩니다. 돈과 시간 쓰는 방식을 먼저 맞춰보세요.`
            : `같이 있는 시간의 밀도가 중요한 조합입니다. 붙어 있는 시간이 길수록 마찰이 늘어나는 유형이라, 각자의 영역을 분명히 두는 것이 오히려 관계를 지킵니다.`,
    },
  ];

  const advice =
    ji.key === "충"
      ? "서로를 바꾸려 들지 마세요. 이 조합은 상대를 설득하려는 순간부터 어긋납니다."
      : ji.key === "해" || ji.key === "파"
        ? "서운한 일은 그날 안에 말하세요. 쌓아두면 이 조합에서는 반드시 터집니다."
        : gan.score < 0
          ? "감정이 올라올 때 대화를 멈추는 규칙 하나만 정해두면 이 궁합의 약점은 거의 사라집니다."
          : "이미 좋은 조합입니다. 당연하게 여기지 않는 것만으로 충분합니다.";

  return {
    score,
    grade: gradeOf(score),
    ji,
    gan,
    a: { ji: sa.year.ji, gan: sa.day.gan, animal: animalA, dayPillar: `${GAN[sa.day.gan]}${JI[sa.day.ji]}` },
    b: { ji: sb.year.ji, gan: sb.day.gan, animal: animalB, dayPillar: `${GAN[sb.day.gan]}${JI[sb.day.ji]}` },
    sections,
    advice,
  };
}

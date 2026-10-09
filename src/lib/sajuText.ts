/** 사주 해석 문구. 계산(saju.ts)과 분리해서 문장만 손볼 수 있게 둔다. */

import { withJosa } from "./josa.ts";
import { GAN, GAN_HANJA, OHAENG, type Ohaeng, type Saju, ohaengCount } from "./saju.ts";

export type DayMaster = {
  title: string;
  image: string;
  personality: string;
  strength: string;
  weakness: string;
  career: string;
  love: string;
};

/** 일간(日干) 10개 — 사주 해석의 중심축. 나 자신을 나타낸다. */
export const DAY_MASTER: DayMaster[] = [
  {
    title: "갑목(甲木)",
    image: "곧게 자라는 큰 나무",
    personality: "위로 곧게 뻗는 나무처럼 원칙이 분명하고 방향이 흔들리지 않습니다. 옳다고 판단한 것은 손해를 보더라도 밀고 나가는 편입니다.",
    strength: "리더십과 추진력. 책임을 맡겨두면 끝까지 해냅니다.",
    weakness: "한번 정한 것을 굽히기 어려워 융통성이 필요한 자리에서 손해를 봅니다.",
    career: "조직의 중심, 교육, 건설, 기획처럼 판을 세우는 일과 잘 맞습니다.",
    love: "표현이 서툴러도 한번 마음을 주면 변치 않습니다. 상대가 먼저 다가와야 풀리는 경우가 많습니다.",
  },
  {
    title: "을목(乙木)",
    image: "바람에 휘는 덩굴과 화초",
    personality: "부드럽지만 쉽게 꺾이지 않습니다. 상황에 맞춰 몸을 낮출 줄 알아 어디에 놓여도 살아남습니다.",
    strength: "적응력과 섬세함. 사람 사이의 미묘한 기류를 잘 읽습니다.",
    weakness: "속으로 담아두다 한꺼번에 터뜨립니다. 거절을 어려워합니다.",
    career: "디자인, 상담, 서비스, 기획 등 사람과 감각을 다루는 일에 강합니다.",
    love: "상대에게 맞춰주는 연애를 하지만, 그만큼 서운함도 쌓입니다. 표현하는 연습이 필요합니다.",
  },
  {
    title: "병화(丙火)",
    image: "온 세상을 비추는 태양",
    personality: "밝고 숨김이 없습니다. 어디에 있든 존재감이 드러나고, 사람을 끌어모으는 힘이 있습니다.",
    strength: "열정과 개방성. 분위기를 바꾸는 재주가 있습니다.",
    weakness: "감정이 얼굴에 그대로 드러나고, 뜨거워졌다 식는 속도가 빠릅니다.",
    career: "영업, 방송, 강연, 브랜딩처럼 드러내는 일에서 빛납니다.",
    love: "직진형입니다. 좋으면 바로 표현하고 식으면 바로 티가 납니다.",
  },
  {
    title: "정화(丁火)",
    image: "어둠을 밝히는 촛불",
    personality: "은근하고 따뜻합니다. 겉으로 요란하지 않지만 곁에 있는 사람을 오래 데워줍니다.",
    strength: "집중력과 배려. 한 분야를 깊게 파는 힘이 있습니다.",
    weakness: "예민하고 생각이 많아 혼자 소모되는 일이 잦습니다.",
    career: "연구, 의료, 예술, 정밀한 기술 분야가 잘 맞습니다.",
    love: "천천히 스며드는 사랑을 합니다. 한번 정을 주면 쉽게 거두지 못합니다.",
  },
  {
    title: "무토(戊土)",
    image: "넓고 단단한 대지",
    personality: "듬직하고 흔들림이 없습니다. 주변 사람들이 기대는 자리에 자연스럽게 놓입니다.",
    strength: "신뢰감과 포용력. 위기에서 중심을 잡습니다.",
    weakness: "변화를 늦게 받아들이고, 속마음을 잘 드러내지 않습니다.",
    career: "부동산, 금융, 행정, 관리직처럼 안정과 신뢰가 필요한 일에 강합니다.",
    love: "무뚝뚝해 보이지만 책임감이 깊습니다. 말보다 행동으로 보여줍니다.",
  },
  {
    title: "기토(己土)",
    image: "곡식을 길러내는 밭흙",
    personality: "온화하고 현실적입니다. 나서지 않으면서도 실속을 챙기는 유형입니다.",
    strength: "성실함과 꼼꼼함. 맡은 일을 조용히 완성합니다.",
    weakness: "걱정이 많고 결정이 느립니다. 손해를 알면서도 참는 편입니다.",
    career: "회계, 교육, 요식업, 실무 전반에서 안정적으로 성과를 냅니다.",
    love: "헌신적이지만 티를 내지 않습니다. 알아봐 주는 상대를 만나야 행복합니다.",
  },
  {
    title: "경금(庚金)",
    image: "제련되지 않은 무쇠",
    personality: "결단이 빠르고 맺고 끊음이 분명합니다. 불의를 보면 참지 못합니다.",
    strength: "의리와 실행력. 한번 결정하면 뒤돌아보지 않습니다.",
    weakness: "직설적인 말이 상처를 남기고, 타협을 손해로 여깁니다.",
    career: "군·경, 법률, 제조, 스포츠 등 원칙과 강단이 필요한 분야가 맞습니다.",
    love: "무심한 듯 챙깁니다. 표현이 거칠어 오해받기 쉽습니다.",
  },
  {
    title: "신금(辛金)",
    image: "잘 다듬어진 보석",
    personality: "깔끔하고 자기 기준이 높습니다. 아무에게나 마음을 열지 않습니다.",
    strength: "심미안과 완성도. 디테일에서 차이를 만듭니다.",
    weakness: "예민하고 자존심이 강해 작은 지적에도 크게 흔들립니다.",
    career: "패션, 주얼리, 의료, 정밀 기술, 컨설팅 등 전문성이 드러나는 일이 좋습니다.",
    love: "까다롭지만 한번 정하면 깊습니다. 상대의 격을 중요하게 봅니다.",
  },
  {
    title: "임수(壬水)",
    image: "쉼 없이 흐르는 큰 강물",
    personality: "생각이 넓고 자유롭습니다. 한곳에 머무르기보다 계속 움직이며 기회를 찾습니다.",
    strength: "포용력과 기획력. 큰 그림을 그리는 데 능합니다.",
    weakness: "시작은 많은데 마무리가 약하고, 속을 알기 어렵다는 말을 듣습니다.",
    career: "무역, 유통, 기획, 해외 관련 업무에서 역량이 발휘됩니다.",
    love: "자유를 존중받고 싶어 합니다. 구속하면 멀어집니다.",
  },
  {
    title: "계수(癸水)",
    image: "땅을 적시는 이슬과 빗물",
    personality: "조용하고 눈치가 빠릅니다. 겉으로 드러내지 않고 상황을 먼저 파악합니다.",
    strength: "직관과 통찰. 사람의 속내를 잘 읽습니다.",
    weakness: "생각이 깊어 행동이 늦고, 마음의 기복이 있습니다.",
    career: "연구, 기획, 상담, 창작 등 깊이 사고하는 일이 어울립니다.",
    love: "섬세하고 헌신적이지만 상처를 오래 담아둡니다.",
  },
];

export const OHAENG_MEANING: Record<Ohaeng, { keyword: string; desc: string }> = {
  목: { keyword: "성장·추진", desc: "뻗어나가는 기운입니다. 계획을 세우고 새로 시작하는 힘을 뜻합니다." },
  화: { keyword: "표현·열정", desc: "위로 타오르는 기운입니다. 드러내고 알리고 사람을 모으는 힘입니다." },
  토: { keyword: "안정·신용", desc: "중심을 잡는 기운입니다. 지키고 쌓고 중재하는 힘을 뜻합니다." },
  금: { keyword: "결단·원칙", desc: "단단하게 굳히는 기운입니다. 정리하고 끊고 완성하는 힘입니다." },
  수: { keyword: "지혜·유연", desc: "아래로 스미는 기운입니다. 생각하고 적응하고 흐르는 힘을 뜻합니다." },
};

/** 오행 상생 순환: 목→화→토→금→수→목 */
const SAENG: Record<Ohaeng, Ohaeng> = { 목: "화", 화: "토", 토: "금", 금: "수", 수: "목" };

export type OhaengReading = {
  counts: Record<Ohaeng, number>;
  total: number;
  strongest: Ohaeng;
  missing: Ohaeng[];
  summary: string;
  advice: string;
};

export function readOhaeng(saju: Saju): OhaengReading {
  const counts = ohaengCount(saju);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const entries = OHAENG.map((o) => [o, counts[o]] as [Ohaeng, number]);
  const strongest = entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  const missing = entries.filter(([, n]) => n === 0).map(([o]) => o);
  const max = counts[strongest];

  const summary =
    missing.length >= 2
      ? `${missing.join("·")}의 기운이 사주에 없고 ${withJosa(strongest, "이/가")} ${max}개로 치우쳐 있습니다. 한쪽으로 쏠린 만큼 그 분야에서는 남다른 힘을 내지만, 없는 기운이 필요한 상황에서는 유독 힘들게 느껴집니다.`
      : missing.length === 1
        ? `${missing[0]}의 기운이 사주에 없습니다. ${OHAENG_MEANING[missing[0]].keyword}에 해당하는 영역이 약점이자 평생의 과제가 됩니다.`
        : max >= total / 2
          ? `${strongest}의 기운이 ${max}개로 전체의 절반을 넘습니다. 장점이 뚜렷한 대신 그 기운이 과해질 때 문제가 생깁니다.`
          : `다섯 기운이 비교적 고르게 분포해 있습니다. 극단으로 치우치지 않아 어떤 환경에서도 무난하게 적응합니다.`;

  const need = missing[0] ?? SAENG[strongest];
  const advice = `${need}의 기운을 보완하면 균형이 잡힙니다. ${OHAENG_MEANING[need].desc} 생활에서는 ${OHAENG_HINT[need]}`;

  return { counts, total, strongest, missing, summary, advice };
}

const OHAENG_HINT: Record<Ohaeng, string> = {
  목: "초록색과 나무 소재를 가까이 두고, 아침 산책이나 새로운 배움을 시작해 보세요.",
  화: "붉은 계열의 색과 밝은 조명, 사람을 만나는 자리가 도움이 됩니다.",
  토: "노란색과 흙·도자기 소재, 규칙적인 생활 리듬이 힘이 됩니다.",
  금: "흰색과 금속 소재, 정리정돈과 명확한 마무리 습관이 좋습니다.",
  수: "검정·남색 계열과 물가, 충분한 수면과 독서가 기운을 채워줍니다.",
};

export const SIPSIN_DESC: Record<string, string> = {
  비견: "나와 어깨를 나란히 하는 기운. 자립심과 경쟁심을 뜻합니다.",
  겁재: "나와 같되 결이 다른 기운. 추진력이 강하지만 재물의 소모도 큽니다.",
  식신: "내가 만들어내는 기운. 표현력과 먹을 복, 여유를 뜻합니다.",
  상관: "내가 쏟아내는 기운. 재능과 끼가 뛰어나지만 규율과 부딪힙니다.",
  편재: "크게 움직이는 재물. 사업 수완과 활동적인 돈의 흐름입니다.",
  정재: "꾸준히 쌓이는 재물. 성실한 수입과 안정적인 관리 능력입니다.",
  편관: "나를 강하게 누르는 기운. 위기 대응력과 카리스마, 압박을 뜻합니다.",
  정관: "나를 바르게 세우는 기운. 명예와 책임, 조직에서의 인정입니다.",
  편인: "치우친 도움. 독특한 재능과 직관, 때로는 고독을 뜻합니다.",
  정인: "바른 도움. 학문과 문서, 윗사람의 후원을 뜻합니다.",
};

export const ganLabel = (gan: number) => `${GAN[gan]}(${GAN_HANJA[gan]})`;

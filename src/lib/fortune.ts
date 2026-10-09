/**
 * 오늘의 운세 — 날짜 시드 기반 결정적 생성.
 *
 * 같은 날·같은 대상이면 항상 같은 결과(SSG/캐시 안전), 날짜가 바뀌면 전부 갱신.
 *
 * 문장은 "흐름 + 조언" 두 조각을 서로소 크기의 풀에서 독립적으로 뽑아 합친다.
 * 단일 풀에서 한 문장씩 뽑으면 풀 크기(=12일)마다 통째로 반복돼서,
 * 매일 재방문하는 사용자에게 2주면 들킨다. 조합식은 13x11=143일 주기라
 * 같은 문장을 다시 보기까지 넉 달 넘게 걸린다.
 */

export type SignKind = "tti" | "zodiac";

export type Sign = {
  id: string;
  name: string;
  emoji: string;
  /** 한 줄 성격 요약 */
  trait: string;
  /** 띠: 지지 표기 / 별자리: 기간 표기 */
  period: string;
};

/** color: 캐릭터·카드 틴트에 쓰는 띠 대표 파스텔색 */
export type Tti = Sign & { id: TtiId; baseYear: number; color: string };
export type Zodiac = Sign & { from: [number, number]; to: [number, number] };

// id 유니온(TtiId)을 이 데이터에서 뽑는다 — 오타는 컴파일 에러
const TTI_DATA = [
  { id: "rat", color: "#cdc7e8", name: "쥐띠", emoji: "🐭", baseYear: 2020, period: "자(子)", trait: "눈치가 빠르고 위기에서 길을 먼저 찾는다" },
  { id: "ox", color: "#e6d9c3", name: "소띠", emoji: "🐮", baseYear: 2021, period: "축(丑)", trait: "느려 보여도 끝까지 가서 결국 이룬다" },
  { id: "tiger", color: "#f8c08b", name: "호랑이띠", emoji: "🐯", baseYear: 2022, period: "인(寅)", trait: "추진력이 강하고 굽히는 법이 없다" },
  { id: "rabbit", color: "#f9d6e6", name: "토끼띠", emoji: "🐰", baseYear: 2023, period: "묘(卯)", trait: "섬세하고 사람 사이의 온도를 잘 읽는다" },
  { id: "dragon", color: "#a8dcc5", name: "용띠", emoji: "🐲", baseYear: 2024, period: "진(辰)", trait: "판을 키우는 배포와 타고난 존재감이 있다" },
  { id: "snake", color: "#cfe39f", name: "뱀띠", emoji: "🐍", baseYear: 2025, period: "사(巳)", trait: "속을 잘 드러내지 않고 한 수 앞을 본다" },
  { id: "horse", color: "#b7d3ee", name: "말띠", emoji: "🐴", baseYear: 2026, period: "오(午)", trait: "활동적이고 답답한 상황을 오래 못 견딘다" },
  { id: "goat", color: "#f3e4a4", name: "양띠", emoji: "🐑", baseYear: 2015, period: "미(未)", trait: "정이 많고 주변을 편하게 만든다" },
  { id: "monkey", color: "#dcb9a0", name: "원숭이띠", emoji: "🐵", baseYear: 2016, period: "신(申)", trait: "재주가 많고 어디서든 방법을 찾아낸다" },
  { id: "rooster", color: "#f5aea6", name: "닭띠", emoji: "🐔", baseYear: 2017, period: "유(酉)", trait: "꼼꼼하고 자기 기준이 분명하다" },
  { id: "dog", color: "#ecc890", name: "개띠", emoji: "🐶", baseYear: 2018, period: "술(戌)", trait: "의리가 깊고 한번 믿으면 끝까지 간다" },
  { id: "pig", color: "#f4b9c6", name: "돼지띠", emoji: "🐷", baseYear: 2019, period: "해(亥)", trait: "복이 있고 베푼 만큼 돌려받는다" },
] as const satisfies readonly (Sign & { baseYear: number; color: string })[];

export type TtiId = (typeof TTI_DATA)[number]["id"];
export const TTI: Tti[] = [...TTI_DATA];

export const ZODIAC: Zodiac[] = [
  { id: "aries", name: "양자리", emoji: "♈", from: [3, 21], to: [4, 19], period: "3.21~4.19", trait: "시작하는 힘이 강하고 망설임이 짧다" },
  { id: "taurus", name: "황소자리", emoji: "♉", from: [4, 20], to: [5, 20], period: "4.20~5.20", trait: "한번 정하면 흔들리지 않는 뚝심이 있다" },
  { id: "gemini", name: "쌍둥이자리", emoji: "♊", from: [5, 21], to: [6, 21], period: "5.21~6.21", trait: "호기심이 많고 말재주가 뛰어나다" },
  { id: "cancer", name: "게자리", emoji: "♋", from: [6, 22], to: [7, 22], period: "6.22~7.22", trait: "감정이 깊고 내 사람을 끝까지 챙긴다" },
  { id: "leo", name: "사자자리", emoji: "♌", from: [7, 23], to: [8, 22], period: "7.23~8.22", trait: "당당하고 중심에 서는 것이 어색하지 않다" },
  { id: "virgo", name: "처녀자리", emoji: "♍", from: [8, 23], to: [9, 22], period: "8.23~9.22", trait: "분석적이고 디테일을 놓치지 않는다" },
  { id: "libra", name: "천칭자리", emoji: "♎", from: [9, 23], to: [10, 22], period: "9.23~10.22", trait: "균형 감각이 좋고 조율에 능하다" },
  { id: "scorpio", name: "전갈자리", emoji: "♏", from: [10, 23], to: [11, 22], period: "10.23~11.22", trait: "집중력이 깊고 한번 빠지면 끝을 본다" },
  { id: "sagittarius", name: "사수자리", emoji: "♐", from: [11, 23], to: [12, 21], period: "11.23~12.21", trait: "자유롭고 늘 새로운 곳을 향한다" },
  { id: "capricorn", name: "염소자리", emoji: "♑", from: [12, 22], to: [1, 19], period: "12.22~1.19", trait: "현실적이고 목표를 향해 꾸준하다" },
  { id: "aquarius", name: "물병자리", emoji: "♒", from: [1, 20], to: [2, 18], period: "1.20~2.18", trait: "독창적이고 남과 다른 길을 택한다" },
  { id: "pisces", name: "물고기자리", emoji: "♓", from: [2, 19], to: [3, 20], period: "2.19~3.20", trait: "공감 능력이 뛰어나고 직관이 밝다" },
];

export const signs = (kind: SignKind): Sign[] => (kind === "tti" ? TTI : ZODIAC);
export const findSign = (kind: SignKind, id: string) => signs(kind).find((s) => s.id === id);

export function birthYears(tti: Tti, count = 7): number[] {
  return Array.from({ length: count }, (_, i) => tti.baseYear - 12 * i).filter((y) => y >= 1936);
}

export function zodiacOf(month: number, day: number): Zodiac {
  return (
    ZODIAC.find((z) => {
      const [fm, fd] = z.from;
      const [tm, td] = z.to;
      const after = month > fm || (month === fm && day >= fd);
      const before = month < tm || (month === tm && day <= td);
      return fm > tm ? after || before : after && before; // 염소자리는 연말~연초를 걸친다
    }) ?? ZODIAC[9]
  );
}

/** 띠 운세는 통념대로 양력 연도로 잡는다 (간지 연주는 saju.ts에서 입춘 기준으로 따로 계산) */
export function ttiOf(year: number): Tti {
  return TTI.find((t) => (((t.baseYear - year) % 12) + 12) % 12 === 0)!;
}

/**
 * 지지 인덱스(자0 ~ 해11) → 띠. TTI 배열을 지지 순서 그대로 정의해 뒀다.
 * 사주의 연지는 입춘 기준이라 양력 연도로 구한 ttiOf()와 1~2월생은 결과가 다를 수 있다.
 */
export const ttiOfJi = (ji: number): Tti => TTI[ji];

// ── 문장 조각 ──────────────────────────────────────────────
// A(흐름) x B(조언) 조합. 풀 크기를 서로소로 둬서 반복 주기를 최대로 늘린다.

/**
 * 흐름 문장과 그 기운(1 좋음 · 0 보통 · -1 조심). 별점은 이 기운에서 정한다 —
 * 따로 뽑으면 "귀인의 손길이 닿는다"에 별 하나·걱정 표정이 붙는 날이 생긴다.
 */
const FLOW: [string, -1 | 0 | 1][] = [
  ["막혀 있던 일이 조금씩 풀리기 시작하는 날입니다.", 1],
  ["겉은 조용하지만 속에서 기회가 무르익고 있습니다.", 1],
  ["주변의 평가보다 내 판단이 정확한 하루입니다.", 1],
  ["작은 실수가 유난히 눈에 띄기 쉬운 날입니다.", -1],
  ["귀인의 손길이 닿는 시기에 들어섰습니다.", 1],
  ["서두르면 손해, 기다리면 이득인 흐름입니다.", 0],
  ["새로운 제안이나 인연이 문을 두드립니다.", 1],
  ["지난 노력의 결실이 슬슬 눈에 보이기 시작합니다.", 1],
  ["감정이 앞서기 쉬워 말이 화근이 될 수 있습니다.", -1],
  ["밖보다 안이 든든해야 하는 하루입니다.", 0],
  ["미뤄둔 결정을 더는 미룰 수 없게 됩니다.", 0],
  ["익숙한 자리에서 낯선 기회를 발견합니다.", 1],
  ["경쟁이나 비교에 마음이 흔들리기 쉬운 날입니다.", -1],
];

const ADVICE = [
  "욕심을 한 뼘만 줄이면 오히려 더 큰 것이 들어옵니다.",
  "먼저 연락을 건네는 쪽이 주도권을 쥡니다.",
  "마무리를 한 번 더 점검하는 것이 곧 실력입니다.",
  "도움을 청하는 것을 부끄러워하지 마세요.",
  "속도를 늦추는 것이 오늘의 상책입니다.",
  "조건보다 사람을 보면 후회가 없습니다.",
  "말 한마디를 아끼면 관계가 지켜집니다.",
  "기록으로 남겨두면 나중에 근거가 됩니다.",
  "혼자 끌어안지 말고 절반은 나누세요.",
  "익숙한 방식을 한 번쯤 의심해볼 만합니다.",
  "오늘 시작한 작은 습관이 오래 갑니다.",
];

const LOVE_A = [
  "마음이 통하는 순간이 찾아옵니다.",
  "사소한 오해가 쌓이기 쉬운 날입니다.",
  "상대의 말보다 행동이 눈에 들어옵니다.",
  "익숙한 사람의 새로운 면을 보게 됩니다.",
  "우연한 만남이 인연으로 이어질 수 있습니다.",
  "표현이 부족하면 서운함이 남습니다.",
  "과거의 인연에게서 소식이 옵니다.",
  "관계의 온도를 확인하게 되는 하루입니다.",
  "혼자만의 시간이 필요해지는 날입니다.",
  "상대가 먼저 손을 내밀어 옵니다.",
  "가벼운 약속이 좋은 흐름을 만듭니다.",
  "감정보다 타이밍이 중요해지는 시기입니다.",
  "솔직함이 밀당보다 통하는 날입니다.",
];

const LOVE_B = [
  "먼저 다가가면 생각보다 쉽게 풀립니다.",
  "듣는 쪽에 서면 오해가 사라집니다.",
  "작은 표현 하나가 큰 감동이 됩니다.",
  "조급함만 내려놓으면 충분합니다.",
  "확인하려 들수록 오히려 멀어집니다.",
  "기대는 말로 꺼내야 전해집니다.",
  "오늘은 판단을 미뤄도 괜찮습니다.",
  "함께 있는 시간의 질을 챙기세요.",
  "지나간 일은 꺼내지 않는 편이 낫습니다.",
];

const MONEY_A = [
  "예상 밖의 수입이 들어올 수 있습니다.",
  "충동적인 지출이 생기기 쉬운 날입니다.",
  "묵혀둔 돈에 대한 소식이 들립니다.",
  "정보가 곧 돈이 되는 하루입니다.",
  "새는 돈이 눈에 보이기 시작합니다.",
  "계약이나 서류를 다루게 됩니다.",
  "작은 부수입의 기회가 스칩니다.",
  "지인과의 금전 문제가 불거질 수 있습니다.",
  "체면 때문에 쓰는 돈이 늘어납니다.",
  "투자보다 현상 유지가 유리한 흐름입니다.",
  "목돈이 나갈 일이 생깁니다.",
  "오래 묵혀둔 물건을 정리할 때가 됐습니다.",
  "수입보다 지출 구조가 문제로 드러납니다.",
];

const MONEY_B = [
  "계획을 세우고 쓰면 손해가 없습니다.",
  "두 번 확인하면 손실을 막습니다.",
  "오늘의 결정은 하루만 묵혀두세요.",
  "빌려주는 일은 피하는 것이 좋습니다.",
  "작게 시작하는 쪽이 안전합니다.",
  "남의 말보다 숫자를 믿으세요.",
  "당장의 이익보다 흐름을 보세요.",
  "저축 쪽으로 방향을 잡으면 좋습니다.",
  "기록해두면 다음 달이 편해집니다.",
];

const WORK_A = [
  "맡은 일의 범위가 넓어집니다.",
  "윗사람의 인정을 받는 흐름입니다.",
  "협업에서 의견 차이가 생깁니다.",
  "미뤄둔 업무가 발목을 잡습니다.",
  "새로운 역할을 제안받을 수 있습니다.",
  "경쟁자의 움직임이 신경 쓰입니다.",
  "실력을 보여줄 자리가 만들어집니다.",
  "커뮤니케이션에서 오해가 생기기 쉽습니다.",
  "배운 것을 써먹을 기회가 옵니다.",
  "마무리 단계의 일이 한꺼번에 몰립니다.",
  "이직이나 변화를 고민하게 됩니다.",
  "뜻밖의 사람이 도움을 줍니다.",
  "반복되던 문제의 원인이 드러납니다.",
];

const WORK_B = [
  "먼저 정리해서 공유하면 앞서갑니다.",
  "혼자 판단하지 말고 한 번 물어보세요.",
  "오늘은 새 일보다 마무리가 우선입니다.",
  "티 내지 않아도 보는 사람은 봅니다.",
  "우선순위를 다시 적어보면 길이 보입니다.",
  "감정은 빼고 사실만 전달하세요.",
  "기한을 먼저 못 박아두면 편해집니다.",
  "작은 성과라도 남겨두는 것이 유리합니다.",
  "무리한 약속은 하지 않는 편이 낫습니다.",
];

const HEALTH_A = [
  "묵은 피로가 한꺼번에 몰려옵니다.",
  "어깨와 목의 긴장이 심해집니다.",
  "수면 리듬이 흐트러지기 쉽습니다.",
  "소화기가 예민해지는 날입니다.",
  "눈의 피로가 집중력을 떨어뜨립니다.",
  "기분의 기복이 몸으로 나타납니다.",
  "작은 통증을 무시하기 쉬운 때입니다.",
  "체력이 평소보다 빨리 바닥납니다.",
  "환절기의 영향을 받기 쉽습니다.",
  "앉아 있는 시간이 지나치게 길어집니다.",
  "식사 시간이 불규칙해집니다.",
  "두통이나 결림이 신호를 보냅니다.",
  "컨디션이 서서히 올라오는 흐름입니다.",
];

const HEALTH_B = [
  "가벼운 산책만으로도 회복됩니다.",
  "물을 자주 마시면 흐름이 좋아집니다.",
  "일찍 눕는 것이 최고의 처방입니다.",
  "찬 음식은 잠시 미뤄두세요.",
  "한 시간에 한 번은 일어나 움직이세요.",
  "카페인을 줄이면 밤이 편해집니다.",
  "무리한 운동은 오히려 독이 됩니다.",
  "햇볕과 환기가 기분을 끌어올립니다.",
  "참지 말고 한 번 진료받아 보세요.",
];

const LUCKY_COLOR = ["남색", "금색", "자주색", "흰색", "초록색", "붉은색", "검정색", "하늘색", "노란색", "분홍색", "회색", "베이지색", "청록색"];
const LUCKY_ITEM = ["손수건", "향초", "만년필", "동전 지갑", "머플러", "작은 화분", "책 한 권", "텀블러", "우산", "열쇠고리", "손목시계", "이어폰", "노트"];
const LUCKY_PLACE = ["서점", "카페", "공원", "도서관", "시장", "전시장", "바다가 보이는 곳", "동네 산책로", "오래된 골목", "높은 층의 창가", "조용한 식당"];

export type DailyFortune = {
  sign: Sign;
  kind: SignKind;
  date: string;
  score: number; // 1~5
  summary: string;
  love: string;
  money: string;
  work: string;
  health: string;
  luckyColor: string;
  luckyNumber: number;
  luckyItem: string;
  luckyPlace: string;
};

/** Asia/Seoul 기준 오늘 날짜 (YYYY-MM-DD) */
export function todayKST(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** YYYY-MM-DD → 1970-01-01 이후 경과 일수 */
export function dayIndex(date: string): number {
  const t = Date.parse(`${date}T00:00:00Z`);
  if (Number.isNaN(t)) throw new Error(`invalid date: ${date}`);
  return Math.floor(t / 86_400_000);
}

const at = <T,>(pool: T[], seed: number): T => pool[((seed % pool.length) + pool.length) % pool.length];
const join = (a: string[], b: string[], s1: number, s2: number) => `${at(a, s1)} ${at(b, s2)}`;

/**
 * 32비트 정수 해시. 선형 식(d*3 + i*7)은 주기가 그대로 드러나서
 * 5일마다 같은 별점표가 돌아왔다. 흔들림 한 칸은 여기서 뽑는다.
 */
const hash = (n: number) => {
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
  return (n ^ (n >>> 16)) >>> 0;
};

export function getDailyFortune(sign: Sign, kind: SignKind, date = todayKST()): DailyFortune {
  const d = dayIndex(date);
  // 별자리는 띠와 겹치지 않는 시드 공간을 쓰도록 오프셋을 준다
  const i = signs(kind).findIndex((s) => s.id === sign.id) + (kind === "zodiac" ? 37 : 0);
  const [flow, tone] = at(FLOW, d + i * 5);
  const jitter = hash(d * 64 + i) % 2;

  return {
    sign,
    kind,
    date,
    // 좋음 4~5 · 보통 3 · 조심 1~2
    score: tone === 0 ? 3 : tone > 0 ? 4 + jitter : 2 - jitter,
    summary: `${flow} ${at(ADVICE, d * 3 + i * 8)}`,
    love: join(LOVE_A, LOVE_B, d + i * 4, d * 2 + i * 7),
    money: join(MONEY_A, MONEY_B, d + i * 6, d * 4 + i * 5),
    work: join(WORK_A, WORK_B, d + i * 9, d * 5 + i * 2),
    health: join(HEALTH_A, HEALTH_B, d + i * 11, d * 7 + i * 4),
    luckyColor: at(LUCKY_COLOR, d + i * 4),
    luckyNumber: 1 + ((((d * 7 + i * 13) % 45) + 45) % 45),
    luckyItem: at(LUCKY_ITEM, d * 4 + i * 9),
    luckyPlace: at(LUCKY_PLACE, d * 2 + i * 6),
  };
}

export const getAllDailyFortunes = (kind: SignKind, date = todayKST()) =>
  signs(kind).map((s) => getDailyFortune(s, kind, date));

/**
 * 오늘의 행운 동물 — 최고점 중 하나를 날짜로 고른다.
 * 첫 번째 최고점을 집으면 배열 앞쪽 띠만 뽑혀서, 뱀띠~돼지띠는 한 번도 행운 동물이 되지 못했다.
 */
export function luckyOf(list: DailyFortune[]): DailyFortune {
  const top = Math.max(...list.map((f) => f.score));
  const best = list.filter((f) => f.score === top);
  return best[hash(dayIndex(list[0].date)) % best.length];
}

// ── 년생별 한 줄 운세 ──────────────────────────────────────
// 신문 띠별 운세처럼 "72년생 — 흐름. 조언." 한 줄. 연령대마다 관심사가 달라 풀을 나눴다.
// 흐름 11 x 조언 7 (서로소) = 77일 주기.

const YEAR_POOLS = {
  // 10~30대: 진로·연애
  young: {
    flow: [
      "준비해 온 일에 기회가 닿는 날.",
      "마음에 둔 사람과 거리가 좁혀진다.",
      "진로 고민에 실마리가 보인다.",
      "새 모임에서 좋은 인연을 만난다.",
      "배운 것을 인정받을 자리가 생긴다.",
      "연락이 뜸하던 사람이 먼저 찾는다.",
      "선택지가 늘어 오히려 머리가 복잡하다.",
      "작은 도전이 큰 자신감으로 돌아온다.",
      "감정 표현에 따라 관계의 온도가 바뀐다.",
      "면접·시험 같은 평가에 운이 따른다.",
      "비교하는 마음이 발목을 잡기 쉽다.",
    ],
    advice: [
      "망설이지 말고 먼저 움직일 것.",
      "지원서는 한 번 더 다듬을 것.",
      "속마음은 짧고 솔직하게.",
      "남의 속도에 맞추지 말 것.",
      "저녁 약속은 가볍게 잡을 것.",
      "기록해 두면 기회가 된다.",
      "오늘 거절은 내일의 여유.",
    ],
  },
  // 40~50대: 가정·재물·직장
  middle: {
    flow: [
      "오래 묵힌 일이 풀리는 날.",
      "집안에 웃을 일이 생긴다.",
      "직장에서 맡은 일의 무게가 늘어난다.",
      "새는 돈을 막을 방법이 보인다.",
      "배우자와 대화가 잘 통하는 하루.",
      "윗사람과 아랫사람 사이에서 조율할 일이 생긴다.",
      "미뤄 둔 서류·계약을 정리할 때.",
      "뜻밖의 수입이 작게나마 들어온다.",
      "자녀 문제로 마음 쓸 일이 생긴다.",
      "그간의 성실함이 평가받는다.",
      "지출이 겹쳐 지갑이 가벼워진다.",
    ],
    advice: [
      "서두르지 말 것.",
      "큰돈은 하루 묵혀 결정할 것.",
      "가족과 저녁 한 끼를 챙길 것.",
      "말보다 숫자를 믿을 것.",
      "보증·대여는 피할 것.",
      "칭찬 한마디를 아끼지 말 것.",
      "무리한 약속은 하지 말 것.",
    ],
  },
  // 60대 이상: 건강·자녀·여유
  senior: {
    flow: [
      "몸과 마음이 한결 가벼운 날.",
      "자녀에게서 반가운 소식이 온다.",
      "오랜 벗과 옛이야기로 웃는다.",
      "작은 욕심을 내려놓으니 마음이 편하다.",
      "손주 재롱에 시름을 잊는다.",
      "무릎·허리가 날씨를 먼저 안다.",
      "집 안 정리에서 잊었던 물건을 찾는다.",
      "베푼 정이 고마움으로 돌아온다.",
      "혈압·혈당 관리에 신경 쓸 때.",
      "가까운 나들이에 좋은 기운이 있다.",
      "자녀 일에 한마디 보태고 싶어진다.",
    ],
    advice: [
      "가벼운 산책이 보약.",
      "잔소리는 한 번만.",
      "약은 제때 챙길 것.",
      "물을 자주 마실 것.",
      "밤길은 조심할 것.",
      "먼저 안부 전화를 걸 것.",
      "좋아하는 음식 한 가지를 즐길 것.",
    ],
  },
};

export type AgeGroup = keyof typeof YEAR_POOLS;

export const ageGroup = (age: number): AgeGroup => (age < 40 ? "young" : age < 60 ? "middle" : "senior");

/** 72 → "72년생" */
export const yearLabel = (year: number) => `${String(year).slice(2)}년생`;

/**
 * 운세를 보여줄 출생년도 — 1936년 이후, 그해 기준 10세 이상(연 나이). 최신순.
 * 10대는 20~30대와 같은 진로·연애 풀을 쓴다.
 */
export function fortuneBirthYears(tti: Tti, date = todayKST()): number[] {
  const thisYear = Number(date.slice(0, 4));
  return birthYears(tti, 12).filter((y) => thisYear - y >= 10);
}

/**
 * 카드용 "60·72·84·96·08년생". 기본은 10~69세(항상 다섯 해), 오래된 순.
 * 대표 출생년도만 짧게 보일 땐 [13, 48] — 36년 폭이라 항상 세 해.
 */
export const cardYears = (tti: Tti, date = todayKST(), [minAge, maxAge] = [10, 69]) =>
  `${fortuneBirthYears(tti, date)
    .filter((y) => Number(date.slice(0, 4)) - y >= minAge && Number(date.slice(0, 4)) - y <= maxAge)
    .reverse()
    .map((y) => String(y).slice(2))
    .join("·")}년생`;

// ── 캐릭터 표정 ────────────────────────────────────────────
export const MOODS = ["normal", "happy", "worried"] as const;
export type Mood = (typeof MOODS)[number];
/** 오늘의 운세 점수(1~5) → 표정 */
export const fortuneMood = (score: number): Mood => (score >= 4 ? "happy" : score === 3 ? "normal" : "worried");
/** 궁합 점수(0~100) → 표정. 궁합 페이지 막대 색 기준(80/65)과 같다. */
export const gunghapMood = (score: number): Mood => (score >= 80 ? "happy" : score >= 65 ? "normal" : "worried");

export type YearFortune = { year: number; group: AgeGroup; text: string };

/** 띠 안의 년생별 한 줄 운세. 같은 날 같은 띠 안에서는 문장이 겹치지 않는다. */
export function getYearFortunes(tti: Tti, date = todayKST()): YearFortune[] {
  const d = dayIndex(date);
  const i = TTI.findIndex((t) => t.id === tti.id);
  const thisYear = Number(date.slice(0, 4));
  const used: Record<AgeGroup, number> = { young: 0, middle: 0, senior: 0 };
  return fortuneBirthYears(tti, date).map((year) => {
    const group = ageGroup(thisYear - year);
    // 같은 연령대 안에서는 흐름 인덱스를 1씩 밀어 겹치지 않게 한다 (한 띠의 같은 연령대는 최대 4개 < 풀 크기 11)
    const j = used[group]++;
    const { flow, advice } = YEAR_POOLS[group];
    return { year, group, text: join(flow, advice, d + i * 3 + j, d * 3 + i * 5 + j) };
  });
}

/** "2026-09-26" → "2026년 9월 26일 토요일" */
export function formatKoreanDate(date: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date(`${date}T00:00:00Z`));
}

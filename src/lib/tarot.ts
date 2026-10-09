/** 타로 메이저 아르카나 22장. 뽑기는 클라이언트에서 하고, 여기엔 데이터만 둔다. */

export type TarotCard = {
  no: number;
  name: string;
  en: string;
  symbol: string;
  keywords: string[];
  upright: string;
  reversed: string;
};

export const MAJOR: TarotCard[] = [
  {
    no: 0,
    name: "바보",
    en: "The Fool",
    symbol: "🌤",
    keywords: ["새출발", "모험", "순수"],
    upright: "아무것도 정해지지 않았기에 무엇이든 될 수 있는 자리입니다. 계산이 서지 않아도 일단 발을 떼는 것이 맞는 시기입니다.",
    reversed: "준비 없이 뛰어들어 손해를 볼 수 있습니다. 설레는 마음과 무모함을 구분해야 할 때입니다.",
  },
  {
    no: 1,
    name: "마법사",
    en: "The Magician",
    symbol: "🪄",
    keywords: ["실행력", "재능", "시작"],
    upright: "필요한 것은 이미 손안에 다 있습니다. 미루지 말고 지금 가진 것으로 시작하면 됩니다.",
    reversed: "능력은 있는데 방향이 어긋나 있습니다. 말만 앞서고 있지는 않은지 점검해 보세요.",
  },
  {
    no: 2,
    name: "여사제",
    en: "The High Priestess",
    symbol: "🌙",
    keywords: ["직관", "비밀", "기다림"],
    upright: "답은 밖이 아니라 안에 있습니다. 서둘러 움직이기보다 조용히 지켜볼 때 길이 보입니다.",
    reversed: "감춰진 사실이 드러나거나, 직감을 무시해 일이 꼬입니다. 찜찜한 느낌을 넘기지 마세요.",
  },
  {
    no: 3,
    name: "여황제",
    en: "The Empress",
    symbol: "🌾",
    keywords: ["풍요", "애정", "결실"],
    upright: "베푼 만큼 돌아오는 시기입니다. 관계도 일도 무르익어 결실을 맺습니다.",
    reversed: "지나친 간섭이나 의존이 관계를 무겁게 만듭니다. 한 발짝 떨어질 필요가 있습니다.",
  },
  {
    no: 4,
    name: "황제",
    en: "The Emperor",
    symbol: "🏛",
    keywords: ["권위", "질서", "책임"],
    upright: "원칙을 세우고 밀고 나가면 인정받습니다. 결정권을 쥐게 되는 흐름입니다.",
    reversed: "고집이 독이 됩니다. 통제하려 들수록 사람이 멀어집니다.",
  },
  {
    no: 5,
    name: "교황",
    en: "The Hierophant",
    symbol: "🕯",
    keywords: ["가르침", "전통", "조언"],
    upright: "경험 많은 사람의 조언이 정확합니다. 검증된 방식을 따르는 것이 안전합니다.",
    reversed: "틀에 갇혀 있습니다. 관행이라는 이유로 참아온 것을 다시 볼 때입니다.",
  },
  {
    no: 6,
    name: "연인",
    en: "The Lovers",
    symbol: "💞",
    keywords: ["사랑", "선택", "조화"],
    upright: "마음이 통하는 인연이 가까이 있습니다. 두 가지 중 하나를 고른다면 마음이 기우는 쪽이 맞습니다.",
    reversed: "결정을 미루다 기회를 놓칩니다. 관계에서 한쪽만 애쓰고 있지 않은지 보세요.",
  },
  {
    no: 7,
    name: "전차",
    en: "The Chariot",
    symbol: "🛞",
    keywords: ["전진", "의지", "승리"],
    upright: "밀어붙이면 돌파됩니다. 흔들리지 않는 목표가 있다면 지금이 속도를 낼 때입니다.",
    reversed: "방향 없이 힘만 쓰고 있습니다. 잠시 멈춰 목적지를 다시 확인하세요.",
  },
  {
    no: 8,
    name: "힘",
    en: "Strength",
    symbol: "🦁",
    keywords: ["인내", "용기", "다스림"],
    upright: "힘으로 누르기보다 부드러움이 이깁니다. 감정을 다스리는 쪽이 결국 주도권을 가집니다.",
    reversed: "자신감이 떨어져 있습니다. 잘하던 것부터 하나씩 되찾아 보세요.",
  },
  {
    no: 9,
    name: "은둔자",
    en: "The Hermit",
    symbol: "🏮",
    keywords: ["성찰", "고독", "탐색"],
    upright: "혼자 정리하는 시간이 필요합니다. 지금의 고립은 도피가 아니라 준비입니다.",
    reversed: "너무 오래 혼자 있었습니다. 이제는 문을 열고 나갈 때입니다.",
  },
  {
    no: 10,
    name: "운명의 수레바퀴",
    en: "Wheel of Fortune",
    symbol: "🎡",
    keywords: ["전환", "기회", "흐름"],
    upright: "판이 바뀝니다. 노력과 무관하게 찾아온 기회이니 붙잡는 쪽이 이득입니다.",
    reversed: "흐름이 한 박자 늦습니다. 지금은 버티는 것 자체가 전략입니다.",
  },
  {
    no: 11,
    name: "정의",
    en: "Justice",
    symbol: "⚖️",
    keywords: ["균형", "공정", "결과"],
    upright: "뿌린 대로 거둡니다. 계약이나 판단이 공정하게 정리됩니다.",
    reversed: "억울한 일이 생기거나 판단이 한쪽으로 기웁니다. 감정을 빼고 사실만 보세요.",
  },
  {
    no: 12,
    name: "매달린 사람",
    en: "The Hanged Man",
    symbol: "🙃",
    keywords: ["보류", "관점전환", "희생"],
    upright: "지금은 나아가는 대신 다르게 보는 시기입니다. 멈춤이 곧 손해는 아닙니다.",
    reversed: "의미 없는 기다림이 길어지고 있습니다. 놓아야 할 것을 붙들고 있지 않은지 보세요.",
  },
  {
    no: 13,
    name: "죽음",
    en: "Death",
    symbol: "🌑",
    keywords: ["끝", "변화", "재생"],
    upright: "하나가 끝나야 다음이 옵니다. 두렵더라도 매듭을 짓는 편이 낫습니다.",
    reversed: "끝난 일을 붙잡고 있습니다. 미련이 다음 문을 막고 있습니다.",
  },
  {
    no: 14,
    name: "절제",
    en: "Temperance",
    symbol: "🫗",
    keywords: ["조절", "치유", "중용"],
    upright: "극단을 피하면 자연스럽게 풀립니다. 속도를 맞추는 것이 관건입니다.",
    reversed: "한쪽으로 치우쳐 있습니다. 무리한 일정이나 감정 소모를 줄이세요.",
  },
  {
    no: 15,
    name: "악마",
    en: "The Devil",
    symbol: "⛓",
    keywords: ["집착", "유혹", "속박"],
    upright: "끊어야 할 줄 알면서 못 끊는 것이 있습니다. 그게 무엇인지는 이미 알고 있습니다.",
    reversed: "묶여 있던 것에서 벗어납니다. 결심만 하면 생각보다 쉽게 끊어집니다.",
  },
  {
    no: 16,
    name: "탑",
    en: "The Tower",
    symbol: "🗼",
    keywords: ["붕괴", "충격", "각성"],
    upright: "예상 못 한 변화가 옵니다. 당장은 무너지는 것처럼 보여도 부실한 것이 먼저 무너질 뿐입니다.",
    reversed: "올 것이 미뤄지고 있습니다. 지금 점검하면 충격을 줄일 수 있습니다.",
  },
  {
    no: 17,
    name: "별",
    en: "The Star",
    symbol: "⭐",
    keywords: ["희망", "회복", "영감"],
    upright: "어두운 구간을 지났습니다. 천천히, 그러나 분명히 좋아집니다.",
    reversed: "기대가 꺾여 지쳐 있습니다. 목표를 조금 낮추면 다시 움직일 힘이 생깁니다.",
  },
  {
    no: 18,
    name: "달",
    en: "The Moon",
    symbol: "🌘",
    keywords: ["불안", "혼란", "무의식"],
    upright: "상황이 또렷하지 않습니다. 지금 내린 결론은 나중에 달라질 수 있습니다.",
    reversed: "안개가 걷힙니다. 오해였던 것들이 하나씩 제자리를 찾습니다.",
  },
  {
    no: 19,
    name: "태양",
    en: "The Sun",
    symbol: "☀️",
    keywords: ["성공", "기쁨", "활력"],
    upright: "숨길 것 없이 잘 풀립니다. 자신 있게 드러내도 좋은 시기입니다.",
    reversed: "좋은 일이 있어도 온전히 누리지 못합니다. 지나친 욕심이 기쁨을 갉아먹습니다.",
  },
  {
    no: 20,
    name: "심판",
    en: "Judgement",
    symbol: "📯",
    keywords: ["결산", "부활", "부름"],
    upright: "지난 일의 결론이 납니다. 다시 기회를 얻는 흐름이니 놓치지 마세요.",
    reversed: "결정을 계속 미루고 있습니다. 후회는 선택하지 않은 쪽에서 더 크게 옵니다.",
  },
  {
    no: 21,
    name: "세계",
    en: "The World",
    symbol: "🌍",
    keywords: ["완성", "성취", "통합"],
    upright: "한 사이클이 마무리됩니다. 충분히 해냈으니 다음 단계로 넘어가도 좋습니다.",
    reversed: "마무리가 덜 됐습니다. 미완의 하나가 다음 일의 발목을 잡습니다.",
  },
];

export const SPREAD = [
  { key: "past", label: "과거", hint: "지금 상황을 만든 배경" },
  { key: "present", label: "현재", hint: "지금 놓인 자리" },
  { key: "future", label: "미래", hint: "이대로 갔을 때의 흐름" },
] as const;

export type Drawn = { card: TarotCard; reversed: boolean };

/** 덱에서 n장을 중복 없이 뽑는다. rng를 주입할 수 있어 테스트가 가능하다. */
export function draw(n: number, rng: () => number = Math.random): Drawn[] {
  if (n > MAJOR.length) throw new Error(`${MAJOR.length}장을 넘겨 뽑을 수 없습니다`);
  const deck = [...MAJOR];
  const out: Drawn[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rng() * deck.length);
    out.push({ card: deck.splice(idx, 1)[0], reversed: rng() < 0.5 });
  }
  return out;
}

export const meaning = (d: Drawn) => (d.reversed ? d.card.reversed : d.card.upright);

/**
 * 뽑은 카드 ↔ URL. "3-10r-21" = 3번 정방향, 10번 역방향, 21번 정방향.
 * 결과가 주소에 남아야 공유한 사람도 같은 카드를 보고, 결과 보기가 한 번의 페이지 이동이 된다.
 */
export const spreadQuery = (drawn: Drawn[]) => drawn.map((d) => `${d.card.no}${d.reversed ? "r" : ""}`).join("-");

/** 형식이 어긋나거나, 장수가 SPREAD와 다르거나, 같은 카드가 두 번 나오면 null */
export function parseSpread(q: string | undefined): Drawn[] | null {
  const parts = q?.split("-") ?? [];
  if (parts.length !== SPREAD.length) return null;
  const drawn: Drawn[] = [];
  for (const p of parts) {
    const m = /^(\d{1,2})(r?)$/.exec(p);
    const card = m && MAJOR.find((c) => c.no === Number(m[1]));
    if (!card || drawn.some((d) => d.card === card)) return null;
    drawn.push({ card, reversed: m[2] === "r" });
  }
  return drawn;
}

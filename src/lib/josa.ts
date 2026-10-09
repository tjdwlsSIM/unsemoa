/**
 * 한국어 조사 자동 선택.
 *
 * 운세 문장은 "계(수)와", "금이", "목으로"처럼 변수 뒤에 조사가 붙는다.
 * 하드코딩하면 "화이", "수과" 같은 말이 그대로 사용자에게 나간다.
 */

type Pair = "이/가" | "은/는" | "을/를" | "과/와" | "으로/로" | "아/야" | "이에요/예요";

/** 받침 있을 때 / 없을 때 */
const PAIRS: Record<Pair, [string, string]> = {
  "이/가": ["이", "가"],
  "은/는": ["은", "는"],
  "을/를": ["을", "를"],
  "과/와": ["과", "와"],
  "으로/로": ["으로", "로"],
  "아/야": ["아", "야"],
  "이에요/예요": ["이에요", "예요"],
};

/** 마지막 한글 음절의 종성 인덱스. 한글이 없으면 null. (0 = 받침 없음, 8 = ㄹ) */
function jongseong(word: string): number | null {
  for (let i = word.length - 1; i >= 0; i--) {
    const code = word.charCodeAt(i);
    if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28;
  }
  return null;
}

/**
 * 앞말에 맞는 조사를 돌려준다. 괄호나 기호가 뒤에 붙어 있어도
 * 마지막 한글 음절을 기준으로 판단한다. — josa("계(수)", "과/와") → "와"
 */
export function josa(word: string, pair: Pair): string {
  const [withBatchim, withoutBatchim] = PAIRS[pair];
  const jong = jongseong(word);
  if (jong === null) return withBatchim; // 한글이 없으면 보수적으로
  if (jong === 0) return withoutBatchim;
  // ㄹ 받침은 '으로'가 아니라 '로'를 쓴다 — 물로, 실로
  if (jong === 8 && pair === "으로/로") return withoutBatchim;
  return withBatchim;
}

/** 앞말과 조사를 붙여서 돌려준다. — withJosa("금", "이/가") → "금이" */
export const withJosa = (word: string, pair: Pair) => `${word}${josa(word, pair)}`;

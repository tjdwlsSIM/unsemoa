/**
 * 음력 → 양력 변환 (한국 기준, 1930~2030).
 *
 * 한국 음력은 동경 135°(KST) 기준으로 삭·중기가 든 날짜를 잡는다. 중국 음력(동경 120°)과는
 * 자정 근처에 삭이 걸린 해에 한 달 시작이 하루씩 어긋난다 (예: 1997·2027·2028 설날,
 * 2012 윤3월(중국 윤4월), 2017 윤5월(중국 윤6월)). 그래서 흔히 도는 중국 테이블을 쓰면 틀린다.
 *
 * 테이블은 Meeus 삭 계산 + 태양황경 중기로 KST 기준 생성했고, ICU 단기(dangi) 달력과
 * 1930~2030 전 구간 월 시작일을 대조했다 (불일치 1건: 2017-02-26 삭은 KST 23:58로
 * 일식 기록과 맞는 이쪽 값을 채택).
 *
 * 한 해 = 16진수 하나.
 *   하위 4비트   윤달 월 번호 (0 = 윤달 없음)
 *   4비트부터    그 해 달들의 대소월, 순서대로 (1 = 30일, 0 = 29일). 윤달은 해당 평달 바로 뒤.
 */

/** 음력 1930년 1월 1일 = 양력 1930-01-30 */
const BASE = Date.UTC(1930, 0, 30);
const FIRST = 1930;

// prettier-ignore
const YEARS = [
  0x0d266, 0x05270, 0x0a570, 0x12b65, 0x0ada0, 0x06d40, 0x0ea93, 0x07490, 0x16937, 0x0a930, // 1930
  0x052b0, 0x0a5b6, 0x096d0, 0x0b6a0, 0x1b544, 0x0ba40, 0x0b490, 0x1a932, 0x0a950, 0x152b7, // 1940
  0x052d0, 0x0aad0, 0x156a5, 0x0db20, 0x0da40, 0x1d493, 0x0d4a0, 0x1a958, 0x0a960, 0x05560, // 1950
  0x0ab56, 0x0ad50, 0x06d20, 0x0ea54, 0x0ea50, 0x0e4a0, 0x0c963, 0x0a9b0, 0x15567, 0x056a0, // 1960
  0x0b590, 0x17525, 0x07520, 0x07250, 0x164b4, 0x0a4b0, 0x12ab8, 0x02ad0, 0x056b0, 0x0b696, // 1970
  0x0da90, 0x0d920, 0x1b254, 0x0d250, 0x1a4da, 0x0a560, 0x02b60, 0x15ad6, 0x06d40, 0x0da90, // 1980
  0x1d925, 0x0e920, 0x0d260, 0x0a563, 0x0a570, 0x12b68, 0x0b5a0, 0x06d40, 0x0ec95, 0x07490, // 1990
  0x06930, 0x15274, 0x052b0, 0x0a5b0, 0x155a2, 0x036a0, 0x1b557, 0x0ba40, 0x0b490, 0x1a935, // 2000
  0x0a950, 0x052d0, 0x0a5d3, 0x0aad0, 0x15aa9, 0x05d20, 0x0da50, 0x1d4a5, 0x0d4a0, 0x0a950, // 2010
  0x152d4, 0x05560, 0x0ab50, 0x15aa2, 0x06d20, 0x0ea56, 0x0ea50, 0x0e4a0, 0x0c965, 0x0c9b0, // 2020
  0x055a0, // 2030
];

export const LUNAR_MIN_YEAR = FIRST;
export const LUNAR_MAX_YEAR = FIRST + YEARS.length - 1;

/** 그 해의 윤달 월 번호, 없으면 0 */
export const leapMonthOf = (year: number) => YEARS[year - FIRST] & 0xf;

const monthCount = (v: number) => ((v & 0xf) ? 13 : 12);
const monthLen = (v: number, i: number) => ((v >> (4 + i)) & 1 ? 30 : 29);
function yearLen(v: number) {
  let n = 0;
  for (let i = 0; i < monthCount(v); i++) n += monthLen(v, i);
  return n;
}

export type SolarDate = { year: number; month: number; day: number };

/** 음력 → 양력. 없는 날짜(윤달이 아닌 달에 윤달 지정, 29일까지인 달의 30일 등)는 null */
export function lunarToSolar(year: number, month: number, day: number, leap = false): SolarDate | null {
  if (!Number.isInteger(year) || year < LUNAR_MIN_YEAR || year > LUNAR_MAX_YEAR) return null;
  if (month < 1 || month > 12 || day < 1 || day > 30) return null;
  const v = YEARS[year - FIRST];
  const leapMonth = v & 0xf;
  if (leap && leapMonth !== month) return null;

  // 윤달이 있으면 그 뒤의 달(과 윤달 자신)은 순서가 하나 밀린다
  const idx = month - 1 + (leapMonth && (month > leapMonth || leap) ? 1 : 0);
  if (day > monthLen(v, idx)) return null;

  let offset = day - 1;
  for (let y = FIRST; y < year; y++) offset += yearLen(YEARS[y - FIRST]);
  for (let i = 0; i < idx; i++) offset += monthLen(v, i);

  const d = new Date(BASE + offset * 86_400_000);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/**
 * 만세력 엔진 — 사주팔자(년·월·일·시주) 산출.
 *
 * 절기(節氣)는 날짜 테이블 대신 태양황경을 직접 계산해서 구한다.
 * 테이블 방식은 담아둔 연도 범위를 벗어나면 그냥 틀리지만, 이 방식은
 * 1900~2100 전 구간에서 오차 ~0.01°(≈15분) 안에 들어온다.
 *
 * 검증 기준점: 2019-01-27 = 갑자일 (JDN 2458511), 1781-03-13 = 임술일.
 */

export const GAN = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"] as const;
export const GAN_HANJA = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const JI = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"] as const;
export const JI_HANJA = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
export const JI_ANIMAL = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"] as const;

export const OHAENG = ["목", "화", "토", "금", "수"] as const;
export type Ohaeng = (typeof OHAENG)[number];
/** 흰 글씨를 얹으므로 전부 WCAG AA(4.5:1) 이상으로 잡아둔 값 */
export const OHAENG_COLOR = { 목: "#3f7d4e", 화: "#c0392b", 토: "#8a6508", 금: "#5f6b76", 수: "#1f4e79" } as const;

/** 천간 오행 인덱스 (0목 1화 2토 3금 4수) */
const GAN_OHAENG = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
/** 지지 오행 인덱스 — 자수 축토 인목 묘목 진토 사화 오화 미토 신금 유금 술토 해수 */
const JI_OHAENG = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];

/** 짝수 인덱스 = 양(陽) */
const isYang = (i: number) => i % 2 === 0;

// ── 역법 기초 ──────────────────────────────────────────────

/** 그레고리력 → 정오 기준 율리우스 적일(JDN) */
export function jdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
  );
}

const rad = Math.PI / 180;

/**
 * 태양 겉보기 황경(도, 0~360). Meeus 저정밀 해 — 오차 약 0.01°.
 * jd 는 UT 기준 소수점 포함 율리우스일.
 */
export function solarLongitude(jd: number): number {
  const t = (jd - 2451545.0) / 36525;
  const l0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  const m = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
  const c =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(m * rad) +
    (0.019993 - 0.000101 * t) * Math.sin(2 * m * rad) +
    0.000289 * Math.sin(3 * m * rad);
  const apparent = l0 + c - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * t) * rad);
  return ((apparent % 360) + 360) % 360;
}

/**
 * 한국 표준시(UTC+9)는 동경 135°, 서울은 약 127°.
 * 진태양시로 보정하려면 -30분. 유파에 따라 갈려서 기본값은 보정 없음.
 * ponytail: 시주 경계(±30분)에 걸리는 사용자가 늘면 입력 폼에 토글로 노출.
 */
export const LONGITUDE_CORRECTION_MIN = 0;

// ── 사주 산출 ──────────────────────────────────────────────

export type Pillar = { gan: number; ji: number };
export type Saju = {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
  /** 절기 기준 사주 연도 (입춘 이전이면 전년) */
  sajuYear: number;
  solarLongitude: number;
};

export type BirthInput = {
  year: number;
  month: number; // 1-12
  day: number;
  /** 0-23, 모르면 null */
  hour: number | null;
  minute?: number;
};

export function calcSaju(b: BirthInput): Saju {
  const minute = b.minute ?? 0;
  const h = b.hour ?? 12; // 시간 미상이면 정오로 절기만 판정
  // KST(UTC+9) → UT 기준 율리우스일
  const utcMs = Date.UTC(b.year, b.month - 1, b.day, h, minute + LONGITUDE_CORRECTION_MIN) - 9 * 3600_000;
  const jd = utcMs / 86_400_000 + 2440587.5;
  const lon = solarLongitude(jd);

  // 연주: 입춘(황경 315°)에 해가 바뀐다
  let sajuYear = b.year;
  if (b.month <= 2 && lon < 315) sajuYear -= 1;
  const yearGan = ((sajuYear - 4) % 10 + 10) % 10;
  const yearJi = ((sajuYear - 4) % 12 + 12) % 12;

  // 월주: 입춘(315°)부터 30°씩 끊어 인월(寅)→축월(丑)
  const monthOrder = Math.floor((((lon - 315) % 360) + 360) % 360 / 30); // 0=인월
  const monthJi = (monthOrder + 2) % 12;
  const monthGan = (yearGan * 2 + 2 + monthOrder) % 10; // 오호둔(五虎遁)

  // 일주: 자정에 바뀜 (야자시 미적용)
  const dayIdx = (((jdn(b.year, b.month, b.day) - 11) % 60) + 60) % 60;
  const dayGan = dayIdx % 10;
  const dayJi = dayIdx % 12;

  // 시주: 23시부터 자시. 오서둔(五鼠遁)
  let hour: Pillar | null = null;
  if (b.hour !== null) {
    const hourJi = Math.floor(((b.hour + 1) % 24) / 2);
    hour = { gan: (dayGan * 2 + hourJi) % 10, ji: hourJi };
  }

  return {
    year: { gan: yearGan, ji: yearJi },
    month: { gan: monthGan, ji: monthJi },
    day: { gan: dayGan, ji: dayJi },
    hour,
    sajuYear,
    solarLongitude: lon,
  };
}

export const pillarName = (p: Pillar) => `${GAN[p.gan]}${JI[p.ji]}`;
export const pillarHanja = (p: Pillar) => `${GAN_HANJA[p.gan]}${JI_HANJA[p.ji]}`;

export function pillars(s: Saju): { label: string; p: Pillar }[] {
  const list = [
    { label: "시주", p: s.hour },
    { label: "일주", p: s.day },
    { label: "월주", p: s.month },
    { label: "연주", p: s.year },
  ];
  return list.filter((x): x is { label: string; p: Pillar } => x.p !== null);
}

// ── 오행 · 십신 ────────────────────────────────────────────

export function ohaengCount(s: Saju): Record<Ohaeng, number> {
  const out: Record<Ohaeng, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const add = (i: number) => (out[OHAENG[i]] += 1);
  for (const { p } of pillars(s)) {
    add(GAN_OHAENG[p.gan]);
    add(JI_OHAENG[p.ji]);
  }
  return out;
}

export const SIPSIN = [
  ["비견", "겁재"], // 같은 오행
  ["식신", "상관"], // 내가 생함
  ["편재", "정재"], // 내가 극함
  ["편관", "정관"], // 나를 극함
  ["편인", "정인"], // 나를 생함
] as const;

/** 일간 기준 십신. same 음양이면 앞쪽(편), 다르면 뒤쪽(정) */
export function sipsin(dayGan: number, targetOhaeng: number, targetYang: boolean): string {
  const diff = ((targetOhaeng - GAN_OHAENG[dayGan]) % 5 + 5) % 5;
  return SIPSIN[diff][isYang(dayGan) === targetYang ? 0 : 1];
}

export const ganSipsin = (dayGan: number, gan: number) => sipsin(dayGan, GAN_OHAENG[gan], isYang(gan));
export const jiSipsin = (dayGan: number, ji: number) => sipsin(dayGan, JI_OHAENG[ji], isYang(ji));

export const ganOhaeng = (gan: number): Ohaeng => OHAENG[GAN_OHAENG[gan]];
export const jiOhaeng = (ji: number): Ohaeng => OHAENG[JI_OHAENG[ji]];
export const ganYang = (gan: number) => isYang(gan);

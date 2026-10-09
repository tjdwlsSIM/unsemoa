// 실행: npm test  (node 내장 test runner, 프레임워크 없음)
import assert from "node:assert/strict";
import test from "node:test";
import {
  TTI,
  ZODIAC,
  birthYears,
  cardYears,
  fortuneMood,
  gunghapMood,
  dayIndex,
  getAllDailyFortunes,
  getDailyFortune,
  getYearFortunes,
  luckyOf,
  todayKST,
  ttiOf,
  ttiOfJi,
  zodiacOf,
} from "./fortune.ts";

test("띠 12개 · 별자리 12개, id 중복 없음", () => {
  assert.equal(TTI.length, 12);
  assert.equal(ZODIAC.length, 12);
  assert.equal(new Set([...TTI, ...ZODIAC].map((s) => s.id)).size, 24);
});

test("같은 날짜 = 같은 결과 (캐시/SSG 안전)", () => {
  assert.deepEqual(getDailyFortune(TTI[0], "tti", "2026-09-26"), getDailyFortune(TTI[0], "tti", "2026-09-26"));
});

test("같은 날 12띠가 서로 다른 총운을 받는다", () => {
  const list = getAllDailyFortunes("tti", "2026-09-26");
  assert.equal(new Set(list.map((f) => f.summary)).size, 12);
});

test("같은 날 띠별 점수가 한 값으로 몰리지 않는다", () => {
  for (const date of ["2026-09-26", "2026-09-27", "2026-10-01", "2027-01-15"]) {
    assert.ok(new Set(getAllDailyFortunes("tti", date).map((f) => f.score)).size >= 3, date);
  }
});

test("띠와 별자리는 같은 날 다른 내용을 받는다", () => {
  const a = getDailyFortune(TTI[0], "tti", "2026-09-26");
  const b = getDailyFortune(ZODIAC[0], "zodiac", "2026-09-26");
  assert.notEqual(a.summary, b.summary);
});

// 이 서비스의 핵심 지표가 '매일 재방문'이라 반복 주기가 곧 이탈 시점이다.
test("총운이 100일 안에 반복되지 않는다", () => {
  const start = dayIndex("2026-01-01");
  const seen = new Set<string>();
  for (let d = 0; d < 100; d++) {
    const date = new Date((start + d) * 86_400_000).toISOString().slice(0, 10);
    seen.add(getDailyFortune(TTI[0], "tti", date).summary);
  }
  assert.equal(seen.size, 100, `100일 중 ${seen.size}일만 고유`);
});

test("4개 분야 조합은 1년 안에 반복되지 않는다", () => {
  const start = dayIndex("2026-01-01");
  for (const sign of [TTI[0], TTI[7]]) {
    const seen = new Set<string>();
    for (let d = 0; d < 365; d++) {
      const date = new Date((start + d) * 86_400_000).toISOString().slice(0, 10);
      const f = getDailyFortune(sign, "tti", date);
      seen.add([f.summary, f.love, f.money, f.work, f.health].join("|"));
    }
    assert.equal(seen.size, 365, `${sign.name}: 365일 중 ${seen.size}일만 고유`);
  }
});

test("모든 필드가 유효 범위 안에 있다 (2년 x 24대상 전수)", () => {
  const start = dayIndex("2026-01-01");
  for (let d = 0; d < 730; d++) {
    const date = new Date((start + d) * 86_400_000).toISOString().slice(0, 10);
    for (const kind of ["tti", "zodiac"] as const) {
      for (const f of getAllDailyFortunes(kind, date)) {
        assert.ok(f.score >= 1 && f.score <= 5, `score ${f.score}`);
        assert.ok(f.luckyNumber >= 1 && f.luckyNumber <= 45, `num ${f.luckyNumber}`);
        for (const v of [f.summary, f.love, f.money, f.work, f.health, f.luckyColor, f.luckyItem, f.luckyPlace]) {
          assert.ok(typeof v === "string" && v.length > 0);
        }
      }
    }
  }
});

test("todayKST는 YYYY-MM-DD 형식", () => {
  assert.match(todayKST(), /^\d{4}-\d{2}-\d{2}$/);
});

test("birthYears는 12년 주기로 역산", () => {
  assert.deepEqual(birthYears({ ...TTI[0], baseYear: 2020 }, 3), [2020, 2008, 1996]);
});

test("잘못된 날짜는 던진다", () => {
  assert.throws(() => dayIndex("나쁜날짜"));
});

test("생일 → 별자리 매핑 (경계 포함)", () => {
  assert.equal(zodiacOf(3, 21).id, "aries");
  assert.equal(zodiacOf(4, 19).id, "aries");
  assert.equal(zodiacOf(4, 20).id, "taurus");
  // 염소자리는 연말~연초를 걸친다
  assert.equal(zodiacOf(12, 25).id, "capricorn");
  assert.equal(zodiacOf(1, 5).id, "capricorn");
  assert.equal(zodiacOf(1, 20).id, "aquarius");
});

test("1년 365일 전부 별자리가 하나씩 잡힌다", () => {
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= 31; d++) {
      if (new Date(Date.UTC(2025, m - 1, d)).getUTCMonth() !== m - 1) continue; // 없는 날짜
      assert.ok(zodiacOf(m, d), `${m}/${d}`);
    }
  }
});

test("출생연도 → 띠 매핑", () => {
  assert.equal(ttiOf(2020).id, "rat");
  assert.equal(ttiOf(1984).id, "rat");
  assert.equal(ttiOf(2026).id, "horse");
  assert.equal(ttiOf(1995).id, "pig");
});

test("지지 인덱스 → 띠 매핑이 ttiOf와 어긋나지 않는다", () => {
  // TTI 배열 순서가 지지 순서(자축인묘…)와 같다는 전제를 고정한다
  for (let year = 2020; year < 2032; year++) {
    const ji = (((year - 4) % 12) + 12) % 12;
    assert.equal(ttiOfJi(ji).id, ttiOf(year).id, `${year}년`);
  }
});

test("년생별 운세: 1936년 이후·10세 이상, 같은 날 같은 띠 안에서 문장이 겹치지 않는다", () => {
  const start = dayIndex("2026-01-01");
  for (let d = 0; d < 400; d++) {
    const date = new Date((start + d) * 86_400_000).toISOString().slice(0, 10);
    for (const tti of TTI) {
      const list = getYearFortunes(tti, date);
      assert.ok(list.length >= 4, `${tti.name} ${date}`);
      assert.equal(new Set(list.map((y) => y.text)).size, list.length, `${tti.name} ${date}`);
      for (const y of list) assert.ok(y.year >= 1936 && Number(date.slice(0, 4)) - y.year >= 10);
    }
  }
});

test("년생별 운세는 연령대 풀을 따른다", () => {
  const rat = getYearFortunes(TTI[0], "2026-09-28");
  assert.deepEqual(
    rat.map((y) => [y.year, y.group]),
    [[2008, "young"], [1996, "young"], [1984, "middle"], [1972, "middle"], [1960, "senior"], [1948, "senior"], [1936, "senior"]],
  );
  assert.deepEqual(getYearFortunes(TTI[0], "2026-09-28"), rat);
});

test("카드 라벨은 10~60대 다섯 해", () => {
  assert.equal(cardYears(TTI[0], "2026-09-28"), "60·72·84·96·08년생");
  for (const tti of TTI) assert.equal(cardYears(tti, "2026-09-28").split("·").length, 5, tti.name);
});

test("대표 출생년도는 세 해", () => {
  assert.equal(cardYears(TTI[0], "2026-09-28", [13, 48]), "84·96·08년생");
  for (const tti of TTI) assert.equal(cardYears(tti, "2026-09-28", [13, 48]).split("·").length, 3, tti.name);
});

test("띠마다 대표색이 있고 서로 다르다", () => {
  assert.equal(new Set(TTI.map((t) => t.color)).size, 12);
  for (const t of TTI) assert.match(t.color, /^#[0-9a-f]{6}$/);
});

test("점수 → 표정", () => {
  assert.deepEqual([1, 2, 3, 4, 5].map(fortuneMood), ["worried", "worried", "normal", "happy", "happy"]);
  assert.deepEqual([100, 80, 79, 65, 64, 0].map(gunghapMood), ["happy", "happy", "normal", "normal", "worried", "worried"]);
});

const days = (from: string, n: number) =>
  Array.from({ length: n }, (_, d) => new Date((dayIndex(from) + d) * 86_400_000).toISOString().slice(0, 10));

test("별점이 총운 문장의 기운과 어긋나지 않는다 (같은 흐름 문장 = 같은 별점 구간)", () => {
  const band = (s: number) => (s >= 4 ? "좋음" : s === 3 ? "보통" : "조심");
  const seen = new Map<string, Set<string>>();
  for (const date of days("2026-01-01", 400)) {
    for (const kind of ["tti", "zodiac"] as const) {
      for (const f of getAllDailyFortunes(kind, date)) {
        const flow = f.summary.slice(0, f.summary.indexOf("다. ") + 2);
        seen.set(flow, (seen.get(flow) ?? new Set()).add(band(f.score)));
      }
    }
  }
  assert.equal(seen.size, 13);
  for (const [flow, bands] of seen) assert.equal(bands.size, 1, `${flow} → ${[...bands]}`);
});

test("별점표가 짧은 주기로 되풀이되지 않는다", () => {
  const table = days("2026-01-01", 60).map((date) => getAllDailyFortunes("tti", date).map((f) => f.score).join(""));
  for (const period of [1, 2, 3, 4, 5, 6, 7, 13]) {
    assert.ok(table.some((t, d) => d >= period && t !== table[d - period]), `${period}일 주기`);
    const same = table.filter((t, d) => d >= period && t === table[d - period]).length;
    assert.ok(same <= 2, `${period}일 전과 같은 날 ${same}번`);
  }
});

test("오늘의 행운 동물은 최고점이고, 1년 동안 12띠가 모두 돌아가며 뽑힌다", () => {
  const count = new Map<string, number>();
  for (const date of days("2026-01-01", 365)) {
    const list = getAllDailyFortunes("tti", date);
    const lucky = luckyOf(list);
    assert.equal(lucky.score, Math.max(...list.map((f) => f.score)), date);
    count.set(lucky.sign.name, (count.get(lucky.sign.name) ?? 0) + 1);
  }
  assert.equal(count.size, 12, `${[...count.keys()]}`);
  for (const [name, n] of count) assert.ok(n >= 15, `${name} ${n}번`);
});

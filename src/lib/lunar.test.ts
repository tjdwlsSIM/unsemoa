// 실행: npm test
import assert from "node:assert/strict";
import test from "node:test";
import { LUNAR_MAX_YEAR, LUNAR_MIN_YEAR, leapMonthOf, lunarToSolar } from "./lunar.ts";

const iso = (d: { year: number; month: number; day: number } | null) =>
  d && `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;

test("설날(음력 1월 1일)의 양력 날짜", () => {
  const seollal: [number, string][] = [
    [1950, "1950-02-17"],
    [1970, "1970-02-06"],
    [1990, "1990-01-27"],
    [2000, "2000-02-05"],
    [2020, "2020-01-25"],
    [2026, "2026-02-17"],
    // 한국·중국이 갈리는 해: 삭이 2027-02-06 15:56 UTC → 베이징 2/6 23:56, 서울 2/7 00:56
    [2027, "2027-02-07"],
  ];
  for (const [y, want] of seollal) assert.equal(iso(lunarToSolar(y, 1, 1)), want, `${y}년 설날`);
  // TODO(검증 필요): 1997 설날 — 이 테이블은 1997-02-08(삭 KST 00:06). 중국은 2/7. KASI 원표로 한 번 확인할 것.
});

test("윤달 — 한국 기준", () => {
  assert.equal(iso(lunarToSolar(2020, 4, 1, true)), "2020-05-23");
  assert.equal(iso(lunarToSolar(2023, 2, 1, true)), "2023-03-22");
  assert.equal(iso(lunarToSolar(2025, 6, 1, true)), "2025-07-25");
  // 중국 음력은 2012 윤4월, 2017 윤6월 — 한국은 한 달 앞
  assert.equal(leapMonthOf(2012), 3);
  assert.equal(iso(lunarToSolar(2012, 3, 1, true)), "2012-04-21");
  assert.equal(leapMonthOf(2017), 5);
  assert.equal(iso(lunarToSolar(2017, 5, 1, true)), "2017-06-24");
});

test("윤달 뒤의 평달은 한 달씩 밀린다", () => {
  // 2023: 2월 → 윤2월 → 3월
  assert.equal(iso(lunarToSolar(2023, 2, 1)), "2023-02-20");
  assert.equal(iso(lunarToSolar(2023, 3, 1)), "2023-04-20");
});

test("결과 화면 예시: 음력 1968년 3월 5일 = 양력 1968년 4월 2일", () => {
  assert.equal(iso(lunarToSolar(1968, 3, 5)), "1968-04-02");
});

test("없는 날짜는 null", () => {
  assert.equal(lunarToSolar(2023, 3, 1, true), null); // 2023 윤달은 2월
  assert.equal(lunarToSolar(2026, 1, 1, true), null); // 윤달 없는 해
  assert.equal(lunarToSolar(2020, 1, 31), null);
  assert.equal(lunarToSolar(1929, 12, 1), null);
  assert.equal(lunarToSolar(2031, 1, 1), null);
  // 작은달(29일)의 30일
  const small = [...Array(12)].findIndex((_, i) => lunarToSolar(2026, i + 1, 30) === null);
  assert.ok(small >= 0, "2026년에 29일짜리 달이 하나는 있어야 한다");
});

test("테이블 전 구간: 설날은 1/21~2/20, 음력 해는 353~385일", () => {
  for (let y = LUNAR_MIN_YEAR; y <= LUNAR_MAX_YEAR; y++) {
    const ny = iso(lunarToSolar(y, 1, 1))!;
    assert.ok(ny.slice(5) >= "01-21" && ny.slice(5) <= "02-20", `${y}: ${ny}`);
    if (y < LUNAR_MAX_YEAR) {
      const len = (Date.parse(iso(lunarToSolar(y + 1, 1, 1))!) - Date.parse(ny)) / 86_400_000;
      assert.ok(leapMonthOf(y) ? len >= 383 && len <= 385 : len >= 353 && len <= 355, `${y}: ${len}일`);
    }
  }
});

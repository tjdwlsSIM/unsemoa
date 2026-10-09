import assert from "node:assert/strict";
import test from "node:test";
import { calcGunghap } from "./gunghap.ts";
import { JI_ANIMAL, calcSaju, type BirthInput } from "./saju.ts";

/** 특정 띠(지지)에 해당하는 생년월일 하나를 만든다. 6월생이면 입춘 이후라 연지가 확정된다. */
function birthForJi(ji: number): BirthInput {
  for (let y = 1960; y < 2030; y++) {
    const b = { year: y, month: 6, day: 15, hour: 12 };
    if (calcSaju(b).year.ji === ji) return b;
  }
  throw new Error(`지지 ${ji}에 맞는 해를 못 찾음`);
}

const relKey = (a: number, b: number) => calcGunghap(birthForJi(a), birthForJi(b)).ji.key;

test("삼합 — 신자진·해묘미·인오술·사유축", () => {
  for (const group of [
    [8, 0, 4],
    [11, 3, 7],
    [2, 6, 10],
    [5, 9, 1],
  ]) {
    for (const a of group)
      for (const b of group) {
        if (a !== b) assert.equal(relKey(a, b), "삼합", `${JI_ANIMAL[a]}-${JI_ANIMAL[b]}`);
      }
  }
});

test("육합 — 자축·인해·묘술·진유·사신·오미", () => {
  for (const [a, b] of [
    [0, 1],
    [2, 11],
    [3, 10],
    [4, 9],
    [5, 8],
    [6, 7],
  ]) {
    assert.equal(relKey(a, b), "육합", `${JI_ANIMAL[a]}-${JI_ANIMAL[b]}`);
    assert.equal(relKey(b, a), "육합", "순서 바꿔도 같아야 함");
  }
});

test("충 — 정반대 6칸", () => {
  for (let a = 0; a < 6; a++) assert.equal(relKey(a, a + 6), "충", `${JI_ANIMAL[a]}-${JI_ANIMAL[a + 6]}`);
});

test("해 — 자미·축오·인사·묘진·신해·유술", () => {
  for (const [a, b] of [
    [0, 7],
    [1, 6],
    [2, 5],
    [3, 4],
    [8, 11],
    [9, 10],
  ])
    assert.equal(relKey(a, b), "해", `${JI_ANIMAL[a]}-${JI_ANIMAL[b]}`);
});

test("파 — 인해·사신은 육합이 우선한다", () => {
  assert.equal(relKey(0, 9), "파"); // 자유
  assert.equal(relKey(1, 4), "파"); // 축진
  assert.equal(relKey(3, 6), "파"); // 묘오
  assert.equal(relKey(7, 10), "파"); // 미술
  assert.equal(relKey(2, 11), "육합"); // 인해 — 합이 파보다 우선
  assert.equal(relKey(5, 8), "육합"); // 사신
});

test("같은 띠", () => {
  assert.equal(relKey(4, 4), "같은띠");
});

test("12x12 전 조합이 빠짐없이 분류된다", () => {
  const counts: Record<string, number> = {};
  for (let a = 0; a < 12; a++)
    for (let b = 0; b < 12; b++) {
      const k = relKey(a, b);
      counts[k] = (counts[k] ?? 0) + 1;
    }
  assert.equal(Object.values(counts).reduce((x, y) => x + y, 0), 144);
  assert.equal(counts["삼합"], 24); // 4그룹 x 3쌍 x 양방향
  assert.equal(counts["충"], 12);
  assert.equal(counts["같은띠"], 12);
});

test("점수는 0~100 안, 순서를 바꿔도 동일", () => {
  for (let a = 0; a < 12; a++)
    for (let b = 0; b < 12; b++) {
      const x = calcGunghap(birthForJi(a), birthForJi(b));
      const y = calcGunghap(birthForJi(b), birthForJi(a));
      assert.ok(x.score >= 0 && x.score <= 100, `score ${x.score}`);
      assert.equal(x.score, y.score, "궁합은 대칭이어야 한다");
      assert.ok(x.sections.length === 3 && x.advice.length > 0);
    }
});

test("같은 입력은 항상 같은 결과", () => {
  const a = { year: 1993, month: 4, day: 12, hour: 9 };
  const b = { year: 1995, month: 11, day: 3, hour: null };
  assert.deepEqual(calcGunghap(a, b), calcGunghap(a, b));
});

test("시간을 몰라도 궁합이 나온다", () => {
  const r = calcGunghap({ year: 1990, month: 1, day: 1, hour: null }, { year: 1992, month: 8, day: 20, hour: null });
  assert.ok(r.score > 0);
  assert.ok(r.grade.length > 0);
});

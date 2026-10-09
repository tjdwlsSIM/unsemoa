import assert from "node:assert/strict";
import test from "node:test";
import { MAJOR, draw, meaning, parseSpread, spreadQuery } from "./tarot.ts";

test("메이저 아르카나 22장, 번호 0~21 중복 없음", () => {
  assert.equal(MAJOR.length, 22);
  assert.deepEqual(
    MAJOR.map((c) => c.no).sort((a, b) => a - b),
    Array.from({ length: 22 }, (_, i) => i),
  );
  assert.equal(new Set(MAJOR.map((c) => c.name)).size, 22);
});

test("모든 카드에 정방향·역방향 해석이 있다", () => {
  for (const c of MAJOR) {
    assert.ok(c.upright.length > 10, c.name);
    assert.ok(c.reversed.length > 10, c.name);
    assert.ok(c.keywords.length >= 2, c.name);
  }
});

test("같은 카드를 두 번 뽑지 않는다", () => {
  for (let i = 0; i < 500; i++) {
    const d = draw(3);
    assert.equal(new Set(d.map((x) => x.card.no)).size, 3);
  }
});

test("덱 전체를 뽑아도 중복이 없다", () => {
  assert.equal(new Set(draw(22).map((x) => x.card.no)).size, 22);
});

test("덱보다 많이 뽑으면 던진다", () => {
  assert.throws(() => draw(23));
});

test("rng를 주입하면 결과가 재현된다", () => {
  const seeded = () => {
    let s = 42;
    return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
  };
  assert.deepEqual(draw(3, seeded()), draw(3, seeded()));
});

test("meaning은 방향에 따라 갈린다", () => {
  const c = MAJOR[0];
  assert.equal(meaning({ card: c, reversed: false }), c.upright);
  assert.equal(meaning({ card: c, reversed: true }), c.reversed);
});

test("역방향이 항상 같은 쪽으로 쏠리지 않는다", () => {
  let rev = 0;
  for (let i = 0; i < 1000; i++) if (draw(1)[0].reversed) rev++;
  assert.ok(rev > 350 && rev < 650, `역방향 ${rev}/1000`);
});

test("뽑은 카드 → URL → 카드가 그대로 돌아온다", () => {
  for (let i = 0; i < 200; i++) {
    const d = draw(3);
    assert.deepEqual(parseSpread(spreadQuery(d)), d);
  }
  assert.equal(spreadQuery([{ card: MAJOR[3], reversed: false }, { card: MAJOR[10], reversed: true }, { card: MAJOR[21], reversed: false }]), "3-10r-21");
});

test("잘못된 카드 URL은 null", () => {
  for (const q of [undefined, "", "3-10", "3-10-21-4", "3-3-21", "3-10-22", "3-x-21", "03-10-21r-", "3-10R-21"]) {
    assert.equal(parseSpread(q), null, String(q));
  }
});

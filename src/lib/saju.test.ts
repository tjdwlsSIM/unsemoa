import assert from "node:assert/strict";
import test from "node:test";
import { calcSaju, JI, jdn, ohaengCount, pillarName, solarLongitude, ganSipsin } from "./saju.ts";

const dayName = (y: number, m: number, d: number) => pillarName(calcSaju({ year: y, month: m, day: d, hour: null }).day);

test("일주 — 외부 검증 기준점 3개", () => {
  // ytliu0 ChineseCalendar 교정점 + 계산 예제
  assert.equal(dayName(2019, 1, 27), "갑자");
  assert.equal(dayName(1781, 3, 13), "임술");
  assert.equal(dayName(2000, 1, 1), "무오");
});

test("일주는 60일 주기로 정확히 순환", () => {
  assert.equal(dayName(2019, 1, 27), dayName(2019, 3, 28)); // +60일
  const seen = new Set<string>();
  for (let i = 0; i < 60; i++) {
    const d = new Date(Date.UTC(2026, 0, 1) + i * 86_400_000);
    seen.add(dayName(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()));
  }
  assert.equal(seen.size, 60, "60일 안에 60간지가 전부 한 번씩");
});

test("JDN 공식", () => {
  assert.equal(jdn(2000, 1, 1), 2451545);
  assert.equal(jdn(2019, 1, 27), 2458511);
});

test("연주 — 널리 알려진 간지해", () => {
  const y = (yr: number) => pillarName(calcSaju({ year: yr, month: 6, day: 15, hour: null }).year);
  assert.equal(y(1984), "갑자"); // 갑자년
  assert.equal(y(2023), "계묘"); // 검은 토끼해
  assert.equal(y(2024), "갑진"); // 청룡의 해
  assert.equal(y(2026), "병오"); // 붉은 말의 해
});

test("입춘 전후로 연주가 갈린다", () => {
  // 2024 입춘: 2024-02-04 17:27 KST
  assert.equal(pillarName(calcSaju({ year: 2024, month: 2, day: 3, hour: 12 }).year), "계묘");
  assert.equal(pillarName(calcSaju({ year: 2024, month: 2, day: 5, hour: 12 }).year), "갑진");
  // 1월생은 항상 전년도 간지
  assert.equal(pillarName(calcSaju({ year: 2024, month: 1, day: 20, hour: 12 }).year), "계묘");
});

test("절기 계산이 공표된 입춘 시각과 1시간 내로 일치", () => {
  // 한국천문연구원 공표값 (KST)
  const 입춘: [number, number, number, number, number][] = [
    [2024, 2, 4, 17, 27],
    [2025, 2, 3, 23, 10],
    [2026, 2, 4, 5, 2],
  ];
  for (const [y, mo, d, h, mi] of 입춘) {
    const target = Date.UTC(y, mo - 1, d, h, mi) - 9 * 3600_000;
    // 315° 교차 시각을 이분법으로 탐색
    let lo = Date.UTC(y, 0, 25),
      hi = Date.UTC(y, 1, 14);
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const lon = solarLongitude(mid / 86_400_000 + 2440587.5);
      if (lon < 315 && lon > 270) lo = mid;
      else hi = mid;
    }
    const diffMin = Math.abs(hi - target) / 60_000;
    assert.ok(diffMin < 60, `${y} 입춘 오차 ${diffMin.toFixed(1)}분`);
  }
});

test("월주 — 망종~소서 사이는 오월(午)", () => {
  const s = calcSaju({ year: 2024, month: 6, day: 15, hour: null });
  assert.equal(JI[s.month.ji], "오");
  // 오호둔: 갑년 인월은 병인
  const feb = calcSaju({ year: 2024, month: 2, day: 20, hour: null });
  assert.equal(pillarName(feb.month), "병인");
});

test("시주 — 오서둔", () => {
  const s = calcSaju({ year: 2019, month: 1, day: 27, hour: 0 }); // 갑자일
  assert.equal(pillarName(s.hour!), "갑자"); // 갑일 자시 = 갑자시
  const noon = calcSaju({ year: 2019, month: 1, day: 27, hour: 12 });
  assert.equal(pillarName(noon.hour!), "경오"); // 갑일 오시 = 경오시
});

test("시간 모름이면 시주 없이 3주만", () => {
  const s = calcSaju({ year: 1990, month: 5, day: 5, hour: null });
  assert.equal(s.hour, null);
  const total = Object.values(ohaengCount(s)).reduce((a, b) => a + b, 0);
  assert.equal(total, 6); // 3주 × (천간+지지)
});

test("십신 — 일간 기준 관계", () => {
  // 갑(목,양) 기준
  assert.equal(ganSipsin(0, 0), "비견"); // 갑-갑: 같은 오행 같은 음양
  assert.equal(ganSipsin(0, 1), "겁재"); // 갑-을: 같은 오행 다른 음양
  assert.equal(ganSipsin(0, 2), "식신"); // 갑-병: 목생화, 같은 양
  assert.equal(ganSipsin(0, 3), "상관"); // 갑-정
  assert.equal(ganSipsin(0, 4), "편재"); // 갑-무: 목극토, 같은 양
  assert.equal(ganSipsin(0, 5), "정재"); // 갑-기
  assert.equal(ganSipsin(0, 6), "편관"); // 갑-경: 금극목, 같은 양
  assert.equal(ganSipsin(0, 7), "정관"); // 갑-신
  assert.equal(ganSipsin(0, 8), "편인"); // 갑-임: 수생목, 같은 양
  assert.equal(ganSipsin(0, 9), "정인"); // 갑-계
});

test("1900~2100 전 구간 무결성", () => {
  for (let y = 1900; y <= 2100; y += 7) {
    for (const [m, d] of [[1, 15], [2, 4], [6, 21], [12, 31]] as const) {
      const s = calcSaju({ year: y, month: m, day: d, hour: 9 });
      for (const p of [s.year, s.month, s.day, s.hour!]) {
        assert.ok(p.gan >= 0 && p.gan < 10, `${y}-${m}-${d} gan ${p.gan}`);
        assert.ok(p.ji >= 0 && p.ji < 12, `${y}-${m}-${d} ji ${p.ji}`);
      }
      // 월지는 연간과 오호둔 규칙이 맞아떨어져야 한다
      const expected = (s.year.gan * 2 + 2 + ((s.month.ji - 2 + 12) % 12)) % 10;
      assert.equal(s.month.gan, expected, `${y}-${m}-${d} 오호둔 불일치`);
    }
  }
});

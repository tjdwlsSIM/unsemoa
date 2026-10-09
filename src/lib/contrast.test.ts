// globals.css 색 토큰의 WCAG 대비를 지킨다. 실행: npm test
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { TTI } from "./fortune.ts";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const token = (name: string) => {
  const m = new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, "i").exec(css);
  assert.ok(m, name);
  return m[1];
};

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lum = (hex: string) => {
  const [r, g, b] = rgb(hex).map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
/** 흰 바탕 위에 alpha만큼 깐 색 */
const tint = (hex: string, alpha: number) =>
  "#" + rgb(hex).map((v) => Math.round(255 + (v - 255) * alpha).toString(16).padStart(2, "0")).join("");

test("본문·보조 글자는 모든 바탕에서 AA(4.5:1) 이상", () => {
  for (const bg of ["paper", "cream", "card"]) {
    for (const fg of ["ink", "muted", "plum"]) {
      const r = ratio(token(fg), token(bg));
      assert.ok(r >= 4.5, `${fg} on ${bg}: ${r.toFixed(2)}`);
    }
  }
});

test("띠 대표색 틴트(20%) 위의 보조 글자도 AA 이상", () => {
  for (const t of TTI) {
    const r = ratio(token("muted"), tint(t.color, 0.2));
    assert.ok(r >= 4.5, `${t.name}: ${r.toFixed(2)}`);
  }
});

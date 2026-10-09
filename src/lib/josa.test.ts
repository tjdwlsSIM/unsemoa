import assert from "node:assert/strict";
import test from "node:test";
import { josa, withJosa } from "./josa.ts";

test("받침 유무에 따라 갈린다", () => {
  // 목(ㄱ) 금(ㅁ) = 받침 있음 / 화 토 수 = 받침 없음
  assert.equal(withJosa("목", "이/가"), "목이");
  assert.equal(withJosa("화", "이/가"), "화가");
  assert.equal(withJosa("토", "이/가"), "토가");
  assert.equal(withJosa("금", "이/가"), "금이");
  assert.equal(withJosa("수", "이/가"), "수가");
});

test("모든 조사 쌍", () => {
  assert.equal(withJosa("금", "은/는"), "금은");
  assert.equal(withJosa("수", "은/는"), "수는");
  assert.equal(withJosa("금", "을/를"), "금을");
  assert.equal(withJosa("수", "을/를"), "수를");
  assert.equal(withJosa("금", "과/와"), "금과");
  assert.equal(withJosa("수", "과/와"), "수와");
});

test("괄호나 기호가 뒤에 붙어도 마지막 한글로 판단한다", () => {
  assert.equal(josa("계(수)", "과/와"), "와");
  assert.equal(josa("경(금)", "과/와"), "과");
  assert.equal(josa("갑(목)", "으로/로"), "으로");
  assert.equal(josa("병(화)", "으로/로"), "로");
});

test("ㄹ 받침은 '으로'가 아니라 '로'", () => {
  assert.equal(withJosa("물", "으로/로"), "물로");
  assert.equal(withJosa("서울", "으로/로"), "서울로");
  assert.equal(withJosa("목", "으로/로"), "목으로"); // ㄱ 받침은 '으로'
  assert.equal(withJosa("토", "으로/로"), "토로");
});

test("한글이 없으면 던지지 않고 받침 있는 쪽으로", () => {
  assert.equal(josa("abc", "이/가"), "이");
  assert.equal(josa("", "은/는"), "은");
});

test("실제 쓰이는 문구", () => {
  assert.equal(`${withJosa("계(수)", "과/와")} ${withJosa("무(토)", "으로/로")}`, "계(수)와 무(토)로");
  assert.equal(`${withJosa("경(금)", "과/와")} ${withJosa("갑(목)", "으로/로")}`, "경(금)과 갑(목)으로");
});

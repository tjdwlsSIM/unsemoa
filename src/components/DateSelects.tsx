"use client";

import { useState, useSyncExternalStore } from "react";
import { ttiOf } from "@/lib/fortune";
import { LUNAR_MAX_YEAR, LUNAR_MIN_YEAR } from "@/lib/lunar";

const YEARS = Array.from({ length: LUNAR_MAX_YEAR - LUNAR_MIN_YEAR + 1 }, (_, i) => LUNAR_MAX_YEAR - i);
const pad = (n: number) => String(n).padStart(2, "0");
const noop = () => () => {};

const selectCls =
  "min-h-11 w-full rounded-lg border border-line bg-paper px-2 py-2.5 text-base focus:border-plum focus:outline-none";

/**
 * 양력/음력 + 년·월·일 셀렉트.
 *
 * JS가 돌면 셀렉트 이름을 떼고 숨은 date=YYYY-MM-DD 하나만 보낸다.
 * JS가 없으면 세 셀렉트가 모두 name=date로 나가 서버가 배열을 "-"로 이어 붙인다 (birthParams).
 * 월에 맞춰 일 수를 줄이는 것은 JS 있을 때만의 편의고, 최종 검증은 서버 parseBirth가 한다.
 */
export default function DateSelects({
  prefix,
  defaultDate,
  defaultCal,
  defaultLeap,
}: {
  prefix: string;
  defaultDate?: string;
  defaultCal?: string;
  defaultLeap?: string;
}) {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const [dy = "", dm = "", dd = ""] = /^\d{4}-\d{2}-\d{2}$/.test(defaultDate ?? "") ? defaultDate!.split("-") : [];
  const [cal, setCal] = useState(defaultCal === "lunar" ? "lunar" : "solar");
  const [y, setY] = useState(dy);
  const [m, setM] = useState(dm);
  const [d, setD] = useState(dd);

  // 음력은 큰달 30일이 최대 (작은달 30일은 서버에서 걸러낸다)
  const days = cal === "lunar" ? 30 : m ? new Date(Date.UTC(Number(y) || 2000, Number(m), 0)).getUTCDate() : 31;
  const day = Number(d) > days ? "" : d;
  const name = hydrated ? undefined : `${prefix}date`;

  return (
    <div>
      <div role="radiogroup" aria-label="달력 종류" className="flex flex-wrap items-center gap-2">
        {[
          ["solar", "양력"],
          ["lunar", "음력"],
        ].map(([v, label]) => (
          <label
            key={v}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-line bg-paper px-4 text-base has-[:checked]:border-plum has-[:checked]:bg-plum/10 has-[:checked]:font-semibold has-[:checked]:text-plum"
          >
            <input
              type="radio"
              name={`${prefix}cal`}
              value={v}
              checked={cal === v}
              onChange={() => setCal(v)}
              className="accent-plum"
            />
            {label}
          </label>
        ))}
        {/* 음력일 때만 보인다. :has()라 JS 없이도 동작 */}
        <label className="hidden min-h-11 cursor-pointer items-center gap-1.5 px-1 text-base group-has-[[value=lunar]:checked]:inline-flex">
          <input
            type="checkbox"
            name={`${prefix}leap`}
            value="1"
            defaultChecked={defaultLeap === "1"}
            className="size-5 accent-plum"
          />
          윤달
        </label>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <select name={name} required aria-label="태어난 해" value={y} onChange={(e) => setY(e.target.value)} className={`col-span-2 ${selectCls}`}>
          <option value="">년도</option>
          {YEARS.map((yr) => (
            <option key={yr} value={yr}>
              {yr}년 ({ttiOf(yr).name})
            </option>
          ))}
        </select>
        <select name={name} required aria-label="태어난 달" value={m} onChange={(e) => setM(e.target.value)} className={selectCls}>
          <option value="">월</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={pad(i + 1)}>
              {i + 1}월
            </option>
          ))}
        </select>
        <select name={name} required aria-label="태어난 날" value={day} onChange={(e) => setD(e.target.value)} className={selectCls}>
          <option value="">일</option>
          {Array.from({ length: days }, (_, i) => (
            <option key={i} value={pad(i + 1)}>
              {i + 1}일
            </option>
          ))}
        </select>
      </div>
      {hydrated && <input type="hidden" name={`${prefix}date`} value={y && m && day ? `${y}-${m}-${day}` : ""} />}
    </div>
  );
}

/**
 * 생년월일시 입력. 폼은 GET으로 제출돼 결과가 URL에 남는다.
 * 년·월·일 셀렉트만 클라이언트 컴포넌트(DateSelects)고, 나머지는 JS 없이도 동작한다.
 *
 * URL: date=YYYY-MM-DD, hour=시, cal=lunar(음력일 때), leap=1(윤달일 때).
 * cal이 없는 옛 링크는 양력으로 읽는다.
 */
import DateSelects from "@/components/DateSelects";
import { lunarToSolar } from "@/lib/lunar";

/**
 * 12시진 — 사주의 시주는 2시간 단위라 분 단위 입력은 의미가 없다.
 * 경계는 saju.ts의 LONGITUDE_CORRECTION_MIN(현재 0)과 맞춰둔 값이다.
 * 경도 보정을 켜면 이 라벨도 30분씩 밀어야 한다.
 */
export const SIJIN = [
  { v: "23", label: "자시 23:00~00:59" },
  { v: "1", label: "축시 01:00~02:59" },
  { v: "3", label: "인시 03:00~04:59" },
  { v: "5", label: "묘시 05:00~06:59" },
  { v: "7", label: "진시 07:00~08:59" },
  { v: "9", label: "사시 09:00~10:59" },
  { v: "11", label: "오시 11:00~12:59" },
  { v: "13", label: "미시 13:00~14:59" },
  { v: "15", label: "신시 15:00~16:59" },
  { v: "17", label: "유시 17:00~18:59" },
  { v: "19", label: "술시 19:00~20:59" },
  { v: "21", label: "해시 21:00~22:59" },
] as const;

export type BirthParams = { date?: string; hour?: string; cal?: string; leap?: string };

export default function BirthFields({
  prefix = "",
  label,
  defaults = {},
}: {
  prefix?: string;
  label?: string;
  defaults?: BirthParams;
}) {
  return (
    <fieldset className="group rounded-2xl border border-line bg-card shadow-sm p-4">
      {label && <legend className="px-1 text-base font-semibold text-plum">{label}</legend>}
      <p className="text-base font-medium">생년월일</p>
      <div className="mt-1.5">
        <DateSelects prefix={prefix} defaultDate={defaults.date} defaultCal={defaults.cal} defaultLeap={defaults.leap} />
      </div>
      <label className="mt-3 block">
        <span className="text-base font-medium">태어난 시간</span>
        <select
          name={`${prefix}hour`}
          defaultValue={defaults.hour ?? ""}
          className="mt-1.5 min-h-11 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-base focus:border-plum focus:outline-none"
        >
          <option value="">모름 (시주 제외)</option>
          {SIJIN.map((s) => (
            <option key={s.v} value={s.v}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  );
}

type SearchParams = Record<string, string | string[] | undefined>;

/** searchParams → 폼 값. JS 없이 제출되면 date가 [년, 월, 일] 배열로 온다. */
export function birthParams(sp: SearchParams, prefix = ""): BirthParams {
  const get = (k: string) => {
    const v = sp[prefix + k];
    return Array.isArray(v) ? (k === "date" ? v.join("-") : v[0]) : v;
  };
  return { date: get("date"), hour: get("hour"), cal: get("cal"), leap: get("leap") };
}

/** 링크용 쿼리스트링. 양력이면 cal/leap을 붙이지 않는다. */
export function birthQuery(p: BirthParams, prefix = ""): string {
  const q = new URLSearchParams();
  if (p.date) q.set(`${prefix}date`, p.date);
  if (p.hour) q.set(`${prefix}hour`, p.hour);
  if (p.cal === "lunar") {
    q.set(`${prefix}cal`, "lunar");
    if (p.leap === "1") q.set(`${prefix}leap`, "1");
  }
  return q.toString();
}

export type LunarBirth = { year: number; month: number; day: number; leap: boolean };

/**
 * "1990-05-05" + "9" → BirthInput(양력). 형식이 어긋나거나 없는 날짜면 null.
 * cal=lunar면 date를 음력으로 읽어 양력으로 바꾸고, 입력값은 lunar에 남긴다.
 */
export function parseBirth(date?: string, hour?: string, cal?: string, leap?: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date ?? "");
  if (!m) return null;
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (year < 1930 || year > 2030 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const h = hour === "" || hour === undefined ? null : Number(hour);
  if (h !== null && (!Number.isInteger(h) || h < 0 || h > 23)) return null;

  if (cal === "lunar") {
    const isLeap = leap === "1";
    const solar = lunarToSolar(year, month, day, isLeap);
    if (!solar) return null;
    return { ...solar, hour: h, lunar: { year, month, day, leap: isLeap } as LunarBirth | null };
  }

  // 2월 30일 같은 입력을 걸러낸다
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) return null;
  return { year, month, day, hour: h, lunar: null as LunarBirth | null };
}

/** "음력 1968년 3월 5일 (양력 1968년 4월 2일)" / 양력이면 "1968년 4월 2일" */
export function birthLabel(b: NonNullable<ReturnType<typeof parseBirth>>): string {
  const solar = `${b.year}년 ${b.month}월 ${b.day}일`;
  if (!b.lunar) return solar;
  const l = b.lunar;
  return `음력 ${l.year}년 ${l.leap ? "윤" : ""}${l.month}월 ${l.day}일 (양력 ${solar})`;
}

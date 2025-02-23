export function formatUnitTime(time: string): string {
  const match = time.match(/^(\d+)([smhdw])$/);
  if (!match) return time;

  const [, value, unit] = match;
  const unitMap = new Map([
    ["s", "seconds"],
    ["m", "minutes"],
    ["h", "hours"],
    ["d", "days"],
    ["w", "weeks"],
  ]);

  const numericValue = Number.parseInt(value, 10);
  if (!unitMap.has(unit)) return time;
  const _unit = unitMap.get(unit)!;
  const unitText = numericValue === 1 ? _unit.slice(0, -1) : _unit;
  return `${numericValue} ${unitText}`;
}

const durationRE =
  /((?:\d{1,16}(?:\.\d{1,16})?|\.\d{1,16})(?:[eE][-+]?\d{1,4})?)\s?([\p{L}]{0,14})/gu;

const unit = Object.create(null);
// eslint-disable-next-line unicorn/numeric-separators-style
const m = 60000,
  h = m * 60,
  d = h * 24,
  y = d * 365.25;

unit.year = unit.yr = unit.y = y;
unit.month = unit.mo = unit.mth = y / 12;
unit.week = unit.wk = unit.w = d * 7;
unit.day = unit.d = d;
unit.hour = unit.hr = unit.h = h;
unit.minute = unit.min = unit.m = m;
unit.second = unit.sec = unit.s = 1000;
unit.millisecond = unit.millisec = unit.ms = 1;
unit.microsecond = unit.microsec = unit.us = unit.µs = 1e-3;
unit.nanosecond = unit.nanosec = unit.ns = 1e-6;
unit.group = ",";
unit.decimal = ".";
unit.placeholder = " _";

export function parseUnitTime(str: string = "", format: string = "ms"): number {
  let result: number | null = null;
  let prevUnits: number;

  String(str)
    .replaceAll(
      new RegExp(`(\\d)[${unit.placeholder}${unit.group}](\\d)`, "g"),
      "$1$2"
    ) // clean up group separators / placeholders
    .replace(unit.decimal, ".") // normalize decimal separator
    .replaceAll(durationRE, (_, n, units) => {
      // if no units, find next smallest units or fall back to format value
      // eg. 1h30 -> 1h30m
      if (units) units = units.toLowerCase();
      else {
        if (prevUnits) {
          for (const u in unit)
            if (unit[u] < prevUnits) {
              units = u;
              break;
            }
        } else units = format;
      }

      prevUnits = units = unit[units] || unit[units.replace(/s$/, "")];
      if (units) result = (result || 0) + n * units;
      return "";
    });

  return (result ?? 0) / (unit[format] || 1) * (str[0] === "-" ? -1 : 1);
}

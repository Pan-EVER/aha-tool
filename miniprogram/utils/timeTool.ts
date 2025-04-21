// dateUtils.js
const dayjs = require("dayjs");

/**
 * 生成两个日期之间的所有日期序列
 * @param {string|Date|dayjs.Dayjs} start - 起始日期
 * @param {string|Date|dayjs.Dayjs} end - 结束日期
 * @param {string} [format='YYYY-MM-DD'] - 输出格式（传空返回dayjs对象数组）
 * @returns {(string[]|dayjs.Dayjs[])}
 */
export function getDateRange(start, end, format = "YYYY-MM-DD") {
  // 日期标准化处理（忽略时间部分）
  const startDate = dayjs(start).startOf("day");
  const endDate = dayjs(end).startOf("day");

  // 有效性校验
  if (!startDate.isValid() || !endDate.isValid()) return [];

  // 智能日期排序
  const [actualStart, actualEnd] = startDate.isAfter(endDate)
    ? [endDate, startDate]
    : [startDate, endDate];

  // 生成日期序列
  const dates: any[] = [];
  let currentDate = actualStart;
  while (currentDate.isBefore(actualEnd) || currentDate.isSame(actualEnd)) {
    dates.push(format ? currentDate.format(format) : currentDate);
    currentDate = currentDate.add(1, "day");
  }
  return dates;
}

/**
 * 判断目标日期是否在两个日期之间（包含边界）
 * @param {string|Date|dayjs.Dayjs} targetDate - 目标日期
 * @param {string|Date|dayjs.Dayjs} startDate - 开始日期
 * @param {string|Date|dayjs.Dayjs} endDate - 结束日期
 * @param {string} [unit='day'] - 比较精度（默认按天比较）
 * @returns {boolean}
 */
export function isBetweenInclusive(
  targetDate,
  startDate,
  endDate,
  unit = "day"
) {
  // 转换为dayjs对象并校验有效性
  const tDate = dayjs(targetDate);
  const sDate = dayjs(startDate);
  const eDate = dayjs(endDate);

  if (!tDate.isValid() || !sDate.isValid() || !eDate.isValid()) {
    return false;
  }

  // 标准化时间精度（默认按天比较）
  const normalizedTarget = tDate.startOf(unit);
  const normalizedStart = sDate.startOf(unit);
  const normalizedEnd = eDate.startOf(unit);

  // 自动处理日期顺序问题
  const [actualStart, actualEnd] = normalizedStart.isAfter(normalizedEnd)
    ? [normalizedEnd, normalizedStart]
    : [normalizedStart, normalizedEnd];

  // 判断是否在区间内（包含边界）
  return (
    normalizedTarget.isSame(actualStart, unit) ||
    normalizedTarget.isSame(actualEnd, unit) ||
    (normalizedTarget.isAfter(actualStart, unit) &&
      normalizedTarget.isBefore(actualEnd, unit))
  );
}

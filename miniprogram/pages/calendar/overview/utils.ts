import { getDateRange } from "../../../utils/timeTool";
import { activityList } from "./activities";

interface activityItem {
  startDate: string;
  endDate: string;
  name: string;
  address: string;
}

export const getEveryDayActivityList = () => {
  const resList = activityList.reduce((pre, cur) => {
    const itemList = getDateRange(cur.startDate, cur.endDate).map(
      (dateItem) => ({ ...cur, separateDate: dateItem })
    );
    return [...pre, ...itemList];
  }, [] as Array<activityItem & { separateDate: string }>);
  return resList;
};

export const everyDayActivityList = getEveryDayActivityList();

export const allAddressList = Array.from(
  new Set(everyDayActivityList.map((item) => item.address))
);

export const numberMap = {
  1: "①",
  2: "②",
  3: "③",
  4: "④",
  5: "⑤",
  6: "⑥",
  7: "⑦",
  8: "⑧",
  9: "⑨",
  10: "⑩",
};

export const addressMap = allAddressList.reduce((pre, cur, index) => {
  return { ...pre, [cur]: numberMap[index + 1] };
}, {} as Record<string, number>);

export const allAddressString = allAddressList
  .map((address, index) => `${index + 1}、${address}`)
  .join(" ");

// pages/calendar/overview/overview.ts
import { everyDayActivityList, allAddressString, addressMap } from "./utils";

const dayjs = require("dayjs");

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    minDate: new Date(2025, 0, 1).getTime(),
    maxDate: new Date(2025, 11, 31).getTime(),
    allAddressString,
    selectDate: Date.now(),
    selectDateStr: dayjs(Date.now()).format("YYYY-MM-DD"),
    selectDateDetailList: [],
    formatDayCell(day) {
      const { date } = day;

      const dateStr = dayjs(date).format("YYYY-MM-DD");
      const dateActivityList = everyDayActivityList.filter(
        (ele) => ele.separateDate === dateStr
      );
      if (dateActivityList.length) {
        day.className = dateActivityList.some(
          (ele) => ele.address === "广交会展馆"
        )
          ? "is-holiday"
          : "is-other";
        const prefix = Array.from(
          new Set(dateActivityList.map((ele) => addressMap[ele.address]))
        ).join();
        day.prefix = prefix;
      }
      return day;
    },
  },
  observers: {
    selectDate: function (selectDate) {
      this.setData({
        selectDateStr: dayjs(selectDate).format("YYYY-MM-DD"),
      });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSelect(e) {
      const selectDate = dayjs(e.detail.value).format("YYYY-MM-DD");

      const selectDateDetail = everyDayActivityList
        .filter((ele) => ele.separateDate === selectDate)
        .map((item) => ({
          ...item,
          dateRange: `${item.startDate}到${item.endDate}`,
        }));
      this.setData({
        selectDate: e.detail.value,
        selectDateDetailList: selectDateDetail,
      });
    },
  },
});

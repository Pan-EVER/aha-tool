// pages/deposit-forcast/deposit-forcast.ts
const dayjs = require("dayjs");
import ActionSheet, {
  ActionSheetTheme,
} from "tdesign-miniprogram/action-sheet/index";
import { getForecastDetail } from "../../../utils/getData";

interface PageData {
  income: number;
  cashSurplusSum: number;
  perMonthCostSum: number;
  predictSurplusMonthly: number;
  monthsNum: number;
  daysNum: number;
  timeSurplusList: Array<{ time: string; surplus: string }>;
  [key: string]: any;
}

Page({
  data: {
    pageQuery: {},
    income: 0,
    cashSurplusSum: 0,
    perMonthCostSum: 0,
    predictSurplusMonthly: 0,
    monthsNum: 0,
    daysNum: 0,
    timeSurplusList: [],
    popupProps: {
      usingCustomNavbar: true,
    },
    startDateVisible: false,
    startTime: dayjs().format("YYYY-MM-DD"),
    endDateVisible: false,
    endTime: dayjs().format("YYYY-MM-DD"),
  } as PageData,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query) {
    if (!query.id) return;
    this.setData({ pageQuery: { ...query } });
    const detailData = getForecastDetail(query.id);
    if (detailData) {
      const { startTime, endTime, income, cashSurplusList, perMonthCostList } =
        detailData;
      const monthsNum = this.monthsNum(startTime, endTime);
      const cashSurplusSum = this.cashSurplusSum(cashSurplusList);
      const predictSurplusMonthly = Number(
        this.predictSurplusMonthly(income, perMonthCostList).toFixed(2)
      );

      const list = new Array(monthsNum).fill(null).map((_, index) => {
        return {
          time: this.getTime(startTime, index),
          surplus: this.getTimeSurplusSum(
            cashSurplusSum,
            predictSurplusMonthly,
            index
          ),
        };
      });

      this.setData({
        startTime,
        endTime,
        income,
        cashSurplusSum,
        perMonthCostSum: Number(
          this.perMonthCostSum(perMonthCostList).toFixed(2)
        ),
        predictSurplusMonthly,
        monthsNum,
        daysNum: this.daysNum(startTime, endTime),
        timeSurplusList: list,
      });
    }
    console.log("detailData", detailData);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},
  /** 现金余额 */
  cashSurplusSum(arr: Array<{ label: string; value: number }>) {
    const sum = (arr || []).reduce((pre, cur) => pre + cur.value, 0);
    // return 8942.18;
    return sum;
  },
  /** 每月固定支出 */
  perMonthCostSum(arr: Array<{ label: string; value: number }>) {
    return (arr || []).reduce((pre, cur) => pre + cur.value, 0);
  },
  /** 每月盈余估算 */
  predictSurplusMonthly(
    income: number,
    arr: Array<{ label: string; value: number }>
  ) {
    return income - this.perMonthCostSum(arr);
  },
  monthsNum(startTime: string, endTime: string) {
    return dayjs(endTime).diff(dayjs(startTime), "month");
  },
  daysNum(startTime: string, endTime: string) {
    return dayjs(endTime).diff(dayjs(startTime), "day");
  },
  getTime(startTime: string, diffMonth: number) {
    return dayjs(startTime).add(diffMonth, "month").format("YYYY-MM-DD");
  },
  getTimeSurplusSum(
    surplusSum: number,
    surplusMonthly: number,
    diffMonth: number
  ) {
    let sumRes = 0;
    sumRes = surplusSum + surplusMonthly * diffMonth;
    return sumRes.toFixed(2);
  },

  onEdit() {
    ActionSheet.show({
      theme: ActionSheetTheme.List,
      selector: "#t-action-sheet",
      context: this,
      description: "请选择要编辑的项",
      items: [
        {
          label: "月收入",
          key: "income",
        },
        {
          label: "净资产",
          key: "surplusSum",
        },
        {
          label: "月支出",
          key: "cost",
        },
        {
          label: "开始日期",
          key: "startTime",
        },
        {
          label: "结束日期",
          key: "endTime",
        },
      ],
    });
  },
  onEditItemSelected(e: any) {
    const key = e.detail.selected.key;
    console.log("startTime", this.data.startTime);

    switch (key) {
      case "startTime":
        this.setData({ startDateVisible: true });
        break;
      case "endTime":
        this.setData({ endDateVisible: true });
        break;
      case "surplusSum":
        wx.navigateTo({
          url: `/pages/deposit-forecast/surplus-list/surplus-list?id=${this.data.pageQuery.id}`,
        });
        break;
      case "income":
        wx.navigateTo({
          url: `/pages/deposit-forecast/income-list/income-list?id=${this.data.pageQuery.id}`,
        });
        break;
      default:
        break;
    }
    console.log("e", e);
  },
  hidePicker() {
    this.setData({
      startDateVisible: false,
      endDateVisible: false,
    });
  },

  onStartDateConfirm(e: any) {
    const { value } = e.detail;
    this.setData({
      startDateVisible: false,
      startTime: value,
    });
  },

  onEndDateConfirm(e: any) {
    const { value } = e.detail;
    this.setData({
      endDateVisible: false,
      endTime: value,
    });
  },
});

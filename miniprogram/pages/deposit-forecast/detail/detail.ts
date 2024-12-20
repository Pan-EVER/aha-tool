// pages/deposit-forcast/deposit-forcast.ts
import ActionSheet, {
  ActionSheetTheme,
} from "tdesign-miniprogram/action-sheet/index";
import { getForecastDetail, updateForecast } from "../../../utils/getData";

const dayjs = require("dayjs");
const Decimal = require("decimal.js");
interface PageData {
  incomeSum: number;
  cashSurplusSum: number;
  perMonthCostSum: number;
  predictSurplusMonthly: number;
  monthsNum: number;
  daysNum: number;
  timeSurplusList: Array<{ time: string; surplus: number }>;
  [key: string]: any;
}

Page({
  data: {
    pageQuery: {},
    incomeSum: 0,
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
  /** 更新页面状态 */
  computePageState(id) {
    const detailData = getForecastDetail(id);
    if (detailData) {
      const {
        startTime,
        endTime,
        incomeList,
        cashSurplusList,
        perMonthCostList,
      } = detailData;
      const monthsNum = this.monthsNum(startTime, endTime);
      const cashSurplusSum = this.calcListValueSum(cashSurplusList);
      const incomeSum = this.calcListValueSum(incomeList);
      const perMonthCostSum = this.calcListValueSum(perMonthCostList);
      const predictSurplusMonthly = Decimal.sub(
        incomeSum,
        perMonthCostSum
      ).toNumber();

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
        startTime: startTime || "-",
        endTime: endTime || "-",
        incomeSum,
        cashSurplusSum,
        perMonthCostSum,
        predictSurplusMonthly,
        monthsNum,
        daysNum: this.daysNum(startTime, endTime),
        timeSurplusList: list,
      });
    }
    console.log("detailData", detailData);
  },
  onLoad(query) {
    if (!query.id) return;
    this.setData({ pageQuery: { ...query } });
    this.computePageState(query.id);
  },
  // 页面返回便更新数据
  onShow() {
    const { pageQuery } = this.data;
    if (!pageQuery.id) return;
    this.computePageState(pageQuery.id);
  },
  calcListValueSum(list: Array<{ label: string; value: number }>) {
    const sum = (list || []).reduce(
      (pre, cur) => Decimal.add(pre, cur.value || 0).toNumber(),
      0
    );
    return sum;
  },
  monthsNum(startTime: string, endTime: string) {
    return dayjs(endTime).diff(dayjs(startTime), "month");
  },
  daysNum(startTime: string, endTime: string) {
    return dayjs(endTime).diff(dayjs(startTime), "day") || "-";
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
    sumRes = new Decimal(surplusMonthly)
      .mul(diffMonth)
      .add(surplusSum)
      .toNumber();
    return sumRes;
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
      case "cost":
        wx.navigateTo({
          url: `/pages/deposit-forecast/cost-list/cost-list?id=${this.data.pageQuery.id}`,
        });
        break;
      default:
        break;
    }
  },
  hidePicker() {
    this.setData({
      startDateVisible: false,
      endDateVisible: false,
    });
  },

  async onStartDateConfirm(e: any) {
    const { value } = e.detail;
    const { pageQuery } = this.data;
    this.setData({
      startDateVisible: false,
    });
    if (pageQuery.id) {
      const detailData = getForecastDetail(pageQuery.id);
      await updateForecast({
        ...detailData,
        startTime: value,
      });
      this.computePageState(pageQuery.id);
    }
  },

  async onEndDateConfirm(e: any) {
    const { value } = e.detail;
    const { pageQuery } = this.data;
    this.setData({
      endDateVisible: false,
    });
    if (pageQuery.id) {
      const detailData = getForecastDetail(pageQuery.id);
      await updateForecast({
        ...detailData,
        endTime: value,
      });
      this.computePageState(pageQuery.id);
    }
  },
});

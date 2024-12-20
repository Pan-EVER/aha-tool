// pages/deposit-forecast/income-list/income-list.ts
import { getForecastDetail, updateForecast } from "../../../utils/getData";

const Decimal = require("decimal.js");

Page({
  data: {
    pageQuery: {},
    incomeSum: 0,
    incomeList: [],
    popupType: "", // add | edit
    editIncomeLabel: "", // 正在编辑的资产名称
    popupOpen: false,
    incomeValue: 0,
    incomeName: "",
    activeCollapse: [0],
  },
  updateDetail(id) {
    const detailData = getForecastDetail(id);
    if (!detailData) return;
    const incomeList = detailData.incomeList || [];
    const incomeSum = incomeList.reduce(
      (pre, cur) => Decimal.add(cur.value || 0, pre).toNumber(),
      0
    );

    this.setData({
      incomeSum,
      incomeList: incomeList,
    });
  },
  onLoad(query) {
    if (!query.id) return;
    this.setData({ pageQuery: { ...query } });
    this.updateDetail(query.id);
  },
  onCollapseChange(e: any) {
    this.setData({
      activeCollapse: e.detail.value,
    });
  },
  onAddIncome() {
    this.setData({ popupType: "add", popupOpen: true });
  },
  onEditIncome(e) {
    const { label, value } = e.target.dataset.item || {};
    this.setData({
      popupType: "edit",
      popupOpen: true,
      incomeValue: value,
      incomeName: label,
      editIncomeLabel: label,
    });
  },
  async onDeleteIncome(e) {
    const { pageQuery } = this.data;
    const label = e.target.dataset.label;
    if (!pageQuery.id) return;
    const detailData = getForecastDetail(pageQuery.id);
    const newItem = {
      ...detailData,
      incomeList: detailData.incomeList.filter((ele) => ele.label !== label),
    };
    await updateForecast(newItem);
    this.updateDetail(pageQuery.id);
  },
  onVisibleChange(e: any) {
    this.setData({
      popupOpen: e.detail.visible,
    });
  },
  onCancel() {
    this.setData({
      popupOpen: false,
    });
  },
  initAddForm() {
    this.setData({
      incomeValue: 0,
      incomeName: "",
    });
  },
  async onConfirm() {
    const { pageQuery, popupType, editIncomeLabel, incomeValue, incomeName } =
      this.data;
    if (!incomeName) return;
    if (!incomeValue) return;
    if (!pageQuery.id) return;
    const detailData = getForecastDetail(pageQuery.id);
    if (!detailData) return;
    const originIncomeList = detailData.incomeList || [];
    // 新增资产
    if (popupType === "add") {
      const matchRes = originIncomeList.some((ele) => ele.label === incomeName);
      if (matchRes) {
        console.log(`已存在${incomeName}`);
        return;
      }
      const newItem = {
        ...detailData,
        incomeList: [
          ...originIncomeList,
          {
            label: incomeName,
            value: Number(incomeValue),
          },
        ],
      };
      await updateForecast(newItem);
    }
    // 编辑资产
    if (popupType === "edit") {
      const newItem = {
        ...detailData,
        incomeList: originIncomeList.map((ele) => {
          if (ele.label === editIncomeLabel) {
            return {
              label: incomeName,
              value: Number(incomeValue),
            };
          }
          return ele;
        }),
      };
      await updateForecast(newItem);
    }
    this.updateDetail(pageQuery.id);
    this.setData({
      popupType: "",
      popupOpen: false,
    });
    this.initAddForm();
  },
});

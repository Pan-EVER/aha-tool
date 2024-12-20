// pages/deposit-forecast/cost-list/cost-list.ts
import { getForecastDetail, updateForecast } from "../../../utils/getData";

const Decimal = require("decimal.js");

Page({
  data: {
    pageQuery: {},
    costSum: 0,
    costList: [],
    popupType: "", // add | edit
    editCostLabel: "", // 正在编辑的资产名称
    popupOpen: false,
    costValue: 0,
    costName: "",
    activeCollapse: [0],
  },
  updateDetail(id) {
    const detailData = getForecastDetail(id);
    if (!detailData) return;
    const costList = detailData.perMonthCostList || [];
    const costSum = costList.reduce(
      (pre, cur) => Decimal.add(cur.value || 0, pre).toNumber(),
      0
    );

    this.setData({
      costSum,
      costList: costList,
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
  onAddCost() {
    this.setData({ popupType: "add", popupOpen: true });
  },
  onEditCost(e) {
    const { label, value } = e.target.dataset.item || {};
    this.setData({
      popupType: "edit",
      popupOpen: true,
      costValue: value,
      costName: label,
      editCostLabel: label,
    });
  },
  async onDeleteCost(e) {
    const { pageQuery } = this.data;
    const label = e.target.dataset.label;
    if (!pageQuery.id) return;
    const detailData = getForecastDetail(pageQuery.id);
    const newItem = {
      ...detailData,
      perMonthCostList: detailData.perMonthCostList.filter((ele) => ele.label !== label),
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
      costValue: 0,
      costName: "",
    });
  },
  async onConfirm() {
    const { pageQuery, popupType, editCostLabel, costValue, costName } =
      this.data;
    if (!costName) return;
    if (!costValue) return;
    if (!pageQuery.id) return;
    const detailData = getForecastDetail(pageQuery.id);
    if (!detailData) return;
    const originCostList = detailData.perMonthCostList || [];
    // 新增资产
    if (popupType === "add") {
      const matchRes = originCostList.some((ele) => ele.label === costName);
      if (matchRes) {
        console.log(`已存在${costName}`);
        return;
      }
      const newItem = {
        ...detailData,
        perMonthCostList: [
          ...originCostList,
          {
            label: costName,
            value: Number(costValue),
          },
        ],
      };
      await updateForecast(newItem);
    }
    // 编辑资产
    if (popupType === "edit") {
      const newItem = {
        ...detailData,
        perMonthCostList: originCostList.map((ele) => {
          if (ele.label === editCostLabel) {
            return {
              label: costName,
              value: Number(costValue),
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

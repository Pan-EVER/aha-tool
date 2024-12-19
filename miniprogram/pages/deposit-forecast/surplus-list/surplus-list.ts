// pages/deposit-forecast/surplus-list.ts
import { getForecastDetail, updateForecast } from "../../../utils/getData";

Page({
  data: {
    pageQuery: {},
    assetList: [],
    debtList: [],
    netAsset: 0,
    asset: 0,
    debt: 0,
    popupType: "", // add | edit
    editAssetLabel: "", // 正在编辑的资产名称
    popupOpen: false,
    assetType: "asset", // debt | asset
    assetValue: 0,
    assetName: "",
    activeCollapse: [],
  },
  updateDetail(id) {
    const detailData = getForecastDetail(id);
    if (!detailData) return;
    const tempAssetList: any[] = [];
    const tempDebtList: any[] = [];
    detailData.cashSurplusList.forEach((ele) => {
      if (Number(ele.value) > 0) {
        tempAssetList.push(ele);
      }
      if (Number(ele.value) < 0) {
        tempDebtList.push(ele);
      }
    });
    const asset = tempAssetList.reduce((pre, cur) => (cur.value || 0) + pre, 0);
    const debt = tempDebtList.reduce((pre, cur) => (cur.value || 0) + pre, 0);
    const netAsset = asset + debt;
    this.setData({
      assetList: tempAssetList,
      debtList: tempDebtList,
      asset,
      debt: debt.toFixed(2),
      netAsset: netAsset.toFixed(2),
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
  onAddAsset() {
    this.setData({ popupType: "add", popupOpen: true });
  },
  onEditAsset(e) {
    const { label, value } = e.target.dataset.item || {};
    this.setData({
      popupType: "edit",
      popupOpen: true,
      assetValue: value,
      assetName: label,
      assetType: Number(value) > 0 ? "asset" : "debt",
      editAssetLabel: label,
    });
  },
  async onDeleteAsset(e) {
    const { pageQuery } = this.data;
    const label = e.target.dataset.label;
    if (!pageQuery.id) return;
    const detailData = getForecastDetail(pageQuery.id);
    const newItem = {
      ...detailData,
      cashSurplusList: detailData.cashSurplusList.filter(
        (ele) => ele.label !== label
      ),
    };
    await updateForecast(newItem);
    this.updateDetail(pageQuery.id);
  },
  onVisibleChange(e: any) {
    this.setData({
      popupOpen: e.detail.visible,
    });
  },
  onAssetTypeChange(e: any) {
    this.setData({ assetType: e.detail.value });
  },
  onCancel() {
    this.setData({
      popupOpen: false,
    });
  },
  initAddForm() {
    this.setData({
      assetType: "asset",
      assetValue: 0,
      assetName: "",
    });
  },
  async onConfirm() {
    const {
      pageQuery,
      popupType,
      editAssetLabel,
      assetType,
      assetValue,
      assetName,
    } = this.data;
    if (!assetName) return;
    if (!assetValue) return;
    if (!pageQuery.id) return;
    const detailData = getForecastDetail(pageQuery.id);
    if (!detailData) return;
    // 新增资产
    if (popupType === "add") {
      const matchRes = detailData.cashSurplusList.some(
        (ele) => ele.label === assetName
      );
      if (matchRes) {
        console.log(`已存在${assetName}`);
        return;
      }
      const newItem = {
        ...detailData,
        cashSurplusList: [
          ...detailData.cashSurplusList,
          {
            label: assetName,
            value:
              assetType === "debt"
                ? -Math.abs(Number(assetValue))
                : Number(assetValue),
          },
        ],
      };
      await updateForecast(newItem);
    }
    // 编辑资产
    if (popupType === "edit") {
      const newItem = {
        ...detailData,
        cashSurplusList: detailData.cashSurplusList.map((assetItem) => {
          if (assetItem.label === editAssetLabel) {
            return {
              label: assetName,
              value:
                assetType === "debt"
                  ? -Math.abs(Number(assetValue))
                  : Number(assetValue),
            };
          }
          return assetItem;
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

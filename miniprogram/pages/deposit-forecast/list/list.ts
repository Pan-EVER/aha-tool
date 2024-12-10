// pages/deposit-forecast/list/list.ts
import { getForecastList, addForecast } from "../../../utils/getData";
import Message from "tdesign-miniprogram/message/index";

Page({
  data: {
    forecastList: [],
    showAddDialog: false,
    addForm: {
      name: {
        value: "",
        status: "",
        tips: "",
      },
      remark: {
        value: "",
      },
    },
  },
  refreshList() {
    const res = getForecastList();
    if (res?.length) {
      this.setData({
        forecastList: res,
      });
    } else {
      this.setData({
        forecastList: [],
      });
    }
  },
  onLoad() {
    this.refreshList();
  },
  goDetail(event: any) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/deposit-forecast/detail/detail?id=${id}` });
  },
  onAddItem() {
    this.setData({
      showAddDialog: true,
    });
  },
  onFormChange(e: any) {
    const prop = e.target.dataset.prop as "name" | "remark";
    if (prop) {
      const { addForm } = this.data;
      this.setData({
        addForm: {
          ...addForm,
          [prop]: {
            ...addForm[prop],
            value: e.detail.value,
          },
        },
      });
    }
  },
  onConfirm() {
    const { name, remark } = this.data.addForm;
    if (!name.value) {
      Message.warning({
        context: this,
        offset: [90, 32],
        duration: 2000,
        content: "请输入名称",
      });
      return;
    }
    addForecast({ name: name.value, remark: remark.value });
    this.refreshList();
    this.closeDialog();
  },
  closeDialog() {
    this.setData({
      showAddDialog: false,
    });
  },
});

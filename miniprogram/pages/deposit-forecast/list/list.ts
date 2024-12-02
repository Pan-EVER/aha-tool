// pages/deposit-forecast/list/list.ts
import { getForecastList } from "../../../utils/getData";

Page({
  data: {
    forecastList: [],
  },
  onLoad() {
    const res = getForecastList();
    console.log("res", res);
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
  onReady() {},
  onPullDownRefresh() {},
  goDetail(event: any) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/deposit-forecast/detail/detail?id=${id}` });
  },
});

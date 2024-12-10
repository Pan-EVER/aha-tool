import { generateUUID } from "./util";

export const addForecast = (data) => {
  const { name, remark = "" } = data || {};
  if (name) {
    const originList = getForecastList() || [];
    const newItem = {
      id: generateUUID(),
      name,
      remark,
      income: 0,
      startTime: "",
      endTime: "",
      cashSurplusList: [],
      perMonthCostList: [],
    };
    originList.unshift(newItem);
    wx.setStorageSync("forecastList", originList);
    return;
  }
};

export const getForecastList = () => {
  return wx.getStorageSync("forecastList");
};

export const getForecastDetail = (id: string) => {
  const list = wx.getStorageSync("forecastList");
  if (id && list?.length) {
    const data = list.find((item) => item.id === id);
    return data;
  }
  return null;
};

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

export const deleteForecast = (id: string) =>
  new Promise((resolve, reject) => {
    if (!id) {
      reject("id必传");
    }
    const originList = getForecastList() || [];
    const filterList = originList.filter((ele) => ele.id !== id);
    wx.setStorageSync("forecastList", filterList);
    resolve("success");
  });

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

export const updateForecast = (data) =>
  new Promise((resolve, reject) => {
    const { id } = data;
    if (!id) {
      reject("id必传");
    }
    const originList = getForecastList() || [];
    const list = originList.map((originEle) =>
      originEle.id === id ? data : originEle
    );
    wx.setStorageSync("forecastList", list);
    resolve("success");
  });

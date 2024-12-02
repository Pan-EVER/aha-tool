export const getForecastList = () => {
  return wx.getStorageSync("forecastList");
};

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

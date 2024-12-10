export const formatTime = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

const formatNumber = (n: number) => {
  const s = n.toString();
  return s[1] ? s : "0" + s;
};

// UUID v4规范
export function generateUUID() {
  // UUID模板，'x' 表示将被替换的字符位置
  let uuidTemplate = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

  // 用于替换 'x' 的字符集（0-9 和 a-f）
  let chars = "0123456789abcdef";

  // 替换 UUID 模板中的 'x'
  uuidTemplate = uuidTemplate.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0; // 生成一个 0 到 15 之间的随机整数
    let v = c === "x" ? r : (r & 0x3) | 0x8; // 对于 'x'，直接使用 r；对于 'y'，使用 r 的低三位与 0x3 做与运算后，再与 0x8 做或运算
    return chars[v];
  });

  return uuidTemplate;
}

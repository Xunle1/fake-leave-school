import { request } from "@tarojs/taro";

const json2base64 = (json: any) =>
  Buffer.from(JSON.stringify(json)).toString("base64");
const getNowTimestamp = () => Math.round(+new Date() / 1000);

const chu = {
  version: "1.1",
  location: "崇文门",
  latitude: "",
  longitude: "",
  timestamp: getNowTimestamp(),
};
const userInfo = {
  xh: "", // 学号
  openid: "", // open_id
};
const requestData = {
  ...chu,
  ...userInfo,
  log_id: 1,
};
export const leave = () =>
  request({
    url: "https://we.cqupt.edu.cn/api/lxsp/post_lxsp_sm_test20210311.php",
    method: "POST",
    data: {
      key: json2base64({
        ...requestData,
        type: "出校",
      }),
    },
    header: {
      "content-type": "application/json", // 默认值
    },
  });

export const back = () =>
  request({
    url: "https://we.cqupt.edu.cn/api/lxsp/post_lxsp_sm_test20210311.php",
    method: "POST",
    data: {
      key: json2base64({
        ...requestData,
        type: "入校",
      }),
    },
    header: {
      "content-type": "application/json", // 默认值
    },
  });

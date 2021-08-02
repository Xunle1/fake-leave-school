import { request } from "@tarojs/taro";

const json2base64 = (json: any) =>
  Buffer.from(JSON.stringify(json)).toString("base64");
const getNowTimestamp = () => Math.round(+new Date() / 1000);

export type Type = "出校" | "入校";
export type Location = "崇文门" | "腾飞门";

const baseData = {
  version: "1.1",
  latitude: "",
  longitude: "",
};
const userInfo = {
  xh: "", // 学号
  openid: "", // open_id
};
const requestData = {
  ...baseData,
  ...userInfo,
  log_id: 1,
};

export const apply = (type: Type, location: Location) => {
  return request({
    url: "https://we.cqupt.edu.cn/api/lxsp/post_lxsp_sm_test20210311.php",
    method: "POST",
    data: {
      key: json2base64({
        ...requestData,
        type,
        location,
        timestamp: getNowTimestamp(),
      }),
    },
    header: {
      "content-type": "application/json",
    },
  });
};

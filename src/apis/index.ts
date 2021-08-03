import { request, RequestTask } from "@tarojs/taro";
import { Type, Location } from "src/pages/common/constants";

const json2base64 = (json: any) =>
  Buffer.from(JSON.stringify(json)).toString("base64");
const getNowTimestamp = () => Math.round(+new Date() / 1000);

interface ApplyRes {
  status: number;
  message: string;
  data: {
    time: string;
    type: Type;
    location: Location;
    num: number;
  };
}

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

export const apply = (type: Type, location: Location): RequestTask<ApplyRes> =>
  request({
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

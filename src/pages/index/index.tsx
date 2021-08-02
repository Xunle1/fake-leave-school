import { View, Text, Input } from "@tarojs/components";
import {
  scanCode,
  getStorage,
  setStorage,
  navigateTo,
  removeStorage,
} from "@tarojs/taro";
import { useState, useEffect } from "react";
import * as dayjs from "dayjs";
import "./index.scss";

enum STATUS {
  "INITIAL" = 0,
  "LEAVE" = 1,
  "BACK" = 2,
}

interface Info {
  time: string;
  location: string;
}

const initState: Info = {
  time: "",
  location: "",
};

const Index = () => {
  const [isLeave, setIsLeave] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const [name, setName] = useState("姓名");
  const [stuNum, setStuNum] = useState("学号");
  const [applyTime, setApplyTime] = useState("");
  const [leave, setLeave] = useState<Info>(initState);
  const [back, setBack] = useState<Info>(initState);
  const [editable, setEditable] = useState(false);
  function getDate() {
    return dayjs().format("YYYY-MM-DD");
  }
  function getTime() {
    return dayjs().format("YYYY-MM-DD HH:mm:ss");
  }

  function getApplyTime() {
    return dayjs(+new Date() - 60 * 60 * 1000).format("YYYY-MM-DD HH:mm:ss");
  }

  function setLeaveInfo() {
    getStorage({
      key: "leave",
      success: (res) => {
        setLeave(res.data);
      },
    });
    setIsLeave(true);
  }

  function setBackInfo() {
    getStorage({
      key: "back",
      success: (res) => {
        setBack(res.data);
      },
    });
    setIsBack(true);
  }

  function reset() {
    removeStorage({
      key: "leave",
    });
    removeStorage({
      key: "back",
    });
    removeStorage({
      key: "status",
    });
    removeStorage({
      key: "apply_time",
    });
    setApplyTime(getApplyTime());
    setLeave({ ...initState });
    setBack({ ...initState });
    setIsLeave(false);
    setIsBack(false);
  }
  useEffect(() => {
    getStorage({
      key: "apply_time",
      success: (res) => {
        setApplyTime(res.data);
      },
      fail: () => {
        const time = getApplyTime();
        setApplyTime(time);
        setStorage({
          key: "apply_time",
          data: time,
        });
      },
    });
    getStorage({
      key: "name",
      success: (res) => {
        setName(res.data);
      },
    });
    getStorage({
      key: "status",
      success: (res) => {
        const { data: status } = res;
        if (status === STATUS.LEAVE) {
          setLeaveInfo();
        } else if (res.data === STATUS.BACK) {
          setLeaveInfo();
          setBackInfo();
        }
      },
    });
    getStorage({
      key: "stuNum",
      success: (res) => {
        setStuNum(res.data);
      },
    });
  }, []);

  function scan() {
    scanCode({
      scanType: ["qrCode"],
      onlyFromCamera: true,
      success: (res) => {
        const data = JSON.parse(res.result);
        const { type, location } = data;
        const info = {
          time: getTime(),
          location,
        };
        if (type === "出校") {
          setIsLeave(true);
          setLeave({ ...info });
          setStorage({
            key: "leave",
            data: {
              ...info,
            },
          });
          setStorage({
            key: "status",
            data: "1",
            success: () => {
              navigateTo({
                url: `/pages/detail/index?location=${location}&type=出校`,
              });
            },
          });
        } else {
          setIsBack(true);
          setBack({ ...info });
          setStorage({
            key: "back",
            data: {
              ...info,
            },
          });
          setStorage({
            key: "status",
            data: "2",
            success: () => {
              navigateTo({
                url: `/pages/detail/index?location=${location}&type=入校`,
              });
            },
          });
        }
      },
    });
  }

  function getBackTitleClass() {
    if (isLeave && !isBack) return "active";
    if (isLeave && isBack) return "pass";
  }

  return (
    <View className="home">
      <View className="title" onClick={() => setEditable(!editable)}>
        申请流程
      </View>
      <View className="container">
        <View className="section">
          <View className="section__item">
            <View className="section__title first" onClick={reset}>
              申请
            </View>
            <View className="section__info">
              <View className="item">
                <Text>申请人</Text>
                <Input
                  disabled={!editable}
                  value={name}
                  className="input"
                  onInput={(e) => {
                    setName(e.detail.value);
                    setStorage({
                      key: "name",
                      data: e.detail.value,
                    });
                  }}
                ></Input>
              </View>
              <View className="item">
                <Text>申请时间</Text>
                <Text>{applyTime}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className="container">
        <View className="section">
          <View className="section__item">
            <View
              className={`"section__title" ${isLeave ? "pass" : "active"} `}
            >
              <Text>扫码离校</Text>
              <Text
                className={`scan ${!isLeave && "active"}`}
                onClick={() => {
                  if (isLeave) return;
                  scan();
                }}
              >
                离校扫码
              </Text>
            </View>
            <View className="section__info">
              <View className="item">
                <Text>扫码地点</Text>
                <Text>{leave.location}</Text>
              </View>
              <View className="item">
                <Text>出校时间</Text>
                <Text>{leave.time}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className="container">
        <View className="section">
          <View className="section__item">
            <View className={`"section__title last" ${getBackTitleClass()}`}>
              <Text>返校销假</Text>
              <Text
                className={`scan ${getBackTitleClass()} `}
                onClick={() => {
                  if (!isLeave || isBack) return;
                  scan();
                }}
              >
                返校扫码
              </Text>
            </View>
            <View className="section__info">
              <View className="item">
                <Text>扫码地点</Text>
                <Text>{back.location}</Text>
              </View>
              <View className="item">
                <Text>返校时间</Text>
                <Text>{back.time}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className="title">申请详情</View>
      <View className="detail">
        <View className="item">
          <Text>学号</Text>
          <Input
            disabled={!editable}
            value={stuNum}
            className="input"
            onInput={(e) => {
              setStuNum(e.detail.value);
              setStorage({
                key: "stuNum",
                data: e.detail.value,
              });
            }}
          ></Input>
        </View>
        <View className="item">
          <Text>姓名</Text>
          <Text>{name}</Text>
        </View>
        <View className="item">
          <Text>请假类型</Text>
          <Text>普通离返校</Text>
        </View>
        <View className="item">
          <Text>出发时间</Text>
          <Text>{getDate()}</Text>
        </View>
        <View className="item">
          <Text>预计返校时间</Text>
          <Text>{getDate()}</Text>
        </View>
        <View className="item">
          <Text>外出地点</Text>
          <Text>重庆市,重庆市,南岸区</Text>
        </View>
        <View className="item">
          <Text>外出事由</Text>
          <Text>1</Text>
        </View>
      </View>
    </View>
  );
};

export default Index;

import { View, Text, Input } from "@tarojs/components";
import {
  scanCode,
  getStorage,
  setStorage,
  navigateTo,
  useRouter,
  navigateBack,
  showToast,
} from "@tarojs/taro";
import { useState, useEffect } from "react";
import { Location, STATUS, Storage, Type } from "../common/constants";
import { Info, List, ListItem } from "../common/types";
import { getTime } from "../common/helpers/date";
import "./index.scss";
import { getInitList } from "../common/helpers";

interface ScanResult {
  code: string;
  location: Location;
  type: Type;
  url: string;
  version: string;
}

const initList = getInitList();

const InfoPage = () => {
  const router = useRouter();
  const id = parseInt(router.params.id!, 10);
  const [list, setList] = useState<List>(initList);
  const [info, setInfo] = useState<ListItem>(initList[0]);
  const [isLeave, setIsLeave] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const [name, setName] = useState("姓名");
  const [stuNum, setStuNum] = useState("学号");
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (!id) navigateBack();
    getStorage({
      key: Storage.LIST,
      success: (res) => {
        setList(res.data);
        const item = res.data.find((e: ListItem) => e.id === id);
        if (!item) navigateBack();
        setInfo(item);
      },
    });
    getStorage({
      key: Storage.NAME,
      success: (res) => {
        setName(res.data);
      },
    });
    getStorage({
      key: Storage.STU_NUM,
      success: (res) => {
        setStuNum(res.data);
      },
    });
  }, []);

  useEffect(() => {
    if (info.status === STATUS.LEAVE) {
      setIsLeave(true);
    } else if (info.status === STATUS.BACK) {
      setIsLeave(true);
      setIsBack(true);
    }
  }, [info.status]);
  function scan(type: Type) {
    scanCode({
      scanType: ["qrCode"],
      success: (res) => {
        const data: ScanResult = JSON.parse(res.result);

        const { type: scanType, location } = data;
        if (scanType !== type) {
          showToast({
            title: "扫码类型错误",
            icon: "none",
            duration: 1000,
            mask: true,
          });
          return;
        }
        const nowTime = getTime();
        const leaveOrBackInfo: Info = {
          time: nowTime,
          location,
        };
        if (type === "出校") {
          const newInfo: ListItem = {
            ...info,
            updateTime: nowTime,
            status: STATUS.LEAVE,
            leaveInfo: {
              ...leaveOrBackInfo,
            },
          };
          setIsLeave(true);
          setInfo(newInfo);
          setStorage({
            key: Storage.LIST,
            data: [newInfo, ...list.slice(1)],
          });
          navigateTo({
            url: `/pages/detail/index?location=${location}&type=出校`,
          });
        } else if (type === "入校") {
          const newInfo: ListItem = {
            ...info,
            updateTime: nowTime,
            status: STATUS.BACK,
            backInfo: {
              ...leaveOrBackInfo,
            },
          };
          setIsBack(true);
          setInfo(newInfo);
          setStorage({
            key: Storage.LIST,
            data: [newInfo, ...list.slice(1)],
          });
          navigateTo({
            url: `/pages/detail/index?location=${location}&type=入校`,
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
            <View className="section__title first">申请</View>
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
                <Text>{info.applyTime}</Text>
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
                  scan("出校");
                }}
              >
                离校扫码
              </Text>
            </View>
            <View className="section__info">
              <View className="item">
                <Text>扫码地点</Text>
                <Text>{info.leaveInfo.location}</Text>
              </View>
              <View className="item">
                <Text>出校时间</Text>
                <Text>{info.leaveInfo.time}</Text>
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
                  scan("入校");
                }}
              >
                返校扫码
              </Text>
            </View>
            <View className="section__info">
              <View className="item">
                <Text>扫码地点</Text>
                <Text>{info.backInfo.location}</Text>
              </View>
              <View className="item">
                <Text>返校时间</Text>
                <Text>{info.backInfo.time}</Text>
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
          <Text>{info.date}</Text>
        </View>
        <View className="item">
          <Text>预计返校时间</Text>
          <Text>{info.date}</Text>
        </View>
        <View className="item">
          <Text>外出地点</Text>
          <Text>重庆市,重庆市,南岸区</Text>
        </View>
        <View className="item">
          <Text>外出事由</Text>
          <Text>外出</Text>
        </View>
      </View>
    </View>
  );
};

export default InfoPage;
import { View, Text, Input } from "@tarojs/components";
import {
  scanCode,
  getStorage,
  setStorage,
  navigateTo,
  useRouter,
  navigateBack,
  showToast,
  preload,
} from "@tarojs/taro";
import { useState, useEffect } from "react";
import { Location, STATUS, Storage, Type } from "../common/constants";
import { Info, List, ListItem } from "../common/types";
import { getTime } from "../common/helpers/date";
import styles from "./index.module.scss";
import { getInitList } from "../common/helpers";
import classNames from "classnames/bind";
import { apply } from "../../apis/index";
let cx = classNames.bind(styles);

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
          preload(apply(type, location));
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
          preload(apply(type, location));
          navigateTo({
            url: `/pages/detail/index?location=${location}&type=入校`,
          });
        }
      },
    });
  }

  return (
    <View className={styles.home}>
      <View className={styles.title} onClick={() => setEditable(!editable)}>
        申请流程
      </View>
      <View className={styles.container}>
        <View className={styles.section}>
          <View className={styles.section__item}>
            <View className={`${styles.section__title} ${styles.first}`}>
              申请
            </View>
            <View className={styles.section__info}>
              <View className={styles.item}>
                <Text>申请人</Text>
                <Input
                  disabled={!editable}
                  value={name}
                  className={styles.input}
                  onInput={(e) => {
                    setName(e.detail.value);
                    setStorage({
                      key: "name",
                      data: e.detail.value,
                    });
                  }}
                ></Input>
              </View>
              <View className={styles.item}>
                <Text>申请时间</Text>
                <Text>{info.applyTime}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className={styles.container}>
        <View className={styles.section}>
          <View className={styles.section__item}>
            <View
              className={cx("section__title", {
                pass: isLeave,
                active: !isLeave,
              })}
            >
              <Text>扫码离校</Text>
              <Text
                className={cx("scan", {
                  active: !isLeave,
                })}
                onClick={() => {
                  if (isLeave) return;
                  scan("出校");
                }}
              >
                离校扫码
              </Text>
            </View>
            <View className={styles.section__info}>
              <View className={styles.item}>
                <Text>扫码地点</Text>
                <Text>{info.leaveInfo.location}</Text>
              </View>
              <View className={styles.item}>
                <Text>出校时间</Text>
                <Text>{info.leaveInfo.time}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className={styles.container}>
        <View className={styles.section}>
          <View className={styles.section__item}>
            <View
              className={cx(["section__title", "last"], {
                active: isLeave && !isBack,
                pass: isLeave && isBack,
              })}
            >
              <Text>返校销假</Text>
              <Text
                className={cx("scan", {
                  active: isLeave && !isBack,
                  pass: isLeave && isBack,
                })}
                onClick={() => {
                  if (!isLeave || isBack) return;
                  scan("入校");
                }}
              >
                返校扫码
              </Text>
            </View>
            <View className={styles.section__info}>
              <View className={styles.item}>
                <Text>扫码地点</Text>
                <Text>{info.backInfo.location}</Text>
              </View>
              <View className={styles.item}>
                <Text>返校时间</Text>
                <Text>{info.backInfo.time}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className={styles.title}>申请详情</View>
      <View className={styles.detail}>
        <View className={styles.item}>
          <Text>学号</Text>
          <Input
            disabled={!editable}
            value={stuNum}
            className={styles.input}
            onInput={(e) => {
              setStuNum(e.detail.value);
              setStorage({
                key: "stuNum",
                data: e.detail.value,
              });
            }}
          ></Input>
        </View>
        <View className={styles.item}>
          <Text>姓名</Text>
          <Text>{name}</Text>
        </View>
        <View className={styles.item}>
          <Text>请假类型</Text>
          <Text>普通离返校</Text>
        </View>
        <View className={styles.item}>
          <Text>出发时间</Text>
          <Text>{info.date}</Text>
        </View>
        <View className={styles.item}>
          <Text>预计返校时间</Text>
          <Text>{info.date}</Text>
        </View>
        <View className={styles.item}>
          <Text>外出地点</Text>
          <Text>重庆市,重庆市,南岸区</Text>
        </View>
        <View className={styles.item}>
          <Text>外出事由</Text>
          <Text>外出</Text>
        </View>
      </View>
    </View>
  );
};

export default InfoPage;

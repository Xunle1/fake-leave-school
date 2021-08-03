import { View, Text, Image } from "@tarojs/components";
import { getStorage, setStorage, useDidShow } from "@tarojs/taro";
import { useState } from "react";
import { List } from "../common/types";
import Item from "./components/Item";
import styles from "./index.modules.scss";
import { STATUS, Storage } from "../common/constants";
import { getInitList } from "../common/helpers";

const initList: List = getInitList();

const Index = () => {
  const [list, setList] = useState<List>(initList);
  const [name, setName] = useState("姓名");
  useDidShow(() => {
    getStorage({
      key: Storage.LIST,
      success: (res) => {
        setList(res.data);
      },
      fail: () => {
        setStorage({
          key: Storage.LIST,
          data: initList,
        });
      },
    });
    getStorage({
      key: Storage.NAME,
      success: (res) => {
        setName(res.data);
      },
    });
  });

  const handleApply = () => {
    if (list[0].status === STATUS.BACK) {
      const newList = [...initList, ...list];
      setList(newList);
      setStorage({
        key: Storage.LIST,
        data: newList,
      });
    }
  };

  return (
    <View className={styles.apply}>
      <Image src={require("../../static/input.png")} onClick={handleApply} />
      <Text className={styles.count}>申请记录 ({list.length}条)</Text>
      {list.map((e) => (
        <Item
          name={name}
          id={e.id}
          status={e.status}
          updateTime={e.updateTime}
          date={e.date}
        />
      ))}
    </View>
  );
};

export default Index;

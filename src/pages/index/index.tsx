import { View, Text, Image } from "@tarojs/components";
import {
  getStorage,
  setStorage,
  useDidShow,
  useReachBottom,
} from "@tarojs/taro";
import { useEffect, useState } from "react";
import { List } from "../common/types";
import Item from "./components/Item";
import styles from "./index.modules.scss";
import { Storage } from "../common/constants";
import { getInitList } from "../common/helpers";
import ApplyImg from "../../static/input.png";

const initList: List = getInitList();
const ONE_PAGE_NUM = 10;
const Index = () => {
  const [page, setPage] = useState(1);
  const [totalList, setTotalList] = useState<List>(initList);
  // const [list, setList] = useState<List>(initList);
  const [name, setName] = useState("姓名");
  useDidShow(() => {
    getStorage({
      key: Storage.LIST,
      success: (res) => {
        setTotalList(res.data);
        // setList(res.data.slice(0, ONE_PAGE_NUM * page));
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

  useReachBottom(() => {
    if (totalList.length > page * ONE_PAGE_NUM) {
      // setList(totalList.slice(0, ONE_PAGE_NUM * (page + 1)));
      setPage(page + 1);
    }
  });

  // useEffect(() => {
  //   setList(totalList.slice(0, ONE_PAGE_NUM * (page + 1)));
  // }, totalList);

  const handleApply = () => {
    const newList = [
      {
        ...getInitList()[0],
        id: totalList[0].id + 1,
      },
      ...totalList,
    ];
    setTotalList(newList);
    setStorage({
      key: Storage.LIST,
      data: newList,
    });
  };

  return (
    <View className={styles.apply}>
      <Image src={ApplyImg} onClick={handleApply} />
      <Text className={styles.count}>
        申请记录 ({200 + totalList.length}条)
      </Text>
      {totalList.map((e) => (
        <Item
          key={e.id}
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

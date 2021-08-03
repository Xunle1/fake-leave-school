import { useState, useEffect } from "react";
import { View, Text, Input } from "@tarojs/components";
import { getStorage, setStorage, useRouter } from "@tarojs/taro";
import { apply } from "../../apis";
import styles from "./index.module.scss";
import { Type, Location, Storage } from "../common/constants";
import classNames from "classnames/bind";
let cx = classNames.bind(styles);

const Detail = () => {
  const router = useRouter();
  const [time, setTime] = useState("");
  const [name, setName] = useState("姓名");
  const [stuNum, setStuNum] = useState("学号");
  const [college, setCollege] = useState("学院");
  const [num, setNum] = useState(0);
  const [editable, setEditable] = useState(false);
  const type = router.params.type as Type;
  const location = router.params.location as Location;
  async function getNum() {
    const {
      data: { data },
    } = await apply(type, location);
    setTime(data.time);
    setNum(data.num);
  }
  useEffect(() => {
    getNum();
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
    getStorage({
      key: Storage.COLLEGE,
      success: (res) => {
        setCollege(res.data);
      },
    });
  }, []);
  return (
    <View className={styles.index}>
      <View className={styles.bg}></View>
      <View className={styles.date} onClick={() => setEditable(!editable)}>
        {time}
      </View>
      <View className={styles.main}>
        <View className={`${styles.item} ${styles.name}`}>
          <Text>欢迎</Text>
          <Text className={styles.name}>{name}</Text>
        </View>
        <View className={`${styles.item} ${styles.num}`}>
          <Text>您是今天第</Text>
          <Text className={styles.people_num}>{num}</Text>
          <Text>个</Text>
        </View>
        <View className={`${styles.item} ${styles.location}`}>
          <Text>从{location}</Text>
          <Text>扫码{type}的同学</Text>
        </View>
        <View
          className={cx(["item", "img"], {
            leave: type === "出校",
            back: type !== "出校",
          })}
        ></View>
      </View>
      <View className={styles.info}>
        <View className={`${styles.item} ${styles.stu_num}`}>
          <View className={styles.icon}></View>
          <View className={styles.text}>学号：</View>
          <Text className={styles.content}>{stuNum}</Text>
        </View>
        <View className={`${styles.item} ${styles.college}`}>
          <View className={styles.icon}></View>
          <View className={styles.text}>学院：</View>
          <Input
            disabled={!editable}
            className={styles.content}
            value={college}
            onInput={(e) => {
              setCollege(e.detail.value);
              setStorage({
                key: Storage.COLLEGE,
                data: e.detail.value,
              });
            }}
          ></Input>
        </View>
      </View>
    </View>
  );
};

export default Detail;

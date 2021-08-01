import { useState, useEffect } from "react";
import { View, Text, Input } from "@tarojs/components";
import { getStorage, setStorage, useRouter } from "@tarojs/taro";
import { leave, back } from "../../apis";
import "./index.scss";

const Detail = () => {
  const router = useRouter();
  const [isLeave, setIsLeave] = useState(true);
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [name, setName] = useState("姓名");
  const [location, setLocation] = useState("崇文门");
  const [stuNum, setStuNum] = useState("学号");
  const [college, setCollege] = useState("学院");
  const [num, setNum] = useState(0);
  async function getNum() {
    const {
      data: { data },
    } = await (isLeave ? leave() : back());
    setTime(data.time);
    setType(data.type);
    setNum(data.num);
  }
  useEffect(() => {
    console.log(router);

    // setLocation(router.params.location!);
    getStorage({
      key: "name",
      success: (res) => {
        setName(res.data);
      },
    });
    getStorage({
      key: "stuNum",
      success: (res) => {
        setStuNum(res.data);
      },
    });
    getStorage({
      key: "college",
      success: (res) => {
        setCollege(res.data);
      },
    });
  }, []);
  useEffect(() => {
    getNum();
  }, [isLeave]);
  return (
    <View className="index">
      <View className="bg"></View>
      <View className="date">{time}</View>
      <View className="main">
        <View className="item name">
          <Text>欢迎</Text>
          <Input
            value={name}
            className="input name"
            onInput={(e) => {
              setName(e.detail.value);
              setStorage({
                key: "name",
                data: e.detail.value,
              });
            }}
          ></Input>
        </View>
        <View className="item num">
          <Text>您是今天第</Text>
          <Text className="people_num">{num}</Text>
          <Text>个</Text>
        </View>
        <View className="item location">
          <Text>从</Text>
          <Input value={location} className="input location"></Input>
          <Text>扫码{type}的同学</Text>
        </View>
        <View
          className={`item img ${isLeave ? "leave" : "back"}`}
          onClick={() => setIsLeave(!isLeave)}
        ></View>
      </View>
      <View className="info">
        <View className="item stu_num">
          <View className="icon"></View>
          <View className="text">学号：</View>
          <Input
            className="content"
            value={stuNum}
            onInput={(e) => {
              setStuNum(e.detail.value);
              setStorage({
                key: "stuNum",
                data: e.detail.value,
              });
            }}
          ></Input>
        </View>
        <View className="item college">
          <View className="icon"></View>
          <View className="text">学院：</View>
          <Input
            className="content"
            value={college}
            onInput={(e) => {
              setCollege(e.detail.value);
              setStorage({
                key: "college",
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

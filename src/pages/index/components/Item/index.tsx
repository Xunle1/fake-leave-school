import { navigateTo } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { status as statusType } from "../../../common/types";
import styles from "./style.module.scss";
export type ItemProps = Readonly<{
  id: number;
  status: statusType;
  date: string;
  updateTime: string;
  name?: string;
}>;

const Item = ({ status, date, updateTime, id, name }: ItemProps) => {
  return (
    <View className={styles.item}>
      <View className={styles.info_wrapper}>
        <View className={styles.line}>
          <Text className={styles.name}>{name}</Text>
          <Text className={styles.status}>{status}</Text>
        </View>
        <View className={styles.line}>
          <Text>外出时间</Text>
          <Text>{date}</Text>
        </View>
        <View className={styles.line}>
          <Text>外出地点</Text>
          <Text>老校门</Text>
        </View>
        <View className={styles.line}>
          <Text>预计回校时间</Text>
          <Text>{date}</Text>
        </View>
        <View className={styles.line}>
          <Text>更新时间</Text>
          <Text>{updateTime}</Text>
        </View>
      </View>
      <View
        className={styles.detail}
        onClick={() =>
          navigateTo({
            url: `/pages/info/index?id=${id}`,
          })
        }
      >
        详情
      </View>
    </View>
  );
};

export default Item;

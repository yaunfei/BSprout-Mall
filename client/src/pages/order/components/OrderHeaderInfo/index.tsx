import { timestampToString } from "@/utils/convertDate";
import { Icon } from "@antmjs/vantui";
import { View, Text } from "@tarojs/components";
import Style from "./index.module.less";

export type OrderHeaderInfoType = {
  createTime: number;
  style?: object;
  status: string;
};
// 头部组件
export default function OrderHeaderInfo(props: OrderHeaderInfoType) {
  const { createTime, style, status } = props;
  return (
    <View className={Style.orderDateInfo}>
      <Text className={Style.orderDate}>
        {timestampToString(createTime, "YYYY/MM/DD HH:mm")}
      </Text>
      <View className={Style.orderStatus}>
        <Text style={style}>{status}</Text>
        <Icon size={12} name="arrow" color="#8C8C8C"></Icon>
      </View>
    </View>
  );
}

import { View } from "@tarojs/components";
import { Tab, Tabs } from "@antmjs/vantui";
import Style from "./index.module.less";
import OrderList from "../orderList";

export default function ManageOrder() {
  const tabItems = [
    { key: 1, title: `待处理`, component: <OrderList manageSate={1} /> },
    { key: 2, title: `处理中`, component: <OrderList manageSate={2} /> },
    { key: 3, title: `已完成`, component: <OrderList manageSate={3} /> },
  ];
  return (
    <View className={Style.manageOrderWarp}>
      <Tabs>
        {tabItems.map((item) => (
          <Tab key={item.key} title={item.title}>
            {item.component}
          </Tab>
        ))}
      </Tabs>
    </View>
  );
}

import { View, Image } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro, { useRouter } from "@tarojs/taro";
import { Search } from "@antmjs/vantui";
import Style from "./index.module.less";

export function SearchBar(props: { callBack: () => void }) {
  const { callBack } = props;
  const [headeHeight, setHeadeHeight] = useState<number>(80); // 头部区域高度
  const [barHeight, setBarHeight] = useState<number>(40); // 状态栏高度
  const [titleHeight, setTitleHeight] = useState<number>(80); // 标题栏高度
  const [searchWidth, setSearchWidth] = useState<number>(0); // 标题栏高度

  useEffect(() => {
    const { statusBarHeight } = Taro.getSystemInfoSync();
    const { bottom, top, left } = Taro.getMenuButtonBoundingClientRect();

    const hHeight = top - statusBarHeight!;
    setHeadeHeight(bottom + hHeight);
    setBarHeight(statusBarHeight!);
    setTitleHeight(bottom + hHeight - statusBarHeight!);
    setSearchWidth(left);
  }, []);
  return (
    <>
      <View className={Style.hideTitleWarp} style={{ height: headeHeight }}>
        <View style={{ height: `${barHeight}px` }}></View>
        <View
          className={Style.content}
          style={{ height: titleHeight }}
          onClick={callBack}
        >
          <Search
            disabled
            style={{ width: `${searchWidth}px`, padding: " 0 12px" }}
            shape="round"
            placeholder="请输入搜索关键词"
          />
        </View>
      </View>
      <View style={{ height: headeHeight }}></View>
    </>
  );
}

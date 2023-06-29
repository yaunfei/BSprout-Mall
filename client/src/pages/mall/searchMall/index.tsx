import { View } from "@tarojs/components";
import { useRef, useState } from "react";
import { Search } from "@antmjs/vantui";
import { getSpuList } from "@/request/mall";
import { navigateToPage } from "@yaunfei/taro-router";

import Style from "./index.module.less";
import MallItems from "../components/MallItems";

export default function SearchMall() {
  const [value, setValue] = useState("");

  const infiniteScrollRef = useRef<{ reset: () => void }>();
  const [data, setData] = useState<MALL.SpuList.Reponse[]>([]); // 每一项数据
  const [loadCount, setLoadCount] = useState<number>(1); // 分页页数

  const [refresh, setRefresh] = useState<boolean>(false); // 下拉刷新

  // 分页数据
  function loadMore() {
    return new Promise(async (resolve) => {
      const { data, total } = await getSpuList({
        page: loadCount,
        pageSize: 10,
        name: value,
      });
      setData((val) => [...val, ...data]);
      setLoadCount((count) => count + 1);
      // 返回刷新状态
      resolve(
        total <= 10 ? "complete" : data.length > 0 ? "loading" : "complete"
      );
    }) as Promise<"loading" | "complete" | "error">;
  }

  // 刷新
  const onRefresh = () => {
    setRefresh(true);
    return new Promise(async (resolve) => {
      const { data, total } = await getSpuList({
        page: 1,
        pageSize: 10,
        name: value,
      });
      setData(() => [...data]);
      setLoadCount(2);
      // 刷新后，大于一页时，请求下一页数据
      total > 10 && infiniteScrollRef.current?.reset();
      setRefresh(false);
      // 返回刷新状态
      resolve();
    }) as Promise<undefined>;
  };

  const action = (item: MALL.SpuList.Reponse) => {
    navigateToPage("/pages/mall/detail/index", { id: item?._id });
  };
  return (
    <View className={Style.searchMallWarp}>
      <Search
        style={{ paddingBottom: "unset" }}
        onChange={(e) => setValue(e.detail)}
        placeholder="请输入搜索关键词"
        shape="round"
        onSearch={onRefresh}
        renderAction={<View onClick={onRefresh}>搜索</View>}
      />
      <View className={Style.goodsStyle}>
        <MallItems
          data={data}
          loadMore={loadMore}
          infiniteScrollRef={infiniteScrollRef}
          action={action}
        ></MallItems>
      </View>
    </View>
  );
}

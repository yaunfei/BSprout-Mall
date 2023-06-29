import { View, Image, ScrollView } from "@tarojs/components";
import { navigateToPage } from "@yaunfei/taro-router";
import { useRef, useState } from "react";
import { getSpuList } from "@/request/mall";
import { SearchBar } from "@/components/SearchBar";
import { GITEE_DOWNLOAD_URL } from "@/common/constant";
import Style from "./index.module.less";
import MallItems from "../components/MallItems";

export default function Index() {
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
    <ScrollView
      type="list"
      refresherEnabled
      refresherTriggered={refresh}
      onRefresherRefresh={() => {
        if (refresh) return;
        onRefresh();
      }}
    >
      <SearchBar
        callBack={() => {
          navigateToPage("/pages/mall/searchMall/index");
        }}
      ></SearchBar>
      <View className={Style.indexWarp}>
        <Image
          mode="aspectFill"
          className={Style.imgStyle}
          src={`${GITEE_DOWNLOAD_URL}/icon_info/mainurl.jpeg`}
        ></Image>

        <View className={Style.goodsStyle}>
          <View className={Style.areaTitle}>精美商品</View>
          <MallItems
            data={data}
            loadMore={loadMore}
            infiniteScrollRef={infiniteScrollRef}
            action={action}
          ></MallItems>
        </View>
      </View>
    </ScrollView>
  );
}

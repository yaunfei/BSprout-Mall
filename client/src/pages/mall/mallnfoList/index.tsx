import { View } from "@tarojs/components";
import {
  Card,
  Icon,
  InfiniteScroll,
  PullToRefresh,
  Search,
} from "@antmjs/vantui";
import Gap from "@/components/Gap";
import { useRef, useState } from "react";
import { getSpuList } from "@/request/mall";
import { navigateToPage } from "@yaunfei/taro-router";
import { ADD_MALL_INFO } from "@/common/constant";
import Style from "./index.module.less";

export default function MallnfoList() {
  const infiniteScrollRef = useRef<{ reset: () => void }>();
  const [data, setData] = useState<MALL.SpuList.Reponse[]>([]); // 每一项数据
  const [loadCount, setLoadCount] = useState<number>(1); // 分页页数
  const [value, setValue] = useState("");

  // 分页数据
  function loadMore() {
    return new Promise(async (resolve) => {
      const { data, total } = await getSpuList({
        page: loadCount,
        pageSize: 10,
        name: value,
        manageEntry: true, // 管理员标志
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
    return new Promise(async (resolve) => {
      const { data, total } = await getSpuList({
        page: 1,
        pageSize: 10,
        name: value,
        manageEntry: true, // 管理员标志
      });
      setData(() => [...data]);
      setLoadCount(2);
      // 刷新后，大于一页时，请求下一页数据
      total > 10 && infiniteScrollRef.current?.reset();
      // 返回刷新状态
      resolve();
    }) as Promise<undefined>;
  };

  return (
    <>
      {/* <PullToRefresh touchMaxStart={800} headHeight={60} onRefresh={onRefresh}> */}
      <Search
        style={{ paddingBottom: "unset" }}
        onChange={(e) => setValue(e.detail)}
        placeholder="请输入搜索关键词"
        shape="round"
        onSearch={onRefresh}
        renderAction={<View onClick={onRefresh}>搜索</View>}
      />
      <View className={Style.mallnfoListWarp}>
        {data?.map((item) => (
          <>
            <Card
              key={item._id}
              className={Style.editOLCard}
              // num="2"
              price={item?.amount}
              desc={item?.desc}
              title={item?.name}
              thumb={item?.mainUrl}
              onClick={() => {
                navigateToPage(
                  "/pages/mall/addMallnfo/index",
                  { item: JSON.stringify(item) },
                  {
                    [ADD_MALL_INFO]: () => {
                      onRefresh();
                    },
                  }
                );
              }}
            />
            <Gap></Gap>
          </>
        ))}
        <InfiniteScroll
          className={Style.infiniteScrollStyle}
          loadMore={loadMore}
          ref={infiniteScrollRef}
        />
      </View>
      {/* </PullToRefresh> */}
      <Icon
        name="add"
        size="60"
        className={Style.addIconStyle}
        onClick={() => {
          navigateToPage(
            "/pages/mall/addMallnfo/index",
            {},
            {
              [ADD_MALL_INFO]: () => {
                onRefresh();
              },
            }
          );
        }}
      ></Icon>
    </>
  );
}

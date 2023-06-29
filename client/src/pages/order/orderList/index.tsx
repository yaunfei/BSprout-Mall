import { View } from "@tarojs/components";
import { Card, InfiniteScroll, PullToRefresh } from "@antmjs/vantui";
import Gap from "@/components/Gap";
import { navigateToPage } from "@yaunfei/taro-router";
import { useRef, useState } from "react";
import { getOrderList } from "@/request/order";
import { ORDER_DETAIL, stateEnum } from "@/common/constant";
import Style from "./index.module.less";
import OrderHeaderInfoType from "../components/OrderHeaderInfo";

export default function OrderList(props: { manageSate?: number }) {
  // 从哪里过来的
  const { manageSate } = props;
  const infiniteScrollRef = useRef<{ reset: () => void }>();
  const [data, setData] = useState<ORDER.List.Reponse[]>([]); // 每一项数据
  const [loadCount, setLoadCount] = useState<number>(1); // 分页页数

  // 分页数据
  function loadMore() {
    return new Promise(async (resolve) => {
      const { data, total } = await getOrderList({
        page: loadCount,
        pageSize: 10,
        manageSate,
      });
      setData((val) => [...val, ...data]);
      setLoadCount((count) => count + 1);
      // 返回刷新状态
      resolve(
        total > 10 ? (data.length > 0 ? "loading" : "complete") : "complete"
      );
    }) as Promise<"loading" | "complete" | "error">;
  }

  // 刷新
  const onRefresh = () => {
    return new Promise(async (resolve) => {
      const { data, total } = await getOrderList({
        page: 1,
        pageSize: 10,
        manageSate,
      });
      setData(() => [...data]);
      setLoadCount(2);
      // 刷新后，大于一页时，请求下一页数据
      total > 10 && infiniteScrollRef.current?.reset();
      // 返回刷新状态
      resolve();
    }) as Promise<undefined>;
  };

  const action = (item) => {
    navigateToPage(
      "/pages/order/orderDetail/index",
      {
        item: JSON.stringify(item),
        manageSate,
      },
      {
        [ORDER_DETAIL]: () => {
          onRefresh();
        },
      }
    );
  };

  return (
    <PullToRefresh touchMaxStart={800} headHeight={60} onRefresh={onRefresh}>
      <View className={Style.orderListWarp}>
        {data?.map((item) => (
          <>
            <View
              className={Style.orderItem}
              onClick={() => {
                action(item);
              }}
            >
              <OrderHeaderInfoType
                createTime={item?.create_time}
                status={stateEnum[item?.state]}
              ></OrderHeaderInfoType>
              <Card
                className={Style.orderCardStyle}
                num={String(item?.count_num)}
                price={item?.amount}
                desc={item?.skuName}
                title={item?.name}
                thumb={item?.mainUrl}
                renderFooter={
                  <View className={Style.cardFooterStyle}>
                    合计：¥{Number(item?.amount) * item.count_num}
                  </View>
                }
              />
            </View>
            <Gap></Gap>
          </>
        ))}

        <InfiniteScroll loadMore={loadMore} ref={infiniteScrollRef} />
      </View>
    </PullToRefresh>
  );
}

import { InfiniteScroll } from "@antmjs/vantui";
import { View, Image } from "@tarojs/components";
import { MutableRefObject } from "react";
import Style from "./index.module.less";

type MallItemsProps = {
  data: MALL.SpuList.Reponse[];
  loadMore: () => Promise<"loading" | "complete" | "error">;
  infiniteScrollRef: MutableRefObject<{ reset: () => void } | undefined>;
  action: (val) => void;
};

export default function MallItems(props: MallItemsProps) {
  const { data, loadMore, infiniteScrollRef, action } = props;
  return (
    <View className={Style.mallItemsContentInfo}>
      {data?.map((item) => {
        return (
          <View
            key={item._id}
            className={Style.contentItem}
            onClick={() => action(item)}
          >
            <Image className={Style.itemImg} src={item.mainUrl}></Image>
            <View className={Style.itemName}>{item.name}</View>
            <View className={Style.itemAmount}>¥ {item.amount}</View>
          </View>
        );
      })}
      <InfiniteScroll
        className={Style.infiniteScrollStyle}
        loadMore={loadMore}
        ref={infiniteScrollRef}
      />
    </View>
  );
}

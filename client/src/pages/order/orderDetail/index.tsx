import Taro, { useDidShow } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { Card } from "@antmjs/vantui";
import Gap from "@/components/Gap";
import { usePageData } from "@yaunfei/taro-router";
import { useCallback, useState } from "react";
import { timestampToString } from "@/utils/convertDate";
import { GITEE_DOWNLOAD_URL, stateEnum } from "@/common/constant";
import Style from "./index.module.less";
import OrderFooter from "../components/OrderFooter";

export default function OrderDetail() {
  const option: any = usePageData();
  const [item, setItem] = useState<ORDER.List.Reponse>();
  const [manageSate, setManageSate] = useState();

  useDidShow(() => {
    const parseItem = JSON.parse(option?.item);
    setItem(parseItem);
    if (option?.manageSate !== "undefined") {
      setManageSate(option?.manageSate);
    }
  });

  const copy = () => {
    Taro.setClipboardData({
      data: item?.expressageid!,
    });
  };

  const stateHeaderDOM = useCallback(() => {
    switch (item?.state) {
      case 1:
        return (
          <View className={Style.statusSubTitle}>
            商品正在准备发货，请耐心等待
          </View>
        );
      case 2:
        return (
          <>
            <View className={Style.statusSubTitle}>
              运单号码：
              <Text onClick={copy}>{item?.expressageid}</Text>
              <Image
                onClick={copy}
                src={`${GITEE_DOWNLOAD_URL}/icon_info/copy.jpg`}
              ></Image>
            </View>
          </>
        );
      case 3:
        return (
          <View className={Style.statusSubTitle}>订单已完成，欢迎再次购买</View>
        );
      case 4:
        return (
          <View className={Style.statusSubTitle}>退款处理中，请耐心等待</View>
        );
    }
  }, [item?.state]);

  return (
    <View className={Style.orderDetailWarp}>
      {/* 订单状态 */}
      <View className={Style.orderDetailStatus}>
        <View className={Style.statusDeatil}>{stateEnum[item?.state!]}</View>
        {stateHeaderDOM()}
      </View>
      {/* 收获人信息 */}
      <View className={Style.address}>
        <View>
          {item?.consignee_info?.userName} {item?.consignee_info?.telNumber}
        </View>
        <View>
          {item?.consignee_info?.provinceName} {item?.consignee_info?.cityName}{" "}
          {item?.consignee_info?.countyName} {item?.consignee_info?.detailInfo}
        </View>
      </View>
      {/* 商品信息 */}
      {item && (
        <Card
          className={Style.orderDetailCardStyle}
          num={String(item?.count_num)}
          price={item?.amount!}
          desc={item?.skuName}
          title={item?.name}
          thumb={item?.mainUrl}
          renderFooter={
            <View className={Style.cardFooterStyle}>
              合计：¥{Number(item?.amount) * item?.count_num!}
            </View>
          }
        />
      )}
      <Gap></Gap>
      {/* 订单信息 */}
      <View className={Style.goodsDesc}>
        <View className={Style.descItem}>
          <Text className={Style.subItem}>订单号</Text>
          <View className={Style.subInfo}>
            <Text>{item?.orderid}</Text>
          </View>
        </View>
        <View className={Style.descItem}>
          <Text className={Style.subItem}>订单时间</Text>
          <Text className={Style.subInfo}>
            {timestampToString(item?.create_time!, "YYYY/MM/DD HH:mm")}
          </Text>
        </View>
      </View>
      <OrderFooter
        manageSate={manageSate}
        state={item?.state}
        orderid={item?.orderid}
      ></OrderFooter>
    </View>
  );
}

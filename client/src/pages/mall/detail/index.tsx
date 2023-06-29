import { View, Image, Text } from "@tarojs/components";
import { reLaunchPage, usePageData } from "@yaunfei/taro-router";
import Taro, { useDidShow } from "@tarojs/taro";
import { useState } from "react";
import { ConfirmButton } from "@/components/FooterButton";
import {
  Popup,
  Sku,
  Card,
  Stepper,
  Button,
  Cell,
  Icon,
  Skeleton,
} from "@antmjs/vantui";
import Gap from "@/components/Gap";
import { insertOrder } from "@/request/order";
import toast from "@/utils/toast";
import { spuDetail } from "@/request/mall";
import Style from "./index.module.less";

export default function Detail() {
  const option: any = usePageData();
  const [item, setItem] = useState<MALL.SpuList.Reponse>();
  const [show, setShow] = useState(false);
  // 选中的商品，可以获取自定义属性如：商品图片、价格、数量
  const [currentGoods, setCurrent] = useState<any>();
  const [sku, setSku] = useState([]);
  const [goodsList, setGoodsList] = useState([]);
  const [address, setAddress] = useState<string>("");
  const [addressObj, setAddressObj] =
    useState<Taro.chooseAddress.SuccessCallbackResult>();

  const [numValue, setNumValue] = useState<number>(1);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useDidShow(() => {
    spuDetail({
      id: option?.id,
    }).then((res) => {
      setItem(res);
      setSku(res?.sku);
      setGoodsList(res?.goodsList);
      setShowSkeleton(false);
    });
  });

  const itemDisable = (goodsItem) => {
    if (!goodsItem) return true;
    // 商品表可设定count为库存数，或者通过其它条件判断
    if (goodsItem.count === 0) return true;
  };

  // 选择地址
  const selectAddress = () => {
    Taro.chooseAddress({
      success: function (res) {
        if (res) {
          const addressInfo = `${res?.userName}，${res?.telNumber}，${res?.provinceName} ${res?.cityName} ${res?.countyName} ${res?.detailInfo}`;
          setAddress(addressInfo);
          setAddressObj(res);
        }
      },
    });
  };

  // 提交订单
  const submit = () => {
    if (!addressObj) {
      toast("请选选择地址");
      return;
    }
    // 新增订单
    insertOrder({
      spuid: item?._id!,
      skuid: currentGoods?.id,
      state: 1,
      amount: currentGoods?.subAmount ? currentGoods?.subAmount : item?.amount,
      count_num: numValue,
      consignee_info: {
        userName: addressObj?.userName,
        telNumber: addressObj?.telNumber,
        provinceName: addressObj?.provinceName,
        cityName: addressObj?.cityName,
        countyName: addressObj?.countyName,
        detailInfo: addressObj?.detailInfo,
      },
    }).then(() => {
      reLaunchPage("/pages/order/orderList/index");
    });
  };

  return (
    <>
      {showSkeleton ? (
        <Skeleton title row={20} />
      ) : (
        <>
          {/* 产品详情 */}
          <View className={Style.detailWarp} catchMove={show}>
            <Image
              mode="aspectFill"
              className={Style.imgStyle}
              src={item?.mainUrl}
            ></Image>
            <View className={Style.content}>
              <View className={Style.nameStyle}>{item?.name}</View>
              <View className={Style.amountStyle}>¥ {item?.amount}</View>
              {item?.imgurls?.map((sub, index) => {
                return (
                  <Image
                    mode="widthFix"
                    key={index}
                    src={sub}
                    className={Style.detailImg}
                  ></Image>
                );
              })}
            </View>
          </View>
          {/* 选购按钮 */}
          <ConfirmButton
            onClick={() => {
              setShow(true);
            }}
          >
            立即购买
          </ConfirmButton>
        </>
      )}

      {/* 确定订单 */}
      <Popup
        catchMove={show}
        overlay
        show={show}
        position="bottom"
        onClose={() => setShow(false)}
        safeAreaInsetBottom={false}
      >
        <>
          {/* 地址信息 */}
          <View className={Style.detailAddressStyle}>
            <Cell
              className={Style.detailCellStyle}
              title="确认订单"
              renderRightIcon={
                <Icon
                  name="cross"
                  onClick={() => {
                    setShow(false);
                  }}
                ></Icon>
              }
            />
            <Cell
              icon="location-o"
              title={address ? address : "添加收获地址"}
              isLink
              onClick={selectAddress}
            />
          </View>
          <Gap></Gap>
          {/* 选择规格和数量 */}
          <View className={Style.detailPopupStyle}>
            <Card
              className={Style.detailCardStyle}
              num={String(numValue)}
              // tag="标签"
              price={
                currentGoods?.subAmount ? currentGoods?.subAmount : item?.amount
              }
              desc={currentGoods?.skuName || "--"}
              title={item?.name}
              thumb={
                currentGoods?.goodsPic ? currentGoods?.goodsPic : item?.mainUrl
              }
            />
            <Sku
              className={Style.detailSkuStyle}
              // sku={item?.sku}
              sku={sku}
              goodsList={goodsList}
              // goodsList={item?.goodsList}
              onChange={(e) => {
                setCurrent(e);
              }}
              clickAttrDisable={(e) => console.log(222, e)}
              itemDisable={itemDisable}
              itemRender={(it) => {
                return it.name;
              }}
            />
            <View className={Style.detailNumStyle}>
              <Text>购买数量</Text>
              <Stepper
                value={numValue}
                onChange={(e) => {
                  setNumValue(Number(e.detail));
                }}
              />
            </View>
            <Button type="danger" size="large" block round onClick={submit}>
              确定
            </Button>
          </View>
        </>
      </Popup>
    </>
  );
}

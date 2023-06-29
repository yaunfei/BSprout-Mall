import { SUBMIT_BUTTON_COLOR } from "@/common/constant";
import {
  Field,
  Popup,
  Icon,
  Button,
  Picker,
  Uploader,
  Cell,
} from "@antmjs/vantui";
import { View } from "@tarojs/components";
import { MutableRefObject, useEffect, useState } from "react";
import toast from "@/utils/toast";
import { giteeDeleteFile, giteeUploadFile } from "@/utils/formUploader";
import Taro from "@tarojs/taro";

import Style from "./index.module.less";
import { SkuItemType } from "../../addMallnfo";

type GoodsItemType = {
  id: number;
  skuIds: number[]; // 可以无序
  skuName: string; // 自定义属性
  subAmount?: string; // 金额
  goodsPic?: string; // 图片
};

type GoodsPopupType = {
  show: boolean;
  setShow: (val) => void;
  sku: (SkuItemType & { items: SkuItemType[] })[];
  goodsidRef: MutableRefObject<number>;
  setGoods: (val) => void;
};

/**
 * 规格选择组件
 * @param props
 * @returns
 */
export default function GoodsPopup(props: GoodsPopupType) {
  const { show, setShow, sku, goodsidRef, setGoods } = props;

  const [showPicker, setShowPicker] = useState(false);
  const [pickerValue, setPickerValue] = useState<
    { values: { key: number; text: string }[] }[]
  >([]); // 选择器
  const [goodsItem, setGoodsItem] = useState<GoodsItemType>(Object);
  const [value, setValue] = useState<any>([]);
  const [subAmount, setSubAmount] = useState("");

  useEffect(() => {
    setPickerValue(() => getPickerData());
  }, []);

  // 初始化picker选择器
  const getPickerData = () => {
    return sku?.map((item) => {
      return {
        values: item?.items?.map((subItem) => {
          return {
            key: subItem?.id,
            text: subItem?.name,
          };
        }),
      };
    });
  };

  const afterRead = (event) => {
    const { file } = event.detail;
    Taro.showLoading();
    giteeUploadFile("spu_info", file?.url).then((res) => {
      setValue(value.concat({ url: res?.fileID }));
      Taro.hideLoading();
    });
  };

  const deleteAction = (event) => {
    const { index } = event.detail;
    const valueNew = JSON.parse(JSON.stringify(value));
    // cdn 删除
    const filePath = valueNew[index]?.url;
    giteeDeleteFile("spu_info", filePath);

    valueNew.splice(index, 1);
    setValue(valueNew);
  };

  return (
    <>
      <Popup
        className={Style.goodsPopupWarp}
        round
        show={show}
        onClose={() => setShow(false)}
      >
        <View className={Style.contentStyle}>
          <View className={Style.contentHeaderStyle}>请输入规格信息</View>
          {/* 货物规格 */}
          <View
            onClick={() => {
              setShowPicker(true);
            }}
          >
            <Field
              label="货物规格："
              disabled
              value={goodsItem.skuName}
              placeholder="请输入规格类型"
              renderRightIcon={<Icon name="arrow"></Icon>}
            />
          </View>
          {/* 货物金额 */}
          <Field
            label="货物金额："
            value={subAmount}
            placeholder="请输入货物金额"
            onChange={(e) => {
              setSubAmount(e.detail);
            }}
          />
          {/* 货物主图 */}
          <>
            <Cell title="货物主图：" border={false} />
            <Uploader
              className={Style.goodsUploader}
              fileList={value}
              onAfterRead={afterRead}
              onDelete={deleteAction}
              deletable
              maxCount={1}
            />
          </>
          <Button
            color={SUBMIT_BUTTON_COLOR}
            className={Style.contentButton}
            onClick={() => {
              if (!goodsItem?.skuName) {
                toast("请先选择货物规格");
                return;
              }
              const resGoodsItem = {
                ...goodsItem,
                subAmount,
                goodsPic: value[0]?.url,
              };
              setGoods((val) => {
                return [...val, resGoodsItem];
              });
              setShow(false);
            }}
          >
            确定
          </Button>
        </View>
      </Popup>
      {/* 规格选择器 */}
      <Popup
        position="bottom"
        show={showPicker}
        onClose={() => setShowPicker(false)}
      >
        <Picker
          onCancel={() => setShowPicker(false)}
          onConfirm={(e) => {
            const pickerSkuIds: any = [];
            let pickerSkuName = "";
            const pickerSku = e.detail.value;
            // 处理数据
            for (let info of pickerSku) {
              pickerSkuIds.push(info.key);
              pickerSkuName = `${pickerSkuName} ${info.text}`.trim();
            }

            setGoodsItem(() => {
              return {
                id: goodsidRef.current++,
                skuIds: pickerSkuIds,
                skuName: pickerSkuName,
              };
            });
            setShowPicker(false);
          }}
          columns={pickerValue}
        />
      </Popup>
    </>
  );
}

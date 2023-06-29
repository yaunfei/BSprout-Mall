import { SUBMIT_BUTTON_COLOR } from "@/common/constant";
import { Field, Popup, Icon, Button } from "@antmjs/vantui";
import { View } from "@tarojs/components";
import { MutableRefObject, useRef, useState } from "react";
import toast from "@/utils/toast";

import Style from "./index.module.less";
import { SkuItemType } from "../../addMallnfo";

type SkuPopup = {
  show: boolean;
  setShow: (val) => void;
  setSku: (val) => void;
  skuidRef: MutableRefObject<number>;
};

/**
 * 规格选择组件
 * @param props
 * @returns
 */
export default function SkuPopup(props: SkuPopup) {
  const { show, setShow, setSku, skuidRef } = props;

  const [skuItemName, setSkuItemName] = useState(""); // 规格类型名称
  const [skuSubItems, setSkuSubItems] = useState<SkuItemType[]>([]); // 规格值
  const subSkuidRef = useRef(1);

  return (
    <Popup
      className={Style.skuPopupWarp}
      round
      show={show}
      onClose={() => setShow(false)}
    >
      <View className={Style.contentStyle}>
        <View className={Style.contentHeaderStyle}>请输入规格信息</View>
        {/* 规格类型 */}
        <Field
          label="规格类型："
          value={skuItemName}
          onChange={(e) => {
            setSkuItemName(e.detail);
          }}
          placeholder="请输入规格类型"
          renderRightIcon={
            <Icon
              name="add"
              size={24}
              color={SUBMIT_BUTTON_COLOR}
              onClick={() => {
                // 新增
                setSkuSubItems((val) => {
                  const id = subSkuidRef.current++;
                  return [
                    ...val,
                    {
                      id: Number(`${skuidRef.current}${id}`),
                      name: "",
                    },
                  ];
                });
              }}
            ></Icon>
          }
        />
        {/* 循环的规格值 */}
        {skuSubItems?.map((item) => (
          <Field
            key={item.id}
            label="规格值："
            value={item.name}
            placeholder="请输入规格值"
            onChange={(e) =>
              // 赋值
              setSkuSubItems((val) => {
                let temp = val;
                for (const a of temp) {
                  if (a.id === item.id) {
                    a.name = e.detail;
                  }
                }
                return temp;
              })
            }
            renderRightIcon={
              <Icon
                name="clear"
                size={24}
                color={SUBMIT_BUTTON_COLOR}
                onClick={() => {
                  // 删除
                  setSkuSubItems((val: SkuItemType[]) => {
                    return val?.filter((subItem) => subItem?.id !== item?.id);
                  });
                }}
              ></Icon>
            }
          />
        ))}
        <Button
          color={SUBMIT_BUTTON_COLOR}
          className={Style.contentButton}
          onClick={() => {
            if (!skuItemName) {
              toast("请输入规格类型");
              return;
            }
            if (skuSubItems.length === 0) {
              toast("请点击添加规格值");
              return;
            }
            if (skuSubItems?.filter((item) => item.name === "")?.length > 0) {
              toast("请输入规格值");
              return;
            }
            setSku((val) => {
              return [
                ...val,
                {
                  id: skuidRef.current++,
                  name: skuItemName,
                  items: skuSubItems,
                },
              ];
            });
            setShow(false);
          }}
        >
          确定
        </Button>
      </View>
    </Popup>
  );
}

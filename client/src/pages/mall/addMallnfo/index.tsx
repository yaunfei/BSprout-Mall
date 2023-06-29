import Taro from "@tarojs/taro";
import { Input, View } from "@tarojs/components";
import { useState, useRef, useEffect } from "react";
import { Button, Cell, Form, FormItem, Icon, Uploader } from "@antmjs/vantui";
import { ADD_MALL_INFO, SUBMIT_BUTTON_COLOR } from "@/common/constant";
import toast from "@/utils/toast";
import { hiddenSpuInfo, insertSpuInfo } from "@/request/mall";
import { navigateBackPage, usePageData } from "@yaunfei/taro-router";
import { formUploadFile, formDeleteFile } from "@/utils/formUploader";

import Style from "./index.module.less";
import SkuPopup from "../components/SkuPopup";
import GoodsPopup from "../components/GoodsPopup";

export type SkuItemType = {
  id: number;
  name: string;
};

export default function AddMallnfo() {
  const option: any = usePageData();
  const formIt = Form.useForm();
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);

  const skuidRef = useRef(1); // skuid
  const goodsidRef = useRef(1); // goodsid
  const [sku, setSku] = useState<(SkuItemType & { items: SkuItemType[] })[]>(
    []
  ); // 规格列表
  const [goods, setGoods] = useState<any[]>([]); // 货物列表
  const [id, setId] = useState("");
  const [hitFlag, setHitFlag] = useState(true);

  // 修改时初始化
  useEffect(() => {
    if (option?.item) {
      const parseItem = JSON.parse(option?.item);

      formIt.setFields({
        name: parseItem?.name,
        amount: parseItem?.amount,
      });
      formIt?.setFieldsValue("mainUrl", [
        {
          url: parseItem?.mainUrl,
        },
      ]);
      formIt?.setFieldsValue(
        "imgurls",
        parseItem?.imgurls?.map((sub) => ({ url: sub }))
      );
      setSku(parseItem?.sku);
      setGoods(parseItem?.goodsList);
      setId(parseItem?._id);
      setHitFlag(parseItem?.hitFlag);
    }
  }, [option?.item]);

  useEffect(() => {
    setGoods(getGoodsList(sku, goodsidRef.current));
  }, [sku]);

  // 保存
  const finish = (_, info) => {
    if (sku.length === 0) {
      toast("请输入商品规格");
      return;
    }
    Taro.showLoading();
    const baseInfo = Object.assign(info, {
      mainUrl: info.mainUrl[0]?.url,
      imgurls: info.imgurls?.map((sub) => sub?.url),
    });

    insertSpuInfo({
      ...baseInfo,
      sku,
      goodsList: goods,
      id,
      hitFlag: true,
    }).then(() => {
      Taro.hideLoading();
      navigateBackPage(1, ADD_MALL_INFO, {});
    });
  };

  // 上下架
  const hiddenAction = () => {
    hiddenSpuInfo({
      hitFlag: !hitFlag,
      id,
    }).then(() => {
      toast("操作成功");
      navigateBackPage(1, ADD_MALL_INFO, {});
    });
  };

  return (
    <>
      <View className={Style.addMallnfoWarp}>
        <Form onFinish={finish} form={formIt}>
          <FormItem
            name="mainUrl"
            required
            layout="vertical"
            label="商品主图"
            valueKey="fileList"
            valueFormat={formUploadFile}
            trigger="onAfterRead"
            validateTrigger="onAfterRead"
            className={Style.uploaderMain}
          >
            <Uploader
              name="mainUrl1"
              onDelete={(event) => {
                formDeleteFile(event, formIt, "mainUrl");
              }}
              maxCount={1}
            ></Uploader>
          </FormItem>

          <FormItem
            label="商品名称"
            name="name"
            required
            trigger="onInput"
            validateTrigger="onBlur"
            valueFormat={(e) => e.detail.value}
            borderBottom
            layout="vertical"
          >
            <Input placeholder="请输入商品名称" />
          </FormItem>
          <FormItem
            label="商品价格"
            name="amount"
            required
            trigger="onInput"
            validateTrigger="onBlur"
            valueFormat={(e) => e.detail.value}
            borderBottom
            layout="vertical"
          >
            <Input placeholder="请输入商品价格" />
          </FormItem>
          {/* 自定义规格 */}
          <>
            <View className={Style.cellItemWarp}>
              <text>*</text>
              <Cell
                className={Style.cellItem}
                title="商品规格"
                border={false}
                renderRightIcon={
                  <Icon
                    name="add"
                    onClick={() => {
                      setShow(true);
                    }}
                    size={24}
                    color={SUBMIT_BUTTON_COLOR}
                  ></Icon>
                }
              />
            </View>
            {sku?.map((item, index) => (
              <Cell
                className={Style.celltype}
                key={index}
                title={item?.name}
                value={item.items?.map((subItem) => subItem?.name).join(",")}
                renderRightIcon={
                  <Icon
                    name="clear"
                    onClick={() => {
                      setSku((val: []) => {
                        return val?.filter((_, subIndex) => subIndex !== index);
                      });
                    }}
                    size={24}
                    color={SUBMIT_BUTTON_COLOR}
                  ></Icon>
                }
              ></Cell>
            ))}
          </>
          {/* 自定义货物类型 */}
          <>
            <View className={Style.cellItemWarp}>
              <text>*</text>
              <Cell
                className={Style.cellItem}
                title="货物类型"
                border={false}
                renderRightIcon={
                  <Icon
                    name="add"
                    onClick={() => {
                      if (sku.length === 0) {
                        toast("请先输入规格");
                        return;
                      }
                      setShow1(true);
                    }}
                    size={24}
                    color={SUBMIT_BUTTON_COLOR}
                  ></Icon>
                }
              />
            </View>
            {goods?.map((item, index) => (
              <Cell
                className={Style.celltype}
                key={index}
                title={`货物类型${item.id}`}
                value={item?.skuName}
                renderRightIcon={
                  <Icon
                    name="clear"
                    onClick={() => {
                      setGoods((val: []) => {
                        return val?.filter(
                          (subVal: any) => subVal.id !== item.id
                        );
                      });
                    }}
                    size={24}
                    color={SUBMIT_BUTTON_COLOR}
                  ></Icon>
                }
              ></Cell>
            ))}
          </>
          <FormItem
            name="imgurls"
            required
            layout="vertical"
            label="商品描述图"
            valueKey="fileList"
            valueFormat={formUploadFile}
            trigger="onAfterRead"
            validateTrigger="onAfterRead"
            className={Style.uploaderSub}
          >
            <Uploader
              name="imgurls1"
              onDelete={(event) => {
                formDeleteFile(event, formIt, "imgurls");
              }}
              maxCount={4}
            ></Uploader>
          </FormItem>

          {!id ? (
            <Button
              type="primary"
              className={Style.addMallnfoButton}
              formType="submit"
              color={SUBMIT_BUTTON_COLOR}
            >
              提交
            </Button>
          ) : (
            <View className={Style.bothMallnfoButton}>
              <Button
                className={Style.footerbutton}
                type="primary"
                formType="submit"
              >
                修改
              </Button>
              <Button
                className={Style.footerbutton}
                type="primary"
                onClick={hiddenAction}
              >
                {hitFlag ? "下架" : "上架"}
              </Button>
            </View>
          )}
        </Form>
      </View>
      {/* sku规格 */}
      {show && (
        <SkuPopup
          show={show}
          setShow={setShow}
          setSku={setSku}
          skuidRef={skuidRef}
        ></SkuPopup>
      )}
      {/* goods商品 */}
      {show1 && (
        <GoodsPopup
          show={show1}
          setShow={setShow1}
          sku={sku}
          setGoods={setGoods}
          goodsidRef={goodsidRef}
        ></GoodsPopup>
      )}
    </>
  );
}

// 获取货物 - m * n * p - 先处理前面的，然后吐出来，在处理后面
const getGoodsList = (sku, id) => {
  let firstid = 1;

  // 处理sku为对应的格式
  const temp = sku.map((info) => {
    return info.items.map((subInfo) => {
      return {
        id: firstid++,
        skuIds: [subInfo.id],
        skuName: subInfo.name,
      };
    });
  });

  let goodsList = temp[0];

  // let skuTemp;
  for (let i = 1; i < temp.length; i++) {
    const curr = goodsList;
    const follow = temp[i];
    goodsList = curr
      .map((currItem) => {
        return follow.map((followItem) => {
          return {
            id: id++,
            skuIds: [...currItem.skuIds, ...followItem.skuIds],
            skuName: `${currItem.skuName} ${followItem.skuName}`,
          };
        });
      })
      .flat();
  }

  return goodsList;
};

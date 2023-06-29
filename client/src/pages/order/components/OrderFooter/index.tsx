import { FooterButtonWarp } from "@/components/FooterButton";
import { Button, Dialog, Field } from "@antmjs/vantui";
import { memo, useCallback, useState } from "react";
import { updateOrderState } from "@/request/order";
import toast from "@/utils/toast";
import Taro from "@tarojs/taro";
import { navigateBackPage } from "@yaunfei/taro-router";
import { ORDER_DETAIL, SALE_PHONE } from "@/common/constant";
import Style from "./index.module.less";

//  待发货 - 1
//  已发货 - 2
//  已完成 - 3
//  退款中 - 4
//  已关闭 - 5
type OrderFooter = {
  manageSate: string | undefined;
  state: 1 | 2 | 3 | 4 | 5 | any;
  orderid: string | undefined;
};

export default memo((props: OrderFooter) => {
  const { manageSate, state, orderid } = props;

  const [show, setShow] = useState(false);
  const [expressageid, setExpressageid] = useState("");

  const updateInfo = (stateVal) => {
    if (!expressageid) {
      toast("请先输入快递单号");
      return;
    }
    updateOrderState({
      orderid,
      state: stateVal,
      expressageid,
    }).then(() => {
      navigateBackPage(1, ORDER_DETAIL, {});
    });
  };

  const updateState = (stateVal, title) => {
    Taro.showModal({
      title,
      content: "",
      success: function (modalRes) {
        if (modalRes.confirm) {
          updateOrderState({
            orderid,
            state: stateVal,
          }).then(() => {
            navigateBackPage(1, ORDER_DETAIL, {});
          });
        }
      },
    });
  };

  // 用户侧
  const customerFooterBtn = useCallback(() => {
    switch (state) {
      case 1:
        return (
          <FooterButtonWarp>
            <Button
              className={Style.footerButtonStyle}
              type="primary"
              onClick={() => {
                updateState(4, "确定申请退款？");
              }}
            >
              申请退款
            </Button>
          </FooterButtonWarp>
        );
      case 2:
        return (
          <FooterButtonWarp>
            <Button
              className={Style.footerButtonStyle}
              type="primary"
              onClick={() => {
                updateState(3, "确定收货？");
              }}
            >
              确认收货
            </Button>
            <Button
              className={Style.footerButtonStyle}
              type="primary"
              onClick={() => {
                toast(`请拨打${SALE_PHONE}进行退款`);
              }}
            >
              申请退款
            </Button>
          </FooterButtonWarp>
        );
    }
  }, [state]);

  // 管理侧
  const manageFooterBtn = useCallback(() => {
    switch (state) {
      case 1:
        return (
          <FooterButtonWarp>
            <Button
              className={Style.footerButtonStyle}
              type="primary"
              onClick={() => {
                setShow(true);
              }}
            >
              去发货
            </Button>
          </FooterButtonWarp>
        );
      case 2:
        return (
          <FooterButtonWarp>
            <Button
              className={Style.footerButtonStyle}
              type="primary"
              onClick={() => {
                updateState(5, "确定退款？");
              }}
            >
              确认退款
            </Button>
          </FooterButtonWarp>
        );
      case 4:
        return (
          <FooterButtonWarp>
            <Button
              className={Style.footerButtonStyle}
              type="primary"
              onClick={() => {
                updateState(1, "确定拒绝退款？");
              }}
            >
              拒绝退款
            </Button>
            <Button
              className={Style.footerButtonStyle}
              type="primary"
              onClick={() => {
                updateState(5, "确定退款？");
              }}
            >
              确认退款
            </Button>
          </FooterButtonWarp>
        );
    }
  }, [state]);

  return (
    <>
      {manageSate ? manageFooterBtn() : customerFooterBtn()}
      <Dialog
        title="请输入快递号"
        showCancelButton
        show={show}
        className={Style.orderFooterDialog}
        onClose={() => setShow(false)}
        onConfirm={() => {
          updateInfo(2);
        }}
      >
        <Field
          value={expressageid}
          label="快递单号"
          placeholder="请输入快递单号"
          border
          onChange={(e) => setExpressageid(e.detail)}
        />
      </Dialog>
    </>
  );
});

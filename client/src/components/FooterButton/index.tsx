import { Button, ButtonProps, View } from "@tarojs/components";
import { CSSProperties } from "react";
import Style from "./index.module.less";

type LoginButtonProps = ButtonProps & { btnStyle?: CSSProperties };

export function ConfirmButton(props: LoginButtonProps) {
  const { btnStyle } = props;
  return (
    <>
      <View className={Style.footerButtonHeight}></View>
      <View className={Style.footerButton}>
        <Button
          style={btnStyle}
          className={Style.confirmButton}
          onClick={props?.onClick}
        >
          {props.children}
        </Button>
      </View>
    </>
  );
}
export function CancelButton(props: LoginButtonProps) {
  const { btnStyle } = props;
  return (
    <>
      <View className={Style.footerButtonHeight}></View>
      <View className={Style.footerButton}>
        <Button
          style={btnStyle}
          className={Style.cancelButton}
          onClick={props?.onClick}
        >
          {props.children}
        </Button>
      </View>
    </>
  );
}

// fixed 底部按钮包裹
export function FooterButtonWarp(props) {
  return (
    <>
      <View className={Style.footerButtonHeight}></View>
      <View className={Style.footerButtonWarp}>{props.children}</View>
    </>
  );
}

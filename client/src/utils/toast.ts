import Taro from "@tarojs/taro";

export default function toast(title: string) {
  Taro.showToast({
    title,
    icon: "none",
  });
}

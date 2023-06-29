import { useEffect, useState } from "react";
import { View, Image, Text } from "@tarojs/components";
import { Icon } from "@antmjs/vantui";
import { navigateToPage } from "@yaunfei/taro-router";
import { AVATAR_URL, NICKNAME } from "@/common/constant";
import Taro, { useDidShow } from "@tarojs/taro";
import { getUserInfo, manageUser } from "@/request/login";
import Style from "./index.module.less";

export default function My() {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [nickName, setNickName] = useState<string>("");
  const [manageFlag, setManageFlag] = useState(false);

  // 先useDidShow执行
  useEffect(() => {
    getUserInfo().then((res) => {
      const { nick_name, avatar_url } = res;
      Taro.setStorageSync(NICKNAME, nick_name);
      Taro.setStorageSync(AVATAR_URL, avatar_url);
      setAvatarUrl(avatar_url);
      setNickName(nick_name);
    });
    manageUser().then((res) => {
      setManageFlag(res);
    });
  }, []);

  // 后useEffect执行
  useDidShow(() => {
    const avatar = Taro.getStorageSync(AVATAR_URL);
    const nickName = Taro.getStorageSync(NICKNAME);
    if (avatar && nickName) {
      setAvatarUrl(avatar);
      setNickName(nickName);
    }
  });

  return (
    <View className={Style.myWarp}>
      <Image className={Style.myImage} src={avatarUrl}></Image>
      <View className={Style.myName}>{nickName}</View>
      <View className={Style.backStyle}>
        <View
          className={Style.protocol}
          onClick={() => {
            navigateToPage("/pages/order/orderList/index");
          }}
        >
          <Text>我的订单</Text>
          <Icon name="arrow"></Icon>
        </View>
        <View
          className={Style.protocol}
          onClick={() => {
            navigateToPage("/pages/user/editUserInfo/index", {
              avatarUrl,
              nickName,
            });
          }}
        >
          <Text>更新资料</Text>
          <Icon name="arrow"></Icon>
        </View>
      </View>
      {manageFlag && (
        <View className={Style.backStyle}>
          <View
            className={Style.protocol}
            onClick={() => {
              navigateToPage("/pages/order/manageOrder/index");
            }}
          >
            <Text>订单管理</Text>
            <Icon name="arrow"></Icon>
          </View>
          <View
            className={Style.protocol}
            onClick={() => {
              navigateToPage("/pages/mall/mallnfoList/index");
            }}
          >
            <Text>商品管理</Text>
            <Icon name="arrow"></Icon>
          </View>
        </View>
      )}
    </View>
  );
}

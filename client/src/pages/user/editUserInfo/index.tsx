import { useState } from "react";
import { View, Image, Input, Button } from "@tarojs/components";
import Gap from "@/components/Gap";
import { Cell } from "@antmjs/vantui";
import { AVATAR_URL, NICKNAME } from "@/common/constant";
import { ConfirmButton } from "@/components/FooterButton";
import Taro, { useDidShow } from "@tarojs/taro";
import { navigateBackPage, usePageData } from "@yaunfei/taro-router";
import { updateUser } from "@/request/login";
import toast from "@/utils/toast";
import { giteeUploadFile } from "@/utils/formUploader";
import Style from "./index.module.less";

const DEFAUL_TAVATAR =
  "https://gitee.com/zhengyaunfei/gallery/raw/master/BSprout-Mall/user_info/1685956289720.jpg";

export default function EditUserInfo() {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [name, setName] = useState<string>("");
  const option: any = usePageData();

  useDidShow(() => {
    if (option) {
      setAvatarUrl(option?.avatarUrl);
      setName(option?.nickName);
    }
  });

  const chooseAvatar = (e) => {
    const avatar = e.detail?.avatarUrl;
    setAvatarUrl(avatar);
  };

  const submit = () => {
    if (option?.avatarUrl === avatarUrl && option?.nickName == name) {
      toast("请修改相关信息");
      return;
    }
    if (option?.avatarUrl !== avatarUrl) {
      // 上传图片
      giteeUploadFile("user_info", avatarUrl).then((res) => {
        // 更新
        updateUser({
          nickName: name,
          avatarUrl: res.fileID,
        }).then(() => {
          Taro.setStorageSync(NICKNAME, name);
          Taro.setStorageSync(AVATAR_URL, res.fileID);
          if (option?.avatarUrl !== DEFAUL_TAVATAR) {
            Taro.cloud.deleteFile({
              fileList: [option?.avatarUrl],
            });
          }
          navigateBackPage();
        });
      });
    } else {
      // 更新
      updateUser({
        nickName: name,
        avatarUrl: avatarUrl,
      }).then(() => {
        Taro.setStorageSync(NICKNAME, name);
        Taro.setStorageSync(AVATAR_URL, avatarUrl);
        navigateBackPage();
      });
    }
  };

  return (
    <View className={Style.editUserInfoWarp}>
      <Gap></Gap>
      <Cell
        title="头像"
        border
        renderRightIcon={
          <Button
            className={Style.editUserInfoButton}
            open-type="chooseAvatar"
            onChooseAvatar={chooseAvatar}
          >
            <Image src={avatarUrl}></Image>
          </Button>
        }
      />
      <Cell
        title="昵称"
        border={false}
        renderRightIcon={
          <Input
            value={name}
            onInput={(e) => {
              setName(e.detail.value);
            }}
          ></Input>
        }
      />
      <ConfirmButton onClick={submit}>更新</ConfirmButton>
    </View>
  );
}

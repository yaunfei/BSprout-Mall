import { LOGIN_BACK, LOGIN_INFO } from "@/common/constant";
import Taro from "@tarojs/taro";

// 跳转到登录页面
export function goLoginPage(callBack?: () => void) {
  return new Promise((reslove) => {
    Taro.navigateTo({
      url: `/pages/common/loginPage/index?callBack=${callBack}`,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        [LOGIN_INFO]: function (data) {
          reslove(data);
        },
        [LOGIN_BACK]: callBack,
      },
    });
  });
}

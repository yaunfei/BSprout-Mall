import { Component, PropsWithChildren } from "react";
import Taro, { Config } from "@tarojs/taro";
import { DBID, STORE_OPENID } from "@common/constant";
import { miniLogin } from "./request/login";

import "./app.less";

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    if (process.env.TARO_ENV === "weapp") {
      Taro.cloud.init({
        env: DBID,
        traceUser: true,
      });
      // if (!Taro.getStorageSync(STORE_OPENID)) {
      //   miniLogin().then((res) => {
      //     console.log(111, res);
      //     const { openid } = res;
      //     Taro.setStorageSync(STORE_OPENID, openid);
      //   });
      // }
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;

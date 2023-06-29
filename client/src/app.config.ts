export default {
  pages: [
    "pages/mall/index/index",
    "pages/user/my/index",
    "pages/user/editUserInfo/index",
    "pages/mall/detail/index",
    "pages/order/orderList/index",
    "pages/order/orderDetail/index",
    "pages/order/manageOrder/index",
    "pages/mall/mallnfoList/index",
    "pages/mall/addMallnfo/index",
    "pages/mall/searchMall/index",
  ],
  tabBar: {
    color: "#7E828C",
    selectedColor: "#7E828C",
    list: [
      {
        pagePath: "pages/mall/index/index",
        text: "购物",
        iconPath: "assets/images/homeUncheck@2x.png", // 未选中
        selectedIconPath: "assets/images/homeCheck@2x.png", // 选中
      },
      {
        pagePath: "pages/user/my/index",
        text: "我的",
        iconPath: "assets/images/myUncheck@2x.png", // 未选中
        selectedIconPath: "assets/images/myCheck@2x.png", // 选中
      },
    ],
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  cloud: true,
  requiredPrivateInfos: ["chooseAddress"],
};

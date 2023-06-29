## 微信小程序云函数商城

### 1. 介绍

简单的购物商城小程序。分为两端，c端用户和b端用户。

- c端用户可以选择商品，下单，查看订单，退货，确认收货（查看不到物流信息。已发货的订单，支持拨打电话），可以修改个人信息。
  
- b端用户可以管理商品信息（新增商品，修改商品信息，上下架商品），和处理订单（订单可以进行发货，退货）。
  
- 订单状态：1: “待发货”, 2: “已发货”, 3: “已完成”, 4: “退款中”, 5: “已关闭”。
  
- 云函数表结构
  
    一共3个非关系数据库的表。

    ![商城ER图](https://gitee.com/zhengyaunfei/gallery/raw/master/pictures/202306271106527.png)

- 图片保存在`gitee`图床。不支持支付，因为需要商家号。微信云开发最好的一点是用户不需要登录。

- c端用户效果图：

    ![飞书20230627-144739.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40f973773e5e4f15b5cc1bca898c374f~tplv-k3u1fbpfcp-watermark.image?)

- b端用户效果图：

    ![飞书20230627-153320.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bdced4d67e647868e12662e120709af~tplv-k3u1fbpfcp-watermark.image?)

### 2. 项目目录

    ```shell
    ├── README.md
    ├── client // 前端代码
    │   ├── babel.config.js
    │   ├── config // 项目配置
    │   │   ├── dev.js
    │   │   ├── index.js
    │   │   └── prod.js
    │   ├── package.json
    │   ├── pnpm-lock.yaml
    │   ├── src
    │   │   ├── app.config.ts
    │   │   ├── app.less
    │   │   ├── app.ts
    │   │   ├── assets // 静态资源
    │   │   ├── common // 公共参数
    │   │   │   ├── constant.ts // 公共参数
    │   │   │   └── reg.ts// 正则表达规则
    │   │   ├── components // 公共组件
    │   │   ├── index.html
    │   │   ├── pages // 页面
    │   │   │   ├── mall // 商品
    │   │   │   │   ├── addMallnfo // 新增修改商品
    │   │   │   │   ├── components
    │   │   │   │   ├── detail // 商品详情
    │   │   │   │   ├── index // 首页商品列表
    │   │   │   │   ├── mallnfoList // 管理商品列表
    │   │   │   │   └── searchMall // 查询商品
    │   │   │   ├── order // 订单
    │   │   │   │   ├── components
    │   │   │   │   ├── manageOrder // 管理订单列表
    │   │   │   │   ├── orderDetail // 订单详情
    │   │   │   │   └── orderList // 订单列表
    │   │   │   └── user // 用户
    │   │   │       ├── editUserInfo // 更新用户信息
    │   │   │       └── my // 我的
    │   │   ├── request // 请求
    │   │   └── utils // 工具类
    │   ├── tsconfig.json
    │   └── types
    │       ├── global.d.ts
    │       ├── mall
    │       └── order
    ├── cloud // 云函数代码
    │    └── functions
    │        └── BSprout-Mall
    │            ├── config.json
    │            ├── index.js
    │            ├── mall
    │            ├── order
    │            ├── package-lock.json
    │            ├── package.json
    │            ├── pnpm-lock.yaml
    │            ├── user
    │            └── utils
    ├── dbinit
    │   └── spu_info.json // 云函数，初始化数据
    ├── project.config.json
    └── project.private.config.json
    ```

​

### 3. 参数配置

1. 其中需要在`constant.ts`配置公共信息。如下：

```tsx
export const APPID = ""; // 小程序的appid
export const DBID = ""; // 云函数id
export const GITEE_TOKEN = ""; // gitee token
export const SALE_PHONE = ""; // 售后电话

// gitee cdn 地址
export const GITEE_URL =
  "https://gitee.com/api/v5/repos/自己的gitee账号名/仓库地址/contents/具体的文件夹1";

// gitee 下载地址
export const GITEE_DOWNLOAD_URL =
  "https://gitee.com/自己的gitee账号名/仓库地址/raw/master/具体的文件夹1";
```

2. 获取`give token` 参考[利用Gitee搭建免费图床（详细教程）_gitee图床_牛小小小婷～的博客-CSDN博客](https://blog.csdn.net/hannah2233/article/details/117025387)。

另外需要在仓库的“具体的文件夹1”下创建3个文件夹。分别如下

![image-20230627171140972](https://gitee.com/zhengyaunfei/gallery/raw/master/pictures/202306271711120.png)

3. 云函数数据库新建三个集合`spu_info`, `order_info`,`user_info`。并将`spu_info.json` 数据导入到`spu_info`。如图：

![image-20230628133743651](https://gitee.com/zhengyaunfei/gallery/raw/master/pictures/202306281337936.png)

4. 设置管理员，请手动在`user_info`数据库中，找到对应用户，新增`manageFlag :ture`。

### 4. 项目启动

小程序打开`BSprout-Mall`根目录，如图：

![image-20230628140727337](https://gitee.com/zhengyaunfei/gallery/raw/master/pictures/202306281407392.png)

```shell
cd client
pnpm install
pnpm dev:weapp
```

注意⚠️要初始化，云函数的依赖包，可以打开开发者工具上面的`云开发`菜单，自动初始化。开发完云函数，要记得上传并部署云函数。

项目地址：[yaunfei/BSprout-Mall (github.com)](https://github.com/yaunfei/BSprout-Mall)

掘金地址：[微信小程序云函数开发简单的商城 - 掘金 (juejin.cn)](https://juejin.cn/post/7249624871720747063)

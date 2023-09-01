const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

/**
 * order 订单列表
 * @param {*} event
 * @param {*} context
 * @returns
 */
exports.main = async (event, context) => {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  const _ = db.command;
  const $ = db.command.aggregate;

  const openid = wxContext.OPENID;
  const page = event.page || 1;
  const pageSize = event.pageSize || 10;
  const skip = (page - 1) * pageSize;

  let matchData = {};

  // 待处理 - 1: 待发货 - 4: 待退款
  if (event?.manageSate === 1) {
    matchData = { state: _.eq(1).or(_.eq(4)) };
    // 处理中 - 2: 已发货
  } else if (event?.manageSate === 2) {
    matchData = { state: _.eq(2) };
    // 已完成 - 3: 已完成 - 5: 已关闭
  } else if (event?.manageSate === 3) {
    matchData = { state: _.eq(3).or(_.eq(5)) };
  } else {
    matchData = { openid };
  }

  try {
    // total
    const countResult = await db
      .collection("order_info")
      // 聚合
      .aggregate()
      // 查询条件
      .match(matchData)
      // 关联spu_info表。foreignField为spu_info的字段，localField是order_info字段
      .lookup({
        from: "spu_info",
        localField: "spuid",
        foreignField: "_id",
        as: "spuInfo",
      })
      .count("total")
      .end();

    // 内容
    const result = await db
      .collection("order_info")
      // 聚合
      .aggregate()
      // 查询条件
      .match(matchData)
      // 关联spu_info表。foreignField为spu_info的字段，localField是order_info字段
      .lookup({
        from: "spu_info",
        localField: "spuid",
        foreignField: "_id",
        as: "spuInfo",
      })
      // 组合成一个层级输出
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(["$spuInfo", 0]), "$$ROOT"]),
      })
      // 去掉生成的 spuInfo 字段集合
      .project({
        spuInfo: 0,
      })
      // 排序
      .sort({
        create_time: -1,
      })
      // 第几页
      .skip(skip)
      // 一页有多少
      .limit(pageSize)
      // 输出想要的字段
      .project({
        create_time: true,
        count_num: true,
        amount: true,
        state: true,
        mainUrl: true,
        name: true,
        // consignee_info: true,
        // TODO 默认加上管理员。注意去掉。脱敏
        consignee_info: {
          userName: $.concat([
            $.substrCP(["$consignee_info.userName", 0, 1]),
            "**",
          ]),
          telNumber: $.concat([
            $.substr(["$consignee_info.telNumber", 0, 3]),
            "****",
            $.substr(["$consignee_info.telNumber", 7, 11]),
          ]),
          provinceName: true,
          cityName: true,
          countyName: true,
          detailInfo: $.concat([
            $.substrCP(["$consignee_info.detailInfo", 0, 3]),
            "********",
          ]),
        },
        orderid: true,
        expressageid: true,
        // 处理 商品对应的sku
        skuName1: $.arrayElemAt([
          $.filter({
            input: "$goodsList",
            as: "item",
            cond: $.eq(["$$item.id", "$skuid"]),
          }),
          0,
        ]),
      })
      // 将商品对应的sku拿出来
      .replaceRoot({
        newRoot: $.mergeObjects(["$skuName1", "$$ROOT"]),
      })
      // 去掉生成的 多余的字段 字段集合
      .project({
        skuName1: 0,
        skuIds: 0,
        id: 0,
      })
      .end();
    // 没有数据时
    if (countResult.list.length === 0) {
      return {
        data: [],
        total: 0,
      };
    } else {
      return {
        data: result.list,
        total: countResult.list[0].total,
      };
    }
  } catch (e) {
    return e;
  }
};

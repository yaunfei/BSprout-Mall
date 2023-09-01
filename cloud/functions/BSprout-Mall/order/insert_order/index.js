const cloud = require("wx-server-sdk");
const dayjs = require("dayjs");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();

/**
 * sku 商品规格
 * @param {*} event
 * @param {*} context
 * @returns
 */
exports.main = async (event, context) => {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext();

  const now = dayjs().format("YYYYMMDDHHmmss");

  const orderid = `2${now}${Math.round(Math.random() * 100)}`;
  const create_time = dayjs().valueOf();

  const openid = wxContext.OPENID;

  const {
    spuid,
    skuid,
    state,
    amount,
    count_num,
    consignee_info: {
      userName,
      telNumber,
      provinceName,
      cityName,
      countyName,
      detailInfo,
    },
  } = event;

  try {
    return await db.collection("order_info").add({
      data: {
        orderid,
        openid,
        create_time,
        spuid,
        skuid,
        state,
        amount,
        count_num,
        consignee_info: {
          userName,
          telNumber,
          provinceName,
          cityName,
          countyName,
          detailInfo,
        },
      },
    });
  } catch (err) {
    return err;
  }
};

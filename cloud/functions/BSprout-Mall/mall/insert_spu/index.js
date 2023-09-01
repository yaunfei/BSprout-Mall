const cloud = require("wx-server-sdk");
const deepClone = require("../../utils/deepClone");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();

exports.main = async (event, contet) => {
  // 必须深拷贝，不然下面删除的两个属性，也会跟着删除
  const data = deepClone(event);

  delete data.type;
  delete data?.id;
  try {
    if (!event?.id) {
      return db.collection("spu_info").add({ data });
    } else {
      return db
        .collection("spu_info")
        .where({
          _id: event?.id,
        })
        .update({ data });
    }
  } catch (e) {
    console.log(e);
  }
};

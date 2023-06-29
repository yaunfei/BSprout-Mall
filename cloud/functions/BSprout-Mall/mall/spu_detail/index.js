const cloud = require('wx-server-sdk');

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();

/**
 * spu 根据id获取商品详情
 * @param {*} event
 * @param {*} context
 * @returns
 */
exports.main = async (event, context) => {
	try {
		const result = await db
			.collection('spu_info')
			.where({
				_id: event?.id,
			})
			.limit(1)
			.get();

		return result.data[0];
	} catch (e) {
		console.error(e);
	}
};

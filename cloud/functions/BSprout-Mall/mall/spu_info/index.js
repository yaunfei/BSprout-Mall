const cloud = require('wx-server-sdk');

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();

/**
 * spu 商品大类列表
 * @param {*} event
 * @param {*} context
 * @returns
 */
exports.main = async (event, context) => {
	const page = event.page || 1;
	const pageSize = event.pageSize || 10;
	const skip = (page - 1) * pageSize;

	try {
		const countResult = await db.collection('spu_info').count();
		const total = countResult.total;

		const initData = () => {
			// 商品管理进来
			if (event?.manageEntry) {
				// 搜索名称
				if (event?.name) {
					return db.collection('spu_info').where({
						name: db.RegExp({
							regexp: event?.name,
							options: 'i',
						}),
					});
				} else {
					// 初始化进来
					return db.collection('spu_info');
				}
				// 主页进来
			} else {
				if (event?.name) {
					// 搜索名称
					return db.collection('spu_info').where({
						name: db.RegExp({
							regexp: event?.name,
							options: 'i',
						}),
						hitFlag: true,
					});
					// 初始化进来
				} else {
					return db.collection('spu_info').where({
						hitFlag: true,
					});
				}
			}
		};

		const result = await initData()
			.orderBy('_id', 'desc')
			.skip(skip)
			.limit(pageSize)
			.get();

		return {
			data: result.data,
			total: total,
		};
	} catch (e) {
		console.error(e);
	}
};

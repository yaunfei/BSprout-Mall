const cloud = require('wx-server-sdk');

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();

const DEFAUL_TAVATAR =
	'https://gitee.com/zhengyaunfei/gallery/raw/master/BSprout-Mall/user_info/1685956289720.jpg';

/**
 * 用户信息
 * @param {*} event
 * @param {*} context
 * @returns
 */
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext();
	const openid = wxContext.OPENID;
	try {
		if (event.type === 'user_info') {
			const res = await db
				.collection('user_info')
				.field({
					openid: 0,
					_id: 0,
				})
				.where({
					openid,
				})
				.get();
			// 请求成功返回结果
			if (res.errMsg === 'collection.get:ok') {
				if (res?.data?.length > 0) {
					return res?.data[0];
				} else {
					// 新增用户
					await db.collection('user_info').add({
						data: {
							openid,
							nick_name: '小豆芽用户',
							avatar_url: DEFAUL_TAVATAR,
						},
					});
					return {
						nick_name: '小豆芽用户',
						avatar_url: DEFAUL_TAVATAR,
					};
				}
			} else {
				return null;
			}
			// 更新用户信息
		} else if (event.type === 'update_user') {
			const { nickName, avatarUrl } = event;
			return await db
				.collection('user_info')
				.where({
					openid,
				})
				.update({
					data: {
						nick_name: nickName,
						avatar_url: avatarUrl,
					},
				});
		} else if (event.type === 'manage_user') {
			const res = await db
				.collection('user_info')
				.where({
					openid,
				})
				.get();
			return res?.data[0]?.manageFlag;
		}
	} catch (err) {
		return err;
	}
};

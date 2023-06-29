const cloud = require('wx-server-sdk');

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();

exports.main = async (event, contet) => {
	let data;
	if (event?.expressageid) {
		data = {
			state: event?.state,
			expressageid: event?.expressageid,
		};
	} else {
		data = {
			state: event?.state,
		};
	}
	try {
		return db
			.collection('order_info')
			.where({
				orderid: event?.orderid,
			})
			.update({
				data,
			});
	} catch (e) {
		console.log(e);
	}
};

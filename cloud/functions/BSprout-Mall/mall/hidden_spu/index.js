const cloud = require('wx-server-sdk');

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();

exports.main = async (event, contet) => {
	try {
		return db
			.collection('spu_info')
			.where({
				_id: event?.id,
			})
			.update({
				data: {
					hitFlag: event?.hitFlag,
				},
			});
	} catch (e) {
		console.log(e);
	}
};

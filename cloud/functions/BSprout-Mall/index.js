// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const login = require('./user/login/index');
const spu_info = require('./mall/spu_info/index'); // spu 商品大类列表
const insert_spu = require('./mall/insert_spu/index'); // 新增spu 商品大类列表
const hidden_spu = require('./mall/hidden_spu/index'); // 上下架spu 商品
const spu_detail = require('./mall/spu_detail/index'); // 根据_id获取商品详情
const insert_order = require('./order/insert_order/index'); // 新增 order 订单
const order_info = require('./order/order_info/index'); // order 订单列表
const user_info = require('./user/user_info/index'); // 用户信息列表
const update_order_state = require('./order/update_order_state/index'); // 更新订单状态

// 云函数入口函数
exports.main = async (event, context) => {
	switch (event.type) {
		case 'login':
			return await login.main(event, context);
		case 'spu_info':
			return await spu_info.main(event, context);
		case 'insert_spu':
			return await insert_spu.main(event, context);
		case 'hidden_spu':
			return await hidden_spu.main(event, context);
		case 'spu_detail':
			return await spu_detail.main(event, context);
		case 'insert_order':
			return await insert_order.main(event, context);
		case 'order_info':
			return await order_info.main(event, context);
		case 'user_info':
			return await user_info.main(event, context);
		case 'update_user':
			return await user_info.main(event, context);
		case 'manage_user':
			return await user_info.main(event, context);
		case 'update_order_state':
			return await update_order_state.main(event, context);
	}
};

//订单相关挨批
const Joi = require('joi');
const GROUP_NAME = 'orders';

module.exports = [
	{
		method: 'POST',
		path: `/${GROUP_NAME}`,
		handler: async (req, rep) => {
			rep('订单api');
		},
		config: {
			tags: [ 'api', GROUP_NAME ],
			description: '创建订单',
			//payload（request body）验证
			validate: {
				//通过 validate.payload 来约束
				payload: {
					goodsList: Joi.array().items(
						Joi.object().keys({
							goods_id: Joi.number().integer(),
							count: Joi.number().integer()
						})
					)
				}
			}
		}
	},
	{
		method: 'POST',
		path: `/${GROUP_NAME}/{orderId}/pay`,
		handler: async (req, rep) => {
			rep('支付订单api');
		},
		config: {
			tags: [ 'api', GROUP_NAME ],
			description: '支付moutiao订单',
			//动态路由的 params 验证
			//动态路由所依赖的变量 orderId 以 params 属性的字段来传递，orderId: Joi.string().required() 的描述，定义了 orderId 必须是字符串，且此参数必填
			validate: {
				params: {
					orderId: Joi.string().required()
				}
			}
		}
	}
];

//店铺相关api
const Joi = require('joi');
const GROUP_NAME = 'shops';

module.exports = [
	{
		method: 'GET',
		path: `/${GROUP_NAME}`,
		handler: async (req, rep) => {
			rep('shops api');
		},
		config: {
			tags: [ 'api', GROUP_NAME ],
			description: '获取店铺列表',
			//通过 validate.query 来约束：
			validate: {
				//GET 接口的 query（URL 路径参数） 校验
				query: {
					limit: Joi.number().integer().min(1).default(10).description('每页的条目数'),
					page: Joi.number().integer().min(1).default(1).description('页码数')
				},
				//适用于 header 额外字段约束的 headers 验证
				headers: Joi.object({
					authorization: Joi.string().required()
				}).unknown()
			}
		}
	},
	{
		method: 'GET',
		path: `/${GROUP_NAME}/{shopId}/goods`,
		handler: async (req, rep) => {
			rep('shops-goods api');
		},
		config: {
			tags: [ 'api', GROUP_NAME ],
			description: '获取店铺商品列表'
		}
	}
];

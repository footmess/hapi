//店铺相关api
const Joi = require('joi');
const models = require('../models');
const { paginationDefine } = require('../utils/router-pagination');
const GROUP_NAME = 'shops';

module.exports = [
	{
		method: 'GET',
		path: `/${GROUP_NAME}`,
		handler: async (req, rep) => {
			//通过await来异步查取数据
			//Sequelize 为我们提供了 findAndCountAll 的 API，来为分页查询提供更高效的封装实现，
			//返回的列表与总条数会分别存放在 rows 与 count 字段的对象中
			const { rows: results, count: totalCount } = await models.shops.findAndCountAll({
				attributes: [ 'id', 'name' ],
				limit: req.query.limit,
				offset: (req.query.page - 1) * req.query.limit
			});
			//在 findAll 中加入一个 attributes 的约束  findAll({ attributes: { exclude: ['password'] } })
			// const result = await models.shops.findAll({ attributes: [ 'id', 'name' ] });
			rep({ results, totalCount });
		},
		config: {
			tags: [ 'api', GROUP_NAME ],
			auth: false,
			description: '获取店铺列表',
			//通过 validate.query 来约束：
			validate: {
				//GET 接口的 query（URL 路径参数） 校验
				query: {
					/*  引入公共校验规则
					limit: Joi.number().integer().min(1).default(7).description('每页的条目数'),
					page: Joi.number().integer().min(1).default(1).description('页码数')
					*/
					...paginationDefine
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

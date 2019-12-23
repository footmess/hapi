//店铺相关api
const Joi = require('joi');
const models = require('../models');
const { paginationDefine, jwtHeaderDefine } = require('../utils/router-help');
const GROUP_NAME = 'shops';

module.exports = [
	{
		method: 'GET',
		path: `/${GROUP_NAME}`,
		handler: async (req, rep) => {
			//通过await来异步查取数据
			//Sequelize 为我们提供了 findAndCountAll 的 API，来为分页查询提供更高效的封装实现，
			//返回的列表与总条数会分别存放在 rows 与 count 字段的对象中
			//注意 这里rows对应的值必须为 results ，否则调整是否设置pagination会报错
			const { rows: results, count: totalCount } = await models.shops.findAndCountAll({
				attributes: [ 'id', 'name' ],
				limit: req.query.limit,
				offset: (req.query.page - 1) * req.query.limit
			});
			console.log(req.auth.credentials);
			//在 findAll 中加入一个 attributes 的约束  findAll({ attributes: { exclude: ['password'] } })
			// const result = await models.shops.findAll({ attributes: [ 'id', 'name' ] });
			rep({ results, totalCount });
		},
		config: {
			tags: [ 'api', GROUP_NAME ],
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
				// headers: Joi.object({
				// 	authorization: Joi.string().required()
				// }).unknown()

				//引入公共header配置
				...jwtHeaderDefine
			},
			auth: false
		}
	},
	{
		method: 'GET',
		path: `/${GROUP_NAME}/{shopId}/goods`,
		handler: async (req, rep) => {
			//增加带有where的条件查询
			const { rows: results, count: totalCount } = await models.goods
				.findAndCountAll({
					//基于shop_id的条件查询
					where: {
						// shop_id: req.params.shopId
						shop_id: req.params.shopId
					},
					// attributes 的约束
					attributes: [ 'id', 'name', 'thumb_url' ],
					limit: req.query.limit,
					offset: (req.query.page - 1) * req.query.limit
				})
				//碰到接口500的情况，可以在model的操作后面捕获错误,比如models.findAll().catch(e => console.log(e))
				.catch((e) => console.log(e));
			rep({ results, totalCount });
		},
		config: {
			tags: [ 'api', GROUP_NAME ],
			description: '获取店铺的商品列表',
			validate: {
				params: {
					shopId: Joi.number().integer().required().description('店铺的id')
				},
				query: {
					...paginationDefine
				},
				//适用于 header 额外字段约束的 headers 验证
				// headers: Joi.object({
				// 	authorization: Joi.string().required()
				// }).unknown()
				...jwtHeaderDefine
			},
			auth: false
		}
	}
];

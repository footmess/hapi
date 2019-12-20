//设置公共的分页入参校验
const Joi = require('joi');

const paginationDefine = {
	limit: Joi.number().integer().min(1).default(7).description('每页的条目数'),
	page: Joi.number().integer().min(1).default(1).description('页码数'),
	pagination: Joi.boolean().default(true).description('是否开启分页，默认为true')
};

module.exports = { paginationDefine };

//swagger插件 生成接口文档
const inert = require('inert');
const vision = require('vision');
const package = require('package');
const hapiSwagger = require('hapi-swagger');

module.exports = [
	inert,
	vision,
	{
		register: hapiSwagger,
		options: {
			info: {
				title: '接口文档',
				version: package.version
			},
			//定义接口以tags属性定义为分组
			grouping: 'tags',
			tags: [
				{
					name: 'demo',
					description: '测试啊啊啊'
				},
				{
					name: 'shops',
					description: '店铺相关'
				},
				{
					name: 'orders',
					description: '订单相关'
				}
			]
		}
	}
];

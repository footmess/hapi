// 路由 测试接口
const { jwtHeaderDefine } = require('../utils/router-help');

module.exports = [
	//创建一个hello接口
	{
		method: 'GET',
		path: '/',
		handler: (request, reply) => {
			console.log(request.auth.credentials);
			reply('hello hapi');
		},

		//为 REST 接口添加 Swagger 标记
		config: {
			tags: [ 'api', 'demo' ],
			description: '测试啦啦啦啦',
			validate: {
				...jwtHeaderDefine
			}
		}
	}
];

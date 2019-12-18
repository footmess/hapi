// 路由 测试接口
module.exports = [
	//创建一个hello接口
	{
		method: 'GET',
		path: '/',
		handler: (request, reply) => {
			reply('hello hapi');
		}
	}
];

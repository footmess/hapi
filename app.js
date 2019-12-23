//app入口文件

const dotenv = require('dotenv');
dotenv.config();
const Hapi = require('hapi');
const hapiAuthJWT2 = require('hapi-auth-jwt2');
const Config = require('./config');
const RoutesHello = require('./routes/hello-world');
const RoutesShop = require('./routes/shops');
const RoutesOrder = require('./routes/orders');
const RoutesUser = require('./routes/users');
const PluginHapiSwagger = require('./plugins/hapi-swagger');
const PluginHapiPagination = require('./plugins/hapi-pagination');
const PluginHapiAuthJwt2 = require('./plugins/hapi-auth-jwt2');

const server = new Hapi.Server();

//配置服务器启动host和端口
server.connection({
	host: Config.host,
	port: Config.port
});

const init = async () => {
	//通过 server.register 挂载 swagger 插件配置
	await server.register([ ...PluginHapiSwagger, PluginHapiPagination, hapiAuthJWT2 ]);

	//先注册然后获取 server 实例后才完成最终的配置
	PluginHapiAuthJwt2(server);

	server.route([
		//创建一个hello接口
		...RoutesHello,
		...RoutesShop,
		...RoutesOrder,
		...RoutesUser
	]);

	//启动服务
	await server.start();
	console.log(process.env.NODE_ENV);
	console.log(`Server running at: ${server.info.uri}`);
};

init();

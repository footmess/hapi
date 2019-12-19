//app入口文件

const dotenv = require('dotenv');
dotenv.config();
const Hapi = require('hapi');
const Config = require('./config');
const RoutesHello = require('./routes/hello-world');
const RoutesShop = require('./routes/shops');
const RoutesOrder = require('./routes/orders');
const PluginHapiSwagger = require('./plugins/hapi-swagger');

const server = new Hapi.Server();

//配置服务器启动host和端口
server.connection({
	host: Config.host,
	port: Config.port
});

const init = async () => {
	//通过 server.register 挂载 swagger 插件配置
	await server.register([ ...PluginHapiSwagger ]);

	server.route([
		//创建一个hello接口
		...RoutesHello,
		...RoutesShop,
		...RoutesOrder
	]);

	//启动服务
	await server.start();
	console.log(process.env.MYSQL_PASSWORD, process.env.NODE_ENV);
	console.log(`Server running at: ${server.info.uri}`);
};

init();

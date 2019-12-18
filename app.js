//app入口文件

const dotenv = require('dotenv');
dotenv.config();

const Hapi = require('hapi');
const Config = require('./config');
const RoutesHello = require('./routes/hello-world');

const server = new Hapi.Server();
//配置服务器启动host和端口
server.connection({
	host: Config.host,
	port: Config.port
});

const init = async () => {
	server.route([
		//创建一个hello接口
		...RoutesHello
	]);
	//启动服务
	await server.start();
	console.log(process.env.PORT);
	console.log(`Server running at: ${server.info.uri}`);
};

init();

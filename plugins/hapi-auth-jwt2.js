//通过 hapi-auth-jwt2 插件，来赋予系统中的部分接口，需要用户登录授权后才能访问的能力。
const config = require('../config');

const validate = (decoded, request, callback) => {
	let error;
	//decoded为JWT payload被解码后的数据
	const { userId } = decoded;
	if (!userId) {
		return callback(error, false, userId);
	}
	const credentials = { userId };
	// 在路由接口的 handler 通过 request.auth.credentials 获取 jwt decoded 的值
	return callback(error, true, credentials);
};

module.exports = (server) => {
	server.auth.strategy('jwt', 'jwt', {
		key: config.jwtSecret,
		validateFunc: validate
	});
	server.auth.default('jwt');
};

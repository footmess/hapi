//项目配置信息
const { env } = process;
module.exports = {
	host: env.HOST,
	port: env.PORT,
	jwtSecret: env.JWT_SECRET,
	wxAppid: env.AppId,
	wxMchid: env.Mchid,
	wxPayApiKey: env.PayApiKey,
	wxSecret: env.AppSecret
};

//数据库连接配置
if (process.env.NODE_ENV === 'production') {
	console.log('prod');
} else {
	console.log('dev');
}

const { env } = process;

module.exports = {
	development: {
		username: env.MYSQL_USERNAME,
		password: env.MYSQL_PASSWORD,
		database: env.MYSQL_DB_NAME,
		host: env.MYSQL_HOST,
		port: env.MYSQL_PORT,
		dialect: 'mysql',
		operatorsAliases: false
	},
	production: {
		username: env.MYSQL_USERNAME,
		password: env.MYSQL_PASSWORD,
		database: env.MYSQL_DB_NAME,
		host: env.MYSQL_HOST,
		port: env.MYSQL_PORT,
		dialect: 'mysql',
		operatorsAliases: false
	}
};

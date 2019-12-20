'use strict';

//连接数据库
//定义数据库表结构对应关系
//该模块会自动读取 config/config.js 中的数据库连接配置，并且动态加载未来在 models 目录中所增加的数据库表结构定义的模块，
//最终可以方便我们通过 models.tableName.operations 的形式来展开一系列的数据库表操作行为
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configs = require(__dirname + '/../config/config.js');
const db = {};

let sequelize;
const config = {
	...configs[env],
	define: {
		underscored: true
	}
};
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
	.readdirSync(__dirname)
	.filter((file) => {
		return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
	})
	.forEach((file) => {
		const model = sequelize['import'](path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

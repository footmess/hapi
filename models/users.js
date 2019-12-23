//用户表数据模型
module.exports = (sequelize, DataTypes) =>
	sequelize.define(
		'users',
		{
			//用户id，自增
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			//用户昵称
			nick_name: DataTypes.STRING,
			//用户头像
			avatar_url: DataTypes.STRING,
			//用户性别
			gender: DataTypes.INTEGER,
			//用户open_id
			open_id: DataTypes.STRING,
			//用户session_key
			session_key: DataTypes.STRING
		},
		{
			tableName: 'users'
		}
	);

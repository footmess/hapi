//订单表数据模型
module.exports = (sequelize, DataTypes) =>
	sequelize.define(
		'orders',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			payment_status: {
				type: Sequelize.ENUM('0', '1'),
				defaultValue: '0'
			}
		},
		{
			tableName: 'orders'
		}
	);

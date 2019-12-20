'use strict';
//数据库表结构初始化
//描述了如何进入新状态以及如何还原更改以恢复旧状态

module.exports = {
	//up 用于定义表结构正向改变的细节
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable('shops', {
			/*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			thumb_url: Sequelize.STRING,
			created_at: Sequelize.DATE,
			updated_at: Sequelize.DATE
		}),

	//down 则用于定义表结构的回退逻辑
	down: (queryInterface, Sequelize) => queryInterface.dropTable('shops')
	/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
};

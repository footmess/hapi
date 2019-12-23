'use strict';

module.exports = {
	//新建一张users表
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable('users', {
			/*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
			//用户id，自增
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			//用户昵称
			nick_name: Sequelize.STRING,
			//用户头像
			avatar_url: Sequelize.STRING,
			//用户性别
			gender: Sequelize.INTEGER,
			//用户open_id
			open_id: Sequelize.STRING,
			//用户session_key
			session_key: Sequelize.STRING,
			created_at: Sequelize.DATE,
			updated_at: Sequelize.DATE
		}),

	//删除users表
	down: (queryInterface, Sequelize) => queryInterface.dropTable('users')
	/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
};

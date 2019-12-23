'use strict';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable('order_goods', {
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
			order_id: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			goods_id: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			single_price: {
				type: Sequelize.FLOAT,
				allowNull: false
			},
			count: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			created_at: Sequelize.DATE,
			updated_at: Sequelize.DATE
		}),

	down: (queryInterface, Sequelize) => queryInterface.dropTable('order_goods')
	/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
};

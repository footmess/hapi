'use strict';

module.exports = {
	up: (queryInterface, Sequelize) =>
		Promise.all([ queryInterface.addColumn('goods', 'single_price', { type: Sequelize.FLOAT }) ]),
	/*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

	down: (queryInterface, Sequelize) => Promise.all([ queryInterface.removeColumn('goods', 'single_price') ])
	/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
};

'use strict';
//向表中初始化一些基础数据

const timestamps = {
	created_at: new Date(),
	updated_at: new Date()
};
module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.bulkInsert(
			'goods',
			[
				{
					id: 1,
					name: '商品1',
					shop_id: 1,
					thumb_url:
						'https://web-img.benq.com.cn/news/lcd/20191220/20191220_875a06bf429c464b9a863d22ce63f93e.jpg',
					...timestamps
				},
				{
					id: 2,
					name: '商品2',
					shop_id: 2,
					thumb_url:
						'https://web-img.benq.com.cn/news/lcd/20191220/20191220_875a06bf429c464b9a863d22ce63f93e.jpg',
					...timestamps
				},
				{
					id: 3,
					name: '商品3',
					shop_id: 3,
					thumb_url:
						'https://web-img.benq.com.cn/news/lcd/20191220/20191220_875a06bf429c464b9a863d22ce63f93e.jpg',
					...timestamps
				},
				{
					id: 4,
					name: '商品4',
					shop_id: 4,
					thumb_url:
						'https://web-img.benq.com.cn/news/lcd/20191220/20191220_875a06bf429c464b9a863d22ce63f93e.jpg',
					...timestamps
				}
			],
			{}
		),
	/*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

	down: (queryInterface, Sequelize) => {
		const { Op } = Sequelize;
		//删除 shop 表 id 为 1，2，3，4 的记录
		return queryInterface.bulkDelete('goods', { id: { [Op.in]: [ 1, 2, 3, 4 ] } }, {});
		/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
	}
};

'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rooms', {
      room_code: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      room_name: {
        type: Sequelize.STRING
      },
      room_admin_id: {
        type: Sequelize.STRING
      },
      room_avatar: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rooms');
  }
};
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('participants', {
      socket_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING
      },
      public_key: {
        type: Sequelize.STRING
      },
      room_code: {
        type: Sequelize.STRING
      },
      ip_address: {
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
    await queryInterface.dropTable('participants');
  }
};
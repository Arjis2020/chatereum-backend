'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class participants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  participants.init({
    socket_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    username: DataTypes.STRING,
    public_key: DataTypes.STRING,
    room_code: DataTypes.STRING,
    ip_address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'participants',
  });
  return participants;
};
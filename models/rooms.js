'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.participants, {foreignKey: 'room_code'})
    }
  }
  rooms.init({
    room_code: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    room_name: DataTypes.STRING,
    room_admin_id: DataTypes.STRING,
    room_avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'rooms',
  });
  return rooms;
};
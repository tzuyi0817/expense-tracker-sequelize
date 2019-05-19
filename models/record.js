'use strict';
module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define('Record', {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    date: DataTypes.STRING,
    amount: DataTypes.NUMBER
  }, {});
  Record.associate = function (models) {
    // associations can be defined here
    Record.belongsTo(models.User, { foreignKey: 'userID' })
  };
  return Record;
};
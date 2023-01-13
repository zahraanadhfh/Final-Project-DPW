"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user);
    }
  }
  transaction.init(
    {
      userId: DataTypes.INTEGER,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            args: true,
            msg: "Price must be an integer",
          },
        },
      },
      total: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: {
            args: true,
            msg: "Price must be an integer",
          },
        },
      },
      total_transaction: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: {
            args: true,
            msg: "Price must be an integer",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "transaction",
    }
  );
  return transaction;
};

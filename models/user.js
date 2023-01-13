"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.transaction);
    }
  }
  user.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name cannot be empty",
            args: true,
          },
          min: {
            msg: "Name must be higher than 5 characters",
            args: 4,
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: {
          msg: "Email cannot be null",
          args: true,
        },
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "Email is not valid",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password cannot be empty",
            args: true,
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "role cannot be empty",
            args: true,
          },
        },
      },
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};

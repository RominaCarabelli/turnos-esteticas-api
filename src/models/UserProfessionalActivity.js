const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserProfessionalActivity = sequelize.define(
  "UserProfessionalActivity",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    professionalActivityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customActivity: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "user_professional_activities",
    timestamps: false,
  }
);

module.exports = UserProfessionalActivity;
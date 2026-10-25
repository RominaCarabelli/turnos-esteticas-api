const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProfessionalActivity = sequelize.define(
  "ProfessionalActivity",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "professional_activities",
    timestamps: false,
  }
);

module.exports = ProfessionalActivity;
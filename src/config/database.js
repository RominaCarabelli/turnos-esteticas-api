require("dotenv").config();

const { Sequelize } = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging: false,
    timezone: "-03:00",
    ...(isProduction && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: true,
          ca: process.env.DB_SSL_CA,
        },
      },
    }),
  }
);

module.exports = sequelize;
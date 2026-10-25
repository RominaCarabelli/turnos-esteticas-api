const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(
  session.Store
);
const sequelize = require("./database");

const sessionStore = new SequelizeStore({
  db: sequelize,
});

module.exports = sessionStore;
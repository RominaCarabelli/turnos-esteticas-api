const sequelize = require("./database");
require("../models");

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Conexión a MySQL exitosa.");

    await sequelize.sync();
    console.log("Tablas creadas correctamente.");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

initDatabase();
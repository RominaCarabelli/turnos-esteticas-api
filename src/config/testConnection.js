const sequelize = require("./database");

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Conexión a MySQL exitosa.");
  } catch (error) {
    console.error("Error al conectar con MySQL:", error.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();
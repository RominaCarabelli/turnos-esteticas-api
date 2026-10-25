require("dotenv").config();

const app = require("./src/app");
const sequelize = require("./src/config/database");
const sessionStore = require("./src/config/sessionStore");
const { ProfessionalActivity } = require("./src/models");

const PORT = process.env.PORT || 3000;

const activities = [
  "Pestañas",
  "Uñas",
  "Peluquería",
  "Cejas",
  "Depilación",
  "Maquillaje",
  "Otra",
];

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Conexión a MySQL exitosa.");

    await sequelize.sync();
    console.log("Tablas de la aplicación listas.");

    for (const name of activities) {
      await ProfessionalActivity.findOrCreate({
        where: { name },
        defaults: { name },
      });
    }

    console.log("Actividades profesionales listas.");

    await sessionStore.sync();
    console.log("Almacenamiento de sesiones listo.");

    app.listen(PORT, () => {
      console.log(
        `API de Agenda de Turnos ejecutándose en el puerto ${PORT}.`
      );
    });
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error.message);
    process.exit(1);
  }
}

startServer();
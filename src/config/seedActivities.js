const sequelize = require("./database");
const { ProfessionalActivity } = require("../models");

const activities = [
  "Pestañas",
  "Uñas",
  "Peluquería",
  "Cejas",
  "Depilación",
  "Maquillaje",
  "Otra",
];

async function seedActivities() {
  try {
    await sequelize.authenticate();

    for (const name of activities) {
      await ProfessionalActivity.findOrCreate({
        where: { name },
        defaults: { name },
      });
    }

    console.log("Actividades profesionales cargadas correctamente.");
  } catch (error) {
    console.error("Error al cargar las actividades:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seedActivities();
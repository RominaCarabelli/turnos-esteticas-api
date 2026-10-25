const bcrypt = require("bcrypt");
const sequelize = require("../config/database");
const { User, ProfessionalActivity } = require("../models");

async function registerUser(userData) {
  const {
    name,
    email,
    password,
    workMode,
    salonName,
    activityIds,
    customActivity,
  } = userData;

  const normalizedEmail = email.trim().toLowerCase();

  if (!Array.isArray(activityIds) || activityIds.length === 0) {
    const error = new Error("Seleccioná al menos una actividad.");
    error.status = 400;
    throw error;
  }

  const uniqueActivityIds = [...new Set(activityIds)];

  const existingUser = await User.findOne({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    const error = new Error("El email ya está registrado.");
    error.status = 409;
    throw error;
  }

  if (workMode === "salon" && !salonName?.trim()) {
    const error = new Error("El nombre del salón es obligatorio.");
    error.status = 400;
    throw error;
  }

  const activities = await ProfessionalActivity.findAll({
    where: {
      id: uniqueActivityIds,
      isActive: true,
    },
  });

  if (activities.length !== uniqueActivityIds.length) {
    const error = new Error("Una o más actividades no son válidas.");
    error.status = 400;
    throw error;
  }

  const hasOtherActivity = activities.some(
    (activity) => activity.name === "Otra"
  );

  if (hasOtherActivity && !customActivity?.trim()) {
    const error = new Error(
      "Especificá la actividad cuando seleccionás Otra."
    );
    error.status = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return sequelize.transaction(async (transaction) => {
    const user = await User.create(
      {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        workMode,
        salonName: workMode === "salon" ? salonName.trim() : null,
      },
      { transaction }
    );

    await user.setActivities(uniqueActivityIds, {
      through: {
        customActivity: hasOtherActivity
          ? customActivity.trim()
          : null,
      },
      transaction,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      workMode: user.workMode,
      salonName: user.salonName,
    };
  });
}

async function loginUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    where: { email: normalizedEmail },
  });

  if (!user || !user.isActive) {
    const error = new Error("Email o contraseña incorrectos.");
    error.status = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    const error = new Error("Email o contraseña incorrectos.");
    error.status = 401;
    throw error;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    workMode: user.workMode,
    salonName: user.salonName,
  };
}

module.exports = { registerUser, loginUser };
const User = require("./User");
const Service = require("./Service");
const Appointment = require("./Appointment");
const ProfessionalActivity = require("./ProfessionalActivity");
const UserProfessionalActivity = require("./UserProfessionalActivity");

// Relaciones entre profesionales, servicios y turnos.
User.hasMany(Service, {
  foreignKey: "userId",
  as: "services",
});

Service.belongsTo(User, {
  foreignKey: "userId",
  as: "professional",
});

User.hasMany(Appointment, {
  foreignKey: "userId",
  as: "appointments",
});

Appointment.belongsTo(User, {
  foreignKey: "userId",
  as: "professional",
});

Service.hasMany(Appointment, {
  foreignKey: "serviceId",
  as: "appointments",
});

Appointment.belongsTo(Service, {
  foreignKey: "serviceId",
  as: "service",
});

// Relación entre profesionales y actividades.
User.belongsToMany(ProfessionalActivity, {
  through: {
    model: UserProfessionalActivity,
    unique:false,
  },
  foreignKey: "userId",
  otherKey: "professionalActivityId",
  as: "activities",
});

ProfessionalActivity.belongsToMany(User, {
  through: {
    model: UserProfessionalActivity,
    unique: false,
  },
  foreignKey: "professionalActivityId",
  otherKey: "userId",
  as: "professionals",
});

module.exports = {
  User,
  Service,
  Appointment,
  ProfessionalActivity,
  UserProfessionalActivity,
};
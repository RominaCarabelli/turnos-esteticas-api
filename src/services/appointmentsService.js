const { Op } = require("sequelize");
const {
  Appointment,
  Service,
} = require("../models");

async function getAllAppointments(userId) {
  return Appointment.findAll({
    where: { userId },
    order: [["startAt", "ASC"]],
  });
}

async function getAppointmentById(appointmentId, userId) {
  const appointment = await Appointment.findOne({
    where: {
      id: appointmentId,
      userId,
    },
  });

  if (!appointment) {
    const error = new Error("Turno no encontrado.");
    error.status = 404;
    throw error;
  }

  return appointment;
}

async function validateService(serviceId, userId) {
  if (serviceId === null || serviceId === undefined) {
    return null;
  }

  const service = await Service.findOne({
    where: {
      id: serviceId,
      userId,
      isActive: true,
    },
  });

  if (!service) {
    const error = new Error(
      "El servicio no existe, está inactivo o no te pertenece."
    );
    error.status = 400;
    throw error;
  }

  return service;
}

async function validateNoOverlap(
  userId,
  startAt,
  durationMinutes,
  excludedAppointmentId = null
) {
  const newStart = new Date(startAt);
  const newEnd = new Date(
    newStart.getTime() + durationMinutes * 60 * 1000
  );

  const where = {
    userId,
    status: {
      [Op.ne]: "cancelled",
    },
  };

  if (excludedAppointmentId !== null) {
    where.id = {
      [Op.ne]: excludedAppointmentId,
    };
  }

  const appointments = await Appointment.findAll({ where });

  const hasOverlap = appointments.some((appointment) => {
    const existingStart = new Date(appointment.startAt);
    const existingEnd = new Date(
      existingStart.getTime() +
        appointment.durationMinutes * 60 * 1000
    );

    return newStart < existingEnd && newEnd > existingStart;
  });

  if (hasOverlap) {
    const error = new Error(
      "El horario se superpone con otro turno existente."
    );
    error.status = 409;
    throw error;
  }
}

async function createAppointment(userId, appointmentData) {
  const {
    clientName,
    clientPhone,
    serviceId,
    serviceName,
    startAt,
    durationMinutes,
    depositPaid = false,
    comments = null,
  } = appointmentData;

  const service = await validateService(
    serviceId ?? null,
    userId
  );

  const resolvedServiceName = service
    ? service.name
    : serviceName?.trim();

  await validateNoOverlap(
    userId,
    startAt,
    durationMinutes
  );

  return Appointment.create({
    userId,
    clientName: clientName.trim(),
    clientPhone: clientPhone.trim(),
    serviceId: service ? service.id : null,
    serviceName: resolvedServiceName,
    startAt: new Date(startAt),
    durationMinutes,
    depositPaid,
    comments: comments?.trim() || null,
  });
}

async function updateAppointment(
  appointmentId,
  userId,
  appointmentData
) {
  const appointment = await getAppointmentById(
    appointmentId,
    userId
  );

  if (appointment.status === "cancelled") {
    const error = new Error(
      "No se puede modificar un turno cancelado."
    );
    error.status = 400;
    throw error;
  }

  const {
    clientName,
    clientPhone,
    serviceId,
    serviceName,
    startAt,
    durationMinutes,
    status,
    depositPaid = false,
    comments = null,
  } = appointmentData;

  const service = await validateService(
    serviceId ?? null,
    userId
  );

  const resolvedServiceName = service
    ? service.name
    : serviceName?.trim();

  if (status === "cancelled") {
    await appointment.update({ status });
    return appointment;
  }

  await validateNoOverlap(
    userId,
    startAt,
    durationMinutes,
    appointment.id
  );

  await appointment.update({
    clientName: clientName.trim(),
    clientPhone: clientPhone.trim(),
    serviceId: service ? service.id : null,
    serviceName: resolvedServiceName,
    startAt: new Date(startAt),
    durationMinutes,
    status,
    depositPaid,
    comments: comments?.trim() || null,
  });

  return appointment;
}

async function cancelAppointment(appointmentId, userId) {
  const appointment = await getAppointmentById(
    appointmentId,
    userId
  );

  await appointment.update({
    status: "cancelled",
  });

  return appointment;
}

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
};
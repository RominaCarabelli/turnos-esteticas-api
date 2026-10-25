const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
} = require("../services/appointmentsService");

async function getAppointments(req, res, next) {
  try {
    const appointments = await getAllAppointments(
      req.session.userId
    );

    return res.status(200).json({ appointments });
  } catch (error) {
    next(error);
  }
}

async function getAppointment(req, res, next) {
  try {
    const appointment = await getAppointmentById(
      Number(req.params.id),
      req.session.userId
    );

    return res.status(200).json({ appointment });
  } catch (error) {
    next(error);
  }
}

async function createNewAppointment(req, res, next) {
  try {
    const appointment = await createAppointment(
      req.session.userId,
      req.body
    );

    return res.status(201).json({
      message: "Turno creado correctamente.",
      appointment,
    });
  } catch (error) {
    next(error);
  }
}

async function updateExistingAppointment(req, res, next) {
  try {
    const appointment = await updateAppointment(
      Number(req.params.id),
      req.session.userId,
      req.body
    );

    return res.status(200).json({
      message: "Turno actualizado correctamente.",
      appointment,
    });
  } catch (error) {
    next(error);
  }
}

async function cancelExistingAppointment(req, res, next) {
  try {
    const appointment = await cancelAppointment(
      Number(req.params.id),
      req.session.userId
    );

    return res.status(200).json({
      message: "Turno cancelado correctamente.",
      appointment,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAppointments,
  getAppointment,
  createNewAppointment,
  updateExistingAppointment,
  cancelExistingAppointment,
};
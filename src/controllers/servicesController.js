const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deactivateService,
} = require("../services/servicesService");

async function getServices(req, res, next) {
  try {
    const services = await getAllServices(req.session.userId);

    return res.status(200).json({ services });
  } catch (error) {
    next(error);
  }
}

async function getService(req, res, next) {
  try {
    const service = await getServiceById(
      Number(req.params.id),
      req.session.userId
    );

    return res.status(200).json({ service });
  } catch (error) {
    next(error);
  }
}

async function createNewService(req, res, next) {
  try {
    const service = await createService(req.session.userId, req.body);

    return res.status(201).json({
      message: "Servicio creado correctamente.",
      service,
    });
  } catch (error) {
    next(error);
  }
}

async function updateExistingService(req, res, next) {
  try {
    const service = await updateService(
      Number(req.params.id),
      req.session.userId,
      req.body
    );

    return res.status(200).json({
      message: "Servicio actualizado correctamente.",
      service,
    });
  } catch (error) {
    next(error);
  }
}

async function deactivateExistingService(req, res, next) {
  try {
    const service = await deactivateService(
      Number(req.params.id),
      req.session.userId
    );

    return res.status(200).json({
      message: "Servicio desactivado correctamente.",
      service,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getServices,
  getService,
  createNewService,
  updateExistingService,
  deactivateExistingService,
};
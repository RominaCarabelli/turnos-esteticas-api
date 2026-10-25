const { Op } = require("sequelize");
const { Service } = require("../models");

async function getAllServices(userId) {
  return Service.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
}

async function getServiceById(serviceId, userId) {
  const service = await Service.findOne({
    where: {
      id: serviceId,
      userId,
    },
  });

  if (!service) {
    const error = new Error("Servicio no encontrado.");
    error.status = 404;
    throw error;
  }

  return service;
}

async function validateUniqueActiveService(userId, name, excludedServiceId = null) {
  const normalizedName = name.trim();

  const where = {
    userId,
    isActive: true,
    name: {
      [Op.like]: normalizedName,
    },
  };

  if (excludedServiceId !== null) {
    where.id = { [Op.ne]: excludedServiceId };
  }

  const existingService = await Service.findOne({ where });

  if (
    existingService &&
    existingService.name.toLowerCase() === normalizedName.toLowerCase()
  ) {
    const error = new Error(
      "Ya tenés un servicio activo con ese nombre."
    );
    error.status = 409;
    throw error;
  }
}

async function createService(userId, serviceData) {
  const { name, description } = serviceData;

  await validateUniqueActiveService(userId, name);

  return Service.create({
    userId,
    name: name.trim(),
    description: description?.trim() || null,
  });
}

async function updateService(serviceId, userId, serviceData) {
  const service = await getServiceById(serviceId, userId);
  const { name, description } = serviceData;

  if (service.isActive) {
    await validateUniqueActiveService(userId, name, service.id);
  }

  await service.update({
    name: name.trim(),
    description: description?.trim() || null,
  });

  return service;
}

async function deactivateService(serviceId, userId) {
  const service = await getServiceById(serviceId, userId);

  await service.update({
    isActive: false,
  });

  return service;
}

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deactivateService,
};
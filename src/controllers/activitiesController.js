const { ProfessionalActivity } = require("../models");

async function getActivities(req, res, next) {
  try {
    const activities = await ProfessionalActivity.findAll({
      where: { isActive: true },
      attributes: ["id", "name"],
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ activities });
  } catch (error) {
    next(error);
  }
}

module.exports = { getActivities };
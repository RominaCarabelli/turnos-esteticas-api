const { User } = require("../models");

async function requireAuth(req, res, next) {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        message: "Debés iniciar sesión para acceder a este recurso.",
      });
    }

    const user = await User.findByPk(req.session.userId);

    if (!user || !user.isActive) {
      req.session.destroy(() => {});

      return res.status(401).json({
        message: "La sesión no es válida.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = requireAuth;
const {
  registerUser,
  loginUser,
} = require("../services/authService");

const { User } = require("../models");

async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);

    req.session.userId = user.id;

    req.session.save((error) => {
      if (error) {
        return next(error);
      }

      return res.status(201).json({
        message: "Profesional registrado correctamente.",
        user,
      });
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    req.session.regenerate((error) => {
      if (error) {
        return next(error);
      }

      req.session.userId = user.id;

      req.session.save((error) => {
        if (error) {
          return next(error);
        }

        return res.status(200).json({
          message: "Inicio de sesión exitoso.",
          user,
        });
      });
    });
  } catch (error) {
    next(error);
  }
}

function logout(req, res, next) {
  if (!req.session) {
    return res.status(200).json({
      message: "Sesión cerrada correctamente.",
    });
  }

  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Sesión cerrada correctamente.",
    });
  });
}

async function me(req, res, next) {
  try {
    const user = await User.findByPk(req.session.userId, {
      attributes: [
        "id",
        "name",
        "email",
        "workMode",
        "salonName",
        "isActive",
      ],
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: "La sesión no es válida.",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  me,
};
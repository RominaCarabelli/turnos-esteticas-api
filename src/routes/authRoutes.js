const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");

const {
  register,
  login,
  logout,
  me,
} = require("../controllers/authController");

const {
  validateRegister,
  handleValidationErrors,
} = require("../middlewares/authValidator");

const requireAuth = require("../middlewares/requireAuth");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: {
    message:
      "Demasiados intentos de inicio de sesión. Intentá nuevamente en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    message:
      "Demasiados intentos de registro. Intentá nuevamente en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio.")
    .isEmail()
    .withMessage("Ingresá un email válido.")
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("La contraseña es obligatoria.")
    .notEmpty()
    .withMessage("La contraseña es obligatoria."),
];

router.post(
  "/register",
  registerLimiter,
  validateRegister,
  handleValidationErrors,
  register
);

router.post(
  "/login",
  loginLimiter,
  validateLogin,
  handleValidationErrors,
  login
);

router.post("/logout", logout);

router.get("/me", requireAuth, me);

module.exports = router;
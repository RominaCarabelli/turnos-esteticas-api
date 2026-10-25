const { body, validationResult } = require("express-validator");

const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre completo es obligatorio.")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede superar los 100 caracteres."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio.")
    .isEmail()
    .withMessage("Ingresá un email válido.")
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("La contraseña debe ser un texto.")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres."),

  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Las contraseñas no coinciden."),

  body("workMode")
    .isIn(["salon", "independent"])
    .withMessage("Seleccioná una modalidad de trabajo válida."),

  body("salonName")
    .if(body("workMode").equals("salon"))
    .trim()
    .notEmpty()
    .withMessage("El nombre del salón es obligatorio.")
    .isLength({ max: 150 })
    .withMessage("El nombre del salón no puede superar los 150 caracteres."),

  body("activityIds")
    .isArray({ min: 1 })
    .withMessage("Seleccioná al menos una actividad."),

  body("activityIds.*")
    .isInt({ min: 1 })
    .withMessage("Cada actividad debe tener un identificador válido.")
    .toInt(),

  body("customActivity")
    .optional({ values: "null" })
    .isString()
    .withMessage("La actividad personalizada debe ser un texto.")
    .trim()
    .isLength({ max: 100 })
    .withMessage("La actividad personalizada no puede superar los 100 caracteres."),
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Hay errores en los datos enviados.",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
}

module.exports = {
  validateRegister,
  handleValidationErrors,
};
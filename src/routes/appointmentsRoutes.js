const express = require("express");
const { body, param } = require("express-validator");

const {
  getAppointments,
  getAppointment,
  createNewAppointment,
  updateExistingAppointment,
  cancelExistingAppointment,
} = require("../controllers/appointmentsController");

const requireAuth = require("../middlewares/requireAuth");
const {
  handleValidationErrors,
} = require("../middlewares/authValidator");

const router = express.Router();

const validateAppointmentId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID del turno debe ser un entero positivo.")
    .toInt(),
];

const validateAppointment = [
  body("clientName")
    .isString()
    .withMessage("El nombre del cliente debe ser un texto.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("El nombre no puede superar los 100 caracteres."),

  body("clientPhone")
    .isString()
    .withMessage("El teléfono del cliente debe ser un texto.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El teléfono del cliente es obligatorio.")
    .bail()
    .isLength({ max: 30 })
    .withMessage("El teléfono no puede superar los 30 caracteres."),

  body("serviceId")
    .optional({ values: "null" })
    .isInt({ min: 1 })
    .withMessage("El ID del servicio debe ser un entero positivo.")
    .toInt(),

  body("serviceName")
    .if((value, { req }) =>
      req.body.serviceId === undefined ||
      req.body.serviceId === null
    )
    .isString()
    .withMessage("Indicá el nombre del servicio.")
    .trim()
    .notEmpty()
    .withMessage("Indicá el nombre del servicio.")
    .isLength({ max: 100 })
    .withMessage("El nombre del servicio no puede superar los 100 caracteres."),

  body("startAt")
    .isISO8601({
      strict: true,
      strictSeparator: true,
    })
    .withMessage("Ingresá una fecha y hora válidas.")
    .bail()
    .custom((value) => {
      if (!/(Z|[+-]\d{2}:\d{2})$/.test(value)) {
        throw new Error(
          "La fecha debe incluir su zona horaria."
        );
      }

      if (Number.isNaN(Date.parse(value))) {
        throw new Error("Ingresá una fecha y hora válidas.");
      }

      return true;
    })
    .toDate(),

  body("durationMinutes")
    .isInt({ min: 1, max: 1440 })
    .withMessage("La duración debe ser un entero entre 1 y 1440 minutos.")
    .toInt(),

  body("depositPaid")
    .optional()
    .isBoolean()
    .withMessage("La seña debe indicar si está pagada o no.")
    .toBoolean(),

  body("comments")
    .optional({ values: "null" })
    .isString()
    .withMessage("Los comentarios deben ser un texto.")
    .bail()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Los comentarios no pueden superar los 2000 caracteres."),
];

const validateAppointmentUpdate = [
  ...validateAppointment,
  body("status")
    .isIn(["pending", "confirmed", "completed", "cancelled"])
    .withMessage("El estado del turno no es válido."),
];

router.use(requireAuth);

router.get("/", getAppointments);

router.get(
  "/:id",
  validateAppointmentId,
  handleValidationErrors,
  getAppointment
);

router.post(
  "/",
  validateAppointment,
  handleValidationErrors,
  createNewAppointment
);

router.put(
  "/:id",
  validateAppointmentId,
  validateAppointmentUpdate,
  handleValidationErrors,
  updateExistingAppointment
);

router.delete(
  "/:id",
  validateAppointmentId,
  handleValidationErrors,
  cancelExistingAppointment
);

module.exports = router;
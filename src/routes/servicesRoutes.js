const express = require("express");
const { body, param } = require("express-validator");

const {
  getServices,
  getService,
  createNewService,
  updateExistingService,
  deactivateExistingService,
} = require("../controllers/servicesController");

const requireAuth = require("../middlewares/requireAuth");
const { handleValidationErrors } = require("../middlewares/authValidator");

const router = express.Router();

const validateServiceId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID del servicio debe ser un número entero positivo.")
    .toInt(),
];

const validateService = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre del servicio es obligatorio.")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede superar los 100 caracteres."),

  body("description")
    .optional({ values: "null" })
    .isString()
    .withMessage("La descripción debe ser un texto.")
    .trim()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede superar los 500 caracteres."),
];

router.use(requireAuth);

router.get("/", getServices);

router.get("/:id", validateServiceId, handleValidationErrors, getService);

router.post("/", validateService, handleValidationErrors, createNewService);

router.put(
  "/:id",
  validateServiceId,
  validateService,
  handleValidationErrors,
  updateExistingService
);

router.delete(
  "/:id",
  validateServiceId,
  handleValidationErrors,
  deactivateExistingService
);

module.exports = router;
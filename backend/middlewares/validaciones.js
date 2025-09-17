// middlewares/validarProducto.js
import { body, param, validationResult } from "express-validator";

export const categoriasPermitidas = ['Polos', 'Pantalones', 'Zapatillas'];

export const validarProductoRules = [
  body("nombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isString().withMessage("El nombre debe ser texto"),
  body("descripcion")
    .trim()
    .notEmpty().withMessage("La descripción es obligatoria"),
  body("precio")
    .notEmpty().withMessage("El precio es obligatorio")
    .isFloat({ gt: 0 }).withMessage("El precio debe ser un número mayor que 0"),
  body("stock")
    .notEmpty().withMessage("El stock es obligatorio")
    .isInt({ min: 0 }).withMessage("El stock debe ser un entero mayor o igual a 0"),
  body("categoria")
    .notEmpty().withMessage("La categoría es obligatoria")
    .isIn(categoriasPermitidas).withMessage(`La categoría debe ser una de: ${categoriasPermitidas.join(", ")}`)
];

// Regla útil para validar params id en rutas que reciben :id
export const validarIdParam = [
  param("id").isMongoId().withMessage("ID inválido, debe ser un ObjectId correcto)")
];

// Middleware que recoge los errores y responde
export const validarResultado = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Normalizo la salida para el frontend
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ field: err.param, msg: err.msg }))
    });
  }
  next();
};

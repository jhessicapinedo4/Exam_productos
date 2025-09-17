import express from "express";
import productoController from "../controllers/productoController.js";
import { validarProductoRules, validarResultado, validarIdParam } from "../middlewares/validaciones.js";

const router = express.Router();

// validar campos para crear un producto
router.post("/", validarProductoRules, validarResultado, productoController.crearProducto);

// Listar todos
router.get("/", productoController.obtenerProductos);

// valida formato del id
router.get("/:id", validarIdParam, validarResultado, productoController.obtenerProductoPorId);

// Actualizar
import { body } from "express-validator";
const actualizarRules = [
  body("nombre").optional().trim().isString().withMessage("El nombre debe ser texto"),
  body("descripcion").optional().trim(),
  body("precio").optional().isFloat({ gt: 0 }).withMessage("El precio debe ser mayor que 0"),
  body("stock").optional().isInt({ min: 0 }).withMessage("El stock debe ser entero >= 0"),
  body("categoria").optional().isIn(['Polos', 'Pantalones', 'Zapatillas']).withMessage("Categoría inválida")


];

router.put("/:id", validarIdParam, actualizarRules, validarResultado, productoController.actualizarProducto);

// Eliminar (valida formato del id)
router.delete("/:id", validarIdParam, validarResultado, productoController.eliminarProducto);

export default router;
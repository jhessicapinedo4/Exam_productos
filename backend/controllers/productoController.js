import { Productos } from "../models/Producto.js";

const productoController = {
  // Crear producto
  crearProducto: async (req, res) => {
    try {
      const productoNuevo = new Productos(req.body);
      const result = await productoNuevo.save();
      res.status(201).json({
        success: true,
        message: "El producto se ha creado correctamente",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error al crear el producto",
        error: error.message,
      });
    }
  },

  // Listar todos los productos
  obtenerProductos: async (req, res) => {
    try {
      const result = await Productos.find();
      res.status(200).json({
        success: true,
        message: "Productos obtenidos correctamente",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener los productos",
        error: error.message,
      });
    }
  },

  // Obtener producto por ID
  obtenerProductoPorId: async (req, res) => {
    try {
      const result = await Productos.findById(req.params.id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
      }
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error al obtener el producto",
        error: error.message,
      });
    }
  },

  // Actualizar producto
  actualizarProducto: async (req, res) => {
    try {
      const result = await Productos.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
      }
      res.status(200).json({
        success: true,
        message: "Producto actualizado correctamente",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error al actualizar el producto",
        error: error.message,
      });
    }
  },

  // Eliminar producto
  eliminarProducto: async (req, res) => {
    try {
      const result = await Productos.findByIdAndDelete(req.params.id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
      }
      res.status(200).json({
        success: true,
        message: "Producto eliminado correctamente",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error al eliminar el producto",
        error: error.message,
      });
    }
  },
};

export default productoController;

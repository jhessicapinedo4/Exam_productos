import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import conectionDB from './config/db.js';  
import productoRoutes from './routes/productoRoutes.js';

dotenv.config();
const app = express();

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos
conectionDB();

app.use("/api/productos", productoRoutes);

// FRONENT usando módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Ruta principal para el index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Manejar rutas no encontradas (404)

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "../frontend/404.html"));
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

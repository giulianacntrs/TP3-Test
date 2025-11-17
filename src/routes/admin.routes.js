const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const authAdmin = require("../middleware/authAdmin");  
// --- PREGUNTAS ---
router.post("/preguntas", authAdmin, adminController.crearPregunta);
router.get("/preguntas", authAdmin, adminController.obtenerPreguntas);
router.put("/preguntas/:id", authAdmin, adminController.actualizarPregunta);
router.delete("/preguntas/:id", authAdmin, adminController.eliminarPregunta);

// --- RESPUESTAS ---
router.get("/respuestas", authAdmin, adminController.obtenerRespuestas);

// --- USUARIOS ---
router.get("/usuarios", authAdmin, adminController.obtenerUsuarios);
router.delete("/usuarios/:id", authAdmin, adminController.eliminarUsuario);


module.exports = router;

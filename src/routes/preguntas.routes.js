const express = require("express");
const router = express.Router();
const Preguntas = require("../models/adminPreguntas"); 

router.get("/", async (req, res) => {
  try {
    const preguntas = await Preguntas.obtenerTodas(); 
    res.json(preguntas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener preguntas" });
  }
});

module.exports = router;

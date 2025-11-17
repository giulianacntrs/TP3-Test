const Preguntas = require("../models/preguntas");

const preguntasController = {

  obtenerTodas: async (req, res) => {
    try {
      const preguntas = await Preguntas.obtenerTodas();
      res.json(preguntas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener preguntas" });
    }
  },

  crearPregunta: async (req, res) => {
    try {
      const { texto_pregunta, tipo, opciones } = req.body;

      if (!texto_pregunta || !tipo || !opciones) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
      }

      const opcionesStr = JSON.stringify(opciones);

      const insertQuery = `
        INSERT INTO preguntas (texto_pregunta, tipo, opciones)
        VALUES (?, ?, ?)
      `;

      const db = require("../db");
      const [result] = await db.query(insertQuery, [texto_pregunta, tipo, opcionesStr]);

      res.json({ message: "Pregunta creada", id_pregunta: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear pregunta" });
    }
  }

};

module.exports = preguntasController;

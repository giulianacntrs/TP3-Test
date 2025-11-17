const Respuestas = require('../models/adminPreguntas');

const respuestasController = {

  crearRespuesta: async (req, res) => {
    try {
      const { id_usuario, session_id, id_pregunta, valor } = req.body;

      if (!id_pregunta || !valor) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
      }

      const id_respuesta = await Respuestas.crear({ id_usuario, session_id, id_pregunta, valor });
      res.json({ message: "Respuesta guardada", id_respuesta });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al guardar la respuesta" });
    }
  },

  obtenerRespuestasUsuario: async (req, res) => {
    try {
      const { id_usuario } = req.params;
      const respuestas = await Respuestas.obtenerPorUsuario(id_usuario);
      res.json(respuestas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener respuestas" });
    }
  },

  // Obtener respuestas de una session temporal
  obtenerRespuestasSession: async (req, res) => {
    try {
      const { session_id } = req.params;
      const respuestas = await Respuestas.obtenerPorSession(session_id);
      res.json(respuestas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener respuestas" });
    }
  },

  // Asociar respuestas temporales al usuario
  asociarRespuestas: async (req, res) => {
    try {
      const { session_id, id_usuario } = req.body;
      await Respuestas.asociarSessionAUsuario(session_id, id_usuario);
      res.json({ message: "Respuestas asociadas al usuario" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al asociar respuestas" });
    }
  }

};

module.exports = respuestasController;

const  TestPreguntas  = require("../models/adminPreguntas"); 
const  TestRespuestas  = require("../models/adminRespuestas");


// Iniciar sesión de test
exports.iniciar = async (req, res) => {
  const session_id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  res.json({ session_id });
};

// Guardar respuesta
exports.guardarRespuesta = async (req, res) => {
  const { session_id, pregunta_id, respuesta } = req.body;

  if (!session_id || !pregunta_id)
    return res.status(400).json({ message: "Datos incompletos" });

  await TestRespuestas.guardarRespuestaSession({ session_id, pregunta_id, respuesta });
  res.json({ message: "Respuesta guardada" });
};

// Obtener preguntas
exports.obtenerPreguntas = async (req, res) => {
  try {
    const preguntas = await TestPreguntas.obtenerTodas(); // <-- usa el modelo
    const preguntasConOpciones = preguntas.map(p => ({
      ...p,
      opciones: p.opciones ? JSON.parse(p.opciones) : []
    }));
    res.json(preguntasConOpciones);
  } catch (err) {
    console.error("Error al obtener preguntas:", err);
    res.status(500).json({ message: "Error al obtener preguntas" });
  }
};


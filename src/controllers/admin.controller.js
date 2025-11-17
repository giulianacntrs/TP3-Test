const AdminPreguntas = require("../models/adminPreguntas");
console.log("AdminPreguntas al inicio:", AdminPreguntas);
AdminPreguntas.obtenerTodas().then(res => console.log(res)).catch(console.error);

const AdminRespuestas = require("../models/adminRespuestas");
const AdminUsuarios = require("../models/adminUsuarios");
console.log("AdminPreguntas:", AdminPreguntas);

async function crearPregunta(req, res) {
  try {
    const { texto_pregunta, tipo, opciones } = req.body;

    if (!texto_pregunta) {
      return res.status(400).json({ message: "El texto de la pregunta es obligatorio" });
    }

    const nuevaPregunta = await AdminPreguntas.crear(texto_pregunta, tipo, opciones);

    return res.status(201).json({
      message: "Pregunta creada correctamente",
      pregunta: nuevaPregunta
    });

  } catch (error) {
    console.error("Error en crearPregunta:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

/* const obtenerPreguntas = async (req, res) => {
  try {
    const preguntas = await AdminPreguntas.obtenerTodas();
    res.json(preguntas);
  } catch (err) {
    console.error("Error al obtener preguntas:", err);
    res.status(500).json({ message: "Error al obtener preguntas" });
  }
}; */

async function obtenerPreguntas(req, res) {
  try {
    // ----------------------
    // Depuración
    console.log("Llamando a AdminPreguntas.obtenerTodas()");
    const preguntas = await AdminPreguntas.obtenerTodas();
    console.log("Preguntas obtenidas:", preguntas);
    // ----------------------

    res.json(preguntas);
  } catch (error) {
    console.error("Error en obtenerTodas():", error); // imprime el error real
    res.status(500).json({ message: "Error al obtener preguntas" });
  }
}

const actualizarPregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto_pregunta, tipo, opciones } = req.body;

    if (!texto_pregunta || !tipo) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const existePregunta = await AdminPreguntas.buscarPorTexto(texto_pregunta);

    if (existePregunta && existePregunta.id !== Number(id)) {
      return res.status(400).json({
        message: "Ya existe otra pregunta con ese texto"
      });
    }

    await AdminPreguntas.actualizar(id, texto_pregunta, tipo, opciones);

    res.json({ message: "Pregunta actualizada" });
  } catch (err) {
    console.error("Error al actualizar pregunta:", err);
    res.status(500).json({ message: "Error al actualizar la pregunta" });
  }
};


const eliminarPregunta = async (req, res) => {
  try {
    await AdminPreguntas.eliminar(req.params.id);
    res.json({ message: "Pregunta eliminada" });
  } catch (err) {
    console.error("Error al eliminar pregunta:", err);
    res.status(500).json({ message: "Error al eliminar la pregunta" });
  }
};

const obtenerRespuestas = async (req, res) => {
  try {
    const respuestas = await AdminRespuestas.obtenerTodas();
    res.json(respuestas);
  } catch (err) {
    console.error("Error al obtener respuestas:", err);
    res.status(500).json({ message: "Error al obtener respuestas" });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await AdminUsuarios.obtenerTodos();
    res.json(usuarios);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    await AdminUsuarios.eliminar(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

module.exports = {
  crearPregunta,
  obtenerPreguntas,
  actualizarPregunta,
  eliminarPregunta,
  obtenerRespuestas,
  obtenerUsuarios,
  eliminarUsuario
};

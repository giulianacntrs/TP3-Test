require("dotenv").config();
const pool = require("./mysql");


const AdminPreguntas = {

  // ================================================================
  // CREAR PREGUNTA
  // ================================================================
  async crear(texto_pregunta, tipo, opciones) {
    try {
      const [result] = await pool.query(
        `INSERT INTO preguntas (texto_pregunta, tipo, opciones)
         VALUES (?, ?, ?)`,
        [
          texto_pregunta,
          tipo,
          opciones ? JSON.stringify(opciones) : null
        ]
      );
      return result.insertId;
    } catch (err) {
      console.error("❌ Error al insertar pregunta:", err);
      throw err;
    }
  },

  // ================================================================
  // OBTENER TODAS (sin orden)
  // ================================================================
  async obtenerTodas() {
    const [rows] = await pool.query(`SELECT * FROM preguntas`);
    return rows;
  },

  // ================================================================
  // 🔥 OBTENER TODAS ORDENADAS (para el TEST)
  // ================================================================
  async obtenerTodasOrdenadas() {
    const [rows] = await pool.query(`
      SELECT *
      FROM preguntas
      ORDER BY id_pregunta ASC
    `);

    // Convertir opciones de JSON string → array para evitar errores en el front
    return rows.map(p => ({
      ...p,
      opciones: p.opciones ? JSON.parse(p.opciones) : null
    }));
  },

  // ================================================================
  // OBTENER UNA POR ID
  // ================================================================
  async obtenerPorId(id_pregunta) {
    const [rows] = await pool.query(
      `SELECT * FROM preguntas WHERE id_pregunta = ?`,
      [id_pregunta]
    );

    const p = rows[0];
    if (!p) return null;

    return {
      ...p,
      opciones: p.opciones ? JSON.parse(p.opciones) : null
    };
  },

  // ================================================================
  // ACTUALIZAR PREGUNTA
  // ================================================================
  async actualizar(id_pregunta, texto_pregunta, tipo, opciones) {
    await pool.query(
      `UPDATE preguntas
         SET texto_pregunta = ?, tipo = ?, opciones = ?
         WHERE id_pregunta = ?`,
      [
        texto_pregunta,
        tipo,
        opciones ? JSON.stringify(opciones) : null,
        id_pregunta
      ]
    );
  },

  // ================================================================
  // ELIMINAR
  // ================================================================
  async eliminar(id_pregunta) {
    await pool.query(
      `DELETE FROM preguntas WHERE id_pregunta = ?`,
      [id_pregunta]
    );
  },

  // ================================================================
  // VERIFICAR SI YA EXISTE UNA PREGUNTA (para evitar duplicados)
  // ================================================================
  async buscarPorTexto(texto) {
    const [rows] = await pool.query(
      `SELECT * FROM preguntas WHERE texto_pregunta = ? LIMIT 1`,
      [texto]
    );
    return rows[0] || null;
  },
};


module.exports = AdminPreguntas;


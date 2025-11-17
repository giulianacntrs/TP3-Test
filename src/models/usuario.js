const pool = require("./mysql");

const Usuario = {
  async crear({ nombre, email, contrasena}) {
    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, email, contrasena)
       VALUES (?, ?, ?)`,
      [nombre, email, contrasena]
    );

    return result.insertId;
  },

  async obtenerPorEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
      [email]
    );
    return rows[0];
  }
};

module.exports = Usuario;

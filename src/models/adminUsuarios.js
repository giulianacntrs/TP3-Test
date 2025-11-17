const pool = require("./mysql");

const AdminUsuarios = {
  async obtenerTodos() {
    const [rows] = await pool.query(`
      SELECT id_usuario, nombre, email, rol
      FROM usuarios
    `);
    return rows;
  },

  async eliminar(id_usuario) {
    await db.query(`DELETE FROM usuarios WHERE id_usuario = ?`, [id_usuario]);
  }
};

module.exports = AdminUsuarios;

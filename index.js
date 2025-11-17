const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mi_base"
});

















db.connect((err) => {
  if (err) {
    console.log("Error conectando a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL");
});

// ✅ Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

// ✅ Ejemplo: obtener datos
app.get("/usuarios", (req, res) => {
  const sql = "SELECT * FROM usuarios";
  db.query(sql, (err, result) => {
    if (err) return res.json({ error: err });
    res.json(result);
  });
});

// ✅ Server
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

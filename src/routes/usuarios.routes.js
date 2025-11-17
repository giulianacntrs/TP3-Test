const express = require("express");
const {
  registrarUsuario,
  loginUsuario,
  checkEmail
} = require("../controllers/usuarios.controller");

const router = express.Router();

// Registro
router.post("/registro", registrarUsuario);

// Login
router.post("/login", loginUsuario);

// Verificar si el email ya existe
router.get("/check-email", checkEmail);

module.exports = router;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

const registrarUsuario = async (req, res) => {
  const { nombre, email, contrasena, rol } = req.body;
  console.log("DATOS RECIBIDOS:", req.body);

  try {
    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    const existente = await Usuario.obtenerPorEmail(email);
    if (existente) {
      return res.status(409).json({ message: "El correo ya está registrado." });
    }

    const contrasenaHasheada = await bcrypt.hash(contrasena, SALT_ROUNDS);

    const id = await Usuario.crear({
      nombre,
      email,
      contrasena: contrasenaHasheada,
      rol,
    });

    return res.status(201).json({
      message: "Usuario registrado con éxito",
      userId: id,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({ message: "Error en el servidor." });
  }
};

const loginUsuario = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    if (!email || !contrasena) {
      return res.status(400).json({ message: "Datos incompletos." });
    }

    const usuario = await Usuario.obtenerPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!coincide) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol, 
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({
      message: "Login exitoso",
      token,
      rol: usuario.rol, 
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error en el servidor." });
  }
};

const checkEmail = async (req, res) => {
  try {
    const { email } = req.query;

    const existe = await Usuario.obtenerPorEmail(email);

    return res.json({ enUso: !!existe });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error verificando email" });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  checkEmail,
};

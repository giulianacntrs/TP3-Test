const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token no encontrado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.rol !== "admin") {
      return res.status(403).json({ message: "Acceso denegado: solo admin" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    console.error("Error jwt.verify:", err);
    return res.status(401).json({ message: "Token inválido" });
  }
};

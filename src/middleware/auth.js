const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;  // ← muy importante
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido" });
  }
};

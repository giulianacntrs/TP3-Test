require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const usuariosRoutes = require("./src/routes/usuarios.routes");
const adminRoutes = require("./src/routes/admin.routes");
const preguntasRoutes = require("./src/routes/preguntas.routes");
const respuestasRoutes = require("./src/routes/respuestas.routes");
const testRoutes = require("./src/routes/test.routes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/admin", adminRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/respuestas", respuestasRoutes);
app.use("/preguntas", preguntasRoutes);
app.use("/test", testRoutes);




app.use(express.static(path.join(__dirname, "src/public")));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/public/components/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado en puerto ${PORT}`);
});

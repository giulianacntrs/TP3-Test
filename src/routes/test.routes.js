const express = require("express");
const router = express.Router();

const TestController = require("../controllers/test.controller");

router.get("/iniciar", TestController.iniciar);

router.get("/preguntas", TestController.obtenerPreguntas);
router.get("/preguntas", TestController.obtenerPreguntas); // ← ESTA ES LA QUE DEBE FUNCIONAR

router.post("/respuesta", TestController.guardarRespuesta);

module.exports = router;

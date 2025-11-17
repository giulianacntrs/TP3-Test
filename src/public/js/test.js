console.log("🟢 test.js cargado");

let preguntas = [];
let indice = 0;
let sessionId = localStorage.getItem("session_id");
const respuestas = JSON.parse(localStorage.getItem("respuestas")) || {};

const textoPregunta = document.getElementById("texto-pregunta");
const opcionesDiv = document.getElementById("opciones");
const progreso = document.getElementById("progreso");

let token = localStorage.getItem("token");

// ===============================
// Iniciar sesión del test
// ===============================
async function iniciarSession() {
  if (!sessionId) {
    const res = await fetch("/test/iniciar");
    const data = await res.json();
    sessionId = data.session_id;
    localStorage.setItem("session_id", sessionId);
  }
}

// ===============================
// Guardar respuesta local
// ===============================
function guardarRespuestaLocal(preguntaId, valor) {
  respuestas[preguntaId] = valor;
  localStorage.setItem("respuestas", JSON.stringify(respuestas));
}

// ===============================
// Enviar respuestas guardadas (si hay token)
// ===============================
async function enviarRespuestasGuardadas() {
  if (!token) return;
  const respuestasLocales =
    JSON.parse(localStorage.getItem("respuestas")) || {};

  for (let id in respuestasLocales) {
    try {
      await fetch("/test/respuesta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          session_id: sessionId,
          pregunta_id: id,
          respuesta: respuestasLocales[id],
        }),
      });
    } catch (err) {
      console.error("Error enviando respuestas guardadas:", err);
    }
  }

  localStorage.removeItem("respuestas");
}

// ===============================
// Registrar respuesta
// ===============================
async function registrarRespuesta(valor) {
  const p = preguntas[indice];

  if (!valor || valor.trim() === "") {
    alert("Debes ingresar una respuesta antes de continuar.");
    return;
  }

  guardarRespuestaLocal(p.id_pregunta, valor);

  if (token) {
    try {
      await fetch("/test/respuesta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          session_id: sessionId,
          pregunta_id: p.id_pregunta,
          respuesta: valor,
        }),
      });

      await enviarRespuestasGuardadas();
    } catch (err) {
      console.error("Error enviando respuesta:", err);
    }
  }

  indice++;

  // Fin del test
  if (indice >= preguntas.length) {
    if (token) {
      window.location.href = "/components/dashboard.html";
    } else {
      window.location.href = "/components/login.html";
    }
    return;
  }

  mostrarPregunta();
}

// ===============================
// Mostrar pregunta
// ===============================
function mostrarPregunta() {
  const p = preguntas[indice];
  if (!p) {
    textoPregunta.textContent = "Ya respondiste todas las preguntas.";
    opcionesDiv.innerHTML = "";
    progreso.textContent = "";
    return;
  }

  textoPregunta.textContent = p.texto_pregunta;
  opcionesDiv.innerHTML = "";

  const opciones = p.opciones || [];

  if (opciones.length > 0) {
    opciones.forEach((op) => {
      const btn = document.createElement("button");
      btn.className = "btn btn-primary btn-lg w-100 mb-2";
      btn.textContent = op;
      btn.onclick = () => registrarRespuesta(op);
      opcionesDiv.appendChild(btn);
    });
  } else {
    const input = document.createElement("input");
    input.id = "respuesta-libre";
    input.className = "form-control mb-2";
    input.placeholder = "Escribe tu respuesta...";
    input.value = respuestas[p.id_pregunta] || "";
    opcionesDiv.appendChild(input);

    const btn = document.createElement("button");
    btn.className = "btn btn-primary btn-lg w-100";
    btn.textContent = "Continuar";
    btn.onclick = () => registrarRespuesta(input.value);
    opcionesDiv.appendChild(btn);
  }

  // Botón "Anterior"
  const btnAnterior = document.createElement("button");
  btnAnterior.className = "btn btn-secondary btn-lg w-100 mt-2";
  btnAnterior.textContent = "Anterior";
  btnAnterior.disabled = indice === 0;
  btnAnterior.onclick = () => {
    if (indice > 0) {
      indice--;
      mostrarPregunta();
    }
  };
  opcionesDiv.appendChild(btnAnterior);

  progreso.textContent = `Pregunta ${indice + 1} de ${preguntas.length}`;
}

// ===============================
// Cargar preguntas
// ===============================
async function cargarPreguntas() {
  const res = await fetch("/test/preguntas", {
    headers: token ? { Authorization: "Bearer " + token } : {},
  });
  preguntas = await res.json();
  console.log("Preguntas cargadas:", preguntas);
  mostrarPregunta();
}

// ===============================
// Inicializar test
// ===============================
(async function init() {
  await iniciarSession();

  // Validar token
  if (token) {
    try {
      const res = await fetch("/auth/validar", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) {
        token = null;
        localStorage.removeItem("token");
      } else {
        await enviarRespuestasGuardadas();
      }
    } catch (err) {
      console.error("Error validando token:", err);
      token = null;
    }
  }

  await cargarPreguntas();
})();
// ===============================
// Inicializar test
// ===============================
(async function init() {
  await iniciarSession();
  await cargarPreguntas();
})();

// ===============================
// Inicializar test
// ===============================
(async function init() {
  await iniciarSession();

  // Validar token
  if (token) {
    try {
      const res = await fetch("/auth/validar", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) {
        token = null;
        localStorage.removeItem("token");
      } else {
        await enviarRespuestasGuardadas();
      }
    } catch (err) {
      console.error("Error validando token:", err);
      token = null;
    }
  }

  await cargarPreguntas();
})();

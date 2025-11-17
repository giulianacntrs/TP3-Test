const token = localStorage.getItem("token");

// =======================================================
// CARGAR PREGUNTAS
// =======================================================
async function cargarPreguntas() {
  const res = await fetch("/admin/preguntas", {
  headers: { Authorization: "Bearer " + token },
  });

  const preguntas = await res.json();
  console.log("Preguntas recibidas:", preguntas);

  document.getElementById("lista").innerHTML = preguntas
    .map(
      (p) => `
    <div class="border p-2 mb-2">
      <b>Pregunta:</b> ${p.texto_pregunta} <br>
      <b>Tipo:</b> ${p.tipo} <br>
      <b>Opciones:</b> ${
        p.opciones ? JSON.parse(p.opciones).join(", ") : "N/A"
      } <br>

      <button class="btn btn-warning btn-sm mt-2" onclick="editar(${
        p.id_pregunta
      })">Editar</button>
      <button class="btn btn-danger btn-sm mt-2" onclick="eliminar(${
        p.id_pregunta
      })">Eliminar</button>
    </div>
  `
    )
    .join("");
    
console.log("Preguntas recibidas:", preguntas);

}

// =======================================================
// CREAR PREGUNTA
// =======================================================
async function crearPregunta() {
  const texto = document.getElementById("texto").value.trim();
  const tipo = document.getElementById("tipo").value;

  let opciones = null;
  if (tipo === "opcion") {
    const raw = document.getElementById("opciones").value.trim();
    opciones = raw.split(",").map(o => o.trim()).filter(o => o);
  }

  if (!texto) {
    mostrarErrorInput("texto", "Por favor, ingresa la pregunta");
    return;
  }

  try {
    const res = await fetch("/admin/preguntas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ texto_pregunta: texto, tipo, opciones })
    });

    const result = await res.json().catch(() => ({ message: "Pregunta ya creada." }));

    if (!res.ok) {
      mostrarErrorInput("texto", result.message || "Error creando pregunta");
      return;
    }

    // Limpiar inputs
    document.getElementById("texto").value = "";
    if (tipo === "opcion") document.getElementById("opciones").value = "";

    // Mostrar mensaje de éxito y recargar preguntas
    mostrarMensaje("Pregunta creada correctamente", "success");
    cargarPreguntas();

  } catch (err) {
    mostrarMensaje("Error de conexión con el servidor", "error");
    console.error(err);
  }
  console.log("Datos a enviar:", { texto_pregunta: texto, tipo, opciones });

};


// =======================================================
// MOSTRAR OPCIONES SI EL TIPO ES "opcion"
// =======================================================
function mostrarOpciones() {
  const tipo = document.getElementById("tipo").value;
  const div = document.getElementById("divOpciones");

  if (tipo === "opcion") div.classList.remove("d-none");
  else div.classList.add("d-none");
}

// =======================================================
// ELIMINAR PREGUNTA
// =======================================================
async function eliminar(id) {
  if (!confirm("¿Eliminar esta pregunta?")) return;

  await fetch("/admin/preguntas/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  cargarPreguntas();
}

// =======================================================
// EDITAR PREGUNTA
// =======================================================
let idEditando = null;

function editar(id) {
  fetch("/admin/preguntas/" + id, {
    headers: { Authorization: "Bearer " + token },
  })
    .then((res) => res.json())
    .then((p) => abrirModal(p));
}

function abrirModal(p) {
  idEditando = p.id_pregunta;
  document.getElementById("edit_texto").value = p.texto_pregunta;
  document.getElementById("edit_tipo").value = p.tipo;

  if (p.tipo === "opcion") {
    document.getElementById("divOpcionesEditar").classList.remove("d-none");
    document.getElementById("edit_opciones").value = p.opciones
      ? JSON.parse(p.opciones).join(", ")
      : "";
  } else {
    document.getElementById("divOpcionesEditar").classList.add("d-none");
  }

  document.getElementById("modalEditar").classList.remove("d-none");
}

function cerrarModal() {
  document.getElementById("modalEditar").classList.add("d-none");
}

document.getElementById("btnActualizar").addEventListener("click", async () => {
  const data = {
    texto_pregunta: document.getElementById("edit_texto").value,
    tipo: document.getElementById("edit_tipo").value,
  };

  // Opciones
  if (data.tipo === "opcion") {
    const raw = document.getElementById("edit_opciones").value.trim();
    data.opciones = raw
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x);
  }

  await fetch("/admin/preguntas/" + idEditando, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });

  cerrarModal();
  cargarPreguntas();
});

// =======================================================
// RESPUESTAS
// =======================================================
async function cargarRespuestas() {
  const res = await fetch("/admin/respuestas", {
    headers: { Authorization: "Bearer " + token },
  });

  const data = await res.json();

  document.getElementById("lista").innerHTML =
    "<h3>Respuestas de usuarios</h3>" +
    data
      .map(
        (r) => `
      <div class="border p-2 mb-2">
        <b>Usuario:</b> ${r.usuario}<br>
        <b>Pregunta:</b> ${r.texto_pregunta}<br>
        <b>Respuesta:</b> ${r.valor}
      </div>
    `
      )
      .join("");
}

// =======================================================
// USUARIOS
// =======================================================
async function cargarUsuarios() {
  const res = await fetch("/admin/usuarios", {
    headers: { Authorization: "Bearer " + token },
  });

  const usuarios = await res.json();

  document.getElementById("lista").innerHTML = `
    <h3>Usuarios registrados</h3>
    ${usuarios
      .map(
        (u) => `
      <div class="border p-2 mb-2">
        <b>ID:</b> ${u.id_usuario} <br>
        <b>Nombre:</b> ${u.nombre} <br>
        <b>Email:</b> ${u.email} <br>
        <button class="btn btn-danger btn-sm mt-2" onclick="eliminarUsuario(${u.id_usuario})">
          Eliminar usuario
        </button>
      </div>
    `
      )
      .join("")}
  `;
}

async function eliminarUsuario(id) {
  if (!confirm("¿Eliminar este usuario?")) return;

  await fetch("/admin/usuarios/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  cargarUsuarios();
}

function mostrarMensaje(texto, tipo = "info") {
  const div = document.createElement("div");
  div.className = `alert alert-${tipo}`;
  div.innerText = texto;

  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}
cargarPreguntas();

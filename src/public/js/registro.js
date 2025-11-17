document.getElementById("formRegistro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = document.getElementById("btnRegistro");
  btn.disabled = true;
  btn.textContent = "Enviando...";

  const usuario = document.getElementById("usuario").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmar = document.getElementById("confirmar").value.trim();

  const inputs = {
    usuario: document.getElementById("usuario"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    confirmar: document.getElementById("confirmar")
  };

  const errores = {
    usuario: document.getElementById("error-usuario"),
    email: document.getElementById("error-email"),
    password: document.getElementById("error-password"),
    confirmar: document.getElementById("error-confirmar")
  };

  // Limpiar estados previos
function mostrarError(input, mensaje) {
  input.classList.add("is-invalid");
  input.nextElementSibling.textContent = mensaje;
};

function limpiarError(input) {
  input.classList.remove("is-invalid");
};

  

  let valid = true;

  // -----------------------------
  // VALIDACIONES
  // -----------------------------

  if (!usuario) {
    errores.usuario.textContent = "El nombre es obligatorio.";
    inputs.usuario.classList.add("is-invalid");
    valid = false;
  }

  if (!email) {
    errores.email.textContent = "El correo es obligatorio.";
    inputs.email.classList.add("is-invalid");
    valid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errores.email.textContent = "Ingresá un correo válido.";
      inputs.email.classList.add("is-invalid");
      valid = false;
    }
  }

  if (!password) {
    errores.password.textContent = "La contraseña es obligatoria.";
    inputs.password.classList.add("is-invalid");
    valid = false;
  } else if (password.length < 4) {
    errores.password.textContent = "Debe tener mínimo 4 caracteres.";
    inputs.password.classList.add("is-invalid");
    valid = false;
  }

  if (!confirmar) {
    errores.confirmar.textContent = "Confirmá la contraseña.";
    inputs.confirmar.classList.add("is-invalid");
    valid = false;
  } else if (password !== confirmar) {
    errores.confirmar.textContent = "Las contraseñas no coinciden.";
    inputs.confirmar.classList.add("is-invalid");
    valid = false;
  }

  if (!valid) {
    btn.disabled = false;
    btn.textContent = "Registrarse";
    return;
  }

  // -----------------------------
  // VALIDAR EMAIL EXISTENTE
  // -----------------------------
  try {
    const respEmail = await fetch(`/usuarios/check-email?email=${encodeURIComponent(email)}`);
    const jsonEmail = await respEmail.json();

    if (jsonEmail.enUso) {
      errores.email.textContent = "Este correo ya está registrado.";
      inputs.email.classList.add("is-invalid");

      btn.disabled = false;
      btn.textContent = "Registrarse";
      return;
    }
  } catch (error) {
    errores.email.textContent = "Error verificando email.";
    inputs.email.classList.add("is-invalid");

    btn.disabled = false;
    btn.textContent = "Registrarse";
    return;
  }

  // -----------------------------
  // ENVIAR AL BACKEND
  // -----------------------------
  try {
    const res = await fetch("/usuarios/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: usuario,
        email,
        contrasena: password
      })
    });

    const json = await res.json();

    if (!res.ok) {
      errores.email.textContent = json.message || "Error en el registro.";
      inputs.email.classList.add("is-invalid");

      btn.disabled = false;
      btn.textContent = "Registrarse";
      return;
    }

    window.location.href = "../login/login.html";

  } catch (e) {
    errores.email.textContent = "Error en el servidor.";
    inputs.email.classList.add("is-invalid");
  }

  btn.disabled = false;
  btn.textContent = "Registrarse";
});

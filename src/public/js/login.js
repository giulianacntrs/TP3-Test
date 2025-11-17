document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLogin");
  const emailInput = document.getElementById("email");
  const passInput = document.getElementById("contrasena");

  const emailError = document.getElementById("emailError");
  const passError = document.getElementById("passError");
  const generalError = document.getElementById("generalError");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    emailError.textContent = "";
    passError.textContent = "";
    generalError.textContent = "";

    const email = emailInput.value.trim();
    const contrasena = passInput.value.trim();

    let valido = true;

    if (!email) {
      emailError.textContent = "El email es obligatorio";
      valido = false;
    }

    if (!contrasena) {
      passError.textContent = "La contraseña es obligatoria";
      valido = false;
    }

    if (!valido) return;

    try {
      const respuesta = await fetch("/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        if (respuesta.status === 400) {
          generalError.textContent = "Completa todos los campos.";
        } else if (respuesta.status === 401) {
          generalError.textContent = "Email o contraseña incorrectos.";
        } else {
          generalError.textContent = "Error en el servidor.";
        }
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.rol);

      if (data.rol === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "dashboard.html";
      }

    } catch (error) {
      console.error(error);
      generalError.textContent = "Error de conexión con el servidor.";
    }
  });
});

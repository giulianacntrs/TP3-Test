// Referencias
const btnSueno = document.getElementById("btnSueno");
const btnEjercicio = document.getElementById("btnEjercicio");
const btnSocial = document.getElementById("btnSocial");

const formSueno = document.getElementById("formSueno");
const formEjercicio = document.getElementById("formEjercicio");
const formSocial = document.getElementById("formSocial");

const lista = document.getElementById("listaRegistros");

const ocultarFormularios = () => {
  formSueno.classList.add("d-none");
  formEjercicio.classList.add("d-none");
  formSocial.classList.add("d-none");
};
btnSueno.addEventListener("click", () => {
  ocultarFormularios();
  formSueno.classList.remove("d-none");
});
btnEjercicio.addEventListener("click", () => {
  ocultarFormularios();
  formEjercicio.classList.remove("d-none");
});
btnSocial.addEventListener("click", () => {
  ocultarFormularios();
  formSocial.classList.remove("d-none");
});

// --- SUEÑO ---
formSueno.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dia = suenoDia.value;
  const horas = suenoHoras.value;

  try {
    const res = await fetch("http://localhost:3000/tests/sueño", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dia, horas }),
    });

    const data = await res.json();

    console.log(data);

    if (!res.ok) throw new Error(data.msg);

    agregarRegistro("sueno", dia, horas);
    formSueno.reset();
  } catch (error) {
    console.error("Error al registrar sueño:", error);
  }
});

// --- EJERCICIO ---
formEjercicio.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dia = ejercicioDia.value;
  const horas = ejercicioHoras.value;

  try {
    const res = await fetch("http://localhost:3000/test/trabajo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dia, horas }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.msg);

    agregarRegistro("ejercicio", dia, horas);
    formEjercicio.reset();
  } catch (error) {
    console.error("Error al registrar ejercicio:", error);
  }
});

// --- SOCIAL ---
formSocial.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dia = socialDia.value;
  const horas = socialHoras.value;

  try {
    const res = await fetch("http://localhost:3000/api/social", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dia, horas }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.msg);

    agregarRegistro("social", dia, horas);
    formSocial.reset();
  } catch (error) {
    console.error("Error al registrar social:", error);
  }
});

//Grafico
const ctx = document.getElementById("graficoSemanal");
const grafico = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ],
    datasets: [
      { label: "Sueño", data: [], backgroundColor: "rgba(13, 110, 253, 0.7)" },
      {
        label: "Ejercicio",
        data: [],
        backgroundColor: "rgba(25, 135, 84, 0.7)",
      },
      { label: "Social", data: [], backgroundColor: "rgba(255, 193, 7, 0.7)" },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Horas" } },
    },
  },
});
// Actualizar gráfico según datos
function actualizarGrafico() {
  const dias = grafico.data.labels;
  grafico.data.datasets[0].data = dias.map((d) => datos.sueno[d] || 0);
  grafico.data.datasets[1].data = dias.map((d) => datos.ejercicio[d] || 0);
  grafico.data.datasets[2].data = dias.map((d) => datos.social[d] || 0);
  grafico.update();
}

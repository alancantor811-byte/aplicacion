const energyMap = {
  calma: {
    emotion: "Sereno",
    vision: "Auroras líquidas",
    theme: "#7c7bff",
  },
  fuego: {
    emotion: "Incandescente",
    vision: "Fulgor volcánico",
    theme: "#ff8d6b",
  },
  explora: {
    emotion: "Curioso",
    vision: "Cartografías flotantes",
    theme: "#4be3ff",
  },
  futuro: {
    emotion: "Visionario",
    vision: "Ciudades de luz",
    theme: "#9bff7b",
  },
};

const beats = {
  ritmo: 42,
  intensidad: 68,
  horizonte: 54,
};

const metricEmotion = document.getElementById("metric-emotion");
const metricBeat = document.getElementById("metric-beat");
const metricVision = document.getElementById("metric-vision");
const ritualButton = document.getElementById("ritual-start");
const ritualTime = document.getElementById("ritual-time");
const ritualStatus = document.getElementById("ritual-status");
const ritualPulse = document.getElementById("ritual-pulse");
const intentionForm = document.getElementById("intention-form");
const intentionResponse = document.getElementById("intention-response");

let ritualInterval = null;
let ritualRemaining = 90;
let ritualActive = false;

const pad = (value) => String(value).padStart(2, "0");

const updateBeat = () => {
  const average = Math.round(
    (beats.ritmo + beats.intensidad + beats.horizonte) / 3
  );
  metricBeat.textContent = `${average} bpm`;
};

const applyEnergy = (energyKey) => {
  const data = energyMap[energyKey];
  metricEmotion.textContent = data.emotion;
  metricVision.textContent = data.vision;
  document.documentElement.style.setProperty("--accent", data.theme);
  document.documentElement.style.setProperty(
    "--accent-strong",
    `${data.theme}`
  );
};

const updateRitual = () => {
  const minutes = Math.floor(ritualRemaining / 60);
  const seconds = ritualRemaining % 60;
  ritualTime.textContent = `${pad(minutes)}:${pad(seconds)}`;
};

const stopRitual = () => {
  ritualActive = false;
  ritualStatus.textContent = "En pausa";
  ritualPulse.classList.remove("active");
  ritualButton.textContent = "Reanudar ritual";
  if (ritualInterval) {
    clearInterval(ritualInterval);
    ritualInterval = null;
  }
};

const startRitual = () => {
  if (ritualInterval) {
    clearInterval(ritualInterval);
  }
  ritualActive = true;
  ritualStatus.textContent = "En progreso";
  ritualPulse.classList.add("active");
  ritualButton.textContent = "Pausar ritual";
  ritualInterval = setInterval(() => {
    ritualRemaining = Math.max(0, ritualRemaining - 1);
    updateRitual();
    if (ritualRemaining === 0) {
      clearInterval(ritualInterval);
      ritualInterval = null;
      ritualStatus.textContent = "Ritual completo";
      ritualButton.textContent = "Reiniciar ritual";
      ritualPulse.classList.remove("active");
      ritualActive = false;
    }
  }, 1000);
};

const resetRitual = () => {
  ritualRemaining = 90;
  updateRitual();
  startRitual();
};

updateBeat();
updateRitual();
applyEnergy("calma");

const energyButtons = document.querySelectorAll(".pill");
energyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    energyButtons.forEach((pill) => pill.classList.remove("active"));
    button.classList.add("active");
    applyEnergy(button.dataset.energy);
  });
});

const sliders = document.querySelectorAll("input[type='range']");
sliders.forEach((slider) => {
  slider.addEventListener("input", () => {
    beats[slider.dataset.axis] = Number(slider.value);
    updateBeat();
  });
});

ritualButton.addEventListener("click", () => {
  if (!ritualActive && ritualRemaining === 0) {
    resetRitual();
    return;
  }
  if (ritualActive) {
    stopRitual();
  } else {
    startRitual();
  }
});

intentionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(intentionForm);
  const intention = formData.get("intention");
  if (!intention) {
    return;
  }
  intentionResponse.textContent = `El prisma escucha "${intention}" y lo convierte en un mapa de posibilidades en expansión.`;
  intentionForm.reset();
});

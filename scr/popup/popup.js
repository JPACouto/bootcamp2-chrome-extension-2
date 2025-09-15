const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status");
const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");

let running = false;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// Atualiza o timer exibido
function updateTimerUI(state) {
  timerEl.textContent = formatTime(state.remaining);
  statusEl.textContent = state.mode === "focus" ? "Modo Foco" : "Pausa";
  startPauseBtn.textContent = state.running ? "Pausar" : "Iniciar";
}

// Recebe atualização do service worker
function refreshUI() {
  chrome.runtime.sendMessage({ type: "GET_STATE" }, (state) => {
    if (state) updateTimerUI(state);
  });
}

// Botões
startPauseBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "TOGGLE" }, refreshUI);
});

resetBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "RESET" }, refreshUI);
});

// Carregar estado inicial
refreshUI();

let state = {
  mode: "focus",       // "focus" ou "break"
  duration: 25 * 60,   // 25 min foco, 5 min pausa
  remaining: 25 * 60,
  running: false,
  timer: null
};

// Função para alternar entre foco e pausa
function switchMode() {
  if (state.mode === "focus") {
    state.mode = "break";
    state.duration = 5 * 60;
  } else {
    state.mode = "focus";
    state.duration = 25 * 60;
  }
  state.remaining = state.duration;
}

// Inicia o contador
function startTimer() {
  if (state.running) return;
  state.running = true;
  state.timer = setInterval(() => {
    state.remaining--;
    if (state.remaining <= 0) {
      clearInterval(state.timer);
      state.running = false;
      switchMode();
      chrome.notifications.create({
        type: "basic",
        iconUrl: "../icons/icon128.png",
        title: "Pomodoro Timer",
        message: state.mode === "focus" ? "Hora de focar!" : "Hora de descansar!"
      });
    }
  }, 1000);
}

// Pausa o contador
function pauseTimer() {
  if (!state.running) return;
  clearInterval(state.timer);
  state.running = false;
}

// Zera o contador e volta ao modo foco
function resetTimer() {
  clearInterval(state.timer);
  state.mode = "focus";
  state.duration = 25 * 60;
  state.remaining = state.duration;
  state.running = false;
}

// Listener para mensagens do popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_STATE") {
    sendResponse(state);
  } else if (msg.type === "TOGGLE") {
    state.running ? pauseTimer() : startTimer();
    sendResponse(state);
  } else if (msg.type === "RESET") {
    resetTimer();
    sendResponse(state);
  }
});

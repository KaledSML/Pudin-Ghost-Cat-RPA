
(() => {
  "use strict";

  // ==========================================
  // ELEMENTOS PRINCIPALES
  // ==========================================

  const scene = document.querySelector(".scene");
  const pudin = document.querySelector("#pudin");
  const status = document.querySelector("#cat-status");
  const sachet = document.querySelector("#sachet");
  const toast = document.querySelector("#glitch-toast");
  const sprite = pudin.querySelector(".cat-sprite");

  // Nuevos elementos: diálogo y energía de Pudin.
  const catDialogue = document.querySelector("#cat-dialogue");
  const energyPanel = document.querySelector("#pudin-energy");
  const energyValue = document.querySelector("#energy-value");
  const energyBar = document.querySelector("#energy-bar");
  const energyTrack = document.querySelector("#energy-track");
  const energyMessage = document.querySelector("#energy-message");

  const sounds = {
    salto: document.querySelector("#sfx-salto"),
    comer: document.querySelector("#sfx-comer"),
    hiss: document.querySelector("#sfx-hiss"),
    maldad: document.querySelector("#sfx-maldad"),
    mimir: document.querySelector("#sfx-mimir")
  };

  // ==========================================
  // ESTADO DEL GATO
  // ==========================================

  let state = "sleep";
  let dragging = false;
  let moved = false;
  let offsetX = 0;
  let offsetY = 0;
  let downAt = 0;
  let dragStartX = 0;
  let dragStartY = 0;
  let angryTimer = null;
  let prankTimer = null;
  let foodTimeout = null;
  let toastTimeout = null;
  let dialogueTimeout = null;
  let lastStep = 0;

  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let facingLeft = false;

  const stateMessages = {
    sleep: "PUDIN STATUS: SLEEP · NO MOLESTAR",
    idle: "PUDIN STATUS: IDLE · OBSERVANDO",
    pet: "PUDIN STATUS: HAPPY · RONRONEO SIMULADO",
    walk: "PUDIN STATUS: WALK · PATRULLANDO LA GUARIDA",
    dance: "PUDIN STATUS: DANCE · DETECTOR MUSICAL ACTIVADO",
    angry: "PUDIN STATUS: ANGRY · TE ESTÁ JUZGANDO",
    eat: "PUDIN STATUS: EAT · SACHET ACEPTADO"
  };

  const spriteForState = {
    sleep: "sit",
    idle: "idle",
    pet: "idle",
    walk: "walk",
    dance: "dance",
    angry: "angry",
    eat: "eat"
  };

  // ==========================================
  // DIÁLOGOS DE PUDIN
  // ==========================================

  const dialogues = {
    wake: [
      "Sistema iniciado. ¿Trajiste sachets?",
      "Cinco minutos más... mentira, ya desperté.",
      "PUDIN ONLINE. Procede a admirarme."
    ],
    pet: [
      "Acepto tus caricias. Continúa.",
      "Ronroneo.exe ejecutándose.",
      "Bueno, humano. No lo estás haciendo tan mal."
    ],
    focus: [
      "Concentración detectada. Te estoy vigilando.",
      "Menos pestañas, más productividad.",
      "Trabaja, humano. Yo superviso desde aquí."
    ],
    break: [
      "Descanso autorizado. Ve a estirar las patas.",
      "Pausa aprobada por el sindicato felino.",
      "Te ganaste un descanso. Quizá un sachet también."
    ],
    low: [
      "Advertencia: mis niveles de energía están sospechosamente bajos.",
      "Necesito combustible felino. Y no hablo de café.",
      "Humano... la barra no se va a rellenar con miradas."
    ],
    sachet: [
      "SACHET ADQUIRIDO. Tu deuda sigue pendiente.",
      "Excelente. Has tomado una decisión inteligente.",
      "Combustible recibido. Vuelvo a tolerarte."
    ],
    sleepy: [
      "Entrando en modo siesta. No reiniciar.",
      "Si me necesitas, deja un sachet junto a mí.",
      "Ahorro de energía activado. Zzz..."
    ]
  };

  function randomLine(lines) {
    return lines[Math.floor(Math.random() * lines.length)];
  }

  function setDialogue(text, duration = 3200) {
    if (!catDialogue) return;

    catDialogue.textContent = text;
    catDialogue.classList.add("visible");

    clearTimeout(dialogueTimeout);
    dialogueTimeout = setTimeout(() => {
      catDialogue.classList.remove("visible");
    }, duration);
  }

  // ==========================================
  // SONIDOS
  // ==========================================

  function playSound(name) {
    const audio = sounds[name];
    if (!audio) return;

    try {
      const volumeControl = document.querySelector("#volume");

      audio.currentTime = 0;

      if (volumeControl) {
        audio.volume = Number(volumeControl.value) / 100;
      }

      audio.play().catch(() => {});
    } catch (_) {}
  }

  function stopSounds() {
    Object.values(sounds).forEach(audio => {
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
    });
  }

  // ==========================================
  // ENERGÍA DE PUDIN
  // ==========================================

  let energy = 100;
  let lowEnergyWarningShown = false;

  const MAX_ENERGY = 100;

  // Un focus de 25 minutos puede consumir toda la energía.
  const FOCUS_ENERGY_PER_SECOND = 100 / (25 * 60);

  // Cinco minutos de descanso pueden recuperar toda la energía.
  const BREAK_ENERGY_PER_SECOND = 100 / (5 * 60);

  function renderEnergy() {
    energy = Math.max(0, Math.min(MAX_ENERGY, energy));

    const roundedEnergy = Math.round(energy);
    const isLow = energy <= 25;

    if (energyValue) {
      energyValue.textContent = `${roundedEnergy}%`;
    }

    if (energyBar) {
      energyBar.style.width = `${energy}%`;
      energyBar.classList.toggle("low-energy", isLow);
    }

    if (energyPanel) {
      energyPanel.classList.toggle("low-energy", isLow);
    }

    if (energyTrack) {
      energyTrack.setAttribute("role", "progressbar");
      energyTrack.setAttribute("aria-valuemin", "0");
      energyTrack.setAttribute("aria-valuemax", "100");
      energyTrack.setAttribute("aria-valuenow", String(roundedEnergy));
      energyTrack.setAttribute("aria-label", "Energía de Pudin");
    }

    if (energyMessage) {
      if (energy <= 10) {
        energyMessage.textContent = "ENERGÍA CRÍTICA · SACHET URGENTE";
      } else if (energy <= 25) {
        energyMessage.textContent = "ENERGÍA BAJA · NECESITO COMBUSTIBLE";
      } else if (energy < 70) {
        energyMessage.textContent = "RESERVAS EN DESCENSO · SIGUE ASÍ";
      } else {
        energyMessage.textContent = "SISTEMA ESTABLE · TODO BAJO CONTROL";
      }
    }

    // Aviso una sola vez por cada bajada de energía.
    if (isLow && !lowEnergyWarningShown) {
      lowEnergyWarningShown = true;
      showToast("ENERGY WARNING // PUDIN NEEDS A SACHET");
      setDialogue(randomLine(dialogues.low), 4200);
    }

    // El aviso puede volver a aparecer después de recuperar energía.
    if (energy > 35) {
      lowEnergyWarningShown = false;
    }
  }

  function changeEnergy(amount) {
    energy = Math.max(0, Math.min(MAX_ENERGY, energy + amount));
    renderEnergy();
  }

  // ==========================================
  // ESTADO Y ANIMACIÓN DEL GATO
  // ==========================================

  function setState(next, opts = {}) {
    state = next;

    pudin.className = [
      "pudin",
      next === "sleep" ? "sleeping" : "",
      next === "dance" ? "dancing" : "",
      next === "angry" ? "angry" : ""
    ].filter(Boolean).join(" ");

    pudin.setAttribute(
      "aria-label",
      next === "sleep"
        ? "Pudin está durmiendo. Clic para despertarlo"
        : "Interactuar con Pudin"
    );

    sprite.style.backgroundImage =
      `url("assets/room/sprites/${spriteForState[next] || "idle"}.png")`;

    status.textContent = stateMessages[next] || stateMessages.idle;

    const zzz = pudin.querySelector(".zzz");
    if (zzz) zzz.hidden = next !== "sleep";

    if (next === "pet") {
      pudin.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.12) rotate(-6deg)" },
          { transform: "scale(1)" }
        ],
        { duration: 420 }
      );
    }

    if (opts.sound) {
      playSound(opts.sound);
    }
  }

  function showToast(text) {
    if (!toast) return;

    toast.textContent = text;
    toast.classList.add("visible");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
      toast.classList.remove("visible");
    }, 2200);
  }

  // ==========================================
  // MOVIMIENTO Y LÍMITES DE LA HABITACIÓN
  // ==========================================

  function bounds() {
    const rect = scene.getBoundingClientRect();

    return {
      w: rect.width,
      h: rect.height
    };
  }

  function placeCat(nx, ny) {
    const area = bounds();

    x = Math.max(0, Math.min(area.w - pudin.offsetWidth, nx));
    y = Math.max(0, Math.min(area.h - pudin.offsetHeight - 8, ny));

    pudin.style.left = `${x}px`;
    pudin.style.top = `${y}px`;
    pudin.style.right = "auto";
    pudin.style.bottom = "auto";

    pudin.style.setProperty("--facing", facingLeft ? "-1" : "1");
  }

  function spawnPaw() {
    const now = performance.now();

    if (now - lastStep < 340) return;
    lastStep = now;

    const paw = document.createElement("span");

    paw.className = "paw-particle";
    paw.setAttribute("aria-hidden", "true");

    // Huella vectorial: almohadilla y cuatro deditos.
    paw.innerHTML = `
      <svg viewBox="0 0 44 42" role="presentation">
        <ellipse class="paw-toe" cx="9" cy="12" rx="4.2" ry="5.6"
          transform="rotate(-25 9 12)"/>
        <ellipse class="paw-toe" cx="18.5" cy="7.5" rx="4.2" ry="5.7"
          transform="rotate(-8 18.5 7.5)"/>
        <ellipse class="paw-toe" cx="28.5" cy="9" rx="4.1" ry="5.6"
          transform="rotate(15 28.5 9)"/>
        <ellipse class="paw-toe" cx="36" cy="16" rx="3.8" ry="5"
          transform="rotate(28 36 16)"/>
        <path class="paw-pad"
          d="M9 26 C8 20 14 17 19 20 C22 16 28 18 29 23
          C35 25 34 32 28 35 C23 38 14 35 10 32 C8 30 8 28 9 26Z"/>
      </svg>
    `;

    paw.style.left = `${x + 32 + Math.random() * 36}px`;
    paw.style.top = `${y + 91 + Math.random() * 8}px`;
    paw.style.setProperty("--paw-tilt", `${Math.random() * 34 - 17}deg`);

    scene.appendChild(paw);
    setTimeout(() => paw.remove(), 1750);
  }

  function wake() {
    if (state !== "sleep") return;

    setState("idle", { sound: "salto" });
    showToast("WAKE EVENT: PUDIN ONLINE");
    setDialogue(randomLine(dialogues.wake));
  }

  // ==========================================
  // SACHET: COMIDA Y RECUPERACIÓN DE ENERGÍA
  // ==========================================

  function offerSachet() {
    wake();

    const sachetRect = sachet.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();

    targetX = sachetRect.left - sceneRect.left - 8;
    targetY = sachetRect.top - sceneRect.top - 50;

    setState("walk");
    playSound("maldad");

    showToast("BRIBE ACCEPTED // APPROACHING SACHET");
    setDialogue("¿Un sachet? Sabía que eras útil.");

    clearTimeout(foodTimeout);

    foodTimeout = setTimeout(() => {
      placeCat(targetX, targetY);

      setState("eat", { sound: "comer" });

      // La comida restaura parte de la energía.
      changeEnergy(35);

      sachet.classList.add("being-eaten");

      setTimeout(() => {
        sachet.classList.remove("being-eaten");
      }, 700);

      showToast("SACHET CONSUMED // ENERGY RESTORED");
      setDialogue(randomLine(dialogues.sachet), 4000);

      foodTimeout = setTimeout(() => {
        if (state === "eat") setState("idle");
      }, 3200);
    }, 850);
  }

  // ==========================================
  // POSICIÓN INICIAL
  // ==========================================

  requestAnimationFrame(() => {
    const area = bounds();

    // Pudin aparece en la habitación y comienza durmiendo.
    placeCat(area.w * 0.22, area.h * 0.65);
    setState("sleep");
    renderEnergy();
  });

  // ==========================================
  // CLIC Y ARRASTRE DE PUDIN
  // ==========================================

  pudin.addEventListener("click", () => {
    if (moved) return;

    if (state === "sleep") {
      wake();
      return;
    }

    if (state === "angry") {
      setState("idle");
      setDialogue("Ya, ya. Pero no me arrastres así.");
      return;
    }

    setState("pet", { sound: "salto" });
    setDialogue(randomLine(dialogues.pet));

    setTimeout(() => {
      if (!dragging && state === "pet") setState("idle");
    }, 1600);
  });

  pudin.addEventListener("pointerdown", event => {
    wake();

    dragging = true;
    moved = false;
    downAt = performance.now();

    pudin.setPointerCapture(event.pointerId);

    const catRect = pudin.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();

    offsetX = event.clientX - catRect.left;
    offsetY = event.clientY - catRect.top;

    dragStartX = event.clientX - sceneRect.left;
    dragStartY = event.clientY - sceneRect.top;

    pudin.style.transition = "";

    clearTimeout(angryTimer);

    angryTimer = setTimeout(() => {
      if (dragging) {
        setState("angry", { sound: "hiss" });
        showToast("WARNING: CAT TEMPER EXCEEDED");
        setDialogue("¡SUÉLTAME, HUMANO!");
      }
    }, 2000);
  });

  pudin.addEventListener("pointermove", event => {
    if (!dragging) return;

    const sceneRect = scene.getBoundingClientRect();

    const nx = event.clientX - sceneRect.left - offsetX;
    const ny = event.clientY - sceneRect.top - offsetY;

    if (
      Math.abs(event.clientX - sceneRect.left - dragStartX) +
      Math.abs(event.clientY - sceneRect.top - dragStartY) > 6
    ) {
      moved = true;
    }

    if (moved) {
      facingLeft = nx < x;
      placeCat(nx, ny);

      if (state !== "angry") setState("walk");
    }
  });

  function stopDrag() {
    if (!dragging) return;

    dragging = false;
    clearTimeout(angryTimer);

    pudin.style.transition = "";

    if (state === "angry") {
      setTimeout(() => {
        if (!dragging && state === "angry") setState("idle");
      }, 1300);
    } else if (moved) {
      setState("idle");
    }

    setTimeout(() => {
      moved = false;
    }, 80);
  }

  pudin.addEventListener("pointerup", stopDrag);
  pudin.addEventListener("pointercancel", stopDrag);

  // ==========================================
  // BOTONES DE INTERACCIÓN
  // ==========================================

  document.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;

      if (action === "sleep") {
        setState("sleep", { sound: "mimir" });
        setDialogue(randomLine(dialogues.sleepy));
        return;
      }

      wake();

      if (action === "pet") {
        setState("pet", { sound: "salto" });
        setDialogue(randomLine(dialogues.pet));

        setTimeout(() => {
          if (state === "pet") setState("idle");
        }, 1500);
      }

      if (action === "dance") {
        setState("dance");
        showToast("MUSIC DETECTOR: MANUAL OVERRIDE");
        setDialogue("Procesando ritmo... bailando con dignidad.");
      }

      if (action === "angry") {
        setState("angry", { sound: "hiss" });
        setDialogue("ERROR: paciencia felina agotada.");

        setTimeout(() => {
          if (state === "angry") setState("idle");
        }, 2200);
      }

      if (action === "wander") {
        targetX = Math.random() * Math.max(0, bounds().w - 128);
        targetY = bounds().h * (0.40 + Math.random() * 0.28);

        setState("walk");
        showToast("AUTOPILOT: WANDER MODE");
        setDialogue("Inspección rutinaria de la guarida.");
      }

      if (action === "prank") {
        playSound("maldad");

        const pranks = [
          "PUDIN_OS: INSTALANDO RONRONEOS.EXE",
          "ALERTA: SE DETECTÓ UNA DEUDA DE SACHETS",
          "ERROR 404: PRODUCTIVIDAD NO ENCONTRADA",
          "SYSTEM OVERRIDE: 5 MINUTOS PARA MIRAR GATOS"
        ];

        showToast(randomLine(pranks));
        setDialogue("No fui yo. Fue un fallo del sistema.");

        scene.classList.add("glitching");

        clearTimeout(prankTimer);
        prankTimer = setTimeout(() => {
          scene.classList.remove("glitching");
        }, 700);
      }
    });
  });

  sachet.addEventListener("click", offerSachet);

  // ==========================================
  // MOVIMIENTO AUTÓNOMO
  // ==========================================

  setInterval(() => {
    if (dragging || ["sleep", "dance", "eat", "angry"].includes(state)) {
      return;
    }

    if (state === "walk") {
      const dx = targetX - x;
      const dy = targetY - y;
      const distance = Math.hypot(dx, dy);

      if (distance < 7) {
        setState("idle");
        return;
      }

      const step = Math.min(3.2, distance);

      facingLeft = dx < 0;

      placeCat(
        x + (dx / distance) * step,
        y + (dy / distance) * step
      );

      spawnPaw();
    } else if (state === "idle" && Math.random() < 0.045) {
      targetX = Math.random() * Math.max(0, bounds().w - 128);
      targetY = bounds().h * (0.42 + Math.random() * 0.22);

      setState("walk");
    }
  }, 50);

  // ==========================================
  // RADIO ONLINE: LO-FI / SYNTHWAVE
  // ==========================================

  const musicNote = document.querySelector("#music-note");
  const audioToggle = document.querySelector("#audio-toggle");
  const musicVolume = document.querySelector("#music-volume");
  const musicOptions = document.querySelectorAll(".music-option");

  const radioStations = {
    lofi: {
      name: "LO-FI",
      url: "https://streaming.hotmixradio.com/hotmix-lofi-en-mp3?provider=radiobrowser"
    },
    synthwave: {
      name: "SYNTHWAVE",
      url: "https://stream.laut.fm/synthwave"
    }
  };

  const ambientAudio = new Audio();

  ambientAudio.loop = false;
  ambientAudio.preload = "none";
  ambientAudio.volume = Number(musicVolume?.value ?? 35) / 100;

  let ambientPlaying = false;
  let selectedStation = "lofi";

  function updateMusicButton() {
    if (!audioToggle) return;

    audioToggle.textContent = ambientPlaying
      ? "Ⅱ PAUSAR AMBIENTE"
      : "♫ REPRODUCIR AMBIENTE";
  }

  function updateMusicNote(text) {
    if (musicNote) musicNote.textContent = text;
  }

  async function playAmbient() {
    const station = radioStations[selectedStation];

    try {
      if (!station) throw new Error("Emisora desconocida");

      // Solo recarga el audio si cambia la emisora.
      if (ambientAudio.dataset.station !== selectedStation) {
        ambientAudio.pause();
        ambientAudio.src = station.url;
        ambientAudio.dataset.station = selectedStation;
        ambientAudio.load();
      }

      updateMusicNote(`Conectando con ${station.name}...`);

      await ambientAudio.play();

      ambientPlaying = true;
      updateMusicButton();
      updateMusicNote(`EN DIRECTO · ${station.name}`);
    } catch (_) {
      ambientPlaying = false;
      updateMusicButton();

      updateMusicNote(
        "No se pudo conectar. Prueba otra emisora o inténtalo de nuevo."
      );

      showToast("RADIO OFFLINE // REINTENTA LA CONEXIÓN");
    }
  }

  function selectStation(mode) {
    if (!radioStations[mode]) return;

    selectedStation = mode;

    musicOptions.forEach(button => {
      const active = button.dataset.mode === mode;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    updateMusicNote(
      `${radioStations[mode].name} seleccionado. Pulsa reproducir para escuchar.`
    );

    if (ambientPlaying) playAmbient();
  }

  musicOptions.forEach(button => {
    button.addEventListener("click", () => {
      selectStation(button.dataset.mode);

      if (state !== "sleep" && state !== "angry") {
        setState("dance");
        setDialogue("Cambio de frecuencia. Hora de bailar.");
      }
    });
  });

  if (audioToggle) {
    audioToggle.addEventListener("click", () => {
      if (ambientPlaying) {
        ambientAudio.pause();
        ambientPlaying = false;

        updateMusicButton();
        updateMusicNote("Radio pausada.");
        return;
      }

      playAmbient();
    });
  }

  ambientAudio.addEventListener("playing", () => {
    ambientPlaying = true;
    updateMusicButton();

    updateMusicNote(`EN DIRECTO · ${radioStations[selectedStation].name}`);
  });

  ambientAudio.addEventListener("pause", () => {
    ambientPlaying = false;
    updateMusicButton();
  });

  ambientAudio.addEventListener("error", () => {
    ambientPlaying = false;
    updateMusicButton();

    updateMusicNote("La emisora no está disponible en este momento.");
  });

  if (musicVolume) {
    musicVolume.addEventListener("input", event => {
      ambientAudio.volume = Number(event.target.value) / 100;
    });
  }

  selectStation("lofi");
  updateMusicButton();

  // ==========================================
  // PANEL DE CONTROLES Y VOLUMEN DE EFECTOS
  // ==========================================

  const panelToggle = document.querySelector("#panel-toggle");
  const controlPanel = document.querySelector("#control-panel");
  const effectVolume = document.querySelector("#volume");

  if (panelToggle && controlPanel) {
    panelToggle.addEventListener("click", () => {
      const closed = controlPanel.classList.toggle("closed");

      panelToggle.setAttribute("aria-expanded", String(!closed));

      panelToggle.innerHTML = closed
        ? "☰ <span>CONTROLES</span>"
        : "✕ <span>OCULTAR</span>";
    });
  }

  if (effectVolume) {
    effectVolume.addEventListener("input", event => {
      const volume = Number(event.target.value) / 100;

      Object.values(sounds).forEach(audio => {
        if (audio) audio.volume = volume;
      });
    });
  }

  // ==========================================
  // POMODORO + ENERGÍA
  // ==========================================

  let duration = 25 * 60;
  let remaining = duration;
  let interval = null;
  let modeLabel = "FOCUS";

  const timer = document.querySelector("#timer");
  const progress = document.querySelector("#timer-progress");
  const start = document.querySelector("#timer-start");
  const message = document.querySelector("#timer-message");
  const timerMode = document.querySelector("#timer-mode");
  const reset = document.querySelector("#timer-reset");
  const modeButtons = document.querySelectorAll(".mode-button");

  function renderTimer() {
    if (!timer || !progress) return;

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    timer.textContent =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    progress.style.width =
      `${100 * (1 - remaining / duration)}%`;
  }

  function stopTimer() {
    if (interval !== null) {
      clearInterval(interval);
    }

    interval = null;

    if (start) start.textContent = "▶ CONTINUAR";
  }

  function completeTimer() {
    stopTimer();

    if (start) start.textContent = "▶ INICIAR";

    if (modeLabel === "FOCUS") {
      if (message) {
        message.textContent =
          "¡FOCUS COMPLETADO! Pudin exige su paga en sachets. 🍣";
      }

      setState("dance");
      playSound("maldad");
      showToast("FOCUS COMPLETE // CAT APPROVED");
      setDialogue("¡Trabajo terminado! Exijo mi recompensa.");

    } else {
      if (message) {
        message.textContent =
          "Descanso terminado. Cuando quieras, puedes iniciar otro protocolo.";
      }

      showToast("BREAK COMPLETE // READY TO FOCUS");
      setDialogue("Descanso finalizado. Volvamos al trabajo, humano.");
    }
  }

  function tick() {
    if (remaining <= 0) {
      completeTimer();
      return;
    }

    remaining--;

    // La energía depende del modo del Pomodoro activo.
    if (modeLabel === "FOCUS") {
      changeEnergy(-FOCUS_ENERGY_PER_SECOND);
    } else {
      changeEnergy(BREAK_ENERGY_PER_SECOND);
    }

    renderTimer();

    // Completa el protocolo en el mismo segundo que llega a cero.
    if (remaining <= 0) {
      completeTimer();
    }
  }

  modeButtons.forEach(button => {
    button.addEventListener("click", () => {
      stopTimer();

      duration = Number(button.dataset.minutes) * 60;
      remaining = duration;
      modeLabel = (button.dataset.label || "FOCUS").trim().toUpperCase();

      modeButtons.forEach(element => {
        element.classList.toggle("selected", element === button);
      });

      if (timerMode) {
        timerMode.textContent = button.dataset.label;
      }

      if (message) message.textContent = "Nuevo protocolo cargado.";

      if (start) start.textContent = "▶ INICIAR";

      // No rellenamos ni vaciamos la energía al cambiar de modo.
      renderTimer();

      if (modeLabel === "FOCUS") {
        setDialogue(randomLine(dialogues.focus));
      } else {
        setDialogue(randomLine(dialogues.break));
      }
    });
  });

  if (start) {
    start.addEventListener("click", () => {
      if (interval !== null) {
        stopTimer();

        if (message) message.textContent = "Protocolo pausado.";

        return;
      }

      if (remaining <= 0) {
        remaining = duration;
      }

      interval = setInterval(tick, 1000);
      start.textContent = "Ⅱ PAUSAR";

      if (modeLabel === "FOCUS") {
        if (message) {
          message.textContent =
            "Sesión en curso. Pudin está supervisando… desde su cama.";
        }

        setDialogue(randomLine(dialogues.focus));
      } else {
        if (message) {
          message.textContent =
            "Descanso en curso. Recuperando energía felina.";
        }

        setDialogue(randomLine(dialogues.break));
      }
    });
  }

  if (reset) {
    reset.addEventListener("click", () => {
      stopTimer();

      remaining = duration;
      renderTimer();

      if (start) start.textContent = "▶ INICIAR";
      if (message) message.textContent = "Temporizador reiniciado.";

      // Reiniciar el reloj no cambia la energía acumulada.
    });
  }

  // Primera representación del temporizador y de la energía.
  renderTimer();
  renderEnergy();

  // ==========================================
  // AJUSTE AL CAMBIAR EL TAMAÑO DE LA VENTANA
  // ==========================================

  window.addEventListener("resize", () => {
    placeCat(x, y);
  });
})();

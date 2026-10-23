(() => {
  "use strict";
  const scene = document.querySelector(".scene");
  const pudin = document.querySelector("#pudin");
  const status = document.querySelector("#cat-status");
  const sachet = document.querySelector("#sachet");
  const toast = document.querySelector("#glitch-toast");
  const sprite = pudin.querySelector(".cat-sprite");
  const sounds = {
    salto: document.querySelector("#sfx-salto"),
    comer: document.querySelector("#sfx-comer"),
    hiss: document.querySelector("#sfx-hiss"),
    maldad: document.querySelector("#sfx-maldad"),
    mimir: document.querySelector("#sfx-mimir")
  };

  let state = "sleep", dragging = false, moved = false, offsetX = 0, offsetY = 0;
  let downAt = 0, dragStartX = 0, dragStartY = 0, angryTimer = null, prankTimer = null;
  let foodTimeout = null, toastTimeout = null, lastStep = 0;
  let x = 0, y = 0, targetX = 0, targetY = 0, facingLeft = false;
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
    sleep: "sit", idle: "idle", pet: "idle", walk: "walk",
    dance: "dance", angry: "angry", eat: "eat"
  };

  function playSound(name) {
    const audio = sounds[name];
    if (!audio) return;
    try {
      audio.currentTime = 0;
      audio.volume = Number(document.querySelector("#volume").value) / 100;
      audio.play().catch(() => {});
    } catch (_) {}
  }
  function stopSounds() {
    Object.values(sounds).forEach(a => { a.pause(); a.currentTime = 0; });
  }
  function setState(next, opts = {}) {
    state = next;
    pudin.className = `pudin ${next === "sleep" ? "sleeping" : ""} ${next === "dance" ? "dancing" : ""} ${next === "angry" ? "angry" : ""}`.trim();
    pudin.setAttribute("aria-label", next === "sleep" ? "Pudin está durmiendo. Clic para despertarlo" : "Interactuar con Pudin");
    sprite.style.backgroundImage = `url("assets/room/sprites/${spriteForState[next] || "idle"}.png")`;
    status.textContent = stateMessages[next] || stateMessages.idle;
    if (next !== "sleep") pudin.querySelector(".zzz").hidden = true;
    else pudin.querySelector(".zzz").hidden = false;
    if (next === "pet") {
      pudin.animate([{transform:"scale(1)"},{transform:"scale(1.12) rotate(-6deg)"},{transform:"scale(1)"}], {duration:420});
    }
    if (opts.sound) playSound(opts.sound);
  }
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("visible");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("visible"), 2200);
  }
  function bounds() {
    const r = scene.getBoundingClientRect();
    return {w:r.width, h:r.height};
  }
  function placeCat(nx, ny) {
    const b = bounds();
    x = Math.max(0, Math.min(b.w - pudin.offsetWidth, nx));
    y = Math.max(0, Math.min(b.h - pudin.offsetHeight - 8, ny));
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
    // Huella vectorial propia: almohadilla + cuatro deditos, sin emoji.
    paw.innerHTML = `<svg viewBox="0 0 44 42" role="presentation">
      <ellipse class="paw-toe" cx="9" cy="12" rx="4.2" ry="5.6" transform="rotate(-25 9 12)"/>
      <ellipse class="paw-toe" cx="18.5" cy="7.5" rx="4.2" ry="5.7" transform="rotate(-8 18.5 7.5)"/>
      <ellipse class="paw-toe" cx="28.5" cy="9" rx="4.1" ry="5.6" transform="rotate(15 28.5 9)"/>
      <ellipse class="paw-toe" cx="36" cy="16" rx="3.8" ry="5" transform="rotate(28 36 16)"/>
      <path class="paw-pad" d="M9 26 C8 20 14 17 19 20 C22 16 28 18 29 23 C35 25 34 32 28 35 C23 38 14 35 10 32 C8 30 8 28 9 26Z"/>
    </svg>`;
    paw.style.left = `${x + 32 + Math.random() * 36}px`;
    paw.style.top = `${y + 91 + Math.random() * 8}px`;
    paw.style.setProperty("--paw-tilt", `${Math.random() * 34 - 17}deg`);
    scene.appendChild(paw);
    setTimeout(() => paw.remove(), 1750);
  }
  function wake() {
    if (state === "sleep") {
      setState("idle", {sound:"salto"});
      showToast("WAKE EVENT: PUDIN ONLINE");
    }
  }
  function offerSachet() {
    wake();
    const sr = sachet.getBoundingClientRect(), cr = scene.getBoundingClientRect();
    targetX = sr.left - cr.left - 8;
    targetY = sr.top - cr.top - 50;
    setState("walk");
    playSound("maldad");
    showToast("BRIBE ACCEPTED // APPROACHING SACHET");
    clearTimeout(foodTimeout);
    foodTimeout = setTimeout(() => {
      placeCat(targetX, targetY);
      setState("eat", {sound:"comer"});
      sachet.classList.add("being-eaten");
      setTimeout(() => sachet.classList.remove("being-eaten"), 700);
      showToast("SACHET CONSUMED // 120 SEC OF PEACE");
      foodTimeout = setTimeout(() => setState("idle"), 3200);
    }, 850);
  }

  // Place Pudin at the lower-right of the room and make every visit begin asleep.
  requestAnimationFrame(() => {
    const b = bounds();

    // Posición inicial provisional
    placeCat(b.w * 0.22, b.h * 0.65);

    setState("sleep");
  });

  pudin.addEventListener("click", () => {
    if (moved) return;
    if (state === "sleep") return wake();
    if (state === "angry") { setState("idle"); return; }
    setState("pet", {sound:"salto"});
    setTimeout(() => { if (!dragging && state === "pet") setState("idle"); }, 1600);
  });

  pudin.addEventListener("pointerdown", e => {
    wake();
    dragging = true; moved = false; downAt = performance.now();
    pudin.setPointerCapture(e.pointerId);
    const r = pudin.getBoundingClientRect(), s = scene.getBoundingClientRect();
    offsetX = e.clientX - r.left; offsetY = e.clientY - r.top;
    dragStartX = e.clientX - s.left; dragStartY = e.clientY - s.top;
    pudin.style.transition = "none";
    clearTimeout(angryTimer);
    angryTimer = setTimeout(() => {
      if (dragging) {
        setState("angry", {sound:"hiss"});
        showToast("WARNING: CAT TEMPER EXCEEDED");
      }
    }, 2000);
  });
  pudin.addEventListener("pointermove", e => {
    if (!dragging) return;
    const s = scene.getBoundingClientRect();
    const nx = e.clientX - s.left - offsetX, ny = e.clientY - s.top - offsetY;
    if (Math.abs(e.clientX - s.left - dragStartX) + Math.abs(e.clientY - s.top - dragStartY) > 6) moved = true;
    if (moved) {
      facingLeft = nx < x;
      placeCat(nx, ny);
      if (state !== "angry") setState("walk");
    }
  });
  function stopDrag() {
    if (!dragging) return;
    dragging = false; clearTimeout(angryTimer);
    pudin.style.transition = "";
    if (state === "angry") {
      setTimeout(() => { if (!dragging && state === "angry") setState("idle"); }, 1300);
    } else if (moved) {
      setState("idle");
    }
    setTimeout(() => moved = false, 80);
  }
  pudin.addEventListener("pointerup", stopDrag);
  pudin.addEventListener("pointercancel", stopDrag);

  document.querySelectorAll("[data-action]").forEach(button => button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "sleep") { setState("sleep", {sound:"mimir"}); return; }
    wake();
    if (action === "pet") { setState("pet", {sound:"salto"}); setTimeout(() => { if (state === "pet") setState("idle"); }, 1500); }
    if (action === "dance") { setState("dance"); showToast("MUSIC DETECTOR: MANUAL OVERRIDE"); }
    if (action === "angry") { setState("angry", {sound:"hiss"}); setTimeout(() => { if (state === "angry") setState("idle"); }, 2200); }
    if (action === "wander") {
      targetX = Math.random() * Math.max(0, bounds().w - 128);
      targetY = bounds().h * (0.40 + Math.random() * 0.28);
      setState("walk"); showToast("AUTOPILOT: WANDER MODE");
    }
    if (action === "prank") {
      playSound("maldad");
      const pranks = [
        "PUDIN_OS: INSTALANDO RONRONEOS.EXE",
        "ALERTA: SE DETECTÓ UNA DEUDA DE SACHETS",
        "ERROR 404: PRODUCTIVIDAD NO ENCONTRADA",
        "SYSTEM OVERRIDE: 5 MINUTOS PARA MIRAR GATOS"
      ];
      showToast(pranks[Math.floor(Math.random() * pranks.length)]);
      scene.classList.add("glitching");
      setTimeout(() => scene.classList.remove("glitching"), 700);
    }
  }));

  sachet.addEventListener("click", offerSachet);

  // Gentle autonomous movement only after waking; no real OS or cursor control.
  setInterval(() => {
    if (dragging || ["sleep","dance","eat","angry"].includes(state)) return;
    if (state === "walk") {
      const dx = targetX - x, dy = targetY - y, dist = Math.hypot(dx, dy);
      if (dist < 7) { setState("idle"); return; }
      const step = Math.min(3.2, dist);
      facingLeft = dx < 0;
      placeCat(x + dx / dist * step, y + dy / dist * step);
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

      // Cambia de emisora solo cuando la URL es diferente.
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
    } catch (error) {
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

    // Si la radio ya estaba sonando, cambia de emisora.
    if (ambientPlaying) {
      playAmbient();
    }
  }

  musicOptions.forEach(button => {
    button.addEventListener("click", () => {
      selectStation(button.dataset.mode);

      if (state !== "sleep" && state !== "angry") {
        setState("dance");
      }
    });
  });

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
    updateMusicNote(
      "La emisora no está disponible en este momento."
    );
  });

  if (musicVolume) {
    musicVolume.addEventListener("input", event => {
      ambientAudio.volume = Number(event.target.value) / 100;
    });
  }

  selectStation("lofi");
  updateMusicButton();
  
  
  document.querySelector("#panel-toggle").addEventListener("click", () => {
    const panel = document.querySelector("#control-panel");
    const closed = panel.classList.toggle("closed");
    const toggle = document.querySelector("#panel-toggle");
    toggle.setAttribute("aria-expanded", String(!closed));
    toggle.innerHTML = closed ? "☰ <span>CONTROLES</span>" : "✕ <span>OCULTAR</span>";
  });
  document.querySelector("#volume").addEventListener("input", e => {
    const volume = Number(e.target.value) / 100;

    Object.values(sounds).forEach(audio => {
      audio.volume = volume;
    });
  });

  // Pomodoro with selectable focus and break periods.
  let duration = 25 * 60, remaining = duration, interval = null;
  const timer = document.querySelector("#timer"), progress = document.querySelector("#timer-progress");
  const start = document.querySelector("#timer-start"), message = document.querySelector("#timer-message");
  function renderTimer() {
    const m = Math.floor(remaining / 60), s = remaining % 60;
    timer.textContent = `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
    progress.style.width = `${100 * (1 - remaining / duration)}%`;
  }
  function stopTimer() { if (interval) clearInterval(interval); interval = null; start.textContent = "▶ CONTINUAR"; }
  function tick() {
    if (remaining > 0) { remaining--; renderTimer(); return; }
    stopTimer(); start.textContent = "▶ INICIAR";
    message.textContent = "¡PROTOCOLO COMPLETADO! Pudin exige su paga en sachets. 🍣";
    setState("dance"); playSound("maldad"); showToast("FOCUS COMPLETE // CAT APPROVED");
  }
  document.querySelectorAll(".mode-button").forEach(button => button.addEventListener("click", () => {
    stopTimer(); duration = Number(button.dataset.minutes) * 60; remaining = duration;
    document.querySelectorAll(".mode-button").forEach(el => el.classList.toggle("selected", el === button));
    document.querySelector("#timer-mode").textContent = button.dataset.label;
    message.textContent = "Nuevo protocolo cargado."; renderTimer(); start.textContent = "▶ INICIAR";
  }));
  start.addEventListener("click", () => {
    if (interval) { stopTimer(); return; }
    if (remaining === 0) remaining = duration;
    interval = setInterval(tick, 1000); start.textContent = "Ⅱ PAUSAR";
    message.textContent = "Sesión en curso. Pudin está supervisando… desde su cama.";
  });
  document.querySelector("#timer-reset").addEventListener("click", () => {
    stopTimer(); remaining = duration; renderTimer(); start.textContent = "▶ INICIAR";
    message.textContent = "Temporizador reiniciado."; 
  });
  renderTimer();

  window.addEventListener("resize", () => placeCat(x, y));
})();


(() => {
  'use strict';

  // ==========================================
  // PUDIN.EXE // DREAMCORE GLITCH CAT
  // Clipboard · Neon Paws · Matrix Cosmos
  // ==========================================

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  function onMotionPreferenceChange(callback) {
    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', callback);
    } else if (typeof reducedMotion.addListener === 'function') {
      reducedMotion.addListener(callback);
    }
  }

  // ------------------------------------------
  // 1. COPIAR COMANDOS DE INSTALACIÓN
  // ------------------------------------------

  (() => {
    const button = document.querySelector('#copy-commands');
    const status = document.querySelector('#copy-status');
    const code = document.querySelector('#install-commands code');

    if (!button || !status || !code) return;

    const commands = [
      'git clone https://github.com/KaledSML/Pudin-Ghost-Cat-RPA.git',
      'cd Pudin-Ghost-Cat-RPA',
      'pip install -r requirements.txt',
      'cd pudin_cat',
      'python main.py'
    ];

    const originalLabel = button.getAttribute('aria-label');

    async function copyText(text) {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }

      const textarea = document.createElement('textarea');

      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.setAttribute('aria-hidden', 'true');

      Object.assign(textarea.style, {
        position: 'fixed',
        left: '-9999px',
        top: '0',
        opacity: '0'
      });

      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);

      let success = false;

      try {
        success = document.execCommand('copy');
      } finally {
        textarea.remove();
      }

      if (!success) {
        throw new Error('No se pudo copiar el texto.');
      }
    }

    button.addEventListener('click', async () => {
      button.disabled = true;
      status.textContent = 'Copiando comandos...';

      try {
        await copyText(commands.join('\n'));

        status.textContent = '✓ Copiado al portapapeles';
        button.setAttribute('aria-label', 'Comandos copiados');
      } catch (error) {
        status.textContent =
          'No se pudo copiar. Selecciona los comandos manualmente.';

        console.error('[PUDIN] Error al copiar comandos:', error);
      } finally {
        button.disabled = false;

        if (originalLabel) {
          button.setAttribute('aria-label', originalLabel);
        } else {
          button.removeAttribute('aria-label');
        }
      }
    });
  })();


  // ------------------------------------------
  // 2. HUELLITAS NEÓN DEL CURSOR 🐾
  // ------------------------------------------

  (() => {
    const pawColors = [
      '#ff65c8',
      '#70fff1',
      '#d9ff70',
      '#b58aff',
      '#ffad70'
    ];

    const maxPaws = 36;
    const pawLifetime = 1200;

    let lastX = null;
    let lastY = null;
    let lastTime = 0;
    let pawIndex = 0;
    let motionEnabled = !reducedMotion.matches;

    const activePaws = new Map();

    function removePaw(paw) {
      const timeout = activePaws.get(paw);

      if (timeout !== undefined) {
        window.clearTimeout(timeout);
        activePaws.delete(paw);
      }

      paw.remove();
    }

    function createPaw(x, y) {
      // Evita acumular demasiados elementos si hay mucho movimiento.
      if (activePaws.size >= maxPaws) {
        const oldestPaw = activePaws.keys().next().value;

        if (oldestPaw) removePaw(oldestPaw);
      }

      const paw = document.createElement('span');

      paw.className = 'neon-paw';
      paw.setAttribute('aria-hidden', 'true');

      const toes = document.createDocumentFragment();

      for (let i = 0; i < 4; i++) {
        const toe = document.createElement('i');
        toe.className = 'toe';
        toes.appendChild(toe);
      }

      const pad = document.createElement('b');
      pad.className = 'pad';
      toes.appendChild(pad);

      paw.appendChild(toes);

      paw.style.left = `${x - 12}px`;
      paw.style.top = `${y - 13}px`;

      paw.style.setProperty(
        '--paw-color',
        pawColors[pawIndex % pawColors.length]
      );

      paw.style.setProperty(
        '--paw-rotation',
        `${Math.random() * 36 - 18}deg`
      );

      pawIndex++;

      document.body.appendChild(paw);

      const timeout = window.setTimeout(() => {
        removePaw(paw);
      }, pawLifetime);

      activePaws.set(paw, timeout);

      paw.addEventListener('animationend', () => {
        removePaw(paw);
      }, { once: true });
    }

    function clearPaws() {
      for (const paw of activePaws.keys()) {
        removePaw(paw);
      }

      lastX = null;
      lastY = null;
      lastTime = 0;
    }

    function handlePointerMove(event) {
      if (!motionEnabled || reducedMotion.matches) return;
      if (document.hidden) return;
      if (event.pointerType === 'touch') return;

      const x = event.clientX;
      const y = event.clientY;
      const now = performance.now();

      if (lastX === null || lastY === null) {
        lastX = x;
        lastY = y;
        lastTime = now;
        return;
      }

      const distance = Math.hypot(x - lastX, y - lastY);
      const elapsed = now - lastTime;

      if (distance < 24 || elapsed < 35) return;

      createPaw(x, y);

      lastX = x;
      lastY = y;
      lastTime = now;
    }

    window.addEventListener('pointermove', handlePointerMove, {
      passive: true
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearPaws();
    });

    onMotionPreferenceChange((event) => {
      motionEnabled = !event.matches;

      if (!motionEnabled) {
        clearPaws();
      }
    });
  })();


  // ------------------------------------------
  // 3. MATRIX COSMOS // DIGITAL DREAM
  // ------------------------------------------

  (() => {
    const canvas = document.querySelector('#matrix-cosmos');

    if (!canvas) return;

    const hero = canvas.closest('.hero');

    if (!hero) {
      console.warn('[PUDIN] #matrix-cosmos debe estar dentro de .hero.');
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const fontSize = 18;
    const frameInterval = 45;

    const colors = [
      '#70fff1',
      '#ff65c8',
      '#d9ff70',
      '#b58aff',
      '#ffad70'
    ];

    const characters =
      '01アイウエオカキクケコサシスセソタチツテトネコ';

    const secretMessages = [
      'MEOW',
      'PUDIN.EXE',
      '010101',
      'GHOST_CAT',
      'SYSTEM_OK',
      'NEKO',
      'PURR.exe'
    ];

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let columns = 0;
    let drops = [];
    let animationFrame = null;
    let lastFrame = 0;
    let running = false;
    let heroVisible = true;

    let resizeObserver = null;
    let intersectionObserver = null;

    // ----------------------------------------
    // Tamaño y resolución
    // ----------------------------------------

    function resizeCanvas() {
      const bounds = hero.getBoundingClientRect();

      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));

      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);

      ctx.setTransform(
        pixelRatio, 0,
        0, pixelRatio,
        0, 0
      );

      columns = Math.ceil(width / fontSize);

      drops = Array.from(
        { length: columns },
        () => Math.random() * (height / fontSize)
      );

      ctx.clearRect(0, 0, width, height);
    }

    // ----------------------------------------
    // Desvanecimiento de la Matrix
    // ----------------------------------------

    function fadeCanvas() {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // ----------------------------------------
    // Dibujar caracteres y mensajes secretos
    // ----------------------------------------

    function drawMatrix(timestamp = 0) {
      if (!running || reducedMotion.matches || document.hidden) {
        stopAnimation();
        return;
      }

      if (timestamp - lastFrame < frameInterval) {
        animationFrame = requestAnimationFrame(drawMatrix);
        return;
      }

      lastFrame = timestamp;

      fadeCanvas();

      ctx.textBaseline = 'top';

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const color = colors[
          Math.floor(Math.random() * colors.length)
        ];

        const showMessage = Math.random() < 0.006;

        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;

        if (showMessage) {
          const message = secretMessages[
            Math.floor(Math.random() * secretMessages.length)
          ];

          ctx.font = 'bold 12px monospace';
          ctx.globalAlpha = 0.85;
          ctx.shadowBlur = 9;
          ctx.shadowColor = color;
          ctx.fillText(message, x, y);
        } else {
          const character = characters[
            Math.floor(Math.random() * characters.length)
          ];

          ctx.font = `${fontSize}px monospace`;
          ctx.globalAlpha = Math.random() * 0.4 + 0.2;
          ctx.fillText(character, x, y);
        }

        ctx.restore();

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += 0.45 + Math.random() * 0.4;
        }
      }

      animationFrame = requestAnimationFrame(drawMatrix);
    }

    // ----------------------------------------
    // Inicio y parada
    // ----------------------------------------

    function stopAnimation() {
      running = false;

      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    }

    function startAnimation() {
      stopAnimation();

      if (
        reducedMotion.matches ||
        document.hidden ||
        !heroVisible
      ) {
        return;
      }

      running = true;
      lastFrame = 0;

      animationFrame = requestAnimationFrame(drawMatrix);
    }

    // ----------------------------------------
    // Visibilidad de la portada
    // ----------------------------------------

    if ('IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];

        heroVisible = entry.isIntersecting;

        if (heroVisible) {
          startAnimation();
        } else {
          stopAnimation();
        }
      }, {
        threshold: 0
      });

      intersectionObserver.observe(hero);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    });

    // ----------------------------------------
    // Adaptación al tamaño de la portada
    // ----------------------------------------

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });

      resizeObserver.observe(hero);
    } else {
      window.addEventListener('resize', resizeCanvas, {
        passive: true
      });
    }

    resizeCanvas();
    startAnimation();

    onMotionPreferenceChange((event) => {
      if (event.matches) {
        stopAnimation();
        ctx.clearRect(0, 0, width, height);
      } else {
        startAnimation();
      }
    });
  })();


  // ------------------------------------------
  // 4. ARCHIVE ACCESS // TRANSMISSION SELECTOR
  // ------------------------------------------

  (() => {
    const player = document.querySelector('#pudin-video-player');
    const title = document.querySelector('#video-player-title');
    const description = document.querySelector('#video-player-description');

    const buttons = document.querySelectorAll('.video-select');

    if (!player || !title || !description || !buttons.length) {
      return;
    }

    const baseUrl = 'https://www.youtube-nocookie.com/embed/';

    function selectTransmission(button) {
      const videoId = button.dataset.videoId;
      const videoTitle = button.dataset.videoTitle;
      const videoDescription = button.dataset.videoDescription;

      if (!videoId || !videoTitle || !videoDescription) {
        console.warn('[PUDIN] Transmisión incompleta:', button);
        return;
      }

      // Cambiar el vídeo solo si es diferente al actual.
      const nextUrl = `${baseUrl}${videoId}?rel=0`;

      if (player.src !== nextUrl) {
        player.src = nextUrl;
      }

      title.textContent = videoTitle;
      description.textContent = videoDescription;

      // Actualizar el estado visual y accesible de los botones.
      buttons.forEach((item) => {
        const isActive = item === button;

        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });

      console.info('[PUDIN] Transmisión seleccionada:', videoTitle);
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        selectTransmission(button);
      });
    });
  })();

  
})();

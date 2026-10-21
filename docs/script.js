
(() => {
  'use strict';

  // ==========================================
  // PUDIN // GHOST CAT RPA
  // Copy system + Neon Paws + Matrix Cosmos
  // ==========================================

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  // Compatibilidad con navegadores antiguos.
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

    async function copyText(text) {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }

      const textarea = document.createElement('textarea');

      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.setAttribute('aria-hidden', 'true');

      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      textarea.style.opacity = '0';

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
      const text = commands.join('\n');

      try {
        await copyText(text);

        status.textContent = '✓ Copiado al portapapeles';
        button.setAttribute('aria-label', 'Comandos copiados');
      } catch (error) {
        status.textContent =
          'No se pudo copiar. Selecciona los comandos manualmente.';

        console.error('[PUDIN] Error al copiar comandos:', error);
      }
    });
  })();


  // ------------------------------------------
  // 2. HUELLITAS NEÓN DEL CURSOR 🐾
  // ------------------------------------------

  (() => {
    const pawColors = [
      '#52f5ff',
      '#ff3fcb',
      '#ffb347'
    ];

    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    let pawIndex = 0;

    function createPaw(x, y) {
      const paw = document.createElement('span');

      paw.className = 'neon-paw';
      paw.setAttribute('aria-hidden', 'true');

      // Formas propias, no un emoji del sistema operativo.
      paw.innerHTML = `
        <i class="toe"></i>
        <i class="toe"></i>
        <i class="toe"></i>
        <i class="toe"></i>
        <b class="pad"></b>
      `;

      paw.style.left = `${x}px`;
      paw.style.top = `${y}px`;

      paw.style.setProperty(
        '--paw-color',
        pawColors[pawIndex % pawColors.length]
      );

      paw.style.setProperty(
        '--paw-rotation',
        `${Math.random() * 30 - 15}deg`
      );

      pawIndex++;

      document.body.appendChild(paw);

      paw.addEventListener('animationend', () => {
        paw.remove();
      }, { once: true });

      // Respaldo por si la animación CSS no se ejecuta.
      window.setTimeout(() => {
        paw.remove();
      }, 1800);
    }

    function handlePointerMove(event) {
      if (reducedMotion.matches) return;

      // No generar huellas al tocar pantallas táctiles.
      if (event.pointerType === 'touch') return;

      const now = performance.now();
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      const distance = Math.hypot(dx, dy);

      // Evita llenar la pantalla de huellas en movimientos pequeños.
      if (distance < 28 || now - lastTime < 32) return;

      createPaw(event.clientX, event.clientY);

      lastX = event.clientX;
      lastY = event.clientY;
      lastTime = now;
    }

    if (!reducedMotion.matches) {
      window.addEventListener(
        'pointermove',
        handlePointerMove,
        { passive: true }
      );
    }

    onMotionPreferenceChange((event) => {
      if (event.matches) {
        document.querySelectorAll('.neon-paw').forEach((paw) => {
          paw.remove();
        });
      }
    });
  })();


  // ------------------------------------------
  // 3. MATRIX COSMOS: SOLO DENTRO DE .HERO
  // ------------------------------------------

  (() => {
    const canvas = document.querySelector('#matrix-cosmos');

    if (!canvas) return;

    const hero = canvas.closest('.hero');

    if (!hero) {
      console.warn(
        '[PUDIN] Coloca #matrix-cosmos dentro de .hero.'
      );
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const fontSize = 18;

    const colors = [
      '#52f5ff',
      '#43ff9a',
      '#ff3fcb',
      '#ffb347'
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
    let resizeObserver = null;

    // ----------------------------------------
    // Tamaño y resolución del canvas
    // ----------------------------------------

    function resizeCanvas() {
      const bounds = hero.getBoundingClientRect();

      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));

      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);

      canvas.style.width = '100%';
      canvas.style.height = '100%';

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

      drawStaticBackground();
    }

    // ----------------------------------------
    // Resplandor espacial transparente
    // ----------------------------------------

    function drawSpaceGlow() {
      const glow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.2,
        0,
        width * 0.5,
        height * 0.2,
        Math.max(width, height) * 0.8
      );

      glow.addColorStop(0, 'rgba(92, 43, 146, 0.18)');
      glow.addColorStop(0.55, 'rgba(20, 35, 75, 0.08)');
      glow.addColorStop(1, 'rgba(8, 8, 23, 0)');

      // El degradado tiene transparencia real.
      // No se pinta un fondo oscuro rectangular.
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // ----------------------------------------
    // Rejilla cyberpunk de perspectiva
    // ----------------------------------------

    function drawGridOverlay() {
      const horizon = height * 0.58;

      ctx.save();

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = 'rgba(82, 245, 255, 0.15)';

      // Líneas horizontales.
      for (let i = 0; i < 12; i++) {
        const progress = i / 11;

        const y =
          horizon +
          Math.pow(progress, 1.65) * (height - horizon);

        ctx.globalAlpha = 0.12 + progress * 0.32;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Líneas que convergen en el horizonte.
      ctx.globalAlpha = 0.22;

      for (let i = -10; i <= 10; i++) {
        ctx.beginPath();

        ctx.moveTo(
          width / 2 + i * 3,
          horizon
        );

        ctx.lineTo(
          width / 2 + i * width * 0.09,
          height
        );

        ctx.stroke();
      }

      ctx.restore();
    }

    function drawStaticBackground() {
      ctx.clearRect(0, 0, width, height);

      drawSpaceGlow();
      drawGridOverlay();
    }

    // ----------------------------------------
    // Desvanecimiento SIN rectángulo oscuro
    // ----------------------------------------

    function fadeCanvas() {
      ctx.save();

      // Reduce la opacidad de los píxeles existentes.
      // Las zonas transparentes siguen siendo transparentes.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.10)';
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      // Restaurar explícitamente el modo normal de dibujo.
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }

    // ----------------------------------------
    // Animación Matrix
    // ----------------------------------------

    function drawMatrix(timestamp = 0) {
      if (reducedMotion.matches) {
        animationFrame = null;
        return;
      }

      // Limitar la frecuencia para mantener el efecto ligero.
      if (timestamp - lastFrame < 45) {
        animationFrame = requestAnimationFrame(drawMatrix);
        return;
      }

      lastFrame = timestamp;

      // La estela se desvanece sin pintar una capa opaca.
      fadeCanvas();

      // Mantener el ambiente espacial y la rejilla visibles.
      drawSpaceGlow();
      drawGridOverlay();

      ctx.textBaseline = 'top';

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const color =
          colors[Math.floor(Math.random() * colors.length)];

        const showMessage = Math.random() < 0.009;

        if (showMessage) {
          const message =
            secretMessages[
              Math.floor(Math.random() * secretMessages.length)
            ];

          ctx.save();

          ctx.globalCompositeOperation = 'source-over';
          ctx.font = 'bold 12px monospace';
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.85;
          ctx.shadowBlur = 9;
          ctx.shadowColor = color;

          ctx.fillText(message, x, y);

          ctx.restore();
        } else {
          const character =
            characters[
              Math.floor(Math.random() * characters.length)
            ];

          ctx.save();

          ctx.globalCompositeOperation = 'source-over';
          ctx.font = `${fontSize}px monospace`;
          ctx.fillStyle = color;
          ctx.globalAlpha = Math.random() * 0.45 + 0.2;
          ctx.shadowBlur = 0;

          ctx.fillText(character, x, y);

          ctx.restore();
        }

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += 0.45 + Math.random() * 0.4;
        }
      }

      animationFrame = requestAnimationFrame(drawMatrix);
    }

    // ----------------------------------------
    // Inicio y preferencias de movimiento
    // ----------------------------------------

    function startAnimation() {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      drawStaticBackground();

      if (!reducedMotion.matches) {
        lastFrame = 0;
        animationFrame = requestAnimationFrame(drawMatrix);
      }
    }

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

    onMotionPreferenceChange(startAnimation);
  })();

})();

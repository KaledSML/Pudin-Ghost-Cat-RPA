
/* =========================================================
   PUDIN.EXE | NEON COSMOS
   Matrix localizado + mensajes secretos + huellitas
   ========================================================= */


/* ---------------------------------------------------------
   1. BOTÓN PARA COPIAR LOS COMANDOS DE INSTALACIÓN
   --------------------------------------------------------- */

(() => {
  const button = document.querySelector('#copy-commands');
  const status = document.querySelector('#copy-status');
  const code = document.querySelector('#install-commands code');

  if (!button || !status || !code) return;

  button.addEventListener('click', async () => {
    const commands = [
      'git clone https://github.com/KaledSML/Pudin-Ghost-Cat-RPA.git',
      'cd Pudin-Ghost-Cat-RPA',
      'pip install -r requirements.txt',
      'cd pudin_cat',
      'python main.py'
    ].join('\n');

    try {
      await navigator.clipboard.writeText(commands);
      status.textContent = '✓ Copiado al portapapeles';
    } catch {
      const field = document.createElement('textarea');

      field.value = commands;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.left = '-9999px';
      field.style.top = '0';

      document.body.appendChild(field);
      field.select();

      let copied = false;

      try {
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      }

      field.remove();

      status.textContent = copied
        ? '✓ Copiado al portapapeles'
        : 'No se pudo copiar. Selecciona los comandos manualmente.';
    }
  });
})();


/* ---------------------------------------------------------
   2. HUELLITAS DE NEÓN DE PUDIN 🐾
   --------------------------------------------------------- */

(() => {
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  if (reducedMotion.matches) return;

  const colors = ['#63f7ff', '#ff58c8', '#ffad66'];

  let lastX = null;
  let lastY = null;
  let lastTime = 0;

  document.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches) return;
    if (event.pointerType === 'touch') return;

    const x = event.clientX;
    const y = event.clientY;
    const now = performance.now();

    if (lastX !== null && lastY !== null) {
      const distance = Math.hypot(x - lastX, y - lastY);

      if (distance < 30 || now - lastTime < 38) return;
    }

    lastX = x;
    lastY = y;
    lastTime = now;

    const paw = document.createElement('div');

    paw.className = 'neon-paw';
    paw.setAttribute('aria-hidden', 'true');
    paw.style.left = `${x - 12}px`;
    paw.style.top = `${y - 13}px`;

    const color = colors[
      Math.floor(Math.random() * colors.length)
    ];

    paw.style.setProperty('--paw-color', color);
    paw.style.rotate = `${Math.random() * 50 - 25}deg`;

    paw.innerHTML = `
      <span class="toe"></span>
      <span class="toe"></span>
      <span class="toe"></span>
      <span class="toe"></span>
      <span class="pad"></span>
    `;

    document.body.appendChild(paw);

    paw.addEventListener('animationend', () => {
      paw.remove();
    }, { once: true });

  }, { passive: true });

  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) {
      document.querySelectorAll('.neon-paw').forEach((paw) => {
        paw.remove();
      });
    }
  });
})();


/* ---------------------------------------------------------
   3. MATRIX CÓSMICO
   Solo portada + mensajes secretos de Pudin
   --------------------------------------------------------- */

(() => {
  const canvas = document.querySelector('#matrix-cosmos');

  if (!canvas) return;

  const context = canvas.getContext('2d');

  if (!context) return;

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  /*
   * Si el canvas estaba en el body, lo movemos a la portada.
   * Así el efecto deja de cubrir toda la página.
   */
  const hero = document.querySelector('.hero');

  if (hero && !hero.contains(canvas)) {
    hero.prepend(canvas);
  }

  const host = hero || canvas.parentElement || document.body;

  const characters =
    '010101アイウエオカキクケコサシスセソネコ';

  const secretMessages = [
    'MEOW',
    'PUDIN.EXE',
    '010101',
    'GHOST_CAT',
    'SYSTEM_OK',
    'NEKO',
    'PURR.exe'
  ];

  const colors = [
    '#63f7ff',
    '#80ffcf',
    '#ff58c8',
    '#ffad66'
  ];

  const fontSize = 18;

  let width = 0;
  let height = 0;
  let columns = 0;
  let drops = [];
  let animationFrame = null;
  let lastFrame = 0;
  let resizeObserver = null;

  function resizeCanvas() {
    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      1.5
    );

    const bounds = host.getBoundingClientRect();

    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);

    canvas.style.width = '100%';
    canvas.style.height = '100%';

    context.setTransform(
      pixelRatio, 0,
      0, pixelRatio,
      0, 0
    );

    columns = Math.ceil(width / fontSize);

    drops = Array.from(
      { length: columns },
      () => Math.random() * (height / fontSize)
    );

    startAnimation();
  }

  function drawStaticBackground() {
    context.clearRect(0, 0, width, height);

    // Nebulosa tenue, sin una capa oscura opaca.
    const glow = context.createRadialGradient(
      width * 0.58,
      height * 0.42,
      0,
      width * 0.58,
      height * 0.42,
      Math.max(width, height) * 0.72
    );

    glow.addColorStop(0, 'rgba(99, 247, 255, 0.07)');
    glow.addColorStop(0.45, 'rgba(132, 72, 210, 0.055)');
    glow.addColorStop(0.78, 'rgba(255, 88, 200, 0.025)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    // Rejilla de videojuego concentrada en la parte inferior.
    drawGridOverlay();
  }

  function drawGridOverlay() {
    const horizon = height * 0.69;
    const centerX = width / 2;
    const gridBottom = height * 1.03;

    context.save();

    context.lineWidth = 1;
    context.strokeStyle = 'rgba(99, 247, 255, 0.13)';

    // Líneas horizontales con perspectiva.
    for (let i = 0; i <= 11; i++) {
      const progress = i / 11;
      const y = horizon + (
        (gridBottom - horizon) * progress * progress
      );

      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    // Líneas que convergen en el horizonte.
    for (let i = -10; i <= 10; i++) {
      const bottomX = centerX + i * width / 10;

      context.beginPath();
      context.moveTo(centerX, horizon);
      context.lineTo(bottomX, gridBottom);
      context.stroke();
    }

    context.restore();
  }

  function drawMatrix(timestamp = 0) {
    if (reducedMotion.matches) return;

    // Mantener una animación ligera.
    if (timestamp - lastFrame < 45) {
      animationFrame = requestAnimationFrame(drawMatrix);
      return;
    }

    lastFrame = timestamp;

    // Desvanecimiento para dejar estelas delicadas.
    context.fillStyle = 'rgba(8, 8, 23, 0.12)';
    context.fillRect(0, 0, width, height);

    drawGridOverlay();

    context.font =
      `13px "Courier New", monospace`;

    context.textBaseline = 'middle';

    for (let i = 0; i < drops.length; i++) {
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // De vez en cuando aparece una palabra legible.
      const showMessage = Math.random() < 0.018;

      let token = showMessage
        ? secretMessages[
            Math.floor(Math.random() * secretMessages.length)
          ]
        : characters[
            Math.floor(Math.random() * characters.length)
          ];

      // Evitar que las palabras largas se salgan por el borde.
      if (
        x + context.measureText(token).width > width
      ) {
        token = characters[
          Math.floor(Math.random() * characters.length)
        ];
      }

      const color = colors[
        Math.floor(Math.random() * colors.length)
      ];

      context.save();
      context.fillStyle = color;
      context.globalAlpha = showMessage ? 0.88 : Math.random() * 0.4 + 0.16;

      if (showMessage) {
        context.shadowColor = color;
        context.shadowBlur = 9;
      }

      context.fillText(token, x, y);
      context.restore();

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      } else {
        drops[i] += 0.35 + Math.random() * 0.38;
      }
    }

    animationFrame = requestAnimationFrame(drawMatrix);
  }

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

  resizeCanvas();

  window.addEventListener('resize', resizeCanvas, {
    passive: true
  });

  // También reacciona si cambia el tamaño de la portada.
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    resizeObserver.observe(host);
  }

  reducedMotion.addEventListener('change', startAnimation);
})();

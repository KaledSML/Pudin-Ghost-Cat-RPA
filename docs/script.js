/* =========================================================
   PUDIN.EXE | COSMIC MATRIX
   JavaScript completo
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
      // Alternativa para navegadores sin acceso al portapapeles.
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

  // No crear efectos animados si el usuario los ha desactivado.
  if (reducedMotion.matches) return;

  const colors = [
    '#52f5ff',
    '#ff3fcb',
    '#ffb347'
  ];

  let lastX = null;
  let lastY = null;
  let lastTime = 0;

  document.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches) return;

    // Evitar huellas al usar una pantalla táctil.
    if (event.pointerType === 'touch') return;

    const x = event.clientX;
    const y = event.clientY;
    const now = performance.now();

    // La primera huella puede aparecer inmediatamente.
    if (lastX !== null && lastY !== null) {
      const distance = Math.hypot(
        x - lastX,
        y - lastY
      );

      // Limitar la cantidad de elementos creados.
      if (distance < 28 || now - lastTime < 32) return;
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

    // Eliminar cada huella cuando termine su animación.
    paw.addEventListener('animationend', () => {
      paw.remove();
    }, { once: true });

  }, { passive: true });

  // Limpiar las huellas si se activa el modo accesible.
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) {
      document.querySelectorAll('.neon-paw').forEach((paw) => {
        paw.remove();
      });
    }
  });
})();


/* ---------------------------------------------------------
   3. MATRIX CÓSMICO: LLUVIA DIGITAL Y REJILLA HOLOGRÁFICA
   --------------------------------------------------------- */

(() => {
  const canvas = document.querySelector('#matrix-cosmos');

  // El canvas se añadirá al HTML en el siguiente bloque.
  if (!canvas) return;

  const context = canvas.getContext('2d');

  if (!context) return;

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  const characters =
    '01アイウエオカキクケコサシスセソタチツテトネコ';

  const fontSize = 18;
  const colors = [
    '#52f5ff',
    '#43ff9a',
    '#ff3fcb',
    '#ffb347'
  ];

  let width = 0;
  let height = 0;
  let columns = 0;
  let drops = [];
  let animationFrame = null;
  let lastFrame = 0;

  // Ajustar el canvas a la pantalla sin exigir demasiada GPU.
  function resizeCanvas() {
    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      1.5
    );

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

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

    drawStaticBackground();
  }

  // Dibujar un fondo fijo para el modo de movimiento reducido.
  function drawStaticBackground() {
    context.clearRect(0, 0, width, height);

    // Bruma holográfica.
    const glow = context.createRadialGradient(
      width * 0.5,
      height * 0.45,
      0,
      width * 0.5,
      height * 0.45,
      Math.max(width, height) * 0.7
    );

    glow.addColorStop(0, 'rgba(40, 80, 150, 0.07)');
    glow.addColorStop(0.55, 'rgba(255, 63, 203, 0.025)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    // Rejilla de perspectiva en la zona inferior.
    context.lineWidth = 1;
    context.strokeStyle = 'rgba(82, 245, 255, 0.12)';

    const horizon = height * 0.64;
    const centerX = width / 2;
    const gridBottom = height * 1.15;

    for (let i = 0; i <= 12; i++) {
      const progress = i / 12;
      const y = horizon + (
        (gridBottom - horizon) * progress * progress
      );

      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    for (let i = -12; i <= 12; i++) {
      const bottomX = centerX + i * width / 12;

      context.beginPath();
      context.moveTo(centerX, horizon);
      context.lineTo(bottomX, gridBottom);
      context.stroke();
    }
  }

  // Dibujar una pasada de lluvia Matrix.
  function drawMatrix(timestamp = 0) {
    if (reducedMotion.matches) return;

    // Limitar la frecuencia de dibujo para mantenerlo ligero.
    if (timestamp - lastFrame < 45) {
      animationFrame = requestAnimationFrame(drawMatrix);
      return;
    }

    lastFrame = timestamp;

    // Desvanecer suavemente los caracteres anteriores.
    context.fillStyle = 'rgba(7, 6, 17, 0.13)';
    context.fillRect(0, 0, width, height);

    // Recuperar la rejilla holográfica bajo la lluvia digital.
    drawGridOverlay();

    context.font = `${fontSize}px ${getComputedStyle(document.body).fontFamily}`;

    for (let i = 0; i < drops.length; i++) {
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      const character = characters[
        Math.floor(Math.random() * characters.length)
      ];

      const color = colors[
        Math.floor(Math.random() * colors.length)
      ];

      context.fillStyle = color;
      context.globalAlpha = Math.random() * 0.45 + 0.2;
      context.fillText(character, x, y);

      context.globalAlpha = 1;

      // Reiniciar algunas columnas a distintas alturas.
      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      } else {
        drops[i] += 0.45 + Math.random() * 0.4;
      }
    }

    animationFrame = requestAnimationFrame(drawMatrix);
  }

  function drawGridOverlay() {
    const horizon = height * 0.64;
    const centerX = width / 2;
    const gridBottom = height * 1.15;

    context.save();
    context.lineWidth = 1;
    context.strokeStyle = 'rgba(82, 245, 255, 0.10)';

    for (let i = 0; i <= 12; i++) {
      const progress = i / 12;
      const y = horizon + (
        (gridBottom - horizon) * progress * progress
      );

      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    for (let i = -12; i <= 12; i++) {
      const bottomX = centerX + i * width / 12;

      context.beginPath();
      context.moveTo(centerX, horizon);
      context.lineTo(bottomX, gridBottom);
      context.stroke();
    }

    context.restore();
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
  startAnimation();

  window.addEventListener('resize', resizeCanvas, {
    passive: true
  });

  reducedMotion.addEventListener('change', startAnimation);
})();

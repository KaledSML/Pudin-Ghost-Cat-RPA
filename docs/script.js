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
    ].join('\\n');

    try {
      await navigator.clipboard.writeText(commands);
      status.textContent = '✓ Copiado al portapapeles';
    } catch {
      const field = document.createElement('textarea');
      field.value = commands;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      status.textContent = copied
        ? '✓ Copiado al portapapeles'
        : 'No se pudo copiar. Selecciona los comandos manualmente.';
    }
  });
})();


/* 🐾 RASTRO DE PATITAS NEÓN */

(() => {
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  if (reducedMotion.matches) return;

  const colors = ['#52f5ff', '#ff3fcb', '#ffb347'];

  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;

  document.addEventListener('pointermove', (event) => {
    // No dibujar el rastro al usar pantallas táctiles.
    if (event.pointerType === 'touch') return;

    const x = event.clientX;
    const y = event.clientY;
    const now = performance.now();

    const distance = Math.hypot(x - lastX, y - lastY);

    // Espaciar las huellitas para evitar una mancha de neón.
    if (distance < 30 || now - lastTime < 35) return;

    lastX = x;
    lastY = y;
    lastTime = now;

    const paw = document.createElement('div');
    paw.className = 'neon-paw';

    paw.style.left = `${x - 12}px`;
    paw.style.top = `${y - 13}px`;
    paw.style.setProperty(
      '--paw-color',
      colors[Math.floor(Math.random() * colors.length)]
    );

    // Alternar la orientación de las patitas.
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

  // Si el usuario activa reducción de movimiento,
  // quitar inmediatamente las huellitas existentes.
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) {
      document.querySelectorAll('.neon-paw').forEach(
        paw => paw.remove()
      );
    }
  });
})();


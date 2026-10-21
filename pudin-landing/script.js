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

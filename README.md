<div align="center">

<img src="/pudin_banner_readme.png" alt="Pudin, el gato fantasma naranja, en su guarida cyberpunk" width="100%">

# PUDIN.EXE

### `UNEXPECTED ENTITY FOUND IN YOUR DESKTOP`

**Un gato fantasma naranja que ha decidido que tu ordenador también es suyo.**

Una mascota de escritorio en Python, animada con Pygame, alimentada por sachets y programada con una preocupante falta de respeto por la productividad.

[🌐 **EXPLORAR LA GUARIDA**](https://kaledsml.github.io/Pudin-Ghost-Cat-RPA/) · [▶ **VER A PUDIN EN ACCIÓN**](https://youtu.be/UMO3PvRJNPc) · [🐈‍⬛ **CÓDIGO FUENTE**](https://github.com/KaledSML/Pudin-Ghost-Cat-RPA)

![Windows](https://img.shields.io/badge/PLATFORM-Windows-00d9ff?style=flat-square&logo=windows&logoColor=white)
![Python](https://img.shields.io/badge/BUILT_WITH-Python-ffd166?style=flat-square&logo=python&logoColor=black)
![Pygame](https://img.shields.io/badge/POWERED_BY-Pygame-ff4fd8?style=flat-square)
![License](https://img.shields.io/badge/LICENSE-MIT-9effa9?style=flat-square)

<img src="docs/assets/pudin_gif.gif" alt="Pudin ejecutando sus protocolos paranormales" width="380">

`SYSTEM STATUS: HAUNTED`  
`ENTITY STATUS: VERY MUCH ONLINE`

</div>

---

> [!CAUTION]
> **Pudin puede modificar tu escritorio.**
>
> Cambia el fondo de pantalla, minimiza y sacude ventanas, mueve el cursor, escribe automáticamente en el Bloc de notas y abre YouTube. Guarda tu trabajo antes de ejecutarlo y no lo utilices durante tareas sensibles. El fondo de pantalla original no se restaura automáticamente.

## ◈ UNA PRESENCIA INEXPLICABLE

<div align="center">

<img src="docs/assets/pudin_gif.gif" alt="Pudin, entidad paranormal de escritorio" width="260">

**Un gato fantasma. Un escritorio. Ningún respeto por tu productividad.**

Sigue el cursor, deja huellas de neón y hace lo que le da la gana.

`STATUS: HAUNTING YOUR DESKTOP`

</div>

## ◈ HABILIDADES PARANORMALES

<table>
<tr>
<td align="center" width="50%">

<img src="pudin_cat/assets/walk.png" alt="Pudin caminando" width="140">

### 🐾 Rastros espectrales

Huellas magenta y partículas neón.

</td>
<td align="center" width="50%">

<img src="pudin_cat/assets/dance.png" alt="Pudin bailando" width="140">

### 🪩 Detección musical

Si detecta YouTube o Spotify, ¡a bailar!

</td>
</tr>
<tr>
<td align="center" width="50%">

<img src="pudin_cat/assets/angry.png" alt="Pudin enfadado" width="140">

### 👻 Motor del caos

Ventanas sacudidas, minimizadas y escritura fantasma.

</td>
<td align="center" width="50%">

<img src="pudin_cat/assets/sit.png" alt="Pudin sentado" width="140">

### 🍅 Pomodoro inverso

25 minutos de trabajo. 5 de descanso. YouTube al final.

</td>
</tr>
<tr>
<td align="center" width="50%">

<img src="docs/assets/sachet.png" alt="Sachet de comida de Pudin" width="140">

### 🍣 Economía del sachet

Dale comida y consigue 120 segundos de tregua.

</td>
<td align="center" width="50%">

<img src="pudin_cat/assets/angry.png" alt="Pudin en modo furioso" width="140">

### 😾 Modo furioso

Arrástralo demasiado y podría secuestrar tu cursor durante 3 a 5 segundos.

</td>
</tr>
</table>

<div align="center">

*No es un asistente de productividad. Es el motivo por el que necesitas uno.*

</div>

---

## ◈ Primer contacto

### Lo que necesitas

Pudin está diseñado para **Windows** y utiliza APIs propias de ese sistema operativo.

Necesitarás:

- Python 3.
- Las dependencias del proyecto.
- Un entorno Windows con soporte de audio.
- Todos los recursos de la carpeta `pudin_cat/assets/`.

Descarga Python desde [python.org](https://www.python.org/downloads/) si todavía no lo tienes.

### 1. Obtener los archivos

```bash
git clone https://github.com/KaledSML/Pudin-Ghost-Cat-RPA.git
cd Pudin-Ghost-Cat-RPA
```

También puedes descargar el repositorio como ZIP desde GitHub.

### 2. Crear un entorno aislado

En PowerShell:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Si utilizas CMD:

```bat
.venv\Scripts\activate.bat
```

### 3. Instalar las dependencias

Desde la raíz del repositorio:

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

El proyecto utiliza:

| Paquete | Propósito |
|---|---|
| `pygame` | Ventana, animaciones, imágenes y audio |
| `pyautogui` | Movimiento del cursor y escritura simulada |
| `pywin32` | Integración con ventanas y APIs de Windows |
| `pyinstaller` | Generación del ejecutable |

### 4. Despertar a la entidad

La estructura del proyecto sitúa el código principal en la raíz y los recursos de la aplicación en `pudin_cat/assets/`. Sin embargo, el código compartido carga los recursos desde una carpeta `assets/` relativa a la ubicación de ejecución.

**Antes de iniciar el programa, comprueba que la carpeta de recursos esté donde la espera `utils.py`.** Si estás usando exactamente la estructura del repositorio que compartiste, puede ser necesario ajustar las rutas de recursos o colocar los archivos Python y `assets/` en una estructura coherente.

Cuando las rutas estén preparadas, ejecuta desde la carpeta que contiene `main.py`:

```bash
python main.py
```

Si todo está correctamente configurado, Pudin aparecerá en tu escritorio.

`BOOT SEQUENCE: COMPLETE` 🐾

---

## ◈ Fabricar una entidad independiente

El repositorio incluye `Pudin_Ghost_Cat.spec`, la configuración de PyInstaller para construir el ejecutable.

Desde la raíz del proyecto, con las dependencias instaladas:

```bash
python -m PyInstaller Pudin_Ghost_Cat.spec
```

La configuración define el nombre `Pudin_Ghost_Cat`, incorpora el icono `assets/Pudin.ico`, empaqueta los recursos desde `assets/` y desactiva la consola.

El archivo `.spec` espera encontrar `main.py` y `assets/` en las ubicaciones configuradas respecto al directorio de compilación. Como la estructura compartida ubica los recursos de la aplicación en `pudin_cat/assets/`, **es necesario alinear las rutas del `.spec` y las del código antes de considerar la compilación lista**.

Tras compilar, revisa el resultado en `dist/` y prueba el ejecutable en Windows. No distribuyas una compilación sin verificar que puede cargar sus imágenes, sonidos y fondo de pantalla.

Un archivo `.exe` no vuelve inofensivas las acciones de Pudin. Solo las empaqueta.

---

## ◈ El laboratorio

El archivo `test_maldades.py` contiene un pequeño panel para lanzar manualmente una broma aleatoria.

Desde la carpeta que contiene el script:

```bash
python test_maldades.py
```

- Pulsa `1` para ejecutar una broma.
- Pulsa `ESC` para cerrar el panel.

Para que la prueba funcione como se espera, Pudin debe estar ejecutándose y su ventana debe poder identificarse correctamente. Guarda tu trabajo antes de probar cualquier acción.

`TEST SUBJECT: YOUR DESKTOP`

---

## ◈ Controles de supervivencia

| Entrada | Acción |
|---|---|
| Clic izquierdo sobre Pudin | Agarrar y arrastrar |
| Arrastrar durante más de 2 segundos | Posible activación del modo furioso |
| Clic derecho | Dejar un sachet |
| `F` | Dejar un sachet |
| `P` | Pausar o reanudar las actividades de la mascota |
| `ESC` | Cerrar la aplicación |

Ten presente que la pausa no detiene necesariamente todos los temporizadores internos.

### El objeto legendario

<div align="center">

<img src="docs/assets/sachet.png" alt="Sachet de comida de Pudin" width="190">

### PUDIN'S FINEST

`RAREZA: LEGENDARIA` · `TIPO: CONSUMIBLE`

Aplaza las bromas durante 120 segundos después de que Pudin termina de comer.

*La paz es temporal. El gato es eterno.*

</div>

---

## ◈ Anatomía de la anomalía

El proyecto está dividido en módulos que gestionan distintas partes del comportamiento:

| Archivo | Responsabilidad |
|---|---|
| `main.py` | Inicialización de Pygame, ventana, controles y bucle principal |
| `pudin.py` | Movimiento, animaciones, estados, Pomodoro y modo furioso |
| `effects.py` | Huellas y partículas |
| `utils.py` | Recursos, audio, ventanas de Windows y bromas |
| `test_maldades.py` | Panel manual de pruebas |
| `requirements.txt` | Dependencias de Python |
| `Pudin_Ghost_Cat.spec` | Configuración de PyInstaller |
| `pudin_cat/assets/` | Recursos gráficos y sonoros de la aplicación |
| `docs/` | Landing page y recursos visuales del sitio |

### Ciclo de comportamiento

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Walk: Seguir o vagar
    Walk --> Idle: Detenerse
    Idle --> Dance: Detectar YouTube o Spotify
    Dance --> Idle: Cambiar de contexto
    Idle --> Eat: Buscar comida
    Eat --> Idle: Terminar de comer
    Idle --> Angry: Arrastre prolongado
    Angry --> Idle: Terminar el enfado
    Idle --> Sit: Pausa
    Sit --> Idle: Reanudar
```

El diagrama representa estados visibles de forma conceptual. El comportamiento real depende del orden de actualización y de las condiciones internas de cada estado.

---

## ◈ Transmisiones recuperadas

<div align="center">

[![Demostración de Pudin en YouTube](https://img.youtube.com/vi/UMO3PvRJNPc/hqdefault.jpg)](https://youtu.be/UMO3PvRJNPc)

**[▶ VER LA DEMOSTRACIÓN COMPLETA](https://youtu.be/UMO3PvRJNPc)**

[📼 Explorar la playlist](https://youtube.com/playlist?list=PL6ic-uQzzKmICgM4mTKT97MxOHBTYgjKb)

</div>

---

## ◈ Archivo clasificado

<div align="center">

### 🩷 CYBERPUDIN · SKIN EXCLUSIVA

¿Creías que habías desbloqueado todos los cosméticos?

[**✨ RECLAMAR LA SKIN EXCLUSIVA**](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

`DESCARGA INICIADA...`

`ERROR 404: SKIN NO ENCONTRADA`

`REDIRIGIENDO AL DEPARTAMENTO DE ENGAÑOS...`

*Pudin no se hace responsable de las consecuencias emocionales.*

</div>

---

<div align="center">

---

**Made with 💜 by [@KaledSML](https://github.com/KaledSML)**

Si Pudin te sacó una sonrisa, déjale una ⭐ en GitHub.

`THANKS FOR FEEDING THE CAT` 💜
`END OF FILE` · `ENTITY STATUS: STILL ONLINE`
</div>



</div>

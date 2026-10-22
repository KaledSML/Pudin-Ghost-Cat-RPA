 <div align="center">

<img src="/pudin_banner_readme.png" alt="Pudin, el gato fantasma naranja, en su guarida cyberpunk" width="100%">

# PUDIN.EXE

`UNEXPECTED ENTITY FOUND IN YOUR DESKTOP`

**Un gato fantasma. Tu escritorio. Sus reglas.** 🐈‍⬛

Una mascota en Python que sigue tu cursor, deja huellas de neón y sabotea tu productividad con encanto paranormal.

<a href="https://kaledsml.github.io/Pudin-Ghost-Cat-RPA/"><img src="https://img.shields.io/badge/🌐_EXPLORAR-LA_GUARIDA-ff4fd8?style=for-the-badge&labelColor=171126" alt="Explorar la guarida"></a>
<a href="https://youtu.be/UMO3PvRJNPc"><img src="https://img.shields.io/badge/▶_VER-A_PUDIN-00d9ff?style=for-the-badge&labelColor=171126" alt="Ver a Pudin en acción"></a>

![Windows](https://img.shields.io/badge/PLATFORM-Windows-00d9ff?style=flat-square&logo=windows&logoColor=white)
![Python](https://img.shields.io/badge/BUILT_WITH-Python-ffd166?style=flat-square&logo=python&logoColor=black)
![Pygame](https://img.shields.io/badge/POWERED_BY-Pygame-ff4fd8?style=flat-square)
![MIT](https://img.shields.io/badge/LICENSE-MIT-9effa9?style=flat-square)

<img src="docs/assets/pudin_gif.gif" alt="Pudin ejecutando sus protocolos paranormales" width="480">

`SYSTEM STATUS: HAUNTED` · `ENTITY STATUS: ONLINE`

</div>

---

> [!CAUTION]
> **⚠️ Pudin puede alterar tu escritorio.** Puede mover el cursor, minimizar o sacudir ventanas, escribir automáticamente en el Bloc de notas, cambiar el fondo de pantalla y abrir YouTube. Guarda tu trabajo y evita ejecutarlo durante tareas sensibles. El fondo original no se restaura automáticamente.

## ◈ HABILIDADES PARANORMALES

<table>
<tr>
<td align="center" width="33%">
<img src="pudin_cat/assets/walk.png" alt="Pudin caminando" width="110">

**🐾 Huellas espectrales**

Huellas magenta y partículas neón.
</td>
<td align="center" width="33%">
<img src="pudin_cat/assets/dance.png" alt="Pudin bailando" width="110">

**🎵 Detector musical**

¿YouTube o Spotify? ¡A bailar!
</td>
<td align="center" width="33%">
<img src="pudin_cat/assets/angry.png" alt="Pudin enfadado" width="110">

**👻 Motor del caos**

Ventanas inquietas y bromas automáticas.
</td>
</tr>
<tr>
<td align="center">
<img src="docs/assets/sachet.png" alt="Sachet de comida" width="110">

**🍣 Economía del sachet**

Comida a cambio de 120 segundos de tregua.
</td>
<td align="center">
<img src="pudin_cat/assets/sit.png" alt="Pudin sentado" width="110">

**🍅 Pomodoro inverso**

25 minutos de trabajo, 5 de descanso y una sorpresa en YouTube.
</td>
<td align="center">
<img src="pudin_cat/assets/angry.png" alt="Pudin en modo furioso" width="110">

**😾 Modo furioso**

Arrástralo demasiado y podría secuestrar tu cursor durante unos segundos.
</td>
</tr>
</table>

<div align="center">

*No es un asistente de productividad. Es la razón por la que necesitas uno.*

</div>

---

## ◈ DESPERTAR A PUDIN

**Requisitos:** Windows, Python 3 y soporte de audio. 🐈‍⬛

### 01 · Clona el repositorio

```bash
git clone https://github.com/KaledSML/Pudin-Ghost-Cat-RPA.git
cd Pudin-Ghost-Cat-RPA
```

### 02 · Instala las dependencias

```powershell
py -m pip install -r requirements.txt
```

### 03 · Invoca a la entidad

```powershell
cd pudin_cat
python main.py
```

`BOOT SEQUENCE: INITIATED` 🐾


---

## ◈ CONTROLES DE SUPERVIVENCIA

| Entrada | Acción |
|---|---|
| Clic izquierdo + arrastrar | Mover a Pudin |
| Clic derecho o `F` | Dejar un sachet |
| `P` | Pausar o reanudar |
| `ESC` | Cerrar la aplicación |


---
## 🧬 Anatomía de la anomalía

<details>
<summary><strong>📂 Explorar la estructura interna de Pudin</strong></summary>

<br>

> **ARCHIVO CLASIFICADO · PUDIN PROJECT**
>
> Un mapa de los componentes responsables del comportamiento de la criatura.

### 🗂️ Módulos del sistema

| Archivo o directorio | Descripción |
|:--|:--|
| `main.py` | 🖥️ Ventana, controles y bucle principal |
| `pudin.py` | 🐈 Movimiento, animaciones y comportamiento |
| `effects.py` | ✨ Huellas, partículas y efectos visuales |
| `utils.py` | 🔊 Recursos, audio, ventanas y bromas |
| `test_maldades.py` | 🧪 Panel de experimentación manual |
| `requirements.txt` | 📦 Dependencias de Python |
| `Pudin_Ghost_Cat.spec` | ⚙️ Configuración del ejecutable |
| `pudin_cat/assets/` | 🎨 Recursos gráficos y sonoros |
| `docs/` | 🌐 Landing page y recursos web |

### 🔄 Ciclo de comportamiento

El sujeto alterna entre distintos estados según su entorno, sus necesidades y el nivel de provocación recibido.

```mermaid
stateDiagram-v2
    direction LR

    [*] --> Idle

    state "😴 Idle" as Idle
    state "🚶 Walk" as Walk
    state "💃 Dance" as Dance
    state "🍗 Eat" as Eat
    state "😾 Angry" as Angry
    state "🪑 Sit" as Sit

    Idle --> Walk: Seguir o vagar
    Walk --> Idle: Detenerse

    Idle --> Dance: Detectar música
    Dance --> Idle: Cambiar de contexto

    Idle --> Eat: Buscar comida
    Eat --> Idle: Terminar de comer

    Idle --> Angry: Arrastre prolongado
    Angry --> Idle: Calmarse

    Idle --> Sit: Pausa
    Sit --> Idle: Reanudar
```

<sub>STATUS: OPERATIONAL · BEHAVIORAL ROUTINES MAPPED</sub>

</details>

---

## ⚙️ Fabricación del ejecutable

<details>
<summary><strong>🔧 Protocolo de compilación · PyInstaller</strong></summary>

<br>

El repositorio incluye el archivo `Pudin_Ghost_Cat.spec`, encargado de definir la configuración de compilación del ejecutable.

**Antes de iniciar el procedimiento**, comprueba que las rutas de `main.py`, `utils.py`, los recursos gráficos y sonoros, y el archivo `.spec` coincidan con la estructura real del proyecto.

### 🛠️ Iniciar la compilación

Ejecuta el siguiente comando desde el directorio raíz del repositorio:

```bash
python -m PyInstaller Pudin_Ghost_Cat.spec
```

### 📋 Registro del procedimiento

- **Herramienta:** PyInstaller
- **Archivo de configuración:** `Pudin_Ghost_Cat.spec`
- **Punto de partida:** directorio raíz del proyecto

<sub>BUILD STATUS: PENDING VERIFICATION</sub>

</details>

---

## 🧪 El laboratorio de pruebas

<details>
<summary><strong>☣️ Abrir el panel de experimentación manual</strong></summary>

<br>

> **TEST SUBJECT: YOUR DESKTOP**
>
> El siguiente procedimiento permite activar manualmente una de las bromas de Pudin.

### ▶️ Inicializar el laboratorio

```bash
python test_maldades.py
```

### 🎮 Controles del experimento

| Tecla | Acción |
|:--|:--|
| `1` | 💥 Ejecutar una broma |
| `ESC` | 🚪 Cerrar el panel de pruebas |

### ⚠️ Protocolo de seguridad

Pudin debe estar ejecutándose para que el panel pueda identificar su ventana correctamente.

**Guarda tu trabajo antes de comenzar.** Algunas pruebas pueden interferir con tu escritorio.

<sub>EXPERIMENT STATUS: MANUAL CONTROL ENABLED</sub>

</details>

---


---

<sub>🐈‍⬛ **PUDIN GHOST CAT** · Internal Documentation</sub>

<sub>Made with 💜 by [@KaledSML](https://github.com/KaledSML)</sub>

<sub>¿Pudin te sacó una sonrisa? Déjale una ⭐ en GitHub.</sub>


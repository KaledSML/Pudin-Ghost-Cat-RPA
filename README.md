# 🐱 Pudin-Ghost-Cat-RPA

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Status: Beta](https://img.shields.io/badge/Status-Beta-orange.svg)]()

**Pudin-Ghost-Cat-RPA** es un agente de sistema y mascota virtual interactiva diseñada para demostrar capacidades de **Robotic Process Automation (RPA)** y manipulación de la **Win32 API** en entornos Windows. A diferencia de las mascotas virtuales convencionales, Pudin interactúa directamente con los procesos y ventanas del sistema operativo del usuario.

---

## 🚀 Resumen Técnico

Este proyecto implementa una arquitectura basada en eventos y multihilo para realizar tareas de automatización sin bloquear la interfaz de usuario (UI). Utiliza hooks de bajo nivel para gestionar la transparencia de ventanas y la inyección de periféricos.

### 🛠️ Stack Tecnológico
* **Core Engine:** Python 3.1x
* **Graphics & UI:** Pygame (Rendering con Hardware Acceleration y capas Alpha).
* **System Integration:** `pywin32` (Win32GUI, Win32Con) & `ctypes`.
* **Automation:** `pyautogui` para simulación de entradas de hardware (Keyboard/Mouse).
* **Concurrency:** `threading` para la ejecución asíncrona del "Prank Engine".

---

## 🎯 Características Principales (RPA & System Hooks)

1.  **Manipulación de HWND (Window Handles):** * Implementa transparencia real mediante `LWA_COLORKEY` y `WS_EX_LAYERED`.
    * Capacidad de "atravesar" la ventana con el click del mouse (Click-through) en áreas transparentes.
2.  **Motor de Automatización de Procesos:**
    * **Ghost Typing:** Automatización del flujo: *Lanzamiento de proceso -> Búsqueda de handle -> Foco de ventana -> Inyección de texto*.
    * **Window Shaker:** Modificación dinámica de los rectángulos de posición de ventanas externas.
3.  **Persistencia en el Entorno:** * Acceso a los parámetros del sistema para la modificación del Wallpaper mediante la API de Windows.
4.  **Sistema de IA Asíncrona:** * Máquina de estados finitos (FSM) que decide comportamientos de manera aleatoria e independiente.

---

## 📊 Arquitectura y Casos de Uso (UML)



```mermaid
useCaseDiagram
    actor "Usuario" as U
    actor "Windows OS" as OS
    
    package "Pudin System" {
        usecase "Interactuar con Mascota (UI)" as UC1
        usecase "Procesar Estados de IA" as UC2
        usecase "Ejecutar Automatización (RPA)" as UC3
        usecase "Manipulación de Ventanas Externas" as UC4
    }
    
    U --> UC1
    UC1 ..> UC2 : <<include>>
    UC2 --> UC3 : trigger aleatorio
    UC3 --> OS : inyecta eventos/keystrokes
    UC4 --> OS : modifica atributos de HWND

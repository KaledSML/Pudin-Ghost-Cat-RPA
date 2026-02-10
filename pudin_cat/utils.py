import pygame
import random
import win32gui
import win32con
import win32api
import ctypes
import os
import time
import threading
import pyautogui
import sys

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

# --- 1. CONFIGURACIÓN DE SONIDOS ---
pygame.mixer.init()
pygame.mixer.set_num_channels(16)

def load_sound(file):
    # USAMOS RESOURCE_PATH AQUÍ
    path = resource_path(f"assets/{file}")
    if os.path.exists(path):
        return pygame.mixer.Sound(path)
    print(f"Aviso: No se encontró {path}")
    return None

# Carga de recursos de audio
snd_eat = load_sound("comer.mp3")
snd_jump = load_sound("salto.mp3")
snd_hiss = load_sound("hiss.mp3")
snd_mimir = load_sound("mimir.mp3")
snd_muejeje = load_sound("maldad.mp3")
snd_miau = load_sound("salto.mp3")

# --- 2. CARGA DE IMÁGENES ---
try:
    # USAMOS RESOURCE_PATH AQUÍ TAMBIÉN
    sachet_img = pygame.image.load(resource_path("assets/sachet.png")).convert_alpha()
    sachet_img = pygame.transform.scale(sachet_img, (70, 80))
except:
    sachet_img = pygame.Surface((30,30))
    sachet_img.fill((255, 200, 0))

def load_simple_sheet(name, frames, size):
    # USAMOS RESOURCE_PATH PARA LOS SPRITES
    path = resource_path(f"assets/{name}.png")
    try:
        sheet = pygame.image.load(path).convert_alpha()
        frame_width = sheet.get_width() // frames
        height = sheet.get_height()
        sprites = []
        for i in range(frames):
            rect = pygame.Rect(i * frame_width, 0, frame_width, height)
            sub_img = sheet.subsurface(rect)
            sprites.append(pygame.transform.scale(sub_img, (size, size)))
        return sprites
    except:
        print(f"Error cargando sprite: {path}")
        return [pygame.Surface((size, size)) for _ in range(frames)]

# --- 3. FUNCIONES DE VENTANA ---

def get_pudin_hwnd():
    """ Busca la ventana de Pygame por su nombre """
    return win32gui.FindWindow(None, "Pudin Cat")

def get_active_window_title():
    try:
        return win32gui.GetWindowText(win32gui.GetForegroundWindow())
    except:
        return ""

# --- 4. FUNCIONES DE SISTEMA / MALDADES ---

def change_wallpaper():
    """ Cambia el fondo de pantalla al iniciar el programa """
    try:
        # AQUÍ TAMBIÉN PARA EL FONDO DE PANTALLA
        path = resource_path("assets/pudin_wallpaper.png")
        if os.path.exists(path):
            ctypes.windll.user32.SystemParametersInfoW(20, 0, path, 3)
        else:
            print(f"Aviso: No se encontró {path}")
    except Exception as e:
        print(f"Error al cambiar wallpaper: {e}")

def execute_prank(pudin_hwnd):
    maldades = ["minimizar", "sacudir", "notepad"] 
    maldad = random.choice(maldades)
    
    target_hwnd = win32gui.GetForegroundWindow()
    
    # Seguridad: No atacarse a sí mismo ni a la barra de tareas
    if target_hwnd == pudin_hwnd or target_hwnd == 0: 
        return 

    if maldad == "minimizar":
        win32gui.ShowWindow(target_hwnd, win32con.SW_MINIMIZE)
    
    elif maldad == "sacudir":
        def shake():
            try:
                # Detectar si la ventana está maximizada
                placement = win32gui.GetWindowPlacement(target_hwnd)
                is_maximized = (placement[1] == win32con.SW_SHOWMAXIMIZED)

                # Si está maximizada, hay que restaurarla para poder moverla
                if is_maximized:
                    win32gui.ShowWindow(target_hwnd, win32con.SW_RESTORE)
                    time.sleep(0.1)

                rect = win32gui.GetWindowRect(target_hwnd)
                x, y, w, h = rect[0], rect[1], rect[2]-rect[0], rect[3]-rect[1]
                
                # Sacudida intensa
                for _ in range(20):
                    win32gui.SetWindowPos(target_hwnd, 0, 
                                          x + random.randint(-25, 25), 
                                          y + random.randint(-25, 25), 
                                          w, h, 0)
                    time.sleep(0.01)
                
                # Dejarla en su posición original
                win32gui.SetWindowPos(target_hwnd, 0, x, y, w, h, 0)
            except: 
                pass
        threading.Thread(target=shake, daemon=True).start()
    elif maldad == "notepad":
        def ghost_typing():
            try:
                # Los prints ahora tienen un estilo más acorde al "Ghost Cat"
                print("🐱 [PUDIN_OS]: Iniciando protocolo de escritura fantasma...")
                os.startfile("notepad.exe")
                time.sleep(3.5) 

                # 2. BUSCAR VENTANA (Método Avanzado)
                hwnd_notepad = win32gui.FindWindow("Notepad", None)
                
                if not hwnd_notepad:
                    def callback(hwnd, extra):
                        titulo = win32gui.GetWindowText(hwnd).lower()
                        if "notepad" in titulo or "notas" in titulo:
                            extra.append(hwnd)
                    
                    ventanas_encontradas = []
                    win32gui.EnumWindows(callback, ventanas_encontradas)
                    if ventanas_encontradas:
                        hwnd_notepad = ventanas_encontradas[0]

                if hwnd_notepad:
                    print(f"📡 [SYSTEM]: Objetivo localizado (ID: {hwnd_notepad})")
                    
                    # --- TRUCO MAESTRO PARA EL FOCO ---
                    win32gui.ShowWindow(hwnd_notepad, win32con.SW_MINIMIZE)
                    time.sleep(0.3)
                    win32gui.ShowWindow(hwnd_notepad, win32con.SW_RESTORE)
                    
                    # Simular ALT para desbloquear el foco de Windows
                    win32api.keybd_event(win32con.VK_MENU, 0, 0, 0)
                    win32gui.SetForegroundWindow(hwnd_notepad)
                    win32api.keybd_event(win32con.VK_MENU, 0, win32con.KEYEVENTF_KEYUP, 0)
                    
                    time.sleep(0.8)
                    rect = win32gui.GetWindowRect(hwnd_notepad)
                    
                    # Calcular el centro exacto para el clic
                    center_x = rect[0] + (rect[2] - rect[0]) // 2
                    center_y = rect[1] + (rect[3] - rect[1]) // 2
                    
                    # 4. Mover y hacer clic
                    pyautogui.moveTo(center_x, center_y, duration=0.8)
                    pyautogui.click()
                    time.sleep(0.5)
                    
                    # 5. Escribir la maldad
                    frases = [
                        "Pudin hackeo tu sistema... miau.",
                        "Instalando virus de ronroneos.exe",
                        "Dame atun o borro tu carpeta System32"
                    ]
                    msg = random.choice(frases)
                    pyautogui.typewrite(msg, interval=0.1)
                    pyautogui.press('enter')
                    print("🔥 [MALDAD]: Mensaje inyectado con éxito.")
                else:
                    print("❌ [DEBUG]: No se detectó ninguna instancia de Notepad.")
                
            except Exception as e:
                print(f"⚠️ [ERROR]: Fallo en la secuencia de infiltración: {e}")

        threading.Thread(target=ghost_typing, daemon=True).start()
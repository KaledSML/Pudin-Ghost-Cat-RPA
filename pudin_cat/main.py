import pygame
import pyautogui
import time
import os

def resource_path(relative_path):
    """ Gestiona las rutas para que funcionen en el .py y en el .exe """
    try:
        # PyInstaller crea una carpeta temporal y guarda la ruta en _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

# --- 1. PRE-INICIALIZACIÓN ---
os.environ['SDL_VIDEO_WINDOW_POS'] = "0,0"
pygame.init()
pygame.font.init()

# --- 2. CREAR LA VENTANA ---
monitor_size = pyautogui.size()
TRANS_COLOR = (255, 0, 128) 
screen = pygame.display.set_mode(monitor_size, pygame.NOFRAME)
pygame.display.set_caption("Pudin Cat") # Nombre para que utils lo encuentre
screen.fill(TRANS_COLOR)
pygame.display.flip()

# --- 3. IMPORTAR MÓDULOS (Con sonidos corregidos) ---
from pudin import Pudin
from effects import EffectManager
from utils import (get_active_window_title, execute_prank, sachet_img, 
                   get_pudin_hwnd, snd_mimir, snd_miau, snd_hiss)

# --- 4. TRUCO DE TRANSPARENCIA ---
hwnd = pygame.display.get_wm_info()["window"]

def setup_transparency(window_handle):
    import win32api, win32con, win32gui
    ex_style = win32gui.GetWindowLong(window_handle, win32con.GWL_EXSTYLE)
    # Quitamos WS_EX_TRANSPARENT para que SÍ detecte los clics del mouse
    win32gui.SetWindowLong(window_handle, win32con.GWL_EXSTYLE, 
                          ex_style | win32con.WS_EX_LAYERED)
    
    colorkey = win32api.RGB(255, 0, 128)
    win32gui.SetLayeredWindowAttributes(window_handle, colorkey, 0, win32con.LWA_COLORKEY)
    
    win32gui.SetWindowPos(window_handle, win32con.HWND_TOPMOST, 0, 0, 0, 0, 
                          win32con.SWP_NOMOVE | win32con.SWP_NOSIZE)

setup_transparency(hwnd)

# --- 5. INICIAR OBJETOS ---
from utils import change_wallpaper # Asegúrate de que esté importada

change_wallpaper() # ¡Boom! Fondo cambiado apenas abre

BASE_SIZE = 128
mi_pudin = Pudin(BASE_SIZE)
efectos = EffectManager()
clock = pygame.time.Clock()

print("¡Pudin ha despertado con ganas de molestar!")

# --- BUCLE PRINCIPAL ---
running = True
while running:
    screen.fill(TRANS_COLOR)
    
    current_time = time.time()
    mx, my = pyautogui.position()
    current_title = get_active_window_title()

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        
        # --- INTERACCIÓN CON EL MOUSE ---
        if event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1: # Clic izquierdo
                if mi_pudin.rect.collidepoint(mx, my):
                    mi_pudin.dragging = True
                    mi_pudin.drag_start_time = current_time
                    if snd_miau: snd_miau.play() # ¡Miau al tocar!
            
            if event.button == 3: # Clic derecho (Soborno rápido)
                mi_pudin.food_pos = (mx, my)

        if event.type == pygame.MOUSEBUTTONUP:
            if event.button == 1:
                # Solo deja de arrastrar si no entró en modo ataque
                if not mi_pudin.is_trolling:
                    mi_pudin.dragging = False

        # --- TECLADO ---
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_f:
                mi_pudin.food_pos = (mx, my)
            elif event.key == pygame.K_p:
                mi_pudin.is_paused = not mi_pudin.is_paused
                if mi_pudin.is_paused and snd_mimir:
                    snd_mimir.play()
            elif event.key == pygame.K_ESCAPE:
                running = False


    # Actualizar Pudin (Pasamos el ID de ventana para que no se ataque a sí mismo)
    mi_pudin.update(mx, my, current_time, current_title, lambda: execute_prank(hwnd))

    # Efectos de huellas
    if mi_pudin.state == "walk" and not mi_pudin.is_paused:
        efectos.add_footprint(mi_pudin.x, mi_pudin.y, mi_pudin.current_size, current_time)

    # Dibujo
    efectos.update_and_draw(screen, current_time)
    
    if mi_pudin.food_pos:
        screen.blit(sachet_img, (int(mi_pudin.food_pos[0]-35), int(mi_pudin.food_pos[1]-40)))
    
    mi_pudin.draw(screen, current_time)

    pygame.display.update()
    clock.tick(60)

pygame.quit()
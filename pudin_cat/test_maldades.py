import pygame
import utils
import win32gui
import threading

# Inicializar Pygame
pygame.init()
screen = pygame.display.set_mode((400, 250))
pygame.display.set_caption("Pudin - Laboratorio de Maldades")
font = pygame.font.SysFont("Arial", 18)

def draw_text(text, y, color=(255, 255, 255)):
    img = font.render(text, True, color)
    text_rect = img.get_rect(center=(200, y))
    screen.blit(img, text_rect)

def run_test(maldad_func):
    """Ejecuta la maldad en un hilo para no congelar esta ventana"""
    threading.Thread(target=maldad_func, daemon=True).start()

running = True
# Buscamos la ventana de Pudin para que no se ataque a sí mismo
hwnd_pudin = utils.get_pudin_hwnd()

while running:
    screen.fill((40, 44, 52)) # Un color gris azulado más moderno
    
    draw_text("🧪 PANEL DE PRUEBAS DE PUDIN", 30, (0, 255, 200))
    draw_text("Presiona [1]: Lanzar Maldad Aleatoria", 80)
    draw_text("ESC: Cerrar Laboratorio", 210, (150, 150, 150))

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        
        if event.type == pygame.KEYDOWN:
            # Importante: Las maldades actúan sobre la ventana activa
            # ¡Asegúrate de tener otra ventana abierta para ver el efecto!
            
            if event.key == pygame.K_1:
                print("Lanzando maldad aleatoria...")
                run_test(lambda: utils.execute_prank(hwnd_pudin))

            elif event.key == pygame.K_ESCAPE:
                running = False

    pygame.display.flip()

pygame.quit()
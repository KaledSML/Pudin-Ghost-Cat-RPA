import pygame
import random
import time

class EffectManager:
    def __init__(self):
        self.huellas = []   # Estructura: [x, y, timestamp, current_scale]
        self.brillitos = [] # Estructura: [x, y, vx, vy, timestamp]
        self.last_footprint_time = 0

    def add_footprint(self, x, y, current_size, current_time):
        """ Añade una huella con estilo neón digital """
        if current_time - self.last_footprint_time > 0.35:
            # Calculamos escala según el tamaño de Pudin
            size_factor = current_size / 128
            
            # Posición base de la huella (pies de Pudin)
            hx = x + current_size // 2
            hy = y + current_size - (10 * size_factor)

            self.huellas.append([
                hx, 
                hy, 
                current_time,
                size_factor 
            ])
            self.last_footprint_time = current_time
            
            # Partículas estilo "pixeles" o bits que saltan
            for _ in range(5):
                self.brillitos.append([
                    hx, 
                    hy, 
                    random.uniform(-3, 3) * size_factor, 
                    random.uniform(-3, 3) * size_factor, 
                    current_time
                ])

    def update_and_draw(self, screen, current_time):
        # --- 1. DIBUJAR HUELLAS (Estilo Cyberpunk) ---
        for h in self.huellas[:]:
            age = current_time - h[2]
            if age > 2.5: # Duran un poco menos para no saturar
                self.huellas.remove(h)
                continue
            
            fade = (1 - age / 2.5)
            scale = h[3] * fade
            
            # Efecto de "Glow" neón
            # Círculo externo (brillo)
            pygame.draw.circle(screen, (80, 0, 80), (int(h[0]), int(h[1])), int(16 * scale))
            # Círculo medio (color principal)
            pygame.draw.circle(screen, (255, 0, 255), (int(h[0]), int(h[1])), int(8 * scale))
            # Centro (blanco/brillante)
            pygame.draw.circle(screen, (255, 200, 255), (int(h[0]), int(h[1])), int(3 * scale))

        # --- 2. DIBUJAR BRILLITOS (Bits digitales) ---
        for b in self.brillitos[:]:
            age_b = current_time - b[4]
            if age_b > 1.0:
                self.brillitos.remove(b)
                continue
            
            # Gravedad cero o ligera
            b[0] += b[2]
            b[1] += b[3]
            
            # Colores cyan y magenta (Cyberpunk)
            color = random.choice([(0, 255, 255), (255, 0, 255), (255, 255, 255)])
            
            # En lugar de círculos, dibujamos cuadraditos (pixeles)
            size = random.randint(1, 3)
            pygame.draw.rect(screen, color, (int(b[0]), int(b[1]), size, size))
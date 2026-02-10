import pygame
import random
import time
import math
import pyautogui
import webbrowser
# Importamos los nombres de sonidos corregidos de utils
from utils import load_simple_sheet, snd_eat, snd_jump, snd_hiss, snd_mimir, snd_muejeje, snd_miau

class Pudin:
    def __init__(self, base_size):
        self.base_size = base_size
        self.current_size = base_size 
        self.x, self.y = 500, 500
        
        # --- Control de Animación ---
        self.state = "idle"
        self.frame = 0
        self.last_update = time.time()
        self.facing_left = False
        
        # --- Temporizadores de Cerebro ---
        self.action_timer = time.time()
        self.next_prank_time = time.time() + 15
        self.mode_timer = time.time()
        self.mode = "follow" 
        
        # --- Sistema Pomodoro ---
        self.pomodoro_start = time.time()
        self.work_duration = 25 * 60 
        self.break_duration = 5 * 60 
        self.is_working = True
        
        # --- Estados de Interacción ---
        self.dragging = False
        self.is_trolling = False
        self.is_paused = False
        self.food_pos = None
        self.mouse_troll_end_time = 0
        self.drag_start_time = 0
        
        # Rectángulo de colisión para el mouse
        self.rect = pygame.Rect(self.x, self.y, base_size, base_size)

        self.animations = {
            "idle": load_simple_sheet("idle", 4, base_size),
            "walk": load_simple_sheet("walk", 4, base_size), 
            "sit": load_simple_sheet("sit", 4, base_size),
            "angry": load_simple_sheet("angry", 4, base_size),
            "eat": load_simple_sheet("eat", 4, base_size),
            "dance": load_simple_sheet("dance", 4, base_size)
        }

    def update(self, mx, my, current_time, title, handle_prank_callback):
        self.rect.topleft = (self.x, self.y)
        
        # --- 1. LÓGICA DE BAILE (YouTube/Spotify) ---
        if "YouTube" in title or "Spotify" in title:
            if self.state != "dance" and not self.dragging and not self.is_trolling:
                self.state = "dance"
        elif self.state == "dance":
            self.state = "idle"

        # --- 2. LÓGICA POMODORO Y TRAVESURAS ---
        elapsed = current_time - self.pomodoro_start
        if self.is_working:
            if current_time > self.next_prank_time and not self.is_paused and not self.dragging:
                if snd_muejeje: snd_muejeje.play() # ¡Muejeje al atacar!
                handle_prank_callback()
                self.next_prank_time = current_time + random.uniform(30, 90)

            if elapsed >= self.work_duration:
                self.is_working = False
                self.pomodoro_start = current_time
                webbrowser.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ") 
        else:
            if elapsed >= self.break_duration:
                self.is_working = True
                self.pomodoro_start = current_time

        # --- 3. COMPORTAMIENTOS PRIORITARIOS ---
        
        # MODO TROLL (Secuestro de mouse)
        if self.is_trolling:
            self.state = "angry"
            self.x += math.sin(current_time * 15) * 10
            self.y += math.cos(current_time * 15) * 10
            # Bloquea el mouse en su centro
            pyautogui.moveTo(int(self.x + self.current_size // 2), int(self.y + self.current_size // 2))
            if snd_hiss and not pygame.mixer.Channel(1).get_busy():
                snd_hiss.play()
            
            if current_time > self.mouse_troll_end_time:
                self.is_trolling = False
                self.dragging = False
                self.state = "idle"
        
        # ARRASTRAR
        elif self.dragging:
            self.x, self.y = mx - self.current_size // 2, my - self.current_size // 2
            drag_duration = current_time - self.drag_start_time
            if drag_duration > 2.0: # Si lo retienes mucho tiempo, se enoja
                self.is_trolling = True
                self.mouse_troll_end_time = current_time + random.uniform(3, 5)

        # MODO PAUSA / MIMIR
        elif self.is_paused:
            self.state = "sit"

        # MODO COMER
        elif self.food_pos:
            tx, ty = self.food_pos[0] - self.base_size // 2, self.food_pos[1] - self.base_size // 2
            dist = math.hypot(tx - self.x, ty - self.y)
            if dist < 10: 
                if self.state != "eat":
                    self.state = "eat"
                    if snd_eat: snd_eat.play()
                    self.action_timer = current_time
                if current_time - self.action_timer > 3:
                    self.food_pos = None
                    self.next_prank_time = current_time + 120 # Soborno: 2 min de paz
            else:
                self.state = "walk"
                self.x += ((tx - self.x) / dist) * 7
                self.y += ((ty - self.y) / dist) * 7

        # IA NORMAL
        else:
            if current_time - self.mode_timer > 5:
                self.mode = random.choice(["follow", "wander", "idle"])
                self.mode_timer = current_time

            dx, dy = (mx - self.current_size // 2) - self.x, (my - self.current_size // 2) - self.y
            dist = math.hypot(dx, dy)

            if self.mode == "follow" and dist > 100:
                self.state = "walk"
                self.x += (dx / dist) * 4
                self.y += (dy / dist) * 4
                self.facing_left = dx < 0
            elif self.mode == "wander":
                self.state = "walk"
                self.x += math.sin(current_time) * 2
                self.facing_left = math.sin(current_time) < 0
            else:
                if self.state != "dance": self.state = "idle"

    def draw(self, screen, current_time):
        if current_time - self.last_update > 0.1:
            self.frame = (self.frame + 1) % 4
            self.last_update = current_time

        img = self.animations[self.state][self.frame]
        if self.facing_left: img = pygame.transform.flip(img, True, False)
        
        # Glitch visual si está enojado
        rx, ry = self.x, self.y
        if self.state == "angry":
            rx += random.randint(-5, 5)
            ry += random.randint(-5, 5)

        screen.blit(img, (int(rx), int(ry)))
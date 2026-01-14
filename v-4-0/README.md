# Glamour Prompt Generator v4.0

Генератор промптов для AI (Nano Banana, Grok, Midjourney, SDXL) для создания glamour/lingerie изображений.

## Быстрый старт

Просто откройте `index.html` в браузере. Работает локально без сервера.

```bash
# Или через локальный сервер (опционально):
python -m http.server 8000
# Откройте http://localhost:8000/v-4-0/
```

## Что нового в v4.0

### Архитектура
- **Разделение на группы**: ENGINE → CHARACTER → LOOK → SCENE
- **Раздельное управление образом**: Outfit + Color + Material + Hosiery + Footwear
- **Расширенная цветовая палитра**: 19 цветов и паттернов
- **Больше вариативности**: 16 архетипов, 40+ нарядов, 12 видов чулок, 16 видов обуви

### Движки
- **Nano Banana** (default)
- **Grok** — с усиленным full-length framing
- **Midjourney** — формат с `--ar` и `--no`
- **SDXL / Flux**
- **Generic**

### UI
- Современный тёмный дизайн
- Color swatches для выбора палитры
- Boldness слайдер (B0-B3)
- Randomize All для быстрой генерации

## Структура настроек

### ⚙️ ENGINE
- AI Model (движок генерации)
- Format (соотношение сторон)
- Full-length toggle

### 👤 CHARACTER
- **Archetype** — типаж модели (блондинки, брюнетки, рыжие, etc.)
- **Hair** — причёска
- **Makeup** — макияж

### 👗 LOOK
- **Boldness** (B0-B3) — степень смелости
- **Outfit** — тип одежды (lingerie, bodysuit, dress, swimwear)
- **Color Palette** — цвет (visual swatches)
- **Material** — материал (lace, satin, latex, mesh)
- **Hosiery** — чулки/колготки
- **Footwear** — обувь

### 🎬 SCENE
- **Setting** — локация
- **Art Direction** — визуальный стиль
- **Pose** — поза
- **Lighting** — освещение
- **Camera** — камера/композиция
- **Color Grade** — цветокоррекция

## Порядок сборки промпта

1. Framing (if full-length)
2. Art Direction
3. Boldness modifier
4. Subject: "adult woman (25+), [archetype]"
5. Hair color lock
6. Hair + Makeup
7. Wardrobe: [color] [material] [outfit], [hosiery], [footwear]
8. Scene
9. Pose
10. Lighting
11. Camera
12. Color Grade

## Safety

- Автоматический фильтр: no minors, no look-alike, no explicit
- Hair color lock для сохранения консистентности персонажа
- Full-length guards в negative

## Файлы

```
v-4-0/
├── index.html       # Главная страница
├── style.css        # Стили
├── script.js        # Логика + данные
├── README.md        # Документация
├── ARCHITECTURE.md  # Архитектура
└── strategy/
    └── STRATEGY.md  # Стратегия продукта
```

## Roadmap

- [ ] Video extension (Sora, Runway, Kling)
- [ ] Presets system
- [ ] History (localStorage)
- [ ] Campaign packs

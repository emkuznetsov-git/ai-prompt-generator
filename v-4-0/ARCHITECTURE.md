# Prompt Generator v4.0 — Architecture

## Анализ проблем v3.2

### Что работает хорошо:
- Базовая логика генерации промпта
- Safety фильтры
- Boldness система
- Hair lock для сохранения цвета волос
- Weighted random selection

### Что требует улучшения:

1. **Негибкая структура модулей**
   - Wardrobe = всё вместе (бельё + чулки в одном поле)
   - Нет отдельного управления материалом и цветом
   - Цветовая палитра скудная (в основном чёрный)

2. **Нет системы совместимости**
   - Можно выбрать thigh-high boots + stockings (не видны)
   - Можно выбрать swimwear + fishnet stockings (нелогично)
   - Рандом может выдать конфликтующие комбинации

3. **Привязка причёски/макияжа к архетипу слабая**
   - Beauty выбирается независимо
   - Может не соответствовать типажу

4. **Один движок по умолчанию (Grok)**
   - Нужен Nano Banana как default
   - Нужны адаптеры для других движков

5. **Нет подготовки к видео-генерации**
   - Нет описания движения
   - Нет параметров для video prompts

---

## Новая архитектура v4.0

### Концепция: Группы настроек

```
┌─────────────────────────────────────────────────────────────────┐
│                        PROMPT GENERATOR                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   ENGINE    │  │  CHARACTER  │  │    LOOK     │             │
│  │             │  │             │  │             │             │
│  │ - AI Model  │  │ - Archetype │  │ - Boldness  │             │
│  │ - Format    │  │ - Hair      │  │ - Outfit    │             │
│  │             │  │ - Makeup    │  │ - Hosiery   │             │
│  │             │  │             │  │ - Footwear  │             │
│  │             │  │             │  │ - Color     │             │
│  │             │  │             │  │ - Material  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐           │
│  │                    SCENE                         │           │
│  │                                                  │           │
│  │  - Setting (location)     - Lighting            │           │
│  │  - Art Direction          - Camera              │           │
│  │  - Pose                   - Color Grade         │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐           │
│  │              VIDEO EXTENSION (Phase 2)           │           │
│  │                                                  │           │
│  │  - Camera Movement        - Model Action        │           │
│  │  - Duration               - Style/Mood          │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. ENGINE — Движок генерации

### Поддерживаемые движки:

| ID | Label | Default | Notes |
|----|-------|---------|-------|
| `nano_banana` | Nano Banana | ✅ | Основной движок |
| `grok` | Grok (X.AI) | | Требует enforceFullLength |
| `midjourney` | Midjourney | | Нужен адаптер формата |
| `sdxl` | SDXL / Flux | | |
| `generic` | Generic | | Универсальный |

### Форматы:

| ID | Label | Aspect Ratio |
|----|-------|--------------|
| `ig_4x5` | Instagram Feed 4:5 | 1080×1350 |
| `story_9x16` | Story/Reel 9:16 | 1080×1920 |
| `square_1x1` | Square 1:1 | 1080×1080 |
| `print_2x3` | Print 2:3 | 1200×1800 |
| `wide_16x9` | Wide 16:9 | 1920×1080 |

---

## 2. CHARACTER — Персонаж

### Archetype (Типаж модели)

Определяет базовый образ: цвет волос, тип внешности, "вайб".

```typescript
interface Archetype {
  id: string;
  label: string;
  hairColor: 'blonde' | 'brunette' | 'redhead' | 'dirty_blonde' | 'black';
  vibe: 'bombshell' | 'femme_fatale' | 'ice_queen' | 'girl_next_door' | 'sophisticated' | 'pin_up';
  defaultHair: string[];    // Совместимые причёски
  defaultMakeup: string[];  // Совместимые макияжи
  text_en: string;
  tags: string[];
}
```

**Примеры архетипов:**

| ID | Label | Hair Color | Vibe |
|----|-------|------------|------|
| `blonde_bombshell` | Blonde Bombshell | blonde | bombshell |
| `blonde_ice_queen` | Blonde Ice Queen | blonde | ice_queen |
| `brunette_femme_fatale` | Brunette Femme Fatale | brunette | femme_fatale |
| `brunette_power` | Brunette Power | brunette | sophisticated |
| `redhead_pin_up` | Redhead Pin-Up | redhead | pin_up |
| `dirty_blonde_tease` | Dirty Blonde Tease | dirty_blonde | girl_next_door |

### Hair (Причёска)

Фильтруется на основе архетипа.

```typescript
interface HairStyle {
  id: string;
  label: string;
  text_en: string;
  compatibleWith: string[];  // archetype vibes
  excludes: string[];        // несовместимые стили
  tags: string[];
}
```

**Примеры:**

| ID | Label | Compatible With |
|----|-------|-----------------|
| `long_glamorous_waves` | Long Glamorous Waves | bombshell, femme_fatale |
| `sleek_straight` | Sleek Straight | ice_queen, sophisticated |
| `soft_blowout` | Soft Blowout | girl_next_door, bombshell |
| `slicked_back_wet` | Slicked-back Wet Look | femme_fatale, sophisticated |
| `high_ponytail` | High Ponytail | all |
| `vintage_waves` | Vintage Pin-Up Waves | pin_up |

### Makeup (Макияж)

Фильтруется на основе архетипа и boldness.

```typescript
interface MakeupStyle {
  id: string;
  label: string;
  text_en: string;
  compatibleWith: string[];  // archetype vibes
  minBoldness: number;       // 0-3
  tags: string[];
}
```

**Примеры:**

| ID | Label | Min Boldness |
|----|-------|--------------|
| `soft_natural` | Soft Natural | 0 |
| `smoky_eyes` | Smoky Eyes | 1 |
| `night_glam` | Night Glam | 2 |
| `bold_red_lip` | Bold Red Lip | 1 |
| `cat_eye_dramatic` | Cat Eye Dramatic | 2 |

---

## 3. LOOK — Образ / Лук

### Boldness (Степень раскованности)

```typescript
const BOLDNESS_LEVELS = [
  { value: 0, badge: 'B0', label: 'Elegant', modifier: 'tasteful lingerie campaign, elegant pose, strategic coverage' },
  { value: 1, badge: 'B1', label: 'Teasing', modifier: 'provocative glamour editorial, teasing but classy' },
  { value: 2, badge: 'B2', label: 'Bold', modifier: 'bold glamour, implied nudity but covered, tasteful framing' },
  { value: 3, badge: 'B3', label: 'On Edge', modifier: 'very bold glamour, on the edge, cinematic low-key, still non-explicit' },
];
```

### Outfit (Одежда)

Основной предмет одежды.

```typescript
interface Outfit {
  id: string;
  label: string;
  category: 'lingerie' | 'swimwear' | 'dress' | 'bodysuit' | 'corset';
  text_en: string;
  compatibleHosiery: string[];    // Совместимые чулки
  incompatibleFootwear: string[]; // Несовместимая обувь
  minBoldness: number;
  tags: string[];
}
```

**Категории:**

| Category | Examples |
|----------|----------|
| `lingerie` | Bra + briefs sets, garter sets, strappy sets |
| `swimwear` | Bikini, one-piece, monokini |
| `dress` | Mini dress, evening gown, cocktail dress |
| `bodysuit` | Lace bodysuit, mesh bodysuit, cutout bodysuit |
| `corset` | Classic corset, bustier, harness-style |

### Hosiery (Чулочные изделия)

```typescript
interface Hosiery {
  id: string;
  label: string;
  text_en: string;
  compatibleFootwear: string[];   // С какой обувью смотрится
  incompatibleOutfit: string[];   // С чем не сочетается
  tags: string[];
}
```

**Варианты:**

| ID | Label | Notes |
|----|-------|-------|
| `none` | No Hosiery | Без чулок |
| `sheer_stockings` | Sheer Stockings | Классические прозрачные |
| `lace_top_stockings` | Lace-top Stockings | С кружевной резинкой |
| `fishnet_stockings` | Fishnet Stockings | Сетка |
| `sheer_tights` | Sheer Tights | Колготки |
| `fishnet_tights` | Fishnet Tights | Колготки-сетка |
| `thigh_high_socks` | Thigh-high Socks | Гольфы |

### Footwear (Обувь)

```typescript
interface Footwear {
  id: string;
  label: string;
  text_en: string;
  height: 'flat' | 'mid' | 'high' | 'ultra';
  type: 'pumps' | 'sandals' | 'boots' | 'mules';
  hidesHosiery: boolean;  // Скрывает ли чулки
  tags: string[];
}
```

**Варианты:**

| ID | Label | Hides Hosiery |
|----|-------|---------------|
| `stiletto_pumps` | Stiletto Pumps | No |
| `platform_pumps` | Platform Pumps | No |
| `ankle_strap_sandals` | Ankle-strap Sandals | No |
| `lace_up_sandals` | Lace-up Sandals | No |
| `ankle_boots` | Ankle Boots | Partially |
| `knee_high_boots` | Knee-high Boots | Yes (most) |
| `thigh_high_boots` | Thigh-high Boots | Yes (all) |

### Color Palette (Цветовая палитра)

```typescript
interface ColorPalette {
  id: string;
  label: string;
  text_en: string;
  hex: string;           // Для UI превью
  compatibleWith: string[]; // Сочетаемые цвета
  tags: string[];
}
```

**Палитра:**

| ID | Label | Hex | Notes |
|----|-------|-----|-------|
| `black` | Classic Black | #000000 | Универсальный |
| `deep_red` | Deep Red / Burgundy | #8B0000 | Страстный |
| `hot_pink` | Hot Pink | #FF69B4 | Дерзкий |
| `ivory` | Ivory / Cream | #FFFFF0 | Элегантный |
| `nude` | Nude / Beige | #E8C39E | Естественный |
| `white` | Pure White | #FFFFFF | Контрастный |
| `emerald` | Emerald Green | #50C878 | Роскошный |
| `navy` | Navy Blue | #000080 | Классика |
| `gold` | Metallic Gold | #FFD700 | Statement |
| `silver` | Metallic Silver | #C0C0C0 | Modern |
| `leopard` | Leopard Print | — | Bold |
| `mixed` | Mixed / Multi | — | Комбо |

### Material (Материал)

```typescript
interface Material {
  id: string;
  label: string;
  text_en: string;
  finish: 'matte' | 'satin' | 'glossy' | 'sheer';
  compatibleColors: string[];
  tags: string[];
}
```

**Материалы:**

| ID | Label | Finish |
|----|-------|--------|
| `lace` | Lace | sheer |
| `satin` | Satin | satin |
| `silk` | Silk | satin |
| `mesh` | Mesh / Sheer | sheer |
| `velvet` | Velvet | matte |
| `latex_look` | Latex-look | glossy |
| `leather_look` | Leather-look | glossy |
| `cotton` | Cotton | matte |

---

## 4. SCENE — Сцена

### Setting (Локация)

```typescript
interface Setting {
  id: string;
  label: string;
  text_en: string;
  category: 'studio' | 'interior' | 'outdoor';
  props: string[];        // Доступные пропсы
  defaultLighting: string;
  tags: string[];
}
```

**Локации:**

| Category | Examples |
|----------|----------|
| `studio` | Cyclorama, Seamless backdrop, Gel lights |
| `interior` | Hotel suite, Penthouse, Loft, Backstage |
| `outdoor` | Poolside, Rooftop, Beach |

### Art Direction (Визуальный стиль)

```typescript
interface ArtDirection {
  id: string;
  label: string;
  text_en: string;
  mood: string;
  defaultSettings: {
    setting?: string;
    lighting?: string;
    colorGrade?: string;
  };
  tags: string[];
}
```

**Стили:**

| ID | Label | Mood |
|----|-------|------|
| `playboy_glam` | Playboy Studio Glam | High-key, clean, glamorous |
| `luxury_boudoir` | Luxury Boudoir | Warm, intimate, premium |
| `neon_cinematic` | Neon Cinematic | Cool, edgy, modern |
| `noir_dramatic` | Noir Dramatic | High-contrast, shadows |
| `vintage_pinup` | Vintage Pin-Up | Retro, playful |
| `minimal_modern` | Minimal Modern | Clean, geometric |
| `old_money` | Old Money Luxury | Timeless, warm |

### Pose (Поза)

```typescript
interface Pose {
  id: string;
  label: string;
  text_en: string;
  type: 'standing' | 'seated' | 'leaning' | 'walking';
  emphasizes: string[];   // boots, heels, curves
  requiresProps: string[]; // mirror, chair, cube
  tags: string[];
}
```

### Lighting (Освещение)

(Остаётся как в v3.2, но с более чёткой категоризацией)

### Camera (Камера/Композиция)

(Остаётся как в v3.2)

### Color Grade (Цветокоррекция)

(Остаётся как в v3.2)

---

## 5. COMPATIBILITY SYSTEM — Система совместимости

### Правила совместимости:

```typescript
interface CompatibilityRules {
  // Обувь → Чулки
  footwear: {
    [footwearId: string]: {
      hidesHosiery: string[];  // Какие чулки скрывает
      incompatible: string[];  // Полностью несовместимо
    }
  };
  
  // Одежда → Чулки
  outfit: {
    [outfitId: string]: {
      incompatibleHosiery: string[];
      requiredHosiery?: string[];
    }
  };
  
  // Материал → Цвет
  material: {
    [materialId: string]: {
      preferredColors: string[];
      excludedColors: string[];
    }
  };
  
  // Сцена → Одежда
  setting: {
    [settingId: string]: {
      preferredOutfits: string[];
      excludedOutfits: string[];
    }
  };
}
```

### Примеры правил:

```typescript
const COMPATIBILITY = {
  footwear: {
    thigh_high_boots: {
      hidesHosiery: ['stockings', 'lace_top_stockings', 'fishnet_stockings'],
      incompatible: []
    },
    knee_high_boots: {
      hidesHosiery: ['stockings', 'lace_top_stockings'],
      incompatible: []
    }
  },
  
  outfit: {
    swimwear_bikini: {
      incompatibleHosiery: ['stockings', 'tights', 'fishnet_stockings', 'fishnet_tights'],
      requiredHosiery: []
    },
    evening_gown_long: {
      incompatibleHosiery: [],
      preferredHosiery: ['sheer_tights', 'none']
    }
  },
  
  material: {
    latex_look: {
      preferredColors: ['black', 'deep_red', 'hot_pink', 'metallic'],
      excludedColors: ['ivory', 'nude', 'white']
    },
    lace: {
      preferredColors: ['black', 'ivory', 'white', 'deep_red'],
      excludedColors: []
    }
  },
  
  setting: {
    poolside: {
      preferredOutfits: ['swimwear'],
      excludedOutfits: ['evening_gown', 'corset_formal']
    },
    backstage: {
      preferredOutfits: ['lingerie', 'bodysuit', 'robe'],
      excludedOutfits: ['swimwear']
    }
  }
};
```

### UI-поведение:

1. **При выборе элемента** → несовместимые опции становятся disabled
2. **При рандомизации** → система учитывает совместимость
3. **При конфликте** → показывается warning, предлагается исправление

---

## 6. PROMPT ASSEMBLY — Сборка промпта

### Порядок сборки:

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. FRAMING (if enforceFullLength)                               │
│    "FULL-LENGTH LONG SHOT, head-to-toe..."                     │
├─────────────────────────────────────────────────────────────────┤
│ 2. GOAL + ART DIRECTION                                         │
│    "high-end glamour magazine editorial, Playboy-inspired..."  │
├─────────────────────────────────────────────────────────────────┤
│ 3. BOLDNESS MODIFIER                                            │
│    "provocative glamour editorial, teasing but classy"         │
├─────────────────────────────────────────────────────────────────┤
│ 4. SUBJECT                                                      │
│    "adult woman (25+), [archetype text]"                       │
├─────────────────────────────────────────────────────────────────┤
│ 5. HAIR COLOR LOCK                                              │
│    "Hair color: platinum blonde (keep consistent)"             │
├─────────────────────────────────────────────────────────────────┤
│ 6. HAIR + MAKEUP                                                │
│    "long glamorous waves, smoky eyes, glossy lips"             │
├─────────────────────────────────────────────────────────────────┤
│ 7. WARDROBE (outfit + color + material + hosiery + footwear)   │
│    "Wardrobe: deep red satin corset with lace trim,            │
│     sheer black lace-top stockings,                            │
│     black patent stiletto pumps"                               │
├─────────────────────────────────────────────────────────────────┤
│ 8. SCENE                                                        │
│    "Scene: luxury hotel suite, warm bedside lamps..."          │
├─────────────────────────────────────────────────────────────────┤
│ 9. POSE                                                         │
│    "Pose: standing full body, one hand on hip..."              │
├─────────────────────────────────────────────────────────────────┤
│ 10. LIGHTING                                                    │
│     "Lighting: soft diffused key + gentle rim..."              │
├─────────────────────────────────────────────────────────────────┤
│ 11. CAMERA                                                      │
│     "Camera: 50mm editorial, eye-level..."                     │
├─────────────────────────────────────────────────────────────────┤
│ 12. COLOR GRADE                                                 │
│     "warm-neutral filmic grading, natural skin texture"        │
└─────────────────────────────────────────────────────────────────┘
```

### Wardrobe Assembly (новая логика):

```typescript
function assembleWardrobe(look: LookState): string {
  const parts: string[] = [];
  
  // 1. Outfit + Color + Material
  const outfitText = `${look.color.text_en} ${look.material.text_en} ${look.outfit.text_en}`;
  parts.push(outfitText);
  
  // 2. Hosiery (если есть и совместимо)
  if (look.hosiery && look.hosiery.id !== 'none') {
    if (!isHosieryHidden(look.footwear, look.hosiery)) {
      parts.push(look.hosiery.text_en);
    }
  }
  
  // 3. Footwear
  if (look.footwear) {
    parts.push(look.footwear.text_en);
  }
  
  return `Wardrobe: ${parts.join(', ')}`;
}
```

---

## 7. VIDEO EXTENSION (Phase 2)

### Структура video prompt:

```typescript
interface VideoPromptConfig {
  basePrompt: string;        // Сгенерированный фото-промпт
  cameraMovement: CameraMovement;
  modelAction: ModelAction;
  duration: number;          // 2-5 seconds
  style: VideoStyle;
}

type CameraMovement = 
  | 'static'
  | 'slow_pan_left'
  | 'slow_pan_right'
  | 'slow_dolly_in'
  | 'slow_dolly_out'
  | 'subtle_float'
  | 'orbit_quarter';

type ModelAction =
  | 'subtle_sway'
  | 'hair_touch'
  | 'slow_turn'
  | 'look_to_camera'
  | 'walk_toward'
  | 'walk_away_look_back'
  | 'adjust_outfit';

type VideoStyle =
  | 'cinematic'
  | 'fashion_editorial'
  | 'music_video'
  | 'commercial';
```

### Video prompt assembly:

```typescript
function generateVideoPrompt(config: VideoPromptConfig): string {
  const parts = [
    config.basePrompt,
    `Camera: ${getCameraMovementText(config.cameraMovement)}`,
    `Action: ${getModelActionText(config.modelAction)}`,
    `Duration: ${config.duration} seconds, smooth motion`,
    `Style: ${config.style}, high production value`
  ];
  
  return parts.join('. ');
}
```

---

## 8. DATA STRUCTURE

### Файловая структура данных:

```
v-4-0/
├── data/
│   ├── lexicons/
│   │   ├── archetypes.json
│   │   ├── hair.json
│   │   ├── makeup.json
│   │   ├── outfits.json
│   │   ├── hosiery.json
│   │   ├── footwear.json
│   │   ├── colors.json
│   │   ├── materials.json
│   │   ├── settings.json
│   │   ├── art-directions.json
│   │   ├── poses.json
│   │   ├── lighting.json
│   │   ├── camera.json
│   │   └── color-grades.json
│   ├── compatibility.json
│   └── presets.json
├── src/
│   ├── types.ts
│   ├── generator.ts
│   ├── compatibility.ts
│   ├── adapters/
│   │   ├── nano-banana.ts
│   │   ├── grok.ts
│   │   └── generic.ts
│   ├── safety.ts
│   └── video.ts
├── index.html
├── script.js (compiled bundle)
└── style.css
```

---

## 9. UI/UX IMPROVEMENTS

### Группировка в UI:

```
┌──────────────────────────────────────────────────────────────┐
│  ⚙️ ENGINE                                                    │
│  [Nano Banana ▼]  [Story 9:16 ▼]                             │
├──────────────────────────────────────────────────────────────┤
│  👤 CHARACTER                                                 │
│  Archetype: [Blonde Bombshell ▼]                             │
│  Hair:      [Long Glamorous Waves ▼]  (filtered by archetype)│
│  Makeup:    [Smoky Eyes ▼]            (filtered by archetype)│
├──────────────────────────────────────────────────────────────┤
│  👗 LOOK                                     Boldness: B1    │
│                                              ═══●═══         │
│  Outfit:   [Strappy Lingerie Set ▼]                          │
│  Color:    [● ● ● ● ● ● ●]  (color swatches)                │
│  Material: [Lace ▼]                                          │
│  Hosiery:  [Lace-top Stockings ▼]                           │
│  Footwear: [Stiletto Pumps ▼]                               │
├──────────────────────────────────────────────────────────────┤
│  🎬 SCENE                                                     │
│  Setting:     [Luxury Hotel Suite ▼]                         │
│  Art Style:   [Luxury Boudoir ▼]                             │
│  Pose:        [Standing, hand on hip ▼]                      │
│  Lighting:    [Warm diffusion + rim ▼]                       │
│  Camera:      [50mm editorial ▼]                             │
│  Color Grade: [Warm neutral filmic ▼]                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [🎲 Randomize All]  [🎲 Randomize Look]  [✨ Generate]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Визуальная обратная связь:

1. **Color swatches** — цветовые кружки для быстрого выбора палитры
2. **Disabled options** — серые при несовместимости
3. **Warnings** — жёлтые предупреждения при конфликтах
4. **Live preview** — превью ключевых слов промпта

---

## 10. NEXT STEPS

### Phase 1 (Текущий)
1. ✅ Создать архитектуру (этот документ)
2. ⏳ Создать структуру данных (JSON lexicons)
3. ⏳ Реализовать систему совместимости
4. ⏳ Реализовать новый генератор
5. ⏳ Обновить UI

### Phase 2
1. Добавить video extension
2. Добавить адаптеры для Sora/Runway/Kling
3. Добавить presets для видео

### Phase 3
1. История генераций
2. Сохранение персонажей
3. Campaign packs

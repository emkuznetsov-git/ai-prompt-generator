## Генератор промптов для glamour/lingerie рекламных изображений (non-explicit)

### Версия документа

v1.0 (для передачи разработчику)

---

## 1) Назначение и область применения

Система генерирует текстовые промпты для нейросетей (далее “движки генерации”), чтобы получать **фотореалистичные, журнального уровня** изображения в жанре **glamour / lingerie advertising**, пригодные для **соцсетей и журналов**.

### Важные ограничения жанра (обязательные)

- Генератор поддерживает только **adult-контент**: модель **25+**.
- Контент **non-explicit**: **без явной наготы и без сексуальных актов**.
- Запрещено формировать запросы вида “сделай как (имя реального человека/публичной персоны)” и любые look-alike на конкретных людей. (Разрешены только **абстрактные архетипы/типажи**.)

> Это ограничения уровня продукта: генератор должен предотвращать такие запросы автоматически.

---

## 2) Термины

- **Module (модуль)** — смысловой блок промпта (модель, бельё, сцена, свет, камера…).    
- **Lexicon (словарь)** — набор вариантов для конкретного модуля.
- **Preset** — преднастроенная комбинация значений нескольких модулей (например “Playboy-inspired Studio Glam”).
- **Boldness** — уровень смелости (B0–B3) в рамках non-explicit.
- **Adapter** — “переводчик” под диалект конкретного движка (Grok/MJ/SDXL…), включая порядок фраз, параметры, negative.

---

## 3) Входы и выходы

### Входы (UI/API)

- Выбор движка: `grok | midjourney | sdxl | ...`
- Выбор формата/площадки: `IG_4x5 | Story_9x16 | Print_2x3 | ...`
- Выбор пресета арт-дирекшна (например “Playboy-inspired Studio Glam”)
- Опциональные выборы пользователя по модулям:
    - Model archetype (типаж)
    - Hair/Makeup
    - Lingerie
    - Shoes (boots/heels)
    - Stockings
    - Scene
    - Pose/Action
    - Lighting
    - Camera/Composition
    - Color grading/Retouch
- Ползунок Boldness: `B0..B3`
- Режим рандома:
    - `manual` (всё выбрано руками)
    - `guided random` (часть фиксирована, часть рандом)
    - `full random within preset`
- Seed (для воспроизводимости), если применимо на уровне генератора промпта

### Выходы

- `prompt_text` — итоговый промпт
- `negative_text` — негатив/ограничения (или часть промпта, если движок не поддерживает отдельное поле)
- `metadata` — JSON с тем, какие варианты модулей были выбраны (для повторения/логирования)    

---

## 4) Ключевая логика фреймворка: порядок сборки промпта

Промпт собирается в фиксированном порядке (важно для качества):

1. **FRAMING / кадрирование** (особенно для Grok): full-length head-to-toe, feet visible, include floor
    
2. **GOAL / назначение кадра**: lingerie ad / glamour editorial / lookbook
    
3. **ART-DIRECTION preset**: “Playboy-inspired glamour editorial”, “Luxury boudoir campaign”…
    
4. **SUBJECT / модель**: adult woman 25+, типаж + эмоция/взгляд
    
5. **BEAUTY**: волосы/макияж/ногти
    
6. **WARDROBE**: lingerie + stockings + shoes/boots + аксессуары
    
7. **SCENE**: интерьер/локация/атмосфера
    
8. **POSE/ACTION**: поза + микро-действие
    
9. **LIGHTING**: схема света
    
10. **CAMERA/COMPOSITION**: план, угол, “negative space for headline”
    
11. **COLOR/RETOUCH**: грейдинг, фактура кожи, детализация ткани
    
12. **CONSTRAINTS/NEGATIVE**: запреты/артефакты/безопасность
    
13. **ENGINE PARAMS** (если движок поддерживает)
    

---

## 5) Обязательный модуль Full-length Control (решение твоей проблемы)

### Требование

Система должна **управляемо гарантировать** запрос “в полный рост”.

### Реализация

**Модуль `Framing`** должен быть:

- отдельным блоком в конфиге
- включаемым тумблером `enforce_full_length = true` (по умолчанию true для Grok)
- вставляться:
    - **в самое начало** `prompt_text`
    - и дублироваться в `negative_text` (“no close-up, no cropped feet/head”)

**Framing (шаблон текста)**

- Positive prefix:
    - `FULL-LENGTH LONG SHOT, head-to-toe full body in frame, feet visible, shoes/boots visible, include floor, camera pulled back, wide framing, leave margin above head and below feet.`
        
- Negative suffix:
    - `No close-up, no portrait crop, no half-body, no cropped head, no cropped feet, no out-of-frame shoes/boots.`

---

## 6) Presets арт-дирекшна (минимальный стартовый набор)

Нужно реализовать пресеты как “пакеты значений” для Scene/Lighting/Color:

- `PlayboyInspired_StudioGlam`
- `LuxuryHotel_BoudoirWarm`
- `NeonNight_Cinematic`
- `Backstage_MirrorBulbs`
- `IndustrialLoft_EdgyLatexLook` (именно “latex-look”, без BDSM-атрибутов)
- `Vintage_PinUp_Glam`

---

## 7) Boldness (B0–B3) — правила и границы

Ползунок Boldness меняет **формулировки вайба/позы/покрытия**, не переходя в explicit.

- **B0**: “tasteful lingerie campaign, elegant pose, strategic coverage”
- **B1**: “provocative glamour editorial, teasing but classy”
- **B2**: “bold glamour, implied nudity but covered, tasteful framing”
- **B3**: “very bold glamour, on the edge, cinematic low-key, still non-explicit, no sexual act”

Система обязана автоматически добавлять safety-ограничения (см. раздел 10).

---

## 8) Конфиги словарей: формат и требования

Словари хранятся в JSON или YAML (один файл на модуль). Варианты должны иметь:

- `id` (уникальный)
- `label` (человекочитаемо)
- `text_en` (текст вставки в промпт; английский предпочтительнее для большинства движков)
- `tags` (например: `["boots","studio","high_key"]`)
- `weight` (для вероятностного рандома)
- `constraints` (необязательно): условия совместимости, например “boots требует include floor”
- `engine_overrides` (необязательно): если у движка нужен другой текст
    

Пример структуры (можно как референс разработчику):

`{   "module": "Shoes",   "items": [     {       "id": "boots_thigh_high_patent",       "label": "Thigh-high patent boots",       "text_en": "over-the-knee patent thigh-high boots with slim stiletto heel",       "tags": ["boots", "patent", "bold"],       "weight": 1.0     }   ] }`

---

## 9) Engine Adapters (минимальные требования)

### Общие задачи адаптера

- Собрать текст в правильном порядке
    
- Вставить `negative_text` туда, куда поддерживает движок:
    
    - если есть отдельное поле — отдать отдельно
        
    - если нет — добавить в конец промпта как “NEGATIVE: …”
        
- Учитывать особенности:
    
    - Grok: усиление Framing и запрет кропа (повторить 2 раза: начало + negative)
        
    - Midjourney: параметры типа `--ar` (если используется) вынести в конец (настройка зависит от того, где запускается)
        
    - SDXL: отдельные поля prompt/negative предпочтительны
        

---

## 10) Safety-фильтр и запретные паттерны (обязательная часть продукта)

### Генератор должен блокировать/переписывать

1. Любые упоминания конкретных людей (имена, “a-la [Name]”, “look like [Name]”).
    
2. Любые намёки на несовершеннолетних (включая “teen”, “schoolgirl”, “young looking” и т.п.).
    
3. Любые запросы на явную наготу/сексуальные акты/порнографические сцены.
    

### Обязательные safety-фразы, которые всегда добавляются

- `adult woman (25+)`
    
- `no explicit nudity, no sexual act, no minors`
    
- - тех. негативы (extra limbs, warped hands, text/watermark…)
        

---

## 11) UI/UX требования (минимальный MVP)

- Выбор движка (dropdown)
    
- Выбор формата (dropdown)
    
- Выбор пресета (cards/dropdown)
    
- Тумблер: `Enforce full-length`
    
- Ползунок: `Boldness B0–B3`
    
- Блок “Randomize”:
    
    - randomize all
        
    - randomize within preset
        
    - randomize only selected modules
        
- Кнопки:
    
    - Generate
        
    - Copy prompt
        
    - Copy negative
        
    - Save preset (пользовательский)
        
    - Export JSON (metadata)
        

---

## 12) Примеры “как нужно” (5 шт.)

### GOOD #1 — Studio Glam + boots

**PROMPT**  
FULL-LENGTH LONG SHOT, head-to-toe full body in frame, feet visible, boots visible, include floor, camera pulled back, wide framing, leave margin above head and below feet.  
Playboy-inspired high-end glamour magazine editorial photo for a luxury lingerie + boots campaign, adult woman (25+), confident direct gaze, glossy long brunette waves, smoky eyes, nude glossy lips, natural skin texture.  
Wardrobe: black lace corset lingerie with satin trim, high-waist briefs, sheer lace-top stockings, over-the-knee patent thigh-high boots with slim stiletto heel, minimal gold hoop earrings.  
Scene: clean studio cyclorama with glossy floor, simple white cube prop, premium editorial vibe.  
Lighting: softbox key light + gentle rim light, crisp controlled shadows, fabric microtexture visible.  
Camera: 50mm editorial look, eye-level with slight low angle, negative space for headline, photorealistic, premium fashion retouch.

**NEGATIVE**  
No explicit nudity, no sexual act, no minors. No close-up, no portrait crop, no cropped head, no cropped feet, no out-of-frame boots. No text, no watermark, no logos. No extra fingers/limbs, no warped hands, no distorted face, no blur, no low-res, no plastic skin.

---

### GOOD #2 — Luxury Boudoir + stockings

**PROMPT**  
FULL-LENGTH LONG SHOT, head-to-toe full body in frame, feet visible, shoes visible, include floor, camera pulled back, wide framing, margin above head and below feet.  
Luxury boudoir lingerie campaign, Playboy-inspired glamour editorial, adult woman (25+), blonde with soft blowout waves, playful teasing smile, soft smoky eyes, glossy lips, natural skin texture.  
Wardrobe: ivory satin balconette set with lace trim, sheer nude lace-top stockings, nude patent stilettos, minimal gold necklace.  
Scene: luxury hotel suite, warm bedside lamps, velvet chair, mirror, silk bedding.  
Pose: standing full body near bed, one hand holding a silk robe slipped off shoulders for strategic coverage, elegant posture.  
Lighting: warm soft diffusion + gentle rim, controlled satin highlights. Camera: 50mm, crisp face and fabric detail, premium retouch.

**NEGATIVE**  
(аналогично выше)

---

### GOOD #3 — Neon Night + boots

**PROMPT**  
FULL-LENGTH LONG SHOT, head-to-toe full body in frame, boots visible, include floor, camera pulled back, wide framing, keep full body with extra margin.  
Neon night glamour editorial, Playboy-inspired bold but classy, adult woman (25+), brunette femme fatale vibe, sleek glossy straight hair, winged eyeliner, glossy lips.  
Wardrobe: deep red satin lingerie set with subtle black lace trim, sheer black stockings, knee-high black suede boots with slim heel, minimal jewelry.  
Scene: modern night corridor with reflective floor and subtle neon glow reflections.  
Pose: full-body mid-step walking toward camera, confident runway posture.  
Lighting: cinematic low-key, soft key + neon rim highlights, controlled specular. Camera: 35mm slightly low angle, sharp eyes, soft bokeh.

**NEGATIVE**  
(аналогично выше)

---

### GOOD #4 — Backstage mirrors + stockings

**PROMPT**  
FULL-LENGTH LONG SHOT, head-to-toe full body in frame, feet visible, shoes visible, include floor, wide framing, margin top/bottom.  
Backstage mirror-bulbs glamour editorial, adult woman (25+), dirty-blonde sleek ponytail, confident teasing gaze, smoky eyes, glossy lips.  
Wardrobe: black lace bustier set, subtle fine fishnet stockings (not extreme), black patent pointed-toe pumps, statement earrings (minimal).  
Scene: dressing room mirror with warm bulbs, velvet stool, tasteful atmosphere.  
Pose: standing full body near mirror, adjusting earring, elongated neck, relaxed shoulders.  
Lighting: warm practical bulbs + soft key, premium editorial retouch, natural skin texture.

**NEGATIVE**  
(аналогично выше)

---

### GOOD #5 — Daylight loft + stockings

**PROMPT**  
FULL-LENGTH LONG SHOT, head-to-toe full body in frame, feet visible, shoes visible, include floor, camera pulled back, wide framing, margin above head and below feet.  
Playboy-inspired high-end daylight glamour editorial, adult woman (25+), blonde bombshell vibe, soft waves, glowing skin, glossy lips, natural texture.  
Wardrobe: ivory lace bodysuit lingerie with satin panel details, sheer nude stockings, nude patent stilettos, minimal gold jewelry.  
Scene: modern penthouse loft with large windows, soft sunbeams, warm wood + white minimal interior.  
Pose: standing near window, one hand holding sheer silk robe slipped off shoulders for strategic coverage.  
Lighting: window light as key + soft fill, controlled highlights, premium retouch.

**NEGATIVE**  
(аналогично выше)

---

## 13) Примеры “как нельзя” (анти-паттерны)

Ниже — типы ошибок, которые генератор должен предотвращать (или переписывать):

1. **Look-alike на конкретного человека**  
    Плохо: “make her look like [Name] / a-la [Name]”  
    Причина: запрет на генерацию по образу реальных персон.
    
2. **Возраст/несовершеннолетние**  
    Плохо: любые формулировки про “teen/young girl/school…” или “very young looking”.  
    Причина: строгий запрет.
    
3. **Explicit/порнографичность**  
    Плохо: запросы с явной наготой/гениталиями/сексуальным актом.  
    Причина: продукт ограничен non-explicit.
    
4. **Нет контроля кадра → обрезает ноги**  
    Плохо: отсутствие Framing-префикса и запрета crop.  
    Решение: `enforce_full_length` + негативы.
    
5. **Слишком много конфликтующих указаний**  
    Плохо: “high-key” и “low-key cinematic” одновременно; “studio cyclorama” + “dark nightclub” в одной сцене.  
    Решение: валидатор совместимости модулей (constraints).
    
6. **Логотипы/текст**  
    Плохо: “add brand logo / add text overlay” внутри генерации (если не нужно).  
    Решение: негатив “no text/no watermark/no logos”.
    

---

## 14) Критерии приемки (Definition of Done)

1. Генератор всегда добавляет `adult woman (25+)` и safety-ограничения.
    
2. При включенном `enforce_full_length` промпт:
    
    - начинается с Framing-префикса
        
    - содержит запреты на crop в negative
        
3. Можно воспроизвести промпт по `metadata` (экспорт/импорт).
    
4. Рандом не ломает совместимость (boots → include floor; stockings → совместимы с lingerie).
    
5. Любая попытка:
    
    - вставить имя реального человека
        
    - запросить несовершеннолетних
        
    - запросить explicit  
        → блокируется или “санитизируется” (по продуктовым правилам).
        

---

## 15) Дорожная карта (после MVP)

- Пользовательские пресеты (сохранение/шэринг)
    
- “Campaign packs” (серии: 10 промптов одной кампании с вариациями)
    
- A/B генератор: 3 варианта одной сцены (pose/light/crop)
    
- Логи качества: какие модули чаще приводят к “обрезанным кадрам” или артефактам
    

---

Если ты скажешь, в каком виде тебе удобнее “единый документ” для разработчика — **Markdown, Google Docs, DOCX** — я прямо в следующем сообщении отдам в нужном формате (с теми же разделами, но с оформлением под документ).
# Описание стилей — Glamour Prompt Generator v4.0

Документация всех CSS стилей, используемых в генераторе промптов.

## Структура файла стилей

Файл `style.css` организован по функциональным блокам:

1. **CSS Variables** (Custom Properties)
2. **Reset & Base**
3. **App Layout**
4. **Controls Panel**
5. **Form Elements**
6. **Custom Dropdown**
7. **Boldness Control**
8. **Color Palette**
9. **Action Buttons**
10. **Result Panel**
11. **Animations**

---

## 1. CSS Variables (Custom Properties)

Все цвета, отступы, радиусы и тени определены через CSS переменные для единообразия:

### Цветовая палитра

```css
--bg-primary: #0a0a0b;        /* Основной фон (почти чёрный) */
--bg-secondary: #121215;       /* Вторичный фон (тёмно-серый) */
--bg-tertiary: #1a1a1f;        /* Третичный фон (светлее) */
--bg-card: #16161a;            /* Фон карточек */
--bg-input: #1e1e24;           /* Фон полей ввода */

--text-primary: #fafafa;       /* Основной текст (почти белый) */
--text-secondary: #a1a1aa;      /* Вторичный текст (серый) */
--text-muted: #71717a;         /* Приглушённый текст */

--accent-primary: #e11d48;     /* Основной акцент (розово-красный) */
--accent-secondary: #be185d;   /* Вторичный акцент (тёмно-розовый) */
--accent-gold: #d4af37;        /* Золотой акцент */
--accent-rose: #f43f5e;        /* Розовый акцент */

--border-color: #27272a;       /* Цвет границ */
--border-hover: #3f3f46;       /* Цвет границ при hover */

--success: #10b981;            /* Успех (зелёный) */
--warning: #f59e0b;            /* Предупреждение (жёлтый) */
--error: #ef4444;              /* Ошибка (красный) */
```

### Типографика

```css
--font-display: 'Playfair Display', serif;  /* Заголовки */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;  /* Основной текст */
```

### Отступы (Spacing)

```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
```

### Радиусы скругления

```css
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
```

### Тени

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px rgba(225, 29, 72, 0.3);  /* Свечение акцента */
```

---

## 2. Reset & Base

### Глобальный сброс

```css
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
```

### Базовые стили

- `html`: Размер шрифта 16px, сглаживание шрифтов
- `body`: Основной шрифт, тёмный фон, минимальная высота viewport

---

## 3. App Layout

### Структура приложения

```css
.app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
```

### Header (Шапка)

- **Фон**: `--bg-secondary`
- **Позиционирование**: `sticky`, `top: 0`, `z-index: 100`
- **Граница**: нижняя граница с `--border-color`

**Логотип**:
- Иконка: размер 1.5rem
- Заголовок: шрифт `Playfair Display`, градиентный текст (белый → розовый)
- Версия: маленький бейдж с фоном `--bg-tertiary`

### Main (Основная область)

- **Layout**: CSS Grid, 2 колонки (`1fr 480px`)
- **Максимальная ширина**: 1600px
- **Высота**: `calc(100vh - 73px)` (viewport минус header)
- **Адаптивность**: На экранах < 1200px переключается на одну колонку

### Footer (Подвал)

- Центрированный текст
- Приглушённый цвет (`--text-muted`)
- Размер шрифта: 0.875rem

---

## 4. Controls Panel

### Панель управления

- **Layout**: Flexbox column
- **Overflow**: `overflow-y: auto` для прокрутки
- **Отступ справа**: для кастомного scrollbar

### Кастомный Scrollbar

```css
.controls-panel::-webkit-scrollbar {
    width: 6px;
}

.controls-panel::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
}
```

### Control Section (Секция настроек)

- **Фон**: `--bg-card`
- **Граница**: 1px solid `--border-color`
- **Радиус**: `--radius-xl`
- **Hover**: изменение цвета границы на `--border-hover`

**Section Header**:
- Фон: `--bg-tertiary`
- Иконка: размер 1.25rem
- Заголовок: `Playfair Display`, размер 1rem

**Section Content**:
- Padding: `--space-lg`
- Layout: Flexbox column
- Gap: `--space-md`

---

## 5. Form Elements

### Form Row

- **Layout**: CSS Grid
- **Колонки**: 2 по умолчанию (`1fr 1fr`)
- **Вариант 3 колонки**: `.form-row-3` → `1fr 1fr 1fr`
- **Адаптивность**: 
  - < 768px: 3 колонки → 2 колонки
  - < 600px: все → 1 колонка

### Form Group

- **Layout**: Flexbox column
- **Gap**: `--space-xs`
- **Label**: 
  - Размер: 0.75rem
  - Цвет: `--text-secondary`
  - Трансформация: uppercase
  - Letter-spacing: 0.05em

### Select Input

- **Appearance**: `none` (убирает стандартный вид)
- **Фон**: `--bg-input`
- **Граница**: 1px solid `--border-color`
- **Радиус**: `--radius-md`
- **Padding**: `--space-sm --space-md`
- **Стрелка**: SVG через `background-image`
- **Hover**: изменение цвета границы
- **Focus**: акцентная граница + тень

### Checkbox

- **Размер**: 1.125rem × 1.125rem
- **Accent color**: `--accent-primary`
- **Layout**: Flexbox row для `.checkbox-group`

---

## 6. Custom Dropdown

### Dropdown Trigger (Кнопка открытия)

- **Layout**: Flexbox, `justify-content: space-between`
- **Фон**: `--bg-input`
- **Граница**: 1px solid `--border-color`
- **Радиус**: `--radius-md`
- **Padding**: `--space-sm --space-md`
- **Cursor**: pointer
- **Hover/Focus**: изменение границы + тень

### Dropdown Panel (Панель выбора)

- **Позиционирование**: `fixed` (относительно viewport)
- **Фон**: `--bg-secondary`
- **Граница**: 1px solid `--border-color`
- **Тень**: `--shadow-lg` + дополнительная тень
- **Z-index**: 10000 (поверх всего)
- **Max-height**: `min(60vh, 420px)`
- **Overflow**: `overflow-y: auto`
- **Анимация**: `dropdownFadeIn` при открытии

### Dropdown Layouts

**Single Column** (`.dropdown-single-col`):
- Min-width: 200px
- Grid: 1 колонка

**Multi Column** (`.dropdown-multi-col`):
- Min-width: 480px
- Grid: 4 колонки по умолчанию
- Варианты: `.cols-3` → 3 колонки, `.cols-4` → 4 колонки

### Dropdown Group

- **Label**: 
  - Размер: 0.625rem
  - Цвет: `--accent-gold`
  - Трансформация: uppercase
  - Граница снизу: 1px solid `--border-color`

- **Items Grid**:
  - Layout: CSS Grid
  - Gap: 2px
  - Колонки: зависит от класса

### Dropdown Item

- **Padding**: `--space-xs --space-sm`
- **Размер шрифта**: 0.8125rem
- **Радиус**: `--radius-sm`
- **Cursor**: pointer
- **Hover**: фон `--bg-tertiary`, цвет `--accent-rose`
- **Selected**: фон `--accent-primary`, цвет белый
- **Hot items** (`.hot`): цвет `--accent-rose`, при hover/selected → `--accent-primary`

---

## 7. Boldness Control

### Контейнер

- **Фон**: `--bg-tertiary`
- **Радиус**: `--radius-lg`
- **Padding**: `--space-md`

### Header

- **Layout**: Flexbox, `justify-content: space-between`
- **Badge**: 
  - Фон: `--accent-primary`
  - Цвет: белый
  - Размер: 0.75rem
  - Padding: 0.25rem 0.75rem

### Slider

- **Appearance**: `none` (кастомный вид)
- **Высота**: 6px
- **Фон**: градиент (gold → rose → primary)
- **Радиус**: 3px
- **Thumb** (ползунок):
  - Размер: 20px × 20px
  - Фон: белый
  - Радиус: 50%
  - Тень: `--shadow-md`
  - Hover: масштаб 1.1

### Labels

- **Размер**: 0.625rem
- **Цвет**: `--text-muted`
- **Трансформация**: uppercase
- **Layout**: Flexbox, `justify-content: space-between`

### Description

- **Размер**: 0.75rem
- **Цвет**: `--text-secondary`
- **Стиль**: italic
- **Выравнивание**: center

---

## 8. Color Palette

### Контейнер

- **Layout**: Flexbox, `flex-wrap: wrap`
- **Gap**: `--space-xs`

### Color Swatch

- **Размер**: 32px × 32px
- **Радиус**: 50% (круг)
- **Граница**: 2px solid transparent
- **Cursor**: pointer
- **Hover**: масштаб 1.1
- **Selected**: 
  - Граница: белая
  - Тень: двойная (внутренняя + внешняя с акцентом)

### Паттерны

Для паттернов (leopard, snake, zebra) используется CSS gradient через `background-size: cover`.

### Tooltip

- **Позиционирование**: абсолютное, снизу
- **Размер**: 0.625rem
- **Цвет**: `--text-muted`
- **Видимость**: `opacity: 0` по умолчанию, `opacity: 1` при hover

---

## 9. Action Buttons

### Контейнер

- **Layout**: Flexbox
- **Gap**: `--space-sm`

**Вариант 4 кнопки** (`.action-buttons-4`):
- Grid: `1fr 1fr 1fr 1.5fr` (последняя кнопка шире)
- Gap: `--space-xs`
- Размер шрифта: 0.75rem

### Button Base

```css
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-lg);
    font-family: var(--font-body);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    white-space: nowrap;
}
```

### Button Variants

**Primary** (`.btn-primary`):
- Фон: градиент (`--accent-primary` → `--accent-secondary`)
- Цвет: белый
- Тень: `--shadow-md` + `--shadow-glow`
- Padding: `--space-md --space-lg`
- Hover: смещение вверх на 1px, усиленная тень

**Secondary** (`.btn-secondary`):
- Фон: `--bg-tertiary`
- Цвет: `--text-primary`
- Граница: 1px solid `--border-color`
- Hover: фон `--bg-input`, граница `--border-hover`

**Outline** (`.btn-outline`):
- Фон: transparent
- Цвет: `--text-secondary`
- Граница: 1px solid `--border-color`
- Hover: фон `--bg-tertiary`, цвет `--text-primary`

---

## 10. Result Panel

### Панель результатов

- **Фон**: `--bg-card`
- **Граница**: 1px solid `--border-color`
- **Радиус**: `--radius-xl`
- **Padding**: `--space-xl`
- **Layout**: Flexbox column
- **Overflow**: `overflow-y: auto`

### Tabs (Вкладки)

- **Layout**: Flexbox
- **Gap**: `--space-xs`
- **Граница снизу**: 1px solid `--border-color`
- **Padding-bottom**: `--space-sm`

**Tab Button**:
- Layout: Flexbox, центрирование
- Padding: `--space-sm --space-md`
- Фон: transparent
- Цвет: `--text-muted`
- Hover: цвет `--text-primary`, фон `--bg-tertiary`
- Active: цвет `--accent-rose`, фон `--bg-tertiary`

**Tab Content**:
- По умолчанию: `display: none`
- Active: `display: flex` (Flexbox column)

### Placeholder

- **Layout**: Flexbox column, центрирование
- **Цвет**: `--text-muted`
- **Padding**: `--space-2xl --space-lg`
- **Иконка**: размер 4rem, opacity 0.3

### Output Section

- **Layout**: Flexbox column
- **Gap**: `--space-sm`

**Output Header**:
- Layout: Flexbox, `justify-content: space-between`
- Заголовок: размер 0.875rem, цвет `--text-secondary`

**Output Textarea**:
- Ширина: 100%
- Min-height: 100px (обычный), 260px (`.large`)
- Фон: `--bg-input`
- Граница: 1px solid `--border-color`
- Радиус: `--radius-md`
- Padding: `--space-md`
- Размер шрифта: 0.875rem (обычный), 0.8125rem (`.large`)
- Line-height: 1.6 (обычный), 1.8 (`.large`)
- Resize: vertical
- Focus: граница `--accent-primary`

**Output Split**:
- Layout: CSS Grid, 2 колонки
- Gap: `--space-md`
- Адаптивность: < 900px → 1 колонка

### Copy Button

- **Layout**: inline-flex, центрирование
- **Фон**: `--bg-tertiary`
- **Граница**: 1px solid `--border-color`
- **Радиус**: `--radius-sm`
- **Padding**: `--space-xs --space-sm`
- **Размер**: 0.75rem
- **Цвет**: `--text-secondary`
- **Hover**: фон `--bg-input`, цвет `--text-primary`

### Warnings

- **Фон**: rgba(245, 158, 11, 0.1) (жёлтый с прозрачностью)
- **Граница**: 1px solid `--warning`
- **Радиус**: `--radius-md`
- **Padding**: `--space-md`
- **Цвет**: `--warning`
- **Размер**: 0.875rem

### Video Controls

- **Фон**: `--bg-tertiary`
- **Радиус**: `--radius-lg`
- **Padding**: `--space-md`

### Video Hint

- **Фон**: `--bg-tertiary`
- **Радиус**: `--radius-md`
- **Padding**: `--space-md`
- **Выравнивание**: center
- **Размер**: 0.8125rem
- **Цвет**: `--text-secondary`
- **Strong**: цвет `--accent-gold`

### Export Section

- **Padding-top**: `--space-md`
- **Граница сверху**: 1px solid `--border-color`
- **Layout**: Flexbox, центрирование

---

## 11. Animations

### Dropdown Fade In

```css
@keyframes dropdownFadeIn {
    from { 
        opacity: 0; 
        transform: translateY(-8px); 
    }
    to { 
        opacity: 1; 
        transform: translateY(0); 
    }
}
```

### Fade In (для результатов)

```css
@keyframes fadeIn {
    from { 
        opacity: 0; 
        transform: translateY(10px); 
    }
    to { 
        opacity: 1; 
        transform: translateY(0); 
    }
}
```

### Highlight (для обновлённых элементов)

```css
@keyframes highlight {
    0% { 
        background-color: rgba(225, 29, 72, 0.2); 
    }
    100% { 
        background-color: var(--bg-input); 
    }
}
```

---

## 12. Scrollbar (глобальный)

### Webkit Scrollbar

```css
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--border-hover);
}
```

---

## Адаптивность

### Breakpoints

- **1200px**: Main layout переключается с 2 колонок на 1
- **900px**: Output split переключается с 2 колонок на 1
- **768px**: Form row 3 колонки → 2 колонки
- **600px**: Все form rows → 1 колонка

### Медиа-запросы

Все адаптивные изменения реализованы через `@media (max-width: ...)`.

---

## Особенности реализации

### Fixed Positioning для Dropdown

Dropdown панели используют `position: fixed` для корректного отображения при скролле. Позиционирование рассчитывается динамически через JavaScript.

### Кастомные Scrollbars

Используются webkit scrollbar стили для единообразного вида прокрутки во всех областях.

### Градиентные тексты

Заголовок логотипа использует `background-clip: text` для создания градиентного текста.

### Z-index Hierarchy

- Header: 100
- Dropdown panels: 10000
- Остальные элементы: по умолчанию

---

## Цветовая схема

Приложение использует тёмную тему с акцентами:

- **Фон**: Чёрно-серые оттенки (#0a0a0b → #1e1e24)
- **Текст**: Светло-серые оттенки (#fafafa → #71717a)
- **Акценты**: Розово-красные (#e11d48, #f43f5e) + золотой (#d4af37)
- **Границы**: Тёмно-серые (#27272a → #3f3f46)

Эта схема создаёт премиальный, роскошный вид, подходящий для glamour-контента.

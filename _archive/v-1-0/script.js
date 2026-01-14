// Конфигурация встроена в код для избежания проблем с CORS
let config = {
  "engine": {
    "label": "Движок",
    "options": [
      "Midjourney",
      "SDXL",
      "Flux",
      "DALL·E 3",
      "Stable Diffusion",
      "Leonardo AI"
    ]
  },
  "format": {
    "label": "Формат",
    "options": [
      {"value": "Instagram feed (4:5)", "aspect": "4:5"},
      {"value": "Instagram story/reels (9:16)", "aspect": "9:16"},
      {"value": "Журнал (2:3)", "aspect": "2:3"},
      {"value": "A4 crop", "aspect": "A4"},
      {"value": "Квадрат (1:1)", "aspect": "1:1"}
    ]
  },
  "realism": {
    "label": "Уровень реализма",
    "options": ["photoreal", "editorial photoreal", "hyperreal"]
  },
  "quality": {
    "label": "Качество",
    "default": "high-end magazine editorial, high detail skin texture, fabric microtexture",
    "options": [
      "high-end magazine editorial, high detail skin texture, fabric microtexture",
      "luxury fashion photography, professional retouching",
      "editorial quality, sharp focus, natural lighting",
      "commercial photography, product clarity"
    ]
  },
  "contentType": {
    "label": "Тип контента",
    "options": ["lingerie ad", "glamour editorial", "lookbook", "teasing lifestyle", "boudoir photography", "fashion campaign"]
  },
  "product": {
    "label": "Что продаём",
    "options": ["set", "bra", "corset", "heels", "boots", "lingerie collection", "accessories"]
  },
  "artDirection": {
    "label": "Art-direction preset",
    "options": [
      "Playboy-style glamour editorial",
      "Luxury boudoir campaign",
      "Neon night glamour",
      "Vintage pin-up glamour",
      "High-fashion lingerie runway editorial",
      "Editorial fashion photography",
      "Commercial lingerie campaign"
    ]
  },
  "model": {
    "age": {
      "label": "Возраст",
      "default": "adult woman, 25+",
      "options": ["adult woman, 25+", "adult woman, 30+", "adult woman, 28+"]
    },
    "bodyType": {
      "label": "Телосложение",
      "options": ["slim", "athletic", "curvy", "toned", "petite", "tall"]
    },
    "proportions": {
      "label": "Рост/пропорции",
      "options": ["long legs", "defined waist", "elegant posture", "graceful silhouette", "balanced proportions"]
    },
    "face": {
      "label": "Лицо",
      "options": ["soft features", "sharp jawline", "full lips", "high cheekbones", "delicate features", "strong bone structure"]
    },
    "emotion": {
      "label": "Эмоция/вайб",
      "options": ["confident", "playful", "provocative", "sultry", "elegant", "mysterious"]
    },
    "gaze": {
      "label": "Глаза/взгляд",
      "options": ["direct gaze", "over-the-shoulder", "dreamy", "sultry look", "confident stare", "looking away"]
    }
  },
  "beauty": {
    "hair": {
      "label": "Волосы",
      "options": [
        "long blonde blowout waves",
        "sleek straight dark hair",
        "wavy brunette hair",
        "messy bun",
        "wet look",
        "curly hair",
        "shoulder-length waves",
        "long straight hair",
        "updo with loose strands"
      ]
    },
    "makeup": {
      "label": "Makeup",
      "options": [
        "nude-gloss lips",
        "smoky eyes",
        "winged liner",
        "red lipstick",
        "natural makeup",
        "glossy nude lips",
        "bold red lips",
        "minimal makeup",
        "dramatic smoky eyes"
      ]
    },
    "nails": {
      "label": "Nails",
      "options": ["nude nails", "black nails", "red nails", "clear polish", "french manicure"]
    }
  },
  "wardrobe": {
    "lingerie": {
      "label": "Lingerie",
      "type": {
        "label": "Тип",
        "options": ["balconette set", "bustier", "corset", "bodysuit", "lingerie dress", "bikini", "teddy", "chemise"]
      },
      "material": {
        "label": "Материал",
        "options": ["lace", "satin", "silk", "mesh", "latex-look", "patent-leather accents", "velvet", "chiffon"]
      },
      "details": {
        "label": "Детали",
        "options": ["high-waist", "minimal straps", "cut lines", "garter straps", "strapless", "underwire", "push-up"]
      }
    },
    "shoes": {
      "label": "Shoes",
      "type": {
        "label": "Вид",
        "options": ["stilettos", "pumps", "ankle boots", "thigh-high boots", "sandals", "platform heels", "mules"]
      },
      "details": {
        "label": "Детали",
        "options": ["pointed toe", "patent leather", "suede", "thin straps", "metal buckles", "platform", "open toe"]
      }
    },
    "outerLayer": {
      "label": "Outer layer (опционально)",
      "options": ["oversized blazer", "silk robe", "trench coat slipped off shoulders", "leather jacket", "none"]
    }
  },
  "accessories": {
    "stockings": {
      "label": "Stockings",
      "options": ["sheer stockings", "lace-top stockings", "subtle fishnet", "none"]
    },
    "jewelry": {
      "label": "Jewelry",
      "options": ["minimal gold hoops", "layered chain", "statement earrings", "delicate necklace", "none"]
    },
    "props": {
      "label": "Props",
      "options": ["mirror", "chair", "perfume bottle", "silk sheets", "studio cube", "none"]
    }
  },
  "scene": {
    "label": "Сцена / интерьер",
    "options": [
      {"name": "Studio clean", "description": "seamless background, cyclorama, product clarity"},
      {"name": "Boudoir luxury", "description": "hotel suite, warm lamps, velvet chair, silk bedding"},
      {"name": "Night glamour", "description": "neon, bar/cabaret vibe, corridor, reflective surfaces"},
      {"name": "Industrial fashion", "description": "concrete, chrome, brutalist minimal"},
      {"name": "Luxury bedroom", "description": "elegant bedroom, soft lighting, luxurious fabrics"},
      {"name": "Modern apartment", "description": "contemporary interior, minimalist design, natural light"}
    ]
  },
  "pose": {
    "base": {
      "label": "Основа позы",
      "options": ["standing", "sitting", "reclining", "leaning"]
    },
    "bodyLanguage": {
      "label": "Body language",
      "options": ["elongated neck", "relaxed shoulders", "arched back moderately", "weight shift", "elegant posture", "graceful stance"]
    },
    "action": {
      "label": "Действие",
      "options": [
        "adjusting blazer lapel",
        "holding heel strap",
        "turning mid-step",
        "looking back",
        "touching hair",
        "adjusting lingerie strap",
        "leaning on furniture",
        "walking pose"
      ]
    }
  },
  "camera": {
    "shot": {
      "label": "Shot",
      "options": ["full-body", "three-quarter", "medium", "beauty close-up"]
    },
    "angle": {
      "label": "Angle",
      "options": ["eye level", "slight low angle", "high angle", "dutch angle"]
    },
    "lens": {
      "label": "Lens vibe",
      "options": ["35mm editorial", "50mm portrait", "85mm beauty", "24mm wide", "105mm telephoto"]
    },
    "focus": {
      "label": "Focus",
      "default": "sharp face + crisp lingerie details, soft background bokeh",
      "options": [
        "sharp face + crisp lingerie details, soft background bokeh",
        "sharp throughout",
        "selective focus on face",
        "deep focus"
      ]
    },
    "composition": {
      "label": "Composition",
      "default": "negative space for typography",
      "options": ["negative space for typography", "rule of thirds", "centered composition", "dynamic framing"]
    }
  },
  "lighting": {
    "label": "Свет",
    "options": [
      "softbox key light + subtle rim light",
      "beauty dish for face",
      "low-key moody contrast",
      "high-key clean catalog",
      "natural window light",
      "dramatic rim lighting",
      "soft diffused light",
      "cinematic lighting setup"
    ]
  },
  "grading": {
    "label": "Цвет, грейдинг, ретушь",
    "colorGrading": {
      "label": "Grading",
      "options": ["warm-neutral editorial", "cool chrome", "filmic", "vibrant", "desaturated", "high contrast"]
    },
    "retouch": {
      "label": "Retouch",
      "default": "fashion retouch, natural skin texture, no plastic skin",
      "options": [
        "fashion retouch, natural skin texture, no plastic skin",
        "minimal retouching",
        "editorial retouch",
        "natural look"
      ]
    },
    "detail": {
      "label": "Detail",
      "default": "fabric microtexture, realistic seams, clean edges",
      "options": ["fabric microtexture, realistic seams, clean edges", "high detail throughout", "selective detail enhancement"]
    }
  },
  "negatives": {
    "label": "Ограничения / negatives",
    "default": [
      "adult woman 25+, tasteful glamour lingerie",
      "no explicit nudity",
      "no visible genitals",
      "no sexual act",
      "no minors",
      "no text",
      "no watermark",
      "no logos",
      "no extra fingers/limbs",
      "no warped hands",
      "no distorted face"
    ]
  },
  "boldness": {
    "label": "Boldness (смелость)",
    "levels": [
      {
        "level": 0,
        "name": "Lingerie ad safe",
        "description": "tasteful lingerie campaign, covered nipples, elegant pose"
      },
      {
        "level": 1,
        "name": "Glamour editorial",
        "description": "provocative glamour editorial, implied nudity, strategic coverage"
      },
      {
        "level": 2,
        "name": "Playboy-like glamour",
        "description": "bold glamour, topless implied but not explicit, tasteful framing"
      },
      {
        "level": 3,
        "name": "On the edge",
        "description": "very bold glamour, teasing pose, cinematic low-key lighting, no explicit nudity, no sexual act"
      }
    ]
  },
  "aestheticPresets": {
    "label": "Пресеты эстетики",
    "options": [
      {
        "name": "Playboy Studio Glam",
        "description": "white cyclorama / glossy floor, high-key light, crisp shadows, classic glamour"
      },
      {
        "name": "Luxury Hotel Boudoir",
        "description": "warm lamps, silk bedding, velvet chair, mirror, soft diffusion, intimate but elegant"
      },
      {
        "name": "Neon Night Glam",
        "description": "neon signage reflections, wet pavement vibe, cinematic contrast, glossy lips, high heels"
      },
      {
        "name": "Cabaret Backstage",
        "description": "backstage mirrors with bulbs, feather accents (умеренно), smoky eyes, dramatic rim light"
      },
      {
        "name": "Latex-Look Fashion Edge",
        "description": "patent leather accents, chrome + black interior, sharp highlights, dominant fashion attitude (без BDSM-атрибутов)"
      },
      {
        "name": "Vintage Pin-Up Glam",
        "description": "50s/60s poster lighting, hair rolls/waves, red lipstick, playful pose"
      },
      {
        "name": "High-Fashion Editorial Minimal",
        "description": "brutalist interior, couture lingerie lines, clean geometry, cold neutral grading"
      },
      {
        "name": "Poolside Tease",
        "description": "golden hour, wet hair, bikini/one-piece, sun-kissed skin, glossy skin highlights"
      }
    ]
  },
  "archetypes": {
    "label": "Архетипы моделей",
    "options": [
      {
        "name": "California Blonde Glam",
        "description": "long blonde blowout, glossy nude lips, playful confidence, high heels"
      },
      {
        "name": "Brunette Femme Fatale",
        "description": "sleek dark hair, smoky eyes, low-key light, patent stilettos"
      },
      {
        "name": "Soft Romantic",
        "description": "wavy hair, minimal makeup, lace satin set, warm boudoir"
      },
      {
        "name": "Athletic Power",
        "description": "toned body, clean makeup, minimalist set, studio high-key"
      },
      {
        "name": "Alt-Editorial",
        "description": "sharp eyeliner, monochrome palette, brutalist interior, ankle boots"
      },
      {
        "name": "Classic Bombshell",
        "description": "big waves, red lipstick, vintage pin-up lighting, corset vibe"
      },
      {
        "name": "Elegant Sophisticate",
        "description": "sleek updo, minimal jewelry, silk lingerie, luxury hotel setting"
      },
      {
        "name": "Edgy Modern",
        "description": "short hair, bold makeup, latex-look pieces, industrial setting"
      }
    ]
  }
};

// Инициализация при загрузке страницы
function loadConfig() {
    initializeUI();
}

// Инициализация UI
function initializeUI() {
    // Заполнение селектов
    populateSelect('engine', config.engine.options);
    populateSelect('format', config.format.options, 'value');
    populateSelect('realism', config.realism.options);
    populateSelect('contentType', config.contentType.options);
    populateSelect('product', config.product.options);
    populateSelect('artDirection', config.artDirection.options);
    
    // Модель
    populateSelect('modelAge', config.model.age.options);
    populateSelect('modelBodyType', config.model.bodyType.options);
    populateSelect('modelProportions', config.model.proportions.options);
    populateSelect('modelFace', config.model.face.options);
    populateSelect('modelEmotion', config.model.emotion.options);
    populateSelect('modelGaze', config.model.gaze.options);
    
    // Beauty
    populateSelect('hair', config.beauty.hair.options);
    populateSelect('makeup', config.beauty.makeup.options);
    populateSelect('nails', config.beauty.nails.options);
    
    // Гардероб
    populateSelect('lingerieType', config.wardrobe.lingerie.type.options);
    populateSelect('lingerieMaterial', config.wardrobe.lingerie.material.options);
    populateSelect('lingerieDetails', config.wardrobe.lingerie.details.options);
    populateSelect('shoesType', config.wardrobe.shoes.type.options);
    populateSelect('shoesDetails', config.wardrobe.shoes.details.options);
    populateSelect('outerLayer', config.wardrobe.outerLayer.options);
    
    // Аксессуары
    populateSelect('stockings', config.accessories.stockings.options);
    populateSelect('jewelry', config.accessories.jewelry.options);
    populateSelect('props', config.accessories.props.options);
    
    // Сцена
    populateSelect('scene', config.scene.options, 'name', 'description');
    
    // Поза
    populateSelect('poseBase', config.pose.base.options);
    populateSelect('poseBodyLanguage', config.pose.bodyLanguage.options);
    populateSelect('poseAction', config.pose.action.options);
    
    // Камера
    populateSelect('cameraShot', config.camera.shot.options);
    populateSelect('cameraAngle', config.camera.angle.options);
    populateSelect('cameraLens', config.camera.lens.options);
    
    // Свет
    populateSelect('lighting', config.lighting.options);
    
    // Грейдинг
    populateSelect('colorGrading', config.grading.colorGrading.options);
    
    // Пресеты
    populateSelect('aestheticPreset', config.aestheticPresets.options, 'name', 'description');
    populateSelect('archetype', config.archetypes.options, 'name', 'description');
    
    // Boldness
    updateBoldnessLabel(0);
    document.getElementById('boldness').addEventListener('input', (e) => {
        updateBoldnessLabel(parseInt(e.target.value));
    });
    
    // Кнопки
    document.getElementById('generateBtn').addEventListener('click', generatePrompt);
    document.getElementById('randomBtn').addEventListener('click', generateRandomPrompt);
    document.getElementById('resetBtn').addEventListener('click', resetForm);
    document.getElementById('copyBtn').addEventListener('click', copyPrompt);
}

// Заполнение селекта
function populateSelect(selectId, options, valueKey = null, textKey = null) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    select.innerHTML = '<option value="">Не выбрано</option>';
    
    options.forEach(option => {
        const optionEl = document.createElement('option');
        
        if (typeof option === 'string') {
            optionEl.value = option;
            optionEl.textContent = option;
        } else if (typeof option === 'object') {
            if (valueKey && textKey) {
                optionEl.value = option[valueKey];
                optionEl.textContent = `${option[valueKey]}${option[textKey] ? ' - ' + option[textKey] : ''}`;
                optionEl.dataset.description = option[textKey] || '';
            } else if (valueKey) {
                optionEl.value = option[valueKey];
                optionEl.textContent = option[valueKey];
            } else {
                optionEl.value = option.name || option.value || option;
                optionEl.textContent = option.name || option.value || option;
            }
        }
        
        select.appendChild(optionEl);
    });
}

// Обновление лейбла boldness
function updateBoldnessLabel(level) {
    const boldnessLevel = config.boldness.levels[level];
    const label = document.getElementById('boldnessLabel');
    if (label && boldnessLevel) {
        label.textContent = `B${level} - ${boldnessLevel.name}`;
    }
}

// Генерация промпта
function generatePrompt() {
    const mainParts = [];
    const negativeParts = [];
    
    // ========== ЗАГОЛОВОК И ОСНОВНОЕ НАПРАВЛЕНИЕ ==========
    const contentType = document.getElementById('contentType').value;
    const product = document.getElementById('product').value;
    const artDirection = document.getElementById('artDirection').value;
    
    let header = '';
    
    // Приоритет: artDirection > contentType
    if (artDirection) {
        header = artDirection;
        if (product && contentType) {
            header += ` for a ${product === 'set' ? 'lingerie' : product} campaign`;
        }
        header += ' photo';
    } else if (contentType) {
        header = contentType;
        if (product) {
            header += ` for a ${product === 'set' ? 'lingerie' : product} campaign`;
        }
        header += ' photo';
    } else {
        header = 'High-end glamour magazine editorial photo';
        if (product) {
            header += ` for a ${product === 'set' ? 'lingerie' : product} campaign`;
        }
    }
    
    mainParts.push(header);
    
    // Пресет эстетики (если выбран)
    const aestheticPreset = document.getElementById('aestheticPreset').value;
    if (aestheticPreset) {
        const preset = config.aestheticPresets.options.find(p => p.name === aestheticPreset);
        if (preset) {
            mainParts.push(preset.description);
        }
    }
    
    // ========== МОДЕЛЬ ==========
    const modelParts = [];
    const archetype = document.getElementById('archetype').value;
    
    if (archetype) {
        // Если выбран архетип, используем его описание
        const arch = config.archetypes.options.find(a => a.name === archetype);
        if (arch) {
            modelParts.push(arch.description);
        }
    } else {
        // Иначе собираем модель из параметров
        const modelAge = document.getElementById('modelAge').value || config.model.age.default;
        if (modelAge) {
            modelParts.push(modelAge);
        }
        
        const modelGaze = document.getElementById('modelGaze').value;
        const modelEmotion = document.getElementById('modelEmotion').value;
        const modelProportions = document.getElementById('modelProportions').value;
        
        // Объединяем взгляд, эмоцию и пропорции в одну фразу
        const modelVibe = [];
        if (modelGaze) modelVibe.push(modelGaze);
        if (modelEmotion) modelVibe.push(modelEmotion);
        if (modelProportions) modelVibe.push(modelProportions);
        
        if (modelVibe.length > 0) {
            modelParts.push(modelVibe.join(', '));
        }
        
        const modelBodyType = document.getElementById('modelBodyType').value;
        if (modelBodyType) {
            modelParts.push(modelBodyType + ' body');
        }
        
        const modelFace = document.getElementById('modelFace').value;
        if (modelFace) {
            modelParts.push(modelFace);
        }
    }
    
    if (modelParts.length > 0) {
        mainParts.push(modelParts.join(', '));
    }
    
    // ========== BEAUTY ==========
    if (!archetype) {
        const beautyParts = [];
        
        const hair = document.getElementById('hair').value;
        if (hair) {
            beautyParts.push(hair);
        }
        
        const makeup = document.getElementById('makeup').value;
        if (makeup) {
            beautyParts.push(makeup);
        }
        
        const nails = document.getElementById('nails').value;
        if (nails && nails !== 'none') {
            beautyParts.push(nails);
        }
        
        if (beautyParts.length > 0) {
            mainParts.push(beautyParts.join(', '));
        }
    }
    
    // ========== ГАРДЕРОБ ==========
    const wardrobeParts = [];
    
    const lingerieType = document.getElementById('lingerieType').value;
    const lingerieMaterial = document.getElementById('lingerieMaterial').value;
    const lingerieDetails = document.getElementById('lingerieDetails').value;
    
    if (lingerieType || lingerieMaterial) {
        let lingerieDesc = '';
        if (lingerieMaterial && lingerieType) {
            // Формируем более естественное описание
            if (lingerieType.includes('set')) {
                lingerieDesc = `${lingerieMaterial} ${lingerieType}`;
            } else {
                lingerieDesc = `${lingerieMaterial} ${lingerieType}`;
            }
        } else if (lingerieType) {
            lingerieDesc = lingerieType;
        } else if (lingerieMaterial) {
            lingerieDesc = lingerieMaterial + ' lingerie';
        }
        
        if (lingerieDetails && lingerieDetails !== 'none') {
            if (lingerieDetails.includes('high-waist')) {
                lingerieDesc += ` with ${lingerieDetails} briefs`;
            } else {
                lingerieDesc += `, ${lingerieDetails}`;
            }
        }
        
        if (lingerieDesc) {
            wardrobeParts.push(lingerieDesc);
        }
    }
    
    const stockings = document.getElementById('stockings').value;
    if (stockings && stockings !== 'none') {
        wardrobeParts.push(stockings);
    }
    
    const shoesType = document.getElementById('shoesType').value;
    const shoesDetails = document.getElementById('shoesDetails').value;
    
    if (shoesType || shoesDetails) {
        let shoesDesc = '';
        if (shoesDetails && shoesDetails !== 'none') {
            shoesDesc = shoesDetails;
        }
        if (shoesType) {
            if (shoesDetails && shoesDetails !== 'none') {
                shoesDesc += ' ' + shoesType;
            } else {
                shoesDesc = shoesType;
            }
        }
        if (shoesDesc) {
            wardrobeParts.push(shoesDesc);
        }
    }
    
    const outerLayer = document.getElementById('outerLayer').value;
    if (outerLayer && outerLayer !== 'none') {
        wardrobeParts.push(outerLayer);
    }
    
    const jewelry = document.getElementById('jewelry').value;
    if (jewelry && jewelry !== 'none') {
        wardrobeParts.push(jewelry);
    }
    
    if (wardrobeParts.length > 0) {
        mainParts.push(wardrobeParts.join(', ') + '.');
    }
    
    // ========== СЦЕНА / ИНТЕРЬЕР ==========
    const scene = document.getElementById('scene').value;
    if (scene) {
        const sceneObj = config.scene.options.find(s => s.name === scene);
        if (sceneObj) {
            mainParts.push(`\n${sceneObj.name} interior: ${sceneObj.description}, tasteful and cinematic atmosphere.`);
        }
    }
    
    // ========== ПОЗА И ДЕЙСТВИЕ ==========
    const poseParts = [];
    const poseBase = document.getElementById('poseBase').value;
    const poseBodyLanguage = document.getElementById('poseBodyLanguage').value;
    const poseAction = document.getElementById('poseAction').value;
    const cameraShot = document.getElementById('cameraShot').value;
    
    if (poseBase || poseBodyLanguage || poseAction || cameraShot) {
        const actionParts = [];
        
        if (cameraShot && poseBase) {
            actionParts.push(`${poseBase} ${cameraShot} full body`);
        } else if (cameraShot) {
            actionParts.push(`${cameraShot} full body`);
        } else if (poseBase) {
            actionParts.push(poseBase);
        }
        
        if (poseBodyLanguage) {
            actionParts.push(poseBodyLanguage);
        }
        
        if (poseAction) {
            actionParts.push(poseAction);
        }
        
        const props = document.getElementById('props').value;
        if (props && props !== 'none') {
            actionParts.push(`with ${props}`);
        }
        
        if (actionParts.length > 0) {
            mainParts.push(`Pose/action: ${actionParts.join(', ')}.`);
        }
    }
    
    // ========== СВЕТ ==========
    const lighting = document.getElementById('lighting').value;
    if (lighting) {
        mainParts.push(`\nLighting: ${lighting}, controlled highlights, clean shadows, no blown whites.`);
    }
    
    // ========== КАМЕРА И КОМПОЗИЦИЯ ==========
    const cameraParts = [];
    const cameraLens = document.getElementById('cameraLens').value;
    const cameraAngle = document.getElementById('cameraAngle').value;
    const cameraFocus = config.camera.focus.default;
    const cameraComposition = config.camera.composition.default;
    
    if (cameraLens || cameraAngle || cameraFocus || cameraComposition) {
        cameraParts.push('Camera/composition:');
        
        if (cameraLens) {
            cameraParts.push(cameraLens + ' look');
        }
        
        if (cameraAngle) {
            cameraParts.push(cameraAngle);
        }
        
        if (cameraFocus) {
            cameraParts.push(cameraFocus);
        }
        
        if (cameraComposition) {
            cameraParts.push(cameraComposition);
        }
        
        const detail = config.grading.detail.default;
        if (detail) {
            cameraParts.push(detail);
        }
        
        const retouch = config.grading.retouch.default;
        if (retouch) {
            cameraParts.push(retouch);
        }
        
        const colorGrading = document.getElementById('colorGrading').value;
        if (colorGrading) {
            cameraParts.push(colorGrading + ' grading');
        }
        
        const realism = document.getElementById('realism').value;
        if (realism) {
            cameraParts.push(realism);
        }
        
        const quality = config.quality.default;
        if (quality) {
            cameraParts.push(quality);
        }
        
        if (cameraParts.length > 1) {
            mainParts.push(cameraParts.join(', ') + '.');
        }
    }
    
    // ========== BOLDNESS ==========
    const boldnessLevel = parseInt(document.getElementById('boldness').value);
    const boldness = config.boldness.levels[boldnessLevel];
    if (boldness && boldnessLevel > 0) {
        mainParts.push(boldness.description + '.');
    }
    
    // ========== NEGATIVE / CONSTRAINTS ==========
    negativeParts.push('NEGATIVE / CONSTRAINTS');
    
    // Добавляем стандартные ограничения
    config.negatives.default.forEach(negative => {
        negativeParts.push(negative);
    });
    
    // Формат (в конец для некоторых движков)
    const format = document.getElementById('format').value;
    if (format) {
        const formatObj = config.format.options.find(f => f.value === format);
        if (formatObj && formatObj.aspect) {
            negativeParts.push(`--ar ${formatObj.aspect}`);
        }
    }
    
    // ========== СОБИРАЕМ ФИНАЛЬНЫЙ ПРОМПТ ==========
    let prompt = mainParts.join(', ');
    
    if (negativeParts.length > 1) {
        prompt += '\n\n' + negativeParts.join(', ');
    }
    
    // Выводим результат
    const output = document.getElementById('output');
    output.value = prompt;
    
    // Обновляем длину
    document.getElementById('promptLength').textContent = prompt.length;
    
    // Прокрутка к результату
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Генерация случайного промпта
function generateRandomPrompt() {
    // Функция для случайного выбора из массива
    function randomChoice(array) {
        if (!array || array.length === 0) return null;
        return array[Math.floor(Math.random() * array.length)];
    }
    
    // Функция для случайного выбора из селекта (пропуская пустое значение)
    function randomSelect(selectId, options) {
        const select = document.getElementById(selectId);
        if (!select || !options || options.length === 0) return;
        
        // Пропускаем первое значение "Не выбрано"
        const randomIndex = Math.floor(Math.random() * (options.length)) + 1;
        if (randomIndex < select.options.length) {
            select.selectedIndex = randomIndex;
        }
    }
    
    // Функция для случайного выбора из объекта с name/description
    function randomSelectObject(selectId, options) {
        const select = document.getElementById(selectId);
        if (!select || !options || options.length === 0) return;
        
        const randomOption = randomChoice(options);
        if (randomOption) {
            // Находим опцию по значению
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value === randomOption.name) {
                    select.selectedIndex = i;
                    break;
                }
            }
        }
    }
    
    // Случайно выбираем значения (engine пропускаем)
    
    // Основные настройки
    randomSelect('format', config.format.options);
    randomSelect('realism', config.realism.options);
    randomSelect('contentType', config.contentType.options);
    randomSelect('product', config.product.options);
    randomSelect('artDirection', config.artDirection.options);
    
    // Модель
    randomSelect('modelAge', config.model.age.options);
    randomSelect('modelBodyType', config.model.bodyType.options);
    randomSelect('modelProportions', config.model.proportions.options);
    randomSelect('modelFace', config.model.face.options);
    randomSelect('modelEmotion', config.model.emotion.options);
    randomSelect('modelGaze', config.model.gaze.options);
    
    // Beauty
    randomSelect('hair', config.beauty.hair.options);
    randomSelect('makeup', config.beauty.makeup.options);
    randomSelect('nails', config.beauty.nails.options);
    
    // Гардероб
    randomSelect('lingerieType', config.wardrobe.lingerie.type.options);
    randomSelect('lingerieMaterial', config.wardrobe.lingerie.material.options);
    randomSelect('lingerieDetails', config.wardrobe.lingerie.details.options);
    randomSelect('shoesType', config.wardrobe.shoes.type.options);
    randomSelect('shoesDetails', config.wardrobe.shoes.details.options);
    randomSelect('outerLayer', config.wardrobe.outerLayer.options);
    
    // Аксессуары
    randomSelect('stockings', config.accessories.stockings.options);
    randomSelect('jewelry', config.accessories.jewelry.options);
    randomSelect('props', config.accessories.props.options);
    
    // Сцена
    randomSelectObject('scene', config.scene.options);
    
    // Поза
    randomSelect('poseBase', config.pose.base.options);
    randomSelect('poseBodyLanguage', config.pose.bodyLanguage.options);
    randomSelect('poseAction', config.pose.action.options);
    
    // Камера
    randomSelect('cameraShot', config.camera.shot.options);
    randomSelect('cameraAngle', config.camera.angle.options);
    randomSelect('cameraLens', config.camera.lens.options);
    
    // Свет
    randomSelect('lighting', config.lighting.options);
    
    // Грейдинг
    randomSelect('colorGrading', config.grading.colorGrading.options);
    
    // Пресеты (с вероятностью 30% выбираем пресет, 70% - нет)
    if (Math.random() < 0.3) {
        randomSelectObject('aestheticPreset', config.aestheticPresets.options);
    } else {
        document.getElementById('aestheticPreset').selectedIndex = 0;
    }
    
    // Архетипы (с вероятностью 30% выбираем архетип, 70% - нет)
    if (Math.random() < 0.3) {
        randomSelectObject('archetype', config.archetypes.options);
    } else {
        document.getElementById('archetype').selectedIndex = 0;
    }
    
    // Boldness - случайный уровень от 0 до 3
    const randomBoldness = Math.floor(Math.random() * 4);
    document.getElementById('boldness').value = randomBoldness;
    updateBoldnessLabel(randomBoldness);
    
    // Автоматически генерируем промпт
    generatePrompt();
}

// Сброс формы
function resetForm() {
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
    document.getElementById('boldness').value = 0;
    updateBoldnessLabel(0);
    document.getElementById('output').value = '';
    document.getElementById('promptLength').textContent = '0';
}

// Копирование промпта
function copyPrompt() {
    const output = document.getElementById('output');
    output.select();
    output.setSelectionRange(0, 99999); // Для мобильных устройств
    
    try {
        document.execCommand('copy');
        
        // Визуальная обратная связь
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Скопировано!';
        copyBtn.classList.add('copy-success');
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copy-success');
        }, 2000);
    } catch (err) {
        console.error('Ошибка копирования:', err);
        alert('Не удалось скопировать. Выделите текст вручную.');
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', loadConfig);



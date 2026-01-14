// ============================================================================
// КОНФИГУРАЦИЯ UI - Управление значениями в селекторах
// ============================================================================

const UI_CONFIG = {
    // Движки генерации
    engines: [
        { value: 'grok', label: 'Grok' },
        { value: 'generic', label: 'Generic' }
    ],

    // Форматы изображений
    formats: [
        { value: 'IG_4x5', label: 'Instagram 4:5' },
        { value: 'Story_9x16', label: 'Story 9:16' },
        { value: 'Print_2x3', label: 'Print 2:3' }
    ],

    // Режимы рандома
    randomModes: [
        { value: 'manual', label: 'Ручной' },
        { value: 'guided', label: 'Частичный' },
        { value: 'full', label: 'Полный' }
    ],

    // Модули для ручного выбора
    modules: [
        { name: 'goal', label: 'Goal (Purpose)', icon: '🎯' },
        { name: 'artDirection', label: 'Art Direction', icon: '🎨' },
        { name: 'subject', label: 'Subject archetype', icon: '👤' },
        { name: 'beauty', label: 'Beauty (Hair/Makeup)', icon: '💄' },
        { name: 'wardrobe', label: 'Wardrobe (Lingerie)', icon: '👗' },
        { name: 'shoes', label: 'Shoes/Boots', icon: '👠' },
        { name: 'scene', label: 'Scene', icon: '🎬' },
        { name: 'pose', label: 'Pose/Action', icon: '🧍' },
        { name: 'lighting', label: 'Lighting', icon: '💡' },
        { name: 'camera', label: 'Camera/Composition', icon: '📷' },
        { name: 'color', label: 'Color/Retouch', icon: '🎨' }
    ],

    // Настройки по умолчанию
    defaults: {
        engine: 'generic',
        format: 'Story_9x16',
        preset: '',
        enforceFullLength: true,
        boldness: 1, // B1
        randomMode: 'manual'
    },

    // Движки, для которых enforceFullLength всегда включено
    enginesWithForcedFullLength: ['grok']
};

// ============================================================================
// КОНФИГУРАЦИЯ BOLDNESS
// ============================================================================

const BOLDNESS_CONFIG = {
    levels: [
        {
            value: 0,
            badge: 'B0',
            description: 'Tasteful lingerie campaign, elegant pose, strategic coverage',
            modifier: 'tasteful lingerie campaign, elegant pose, strategic coverage'
        },
        {
            value: 1,
            badge: 'B1',
            description: 'Provocative glamour editorial, teasing but classy',
            modifier: 'provocative glamour editorial, teasing but classy'
        },
        {
            value: 2,
            badge: 'B2',
            description: 'Bold glamour, implied nudity but covered, tasteful framing',
            modifier: 'bold glamour, implied nudity but covered, tasteful framing'
        },
        {
            value: 3,
            badge: 'B3',
            description: 'Very bold glamour, on the edge, cinematic low-key, still non-explicit',
            modifier: 'very bold glamour, on the edge, cinematic low-key, still non-explicit, no sexual act'
        }
    ]
};

// ============================================================================
// ДАННЫЕ СЛОВАРЕЙ (LEXICONS)
// ============================================================================

const LEXICONS_DATA = {
    framing: {
        items: [
            {
                id: "full_length_standard",
                label: "Full-length standard",
                text_en: "FULL-LENGTH LONG SHOT, head-to-toe full body in frame, feet visible, shoes/boots visible, include floor, camera pulled back, wide framing, leave margin above head and below feet.",
                tags: ["full-length", "standard"],
                weight: 1.0
            }
        ]
    },
    goal: {
        items: [
          // --- Improved existing ---
          {
            id: "lingerie_ad_campaign",
            label: "Lingerie ad campaign (hero)",
            text_en: "luxury lingerie ad campaign hero shot, brand-ready, clean premium look, negative space for headline",
            tags: ["ad", "campaign", "hero", "copy-space", "brand"],
            weight: 1.0
          },
          {
            id: "glamour_magazine_editorial",
            label: "Glamour magazine editorial",
            text_en: "high-end glamour magazine editorial photo, premium fashion retouch, cinematic editorial mood",
            tags: ["editorial", "magazine", "premium", "cinematic"],
            weight: 1.0
          },
          {
            id: "luxury_lookbook_series",
            label: "Luxury lookbook (series)",
            text_en: "luxury lingerie lookbook series, consistent styling and lighting, catalog-ready but editorial",
            tags: ["lookbook", "luxury", "series", "consistent"],
            weight: 0.9
          },
      
          // --- New goals: platform/use-case driven ---
          {
            id: "social_media_teaser_post",
            label: "Social media teaser (feed)",
            text_en: "social media teaser post for lingerie, attention-grabbing but classy, strong silhouette, negative space for short copy",
            tags: ["social", "teaser", "copy-space", "attention"],
            weight: 0.95
          },
          {
            id: "social_story_reel_cover",
            label: "Story/Reel cover frame",
            text_en: "vertical story/reel cover frame for lingerie promotion, bold hero composition, clear subject separation, space for UI overlays",
            tags: ["social", "vertical", "cover", "ui-space", "hero"],
            weight: 0.8
          },
      
          // --- New goals: commerce/product clarity ---
          {
            id: "ecomm_product_showcase",
            label: "E-commerce product showcase",
            text_en: "e-commerce product showcase for lingerie, product-first clarity, accurate fit and fabric detail, clean background",
            tags: ["ecomm", "product-first", "fit", "detail", "clean"],
            weight: 0.75
          },
          {
            id: "footwear_boots_focus_ad",
            label: "Boots-focused campaign (lingerie + footwear)",
            text_en: "lingerie + boots campaign image, footwear clearly visible and emphasized, head-to-toe styling, premium ad look",
            tags: ["ad", "footwear", "boots-focus", "product-first", "hero"],
            weight: 0.85
          },
      
          // --- New goals: print/editorial formats ---
          {
            id: "magazine_cover_candidate",
            label: "Magazine cover candidate",
            text_en: "magazine cover candidate shot, iconic hero pose, clean background, generous negative space above for masthead",
            tags: ["magazine", "cover", "hero", "copy-space", "clean"],
            weight: 0.7
          },
          {
            id: "double_page_spread",
            label: "Double-page spread (editorial)",
            text_en: "editorial double-page spread image, cinematic mood, strong composition with negative space for article layout",
            tags: ["editorial", "spread", "cinematic", "layout-space"],
            weight: 0.65
          },
      
          // --- New goals: brand identity / positioning ---
          {
            id: "brand_signature_visual",
            label: "Brand signature visual",
            text_en: "brand signature visual for a luxury lingerie label, distinctive art direction, premium cohesive styling, timeless look",
            tags: ["brand", "signature", "luxury", "cohesive"],
            weight: 0.6
          },
      
          // --- New goals: motion feel / dynamic campaign ---
          {
            id: "dynamic_walk_sequence",
            label: "Dynamic walk (campaign sequence)",
            text_en: "dynamic campaign frame with motion feel (sharp subject), runway-like step, energetic editorial vibe",
            tags: ["campaign", "dynamic", "runway", "energy"],
            weight: 0.65
          }
        ]
      },
      
      artDirection: {
        items: [
          // --- Improved existing styles (more “directive”) ---
          {
            id: "playboy_studio_glam",
            label: "Playboy-inspired Studio Glam",
            text_en: "Playboy-inspired high-end glamour magazine editorial, clean studio cyclorama, glossy floor reflections, classic high-key glamour lighting with softbox key + subtle rim, warm-neutral filmic grading, negative space for headline",
            tags: ["set_studio", "surface_glossy", "lighting_high_key", "grading_warm", "vibe_playboy", "vibe_glamour", "layout_copy_space"],
            weight: 1.0
          },
          {
            id: "luxury_boudoir_warm",
            label: "Luxury Hotel Boudoir Warm",
            text_en: "Luxury hotel boudoir lingerie campaign, Playboy-inspired glamour editorial, warm practical lamp glow + soft diffused key light, velvet and silk textures, intimate but classy atmosphere, warm filmic grading",
            tags: ["set_boudoir", "set_hotel", "props_lamps", "texture_velvet", "texture_silk", "lighting_soft", "grading_warm", "vibe_glamour"],
            weight: 1.0
          },
          {
            id: "neon_night_cinematic",
            label: "Neon Night Cinematic",
            text_en: "Neon night glamour editorial, Playboy-inspired bold but classy, reflective surfaces and neon rim highlights, cinematic low-key contrast with controlled specular highlights, cool chrome grading",
            tags: ["set_corridor", "vibe_cinematic", "lighting_low_key", "lighting_rim", "grading_cool", "surface_reflective", "neon"],
            weight: 1.0
          },
          {
            id: "backstage_mirror_bulbs",
            label: "Backstage Mirror Bulbs",
            text_en: "Backstage dressing-room glamour editorial with mirror bulb lights, warm practical glow + soft key, glossy makeup highlights, intimate editorial mood, clean premium retouch",
            tags: ["set_backstage", "props_mirror", "props_bulbs", "lighting_practical", "grading_warm", "vibe_editorial", "vibe_glamour"],
            weight: 1.0
          },
          {
            id: "industrial_loft_edgy",
            label: "Industrial Loft Edgy (latex-look)",
            text_en: "Industrial loft edgy glamour editorial, modern concrete + chrome textures, latex-look aesthetic with controlled glossy highlights, crisp rim lighting, cool-neutral grading, high-fashion attitude",
            tags: ["set_loft", "set_industrial", "texture_concrete", "surface_chrome", "lighting_rim", "grading_cool", "vibe_high_fashion", "edgy"],
            weight: 0.9
          },
          {
            id: "vintage_pinup_glam",
            label: "Vintage Pin-Up Glam",
            text_en: "Vintage pin-up glamour editorial, retro classic soft-glam lighting, warm nostalgic film look, playful charm, clean studio backdrop with subtle vignette, timeless magazine aesthetic",
            tags: ["era_vintage", "pinup", "grading_warm", "lighting_soft", "vibe_classic", "vibe_playful"],
            weight: 1.0
          },
      
          // --- New styles (add real variety) ---
          {
            id: "daylight_penthouse_air",
            label: "Daylight Penthouse Airy",
            text_en: "Daylight penthouse lingerie editorial, large window light as key + soft fill, airy premium minimal interior, gentle highlights, warm-natural grading, modern clean luxury vibe",
            tags: ["set_penthouse", "lighting_window", "lighting_soft", "grading_warm", "minimal", "luxury", "daylight"],
            weight: 0.9
          },
          {
            id: "noir_blackwhite_editorial",
            label: "Noir Black & White Editorial",
            text_en: "Noir black-and-white glamour editorial, dramatic low-key lighting, strong chiaroscuro shadows, film-grain editorial texture, bold silhouette, classic magazine noir mood",
            tags: ["noir", "blackwhite", "lighting_low_key", "high_contrast", "vibe_cinematic", "classic"],
            weight: 0.8
          },
          {
            id: "old_money_luxury_suite",
            label: "Old-money Luxury Suite",
            text_en: "Old-money luxury suite editorial, warm golden practical lights, wood + marble textures, understated elegance, polished premium styling, timeless high-end campaign feel",
            tags: ["luxury", "old-money", "set_hotel", "texture_wood", "texture_marble", "grading_warm", "polished"],
            weight: 0.85
          },
          {
            id: "minimal_high_fashion_mono",
            label: "Minimal High-Fashion Mono",
            text_en: "Minimal high-fashion lingerie editorial, monochrome palette, clean geometric composition, controlled studio light, crisp edges, modern couture lookbook energy",
            tags: ["minimal", "monochrome", "vibe_high_fashion", "set_studio", "lighting_controlled", "clean"],
            weight: 0.85
          },
          {
            id: "chrome_cold_luxury",
            label: "Chrome Cold Luxury",
            text_en: "Chrome cold-luxury glamour editorial, reflective chrome surfaces, cool highlights, sleek modern styling, low-key controlled contrast, premium glossy finish",
            tags: ["surface_chrome", "grading_cool", "modern", "vibe_editorial", "lighting_low_key", "surface_reflective"],
            weight: 0.8
          },
          {
            id: "poolside_golden_hour",
            label: "Poolside Golden Hour Glam",
            text_en: "Poolside golden-hour glamour editorial, sun-kissed highlights, warm cinematic glow, relaxed luxurious vibe, sparkling reflections, magazine lifestyle feel",
            tags: ["outdoor", "golden_hour", "grading_warm", "lighting_natural", "lifestyle", "relaxed"],
            weight: 0.75
          },
          {
            id: "cabaret_backstage_smoky",
            label: "Cabaret Backstage Smoky",
            text_en: "Cabaret backstage glamour editorial, smoky moody atmosphere, warm practical lights + rim highlights, dramatic makeup sparkle, bold stage-adjacent vibe, premium cinematic finish",
            tags: ["set_backstage", "smoky", "lighting_practical", "lighting_rim", "vibe_cinematic", "bold"],
            weight: 0.75
          }
        ]
      },
      
    subject: {
    items: [
        { id: "blonde_bombshell", label: "Blonde (locked)", text_en: "platinum blonde hair, long glamorous waves, slim hourglass silhouette, confident direct gaze", tags: ["hair_blonde", "hair_long", "body_slim", "gaze_confident"], weight: 1.0 },
        { id: "brunette_femme_fatale", label: "Brunette (locked)", text_en: "deep brunette hair, long glossy waves, slim athletic silhouette, intense controlled gaze", tags: ["hair_brunette", "hair_long", "body_slim", "gaze_intense"], weight: 1.0 },
        { id: "dirty_blonde_sleek", label: "Dirty blonde (locked)", text_en: "dirty blonde hair, sleek straight hair, slim silhouette, teasing gaze", tags: ["hair_dirty_blonde", "hair_straight", "body_slim", "gaze_teasing"], weight: 0.9 },
        { id: "redhead_sophisticated", label: "Redhead (locked)", text_en: "rich auburn red hair, long soft waves, slim silhouette, elegant confident gaze", tags: ["hair_red", "hair_long", "body_slim", "gaze_elegant"], weight: 0.9 }
    ]
},
      
      beauty: {
    items: [
        { id: "glossy_waves_smoky", label: "Glossy waves + smoky", text_en: "glossy long waves, smoky eyes, soft neutral glossy lips, natural skin texture", tags: ["hair_waves", "makeup_smoky", "finish_glossy"], weight: 1.0 },
        { id: "soft_blowout_playful", label: "Soft blowout + playful", text_en: "soft blowout waves, playful teasing smile, soft smoky eyes, glossy lips, natural skin texture", tags: ["hair_blowout", "mood_playful", "makeup_soft_smoky"], weight: 1.0 },
        { id: "sleek_straight_winged", label: "Sleek straight + winged", text_en: "sleek glossy straight hair, winged eyeliner, glossy lips, clean editorial finish", tags: ["hair_sleek", "hair_straight", "makeup_winged"], weight: 1.0 },
        { id: "ponytail_smoky", label: "Ponytail + smoky", text_en: "sleek ponytail, confident teasing gaze, smoky eyes, glossy lips, natural skin texture", tags: ["hair_ponytail", "makeup_smoky", "mood_teasing"], weight: 1.0 },
        { id: "soft_waves_glowing", label: "Soft waves + glowing", text_en: "soft waves, glowing skin, glossy lips, natural texture, premium editorial finish", tags: ["hair_waves", "finish_glow", "finish_premium"], weight: 1.0 }
    ]
},
      
      wardrobe: {
    items: [
        // Classic base (still sexy)
        { id: "black_lace_corset", label: "Black lace corset set", text_en: "black lace corset lingerie with satin trim, high-waist briefs, sheer lace-top stockings", tags: ["color_black", "lace", "corset", "stockings", "sexy"], weight: 1.0 },
        { id: "black_lace_bustier", label: "Black lace bustier set", text_en: "black lace bustier set with clean structure, high-waist briefs, subtle fine fishnet stockings (tasteful)", tags: ["color_black", "lace", "bustier", "fishnet", "sexy"], weight: 0.95 },
        { id: "deep_red_satin", label: "Deep red satin set", text_en: "deep red satin lingerie set with subtle black lace trim, sheer black stockings", tags: ["color_red", "satin", "stockings", "sexy"], weight: 0.85 },

        // Brighter / hotter (ad-safe, non-explicit)
        { id: "black_strappy_garter_set", label: "Black strappy set + garters (hot)", text_en: "black strappy lingerie set with garter belt and gold hardware, high-leg briefs, sheer black stockings (lace-top)", tags: ["color_black", "strappy", "garter", "hardware_gold", "stockings", "hot", "sexy"], weight: 0.9 },
        { id: "sheer_mesh_plunge_bodysuit", label: "Sheer mesh plunge bodysuit (hot)", text_en: "sheer black mesh plunge bodysuit with strategically placed opaque panels, clean seams, high-leg cut, sheer black stockings", tags: ["color_black", "mesh", "bodysuit", "sheer", "hot", "sexy"], weight: 0.75 },
        { id: "rhinestone_crystal_strap_set", label: "Crystal strap set (statement)", text_en: "black lingerie set with crystal strap details and clean lines, high-leg briefs, sheer black stockings", tags: ["color_black", "crystal", "statement", "strappy", "hot", "sexy"], weight: 0.6 },
        { id: "latex_look_strappy_set", label: "Latex-look strappy set (edgy)", text_en: "black latex-look strappy lingerie set with controlled glossy highlights and minimal hardware, sheer black stockings", tags: ["color_black", "latex-look", "edgy", "strappy", "hot", "sexy"], weight: 0.55 },
        { id: "black_cutout_bodysuit", label: "Cutout bodysuit (bold)", text_en: "black cutout bodysuit lingerie with tasteful geometric cutouts and opaque panels, sheer black stockings", tags: ["color_black", "cutout", "bodysuit", "bold", "hot", "sexy"], weight: 0.55 },
        { id: "deep_red_strappy_set", label: "Deep red strappy set (bold)", text_en: "deep red strappy lingerie set with gold hardware, high-leg briefs, sheer black stockings", tags: ["color_red", "strappy", "hardware_gold", "bold", "hot", "sexy"], weight: 0.55 },

        // Softer options (for B0/B1 or contrast)
        { id: "ivory_satin_balconette", label: "Ivory satin balconette set", text_en: "ivory satin balconette set with lace trim, sheer beige lace-top stockings", tags: ["color_ivory", "satin", "balconette", "stockings", "classic"], weight: 0.65 },
        { id: "ivory_lace_bodysuit", label: "Ivory lace bodysuit", text_en: "ivory lace bodysuit lingerie with satin panel details, sheer beige stockings", tags: ["color_ivory", "lace", "bodysuit", "stockings", "classic"], weight: 0.6 }
    ]
},
      
      shoes: {
    items: [
        // Classic sexy heels
        { id: "black_patent_pumps", label: "Black patent pumps", text_en: "black patent pointed-toe pumps with a slim stiletto heel", tags: ["pumps", "patent", "color_black", "stiletto", "sexy"], weight: 1.0, constraints: { requires: ["include floor"] } },
        { id: "patent_stilettos", label: "Beige patent stilettos", text_en: "beige patent stilettos with a slim high heel", tags: ["stilettos", "patent", "color_beige", "sexy"], weight: 0.75, constraints: { requires: ["include floor"] } },

        // Hot/statement
        { id: "black_platform_pumps", label: "Black platform pumps (hot)", text_en: "black platform pumps with an ultra-high slim stiletto heel", tags: ["pumps", "platform", "color_black", "hot", "sexy", "statement"], weight: 0.7, constraints: { requires: ["include floor"] } },
        { id: "black_ankle_cuff_stilettos", label: "Black ankle-cuff stilettos (hot)", text_en: "black patent ankle-cuff stilettos with a pointed toe and slim high heel", tags: ["stilettos", "ankle-cuff", "patent", "color_black", "hot", "sexy"], weight: 0.7, constraints: { requires: ["include floor"] } },
        { id: "black_laceup_stiletto_sandals", label: "Black lace-up stiletto sandals (hot)", text_en: "black lace-up stiletto sandals wrapping the ankles, ultra-thin straps, high slim heel", tags: ["sandals", "lace-up", "strappy", "color_black", "hot", "sexy"], weight: 0.65, constraints: { requires: ["include floor"] } },
        { id: "metallic_silver_pumps", label: "Metallic silver pumps", text_en: "metallic silver pointed-toe pumps with a slim stiletto heel", tags: ["pumps", "metallic", "statement", "sexy"], weight: 0.35, constraints: { requires: ["include floor"] } },

        // Boots (very readable sexy)
        { id: "knee_high_suede_boots", label: "Knee-high suede boots", text_en: "knee-high black suede boots with a slim heel", tags: ["boots", "suede", "knee-high", "color_black", "sexy"], weight: 0.85, constraints: { requires: ["include floor"] } },
        { id: "knee_high_leather_boots", label: "Knee-high leather boots", text_en: "knee-high black leather boots with a slim stiletto heel", tags: ["boots", "leather", "knee-high", "color_black", "sexy"], weight: 0.55, constraints: { requires: ["include floor"] } },
        { id: "thigh_high_patent_boots", label: "Thigh-high patent boots", text_en: "over-the-knee black patent thigh-high boots with a slim stiletto heel", tags: ["boots", "patent", "thigh-high", "bold", "hot", "sexy", "statement"], weight: 0.8, constraints: { requires: ["include floor"] } },
        { id: "thigh_high_patent_laceup_boots", label: "Thigh-high patent lace-up boots (statement)", text_en: "over-the-knee black patent thigh-high boots with lace-up back detail and slim stiletto heel", tags: ["boots", "patent", "thigh-high", "lace-up", "hot", "sexy", "statement"], weight: 0.6, constraints: { requires: ["include floor"] } }
    ]
},
      
      scene: {
        items: [
          // --- Improved existing (more anchors) ---
          {
            id: "studio_cyclorama",
            label: "Studio cyclorama (glossy)",
            text_en: "clean studio cyclorama, glossy reflective floor, simple white cube prop, minimal set design, premium editorial vibe",
            tags: ["set_studio", "set_cyclorama", "surface_glossy", "props_cube", "mood_clean", "lighting_high_key_hint"],
            weight: 1.0
          },
          {
            id: "luxury_hotel_suite",
            label: "Luxury hotel suite (boudoir)",
            text_en: "luxury hotel suite boudoir, warm bedside lamps, velvet chair, large mirror, silk bedding, marble accents, intimate but classy atmosphere",
            tags: ["set_hotel", "set_boudoir", "props_lamps", "props_mirror", "texture_velvet", "texture_silk", "mood_warm", "luxury"],
            weight: 1.0
          },
          {
            id: "neon_corridor",
            label: "Neon corridor (reflective)",
            text_en: "modern night corridor with reflective floor, subtle neon glow reflections, glossy surfaces, cinematic atmosphere",
            tags: ["set_corridor", "time_night", "neon", "surface_reflective", "mood_cinematic", "lighting_low_key_hint"],
            weight: 1.0
          },
          {
            id: "dressing_room_mirrors",
            label: "Dressing room mirrors (bulbs)",
            text_en: "backstage dressing room with large mirror and warm bulb lights, velvet stool, tasteful atmosphere, premium editorial mood",
            tags: ["set_backstage", "props_mirror", "props_bulbs", "texture_velvet", "mood_warm", "editorial"],
            weight: 1.0
          },
          {
            id: "industrial_loft",
            label: "Industrial loft (concrete + chrome)",
            text_en: "industrial loft with concrete walls, chrome accents, minimal modern furniture, clean geometric props, edgy fashion atmosphere",
            tags: ["set_loft", "set_industrial", "texture_concrete", "surface_chrome", "mood_edgy", "modern"],
            weight: 1.0
          },
          {
            id: "daylight_penthouse",
            label: "Daylight penthouse (windows)",
            text_en: "modern penthouse loft with floor-to-ceiling windows, soft sunbeams, warm wood + white minimal interior, airy premium atmosphere",
            tags: ["set_penthouse", "time_day", "lighting_window_hint", "texture_wood", "mood_airy", "modern", "warm"],
            weight: 1.0
          },
      
          // --- New: studio variants (big payoff for ads/lookbooks) ---
          {
            id: "studio_seamless_white_clean",
            label: "Studio seamless white (e-comm clean)",
            text_en: "seamless white studio backdrop, matte floor, ultra-clean commercial setup, product-first clarity, minimal props",
            tags: ["set_studio", "mood_ultra_clean", "ecomm", "product_first", "surface_matte", "lighting_high_key_hint"],
            weight: 0.85
          },
          {
            id: "studio_black_seamless_lowkey",
            label: "Studio black seamless (low-key)",
            text_en: "black seamless studio backdrop, subtle haze, controlled reflections, dramatic low-key editorial atmosphere",
            tags: ["set_studio", "mood_noir", "surface_controlled_reflection", "lighting_low_key_hint", "cinematic"],
            weight: 0.7
          },
          {
            id: "studio_color_gel_wall",
            label: "Studio gel wall (editorial color)",
            text_en: "studio setup with colored gel lights and a clean textured wall, subtle gradients, modern editorial vibe",
            tags: ["set_studio", "editorial", "color_gels", "modern", "lighting_gel_hint"],
            weight: 0.55
          },
      
          // --- New: luxury “old-money” interiors ---
          {
            id: "old_money_suite_wood_marble",
            label: "Old-money suite (wood + marble)",
            text_en: "old-money luxury suite, warm golden lamps, wood paneling, marble surfaces, classic framed mirror, timeless premium atmosphere",
            tags: ["luxury", "set_hotel", "mood_warm", "texture_wood", "texture_marble", "props_mirror", "classic"],
            weight: 0.75
          },
          {
            id: "classic_library_lounge",
            label: "Classic lounge (leather chair)",
            text_en: "classic lounge interior with a leather armchair, warm lamp light, dark wood details, refined cinematic mood",
            tags: ["classic", "texture_leather", "texture_wood", "mood_cinematic", "props_lamps", "luxury"],
            weight: 0.55
          },
      
          // --- New: “chrome luxury / modern gloss” ---
          {
            id: "chrome_luxury_bathroom",
            label: "Chrome luxury bathroom (marble + mirror)",
            text_en: "luxury marble bathroom with chrome fixtures, large mirror, glossy surfaces, modern premium atmosphere (tasteful, editorial)",
            tags: ["luxury", "texture_marble", "surface_chrome", "props_mirror", "surface_glossy", "modern"],
            weight: 0.6
          },
          {
            id: "modern_glass_penthouse_night",
            label: "Glass penthouse at night (city bokeh)",
            text_en: "glass-walled penthouse at night with city lights bokeh, reflective surfaces, sleek modern mood",
            tags: ["set_penthouse", "time_night", "surface_reflective", "mood_cinematic", "modern"],
            weight: 0.6
          },
      
          // --- New: cinematic/noir corridors & staircases ---
          {
            id: "hotel_elevator_lobby",
            label: "Hotel elevator lobby (sleek)",
            text_en: "sleek hotel elevator lobby with polished stone floor, warm accent lighting, clean lines, premium cinematic vibe",
            tags: ["set_hotel", "set_lobby", "surface_polished_stone", "mood_cinematic", "luxury"],
            weight: 0.65
          },
          {
            id: "staircase_marble_glam",
            label: "Marble staircase glam",
            text_en: "marble staircase with elegant railing, warm accent lights, glossy highlights, editorial luxury atmosphere",
            tags: ["texture_marble", "luxury", "mood_glamour", "surface_glossy", "editorial"],
            weight: 0.55
          },
      
          // --- New: cabaret / backstage alternative (more variety than dressing-room) ---
          {
            id: "cabaret_backstage",
            label: "Cabaret backstage (smoky)",
            text_en: "cabaret backstage with warm practical lights, subtle haze, velvet curtains, cinematic moody atmosphere",
            tags: ["set_backstage", "smoky", "texture_velvet", "props_lamps", "mood_cinematic", "bold"],
            weight: 0.5
          },
      
          // --- New: outdoor/lifestyle (for social/editorial) ---
          {
            id: "poolside_golden_hour",
            label: "Poolside golden hour",
            text_en: "poolside at golden hour, warm sun glow, sparkling reflections, luxury lifestyle atmosphere (magazine feel)",
            tags: ["outdoor", "time_golden_hour", "mood_relaxed", "surface_reflective", "lifestyle", "warm"],
            weight: 0.4
          },
          {
            id: "rooftop_night_city",
            label: "Rooftop night (city skyline)",
            text_en: "rooftop at night with city skyline bokeh, subtle wind, modern cinematic atmosphere",
            tags: ["outdoor", "time_night", "mood_cinematic", "modern", "city_bokeh"],
            weight: 0.35
          },
      
          // --- New: minimal brutalist / high-fashion editorial ---
          {
            id: "brutalist_minimal_set",
            label: "Brutalist minimal set",
            text_en: "brutalist minimal interior with concrete geometry, clean lines, curated props, high-fashion editorial atmosphere",
            tags: ["minimal", "texture_concrete", "vibe_high_fashion", "editorial", "modern"],
            weight: 0.55
          },
          {
            id: "monochrome_gallery_space",
            label: "Monochrome gallery space",
            text_en: "minimal monochrome gallery space, smooth walls, subtle shadows, clean premium atmosphere",
            tags: ["minimal", "monochrome", "mood_clean", "editorial", "set_gallery"],
            weight: 0.5
          }
        ]
      },
      
    pose: {
        items: [
          // --- Improved existing (less repetition, clearer intent) ---
          {
            id: "standing_full_body_robe",
            label: "Standing full body (robe slip)",
            text_en: "standing full body, one hand holding a silk robe slipped off the shoulders for strategic coverage, the other hand resting on thigh, elongated neck, relaxed shoulders, elegant posture",
            tags: ["pose_standing", "full_body", "elegant", "outer_layer_robe", "coverage_strategic"],
            weight: 1.0
          },
          {
            id: "walking_toward_camera_runway",
            label: "Walking toward camera (runway)",
            text_en: "full-body mid-step walking toward camera, one leg forward, confident runway posture, relaxed shoulders, direct gaze",
            tags: ["pose_walking", "full_body", "dynamic", "confident"],
            weight: 1.0
          },
          {
            id: "standing_near_mirror_adjust_earring",
            label: "Near mirror (adjusting earring)",
            text_en: "standing full body near a mirror, adjusting an earring, elongated neck, relaxed shoulders, classy editorial mood",
            tags: ["pose_standing", "full_body", "elegant", "prop_mirror"],
            weight: 0.9,
            constraints: { requires: ["props_mirror"] }
          },
          {
            id: "standing_near_window_silhouette",
            label: "Near window (soft silhouette)",
            text_en: "standing full body near a window, soft silhouette, one hand holding a sheer robe slipped off shoulders for strategic coverage, calm confident gaze",
            tags: ["pose_standing", "full_body", "romantic", "prop_window", "coverage_strategic"],
            weight: 0.9,
            constraints: { requires: ["lighting_window_hint"] }
          },
          {
            id: "studio_editorial_hand_on_hip",
            label: "Studio editorial (hand on hip)",
            text_en: "standing full body, confident editorial pose, one hand on hip, shoulders relaxed, subtle S-curve, direct gaze",
            tags: ["pose_standing", "full_body", "editorial", "confident", "studio_friendly"],
            weight: 1.0
          },
      
          // --- Standing variations (big variety, magazine-ready) ---
          {
            id: "classic_cover_pose_centered",
            label: "Classic cover pose (centered)",
            text_en: "standing full body, centered composition energy, weight shifted to one hip, one knee softly bent, one hand holding blazer lapel for strategic coverage, confident direct gaze",
            tags: ["pose_standing", "full_body", "cover_ready", "outer_layer_blazer", "coverage_strategic", "copy_space"],
            weight: 0.95
          },
          {
            id: "three_quarter_s_curve",
            label: "Three-quarter S-curve",
            text_en: "standing three-quarter full body, torso slightly twisted to create an S-curve, hips angled, one hand brushing hair back, teasing but classy smile",
            tags: ["pose_standing", "full_body", "editorial", "playful"],
            weight: 0.9
          },
          {
            id: "over_shoulder_back_turn",
            label: "Over-shoulder (back turn)",
            text_en: "standing full body with back mostly toward camera, looking over the shoulder with a bold confident gaze, one hand on hip, elegant posture",
            tags: ["pose_standing", "full_body", "over_shoulder", "bold", "editorial"],
            weight: 0.75
          },
          {
            id: "arms_up_adjust_hair",
            label: "Arms up (adjusting hair)",
            text_en: "standing full body, both hands raised to adjust hair, blazer resting low on shoulders for strategic coverage, hips angled, calm confident expression",
            tags: ["pose_standing", "full_body", "outer_layer_blazer", "coverage_strategic", "glamour"],
            weight: 0.85
          },
          {
            id: "crossed_ankles_fashion_stance",
            label: "Crossed ankles (fashion stance)",
            text_en: "standing full body with ankles crossed, one hand on waist, the other holding robe/blazer lapel for strategic coverage, elongated neck, poised expression",
            tags: ["pose_standing", "full_body", "poised", "classic_glam", "coverage_strategic"],
            weight: 0.8
          },
          {
            id: "side_profile_chin_turn",
            label: "Side profile (chin turn)",
            text_en: "standing full body in side profile, chin slightly turned toward camera, one hand on hip, subtle arch, classy bold glamour",
            tags: ["pose_standing", "full_body", "profile", "bold", "editorial"],
            weight: 0.65
          },
      
          // --- Boots / heels emphasis (helps shoes visibility) ---
          {
            id: "boots_forward_emphasis",
            label: "Boots forward emphasis",
            text_en: "standing full body, one boot placed forward to emphasize footwear, toe pointed, one hand resting on upper thigh near the stocking lace-top, confident gaze",
            tags: ["pose_standing", "full_body", "product_emphasis_boots", "boots_friendly", "bold"],
            weight: 0.85
          },
          {
            id: "heels_pointed_leg_extend",
            label: "Heels emphasis (leg extend)",
            text_en: "standing full body, one leg extended slightly with pointed toe to emphasize heels, hips angled, one hand on waist, confident editorial attitude",
            tags: ["pose_standing", "full_body", "product_emphasis_heels", "heels_friendly", "editorial"],
            weight: 0.75
          },
      
          // --- Leaning / props (adds variety + composition anchors) ---
          {
            id: "lean_on_cube_studio",
            label: "Lean on cube (studio prop)",
            text_en: "standing full body leaning one hip lightly against a white cube, one hand resting on the cube edge, the other holding blazer lapel for strategic coverage, teasing smile",
            tags: ["pose_leaning", "full_body", "prop_cube", "studio_friendly", "outer_layer_blazer", "coverage_strategic"],
            weight: 0.8,
            constraints: { requires: ["props_cube"] }
          },
          {
            id: "lean_on_wall_editorial",
            label: "Lean on wall (editorial)",
            text_en: "standing full body leaning lightly on a wall, shoulders relaxed, one hand grazing the waist, composed expression, high-fashion editorial attitude",
            tags: ["pose_leaning", "full_body", "editorial", "cool"],
            weight: 0.7
          },
          {
            id: "hand_on_mirror_frame",
            label: "Hand on mirror frame",
            text_en: "standing full body, one hand lightly touching the mirror frame, the other holding robe slipped off shoulders for strategic coverage, elongated neck, calm confident gaze",
            tags: ["pose_standing", "full_body", "prop_mirror", "coverage_strategic", "luxury"],
            weight: 0.7,
            constraints: { requires: ["props_mirror"] }
          },
      
          // --- Seated (strong variation; still full-body) ---
          {
            id: "seated_on_cube_legs_forward",
            label: "Seated on cube (legs forward)",
            text_en: "seated on a white cube (full body visible), legs angled forward with one boot slightly ahead, torso upright, one hand on the cube for balance, confident gaze",
            tags: ["pose_seated", "full_body", "prop_cube", "boots_friendly", "editorial"],
            weight: 0.65,
            constraints: { requires: ["props_cube"] }
          },
          {
            id: "seated_on_chair_cross_leg",
            label: "Seated on chair (crossed leg)",
            text_en: "seated on a chair (full body visible), legs crossed at the knee, shoulders relaxed, one hand on armrest, composed confident expression, classy glamour",
            tags: ["pose_seated", "full_body", "prop_chair", "classic_glam", "poised"],
            weight: 0.6,
            constraints: { requires: ["prop_chair"] }
          },
          {
            id: "sit_edge_bed_elegant",
            label: "Sit on bed edge (elegant)",
            text_en: "seated on the edge of the bed (full body visible), torso upright, legs angled to the side, one hand holding a robe for strategic coverage, soft confident gaze",
            tags: ["pose_seated", "full_body", "prop_bed", "boudoir", "coverage_strategic", "romantic"],
            weight: 0.55,
            constraints: { requires: ["set_boudoir"] }
          },
          {
            id: "seated_on_stool_mirror_room",
            label: "Seated on stool (backstage)",
            text_en: "seated on a velvet stool (full body visible), one leg slightly forward, adjusting earring, relaxed shoulders, editorial backstage mood",
            tags: ["pose_seated", "full_body", "prop_stool", "prop_mirror", "backstage", "editorial"],
            weight: 0.55,
            constraints: { requires: ["props_mirror"] }
          },
      
          // --- Turning / motion-feel (great for campaign sequences) ---
          {
            id: "mid_turn_hair_motion",
            label: "Mid-turn (hair motion feel)",
            text_en: "full body captured mid-turn, hair with slight motion feel (subject sharp), blazer held at one shoulder for strategic coverage, playful confident smile",
            tags: ["pose_turning", "full_body", "dynamic", "outer_layer_blazer", "coverage_strategic", "playful"],
            weight: 0.6
          },
          {
            id: "walk_away_look_back",
            label: "Walk away (look back)",
            text_en: "full-body walking away with a look-back over the shoulder, confident teasing gaze, relaxed runway posture, classy editorial vibe",
            tags: ["pose_walking", "full_body", "over_shoulder", "dynamic", "editorial"],
            weight: 0.5
          },
      
          // --- Power / bold (still ad-safe) ---
          {
            id: "power_pose_legs_apart",
            label: "Power pose (strong stance)",
            text_en: "standing full body with legs slightly apart, strong posture, arms loosely folded or one hand on hip, assertive gaze, fearless editorial attitude",
            tags: ["pose_standing", "full_body", "power", "bold", "editorial"],
            weight: 0.55
          }
        ]
      },
      
      lighting: {
        items: [
          // --- Improved existing (clearer anchors + normalized tags) ---
          {
            id: "softbox_key_rim",
            label: "Softbox key + rim (high-key)",
            text_en: "large softbox key light + gentle rim light, clean high-key glamour, crisp controlled shadows, natural skin texture, fabric microtexture visible",
            tags: ["key_softbox", "rim_light", "contrast_medium", "temp_neutral", "studio", "lighting_high_key_hint"],
            weight: 1.0
          },
          {
            id: "warm_diffusion_rim",
            label: "Warm diffusion + rim (boudoir)",
            text_en: "warm diffused key light + gentle rim, soft intimate shadows, controlled satin highlights, warm boudoir glow, premium finish",
            tags: ["key_diffused", "rim_light", "temp_warm", "contrast_low_medium", "boudoir", "mood_intimate"],
            weight: 1.0
          },
          {
            id: "cinematic_lowkey_neon",
            label: "Cinematic low-key + neon rim",
            text_en: "cinematic low-key lighting, soft key + neon rim highlights, deep shadows, controlled specular highlights on satin/patent, modern night mood",
            tags: ["key_soft", "rim_neon", "contrast_high", "temp_cool", "cinematic", "neon", "lighting_low_key_hint"],
            weight: 1.0
          },
          {
            id: "warm_practical_bulbs",
            label: "Warm practical bulbs + soft key",
            text_en: "warm practical bulb lights + soft key, gentle glow, controlled highlights, natural skin texture, premium editorial finish",
            tags: ["practical_lights", "key_soft", "temp_warm", "contrast_medium", "backstage", "mood_warm"],
            weight: 1.0
          },
          {
            id: "window_light_fill",
            label: "Window light + fill (daylight)",
            text_en: "window light as key + soft fill, airy daylight mood, controlled highlights, soft shadows, premium finish with natural texture",
            tags: ["key_window", "fill_soft", "temp_neutral_warm", "contrast_low_medium", "daylight", "mood_airy"],
            weight: 1.0
          },
      
          // --- New: classic beauty lighting (very “magazine”) ---
          {
            id: "beauty_dish_clamshell",
            label: "Beauty dish clamshell (classic beauty)",
            text_en: "beauty dish key light with clamshell fill (reflector), clean glamorous skin highlights, minimal shadows, magazine beauty look",
            tags: ["key_beauty_dish", "fill_clamshell", "contrast_low", "temp_neutral", "glamour", "studio"],
            weight: 0.85
          },
          {
            id: "high_key_double_softbox",
            label: "High-key double softbox (very clean)",
            text_en: "high-key double softbox setup, ultra-even illumination, clean shadows, product-first clarity, crisp fabric detail",
            tags: ["key_softbox", "fill_softbox", "contrast_low", "temp_neutral", "studio", "ecomm_hint", "lighting_high_key_hint"],
            weight: 0.75
          },
      
          // --- New: more dramatic editorial options ---
          {
            id: "hard_key_sculpted",
            label: "Hard key sculpted (editorial edge)",
            text_en: "hard key light with sculpted shadows, high-fashion editorial contrast, crisp cheekbone definition, controlled highlights",
            tags: ["key_hard", "contrast_high", "temp_neutral", "editorial", "sculpted"],
            weight: 0.55
          },
          {
            id: "split_light_noir",
            label: "Split light noir (dramatic)",
            text_en: "dramatic split lighting, one side of the face in shadow, high-contrast noir mood, crisp edges, cinematic editorial feel",
            tags: ["key_hard", "contrast_high", "noir", "cinematic", "shadows_deep"],
            weight: 0.45
          },
      
          // --- New: rim / kicker emphasis (great for boots/patent/latex-look) ---
          {
            id: "rim_kicker_gloss_emphasis",
            label: "Rim + kicker (gloss emphasis)",
            text_en: "strong rim light + subtle kicker, controlled specular highlights to emphasize satin/patent/latex-look textures, clean separation from background",
            tags: ["rim_light_strong", "kicker_light", "contrast_medium_high", "texture_emphasis", "editorial"],
            weight: 0.65
          },
      
          // --- New: practical + window mixes (realistic luxury) ---
          {
            id: "practical_lamps_window_mix",
            label: "Practical lamps + window mix",
            text_en: "mix of warm practical lamps and soft window fill, naturalistic luxury mood, gentle shadows, controlled highlights",
            tags: ["practical_lights", "key_window", "fill_soft", "temp_warm", "contrast_medium", "luxury"],
            weight: 0.6
          },
      
          // --- New: silhouette / backlight (tasteful, very editorial) ---
          {
            id: "backlight_silhouette_soft",
            label: "Soft backlight silhouette (tasteful)",
            text_en: "soft backlight with gentle silhouette effect, minimal front fill, elegant contour highlights, tasteful editorial mood",
            tags: ["backlight", "silhouette", "contrast_medium_high", "editorial", "mood_cinematic"],
            weight: 0.4
          },
      
          // --- New: gobo / patterned shadows (adds huge variety) ---
          {
            id: "gobo_shadow_pattern",
            label: "Gobo shadow pattern (editorial)",
            text_en: "editorial gobo lighting with subtle shadow patterns, controlled contrast, cinematic texture on background, premium finish",
            tags: ["gobo_pattern", "contrast_medium", "cinematic", "editorial", "texture_background"],
            weight: 0.45
          },
      
          // --- New: colored gels (for neon/pops) ---
          {
            id: "gel_two_tone_editorial",
            label: "Two-tone gels (editorial pop)",
            text_en: "two-tone gel lighting (subtle), clean key light with colored rim accents, modern editorial pop, controlled highlights",
            tags: ["color_gels", "rim_light", "contrast_medium", "modern", "editorial"],
            weight: 0.5
          }
        ]
      },
      
      camera: {
        items: [
          // --- Reworked existing (more specific, less overlap) ---
          {
            id: "50mm_editorial_cover",
            label: "50mm editorial (cover framing)",
            text_en: "50mm editorial look, camera pulled back for full-length long shot, eye-level with slight low angle, centered or rule-of-thirds, generous negative space above for headline, sharp eyes and fabric microtexture, premium fashion retouch",
            tags: ["lens_50", "editorial", "framing_full_length", "distance_pulled_back", "angle_slight_low", "composition_cover", "copy_space"],
            weight: 1.0
          },
          {
            id: "35mm_low_angle_dynamic",
            label: "35mm low-angle (dynamic)",
            text_en: "35mm dynamic full-length shot, slightly low angle, camera pulled back to keep head-to-toe with margins, strong perspective lines, sharp eyes, soft background bokeh, cinematic editorial energy",
            tags: ["lens_35", "cinematic", "framing_full_length", "angle_low", "distance_pulled_back", "dof_shallow"],
            weight: 1.0
          },
          {
            id: "50mm_crisp_detail_clean",
            label: "50mm crisp detail (clean)",
            text_en: "50mm from a moderate distance, full-length but crisp face and fabric detail, controlled depth of field, clean premium editorial sharpness, natural texture preserved",
            tags: ["lens_50", "detail", "editorial", "framing_full_length", "dof_medium", "sharpness_high"],
            weight: 0.95
          },
      
          // --- New: 85mm compression (super magazine, elegant) ---
          {
            id: "85mm_compression_luxury",
            label: "85mm compression (luxury)",
            text_en: "85mm compressed perspective from a longer distance, full-length framing with elegant proportions, flattering magazine look, creamy bokeh, sharp eyes, premium editorial finish",
            tags: ["lens_85", "editorial", "luxury", "framing_full_length", "distance_far", "dof_shallow", "compression"],
            weight: 0.75
          },
      
          // --- New: 70mm-ish portrait compression (still full-length) ---
          {
            id: "70mm_editorial_series",
            label: "70mm editorial series (consistent)",
            text_en: "70mm editorial look for series consistency, full-length long shot, controlled perspective, clean lines, sharp fabric detail, premium retouch",
            tags: ["lens_70", "editorial", "series", "framing_full_length", "dof_medium", "clean"],
            weight: 0.65
          },
      
          // --- New: symmetrical studio framing (very cover/brand) ---
          {
            id: "50mm_symmetry_centered",
            label: "50mm symmetry (centered)",
            text_en: "50mm centered symmetrical composition, full-length long shot, straight horizon, clean studio geometry, generous top/bottom margins, boots and floor clearly visible, magazine cover energy",
            tags: ["lens_50", "composition_centered", "symmetry", "framing_full_length", "copy_space", "clean"],
            weight: 0.7
          },
      
          // --- New: rule-of-thirds with negative space for copy ---
          {
            id: "50mm_rule_of_thirds_copyspace",
            label: "50mm rule-of-thirds (copy space)",
            text_en: "50mm rule-of-thirds composition, full-length framing, subject placed left/right with clean negative space for layout, sharp eyes, premium editorial finish",
            tags: ["lens_50", "composition_thirds", "copy_space", "framing_full_length", "editorial"],
            weight: 0.75
          },
      
          // --- New: boots emphasis framing (shoe visibility) ---
          {
            id: "35mm_boots_emphasis_low",
            label: "35mm boots emphasis (low angle)",
            text_en: "35mm slightly low angle with boots emphasized in the lower frame, full-length long shot, camera pulled back to include floor reflections, sharp eyes and crisp boot texture, modern campaign look",
            tags: ["lens_35", "angle_low", "boots_emphasis", "framing_full_length", "distance_pulled_back", "cinematic"],
            weight: 0.65
          },
      
          // --- New: minimal distortion wide (use sparingly) ---
          {
            id: "28mm_wide_editorial_space",
            label: "28mm wide (editorial space)",
            text_en: "28mm wide editorial shot with careful perspective control, full-length framing with strong environmental context, camera pulled back, straight lines, minimal distortion, premium finish",
            tags: ["lens_28", "wide", "environmental", "framing_full_length", "distance_far", "composition_dynamic"],
            weight: 0.35
          },
      
          // --- New: overhead/top-down (tasteful, high-fashion) ---
          {
            id: "top_down_editorial_overhead",
            label: "Top-down editorial (overhead)",
            text_en: "overhead editorial angle (top-down), full body visible on floor plane, clean geometry, controlled shadows, high-fashion magazine mood, sharp texture",
            tags: ["angle_overhead", "editorial", "high_fashion", "framing_full_length", "composition_graphic"],
            weight: 0.25
          },
      
          // --- New: dutch tilt micro (dynamic without chaos) ---
          {
            id: "35mm_subtle_dutch_tilt",
            label: "35mm subtle dutch tilt",
            text_en: "35mm full-length shot with a subtle dutch tilt, dynamic editorial energy, camera pulled back to keep full body with margins, sharp eyes, controlled bokeh",
            tags: ["lens_35", "dutch_tilt_subtle", "dynamic", "framing_full_length", "cinematic"],
            weight: 0.4
          },
      
          // --- Replacement for vague 'editorial_standard' (make it useful) ---
          {
            id: "standard_full_length_catalog_editorial",
            label: "Standard full-length (catalog editorial)",
            text_en: "standard full-length long shot, camera pulled back, straight horizon, neutral eye-level angle, product clarity with editorial polish, sharp fabric and footwear detail",
            tags: ["standard", "framing_full_length", "angle_eye_level", "product_first", "editorial", "clean"],
            weight: 0.85
          }
        ]
      },
      
    color: {
        items: [
          // --- Improved existing (more distinctive anchors + normalized tags) ---
          {
            id: "warm_neutral_filmic",
            label: "Warm-neutral filmic",
            text_en: "warm-neutral filmic color grading, gentle contrast, soft highlight roll-off, natural skin texture, fabric microtexture visible",
            tags: ["temp_warm", "look_filmic", "contrast_medium", "highlights_soft", "skin_natural", "detail_fabric"],
            weight: 1.0
          },
          {
            id: "cool_chrome",
            label: "Cool chrome",
            text_en: "cool chrome modern grading, crisp contrast, clean highlights, subtle metallic sheen, natural skin texture, premium finish",
            tags: ["temp_cool", "look_modern", "contrast_medium_high", "highlights_crisp", "sheen_chrome", "skin_natural"],
            weight: 1.0
          },
          {
            id: "natural_skin_texture",
            label: "Natural skin texture (minimal retouch)",
            text_en: "natural skin texture preserved, minimal retouch, realistic pores, soft micro-contrast, fabric microtexture visible",
            tags: ["skin_natural", "retouch_minimal", "detail_skin", "detail_fabric", "contrast_medium"],
            weight: 0.9
          },
          {
            id: "premium_editorial_retouch",
            label: "Premium editorial retouch",
            text_en: "premium editorial retouch, clean but realistic skin texture, controlled highlights, crisp fabric detail, magazine-ready finish",
            tags: ["retouch_premium", "editorial", "highlights_controlled", "detail_fabric", "skin_realistic"],
            weight: 1.0
          },
      
          // --- New: warm looks (very useful for boudoir / old-money / golden hour) ---
          {
            id: "golden_hour_glow",
            label: "Golden hour glow",
            text_en: "golden-hour warm glow, soft luminous highlights, gentle contrast, sun-kissed skin tone, filmic vibe, fabric detail intact",
            tags: ["temp_warm", "look_filmic", "finish_glow", "contrast_low_medium", "skin_sun_kissed"],
            weight: 0.75
          },
          {
            id: "tungsten_boudoir_warm",
            label: "Tungsten boudoir warm",
            text_en: "warm tungsten lamp look, rich amber tones, soft shadows, intimate boudoir warmth, controlled highlights, premium finish",
            tags: ["temp_warm", "look_tungsten", "contrast_medium", "mood_intimate", "highlights_controlled"],
            weight: 0.7
          },
          {
            id: "soft_pastel_editorial",
            label: "Soft pastel editorial",
            text_en: "soft pastel editorial grading, low contrast, gentle skin tones, airy highlights, clean modern magazine feel",
            tags: ["temp_neutral", "look_pastel", "contrast_low", "highlights_soft", "mood_airy", "editorial"],
            weight: 0.55
          },
      
          // --- New: cool / night looks (for neon/cinematic/chrome) ---
          {
            id: "teal_night_cinematic",
            label: "Teal night cinematic",
            text_en: "cinematic night grading with subtle teal shadows, crisp highlights, controlled contrast, modern editorial finish",
            tags: ["temp_cool", "look_cinematic", "shadows_teal_hint", "contrast_medium_high", "highlights_crisp"],
            weight: 0.65
          },
          {
            id: "cool_noir_desaturated",
            label: "Cool noir (desaturated)",
            text_en: "cool desaturated noir grading, high contrast, deep shadows, controlled highlight bloom, cinematic editorial mood",
            tags: ["temp_cool", "look_noir", "contrast_high", "saturation_low", "shadows_deep", "cinematic"],
            weight: 0.6
          },
          {
            id: "neon_pop_contrast",
            label: "Neon pop contrast",
            text_en: "neon-friendly grading with punchy contrast, clean blacks, controlled neon reflections, sharp editorial finish",
            tags: ["look_neon", "contrast_high", "blacks_clean", "highlights_controlled", "modern"],
            weight: 0.55
          },
      
          // --- New: monochrome / B&W (big style variation) ---
          {
            id: "black_and_white_noir",
            label: "Black & white noir",
            text_en: "black-and-white noir look, strong chiaroscuro contrast, film grain texture, crisp edges, magazine editorial finish",
            tags: ["bw", "look_noir", "contrast_high", "grain_subtle", "editorial", "cinematic"],
            weight: 0.45
          },
          {
            id: "monochrome_minimal_clean",
            label: "Monochrome minimal clean",
            text_en: "near-monochrome minimal grading, clean tonal separation, low saturation, modern couture editorial finish",
            tags: ["monochrome", "saturation_low", "contrast_medium", "look_modern", "minimal", "editorial"],
            weight: 0.5
          },
      
          // --- New: glossy/high-contrast (for patent/latex-look) ---
          {
            id: "high_contrast_glossy",
            label: "High-contrast glossy",
            text_en: "high-contrast glossy finish, crisp specular highlights, clean blacks, controlled sheen on satin/patent, premium editorial polish",
            tags: ["contrast_high", "finish_glossy", "highlights_crisp", "blacks_clean", "retouch_premium"],
            weight: 0.55
          },
      
          // --- New: film grain / analog vibe (retro/pin-up) ---
          {
            id: "vintage_film_grain_warm",
            label: "Vintage film grain warm",
            text_en: "vintage warm film look with subtle grain, soft contrast, gentle vignetting, classic glamour vibe, natural skin texture",
            tags: ["temp_warm", "look_vintage", "grain_subtle", "contrast_low_medium", "vignette_subtle", "classic"],
            weight: 0.5
          }
        ]
      },
      
};

// ============================================================================
// ПРЕСЕТЫ АРТ-ДИРЕКШНА
// ============================================================================

const PRESETS_DATA = [
    // --- Core (обновлённые) ---
    {
      id: "playboy_studio_glam",
      label: "Playboy-inspired Studio Glam",
      description: "High-end studio glamour with clean cyclorama (cover/hero-ready).",
      selections: {
        goal: "glamour_editorial",
        artDirection: "playboy_studio_glam",
        scene: "studio_cyclorama",
        lighting: "softbox_key_rim",
        camera: "50mm_editorial",
        color: "warm_neutral_filmic"
      },
      tags: ["studio", "high-key", "playboy", "glamour", "set_studio", "lighting_high_key_hint", "mood_clean", "layout_copy_space"]
    },
    {
      id: "luxury_boudoir_warm",
      label: "Luxury Hotel Boudoir Warm",
      description: "Warm boudoir atmosphere in luxury hotel setting (campaign feel).",
      selections: {
        goal: "lingerie_ad",
        artDirection: "luxury_boudoir_warm",
        scene: "luxury_hotel_suite",
        lighting: "warm_diffusion_rim",
        camera: "50mm_crisp_detail",
        color: "warm_neutral_filmic"
      },
      tags: ["boudoir", "warm", "luxury", "hotel", "set_boudoir", "set_hotel", "props_lamps", "mood_warm"]
    },
    {
      id: "neon_night_cinematic",
      label: "Neon Night Cinematic",
      description: "Bold cinematic night scene with neon accents (editorial).",
      selections: {
        goal: "glamour_editorial",
        artDirection: "neon_night_cinematic",
        scene: "neon_corridor",
        lighting: "cinematic_lowkey_neon",
        camera: "35mm_low_angle",
        color: "cool_chrome"
      },
      tags: ["neon", "night", "cinematic", "low-key", "time_night", "mood_cinematic", "lighting_low_key_hint", "surface_reflective"]
    },
    {
      id: "backstage_mirror_bulbs",
      label: "Backstage Mirror Bulbs",
      description: "Classic backstage dressing room atmosphere (warm bulbs).",
      selections: {
        goal: "glamour_editorial",
        artDirection: "backstage_mirror_bulbs",
        scene: "dressing_room_mirrors",
        lighting: "warm_practical_bulbs",
        camera: "50mm_crisp_detail",
        color: "premium_editorial_retouch"
      },
      tags: ["backstage", "mirror", "warm", "set_backstage", "props_mirror", "props_bulbs", "lighting_practical", "editorial"]
    },
    {
      id: "industrial_loft_edgy",
      label: "Industrial Loft Edgy (Latex-look)",
      description: "Modern industrial setting with edgy high-fashion vibe.",
      selections: {
        goal: "glamour_editorial",
        artDirection: "industrial_loft_edgy",
        scene: "industrial_loft",
        lighting: "cinematic_lowkey_neon",
        camera: "35mm_low_angle",
        color: "cool_chrome"
      },
      tags: ["industrial", "loft", "edgy", "modern", "set_industrial", "set_loft", "mood_edgy", "grading_cool"]
    },
    {
      id: "vintage_pinup_glam",
      label: "Vintage Pin-Up Glam",
      description: "Retro pin-up vibe with classic glamour (clean studio base).",
      selections: {
        goal: "glamour_editorial",
        artDirection: "vintage_pinup_glam",
        scene: "studio_cyclorama",
        lighting: "softbox_key_rim",
        camera: "50mm_editorial",
        color: "warm_neutral_filmic"
      },
      tags: ["vintage", "pin-up", "retro", "classic", "studio", "glamour", "set_studio", "era_vintage", "vibe_classic"]
    },
  
    // --- Extra presets (если ты добавил новые artDirection/scene из прошлых итераций) ---
    {
      id: "studio_clean_lookbook",
      label: "Studio Clean Lookbook",
      description: "Ultra-clean lookbook/e-comm leaning preset (product clarity).",
      selections: {
        goal: "lookbook",
        artDirection: "minimal_high_fashion_mono",
        scene: "studio_seamless_white_clean",
        lighting: "softbox_key_rim",
        camera: "50mm_crisp_detail",
        color: "premium_editorial_retouch"
      },
      tags: ["studio", "high-key", "clean", "lookbook", "luxury", "set_studio", "ecomm", "product_first", "minimal"]
    },
    {
      id: "daylight_penthouse_airy",
      label: "Daylight Penthouse Airy",
      description: "Airy daylight editorial with window light (soft luxury).",
      selections: {
        goal: "lookbook",
        artDirection: "daylight_penthouse_air",
        scene: "daylight_penthouse",
        lighting: "window_light_fill",
        camera: "50mm_editorial",
        color: "warm_neutral_filmic"
      },
      tags: ["daylight", "penthouse", "modern", "warm", "lighting_window_hint", "mood_airy", "luxury"]
    },
    {
      id: "old_money_suite",
      label: "Old-money Luxury Suite",
      description: "Classic warm luxury interior (timeless premium campaign).",
      selections: {
        goal: "lingerie_ad",
        artDirection: "old_money_luxury_suite",
        scene: "old_money_suite_wood_marble",
        lighting: "warm_diffusion_rim",
        camera: "50mm_crisp_detail",
        color: "warm_neutral_filmic"
      },
      tags: ["luxury", "warm", "classic", "hotel", "old-money", "texture_wood", "texture_marble", "mood_warm"]
    },
    {
      id: "glass_penthouse_night_city",
      label: "Glass Penthouse Night (City Bokeh)",
      description: "Sleek night penthouse with city bokeh (cool cinematic).",
      selections: {
        goal: "glamour_editorial",
        artDirection: "chrome_cold_luxury",
        scene: "modern_glass_penthouse_night",
        lighting: "cinematic_lowkey_neon",
        camera: "35mm_low_angle",
        color: "cool_chrome"
      },
      tags: ["night", "cinematic", "modern", "cool", "surface_reflective", "city_bokeh", "grading_cool"]
    },
    {
      id: "chrome_bathroom_editorial",
      label: "Chrome Marble Bathroom Editorial",
      description: "Chrome + marble luxury set (clean glossy highlights).",
      selections: {
        goal: "lingerie_ad",
        artDirection: "chrome_cold_luxury",
        scene: "chrome_luxury_bathroom",
        lighting: "cinematic_lowkey_neon",
        camera: "50mm_crisp_detail",
        color: "cool_chrome"
      },
      tags: ["luxury", "modern", "chrome", "cool", "surface_chrome", "texture_marble", "surface_glossy"]
    },
    {
      id: "cabaret_backstage_smoky",
      label: "Cabaret Backstage Smoky",
      description: "Moody backstage with subtle haze (cinematic glamour).",
      selections: {
        goal: "glamour_editorial",
        artDirection: "cabaret_backstage_smoky",
        scene: "cabaret_backstage",
        lighting: "warm_practical_bulbs",
        camera: "35mm_low_angle",
        color: "premium_editorial_retouch"
      },
      tags: ["backstage", "warm", "cinematic", "smoky", "bold", "mood_cinematic", "lighting_practical"]
    },
    {
      id: "poolside_golden_hour_glam",
      label: "Poolside Golden Hour Glam",
      description: "Lifestyle-glam golden hour preset (social/editorial friendly).",
      selections: {
        goal: "glamour_editorial",
        artDirection: "poolside_golden_hour",
        scene: "poolside_golden_hour",
        lighting: "window_light_fill",
        camera: "50mm_editorial",
        color: "warm_neutral_filmic"
      },
      tags: ["outdoor", "golden_hour", "warm", "lifestyle", "relaxed", "time_golden_hour"]
    }
  ];  

// ============================================================================
// КЛАССЫ И УТИЛИТЫ
// ============================================================================

// Simple seedable RNG
class SeededRNG {
    constructor(seed) {
        this.seed = seed ?? Math.floor(Math.random() * 1000000);
    }

    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    nextInt(min, max) {
        return Math.floor(this.next() * (max - min)) + min;
    }

    getSeed() {
        return this.seed;
    }
}

// Weighted random selection
function weightedRandom(items, rng) {
    const totalWeight = items.reduce((sum, item) => sum + (item.weight ?? 1.0), 0);
    let random = rng.next() * totalWeight;

    for (const item of items) {
        random -= item.weight ?? 1.0;
        if (random <= 0) {
            return item;
        }
    }

    return items[items.length - 1];
}

// Safety filter
class SafetyFilter {
    static FORBIDDEN_NAMES_PATTERN = /\b(a-la|look like|looks like|similar to|resembling|in the style of)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/gi;
    
    static MINORS_PATTERNS = [
        /\bteen(?:ager|age)?\b/gi,
        /\bschool(?:girl|boy|kid|child)\b/gi,
        /\byoung\s+(?:girl|boy|kid|child|looking)\b/gi,
        /\bunderage\b/gi,
        /\bminor\b/gi,
        /\bvery\s+young\b/gi,
    ];

    static EXPLICIT_PATTERNS = [
        /\b(explicit|nude|naked|genital|sexual\s+act|porn|xxx)\b/gi,
    ];

    static filter(input) {
        const warnings = [];
        let sanitized = input;
        let blocked = false;

        if (this.FORBIDDEN_NAMES_PATTERN.test(sanitized)) {
            warnings.push('Look-alike requests are not allowed. Replaced with neutral archetype.');
            sanitized = sanitized.replace(
                this.FORBIDDEN_NAMES_PATTERN,
                'glamour archetype'
            );
            blocked = true;
        }

        for (const pattern of this.MINORS_PATTERNS) {
            if (pattern.test(sanitized)) {
                warnings.push('Minors references are not allowed and have been removed.');
                sanitized = sanitized.replace(pattern, '');
                blocked = true;
            }
        }

        for (const pattern of this.EXPLICIT_PATTERNS) {
            if (pattern.test(sanitized)) {
                warnings.push('Explicit content is not allowed and have been removed.');
                sanitized = sanitized.replace(pattern, '');
                blocked = true;
            }
        }

        sanitized = sanitized.replace(/\s+/g, ' ').trim();

        return { sanitized, blocked, warnings };
    }

    static validate(input) {
        const result = this.filter(input);
        return {
            valid: !result.blocked,
            warnings: result.warnings,
        };
    }
}

// Prompt Generator
class PromptGenerator {
    constructor(lexicons, presets, seed) {
        this.lexicons = lexicons;
        this.presets = presets;
        this.rng = new SeededRNG(seed);
    }

    generate(state) {
        const resolvedSelections = this.resolveSelections(state);

        const promptParts = [];
        const negativeParts = [];

        // 1. FRAMING
        if (state.enforceFullLength) {
            const framing = this.getModuleText('framing', resolvedSelections.framing, state.engine);
            if (framing) {
                promptParts.push(framing);
            }
        }

        // 2. GOAL
        const goal = this.getModuleText('goal', resolvedSelections.goal, state.engine);
        if (goal) promptParts.push(goal);

        // 3. ART-DIRECTION
        const artDirection = this.getModuleText('artDirection', resolvedSelections.artDirection, state.engine);
        if (artDirection) promptParts.push(artDirection);

        // 4. SUBJECT
        const subject = this.getModuleText('subject', resolvedSelections.subject, state.engine);
        if (subject) {
            promptParts.push(`adult woman (25+), ${subject}`);
        } else {
            promptParts.push('adult woman (25+)');
        }

// 4b. HAIR LOCK (stabilize archetype)
const hairLock = this.getHairLock(resolvedSelections.subject);
if (hairLock.prompt) promptParts.push(hairLock.prompt);
if (hairLock.negative) negativeParts.push(hairLock.negative);

        // 5. BEAUTY
        const beauty = this.getModuleText('beauty', resolvedSelections.beauty, state.engine);
        if (beauty) promptParts.push(beauty);

        // 6. WARDROBE (includes shoes)
        const wardrobe = this.getModuleText('wardrobe', resolvedSelections.wardrobe, state.engine);
        const shoes = this.getModuleText('shoes', resolvedSelections.shoes, state.engine);
        let wardrobeText = '';
        if (wardrobe) wardrobeText = wardrobe;
        if (shoes) {
            wardrobeText = wardrobeText ? `${wardrobeText}, ${shoes}` : shoes;
        }
        if (wardrobeText) {
            promptParts.push(`Wardrobe: ${wardrobeText}`);
        } else if (wardrobe) {
            promptParts.push(`Wardrobe: ${wardrobe}`);
        }

        // 7. SCENE
        const scene = this.getModuleText('scene', resolvedSelections.scene, state.engine);
        if (scene) promptParts.push(`Scene: ${scene}`);

        // 8. POSE
        const pose = this.getModuleText('pose', resolvedSelections.pose, state.engine);
        if (pose) promptParts.push(`Pose: ${pose}`);

        // 9. LIGHTING
        const lighting = this.getModuleText('lighting', resolvedSelections.lighting, state.engine);
        if (lighting) promptParts.push(`Lighting: ${lighting}`);

        // 10. CAMERA
        const camera = this.getModuleText('camera', resolvedSelections.camera, state.engine);
        if (camera) promptParts.push(`Camera: ${camera}`);

        // 11. COLOR
        const color = this.getModuleText('color', resolvedSelections.color, state.engine);
        if (color) promptParts.push(color);

        // Apply boldness
        const boldnessConfig = BOLDNESS_CONFIG.levels.find(l => l.badge === state.boldness);
        const boldnessModifier = boldnessConfig ? boldnessConfig.modifier : BOLDNESS_CONFIG.levels[1].modifier;
        let promptText = this.applyBoldness(promptParts.join(' '), boldnessModifier);

        // Build negative
        negativeParts.push('No explicit nudity, no sexual act, no minors.');
        
        if (state.enforceFullLength) {
            negativeParts.push('No close-up, no portrait crop, no half-body, no cropped head, no cropped feet, no out-of-frame shoes/boots.');
        }
        
        negativeParts.push('No text, no watermark, no logos.');
        negativeParts.push('No extra fingers/limbs, no warped hands, no distorted face, no blur, no low-res, no plastic skin.');

        const negativeText = negativeParts.join(' ');

        // Apply safety filter
        const safetyResult = SafetyFilter.filter(promptText);
        const finalPromptText = safetyResult.sanitized;

        return {
            prompt_text: finalPromptText,
            negative_text: negativeText,
            metadata: {
                engine: state.engine,
                format: state.format,
                preset: state.preset,
                selections: resolvedSelections,
                seed: this.rng.getSeed(),
                timestamp: new Date().toISOString(),
                boldness: state.boldness,
                enforceFullLength: state.enforceFullLength,
            },
            warnings: safetyResult.warnings,
        };
    }

    resolveSelections(state) {
        const resolved = {};

        // Start with preset
        if (state.preset) {
            const preset = this.presets.get(state.preset);
            if (preset) {
                Object.assign(resolved, preset.selections);
            }
        }

        // Apply manual selections
        Object.assign(resolved, state.manualSelections);

        // Fill in random selections
        const modulesToResolve = [
            'framing', 'goal', 'artDirection', 'subject', 'beauty',
            'wardrobe', 'shoes', 'scene', 'pose', 'lighting', 'camera', 'color'
        ];

        for (const module of modulesToResolve) {
            if (!resolved[module]) {
                if (state.randomMode === 'full' || state.randomMode === 'guided') {
                    const item = this.randomSelectModule(module, { presetId: state.preset, boldness: state.boldness, resolved });
                    if (item) {
                        resolved[module] = item.id;
                    }
                }
            }
        }

        // Always ensure framing if enforceFullLength
        if (state.enforceFullLength && !resolved.framing) {
            const framingItems = this.lexicons.get('framing');
            if (framingItems && framingItems.length > 0) {
                resolved.framing = framingItems[0].id;
            }
        }

        return resolved;
    }

    getModuleText(module, itemId, engine) {
        if (!itemId) return '';

        const items = this.lexicons.get(module);
        if (!items) return '';

        const item = items.find(i => i.id === itemId);
        if (!item) return '';

        if (item.engine_overrides && item.engine_overrides[engine]) {
            return item.engine_overrides[engine];
        }

        return item.text_en;
    }

getModuleItem(module, itemId) {
    if (!itemId) return null;

    const items = this.lexicons.get(module);
    if (!items) return null;

    return items.find(i => i.id === itemId) || null;
}

getHairLock(subjectId) {
    const subjectItem = this.getModuleItem('subject', subjectId);
    if (!subjectItem || !subjectItem.tags) {
        return { prompt: '', negative: '' };
    }

    const tags = subjectItem.tags;
    const lock = { prompt: '', negative: '' };

    // NOTE: avoid the word "nude" here (it is removed by SafetyFilter).
    if (tags.includes('hair_blonde')) {
        lock.prompt = 'Hair color: platinum blonde hair (keep hair color consistent).';
        lock.negative = 'No brunette hair, no black hair, no red hair.';
    } else if (tags.includes('hair_dirty_blonde')) {
        lock.prompt = 'Hair color: dirty blonde hair (keep hair color consistent).';
        lock.negative = 'No brunette hair, no black hair, no red hair.';
    } else if (tags.includes('hair_brunette')) {
        lock.prompt = 'Hair color: deep brunette hair (keep hair color consistent).';
        lock.negative = 'No blonde hair, no red hair.';
    } else if (tags.includes('hair_red')) {
        lock.prompt = 'Hair color: auburn red hair (keep hair color consistent).';
        lock.negative = 'No blonde hair, no brunette hair, no black hair.';
    }

    return lock;
}

randomSelectModule(module, context) {
    const items = this.lexicons.get(module);
    if (!items || items.length === 0) return null;

    const presetId = (typeof context === 'object' && context) ? context.presetId : context;
    const boldness = (typeof context === 'object' && context) ? context.boldness : undefined;

    let candidates = items;

    // Preset tag filtering (soft)
    if (presetId) {
        const preset = this.presets.get(presetId);
        if (preset && preset.tags) {
            candidates = items.filter(item => {
                if (!item.tags || item.tags.length === 0) return true;
                return item.tags.some(tag => preset.tags.includes(tag));
            });
        }
    }

    if (candidates.length === 0) {
        candidates = items;
    }

    // Boldness-aware weighting: push "hot" wardrobe/shoes when user selects B2/B3
    const boldLevel = (typeof boldness === 'string' && /^B\d$/.test(boldness))
        ? parseInt(boldness.slice(1), 10)
        : 1;

    const weightedCandidates = candidates.map(item => {
        let w = item.weight ?? 1.0;
        const tags = item.tags || [];

        if (module === 'wardrobe' || module === 'shoes') {
            const isHot = tags.includes('hot') || tags.includes('sexy') || tags.includes('bold') ||
                tags.includes('strappy') || tags.includes('garter') || tags.includes('latex-look') ||
                tags.includes('thigh-high') || tags.includes('platform') || tags.includes('stiletto');

            const isClassic = tags.includes('classic');

            if (boldLevel >= 2) {
                if (isHot) w *= 1.7;
                if (tags.includes('statement')) w *= 1.25;
                if (isClassic) w *= 0.85;
            } else if (boldLevel === 0) {
                if (isClassic) w *= 1.6;
                if (isHot) w *= 0.8;
            } else {
                if (isHot) w *= 1.15;
            }
        }

        return { ...item, weight: w };
    });

    return weightedRandom(weightedCandidates, this.rng);
}


    applyBoldness(text, modifier) {
        const parts = text.split('.');
        
        let inserted = false;
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].toLowerCase().includes('glamour') || parts[i].toLowerCase().includes('boudoir')) {
                parts[i] = parts[i] + ', ' + modifier;
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            return `${modifier}, ${text}`;
        }

        return parts.join('.');
    }
}

// Adapters
class GrokAdapter {
    adapt(result) {
        let promptText = result.prompt_text;
        let negativeText = result.negative_text;

        if (result.metadata.enforceFullLength) {
            const framingPrefix = 'FULL-LENGTH LONG SHOT, head-to-toe full body in frame, feet visible, shoes/boots visible, include floor, camera pulled back, wide framing, leave margin above head and below feet.';
            
            if (!promptText.startsWith('FULL-LENGTH')) {
                promptText = `${framingPrefix} ${promptText}`;
            }

            const cropGuards = 'No close-up, no portrait crop, no half-body, no cropped head, no cropped feet, no out-of-frame shoes/boots.';
            if (!negativeText.includes('no close-up')) {
                negativeText = `${cropGuards} ${negativeText}`;
            }
        }

        return {
            ...result,
            prompt_text: promptText,
            negative_text: negativeText,
        };
    }
}

class GenericAdapter {
    adapt(result) {
        return result;
    }
}

function getAdapter(engine) {
    switch (engine) {
        case 'grok':
            return new GrokAdapter();
        default:
            return new GenericAdapter();
    }
}

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ ДАННЫХ
// ============================================================================

let lexicons = new Map();
let presets = new Map();

function loadData() {
    try {
        // Load lexicons from embedded data
        for (const [module, data] of Object.entries(LEXICONS_DATA)) {
            lexicons.set(module, data.items);
        }

        // Load presets from embedded data
        for (const preset of PRESETS_DATA) {
            presets.set(preset.id, preset);
        }

        // Populate UI
        populateUI();
        setupEventListeners();

    } catch (error) {
        console.error('Error loading data:', error);
        alert('Ошибка инициализации: ' + error.message);
    }
}

// ============================================================================
// UI ФУНКЦИИ
// ============================================================================

function populateUI() {
    populateEngines();
    populateFormats();
    populatePresets();
    populateRandomModes();
    populateModuleSelectors();
    setupDefaults();
}

function populateEngines() {
    const select = document.getElementById('engine');
    select.innerHTML = ''; // Очистить существующие опции
    UI_CONFIG.engines.forEach(engine => {
        const option = document.createElement('option');
        option.value = engine.value;
        option.textContent = engine.label;
        select.appendChild(option);
    });
}

function populateFormats() {
    const select = document.getElementById('format');
    select.innerHTML = ''; // Очистить существующие опции
    UI_CONFIG.formats.forEach(format => {
        const option = document.createElement('option');
        option.value = format.value;
        option.textContent = format.label;
        select.appendChild(option);
    });
}

function populatePresets() {
    const select = document.getElementById('preset');
    select.innerHTML = ''; // Очистить существующие опции
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Без пресета';
    select.appendChild(defaultOption);
    
    for (const preset of presets.values()) {
        const option = document.createElement('option');
        option.value = preset.id;
        option.textContent = preset.label;
        select.appendChild(option);
    }
}

function populateRandomModes() {
    const select = document.getElementById('randomMode');
    select.innerHTML = ''; // Очистить существующие опции
    UI_CONFIG.randomModes.forEach(mode => {
        const option = document.createElement('option');
        option.value = mode.value;
        option.textContent = mode.label;
        select.appendChild(option);
    });
}

function populateModuleSelectors() {
    const container = document.getElementById('moduleSelectors');
    
    UI_CONFIG.modules.forEach(module => {
        const div = document.createElement('div');
        div.className = 'form-group';
        
        const label = document.createElement('label');
        label.innerHTML = `<span class="label-icon">${module.icon}</span> ${module.label}`;
        
        const select = document.createElement('select');
        select.id = `module_${module.name}`;
        select.dataset.module = module.name;
        select.className = 'select-input';
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Автоматически';
        select.appendChild(defaultOption);

        const items = lexicons.get(module.name) || [];
        for (const item of items) {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.label;
            select.appendChild(option);
        }

        div.appendChild(label);
        div.appendChild(select);
        container.appendChild(div);
    });
}

function setupDefaults() {
    const defaults = UI_CONFIG.defaults;
    
    document.getElementById('engine').value = defaults.engine;
    document.getElementById('format').value = defaults.format;
    document.getElementById('preset').value = defaults.preset;
    document.getElementById('enforceFullLength').checked = defaults.enforceFullLength;
    document.getElementById('boldness').value = defaults.boldness;
    document.getElementById('randomMode').value = defaults.randomMode;
    
    // Update boldness display
    const boldnessLevel = BOLDNESS_CONFIG.levels[defaults.boldness];
    document.getElementById('boldnessDisplay').textContent = boldnessLevel.badge;
    document.getElementById('boldnessDescription').textContent = boldnessLevel.description;
}

function setupEventListeners() {
    // Engine change handler
    const engineSelect = document.getElementById('engine');
    const enforceCheckbox = document.getElementById('enforceFullLength');
    
    engineSelect.addEventListener('change', (e) => {
        if (UI_CONFIG.enginesWithForcedFullLength.includes(e.target.value)) {
            enforceCheckbox.checked = true;
            enforceCheckbox.disabled = true;
        } else {
            enforceCheckbox.disabled = false;
        }
    });
    
    // Set initial state
    if (UI_CONFIG.enginesWithForcedFullLength.includes(engineSelect.value)) {
        enforceCheckbox.checked = true;
        enforceCheckbox.disabled = true;
    }

    // Boldness slider
    const boldnessSlider = document.getElementById('boldness');
    const boldnessDisplay = document.getElementById('boldnessDisplay');
    const boldnessDescription = document.getElementById('boldnessDescription');
    
    boldnessSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        const level = BOLDNESS_CONFIG.levels[value];
        boldnessDisplay.textContent = level.badge;
        boldnessDescription.textContent = level.description;
    });
    
    // Set initial description
    const initialLevel = BOLDNESS_CONFIG.levels[UI_CONFIG.defaults.boldness];
    boldnessDescription.textContent = initialLevel.description;

    // Generate button
    document.getElementById('generateBtn').addEventListener('click', handleGenerate);
    document.getElementById('randomizeAllBtn').addEventListener('click', () => handleRandomize('all'));
    document.getElementById('randomizePresetBtn').addEventListener('click', () => handleRandomize('preset'));

    // Copy buttons
    document.getElementById('copyCombinedBtn').addEventListener('click', (e) => {
        const prompt = document.getElementById('promptOutput').value;
        const negative = document.getElementById('negativeOutput').value;
        const combined = prompt + '\n\n---\n\nNegative:\n' + negative;
        copyToClipboard(combined, e);
    });
    document.getElementById('copyPromptBtn').addEventListener('click', (e) => {
        copyToClipboard(document.getElementById('promptOutput').value, e);
    });
    document.getElementById('copyNegativeBtn').addEventListener('click', (e) => {
        copyToClipboard(document.getElementById('negativeOutput').value, e);
    });

    // Export metadata
    document.getElementById('exportMetadataBtn').addEventListener('click', handleExportMetadata);
    
    // Modules collapse toggle
    const modulesToggle = document.getElementById('modulesToggle');
    const modulesContent = document.getElementById('modulesContent');
    modulesToggle.addEventListener('click', () => {
        modulesContent.classList.toggle('collapsed');
        modulesToggle.textContent = modulesContent.classList.contains('collapsed') ? 'Развернуть' : 'Свернуть';
    });
}

function handleGenerate() {
    const engine = document.getElementById('engine').value;
    const format = document.getElementById('format').value;
    const preset = document.getElementById('preset').value;
    const enforceFullLength = document.getElementById('enforceFullLength').checked || 
                              UI_CONFIG.enginesWithForcedFullLength.includes(engine);
    const boldnessValue = parseInt(document.getElementById('boldness').value);
    const boldness = BOLDNESS_CONFIG.levels[boldnessValue].badge;
    const randomMode = document.getElementById('randomMode').value;

    // Get manual selections
    const manualSelections = {};
    const moduleSelects = document.querySelectorAll('[data-module]');
    for (const select of moduleSelects) {
        const module = select.dataset.module;
        const value = select.value;
        if (value) {
            manualSelections[module] = value;
        }
    }

    const state = {
        engine,
        format,
        preset: preset || undefined,
        enforceFullLength,
        boldness,
        manualSelections,
        randomMode,
    };

    const generator = new PromptGenerator(lexicons, presets);
    let result = generator.generate(state);

    // Apply adapter
    const adapter = getAdapter(engine);
    result = adapter.adapt(result);

    // Display warnings
    const warningsDiv = document.getElementById('warnings');
    if (result.warnings && result.warnings.length > 0) {
        warningsDiv.style.display = 'block';
        warningsDiv.className = 'warning-card';
        warningsDiv.innerHTML = '<strong>⚠️ Предупреждения:</strong><ul>' +
            result.warnings.map(w => `<li>${w}</li>`).join('') + '</ul>';
    } else {
        warningsDiv.style.display = 'none';
    }

    // Update selectors to reflect actual selections used
    updateSelectorsWithSelections(result.metadata.selections);

    // Display result
    const promptText = result.prompt_text;
    const negativeText = result.negative_text;
    const combinedText = promptText + '\n\n---\n\nNegative:\n' + negativeText;
    
    document.getElementById('promptOutput').value = promptText;
    document.getElementById('negativeOutput').value = negativeText;
    document.getElementById('combinedOutput').value = combinedText;
    document.getElementById('result').style.display = 'block';
    
    // Scroll to result
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Store result for export
    window.lastResult = result;
}

function handleRandomize(mode) {
    if (mode === 'all') {
        document.getElementById('randomMode').value = 'full';
        // Clear all manual selections
        const moduleSelects = document.querySelectorAll('[data-module]');
        for (const select of moduleSelects) {
            select.value = '';
        }
    } else if (mode === 'preset') {
        document.getElementById('randomMode').value = 'full';
        // Clear manual selections but keep preset
        const moduleSelects = document.querySelectorAll('[data-module]');
        for (const select of moduleSelects) {
            select.value = '';
        }
    }
    handleGenerate();
}

function copyToClipboard(text, event) {
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary success message
        const button = event.target.closest('button');
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '<span>✅</span> Скопировано!';
            button.style.background = '#10b981';
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Ошибка копирования');
    });
}

function updateSelectorsWithSelections(selections) {
    // Обновляем селекторы модулей на основе реально использованных значений
    for (const [module, itemId] of Object.entries(selections)) {
        if (itemId) {
            const select = document.getElementById(`module_${module}`);
            if (select) {
                // Проверяем, что такой опции существует
                const optionExists = Array.from(select.options).some(opt => opt.value === itemId);
                if (optionExists) {
                    // Временно добавляем класс для визуальной индикации изменения
                    select.classList.add('updated');
                    select.value = itemId;
                    
                    // Убираем класс через анимацию
                    setTimeout(() => {
                        select.classList.remove('updated');
                    }, 2000);
                }
            }
        }
    }
}

function handleExportMetadata() {
    if (!window.lastResult) return;
    
    const json = JSON.stringify(window.lastResult.metadata, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-metadata-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    loadData();
});


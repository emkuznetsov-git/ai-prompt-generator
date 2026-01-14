// ============================================================================
// GLAMOUR PROMPT GENERATOR v4.0
// ============================================================================

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
    defaultEngine: 'nano_banana',
    defaultFormat: 'story_9x16',
    defaultBoldness: 1,
    enginesWithForcedFullLength: ['grok']
};

const BOLDNESS_LEVELS = [
    { value: 0, badge: 'B0', label: 'Elegant', modifier: 'high-end lingerie campaign, elegant refined pose, strategic coverage, classy and polished' },
    { value: 1, badge: 'B1', label: 'Teasing', modifier: 'provocative glamour editorial, teasing but classy, flirty eye contact, confident allure' },
    { value: 2, badge: 'B2', label: 'Bold', modifier: 'high-heat glamour editorial, daring pose, lingerie-forward styling, confident seductive energy, still non-explicit' },
    { value: 3, badge: 'B3', label: 'On Edge', modifier: 'very hot edgy glamour editorial, intense eye contact, cinematic tension, bold body language, lingerie stays on, still non-explicit, no sexual act' },
    { value: 4, badge: 'B4', label: 'Extra Hot', modifier: 'maximum-heat glamour editorial, dangerously teasing but tasteful, extreme confidence, high tension, lingerie stays on, strategic coverage, still non-explicit, no sexual act' }
];

// ============================================================================
// BOLDNESS-WEIGHTED RANDOMIZATION (P0 "hotter" randomize)
// ============================================================================

const TAG_WEIGHT_MULTIPLIERS = {
    hot:   [0.15, 0.6, 1.3, 2.0, 3.0],
    bold:  [0.4,  0.9, 1.2, 1.6, 2.0],
    sexy:  [0.6,  1.0, 1.2, 1.4, 1.6],
    edgy:  [0.5,  0.9, 1.2, 1.5, 1.8],
    noir:  [0.6,  0.9, 1.1, 1.4, 1.6]
};

function clampBoldnessIndex(value) {
    const n = Number.isFinite(value) ? value : parseInt(value);
    const b = Number.isFinite(n) ? n : 1;
    return Math.max(0, Math.min(4, b));
}

function getHeatLevel(item) {
    const tags = Array.isArray(item?.tags) ? item.tags : [];
    const isHot = tags.includes('hot');
    const isBold = tags.includes('bold') || tags.includes('edgy');
    const isSexy = tags.includes('sexy');

    // 0 = normal, 1 = warm/sexy, 2 = hot, 3 = super hot
    if (isHot && isBold) return 3;
    if (isHot) return 2;
    if (isSexy) return 1;
    return 0;
}

// ============================================================================
// STYLE HINTS (Archetype ↔ Hair ↔ Makeup) — gentle, non-blocking suggestions
// ============================================================================

const VIBE_LABELS = {
    classic_glam: 'classic glamour',
    editorial_edge: 'editorial edge',
    modern_minimal: 'clean minimal',
    fresh_sunkissed: 'fresh sun-kissed',
    noir: 'noir',
    playful: 'playful tease',
    luxury: 'luxury',
    bold_statement: 'bold statement',
    vintage_pinup: 'vintage pin-up',
    after_hours: 'after-hours'
};

const ARCHETYPE_TAG_TO_VIBE = {
    // core archetype tags
    bombshell: 'classic_glam',
    playmate: 'playful',
    ice_queen: 'modern_minimal',
    supermodel: 'editorial_edge',
    california: 'fresh_sunkissed',
    sporty: 'fresh_sunkissed',
    fresh: 'fresh_sunkissed',
    vixen: 'bold_statement',
    tease: 'playful',
    femme_fatale: 'noir',
    siren: 'noir',
    power: 'editorial_edge',
    edgy: 'editorial_edge',
    italian: 'classic_glam',
    muse: 'luxury',
    pinup: 'vintage_pinup',
    vintage: 'vintage_pinup',
    raven: 'noir',
    noir: 'noir',
    latina: 'bold_statement',
    wild: 'bold_statement',
    intense: 'noir',
    mysterious: 'noir',
    passionate: 'bold_statement',

    // common adjectives used in tags
    classic: 'classic_glam',
    sexy: 'classic_glam',
    hot: 'after_hours',
    sophisticated: 'luxury',
    cool: 'modern_minimal',
    elegant: 'luxury',
    luxury: 'luxury',
    editorial: 'editorial_edge',
    bold: 'bold_statement'
};

const HAIR_CATEGORY_TO_VIBES = {
    'Waves & Glam': ['classic_glam'],
    'Straight & Sleek': ['modern_minimal', 'editorial_edge'],
    'Wet / Editorial': ['editorial_edge', 'bold_statement'],
    'Ponytails': ['editorial_edge'],
    'Updos': ['modern_minimal', 'editorial_edge'],
    'Curls': ['classic_glam', 'bold_statement'],
    'Short & Bob': ['modern_minimal', 'editorial_edge'],
    'Auto': []
};

const MAKEUP_CATEGORY_TO_VIBES = {
    'Natural & Fresh': ['fresh_sunkissed', 'modern_minimal'],
    'Classic Glam': ['classic_glam', 'bold_statement'],
    'Night & Smoky': ['after_hours', 'bold_statement'],
    'Editorial': ['editorial_edge', 'modern_minimal'],
    'Chic / Vintage': ['classic_glam', 'modern_minimal', 'vintage_pinup'],
    'Noir / Statement': ['noir', 'bold_statement'],
    'Auto': []
};

function uniqueStrings(items) {
    return [...new Set((items || []).filter(Boolean))];
}

function intersectCount(a, b) {
    const setB = new Set(b || []);
    let count = 0;
    for (const x of a || []) {
        if (setB.has(x)) count += 1;
    }
    return count;
}

function getArchetypeVibes(archetype) {
    const vibes = [];
    if (!archetype || !Array.isArray(archetype.tags)) return vibes;
    for (const tag of archetype.tags) {
        const vibe = ARCHETYPE_TAG_TO_VIBE[tag];
        if (vibe) vibes.push(vibe);
    }
    // Always ensure at least one vibe for helpful messaging
    if (vibes.length === 0) vibes.push('classic_glam');
    return uniqueStrings(vibes);
}

function getHairVibes(hair) {
    if (!hair) return [];
    const base = HAIR_CATEGORY_TO_VIBES[hair.category] || [];
    const vibes = [...base];
    if (hair.tags?.includes('hot')) vibes.push('after_hours');
    if (hair.tags?.includes('bold')) vibes.push('bold_statement');
    return uniqueStrings(vibes);
}

function getMakeupVibes(makeup) {
    if (!makeup) return [];
    const base = MAKEUP_CATEGORY_TO_VIBES[makeup.category] || [];
    const vibes = [...base];
    if (makeup.tags?.includes('hot')) vibes.push('after_hours');
    if (makeup.tags?.includes('bold')) vibes.push('bold_statement');
    if (makeup.tags?.includes('noir')) vibes.push('noir');
    return uniqueStrings(vibes);
}

function formatVibes(vibes) {
    const labels = (vibes || []).map(v => VIBE_LABELS[v] || v);
    return labels.slice(0, 2).join(' + ');
}

// ============================================================================
// LEXICONS DATA — Maximum variety and sensuality
// ============================================================================

const LEXICONS = {
    // ─────────────────────────────────────────────────────────────────────────
    // ARCHETYPES
    // ─────────────────────────────────────────────────────────────────────────
    archetypes: [
        // ══════ PLATINUM BLONDES ══════
        { id: 'blonde_bombshell', label: 'Bombshell', text_en: 'slim hourglass silhouette, confident direct gaze, radiant skin, classic sensual glamour', category: 'Platinum Blondes', hairColor: 'blonde', hairShade: 'platinum blonde', defaultHair: ['long_glamorous_waves'], defaultMakeup: ['smoky_eyes'], tags: ['bombshell', 'classic', 'sexy'] },
        { id: 'blonde_playmate', label: 'Playmate (hot)', text_en: 'slim hourglass silhouette, playful seductive smile, flirtatious energy, sun-kissed glow', category: 'Platinum Blondes', hairColor: 'blonde', hairShade: 'platinum blonde', defaultHair: ['soft_blowout'], defaultMakeup: ['bronzed_sunkissed'], tags: ['playmate', 'hot', 'sexy'] },
        { id: 'blonde_ice_queen', label: 'Ice Queen', text_en: 'slim tall silhouette, controlled confident gaze, porcelain finish, high-fashion restraint', category: 'Platinum Blondes', hairColor: 'blonde', hairShade: 'platinum blonde', defaultHair: ['sleek_straight'], defaultMakeup: ['nude_sculpted'], tags: ['ice_queen', 'sophisticated', 'cool'] },
        { id: 'platinum_supermodel', label: 'Platinum Supermodel (hot)', text_en: 'slim toned fashion model physique, runway-long legs, sharp cheekbones, intense camera-ready gaze, premium editorial attitude', category: 'Platinum Blondes', hairColor: 'blonde', hairShade: 'platinum blonde', defaultHair: ['high_ponytail'], defaultMakeup: ['glossy_wet_look'], tags: ['supermodel', 'hot', 'editorial'] },

        // ══════ GOLDEN / HONEY BLONDES ══════
        { id: 'blonde_california_girl', label: 'California Beauty', text_en: 'tanned athletic silhouette, bright flirty smile, fresh confident energy, sun-kissed glow', category: 'Golden Blondes', hairColor: 'blonde', hairShade: 'golden blonde', defaultHair: ['beachy_waves'], defaultMakeup: ['bronzed_sunkissed'], tags: ['california', 'sporty', 'fresh'] },
        { id: 'honey_blonde_vixen', label: 'Honey Blonde Vixen (hot)', text_en: 'curvy toned hourglass silhouette, slim waist, teasing knowing gaze, magnetic allure', category: 'Golden Blondes', hairColor: 'blonde', hairShade: 'honey blonde', defaultHair: ['side_swept_waves'], defaultMakeup: ['siren_wing_red_lip'], tags: ['vixen', 'hot', 'sexy'] },
        
        // ══════ DIRTY BLONDES ══════
        { id: 'dirty_blonde_sleek', label: 'Sleek', text_en: 'slim silhouette, teasing knowing gaze, understated confidence, clean modern beauty', category: 'Dirty Blondes', hairColor: 'dirty_blonde', hairShade: 'dirty blonde', defaultHair: ['straight_middle_part'], defaultMakeup: ['soft_natural'], tags: ['sleek', 'natural', 'teasing'] },
        { id: 'dirty_blonde_tease', label: 'Tease (hot)', text_en: 'slim silhouette, playful tease, flirty eye contact, effortless sensual vibe', category: 'Dirty Blondes', hairColor: 'dirty_blonde', hairShade: 'dirty blonde', defaultHair: ['messy_bedhair'], defaultMakeup: ['pink_gloss_pop'], tags: ['tease', 'hot', 'playful'] },

        // ══════ BRUNETTES ══════
        { id: 'brunette_femme_fatale', label: 'Femme Fatale', text_en: 'slim athletic silhouette, intense controlled gaze, mysterious aura, cinematic edge', category: 'Brunettes', hairColor: 'brunette', hairShade: 'deep brunette', defaultHair: ['deep_side_part_waves'], defaultMakeup: ['cat_eye_dramatic'], tags: ['femme_fatale', 'intense', 'sexy'] },
        { id: 'brunette_midnight_siren', label: 'Midnight Siren (hot)', text_en: 'slim athletic silhouette, sultry direct gaze, subtle smirk, smoldering intensity', category: 'Brunettes', hairColor: 'brunette', hairShade: 'deep brunette', defaultHair: ['long_glamorous_waves'], defaultMakeup: ['night_glam'], tags: ['siren', 'hot', 'sexy'] },
        { id: 'brunette_power', label: 'Power Brunette', text_en: 'slim athletic silhouette, dominant runway gaze, sharp cheekbones, assertive presence', category: 'Brunettes', hairColor: 'brunette', hairShade: 'deep brunette', defaultHair: ['slicked_back_wet'], defaultMakeup: ['nude_sculpted'], tags: ['power', 'edgy', 'confident'] },
        { id: 'brunette_italian_beauty', label: 'Italian Beauty', text_en: 'slim toned silhouette, olive skin, warm expressive eyes, sensual full lips, old-world glamour warmth', category: 'Brunettes', hairColor: 'brunette', hairShade: 'rich dark brunette', defaultHair: ['soft_blowout'], defaultMakeup: ['bronzed_sunkissed'], tags: ['italian', 'warm', 'sensual'] },
        { id: 'brunette_velvet_muse', label: 'Velvet Muse (hot)', text_en: 'slim waist with elegant toned curves, luminous skin finish, slow confident gaze, luxury editorial poise', category: 'Brunettes', hairColor: 'brunette', hairShade: 'espresso brunette', defaultHair: ['side_swept_waves'], defaultMakeup: ['smoky_eyes'], tags: ['muse', 'hot', 'luxury'] },
        
        // ══════ REDHEADS ══════
        { id: 'redhead_sophisticated', label: 'Sophisticated', text_en: 'slim silhouette, elegant confident gaze, creamy pale skin, refined classic allure', category: 'Redheads', hairColor: 'redhead', hairShade: 'rich auburn', defaultHair: ['soft_blowout'], defaultMakeup: ['red_lip_classic'], tags: ['sophisticated', 'elegant', 'classic'] },
        { id: 'redhead_pinup', label: 'Pin-Up (sexy)', text_en: 'slim hourglass silhouette, playful teasing gaze, classic pin-up charm, polished glamour, cheeky confidence', category: 'Redheads', hairColor: 'redhead', hairShade: 'rich auburn', defaultHair: ['vintage_waves'], defaultMakeup: ['red_lip_classic'], tags: ['pinup', 'vintage', 'sexy'] },
        { id: 'redhead_fiery', label: 'Fiery (hot)', text_en: 'slim athletic silhouette, intense passionate gaze, freckled skin, bold confident presence, electric energy', category: 'Redheads', hairColor: 'redhead', hairShade: 'vibrant copper red', defaultHair: ['voluminous_curls'], defaultMakeup: ['metallic_smoky'], tags: ['fiery', 'hot', 'wild'] },
        
        // ══════ BLACK HAIR ══════
        { id: 'raven_goddess', label: 'Raven Goddess', text_en: 'slim elegant silhouette, mysterious dark gaze, porcelain skin, timeless high-glamour', category: 'Black Hair', hairColor: 'black', hairShade: 'jet black', defaultHair: ['sleek_straight'], defaultMakeup: ['cat_eye_dramatic'], tags: ['raven', 'mysterious', 'elegant'] },
        { id: 'asian_beauty', label: 'Asian Beauty', text_en: 'slim graceful silhouette, soft knowing gaze, flawless skin finish, refined elegance', category: 'Black Hair', hairColor: 'black', hairShade: 'jet black', defaultHair: ['straight_middle_part'], defaultMakeup: ['soft_natural'], tags: ['asian', 'elegant', 'graceful'] },
        { id: 'latina_spitfire', label: 'Latina Spitfire (hot)', text_en: 'curvy athletic silhouette, toned hourglass shape, fiery passionate gaze, golden tan skin, confident heat', category: 'Black Hair', hairColor: 'black', hairShade: 'espresso black', defaultHair: ['voluminous_curls'], defaultMakeup: ['night_glam'], tags: ['latina', 'hot', 'passionate'] },
        { id: 'raven_noir_siren', label: 'Noir Siren (hot)', text_en: 'slim silhouette, high-contrast allure, slow intense eye contact, cinematic tension, sleek editorial danger', category: 'Black Hair', hairColor: 'black', hairShade: 'jet black', defaultHair: ['wet_waves'], defaultMakeup: ['vamp_lip_noir'], tags: ['noir', 'hot', 'cinematic'] }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // HAIR STYLES
    // ─────────────────────────────────────────────────────────────────────────
    hair: [
        { id: 'auto', label: 'Auto (recommended by archetype)', text_en: '', category: 'Auto', tags: [] },

        // ══════ WAVES & GLAM ══════
        { id: 'long_glamorous_waves', label: 'Long Glamorous Waves', text_en: 'long glamorous waves, voluminous body, glossy shine', category: 'Waves & Glam', tags: ['waves', 'long', 'glamour'] },
        { id: 'side_swept_waves', label: 'Side-swept Glam Waves', text_en: 'side-swept glam waves, deep side part, glossy volume', category: 'Waves & Glam', tags: ['waves', 'glamour', 'classic'] },
        { id: 'deep_side_part_waves', label: 'Deep Side Part Waves', text_en: 'deep side part waves, soft sculpted volume, camera-ready shine', category: 'Waves & Glam', tags: ['waves', 'glamour', 'editorial'] },
        { id: 'soft_blowout', label: 'Soft Blowout', text_en: 'soft blowout waves, bouncy volume, natural movement', category: 'Waves & Glam', tags: ['blowout', 'soft', 'natural'] },
        { id: 'curtain_bangs_blowout', label: 'Blowout + Curtain Bangs', text_en: 'blowout with curtain bangs, face-framing softness, airy volume', category: 'Waves & Glam', tags: ['blowout', 'bangs', 'soft'] },
        { id: 'beachy_waves', label: 'Beachy Waves', text_en: 'beachy tousled waves, sun-kissed texture, effortless movement', category: 'Waves & Glam', tags: ['beach', 'waves', 'casual'] },
        { id: 'messy_bedhair', label: 'Messy Bed Hair', text_en: 'tousled bed-hair texture, messy waves, effortless sensuality', category: 'Waves & Glam', tags: ['messy', 'bedhead', 'sexy'] },

        // ══════ STRAIGHT & SLEEK ══════
        { id: 'sleek_straight', label: 'Sleek Straight', text_en: 'sleek glossy straight hair, razor-sharp edges, mirror shine', category: 'Straight & Sleek', tags: ['straight', 'sleek', 'modern'] },
        { id: 'straight_middle_part', label: 'Straight + Middle Part', text_en: 'straight hair with a clean middle part, smooth glassy finish', category: 'Straight & Sleek', tags: ['straight', 'minimal', 'editorial'] },

        // ══════ WET / EDITORIAL ══════
        { id: 'slicked_back_wet', label: 'Slicked-back Wet Look', text_en: 'slicked-back wet-look hair, high-fashion edge, sculpted finish', category: 'Wet / Editorial', tags: ['wet', 'slicked', 'edgy'] },
        { id: 'wet_waves', label: 'Wet-look Waves (hot)', text_en: 'wet-look waves, glossy texture, runway editorial edge', category: 'Wet / Editorial', tags: ['wet', 'waves', 'hot'] },

        // ══════ PONYTAILS ══════
        { id: 'high_ponytail', label: 'High Ponytail', text_en: 'high sleek ponytail, face-framing tendrils, elongated neck', category: 'Ponytails', tags: ['ponytail', 'sleek', 'sporty'] },
        { id: 'low_sleek_ponytail', label: 'Low Sleek Ponytail', text_en: 'low sleek ponytail, polished finish, minimalist elegance', category: 'Ponytails', tags: ['ponytail', 'sleek', 'elegant'] },
        { id: 'braided_ponytail', label: 'Braided Ponytail', text_en: 'braided ponytail, tight clean weave, edgy fashion finish', category: 'Ponytails', tags: ['braid', 'edgy', 'editorial'] },

        // ══════ UPDOS ══════
        { id: 'sleek_high_bun', label: 'Sleek High Bun', text_en: 'sleek high bun, snatched silhouette, exposed neck and shoulders', category: 'Updos', tags: ['bun', 'sleek', 'editorial'] },
        { id: 'low_bun_sleek', label: 'Low Sleek Bun', text_en: 'low sleek bun, polished finish, sophisticated minimalism', category: 'Updos', tags: ['bun', 'sleek', 'sophisticated'] },
        { id: 'braided_updo', label: 'Braided Updo', text_en: 'elegant braided updo, face-framing wisps, exposed neck and shoulders', category: 'Updos', tags: ['updo', 'braided', 'elegant'] },
        { id: 'messy_topknot', label: 'Messy Topknot (hot)', text_en: 'messy topknot, loose tendrils, effortless after-hours glamour', category: 'Updos', tags: ['updo', 'messy', 'hot'] },

        // ══════ CURLS ══════
        { id: 'voluminous_curls', label: 'Voluminous Curls', text_en: 'voluminous bouncy curls, big body, dramatic movement', category: 'Curls', tags: ['curls', 'volume', 'dramatic'] },

        // ══════ SHORT & BOB ══════
        { id: 'glossy_bob', label: 'Glossy Blunt Bob', text_en: 'glossy blunt bob, sharp edges, fashion-forward silhouette', category: 'Short & Bob', tags: ['bob', 'sharp', 'fashion'] },
        { id: 'textured_lob', label: 'Textured Lob', text_en: 'textured long bob, soft bend, modern effortless chic', category: 'Short & Bob', tags: ['lob', 'texture', 'modern'] },
        { id: 'sleek_pixie', label: 'Sleek Pixie (bold)', text_en: 'sleek pixie cut, bold editorial minimalism, strong cheekbones emphasis', category: 'Short & Bob', tags: ['pixie', 'bold', 'editorial'] }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // MAKEUP STYLES
    // ─────────────────────────────────────────────────────────────────────────
    makeup: [
        { id: 'auto', label: 'Auto (recommended by archetype)', text_en: '', category: 'Auto', tags: [] },

        // ══════ NATURAL & FRESH ══════
        { id: 'soft_natural', label: 'Soft Natural', text_en: 'soft natural makeup, glowing skin, nude glossy lips, subtle lashes', category: 'Natural & Fresh', tags: ['natural', 'soft', 'fresh'] },
        { id: 'bronzed_sunkissed', label: 'Bronzed Sunkissed', text_en: 'bronzed sun-kissed glow, warm contour, glossy lips, radiant skin', category: 'Natural & Fresh', tags: ['bronzed', 'warm', 'fresh'] },

        // ══════ CLASSIC GLAM ══════
        { id: 'smoky_eyes', label: 'Smoky Eyes', text_en: 'smoky eyes, smudged liner, glossy nude lips, high-glam contour', category: 'Classic Glam', tags: ['smoky', 'glamour', 'sexy'] },
        { id: 'cat_eye_dramatic', label: 'Cat Eye Dramatic', text_en: 'sharp cat-eye liner, winged perfection, bold lashes, sculpted cheekbones', category: 'Classic Glam', tags: ['cat_eye', 'dramatic', 'bold'] },
        { id: 'red_lip_classic', label: 'Red Lip Classic', text_en: 'classic red lipstick, clean skin, defined brows, vintage glamour', category: 'Classic Glam', tags: ['red_lip', 'classic', 'bold'] },
        { id: 'siren_wing_red_lip', label: 'Siren Wing + Red Lip (hot)', text_en: 'sharp winged liner, statement red lip, sculpted cheeks, high-glam finish', category: 'Classic Glam', tags: ['wing', 'red_lip', 'hot'] },

        // ══════ NIGHT & SMOKY ══════
        { id: 'night_glam', label: 'Night Glam (hot)', text_en: 'night-glam deep smoky eyes, dramatic lashes, glossy lips, premium party glamour', category: 'Night & Smoky', tags: ['night', 'glam', 'hot'] },
        { id: 'metallic_smoky', label: 'Metallic Smoky', text_en: 'metallic smoky eyes, copper or gold shimmer, glossy lips, high-fashion edge', category: 'Night & Smoky', tags: ['metallic', 'smoky', 'editorial'] },
        { id: 'glitter_lids', label: 'Glitter Lids', text_en: 'subtle glitter eyelids, smoky liner, glossy lips, night-out sparkle', category: 'Night & Smoky', tags: ['glitter', 'sparkle', 'party'] },

        // ══════ EDITORIAL ══════
        { id: 'glossy_wet_look', label: 'Glossy Wet Look', text_en: 'glossy wet-look makeup, dewy skin, high-shine lips, editorial edge', category: 'Editorial', tags: ['glossy', 'wet', 'modern'] },
        { id: 'nude_sculpted', label: 'Nude Sculpted', text_en: 'nude sculpted makeup, sharp contour, nude matte lips, defined features', category: 'Editorial', tags: ['nude', 'sculpted', 'modern'] },
        { id: 'graphic_liner_editorial', label: 'Graphic Liner (editorial)', text_en: 'graphic eyeliner, clean luminous skin, minimal blush, glossy lip, high-fashion finish', category: 'Editorial', tags: ['graphic', 'liner', 'editorial'] },

        // ══════ CHIC / VINTAGE ══════
        { id: 'french_girl', label: 'French Girl Chic', text_en: 'effortless chic makeup, soft red lip, minimal eyes, natural brows, modern classic', category: 'Chic / Vintage', tags: ['french', 'effortless', 'chic'] },

        // ══════ NOIR / STATEMENT ══════
        { id: 'vamp_lip_noir', label: 'Vamp Lip Noir (hot)', text_en: 'deep vamp lipstick, smoky liner, matte porcelain finish, noir glamour', category: 'Noir / Statement', tags: ['noir', 'vamp', 'hot'] },
        { id: 'pink_gloss_pop', label: 'Pink Gloss Pop', text_en: 'rosy blush, glossy pink lip, flutter lashes, playful glamorous finish', category: 'Noir / Statement', tags: ['pink', 'gloss', 'playful'] }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // OUTFITS — Garment TYPE only (no material, no color!)
    // ─────────────────────────────────────────────────────────────────────────
    outfits: [
        // ══════ LINGERIE SETS ══════
        { id: 'bra_briefs_set', label: 'Bra & Briefs Set', text_en: 'matching bra and briefs lingerie set', category: 'Lingerie Sets', tags: ['classic', 'set'] },
        { id: 'bra_thong_set', label: 'Bra & Thong Set', text_en: 'matching bra and thong set with high-cut briefs', category: 'Lingerie Sets', tags: ['thong', 'sexy', 'hot'] },
        { id: 'balconette_set', label: 'Balconette Set', text_en: 'balconette bra set with low-cut cups and wide-set straps', category: 'Lingerie Sets', tags: ['balconette', 'classic', 'sexy'] },
        { id: 'pushup_set', label: 'Push-up Set', text_en: 'push-up bra set with enhanced cleavage and matching briefs', category: 'Lingerie Sets', tags: ['pushup', 'sexy'] },
        { id: 'bralette_set', label: 'Bralette Set', text_en: 'soft wireless bralette set with matching briefs', category: 'Lingerie Sets', tags: ['bralette', 'soft', 'natural'] },
        { id: 'triangle_set', label: 'Triangle Bra Set', text_en: 'minimalist triangle bra set with thin straps', category: 'Lingerie Sets', tags: ['triangle', 'minimal', 'sexy'] },
        { id: 'longline_set', label: 'Longline Bra Set', text_en: 'longline bra extending below bust with matching briefs', category: 'Lingerie Sets', tags: ['longline', 'elegant'] },
        { id: 'suspender_set', label: 'Suspender Set', text_en: 'lingerie set with integrated suspender straps', category: 'Lingerie Sets', tags: ['suspender', 'vintage', 'sexy'] },
        { id: 'strapless_bandeau_set', label: 'Strapless Bandeau Set (hot)', text_en: 'strapless bandeau bra and thong set', category: 'Lingerie Sets', tags: ['bandeau', 'hot', 'sexy'] },
        { id: 'plunge_bra_set', label: 'Plunge Bra Set (hot)', text_en: 'plunge bra and thong set with deep neckline', category: 'Lingerie Sets', tags: ['plunge', 'hot', 'sexy'] },
        { id: 'high_waist_garter_set', label: 'High-waist Garter Set (hot)', text_en: 'high-waist briefs with garter straps and matching bra', category: 'Lingerie Sets', tags: ['garter', 'hot', 'sexy'] },
        { id: 'micro_triangle_set', label: 'Micro Triangle Set (hot)', text_en: 'micro triangle bra set with thin straps and minimal coverage', category: 'Lingerie Sets', tags: ['triangle', 'hot', 'bold'] },
        
        // ══════ STRAPPY & BOLD ══════
        { id: 'strappy_set', label: 'Strappy Set (hot)', text_en: 'strappy lingerie set with multiple thin straps and hardware details', category: 'Strappy & Bold', tags: ['strappy', 'hot', 'bold'] },
        { id: 'garter_set', label: 'Garter Belt Set (hot)', text_en: 'lingerie set with garter belt and detachable straps', category: 'Strappy & Bold', tags: ['garter', 'hot', 'classic'] },
        { id: 'cage_bra_set', label: 'Cage Bra Set (hot)', text_en: 'cage-style bra set with geometric strap design', category: 'Strappy & Bold', tags: ['cage', 'hot', 'bold'] },
        { id: 'harness_set', label: 'Harness Lingerie (hot)', text_en: 'harness-inspired lingerie set with body straps', category: 'Strappy & Bold', tags: ['harness', 'hot', 'edgy'] },
        { id: 'chain_set', label: 'Chain Detail Set (hot)', text_en: 'lingerie set with decorative chain details', category: 'Strappy & Bold', tags: ['chain', 'hot', 'bold'] },
        { id: 'crystal_set', label: 'Crystal Strap Set', text_en: 'lingerie set with crystal strap embellishments', category: 'Strappy & Bold', tags: ['crystal', 'statement', 'glamour'] },
        { id: 'ring_hardware_set', label: 'Ring Hardware Set (hot)', text_en: 'strappy lingerie set with ring hardware details', category: 'Strappy & Bold', tags: ['strappy', 'hot', 'bold'] },
        { id: 'laceup_strappy_set', label: 'Lace-up Strappy Set (hot)', text_en: 'strappy lingerie set with lace-up front detail', category: 'Strappy & Bold', tags: ['strappy', 'hot', 'bold'] },
        { id: 'collar_harness_set', label: 'Collar Harness Set (hot)', text_en: 'harness lingerie set with collar strap and body straps', category: 'Strappy & Bold', tags: ['harness', 'hot', 'edgy', 'bold'] },
        { id: 'x_strap_set', label: 'X-strap Set (hot)', text_en: 'lingerie set with crisscross X-strap design and hardware accents', category: 'Strappy & Bold', tags: ['strappy', 'hot', 'bold'] },
        { id: 'asymmetric_strap_set', label: 'Asymmetric Strap Set (hot)', text_en: 'asymmetric strap lingerie set with one-shoulder detail and bold lines', category: 'Strappy & Bold', tags: ['strappy', 'hot', 'bold', 'editorial'] },
        { id: 'body_chain_overlay_set', label: 'Body-chain Overlay Set (hot)', text_en: 'lingerie set with delicate body chain overlay and strap details', category: 'Strappy & Bold', tags: ['chain', 'hot', 'bold'] },
        { id: 'bra_harness_overlay_set', label: 'Bra Harness Overlay (hot)', text_en: 'bra set with harness overlay straps framing the torso', category: 'Strappy & Bold', tags: ['harness', 'hot', 'edgy', 'bold'] },
        { id: 'micro_strap_set', label: 'Micro Strap Set (hot)', text_en: 'micro lingerie set with ultra-thin straps and sharp cut lines', category: 'Strappy & Bold', tags: ['strappy', 'hot', 'bold'] },
        { id: 'geometric_cutout_set', label: 'Geometric Cutout Set (hot)', text_en: 'lingerie set with geometric cutouts and structured strap layout', category: 'Strappy & Bold', tags: ['cutout', 'hot', 'bold'] },
        
        // ══════ BODYSUITS ══════
        { id: 'bodysuit_classic', label: 'Classic Bodysuit', text_en: 'bodysuit with high-leg cut', category: 'Bodysuits', tags: ['bodysuit', 'classic'] },
        { id: 'bodysuit_plunge', label: 'Plunge Bodysuit', text_en: 'deep plunge bodysuit with low neckline', category: 'Bodysuits', tags: ['plunge', 'sexy', 'elegant'] },
        { id: 'bodysuit_sheer', label: 'Sheer Bodysuit (hot)', text_en: 'sheer bodysuit with strategic opaque panels', category: 'Bodysuits', tags: ['bodysuit', 'hot', 'sheer'] },
        { id: 'bodysuit_cutout', label: 'Cutout Bodysuit (hot)', text_en: 'bodysuit with geometric cutout details', category: 'Bodysuits', tags: ['cutout', 'hot', 'bold'] },
        { id: 'bodysuit_open_back', label: 'Open Back Bodysuit', text_en: 'open-back bodysuit revealing full back', category: 'Bodysuits', tags: ['open_back', 'sexy'] },
        { id: 'bodysuit_high_neck_cutout', label: 'High-neck Cutout Bodysuit (hot)', text_en: 'high-neck bodysuit with strategic cutouts and high-leg line', category: 'Bodysuits', tags: ['cutout', 'hot', 'bold'] },
        { id: 'bodysuit_zip_front', label: 'Zip-front Bodysuit (hot)', text_en: 'zip-front bodysuit with sculpted fit and high-leg cut', category: 'Bodysuits', tags: ['zip', 'hot', 'edgy', 'sexy'] },
        { id: 'bodysuit_long_sleeve_sheer', label: 'Long-sleeve Sheer Bodysuit (hot)', text_en: 'long-sleeve sheer bodysuit with strategic opaque panels', category: 'Bodysuits', tags: ['sheer', 'hot', 'sexy'] },
        { id: 'bodysuit_asymmetric', label: 'Asymmetric Bodysuit (hot)', text_en: 'one-shoulder asymmetric bodysuit with high-fashion silhouette', category: 'Bodysuits', tags: ['hot', 'editorial', 'sexy'] },
        { id: 'bodysuit_halter_plunge', label: 'Halter Plunge Bodysuit (hot)', text_en: 'halter-neck bodysuit with deep plunge neckline, high-leg cut', category: 'Bodysuits', tags: ['halter', 'plunge', 'hot', 'sexy'] },
        { id: 'bodysuit_underwire', label: 'Underwire Bodysuit (hot)', text_en: 'underwire cup bodysuit with sculpted fit and high-leg line', category: 'Bodysuits', tags: ['underwire', 'hot', 'sexy'] },
        { id: 'bodysuit_thong_back', label: 'Thong-back Bodysuit (hot)', text_en: 'high-cut bodysuit with thong-back silhouette', category: 'Bodysuits', tags: ['thong', 'hot', 'sexy'] },
        { id: 'bodysuit_laceup_sides', label: 'Lace-up Side Bodysuit (hot)', text_en: 'bodysuit with lace-up side details and sharp cut lines', category: 'Bodysuits', tags: ['laceup', 'hot', 'bold'] },
        { id: 'bodysuit_strappy_back', label: 'Strappy Back Bodysuit (hot)', text_en: 'bodysuit with strappy open-back design and geometric lines', category: 'Bodysuits', tags: ['strappy', 'hot', 'bold'] },
        { id: 'bodysuit_plunge_keyhole', label: 'Plunge Keyhole Bodysuit (hot)', text_en: 'plunge bodysuit with keyhole cutout detail and high-leg line', category: 'Bodysuits', tags: ['cutout', 'hot', 'sexy'] },
        { id: 'catsuit', label: 'Catsuit (hot)', text_en: 'full-length catsuit with body-hugging fit', category: 'Bodysuits', tags: ['catsuit', 'hot', 'bold', 'full'] },
        
        // ══════ CORSETS & BUSTIERS ══════
        { id: 'corset_classic', label: 'Classic Corset', text_en: 'structured corset with boning and lace-up back', category: 'Corsets', tags: ['corset', 'classic', 'structured'] },
        { id: 'bustier', label: 'Bustier Top', text_en: 'bustier top with structured cups and boning', category: 'Corsets', tags: ['bustier', 'structured', 'sexy'] },
        { id: 'corset_overbust', label: 'Overbust Corset (hot)', text_en: 'overbust corset with dramatic waist cinching', category: 'Corsets', tags: ['overbust', 'hot', 'dramatic'] },
        { id: 'corset_underbust', label: 'Underbust Corset', text_en: 'underbust corset worn with matching bra', category: 'Corsets', tags: ['underbust', 'layered'] },
        { id: 'corset_with_garters', label: 'Corset + Garters (hot)', text_en: 'corset with attached garter straps', category: 'Corsets', tags: ['corset', 'garter', 'hot', 'bold'] },
        { id: 'corset_front_zip', label: 'Front-zip Corset (hot)', text_en: 'corset with front zip closure and structured boning', category: 'Corsets', tags: ['corset', 'hot', 'bold'] },
        { id: 'waist_cincher', label: 'Waist Cincher (hot)', text_en: 'waist cincher corset belt worn over lingerie', category: 'Corsets', tags: ['corset', 'hot', 'edgy'] },
        { id: 'cupped_corset_bustier', label: 'Cupped Corset Bustier (hot)', text_en: 'cupped corset bustier with structured boning and sculpted fit', category: 'Corsets', tags: ['corset', 'hot', 'sexy'] },
        { id: 'halter_corset_top', label: 'Halter Corset Top (hot)', text_en: 'halter-style corset top with structured waist and clean lines', category: 'Corsets', tags: ['corset', 'hot', 'bold'] },
        { id: 'strappy_side_corset', label: 'Strappy Side Corset (hot)', text_en: 'corset with strappy side details and sharp silhouette', category: 'Corsets', tags: ['corset', 'hot', 'bold'] },
        { id: 'corset_micro_bustier', label: 'Micro Bustier Corset (hot)', text_en: 'micro bustier corset with high-fashion cut and structured waist', category: 'Corsets', tags: ['corset', 'hot', 'bold'] },
        { id: 'corset_belt_harness', label: 'Corset Belt Harness (hot)', text_en: 'corset belt with harness-style straps over lingerie', category: 'Corsets', tags: ['corset', 'harness', 'hot', 'edgy', 'bold'] },
        { id: 'laceup_front_corset', label: 'Lace-up Front Corset (hot)', text_en: 'corset with lace-up front detail and structured boning', category: 'Corsets', tags: ['corset', 'hot', 'sexy'] },
        
        // ══════ TEDDIES & CHEMISES ══════
        { id: 'teddy', label: 'Teddy (sexy)', text_en: 'teddy one-piece with high-leg cut', category: 'Teddies', tags: ['teddy', 'sexy', 'onepiece'] },
        { id: 'teddy_open_back', label: 'Open Back Teddy (hot)', text_en: 'open-back teddy with revealing back design', category: 'Teddies', tags: ['teddy', 'hot', 'open_back'] },
        { id: 'teddy_plunge', label: 'Plunge Teddy (hot)', text_en: 'plunge teddy one-piece with high-leg cut', category: 'Teddies', tags: ['teddy', 'plunge', 'hot', 'sexy'] },
        { id: 'teddy_strappy', label: 'Strappy Teddy (hot)', text_en: 'strappy teddy one-piece with geometric strap details', category: 'Teddies', tags: ['teddy', 'strappy', 'hot', 'bold'] },
        { id: 'chemise', label: 'Chemise', text_en: 'short chemise nightgown', category: 'Teddies', tags: ['chemise', 'elegant'] },
        { id: 'babydoll', label: 'Babydoll', text_en: 'babydoll with flowing overlay', category: 'Teddies', tags: ['babydoll', 'flowy', 'feminine'] },
        { id: 'cami_shorts', label: 'Cami & Shorts Set', text_en: 'camisole top with matching shorts', category: 'Teddies', tags: ['cami', 'shorts', 'casual'] },
        
        // ══════ SWIMWEAR ══════
        { id: 'bikini_classic', label: 'Classic Bikini', text_en: 'classic bikini two-piece', category: 'Swimwear', tags: ['bikini', 'classic'] },
        { id: 'bikini_string', label: 'String Bikini (hot)', text_en: 'string bikini with minimal coverage', category: 'Swimwear', tags: ['bikini', 'string', 'hot'] },
        { id: 'bikini_highcut', label: 'High-Cut Bikini', text_en: 'high-cut bikini with elongated leg line', category: 'Swimwear', tags: ['bikini', 'highcut', 'sexy'] },
        { id: 'bikini_strappy', label: 'Strappy Bikini (hot)', text_en: 'strappy bikini with multiple thin straps', category: 'Swimwear', tags: ['bikini', 'strappy', 'hot', 'sexy'] },
        { id: 'bikini_micro', label: 'Micro Bikini (hot)', text_en: 'micro bikini two-piece with minimal coverage', category: 'Swimwear', tags: ['bikini', 'hot', 'bold'] },
        { id: 'monokini', label: 'Monokini (hot)', text_en: 'monokini one-piece with cutout sides', category: 'Swimwear', tags: ['monokini', 'hot', 'cutout'] },
        { id: 'onepiece_plunge', label: 'Plunge One-Piece', text_en: 'one-piece swimsuit with deep plunge neckline', category: 'Swimwear', tags: ['onepiece', 'plunge', 'sexy'] },
        { id: 'onepiece_highcut_backless', label: 'Backless High-cut One-piece (hot)', text_en: 'high-cut one-piece swimsuit with open back', category: 'Swimwear', tags: ['onepiece', 'hot', 'sexy', 'open_back'] },
        
        // ══════ DRESSES ══════
        { id: 'mini_dress_bodycon', label: 'Bodycon Mini', text_en: 'skin-tight bodycon mini dress', category: 'Dresses', tags: ['mini', 'bodycon', 'sexy'] },
        { id: 'mini_dress_cutout', label: 'Cutout Mini (hot)', text_en: 'mini dress with strategic cutout details', category: 'Dresses', tags: ['mini', 'cutout', 'hot'] },
        { id: 'mini_dress_wrap', label: 'Wrap Mini', text_en: 'wrap-style mini dress with deep neckline', category: 'Dresses', tags: ['mini', 'wrap', 'sexy'] },
        { id: 'slip_dress', label: 'Slip Dress', text_en: 'slip dress with thin straps', category: 'Dresses', tags: ['slip', 'elegant'] },
        { id: 'cocktail_plunge', label: 'Plunge Cocktail', text_en: 'cocktail dress with deep plunging neckline', category: 'Dresses', tags: ['cocktail', 'plunge', 'sexy'] },
        { id: 'evening_gown_slit', label: 'Evening Gown + Slit', text_en: 'floor-length evening gown with high thigh slit', category: 'Dresses', tags: ['gown', 'slit', 'elegant'] },
        { id: 'mini_dress_backless', label: 'Backless Mini Dress (hot)', text_en: 'backless mini dress with sleek silhouette', category: 'Dresses', tags: ['mini', 'open_back', 'hot', 'sexy'] },
        { id: 'mini_dress_ruched', label: 'Ruched Bodycon Mini (hot)', text_en: 'ruched bodycon mini dress, figure-hugging fit', category: 'Dresses', tags: ['mini', 'bodycon', 'hot', 'sexy'] },
        { id: 'mini_dress_sheer_overlay', label: 'Sheer Overlay Mini (hot)', text_en: 'mini dress with sheer overlay and strategic lining', category: 'Dresses', tags: ['mini', 'sheer', 'hot', 'sexy'] },
        
        // ══════ LAYERING ══════
        { id: 'robe_open', label: 'Open Robe', text_en: 'robe worn open over lingerie', category: 'Layering', tags: ['robe', 'layered'] },
        { id: 'tailored_blazer_open', label: 'Tailored Blazer (hot)', text_en: 'tailored blazer worn open over lingerie', category: 'Layering', tags: ['blazer', 'hot', 'editorial'] },
        { id: 'kimono_sheer', label: 'Sheer Kimono', text_en: 'sheer kimono worn open over lingerie', category: 'Layering', tags: ['kimono', 'sheer', 'layered'] }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // COLOR PALETTE — Rich variety
    // ─────────────────────────────────────────────────────────────────────────
    colors: [
        { id: 'black', label: 'Classic Black', text_en: 'black', hex: '#000000', tags: ['classic', 'dark'] },
        { id: 'deep_red', label: 'Deep Red', text_en: 'deep red', hex: '#8B0000', tags: ['passionate', 'bold'] },
        { id: 'burgundy', label: 'Burgundy', text_en: 'burgundy', hex: '#722F37', tags: ['rich', 'elegant'] },
        { id: 'hot_pink', label: 'Hot Pink', text_en: 'hot pink', hex: '#FF1493', tags: ['bold', 'playful'] },
        { id: 'blush_pink', label: 'Blush Pink', text_en: 'blush pink', hex: '#FFB6C1', tags: ['soft', 'feminine'] },
        { id: 'ivory', label: 'Ivory', text_en: 'ivory', hex: '#FFFFF0', tags: ['elegant', 'bridal'] },
        { id: 'pure_white', label: 'Pure White', text_en: 'pure white', hex: '#FFFFFF', tags: ['pure', 'contrast'] },
        { id: 'nude', label: 'Nude', text_en: 'nude', hex: '#E8C39E', tags: ['natural', 'skin'] },
        { id: 'champagne', label: 'Champagne', text_en: 'champagne', hex: '#F7E7CE', tags: ['luxe', 'warm'] },
        { id: 'gold', label: 'Metallic Gold', text_en: 'metallic gold', hex: '#FFD700', tags: ['metallic', 'luxe'] },
        { id: 'silver', label: 'Metallic Silver', text_en: 'metallic silver', hex: '#C0C0C0', tags: ['metallic', 'cool'] },
        { id: 'rose_gold', label: 'Rose Gold', text_en: 'rose gold', hex: '#B76E79', tags: ['metallic', 'warm'] },
        { id: 'emerald', label: 'Emerald Green', text_en: 'emerald green', hex: '#50C878', tags: ['jewel', 'rich'] },
        { id: 'sapphire', label: 'Sapphire Blue', text_en: 'sapphire blue', hex: '#0F52BA', tags: ['jewel', 'rich'] },
        { id: 'navy', label: 'Navy Blue', text_en: 'navy blue', hex: '#000080', tags: ['classic', 'dark'] },
        { id: 'purple', label: 'Deep Purple', text_en: 'deep purple', hex: '#4B0082', tags: ['rich', 'bold'] },
        { id: 'leopard', label: 'Leopard Print', text_en: 'leopard print', hex: 'linear-gradient(45deg, #D4A574 25%, #4A3728 25%, #4A3728 50%, #D4A574 50%)', isPattern: true, tags: ['animal', 'bold'] },
        { id: 'snake', label: 'Snake Print', text_en: 'snake print', hex: 'linear-gradient(45deg, #8B8B7A 25%, #2F2F2F 25%)', isPattern: true, tags: ['animal', 'edgy'] },
        { id: 'zebra', label: 'Zebra Print', text_en: 'zebra print', hex: 'linear-gradient(45deg, #fff 25%, #000 25%, #000 50%, #fff 50%)', isPattern: true, tags: ['animal', 'bold'] }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // MATERIALS
    // ─────────────────────────────────────────────────────────────────────────
    // ─────────────────────────────────────────────────────────────────────────
    // MATERIALS — Fabric/finish for outfit (no fishnet - that's hosiery!)
    // ─────────────────────────────────────────────────────────────────────────
    materials: [
        { id: 'lace', label: 'Lace', text_en: 'lace', finish: 'sheer', tags: ['delicate', 'feminine'] },
        { id: 'satin', label: 'Satin', text_en: 'satin', finish: 'satin', tags: ['luxe', 'smooth'] },
        { id: 'silk', label: 'Silk', text_en: 'silk', finish: 'satin', tags: ['luxe', 'premium'] },
        { id: 'mesh', label: 'Mesh / Sheer', text_en: 'sheer mesh', finish: 'sheer', tags: ['sheer', 'sexy'] },
        { id: 'velvet', label: 'Velvet', text_en: 'velvet', finish: 'matte', tags: ['luxe', 'rich'] },
        { id: 'latex', label: 'Latex-look', text_en: 'latex-look', finish: 'glossy', tags: ['edgy', 'bold'] },
        { id: 'leather', label: 'Leather-look', text_en: 'leather-look', finish: 'glossy', tags: ['edgy', 'bold'] },
        { id: 'pvc', label: 'PVC / Vinyl', text_en: 'PVC vinyl', finish: 'glossy', tags: ['edgy', 'bold', 'glossy'] },
        { id: 'cotton', label: 'Cotton', text_en: 'cotton', finish: 'matte', tags: ['casual', 'natural'] },
        { id: 'chiffon', label: 'Chiffon', text_en: 'sheer chiffon', finish: 'sheer', tags: ['flowy', 'romantic'] },
        { id: 'sequin', label: 'Sequin', text_en: 'sequin-embellished', finish: 'sparkle', tags: ['sparkle', 'party'] },
        { id: 'beaded', label: 'Beaded', text_en: 'beaded', finish: 'sparkle', tags: ['sparkle', 'luxe'] }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // ACCESSORIES — Jewelry styling (earrings + neck)
    // ─────────────────────────────────────────────────────────────────────────
    accessories: [
        { id: 'none', label: 'None', text_en: '', category: 'None', tags: [] },

        { id: 'delicate_gold_set', label: 'Delicate Gold Set', text_en: 'delicate gold hoop earrings, thin gold chain necklace', category: 'Sets', tags: ['gold', 'classic'] },
        { id: 'pearl_classic_set', label: 'Pearl Classic Set', text_en: 'pearl stud earrings, single-strand pearl necklace', category: 'Sets', tags: ['pearl', 'classic'] },
        { id: 'diamond_pendant_set', label: 'Diamond Pendant Set', text_en: 'diamond stud earrings, delicate diamond pendant necklace', category: 'Sets', tags: ['diamond', 'luxe'] },

        { id: 'bold_hoops_chain', label: 'Bold Hoops + Chain (hot)', text_en: 'large gold hoop earrings, collarbone-length chain necklace', category: 'Statement', tags: ['gold', 'hot', 'statement'] },
        { id: 'crystal_drop_set', label: 'Crystal Drop Earrings', text_en: 'crystal drop earrings, delicate necklace', category: 'Statement', tags: ['crystal', 'glamour'] },
        { id: 'satin_choker_set', label: 'Satin Choker', text_en: 'sleek satin choker, small hoop earrings', category: 'Statement', tags: ['choker', 'edgy'] },
        { id: 'layered_fine_chains', label: 'Layered Fine Chains', text_en: 'layered fine chain necklaces, minimalist stud earrings', category: 'Minimal', tags: ['layered', 'minimal'] },
        { id: 'modern_ear_cuffs', label: 'Modern Ear Cuffs', text_en: 'modern ear cuffs, thin chain necklace', category: 'Modern', tags: ['modern', 'editorial'] }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // HOSIERY
    // ─────────────────────────────────────────────────────────────────────────
    hosiery: [
        // ══════ BARE / NONE ══════
        { id: 'none', label: 'None (bare legs)', text_en: '', category: 'Basic', tags: [] },
        
        // ══════ STOCKINGS ══════
        { id: 'sheer_stockings', label: 'Sheer Stockings', text_en: 'sheer stockings', category: 'Stockings', tags: ['sheer', 'classic', 'sexy'] },
        { id: 'ultra_sheer_gloss_stockings', label: 'Ultra-sheer Gloss Stockings (hot)', text_en: 'ultra-sheer glossy stockings, subtle sheen on legs', category: 'Stockings', tags: ['sheer', 'hot', 'sexy'] },
        { id: 'lace_top_stockings', label: 'Lace-top Stockings (hot)', text_en: 'lace-top stockings with decorative band', category: 'Stockings', tags: ['lace', 'hot', 'sexy'] },
        { id: 'seamed_stockings', label: 'Seamed Stockings', text_en: 'seamed stockings with back seam', category: 'Stockings', tags: ['seamed', 'vintage', 'sexy'] },
        { id: 'cuban_heel_stockings', label: 'Cuban Heel Stockings', text_en: 'stockings with contrasting Cuban heel', category: 'Stockings', tags: ['cuban', 'vintage', 'sexy'] },
        { id: 'open_toe_stockings', label: 'Open-toe Stockings (hot)', text_en: 'open-toe stockings for strappy sandals', category: 'Stockings', tags: ['open_toe', 'sandal_friendly', 'hot', 'sexy'] },
        
        // ══════ STAY-UPS & HOLD-UPS ══════
        { id: 'thigh_highs', label: 'Thigh-high Stay-ups', text_en: 'thigh-high stay-up stockings', category: 'Stay-ups', tags: ['thigh_high', 'sexy', 'hot'] },
        { id: 'hold_ups_lace', label: 'Lace Hold-ups (hot)', text_en: 'lace-top hold-up stockings', category: 'Stay-ups', tags: ['lace', 'hot', 'sexy'] },
        { id: 'double_strap_hold_ups', label: 'Double-strap Hold-ups (hot)', text_en: 'double-strap hold-up stockings with bold band detail', category: 'Stay-ups', tags: ['hot', 'bold', 'sexy'] },
        { id: 'suspender_stockings', label: 'Suspender Stockings', text_en: 'stockings with attached suspender belt', category: 'Stay-ups', tags: ['suspender', 'vintage', 'hot'] },
        
        // ══════ FISHNET ══════
        { id: 'fishnet_stockings', label: 'Fishnet Stockings (hot)', text_en: 'fishnet stockings', category: 'Fishnet', tags: ['fishnet', 'hot', 'bold'] },
        { id: 'fishnet_large', label: 'Large Fishnet', text_en: 'large-scale fishnet stockings', category: 'Fishnet', tags: ['fishnet', 'bold', 'edgy'] },
        { id: 'fishnet_seamed', label: 'Seamed Fishnet', text_en: 'fishnet stockings with back seam', category: 'Fishnet', tags: ['fishnet', 'seamed', 'hot'] },
        { id: 'fishnet_tights', label: 'Fishnet Tights (hot)', text_en: 'fishnet tights', category: 'Fishnet', tags: ['fishnet', 'hot', 'bold'] },
        { id: 'rhinestone_fishnet_tights', label: 'Rhinestone Fishnet (hot)', text_en: 'rhinestone fishnet tights with subtle sparkle', category: 'Fishnet', tags: ['fishnet', 'hot', 'bold', 'statement'] },
        { id: 'micronet_tights', label: 'Micronet Tights', text_en: 'fine micronet tights', category: 'Fishnet', tags: ['micronet', 'subtle', 'sexy'] },
        
        // ══════ TIGHTS ══════
        { id: 'sheer_tights', label: 'Sheer Tights', text_en: 'sheer tights', category: 'Tights', tags: ['sheer', 'subtle'] },
        { id: 'patterned_tights', label: 'Patterned Tights', text_en: 'patterned tights with decorative design', category: 'Tights', tags: ['patterned', 'statement'] },
        { id: 'garter_illusion_tights', label: 'Garter Illusion Tights (hot)', text_en: 'tights with garter-belt illusion pattern', category: 'Tights', tags: ['patterned', 'hot', 'bold'] },
        { id: 'lace_pattern_tights', label: 'Lace Pattern Tights (hot)', text_en: 'lace-pattern tights with delicate floral motif', category: 'Tights', tags: ['lace', 'hot', 'sexy', 'statement'] },
        { id: 'shimmer_sheer_tights', label: 'Shimmer Sheer Tights (hot)', text_en: 'ultra-sheer tights with subtle shimmer', category: 'Tights', tags: ['sheer', 'hot', 'sexy', 'statement'] },
        { id: 'opaque_tights', label: 'Opaque Tights', text_en: 'opaque matte tights', category: 'Tights', tags: ['opaque', 'matte'] }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // FOOTWEAR
    // ─────────────────────────────────────────────────────────────────────────
    footwear: [
        // ══════ PUMPS ══════
        { id: 'stiletto_pumps', label: 'Stiletto Pumps', text_en: 'pointed-toe stiletto pumps with slim high heel', category: 'Pumps', tags: ['pumps', 'stiletto', 'classic'] },
        { id: 'patent_pumps', label: 'Patent Pumps', text_en: 'patent leather pointed-toe pumps, glossy finish', category: 'Pumps', tags: ['patent', 'glossy', 'sexy'] },
        { id: 'platform_pumps', label: 'Platform Pumps (hot)', text_en: 'platform pumps with ultra-high stiletto heel', category: 'Pumps', tags: ['platform', 'hot', 'dramatic'] },
        { id: 'peep_toe_pumps', label: 'Peep-toe Pumps (hot)', text_en: 'peep-toe stiletto pumps, ultra-sleek silhouette', category: 'Pumps', tags: ['pumps', 'hot', 'sexy'] },
        { id: 'ankle_cuff_stilettos', label: 'Ankle-cuff Stilettos (hot)', text_en: 'stiletto heels with bold ankle cuff detail', category: 'Pumps', tags: ['hot', 'bold', 'sexy'] },
        { id: 'red_sole_stilettos', label: 'Red-sole Stilettos', text_en: 'pointed-toe stilettos with signature red sole', category: 'Pumps', tags: ['redsole', 'luxury', 'sexy'] },
        { id: 'slingback_heels', label: 'Slingback Heels', text_en: 'pointed-toe slingback heels with open back', category: 'Pumps', tags: ['slingback', 'elegant'] },
        { id: 'ankle_strap_heels', label: 'Ankle-strap Heels', text_en: 'ankle-strap stilettos with pointed toe', category: 'Pumps', tags: ['ankle_strap', 'elegant'] },
        
        // ══════ SANDALS ══════
        { id: 'strappy_sandals', label: 'Strappy Sandals', text_en: 'strappy sandal heels with thin straps', category: 'Sandals', tags: ['sandals', 'strappy', 'sexy'] },
        { id: 'barely_there', label: 'Barely-there Sandals', text_en: 'barely-there strap sandals with ultra-thin straps', category: 'Sandals', tags: ['minimal', 'elegant', 'sexy'] },
        { id: 'laceup_sandals', label: 'Lace-up Sandals (hot)', text_en: 'lace-up sandal heels wrapping the ankle', category: 'Sandals', tags: ['laceup', 'hot', 'bold'] },
        { id: 'caged_sandals', label: 'Caged Sandal Heels (hot)', text_en: 'caged sandal heels with strappy cage design', category: 'Sandals', tags: ['sandals', 'hot', 'bold', 'sexy'] },
        { id: 'toe_ring_sandals', label: 'Toe-ring Sandals (hot)', text_en: 'toe-ring sandal heels, minimal straps, high-fashion finish', category: 'Sandals', tags: ['sandals', 'hot', 'sexy'] },
        { id: 'crystal_sandals', label: 'Crystal-embellished Sandals', text_en: 'strappy sandals with crystal embellishments', category: 'Sandals', tags: ['crystal', 'statement', 'luxe'] },
        
        // ══════ ANKLE BOOTS ══════
        { id: 'ankle_boots', label: 'Stiletto Ankle Boots', text_en: 'pointed-toe stiletto ankle boots', category: 'Ankle Boots', tags: ['boots', 'ankle', 'edgy'] },
        { id: 'ankle_boots_patent', label: 'Patent Ankle Boots', text_en: 'patent leather ankle boots with stiletto heel', category: 'Ankle Boots', tags: ['boots', 'ankle', 'patent', 'glossy'] },
        { id: 'platform_ankle_boots', label: 'Platform Ankle Boots (hot)', text_en: 'platform ankle boots with ultra-high heel, sharp toe', category: 'Ankle Boots', tags: ['boots', 'platform', 'hot', 'dramatic', 'bold'] },
        { id: 'sock_boots', label: 'Sock Boots', text_en: 'fitted sock-style ankle boots with stiletto heel', category: 'Ankle Boots', tags: ['boots', 'sock', 'modern'] },
        
        // ══════ KNEE-HIGH BOOTS ══════
        { id: 'knee_high_boots', label: 'Knee-high Boots', text_en: 'knee-high stiletto boots', category: 'Knee-high', tags: ['boots', 'knee', 'sexy'] },
        { id: 'knee_high_patent', label: 'Patent Knee-high (hot)', text_en: 'patent leather knee-high stiletto boots, glossy finish', category: 'Knee-high', tags: ['boots', 'patent', 'hot'] },
        { id: 'knee_high_laceup', label: 'Lace-up Knee-high (hot)', text_en: 'lace-up knee-high stiletto boots, tight fit', category: 'Knee-high', tags: ['boots', 'laceup', 'hot', 'bold'] },
        { id: 'knee_high_suede', label: 'Suede Knee-high', text_en: 'suede knee-high boots with stiletto heel', category: 'Knee-high', tags: ['boots', 'suede', 'elegant'] },
        
        // ══════ THIGH-HIGH BOOTS ══════
        { id: 'thigh_high_boots', label: 'Thigh-high Boots (hot)', text_en: 'over-the-knee thigh-high stiletto boots', category: 'Thigh-high', tags: ['boots', 'thigh', 'hot', 'bold'] },
        { id: 'thigh_high_patent', label: 'Patent Thigh-high (hot)', text_en: 'patent leather thigh-high boots with stiletto heel', category: 'Thigh-high', tags: ['boots', 'patent', 'hot', 'bold'] },
        { id: 'thigh_high_platform', label: 'Platform Thigh-high (hot)', text_en: 'platform thigh-high boots with ultra-high heel', category: 'Thigh-high', tags: ['boots', 'thigh', 'platform', 'hot', 'dramatic', 'bold'] },
        { id: 'latex_thigh_high_boots', label: 'Latex-look Thigh-high (hot)', text_en: 'latex-look thigh-high stiletto boots, high-gloss finish', category: 'Thigh-high', tags: ['boots', 'thigh', 'hot', 'bold', 'edgy', 'glossy'] },
        { id: 'thigh_high_suede', label: 'Suede Thigh-high', text_en: 'suede thigh-high boots with stiletto heel', category: 'Thigh-high', tags: ['boots', 'suede', 'sexy'] },
        { id: 'thigh_high_laceup', label: 'Lace-up Thigh-high', text_en: 'thigh-high boots with lace-up back detail', category: 'Thigh-high', tags: ['boots', 'laceup', 'hot', 'bold'] },
        
        // ══════ STATEMENT ══════
        { id: 'clear_heels', label: 'Clear Perspex Heels', text_en: 'clear perspex heels with transparent design', category: 'Statement', tags: ['clear', 'modern', 'edgy'] },
        { id: 'mules_heels', label: 'Heeled Mules', text_en: 'pointed-toe heeled mules', category: 'Statement', tags: ['mules', 'elegant'] },
        { id: 'crystal_heels', label: 'Crystal-embellished Heels', text_en: 'heels with crystal embellishments', category: 'Statement', tags: ['crystal', 'statement', 'luxe'] }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // SETTINGS — Location, furniture, textures, props ONLY (no lighting!)
    // ─────────────────────────────────────────────────────────────────────────
    settings: [
        // ══════ STUDIO ══════
        { id: 'studio_white', label: 'White Studio', text_en: 'white studio cyclorama, glossy reflective floor', category: 'Studio', tags: ['studio', 'clean'] },
        { id: 'studio_black', label: 'Black Studio', text_en: 'black seamless studio backdrop, matte floor', category: 'Studio', tags: ['studio', 'dark'] },
        { id: 'studio_colored', label: 'Colored Backdrop', text_en: 'studio with solid colored backdrop', category: 'Studio', tags: ['studio', 'color'] },
        { id: 'studio_textured', label: 'Textured Wall', text_en: 'studio with textured concrete wall backdrop', category: 'Studio', tags: ['studio', 'texture'] },
        
        // ══════ BOUDOIR ══════
        { id: 'hotel_suite', label: 'Luxury Hotel Suite', text_en: 'luxury hotel suite, plush king bed, velvet armchair, silk drapes', category: 'Boudoir', tags: ['hotel', 'boudoir'] },
        { id: 'hotel_bathroom', label: 'Marble Bathroom', text_en: 'marble bathroom, chrome fixtures, large vanity mirror', category: 'Boudoir', tags: ['bathroom', 'marble'] },
        { id: 'boudoir_classic', label: 'Classic Boudoir', text_en: 'boudoir room with ornate mirror, velvet chaise, silk fabrics', category: 'Boudoir', tags: ['boudoir', 'classic'] },
        { id: 'bedroom_silk', label: 'Silk Bedroom', text_en: 'luxurious bedroom, silk sheets, velvet headboard', category: 'Boudoir', tags: ['bedroom', 'intimate'] },
        
        // ══════ MODERN ══════
        { id: 'penthouse_windows', label: 'Penthouse Windows', text_en: 'modern penthouse, floor-to-ceiling windows, minimal furniture', category: 'Modern', tags: ['penthouse', 'modern'] },
        { id: 'penthouse_terrace', label: 'Penthouse Terrace', text_en: 'penthouse terrace, city skyline view, modern lounge furniture', category: 'Modern', tags: ['penthouse', 'outdoor'] },
        { id: 'loft_industrial', label: 'Industrial Loft', text_en: 'industrial loft, exposed concrete walls, chrome accents, minimal furniture', category: 'Modern', tags: ['loft', 'industrial'] },
        { id: 'loft_brick', label: 'Brick Loft', text_en: 'loft with exposed brick walls, wood floors, urban character', category: 'Modern', tags: ['loft', 'brick'] },
        
        // ══════ BACKSTAGE ══════
        { id: 'dressing_room', label: 'Dressing Room', text_en: 'backstage dressing room, vanity mirror with bulbs, velvet stool', category: 'Backstage', tags: ['backstage', 'mirror'] },
        { id: 'cabaret_backstage', label: 'Cabaret Backstage', text_en: 'cabaret backstage, velvet curtains, vintage vanity', category: 'Backstage', tags: ['cabaret', 'backstage'] },
        
        // ══════ SPACES ══════
        { id: 'modern_corridor', label: 'Modern Corridor', text_en: 'modern corridor, reflective floor, clean walls', category: 'Spaces', tags: ['corridor', 'modern'] },
        { id: 'hotel_hallway', label: 'Hotel Hallway', text_en: 'luxury hotel hallway, plush carpet, elegant wallpaper', category: 'Spaces', tags: ['hotel', 'hallway'] },
        { id: 'marble_staircase', label: 'Marble Staircase', text_en: 'grand marble staircase, ornate railing', category: 'Spaces', tags: ['staircase', 'luxury'] },
        
        // ══════ OUTDOOR ══════
        { id: 'poolside', label: 'Poolside', text_en: 'luxury poolside, sparkling water, lounge chairs', category: 'Outdoor', tags: ['outdoor', 'pool'] },
        { id: 'rooftop', label: 'Rooftop', text_en: 'rooftop setting, city skyline backdrop', category: 'Outdoor', tags: ['outdoor', 'rooftop'] },
        { id: 'beach', label: 'Beach', text_en: 'beach setting, sand, gentle waves in background', category: 'Outdoor', tags: ['outdoor', 'beach'] },
        
        // ══════ SPECIAL ══════
        { id: 'mirror_room', label: 'Mirror Room', text_en: 'room with multiple large mirrors, reflective surfaces', category: 'Special', tags: ['mirror', 'artistic'] },
        { id: 'minimal_white', label: 'Minimal White Space', text_en: 'minimal white interior, clean geometric shapes', category: 'Special', tags: ['minimal', 'clean'] },
        { id: 'dark_moody', label: 'Dark Moody Interior', text_en: 'dark interior, deep rich textures, velvet and leather', category: 'Special', tags: ['dark', 'moody'] }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // ART DIRECTION — Campaign style/mood ONLY (no lighting, no location!)
    // ─────────────────────────────────────────────────────────────────────────
    artDirections: [
        { id: 'playboy_glam', label: 'Playboy Glamour', text_en: 'Playboy-inspired glamour magazine editorial, polished sensuality, classic allure', tags: ['playboy', 'glamour', 'classic'] },
        { id: 'luxury_boudoir', label: 'Luxury Boudoir', text_en: 'luxury boudoir lingerie campaign, intimate sensuality, premium editorial feel', tags: ['boudoir', 'intimate', 'luxury'] },
        { id: 'night_editorial', label: 'Night Editorial', text_en: 'night-time glamour editorial, urban sophistication, modern seduction', tags: ['night', 'urban', 'modern'] },
        { id: 'noir_mood', label: 'Noir Mood', text_en: 'noir-inspired glamour, mysterious allure, cinematic tension', tags: ['noir', 'mysterious', 'cinematic'] },
        { id: 'vintage_pinup', label: 'Vintage Pin-Up', text_en: 'vintage pin-up glamour, playful charm, nostalgic Americana appeal', tags: ['vintage', 'pinup', 'retro'] },
        { id: 'modern_minimal', label: 'Modern Minimal', text_en: 'modern minimal editorial, geometric precision, high-fashion restraint', tags: ['modern', 'minimal', 'fashion'] },
        { id: 'old_money', label: 'Old Money Luxury', text_en: 'old-money luxury aesthetic, timeless elegance, refined sophistication', tags: ['luxe', 'classic', 'refined'] },
        { id: 'edgy_fashion', label: 'Edgy Fashion', text_en: 'edgy high-fashion editorial, bold attitude, avant-garde sensibility', tags: ['edgy', 'bold', 'fashion'] },
        { id: 'romantic_soft', label: 'Romantic Soft', text_en: 'romantic soft glamour, dreamy femininity, gentle sensuality', tags: ['romantic', 'soft', 'feminine'] },
        { id: 'fierce_power', label: 'Fierce Power', text_en: 'fierce power editorial, confident dominance, unapologetic sexuality', tags: ['fierce', 'power', 'bold'] },
        { id: 'sultry_seductive', label: 'Sultry Seductive', text_en: 'sultry seductive mood, smoldering intensity, magnetic allure', tags: ['sultry', 'seductive', 'hot'] },
        { id: 'fresh_natural', label: 'Fresh Natural', text_en: 'fresh natural beauty, effortless appeal, sun-kissed radiance', tags: ['fresh', 'natural', 'bright'] }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // POSES
    // ─────────────────────────────────────────────────────────────────────────
    poses: [
        // ══════ STANDING ══════
        { id: 'standing_confident', label: 'Confident', text_en: 'standing full body, confident pose, one hand on hip, direct gaze, elongated posture', category: 'Standing', tags: ['standing', 'confident'] },
        { id: 'standing_scurve', label: 'S-Curve', text_en: 'standing full body with S-curve, hips angled, subtle arch, teasing smile', category: 'Standing', tags: ['standing', 'scurve', 'sexy'] },
        { id: 'standing_back_turn', label: 'Back Turn Look', text_en: 'standing with back toward camera, looking over shoulder, confident gaze', category: 'Standing', tags: ['standing', 'back', 'over_shoulder'] },
        { id: 'standing_arms_up', label: 'Arms Up', text_en: 'standing full body, both arms raised adjusting hair, exposed torso, confident expression', category: 'Standing', tags: ['standing', 'arms_up', 'sexy'] },
        { id: 'standing_crossed_ankles', label: 'Crossed Ankles', text_en: 'standing full body with crossed ankles, fashion stance, poised expression', category: 'Standing', tags: ['standing', 'elegant'] },
        { id: 'standing_power', label: 'Power Stance', text_en: 'standing full body with legs apart, strong posture, assertive gaze', category: 'Standing', tags: ['standing', 'power', 'bold'] },
        
        // ══════ WALKING ══════
        { id: 'walking_toward', label: 'Walk Toward', text_en: 'walking toward camera, mid-step, confident runway posture, direct gaze', category: 'Walking', tags: ['walking', 'dynamic', 'confident'] },
        { id: 'walking_away', label: 'Walk Away Look', text_en: 'walking away with look-back over shoulder, teasing gaze, relaxed posture', category: 'Walking', tags: ['walking', 'over_shoulder', 'teasing'] },
        
        // ══════ LEANING ══════
        { id: 'leaning_wall', label: 'Leaning on Wall', text_en: 'standing full body leaning against wall, relaxed shoulders, one leg bent', category: 'Leaning', tags: ['leaning', 'relaxed'] },
        { id: 'leaning_forward', label: 'Leaning Forward', text_en: 'leaning forward slightly, hands on thighs, teasing gaze, accentuated curves', category: 'Leaning', tags: ['leaning', 'forward', 'sexy'] },
        
        // ══════ SEATED ══════
        { id: 'seated_elegant', label: 'Seated Elegant', text_en: 'seated elegantly, legs crossed, upright posture, composed expression', category: 'Seated', tags: ['seated', 'elegant'] },
        { id: 'seated_edge', label: 'Seated on Edge', text_en: 'seated on edge of surface, legs angled forward, full body visible', category: 'Seated', tags: ['seated', 'casual'] },
        { id: 'seated_lounging', label: 'Lounging', text_en: 'lounging back on surface, legs extended, relaxed sensual pose', category: 'Seated', tags: ['seated', 'lounging', 'relaxed'] },
        
        // ══════ SPECIALTY ══════
        { id: 'boots_emphasis', label: 'Boots Emphasis', text_en: 'standing with one boot placed forward, emphasizing footwear, confident pose', category: 'Specialty', tags: ['standing', 'boots', 'product'] },
        { id: 'mirror_pose', label: 'Mirror Pose', text_en: 'standing near mirror, adjusting earring or hair, elegant profile', category: 'Specialty', tags: ['standing', 'mirror', 'elegant'] },
        { id: 'window_silhouette', label: 'Window Silhouette', text_en: 'standing near window, soft silhouette, contemplative gaze', category: 'Specialty', tags: ['standing', 'window', 'artistic'] },
        { id: 'laying_elegant', label: 'Laying Elegant', text_en: 'laying on surface, full body visible, elegant sensual pose, composed expression', category: 'Specialty', tags: ['laying', 'elegant', 'intimate'] },
        { id: 'kneeling', label: 'Kneeling', text_en: 'kneeling full body, upright torso, confident gaze, editorial attitude', category: 'Specialty', tags: ['kneeling', 'editorial'] }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // LIGHTING — Physical light sources and shadow quality only
    // ─────────────────────────────────────────────────────────────────────────
    lighting: [
        // ══════ SOFT / HIGH-KEY ══════
        { id: 'softbox_highkey', label: 'Softbox High-Key', text_en: 'large softbox key light + rim light, controlled soft shadows, even illumination', category: 'Soft', tags: ['softbox', 'high_key', 'clean'] },
        { id: 'beauty_dish', label: 'Beauty Dish', text_en: 'beauty dish key light with clamshell fill reflector, minimal shadows on face', category: 'Soft', tags: ['beauty_dish', 'glamour'] },
        { id: 'diffused_soft', label: 'Diffused Soft', text_en: 'diffused key light + gentle rim, soft gradual shadows', category: 'Soft', tags: ['diffused', 'soft'] },
        { id: 'butterfly', label: 'Butterfly / Paramount', text_en: 'butterfly lighting from above, subtle shadow under nose, glamour classic', category: 'Soft', tags: ['butterfly', 'glamour'] },
        
        // ══════ NATURAL ══════
        { id: 'window_natural', label: 'Window Light', text_en: 'natural window light as key + soft fill, directional daylight', category: 'Natural', tags: ['window', 'natural', 'soft'] },
        { id: 'practical_lamps', label: 'Practical Lamps', text_en: 'practical lamp lights visible in frame + soft key fill', category: 'Natural', tags: ['practical', 'lamps'] },
        
        // ══════ DRAMATIC ══════
        { id: 'low_key_dramatic', label: 'Low-Key Dramatic', text_en: 'low-key lighting setup, deep defined shadows, high contrast ratio', category: 'Dramatic', tags: ['low_key', 'dramatic'] },
        { id: 'split_lighting', label: 'Split Lighting', text_en: 'split lighting with half face in shadow, strong directional key', category: 'Dramatic', tags: ['split', 'dramatic'] },
        { id: 'rim_backlight', label: 'Rim + Backlight', text_en: 'strong rim light + backlight for separation, edge definition', category: 'Dramatic', tags: ['rim', 'backlight'] },
        { id: 'rembrandt', label: 'Rembrandt Light', text_en: 'Rembrandt lighting with triangle shadow on cheek, painterly quality', category: 'Dramatic', tags: ['rembrandt', 'artistic'] },
        
        // ══════ ARTISTIC ══════
        { id: 'neon_accent', label: 'Neon Accent', text_en: 'neon accent lights as rim, colored edge highlights', category: 'Artistic', tags: ['neon', 'accent', 'colored'] },
        { id: 'silhouette', label: 'Silhouette', text_en: 'strong backlight with controlled rim light, subtle silhouette mood, keep facial and body detail visible, clean separation (no glow outline)', category: 'Artistic', tags: ['silhouette', 'backlight', 'artistic'] },
        { id: 'gobo_shadows', label: 'Gobo Shadows', text_en: 'gobo-patterned shadows through blinds or geometric shapes', category: 'Artistic', tags: ['gobo', 'pattern'] }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // CAMERA
    // ─────────────────────────────────────────────────────────────────────────
    camera: [
        { id: '50mm_editorial', label: '50mm Editorial', text_en: '50mm editorial look, camera pulled back for full-length, eye-level with slight low angle, sharp focus, premium finish', tags: ['50mm', 'editorial', 'standard'] },
        { id: '35mm_dynamic', label: '35mm Dynamic', text_en: '35mm dynamic shot, slightly low angle, strong perspective, cinematic energy', tags: ['35mm', 'dynamic', 'cinematic'] },
        { id: '85mm_compression', label: '85mm Compression', text_en: '85mm compressed perspective, flattering proportions, creamy bokeh, magazine look', tags: ['85mm', 'portrait', 'flattering'] },
        { id: '50mm_centered', label: '50mm Centered Symmetry', text_en: '50mm centered symmetrical composition, clean studio geometry, magazine cover energy', tags: ['50mm', 'centered', 'cover'] },
        { id: '35mm_low_angle', label: '35mm Low Angle', text_en: '35mm low angle shot, boots emphasis, powerful perspective', tags: ['35mm', 'low_angle', 'bold'] },
        { id: 'rule_of_thirds', label: 'Rule of Thirds', text_en: '50mm rule-of-thirds composition, subject off-center, negative space for copy', tags: ['composition', 'thirds', 'editorial'] },
        { id: 'dutch_tilt', label: 'Subtle Dutch Tilt', text_en: '35mm subtle dutch tilt, dynamic editorial energy, controlled bokeh', tags: ['dutch', 'dynamic', 'bold'] },
        { id: 'overhead', label: 'Overhead Editorial', text_en: 'overhead angle, full body on floor plane, geometric composition, high-fashion', tags: ['overhead', 'editorial', 'artistic'] }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // COLOR GRADES — Post-processing: color temperature, contrast, skin finish
    // ─────────────────────────────────────────────────────────────────────────
    colorGrades: [
        { id: 'neutral_natural', label: 'Neutral Natural', text_en: 'neutral color balance, natural skin texture preserved, clean retouch', tags: ['neutral', 'natural'] },
        { id: 'warm_filmic', label: 'Warm Filmic', text_en: 'warm color temperature, filmic tones, gentle highlight rolloff', tags: ['warm', 'filmic'] },
        { id: 'cool_modern', label: 'Cool Modern', text_en: 'cool color temperature, crisp tones, modern editorial finish', tags: ['cool', 'modern'] },
        { id: 'high_contrast', label: 'High Contrast', text_en: 'high contrast grading, deep blacks, bright highlights', tags: ['contrast', 'punchy'] },
        { id: 'low_contrast_soft', label: 'Low Contrast Soft', text_en: 'low contrast soft grading, lifted shadows, dreamy tones', tags: ['soft', 'dreamy'] },
        { id: 'teal_orange', label: 'Teal & Orange', text_en: 'teal and orange color grading, cinematic blockbuster look', tags: ['teal', 'orange', 'cinematic'] },
        { id: 'desaturated', label: 'Desaturated Muted', text_en: 'desaturated muted tones, fashion editorial restraint', tags: ['desaturated', 'muted'] },
        { id: 'rich_saturated', label: 'Rich Saturated', text_en: 'rich saturated colors, vibrant skin tones, punchy finish', tags: ['saturated', 'vibrant'] },
        { id: 'black_white', label: 'Black & White', text_en: 'black and white conversion, full tonal range, natural grain', tags: ['bw', 'monochrome'] },
        { id: 'sepia_vintage', label: 'Sepia Vintage', text_en: 'sepia-toned vintage look, warm nostalgic finish', tags: ['sepia', 'vintage'] },
        { id: 'glossy_magazine', label: 'Glossy Magazine', text_en: 'glossy magazine finish, natural skin texture preserved, controlled specular highlights', tags: ['glossy', 'magazine'] },
        { id: 'matte_editorial', label: 'Matte Editorial', text_en: 'matte editorial finish, subdued highlights, fashion-forward', tags: ['matte', 'editorial'] }
    ]
};

// ============================================================================
// VIDEO LEXICONS — Motion and camera for video generation
// ============================================================================

const VIDEO_LEXICONS = {
    // Camera movements
    cameraMovements: [
        { id: 'static_wide', label: 'Static Wide', text_en: 'static wide shot, locked camera', tags: ['static', 'wide'], settings: ['studio', 'outdoor'] },
        { id: 'static_medium', label: 'Static Medium', text_en: 'static medium shot, stable framing', tags: ['static', 'medium'], settings: ['all'] },
        { id: 'slow_dolly_in', label: 'Slow Dolly In', text_en: 'slow dolly forward, gradually closing distance', tags: ['dolly', 'slow'], settings: ['all'] },
        { id: 'slow_dolly_out', label: 'Slow Dolly Out', text_en: 'slow dolly backward, revealing full scene', tags: ['dolly', 'slow'], settings: ['all'] },
        { id: 'slow_pan_left', label: 'Slow Pan Left', text_en: 'slow pan left, following subject', tags: ['pan', 'slow'], settings: ['all'] },
        { id: 'slow_pan_right', label: 'Slow Pan Right', text_en: 'slow pan right, following subject', tags: ['pan', 'slow'], settings: ['all'] },
        { id: 'tracking_follow', label: 'Tracking Follow', text_en: 'tracking shot following subject movement', tags: ['tracking', 'dynamic'], settings: ['corridor', 'outdoor', 'studio'] },
        { id: 'orbit_around', label: 'Slow Orbit', text_en: 'slow orbit around subject, 180-degree arc', tags: ['orbit', 'cinematic'], settings: ['studio', 'minimal'] },
        { id: 'tilt_up', label: 'Slow Tilt Up', text_en: 'slow tilt up from feet to face', tags: ['tilt', 'reveal'], settings: ['all'] },
        { id: 'tilt_down', label: 'Slow Tilt Down', text_en: 'slow tilt down from face to full body', tags: ['tilt', 'reveal'], settings: ['all'] },
        { id: 'push_in_face', label: 'Push In to Face', text_en: 'slow push in ending on face close-up', tags: ['push', 'intimate'], settings: ['all'] },
        { id: 'crane_down', label: 'Crane Down', text_en: 'crane shot descending to eye level', tags: ['crane', 'cinematic'], settings: ['studio', 'penthouse'] }
    ],

    // Subject motions based on starting pose
    subjectMotions: {
        standing: [
            { id: 'subtle_sway', label: 'Subtle Sway', text_en: 'subtle weight shift and gentle sway', intensity: 'subtle' },
            { id: 'turn_head', label: 'Turn Head', text_en: 'slowly turns head toward camera with eye contact', intensity: 'subtle' },
            { id: 'hair_touch', label: 'Touch Hair', text_en: 'reaches up to touch hair, exposing neck', intensity: 'moderate' },
            { id: 'walk_toward', label: 'Walk Toward', text_en: 'begins walking toward camera with confident stride', intensity: 'dynamic' },
            { id: 'walk_away_look', label: 'Walk Away + Look', text_en: 'walks away then looks back over shoulder', intensity: 'dynamic' },
            { id: 'slow_turn', label: 'Slow Turn', text_en: 'slow 180-degree turn, showing full silhouette', intensity: 'moderate' },
            { id: 'hip_shift', label: 'Hip Shift', text_en: 'shifts weight to one hip with subtle pose change', intensity: 'subtle' },
            { id: 'step_forward', label: 'Step Forward', text_en: 'takes one deliberate step toward camera', intensity: 'moderate' }
        ],
        walking: [
            { id: 'continue_walk', label: 'Continue Walk', text_en: 'continues confident runway walk toward camera', intensity: 'dynamic' },
            { id: 'slow_to_stop', label: 'Slow to Stop', text_en: 'gradually slows to a stop, striking a pose', intensity: 'moderate' },
            { id: 'walk_past', label: 'Walk Past Camera', text_en: 'walks past camera with brief eye contact', intensity: 'dynamic' },
            { id: 'turn_walk_back', label: 'Turn and Walk Back', text_en: 'turns around and walks back toward camera', intensity: 'dynamic' }
        ],
        seated: [
            { id: 'subtle_move', label: 'Subtle Movement', text_en: 'subtle seated movement, adjusting position', intensity: 'subtle' },
            { id: 'turn_to_camera', label: 'Turn to Camera', text_en: 'turns upper body toward camera', intensity: 'moderate' },
            { id: 'stand_up', label: 'Rise Up', text_en: 'gracefully rises from seated position', intensity: 'dynamic' },
            { id: 'cross_legs', label: 'Cross Legs', text_en: 'slowly crosses legs with deliberate movement', intensity: 'moderate' },
            { id: 'lean_back', label: 'Lean Back', text_en: 'leans back with relaxed sensual pose', intensity: 'moderate' }
        ],
        leaning: [
            { id: 'push_off', label: 'Push Off Wall', text_en: 'pushes off from wall into standing position', intensity: 'moderate' },
            { id: 'head_tilt', label: 'Head Tilt', text_en: 'tilts head with subtle knowing expression', intensity: 'subtle' },
            { id: 'shift_lean', label: 'Shift Lean', text_en: 'shifts leaning position, changing weight', intensity: 'subtle' }
        ],
        laying: [
            { id: 'subtle_stretch', label: 'Subtle Stretch', text_en: 'subtle sensual stretch while laying', intensity: 'subtle' },
            { id: 'turn_head', label: 'Turn Head', text_en: 'slowly turns head toward camera', intensity: 'subtle' },
            { id: 'rise_up', label: 'Rise to Elbow', text_en: 'rises onto elbow, looking at camera', intensity: 'moderate' },
            { id: 'roll_position', label: 'Roll Position', text_en: 'slowly rolls to different position', intensity: 'moderate' }
        ]
    },

    // Motion qualities
    motionQualities: [
        { id: 'smooth_fluid', label: 'Smooth & Fluid', text_en: 'smooth fluid movement, graceful transitions', boldness: [0, 1, 2, 3] },
        { id: 'slow_deliberate', label: 'Slow & Deliberate', text_en: 'slow deliberate movement, controlled pacing', boldness: [0, 1, 2, 3] },
        { id: 'elegant_refined', label: 'Elegant & Refined', text_en: 'elegant refined motion, balletic quality', boldness: [0, 1] },
        { id: 'sensual_languid', label: 'Sensual & Languid', text_en: 'sensual languid movement, lingering motion', boldness: [2, 3] },
        { id: 'confident_powerful', label: 'Confident & Powerful', text_en: 'confident powerful movement, commanding presence', boldness: [1, 2, 3] },
        { id: 'playful_teasing', label: 'Playful & Teasing', text_en: 'playful teasing movement, flirtatious energy', boldness: [1, 2] },
        { id: 'mysterious_slow', label: 'Mysterious & Slow', text_en: 'mysterious slow movement, cinematic tension', boldness: [2, 3] }
    ],

    // Atmosphere/mood for video
    videoAtmosphere: [
        { id: 'cinematic_tension', label: 'Cinematic Tension', text_en: 'cinematic tension, dramatic pacing' },
        { id: 'intimate_mood', label: 'Intimate Mood', text_en: 'intimate atmosphere, personal connection' },
        { id: 'editorial_energy', label: 'Editorial Energy', text_en: 'high-fashion editorial energy, runway confidence' },
        { id: 'dreamy_ethereal', label: 'Dreamy Ethereal', text_en: 'dreamy ethereal atmosphere, soft focus moments' },
        { id: 'bold_confident', label: 'Bold & Confident', text_en: 'bold confident atmosphere, unapologetic presence' },
        { id: 'sensual_allure', label: 'Sensual Allure', text_en: 'sensual alluring atmosphere, magnetic presence' },
        { id: 'noir_mystery', label: 'Noir Mystery', text_en: 'noir mysterious atmosphere, shadows and intrigue' }
    ]
};

// ============================================================================
// HAIR COLOR LOCK — Keeps archetype consistency
// ============================================================================

const HAIR_COLOR_NEGATIVES = {
    blonde: 'No brunette hair, no black hair, no red hair, no dark hair.',
    dirty_blonde: 'No brunette hair, no black hair, no red hair.',
    brunette: 'No blonde hair, no red hair.',
    redhead: 'No blonde hair, no brunette hair, no black hair.',
    black: 'No blonde hair, no red hair, no brown hair.'
};

function buildHairColorLock(archetype) {
    const hairColor = archetype?.hairColor;
    const hairShade = archetype?.hairShade;
    if (!hairColor || !hairShade) return null;

    const negative = HAIR_COLOR_NEGATIVES[hairColor];
    if (!negative) return null;

    return {
        positive: `Hair color: ${hairShade} hair (keep hair color consistent throughout).`,
        negative
    };
}

// ============================================================================
// SAFETY FILTER
// ============================================================================

class SafetyFilter {
    static FORBIDDEN_NAMES = /\b(a-la|look like|looks like|similar to|resembling|in the style of)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/gi;
    static MINORS = [/\bteen(?:ager|age)?\b/gi, /\bschool(?:girl|boy|kid|child)\b/gi, /\byoung\s+(?:girl|boy|kid|child|looking)\b/gi, /\bunderage\b/gi, /\bminor\b/gi, /\bvery\s+young\b/gi];
    // NOTE: Be careful not to destroy safe disclaimers like "non-explicit" or "no sexual act"
    static EXPLICIT_WORDS = /\b(explicit|genital(?:s)?|porn(?:ographic)?|xxx)\b/gi;
    static SEXUAL_ACT = /\bsexual\s+act(?:s)?\b/gi;

    static filter(input) {
        const warnings = [];
        let text = input;
        let blocked = false;

        // NOTE: Avoid RegExp.test() on global regexes (stateful lastIndex)
        const afterNames = text.replace(this.FORBIDDEN_NAMES, 'glamour archetype');
        if (afterNames !== text) {
            text = afterNames;
            warnings.push('Look-alike references removed.');
            blocked = true;
        }

        let minorsRemoved = false;
        for (const pattern of this.MINORS) {
            const after = text.replace(pattern, '');
            if (after !== text) {
                text = after;
                minorsRemoved = true;
                blocked = true;
            }
        }
        if (minorsRemoved) warnings.push('Minors references removed.');

        let explicitRemoved = false;
        // Remove explicit terms, but keep negated/safe contexts like:
        // - "non-explicit"
        // - "no explicit nudity"
        // - "no sexual act"
        text = text.replace(this.EXPLICIT_WORDS, (match, _group, offset, str) => {
            const lower = match.toLowerCase();
            const prev3 = str.slice(Math.max(0, offset - 3), offset).toLowerCase(); // "no "
            const prev4 = str.slice(Math.max(0, offset - 4), offset).toLowerCase(); // "non-" / "not "
            const prev5 = str.slice(Math.max(0, offset - 5), offset).toLowerCase(); // "non "

            const isNegated = prev3 === 'no ' || prev4 === 'not ';

            // Keep "non-explicit" and similar safe phrasing
            if (lower === 'explicit' && (prev4 === 'non-' || prev5 === 'non ' || isNegated)) return match;

            // Keep "no porn", "no xxx", etc.
            if (lower !== 'explicit' && isNegated) return match;

            explicitRemoved = true;
                blocked = true;
            return '';
        });

        text = text.replace(this.SEXUAL_ACT, (match, offset, str) => {
            const prev3 = str.slice(Math.max(0, offset - 3), offset).toLowerCase(); // "no "
            const prev4 = str.slice(Math.max(0, offset - 4), offset).toLowerCase(); // "not "
            const isNegated = prev3 === 'no ' || prev4 === 'not ';
            if (isNegated) return match;
            explicitRemoved = true;
            blocked = true;
            return '';
        });
        if (explicitRemoved) warnings.push('Explicit content removed.');

        // Normalize spaces but preserve newlines
        const sanitized = text
            .split('\n')
            .map(line => line.replace(/[ \t]+/g, ' ').trim())
            .filter(line => line.length > 0)
            .join('\n');
        return { sanitized, blocked, warnings };
    }
}

// ============================================================================
// SEEDED RNG
// ============================================================================

class SeededRNG {
    constructor(seed) {
        this.seed = seed ?? Math.floor(Math.random() * 1000000);
    }

    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    pick(array) {
        return array[Math.floor(this.next() * array.length)];
    }

    pickWeighted(array, getWeight) {
        if (!Array.isArray(array) || array.length === 0) return null;
        if (typeof getWeight !== 'function') return this.pick(array);

        let total = 0;
        const weights = array.map(item => {
            const raw = getWeight(item);
            const w = Number.isFinite(raw) ? Math.max(0, raw) : 0;
            total += w;
            return w;
        });

        if (total <= 0) return this.pick(array);

        let r = this.next() * total;
        for (let i = 0; i < array.length; i++) {
            r -= weights[i];
            if (r <= 0) return array[i];
        }
        return array[array.length - 1];
    }

    getSeed() {
        return this.seed;
    }
}

// ============================================================================
// PROMPT GENERATOR
// ============================================================================

class PromptGenerator {
    constructor() {
        this.rng = new SeededRNG();
    }

    normalizeBoldness(value) {
        return clampBoldnessIndex(value);
    }

    weightByTags(item, boldness, tagKeys = []) {
        if (!item) return 1;
        const b = this.normalizeBoldness(boldness);
        let w = 1;
        const tags = Array.isArray(item.tags) ? item.tags : [];

        for (const key of tagKeys) {
            if (!tags.includes(key)) continue;
            const mult = TAG_WEIGHT_MULTIPLIERS[key]?.[b];
            if (Number.isFinite(mult)) w *= mult;
        }

        return w;
    }

    weightMakeup(makeup, boldness) {
        if (!makeup) return 1;
        const b = this.normalizeBoldness(boldness);
        let w = this.weightByTags(makeup, b, ['hot', 'bold', 'noir', 'sexy']);

        // Prefer more "night/noir/statement" as boldness grows, but keep it non-blocking (weights only)
        const cat = makeup.category;
        if (cat === 'Natural & Fresh') w *= [1.6, 1.2, 0.9, 0.6, 0.5][b];
        if (cat === 'Classic Glam') w *= [1.2, 1.1, 1.0, 1.0, 1.0][b];
        if (cat === 'Night & Smoky') w *= [0.4, 0.8, 1.2, 1.6, 2.0][b];
        if (cat === 'Editorial') w *= [1.0, 1.0, 1.1, 1.25, 1.35][b];
        if (cat === 'Chic / Vintage') w *= [1.1, 1.1, 1.0, 0.9, 0.8][b];
        if (cat === 'Noir / Statement') w *= [0.5, 0.8, 1.1, 1.6, 2.0][b];

        if (makeup.id === 'auto') w *= 0.55;
        return w;
    }

    weightHair(hair, boldness) {
        if (!hair) return 1;
        const b = this.normalizeBoldness(boldness);
        let w = this.weightByTags(hair, b, ['hot', 'bold', 'sexy', 'edgy']);
        if (hair.id === 'auto') w *= 0.65;
        return w;
    }

    weightOutfit(outfit, boldness) {
        if (!outfit) return 1;
        const b = this.normalizeBoldness(boldness);
        return this.weightByTags(outfit, b, ['hot', 'bold', 'sexy', 'edgy']);
    }

    weightMaterial(material, boldness) {
        if (!material) return 1;
        const b = this.normalizeBoldness(boldness);
        let w = this.weightByTags(material, b, ['bold', 'edgy']);

        // Softer fabrics at low boldness, edgier/glossy at high boldness
        if (material.id === 'cotton') w *= [1.4, 1.2, 1.0, 0.7, 0.6][b];
        if (material.id === 'lace') w *= [1.2, 1.1, 1.0, 0.95, 0.9][b];
        if (material.id === 'latex' || material.id === 'leather' || material.id === 'pvc') w *= [0.35, 0.7, 1.1, 1.6, 2.0][b];
        if (material.finish === 'sparkle') w *= [0.7, 0.9, 1.1, 1.3, 1.45][b];

        return w;
    }

    weightHosiery(hosiery, boldness) {
        if (!hosiery) return 1;
        const b = this.normalizeBoldness(boldness);
        let w = this.weightByTags(hosiery, b, ['hot', 'bold', 'sexy']);
        if (hosiery.id === 'none') w *= [1.3, 1.1, 0.95, 0.8, 0.7][b];
        return w;
    }

    weightFootwear(footwear, boldness) {
        if (!footwear) return 1;
        const b = this.normalizeBoldness(boldness);
        return this.weightByTags(footwear, b, ['hot', 'bold', 'sexy', 'edgy']);
    }

    weightAccessories(accessories, boldness) {
        if (!accessories) return 1;
        const b = this.normalizeBoldness(boldness);
        let w = this.weightByTags(accessories, b, ['hot', 'bold', 'sexy', 'edgy']);
        if (accessories.id === 'none') w *= [1.2, 1.05, 0.95, 0.85, 0.8][b];
        return w;
    }

    weightLighting(lighting, boldness) {
        if (!lighting) return 1;
        const b = this.normalizeBoldness(boldness);
        let w = 1;

        // Category bias: more dramatic/artistic as boldness grows
        if (lighting.category === 'Soft') w *= [1.6, 1.35, 1.0, 0.8, 0.7][b];
        if (lighting.category === 'Natural') w *= [1.2, 1.1, 1.0, 0.9, 0.85][b];
        if (lighting.category === 'Dramatic') w *= [0.85, 1.0, 1.2, 1.5, 1.7][b];
        if (lighting.category === 'Artistic') w *= [0.75, 0.9, 1.1, 1.4, 1.6][b];

        // Tag bias
        const tags = Array.isArray(lighting.tags) ? lighting.tags : [];
        if (tags.includes('low_key')) w *= [0.8, 1.0, 1.15, 1.35, 1.5][b];
        if (tags.includes('neon')) w *= [0.6, 0.9, 1.1, 1.25, 1.35][b];
        if (tags.includes('backlight')) w *= [0.9, 1.0, 1.05, 1.12, 1.15][b];
        if (tags.includes('silhouette')) w *= 0.85; // keep a bit rarer (artifact-prone)

        return w;
    }

    weightArtDirection(artDirection, boldness) {
        if (!artDirection) return 1;
        const b = this.normalizeBoldness(boldness);
        let w = this.weightByTags(artDirection, b, ['hot', 'bold', 'edgy', 'noir']);

        const tags = Array.isArray(artDirection.tags) ? artDirection.tags : [];
        if (tags.includes('night')) w *= [0.8, 1.0, 1.15, 1.25, 1.35][b];
        if (tags.includes('cinematic')) w *= [0.9, 1.0, 1.1, 1.2, 1.25][b];
        if (tags.includes('seductive') || tags.includes('sultry')) w *= [0.6, 0.9, 1.15, 1.45, 1.65][b];
        if (tags.includes('intimate')) w *= [0.9, 1.0, 1.1, 1.15, 1.2][b];

        return w;
    }

    weightPose(pose, boldness) {
        if (!pose) return 1;
        const b = this.normalizeBoldness(boldness);
        // Pose tags already encode vibe; bias gently
        let w = this.weightByTags(pose, b, ['sexy', 'bold']);
        const tags = Array.isArray(pose.tags) ? pose.tags : [];
        if (tags.includes('teasing')) w *= [1.0, 1.2, 1.1, 1.0, 1.0][b];
        if (tags.includes('power')) w *= [0.9, 1.0, 1.1, 1.25, 1.35][b];
        return w;
    }

    weightColorGrade(colorGrade, boldness) {
        if (!colorGrade) return 1;
        const b = this.normalizeBoldness(boldness);
        let w = 1;
        const tags = Array.isArray(colorGrade.tags) ? colorGrade.tags : [];
        if (tags.includes('natural')) w *= [1.2, 1.1, 1.0, 0.9, 0.85][b];
        if (tags.includes('contrast') || tags.includes('punchy')) w *= [0.85, 1.0, 1.15, 1.3, 1.4][b];
        if (tags.includes('glossy') || tags.includes('magazine')) w *= [0.8, 1.0, 1.1, 1.2, 1.3][b];
        if (tags.includes('matte') || tags.includes('editorial')) w *= [1.0, 1.0, 1.05, 1.1, 1.12][b];
        if (tags.includes('bw') || tags.includes('monochrome')) w *= [0.95, 1.0, 1.05, 1.1, 1.15][b];
        return w;
    }

    weightArchetype(archetype, boldness) {
        if (!archetype) return 1;
        // "hot" archetypes more common at higher boldness, but still allow variety
        return this.weightByTags(archetype, boldness, ['hot', 'sexy', 'noir', 'edgy', 'bold']);
    }

    generate(state) {
        const promptParts = [];
        const negativeParts = [];

        // 1. FRAMING
        if (state.enforceFullLength) {
            promptParts.push('FULL-LENGTH LONG SHOT, head-to-toe full body in frame, feet visible, shoes/boots visible, include floor, camera pulled back, wide framing, leave margin above head and below feet.');
        }

        // 2. ART DIRECTION
        const artDirection = this.findById(LEXICONS.artDirections, state.artDirection);
        if (artDirection) {
            promptParts.push(artDirection.text_en);
        }

        // 3. BOLDNESS MODIFIER
        const boldnessLevel = BOLDNESS_LEVELS[state.boldness] || BOLDNESS_LEVELS[1];
        promptParts.push(boldnessLevel.modifier);

        // 4. SUBJECT
        const archetype = this.findById(LEXICONS.archetypes, state.archetype);
        if (archetype) {
            promptParts.push(`adult woman (25+), ${archetype.text_en}`);
            
            // 5. HAIR COLOR LOCK
            const hairLock = buildHairColorLock(archetype);
            if (hairLock) {
                promptParts.push(hairLock.positive);
                negativeParts.push(hairLock.negative);
            }
        } else {
            promptParts.push('adult woman (25+)');
        }

        // 6. HAIR (auto -> from archetype defaults)
        const hairSelected = this.findById(LEXICONS.hair, state.hair);
        const hairResolved = this.resolveAutoChoice(hairSelected, archetype?.defaultHair, LEXICONS.hair);
        if (hairResolved && hairResolved.text_en) {
            promptParts.push(`Hair: ${hairResolved.text_en}`);
        }

        // 7. MAKEUP (auto -> from archetype defaults)
        const makeupSelected = this.findById(LEXICONS.makeup, state.makeup);
        const makeupResolved = this.resolveAutoChoice(makeupSelected, archetype?.defaultMakeup, LEXICONS.makeup);
        if (makeupResolved && makeupResolved.text_en) {
            promptParts.push(`Makeup: ${makeupResolved.text_en}`);
        }

        // 7.5 ACCESSORIES
        const accessories = this.findById(LEXICONS.accessories, state.accessories);
        if (accessories && accessories.id !== 'none' && accessories.text_en) {
            promptParts.push(`Accessories: ${accessories.text_en}`);
        }

        // 8. WARDROBE ASSEMBLY
        const wardrobeParts = this.assembleWardrobe(state);
        if (wardrobeParts) {
            promptParts.push(`Wardrobe: ${wardrobeParts}`);
        }

        // 9. SCENE
        const setting = this.findById(LEXICONS.settings, state.setting);
        if (setting) {
            promptParts.push(`Scene: ${setting.text_en}`);
        }

        // 10. POSE
        const pose = this.findById(LEXICONS.poses, state.pose);
        if (pose) {
            promptParts.push(`Pose: ${pose.text_en}`);
        }

        // 11. LIGHTING
        const lighting = this.findById(LEXICONS.lighting, state.lighting);
        if (lighting) {
            promptParts.push(`Lighting: ${lighting.text_en}`);
        }

        // 12. CAMERA
        const camera = this.findById(LEXICONS.camera, state.camera);
        if (camera) {
            promptParts.push(`Camera: ${camera.text_en}`);
        }

        // 13. COLOR GRADE
        const colorGrade = this.findById(LEXICONS.colorGrades, state.colorGrade);
        if (colorGrade) {
            promptParts.push(colorGrade.text_en);
        }

        // BUILD NEGATIVE
        negativeParts.push('No explicit nudity, no sexual act, no minors.');
        negativeParts.push('No overweight, no obese, no plus-size.');

        // Backlight-heavy setups sometimes create a weird glow/outline "cutout" around the subject
        if (lighting && Array.isArray(lighting.tags) && (lighting.tags.includes('backlight') || lighting.tags.includes('silhouette'))) {
            negativeParts.push('No halo, no glowing outline, no aura, no edge glow, no cutout silhouette, no light bleed.');
        }
        
        if (state.enforceFullLength) {
            negativeParts.push('No close-up, no portrait crop, no half-body, no cropped head, no cropped feet, no out-of-frame shoes/boots.');
        }
        
        negativeParts.push('No text, no watermark, no logos.');
        negativeParts.push('No extra fingers/limbs, no warped hands, no distorted face, no blur, no low-res, no plastic skin.');

        // Join with newlines for readability (each part on new line)
        const promptText = promptParts.join('\n');
        const negativeText = negativeParts.join('\n');
        
        const safetyResult = SafetyFilter.filter(promptText);

        return {
            prompt_text: safetyResult.sanitized,
            negative_text: negativeText,
            metadata: {
                engine: state.engine,
                format: state.format,
                boldness: boldnessLevel.badge,
                enforceFullLength: state.enforceFullLength,
                selections: { ...state },
                seed: this.rng.getSeed(),
                timestamp: new Date().toISOString()
            },
            warnings: safetyResult.warnings
        };
    }

    resolveAutoChoice(selectedItem, defaultIds, lexiconArray) {
        if (!selectedItem) return null;
        if (selectedItem.id !== 'auto') return selectedItem;
        if (!defaultIds || defaultIds.length === 0) return null;
        const resolved = this.findById(lexiconArray, defaultIds[0]);
        return resolved || null;
    }

    assembleWardrobe(state) {
        const parts = [];

        // Color + Material + Outfit
        const color = this.findById(LEXICONS.colors, state.color);
        const material = this.findById(LEXICONS.materials, state.material);
        const outfit = this.findById(LEXICONS.outfits, state.outfit);

        if (outfit) {
            let outfitText = '';
            if (color) outfitText += color.text_en + ' ';
            if (material) outfitText += material.text_en + ' ';
            outfitText += outfit.text_en;
            parts.push(outfitText.trim());
        }

        // Hosiery
        const hosiery = this.findById(LEXICONS.hosiery, state.hosiery);
        if (hosiery && hosiery.id !== 'none' && hosiery.text_en) {
            // Add color to hosiery if black stockings
            const hosieryColor = (state.color === 'black' || state.color === 'nude') ? state.color : 'black';
            const hosieryColorText = this.findById(LEXICONS.colors, hosieryColor);
            if (hosieryColorText) {
                parts.push(`${hosieryColorText.text_en} ${hosiery.text_en}`);
            } else {
                parts.push(hosiery.text_en);
            }
        }

        // Footwear
        const footwear = this.findById(LEXICONS.footwear, state.footwear);
        if (footwear) {
            // Determine footwear color based on outfit color
            const footwearColor = (state.color === 'nude' || state.color === 'ivory') ? 'nude' : 'black';
            const footwearColorText = this.findById(LEXICONS.colors, footwearColor);
            if (footwearColorText) {
                parts.push(`${footwearColorText.text_en} ${footwear.text_en}`);
            } else {
                parts.push(footwear.text_en);
            }
        }

        return parts.join(', ');
    }

    findById(array, id) {
        return array.find(item => item.id === id);
    }

    randomize() {
        const boldness = this.normalizeBoldness(1);
        return this.randomizeWithBoldness(boldness);
    }

    randomizeWithBoldness(boldness) {
        const b = this.normalizeBoldness(boldness);
        return {
            archetype: this.rng.pickWeighted(LEXICONS.archetypes, a => this.weightArchetype(a, b)).id,
            hair: this.rng.pickWeighted(LEXICONS.hair, h => this.weightHair(h, b)).id,
            makeup: this.rng.pickWeighted(LEXICONS.makeup, m => this.weightMakeup(m, b)).id,
            outfit: this.rng.pickWeighted(LEXICONS.outfits, o => this.weightOutfit(o, b)).id,
            color: this.rng.pick(LEXICONS.colors).id,
            material: this.rng.pickWeighted(LEXICONS.materials, m => this.weightMaterial(m, b)).id,
            accessories: this.rng.pickWeighted(LEXICONS.accessories, a => this.weightAccessories(a, b)).id,
            hosiery: this.rng.pickWeighted(LEXICONS.hosiery, h => this.weightHosiery(h, b)).id,
            footwear: this.rng.pickWeighted(LEXICONS.footwear, f => this.weightFootwear(f, b)).id,
            setting: this.rng.pick(LEXICONS.settings).id,
            artDirection: this.rng.pickWeighted(LEXICONS.artDirections, a => this.weightArtDirection(a, b)).id,
            pose: this.rng.pickWeighted(LEXICONS.poses, p => this.weightPose(p, b)).id,
            lighting: this.rng.pickWeighted(LEXICONS.lighting, l => this.weightLighting(l, b)).id,
            camera: this.rng.pick(LEXICONS.camera).id,
            colorGrade: this.rng.pickWeighted(LEXICONS.colorGrades, cg => this.weightColorGrade(cg, b)).id
        };
    }

    // Randomize only look (outfit, material, hosiery, footwear)
    randomizeLook() {
        const boldness = this.normalizeBoldness(1);
        return this.randomizeLookWithBoldness(boldness);
    }

    randomizeLookWithBoldness(boldness) {
        const b = this.normalizeBoldness(boldness);
        return {
            outfit: this.rng.pickWeighted(LEXICONS.outfits, o => this.weightOutfit(o, b)).id,
            material: this.rng.pickWeighted(LEXICONS.materials, m => this.weightMaterial(m, b)).id,
            accessories: this.rng.pickWeighted(LEXICONS.accessories, a => this.weightAccessories(a, b)).id,
            hosiery: this.rng.pickWeighted(LEXICONS.hosiery, h => this.weightHosiery(h, b)).id,
            footwear: this.rng.pickWeighted(LEXICONS.footwear, f => this.weightFootwear(f, b)).id
        };
    }

    // Randomize only scene (setting, art direction, pose, lighting, camera, color grade)
    randomizeScene() {
        const boldness = this.normalizeBoldness(1);
        return this.randomizeSceneWithBoldness(boldness);
    }

    randomizeSceneWithBoldness(boldness) {
        const b = this.normalizeBoldness(boldness);
        return {
            setting: this.rng.pick(LEXICONS.settings).id,
            artDirection: this.rng.pickWeighted(LEXICONS.artDirections, a => this.weightArtDirection(a, b)).id,
            pose: this.rng.pickWeighted(LEXICONS.poses, p => this.weightPose(p, b)).id,
            lighting: this.rng.pickWeighted(LEXICONS.lighting, l => this.weightLighting(l, b)).id,
            camera: this.rng.pick(LEXICONS.camera).id,
            colorGrade: this.rng.pickWeighted(LEXICONS.colorGrades, cg => this.weightColorGrade(cg, b)).id
        };
    }
}

// ============================================================================
// VIDEO PROMPT GENERATOR
// ============================================================================

class VideoPromptGenerator {
    constructor() {
        this.rng = new SeededRNG();
    }

    generate(imageState, videoOptions = {}) {
        const pose = this.findById(LEXICONS.poses, imageState.pose);
        const setting = this.findById(LEXICONS.settings, imageState.setting);
        const archetype = this.findById(LEXICONS.archetypes, imageState.archetype);
        const boldness = parseInt(imageState.boldness) || 1;

        // Determine pose category for motion selection
        const poseCategory = this.getPoseCategory(pose);
        
        // Select or generate components
        const cameraMovement = videoOptions.cameraMovement 
            ? this.findById(VIDEO_LEXICONS.cameraMovements, videoOptions.cameraMovement)
            : this.selectCameraMovement(setting, poseCategory);

        const subjectMotion = videoOptions.subjectMotion
            ? this.findMotion(poseCategory, videoOptions.subjectMotion)
            : this.selectSubjectMotion(poseCategory, boldness);

        const motionQuality = videoOptions.motionQuality
            ? this.findById(VIDEO_LEXICONS.motionQualities, videoOptions.motionQuality)
            : this.selectMotionQuality(boldness, archetype);

        const atmosphere = videoOptions.atmosphere
            ? this.findById(VIDEO_LEXICONS.videoAtmosphere, videoOptions.atmosphere)
            : this.selectAtmosphere(boldness, imageState.artDirection);

        // Build video prompt
        const promptParts = [];

        // Camera movement
        if (cameraMovement) {
            promptParts.push(`Camera: ${cameraMovement.text_en}`);
        }

        // Subject description (from image)
        const subjectDesc = this.buildSubjectDescription(imageState);
        promptParts.push(`Subject: ${subjectDesc}`);

        // Motion
        if (subjectMotion) {
            promptParts.push(`Action: ${subjectMotion.text_en}`);
        }

        // Motion quality
        if (motionQuality) {
            promptParts.push(`Motion: ${motionQuality.text_en}`);
        }

        // Atmosphere
        if (atmosphere) {
            promptParts.push(`Mood: ${atmosphere.text_en}`);
        }

        // Technical hints for video AI
        const technicalHints = this.getTechnicalHints(boldness);
        promptParts.push(technicalHints);

        return {
            video_prompt: promptParts.join('\n'),
            metadata: {
                cameraMovement: cameraMovement?.id,
                subjectMotion: subjectMotion?.id,
                motionQuality: motionQuality?.id,
                atmosphere: atmosphere?.id,
                poseCategory,
                boldness
            }
        };
    }

    getPoseCategory(pose) {
        if (!pose) return 'standing';
        
        const tags = pose.tags || [];
        if (tags.includes('walking')) return 'walking';
        if (tags.includes('seated') || tags.includes('lounging')) return 'seated';
        if (tags.includes('leaning')) return 'leaning';
        if (tags.includes('laying')) return 'laying';
        return 'standing';
    }

    selectCameraMovement(setting, poseCategory) {
        const movements = VIDEO_LEXICONS.cameraMovements;
        
        // Filter by setting compatibility
        const settingTags = setting?.tags || [];
        let compatible = movements.filter(m => {
            if (m.settings.includes('all')) return true;
            return m.settings.some(s => settingTags.includes(s));
        });

        if (compatible.length === 0) compatible = movements;

        // Prefer certain movements based on pose
        if (poseCategory === 'walking') {
            const trackingOptions = compatible.filter(m => m.tags.includes('tracking') || m.tags.includes('dolly'));
            if (trackingOptions.length > 0) compatible = trackingOptions;
        }

        return this.rng.pick(compatible);
    }

    selectSubjectMotion(poseCategory, boldness) {
        const motions = VIDEO_LEXICONS.subjectMotions[poseCategory] || VIDEO_LEXICONS.subjectMotions.standing;
        
        // For higher boldness, prefer more intense motions
        let filtered = motions;
        if (boldness >= 2) {
            const intense = motions.filter(m => m.intensity !== 'subtle');
            if (intense.length > 0) filtered = intense;
        }

        return this.rng.pick(filtered);
    }

    selectMotionQuality(boldness, archetype) {
        const qualities = VIDEO_LEXICONS.motionQualities;
        
        // Filter by boldness compatibility
        const compatible = qualities.filter(q => q.boldness.includes(boldness));
        
        return this.rng.pick(compatible.length > 0 ? compatible : qualities);
    }

    selectAtmosphere(boldness, artDirectionId) {
        const atmospheres = VIDEO_LEXICONS.videoAtmosphere;
        
        // Match atmosphere to boldness
        if (boldness >= 2) {
            const sensualOptions = atmospheres.filter(a => 
                a.id.includes('sensual') || a.id.includes('bold') || a.id.includes('intimate')
            );
            if (sensualOptions.length > 0) return this.rng.pick(sensualOptions);
        }

        return this.rng.pick(atmospheres);
    }

    buildSubjectDescription(state) {
        const parts = [];
        parts.push('adult woman (25+)');
        
        const archetype = this.findById(LEXICONS.archetypes, state.archetype);
        if (archetype) {
            if (archetype.hairShade) {
                parts.push(`${archetype.hairShade} hair`);
            }
            // Extract key physical traits
            parts.push(archetype.text_en.split(',').slice(0, 2).join(','));
        }

        const outfit = this.findById(LEXICONS.outfits, state.outfit);
        const color = this.findById(LEXICONS.colors, state.color);
        if (outfit && color) {
            parts.push(`wearing ${color.text_en} ${outfit.text_en}`);
        }

        const footwear = this.findById(LEXICONS.footwear, state.footwear);
        if (footwear) {
            parts.push(footwear.text_en);
        }

        return parts.join(', ');
    }

    getTechnicalHints(boldness) {
        const hints = [
            'consistent lighting throughout',
            'natural body movement',
            'stable motion, no jitter',
            'professional quality'
        ];

        if (boldness >= 2) {
            hints.push('sensual atmosphere');
            hints.push('lingering camera');
        }

        return `Technical: ${hints.join(', ')}`;
    }

    findMotion(poseCategory, motionId) {
        const motions = VIDEO_LEXICONS.subjectMotions[poseCategory] || [];
        return motions.find(m => m.id === motionId);
    }

    findById(array, id) {
        return array.find(item => item.id === id);
    }

    // Randomize video options
    randomize(imageState) {
        const pose = this.findById(LEXICONS.poses, imageState.pose);
        const poseCategory = this.getPoseCategory(pose);
        const boldness = parseInt(imageState.boldness) || 1;

        return {
            cameraMovement: this.rng.pick(VIDEO_LEXICONS.cameraMovements).id,
            subjectMotion: this.rng.pick(VIDEO_LEXICONS.subjectMotions[poseCategory] || VIDEO_LEXICONS.subjectMotions.standing).id,
            motionQuality: this.rng.pick(VIDEO_LEXICONS.motionQualities.filter(q => q.boldness.includes(boldness))).id,
            atmosphere: this.rng.pick(VIDEO_LEXICONS.videoAtmosphere).id
        };
    }
}

// ============================================================================
// ENGINE ADAPTERS
// ============================================================================

const ADAPTERS = {
    nano_banana: (result) => result,
    
    grok: (result) => {
        let promptText = result.prompt_text;
        let negativeText = result.negative_text;

        if (result.metadata.enforceFullLength) {
            const framingPrefix = 'FULL-LENGTH LONG SHOT, head-to-toe full body in frame, feet visible, shoes/boots visible, include floor, camera pulled back, wide framing, leave margin above head and below feet.';
            if (!promptText.startsWith('FULL-LENGTH')) {
                promptText = `${framingPrefix}\n${promptText}`;
            }
            const cropGuards = 'No close-up, no portrait crop, no half-body, no cropped head, no cropped feet, no out-of-frame shoes/boots.';
            if (!/no close-up/i.test(negativeText)) {
                negativeText = `${cropGuards}\n${negativeText}`;
            }
        }

        return { ...result, prompt_text: promptText, negative_text: negativeText };
    },

    midjourney: (result) => {
        // Midjourney format: prompt --ar 9:16 --no [negatives]
        // Convert multiline to single line for Midjourney
        const aspectRatios = {
            story_9x16: '9:16',
            ig_4x5: '4:5',
            square_1x1: '1:1',
            wide_16x9: '16:9',
            print_2x3: '2:3'
        };
        const ar = aspectRatios[result.metadata.format] || '9:16';
        const promptOneLine = result.prompt_text.replace(/\n/g, ' ');
        const negatives = result.negative_text.replace(/\n/g, ' ').replace(/No /gi, '').replace(/\./g, ', ').replace(/, $/, '');
        
        return {
            ...result,
            prompt_text: `${promptOneLine} --ar ${ar} --no ${negatives}`,
            negative_text: result.negative_text
        };
    },

    sdxl: (result) => result,
    generic: (result) => result
};

// ============================================================================
// UI CONTROLLER
// ============================================================================

class UIController {
    constructor() {
        this.generator = new PromptGenerator();
        this.videoGenerator = new VideoPromptGenerator();
        this.lastResult = null;
        this.lastVideoResult = null;
    }

    init() {
        this.populateSelectors();
        this.populateVideoSelectors();
        this.setupTabs();
        this.setupColorPalette();
        this.setupEventListeners();
        this.setupDefaults();
        this.updateCharacterHints();
        this.applyOutfitHeatFilter();
    }

    populateSelectors() {
        // Map module names to LEXICONS data
        const moduleMap = {
            archetype: LEXICONS.archetypes,
            hair: LEXICONS.hair,
            makeup: LEXICONS.makeup,
            outfit: LEXICONS.outfits,
            material: LEXICONS.materials,
            accessories: LEXICONS.accessories,
            hosiery: LEXICONS.hosiery,
            footwear: LEXICONS.footwear,
            setting: LEXICONS.settings,
            artDirection: LEXICONS.artDirections,
            pose: LEXICONS.poses,
            lighting: LEXICONS.lighting,
            camera: LEXICONS.camera,
            colorGrade: LEXICONS.colorGrades
        };

        // Initialize all custom dropdowns
        document.querySelectorAll('.custom-dropdown[data-module]').forEach(dropdown => {
            const moduleName = dropdown.dataset.module;
            const items = moduleMap[moduleName];
            if (items) {
                this.setupCustomDropdown(dropdown, moduleName, items);
            }
        });

        // Global click handler to close dropdowns
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-dropdown')) {
                document.querySelectorAll('.custom-dropdown.open').forEach(d => d.classList.remove('open'));
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.custom-dropdown.open').forEach(d => d.classList.remove('open'));
            }
        });
    }

    setupCustomDropdown(dropdown, moduleName, items) {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const panel = dropdown.querySelector('.dropdown-panel');
        const hiddenInput = document.getElementById(moduleName);
        
        if (!trigger || !panel || !hiddenInput) return;

        // Check if items have categories
        const hasCategories = items.some(item => item.category);

        panel.innerHTML = '';

        if (hasCategories) {
            // Group items by category
            const groups = {};
            items.forEach(item => {
                const cat = item.category || 'Other';
                if (!groups[cat]) groups[cat] = [];
                groups[cat].push(item);
            });

            // Build grouped panel
            Object.entries(groups).forEach(([category, groupItems]) => {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'dropdown-group';
                
                const labelDiv = document.createElement('div');
                labelDiv.className = 'dropdown-group-label';
                labelDiv.textContent = category;
                groupDiv.appendChild(labelDiv);
                
                const itemsDiv = document.createElement('div');
                itemsDiv.className = 'dropdown-group-items';
                
                groupItems.forEach(item => {
                    const itemDiv = this.createDropdownItem(item, dropdown, trigger, hiddenInput);
                    itemsDiv.appendChild(itemDiv);
                });
                
                groupDiv.appendChild(itemsDiv);
                panel.appendChild(groupDiv);
            });
        } else {
            // Flat list
            const itemsDiv = document.createElement('div');
            itemsDiv.className = 'dropdown-group-items';
            
            items.forEach(item => {
                const itemDiv = this.createDropdownItem(item, dropdown, trigger, hiddenInput);
                itemsDiv.appendChild(itemDiv);
            });
            
            panel.appendChild(itemsDiv);
        }

        // Set default selection (first item)
        const firstItem = items[0];
        if (firstItem) {
            hiddenInput.value = firstItem.id;
            trigger.querySelector('.dropdown-value').textContent = firstItem.label;
            const firstItemEl = panel.querySelector(`[data-value="${firstItem.id}"]`);
            if (firstItemEl) firstItemEl.classList.add('selected');
        }

        // Toggle dropdown with fixed positioning
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other dropdowns
            document.querySelectorAll('.custom-dropdown.open').forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('open');
                }
            });
            
            // Check if dropdown is opening
            if (!dropdown.classList.contains('open')) {
                this.positionDropdownPanel(trigger, panel);
            }
            
            dropdown.classList.toggle('open');
        });

        // Reposition on scroll
        const scrollContainer = document.querySelector('.controls-panel');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', () => {
                if (dropdown.classList.contains('open')) {
                    this.positionDropdownPanel(trigger, panel);
                }
            });
        }
    }

    positionDropdownPanel(trigger, panel) {
        const triggerRect = trigger.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 16;

        // Measure panel
        panel.style.visibility = 'hidden';
        panel.style.display = 'block';
        const panelWidth = panel.offsetWidth;
        const panelHeight = panel.offsetHeight;
        panel.style.display = '';
        panel.style.visibility = '';

        // Calculate vertical position
        let top;
        const spaceBelow = viewportHeight - triggerRect.bottom - padding;
        const spaceAbove = triggerRect.top - padding;

        if (spaceBelow >= panelHeight || spaceBelow >= spaceAbove) {
            // Open below
            top = triggerRect.bottom + 4;
        } else {
            // Open above
            top = triggerRect.top - panelHeight - 4;
        }

        // Calculate horizontal position
        let left = triggerRect.left;
        
        // If would overflow right, align to right edge of viewport
        if (left + panelWidth > viewportWidth - padding) {
            left = viewportWidth - panelWidth - padding;
        }
        
        // Ensure not going off left edge
        if (left < padding) {
            left = padding;
        }

        // Apply position
        panel.style.position = 'fixed';
        panel.style.top = `${top}px`;
        panel.style.left = `${left}px`;
        panel.style.maxWidth = `${viewportWidth - padding * 2}px`;
    }

    createDropdownItem(item, dropdown, trigger, hiddenInput) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'dropdown-item';
        const moduleName = hiddenInput?.id || dropdown?.dataset?.module || '';
        if (['outfit', 'hosiery', 'footwear', 'accessories'].includes(moduleName)) {
            const heat = getHeatLevel(item);
            itemDiv.dataset.heat = String(heat);
            if (heat > 0) itemDiv.classList.add(`heat-${heat}`);
        }
        itemDiv.dataset.value = item.id;
        itemDiv.textContent = item.label;
        
        itemDiv.addEventListener('click', () => {
            // Update selection
            dropdown.querySelectorAll('.dropdown-item').forEach(el => el.classList.remove('selected'));
            itemDiv.classList.add('selected');
            
            // Update hidden input and trigger text
            hiddenInput.value = item.id;
            trigger.querySelector('.dropdown-value').textContent = item.label;
            
            // Close dropdown
            dropdown.classList.remove('open');

            this.onSelectionChanged(hiddenInput.id);
        });
        
        return itemDiv;
    }

    populateVideoSelectors() {
        // Camera Movement
        const cameraSelect = document.getElementById('videoCameraMovement');
        if (cameraSelect) {
            cameraSelect.innerHTML = '<option value="">Auto (based on scene)</option>';
            VIDEO_LEXICONS.cameraMovements.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.label;
                cameraSelect.appendChild(option);
            });
        }

        // Motion Quality
        const qualitySelect = document.getElementById('videoMotionQuality');
        if (qualitySelect) {
            qualitySelect.innerHTML = '<option value="">Auto (based on boldness)</option>';
            VIDEO_LEXICONS.motionQualities.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.label;
                qualitySelect.appendChild(option);
            });
        }

        // Atmosphere
        const atmosphereSelect = document.getElementById('videoAtmosphere');
        if (atmosphereSelect) {
            atmosphereSelect.innerHTML = '<option value="">Auto (based on style)</option>';
            VIDEO_LEXICONS.videoAtmosphere.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.label;
                atmosphereSelect.appendChild(option);
            });
        }

        // Subject Motion - populated dynamically based on pose
        this.updateSubjectMotionOptions();
    }

    updateSubjectMotionOptions() {
        const motionSelect = document.getElementById('videoSubjectMotion');
        if (!motionSelect) return;

        const poseId = document.getElementById('pose')?.value;
        const pose = LEXICONS.poses.find(p => p.id === poseId);
        const poseCategory = this.videoGenerator.getPoseCategory(pose);
        const motions = VIDEO_LEXICONS.subjectMotions[poseCategory] || VIDEO_LEXICONS.subjectMotions.standing;

        motionSelect.innerHTML = '<option value="">Auto (based on pose)</option>';
        motions.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.label;
            motionSelect.appendChild(option);
        });
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;

                // Update buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update content
                tabContents.forEach(content => {
                    content.classList.toggle('active', content.id === `${targetTab}Tab`);
                });
            });
        });
    }

    setupColorPalette() {
        const palette = document.getElementById('colorPalette');
        const hiddenInput = document.getElementById('selectedColor');
        if (!palette) return;

        palette.innerHTML = '';
        LEXICONS.colors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.dataset.color = color.id;
            swatch.title = color.label;
            
            if (color.isPattern) {
                swatch.style.background = color.hex;
            } else {
                swatch.style.backgroundColor = color.hex;
            }
            
            if (color.id === 'black') {
                swatch.classList.add('selected');
            }

            swatch.addEventListener('click', () => {
                palette.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
                swatch.classList.add('selected');
                hiddenInput.value = color.id;
            });

            palette.appendChild(swatch);
        });
    }

    setupEventListeners() {
        // Engine change
        const engineSelect = document.getElementById('engine');
        const enforceCheckbox = document.getElementById('enforceFullLength');
        
        engineSelect.addEventListener('change', (e) => {
            if (CONFIG.enginesWithForcedFullLength.includes(e.target.value)) {
                enforceCheckbox.checked = true;
                enforceCheckbox.disabled = true;
            } else {
                enforceCheckbox.disabled = false;
            }
        });

        // Boldness slider
        const boldnessSlider = document.getElementById('boldness');
        const boldnessDisplay = document.getElementById('boldnessDisplay');
        const boldnessDescription = document.getElementById('boldnessDescription');

        boldnessSlider.addEventListener('input', (e) => {
            const level = BOLDNESS_LEVELS[parseInt(e.target.value)];
            boldnessDisplay.textContent = level.badge;
            boldnessDescription.textContent = level.modifier.split(',').slice(0, 2).join(', ');
        });

        // Outfit heat filter (hide non-hot options)
        const outfitHeatFilter = document.getElementById('outfitHeatFilter');
        if (outfitHeatFilter) {
            outfitHeatFilter.addEventListener('change', () => this.applyOutfitHeatFilter());
        }

        // Generate button
        document.getElementById('generateBtn').addEventListener('click', () => this.handleGenerate());
        
        // Randomize buttons
        document.getElementById('randomizeBtn').addEventListener('click', () => this.handleRandomize());
        document.getElementById('randomizeLookBtn').addEventListener('click', () => this.handleRandomizeLook());
        document.getElementById('randomizeSceneBtn').addEventListener('click', () => this.handleRandomizeScene());

        // Copy buttons
        document.getElementById('copyCombinedBtn').addEventListener('click', (e) => this.copyToClipboard('combinedOutput', e));
        document.getElementById('copyPromptBtn').addEventListener('click', (e) => this.copyToClipboard('promptOutput', e));
        document.getElementById('copyNegativeBtn').addEventListener('click', (e) => this.copyToClipboard('negativeOutput', e));

        // Video buttons
        document.getElementById('generateVideoBtn').addEventListener('click', () => this.handleGenerateVideo());
        document.getElementById('randomizeVideoBtn').addEventListener('click', () => this.handleRandomizeVideo());
        document.getElementById('copyVideoBtn').addEventListener('click', (e) => this.copyToClipboard('videoOutput', e));

        // Update subject motion options when pose changes
        const poseInput = document.getElementById('pose');
        if (poseInput) {
            // Use MutationObserver to detect value changes on hidden input
            const observer = new MutationObserver(() => this.updateSubjectMotionOptions());
            observer.observe(poseInput, { attributes: true, attributeFilter: ['value'] });
            
            // Also listen for custom dropdown selection
            const poseDropdown = document.querySelector('.custom-dropdown[data-module="pose"]');
            if (poseDropdown) {
                poseDropdown.addEventListener('click', () => {
                    setTimeout(() => this.updateSubjectMotionOptions(), 100);
                });
            }
        }

        // Export metadata
        document.getElementById('exportMetadataBtn').addEventListener('click', () => this.exportMetadata());

        // Style hints: apply suggestion chips (event delegation)
        const hints = document.getElementById('characterHints');
        if (hints) {
            hints.addEventListener('click', (e) => {
                const chip = e.target.closest('.hint-chip');
                if (!chip) return;
                const moduleName = chip.dataset.applyModule;
                const applyId = chip.dataset.applyId;
                if (!moduleName || !applyId) return;
                this.updateDropdownValue(moduleName, applyId);
                this.updateCharacterHints();
            });
        }

        // Collapsible sections
        document.querySelectorAll('.collapsible-section').forEach(section => {
            const header = section.querySelector('.section-header');
            if (header) {
                header.addEventListener('click', () => {
                    section.classList.toggle('collapsed');
                });
            }
        });
    }

    setupDefaults() {
        document.getElementById('engine').value = CONFIG.defaultEngine;
        document.getElementById('format').value = CONFIG.defaultFormat;
        document.getElementById('boldness').value = CONFIG.defaultBoldness;
        
        const level = BOLDNESS_LEVELS[CONFIG.defaultBoldness];
        document.getElementById('boldnessDisplay').textContent = level.badge;
        document.getElementById('boldnessDescription').textContent = level.modifier.split(',').slice(0, 2).join(', ');
    }

    getState() {
        return {
            engine: document.getElementById('engine').value,
            format: document.getElementById('format').value,
            enforceFullLength: document.getElementById('enforceFullLength').checked,
            boldness: parseInt(document.getElementById('boldness').value),
            archetype: document.getElementById('archetype').value,
            hair: document.getElementById('hair').value,
            makeup: document.getElementById('makeup').value,
            outfit: document.getElementById('outfit').value,
            color: document.getElementById('selectedColor').value,
            material: document.getElementById('material').value,
            accessories: document.getElementById('accessories')?.value || 'none',
            hosiery: document.getElementById('hosiery').value,
            footwear: document.getElementById('footwear').value,
            setting: document.getElementById('setting').value,
            artDirection: document.getElementById('artDirection').value,
            pose: document.getElementById('pose').value,
            lighting: document.getElementById('lighting').value,
            camera: document.getElementById('camera').value,
            colorGrade: document.getElementById('colorGrade').value
        };
    }

    handleGenerate() {
        const state = this.getState();
        
        // Force full-length for certain engines
        if (CONFIG.enginesWithForcedFullLength.includes(state.engine)) {
            state.enforceFullLength = true;
        }

        let result = this.generator.generate(state);

        // Apply engine adapter
        const adapter = ADAPTERS[state.engine] || ADAPTERS.generic;
        result = adapter(result);

        this.lastResult = result;
        this.displayResult(result);
    }

    handleRandomize() {
        const boldness = parseInt(document.getElementById('boldness')?.value) || 1;
        const randomSelections = this.generator.randomizeWithBoldness(boldness);

        // Apply to UI
        Object.entries(randomSelections).forEach(([key, value]) => {
            this.updateDropdownValue(key, value);
        });

        // Handle color palette
        const palette = document.getElementById('colorPalette');
        palette.querySelectorAll('.color-swatch').forEach(s => {
            s.classList.toggle('selected', s.dataset.color === randomSelections.color);
        });
        document.getElementById('selectedColor').value = randomSelections.color;

        // Generate with new settings
        this.handleGenerate();
    }

    handleRandomizeLook() {
        // Randomize only look (outfit, material, hosiery, footwear)
        const boldness = parseInt(document.getElementById('boldness')?.value) || 1;
        const randomSelections = this.generator.randomizeLookWithBoldness(boldness);

        // Apply to UI
        Object.entries(randomSelections).forEach(([key, value]) => {
            this.updateDropdownValue(key, value);
        });

        // Generate with new settings
        this.handleGenerate();
    }

    handleRandomizeScene() {
        // Randomize only scene (setting, pose, lighting, camera, etc.)
        const boldness = parseInt(document.getElementById('boldness')?.value) || 1;
        const randomSelections = this.generator.randomizeSceneWithBoldness(boldness);

        // Apply to UI
        Object.entries(randomSelections).forEach(([key, value]) => {
            this.updateDropdownValue(key, value);
        });

        // Generate with new settings
        this.handleGenerate();
    }

    handleGenerateVideo() {
        // First ensure we have image prompt generated
        if (!this.lastResult) {
            // Generate image prompt first
            this.handleGenerate();
        }

        const imageState = this.getState();
        
        // Get video options from UI
        const videoOptions = {
            cameraMovement: document.getElementById('videoCameraMovement')?.value || '',
            subjectMotion: document.getElementById('videoSubjectMotion')?.value || '',
            motionQuality: document.getElementById('videoMotionQuality')?.value || '',
            atmosphere: document.getElementById('videoAtmosphere')?.value || ''
        };

        const result = this.videoGenerator.generate(imageState, videoOptions);
        this.lastVideoResult = result;
        this.displayVideoResult(result);
    }

    handleRandomizeVideo() {
        const imageState = this.getState();
        const randomOptions = this.videoGenerator.randomize(imageState);

        // Apply to UI
        document.getElementById('videoCameraMovement').value = randomOptions.cameraMovement;
        document.getElementById('videoSubjectMotion').value = randomOptions.subjectMotion;
        document.getElementById('videoMotionQuality').value = randomOptions.motionQuality;
        document.getElementById('videoAtmosphere').value = randomOptions.atmosphere;

        // Generate video prompt
        this.handleGenerateVideo();
    }

    displayVideoResult(result) {
        // Hide placeholder, show result
        document.getElementById('videoPlaceholder').style.display = 'none';
        document.getElementById('videoResult').style.display = 'flex';

        // Set video prompt
        document.getElementById('videoOutput').value = result.video_prompt;
    }

    updateDropdownValue(moduleName, value) {
        // Find the dropdown by data-module attribute
        const dropdown = document.querySelector(`.custom-dropdown[data-module="${moduleName}"]`);
        const hiddenInput = document.getElementById(moduleName);
        
        if (!dropdown || !hiddenInput) return;

        const trigger = dropdown.querySelector('.dropdown-trigger');
        const panel = dropdown.querySelector('.dropdown-panel');

        // Update hidden input
        hiddenInput.value = value;

        // Find the item label from LEXICONS
        const moduleMap = {
            archetype: LEXICONS.archetypes,
            hair: LEXICONS.hair,
            makeup: LEXICONS.makeup,
            outfit: LEXICONS.outfits,
            material: LEXICONS.materials,
            accessories: LEXICONS.accessories,
            hosiery: LEXICONS.hosiery,
            footwear: LEXICONS.footwear,
            setting: LEXICONS.settings,
            artDirection: LEXICONS.artDirections,
            pose: LEXICONS.poses,
            lighting: LEXICONS.lighting,
            camera: LEXICONS.camera,
            colorGrade: LEXICONS.colorGrades
        };

        const items = moduleMap[moduleName];
        if (items) {
            const item = items.find(i => i.id === value);
            if (item && trigger) {
                trigger.querySelector('.dropdown-value').textContent = item.label;
            }
        }

        // Update selected state in panel
        if (panel) {
            panel.querySelectorAll('.dropdown-item').forEach(el => {
                el.classList.toggle('selected', el.dataset.value === value);
            });
        }

        this.onSelectionChanged(moduleName);
    }

    onSelectionChanged(moduleName) {
        if (moduleName === 'pose') {
            // Keep video subject motion options in sync (also works for Randomize Scene)
            this.updateSubjectMotionOptions();
        }
        if (moduleName === 'outfit') {
            this.applyOutfitHeatFilter();
        }
        if (moduleName === 'archetype' || moduleName === 'hair' || moduleName === 'makeup') {
            this.updateCharacterHints();
        }
    }

    applyOutfitHeatFilter() {
        const filter = document.getElementById('outfitHeatFilter')?.value || 'all';
        const threshold = filter === 'hot' ? 2 : filter === 'super' ? 3 : 0;

        const dropdown = document.querySelector('.custom-dropdown[data-module="outfit"]');
        const panel = dropdown?.querySelector('.dropdown-panel');
        const currentValue = document.getElementById('outfit')?.value || '';

        if (!panel) return;

        const applyToItem = (itemEl) => {
            const heat = parseInt(itemEl.dataset.heat || '0', 10);
            const value = itemEl.dataset.value || '';
            const shouldShow = value === currentValue || heat >= threshold;
            itemEl.style.display = shouldShow ? '' : 'none';
            return shouldShow;
        };

        const groups = panel.querySelectorAll('.dropdown-group');
        if (groups.length > 0) {
            groups.forEach(group => {
                const items = Array.from(group.querySelectorAll('.dropdown-item'));
                let anyVisible = false;
                for (const itemEl of items) {
                    if (applyToItem(itemEl)) anyVisible = true;
                }
                group.style.display = anyVisible ? '' : 'none';
            });
        } else {
            const items = Array.from(panel.querySelectorAll('.dropdown-item'));
            items.forEach(applyToItem);
        }
    }

    updateCharacterHints() {
        const container = document.getElementById('characterHints');
        if (!container) return;

        const archetypeId = document.getElementById('archetype')?.value;
        const hairId = document.getElementById('hair')?.value;
        const makeupId = document.getElementById('makeup')?.value;

        const archetype = this.generator.findById(LEXICONS.archetypes, archetypeId);
        const hairSelected = this.generator.findById(LEXICONS.hair, hairId);
        const makeupSelected = this.generator.findById(LEXICONS.makeup, makeupId);

        // Resolve Auto using archetype recommendations (same logic as generator)
        const hairResolved = this.generator.resolveAutoChoice(hairSelected, archetype?.defaultHair, LEXICONS.hair);
        const makeupResolved = this.generator.resolveAutoChoice(makeupSelected, archetype?.defaultMakeup, LEXICONS.makeup);

        if (!archetype || !hairResolved || !makeupResolved) {
            container.style.display = 'none';
            container.innerHTML = '';
            return;
        }

        const archetypeVibes = getArchetypeVibes(archetype);

        const hints = [];

        // Hair hint (manual only)
        if (hairSelected && hairSelected.id !== 'auto') {
            const recommendedHairIds = archetype.defaultHair || [];
            const isRecommended = recommendedHairIds.includes(hairResolved.id);

            const hairVibes = getHairVibes(hairResolved);
            const overlap = intersectCount(archetypeVibes, hairVibes);

            if (!isRecommended || overlap === 0) {
                const suggestions = this.getTopHairSuggestions(archetypeVibes, recommendedHairIds, hairResolved.id);
                hints.push({
                    icon: '✨',
                    title: 'Hair vibe note',
                    text: `Nice contrast. Archetype leans <strong>${formatVibes(archetypeVibes)}</strong>, while this hair reads <strong>${formatVibes(hairVibes) || 'neutral'}</strong>. If you want a more coherent archetype look:`,
                    chips: suggestions.map(h => ({ module: 'hair', id: h.id, label: h.label }))
                });
            }
        }

        // Makeup hint (manual only)
        if (makeupSelected && makeupSelected.id !== 'auto') {
            const recommendedMakeupIds = archetype.defaultMakeup || [];
            const isRecommended = recommendedMakeupIds.includes(makeupResolved.id);

            const makeupVibes = getMakeupVibes(makeupResolved);
            const overlap = intersectCount(archetypeVibes, makeupVibes);

            if (!isRecommended || overlap === 0) {
                const suggestions = this.getTopMakeupSuggestions(archetypeVibes, recommendedMakeupIds, makeupResolved.id);
                hints.push({
                    icon: '💫',
                    title: 'Makeup vibe note',
                    text: `This pairing is a bit more contrasty. Archetype leans <strong>${formatVibes(archetypeVibes)}</strong>, while this makeup reads <strong>${formatVibes(makeupVibes) || 'neutral'}</strong>. If you want it to feel more “one model”:`,
                    chips: suggestions.map(m => ({ module: 'makeup', id: m.id, label: m.label }))
                });
            }
        }

        if (hints.length === 0) {
            container.style.display = 'none';
            container.innerHTML = '';
            return;
        }

        container.style.display = 'block';
        container.innerHTML = `
            <div class="style-hints-header">
                <div class="style-hints-title">✨ Style hints</div>
                <div class="style-hints-subtitle">optional, non-blocking</div>
            </div>
            ${hints.map(h => `
                <div class="hint-item">
                    <div class="hint-icon">${h.icon}</div>
                    <div class="hint-content">
                        <div class="hint-title">${h.title}</div>
                        <div class="hint-text">${h.text}</div>
                        ${h.chips && h.chips.length > 0 ? `
                            <div class="hint-chips">
                                ${h.chips.map(c => `
                                    <button type="button" class="hint-chip" data-apply-module="${c.module}" data-apply-id="${c.id}">
                                        <span class="chip-action">Apply</span>
                                        <span>${c.label}</span>
                                    </button>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        `;
    }

    getTopHairSuggestions(archetypeVibes, recommendedIds, excludeId) {
        const candidates = LEXICONS.hair.filter(h => h.id !== 'auto' && h.id !== excludeId);
        const ranked = candidates
            .map(h => {
                const score = intersectCount(archetypeVibes, getHairVibes(h));
                const bonus = recommendedIds?.includes(h.id) ? 2 : 0;
                return { h, score: score + bonus };
            })
            .sort((a, b) => b.score - a.score);

        const out = [];
        for (const id of (recommendedIds || [])) {
            const item = candidates.find(h => h.id === id);
            if (item && item.id !== excludeId) out.push(item);
        }
        for (const r of ranked) {
            if (out.length >= 3) break;
            if (!out.some(x => x.id === r.h.id)) out.push(r.h);
        }
        return out.slice(0, 3);
    }

    getTopMakeupSuggestions(archetypeVibes, recommendedIds, excludeId) {
        const candidates = LEXICONS.makeup.filter(m => m.id !== 'auto' && m.id !== excludeId);
        const ranked = candidates
            .map(m => {
                const score = intersectCount(archetypeVibes, getMakeupVibes(m));
                const bonus = recommendedIds?.includes(m.id) ? 2 : 0;
                return { m, score: score + bonus };
            })
            .sort((a, b) => b.score - a.score);

        const out = [];
        for (const id of (recommendedIds || [])) {
            const item = candidates.find(m => m.id === id);
            if (item && item.id !== excludeId) out.push(item);
        }
        for (const r of ranked) {
            if (out.length >= 3) break;
            if (!out.some(x => x.id === r.m.id)) out.push(r.m);
        }
        return out.slice(0, 3);
    }

    displayResult(result) {
        document.getElementById('resultPlaceholder').style.display = 'none';
        document.getElementById('resultContent').style.display = 'flex';

        // Warnings
        const warningsDiv = document.getElementById('warnings');
        if (result.warnings && result.warnings.length > 0) {
            warningsDiv.style.display = 'block';
            warningsDiv.innerHTML = '<strong>⚠️ Warnings:</strong><ul>' + 
                result.warnings.map(w => `<li>${w}</li>`).join('') + '</ul>';
        } else {
            warningsDiv.style.display = 'none';
        }

        // Outputs
        const combined = result.prompt_text + '\n\n---\n\nNegative:\n' + result.negative_text;
        document.getElementById('combinedOutput').value = combined;
        document.getElementById('promptOutput').value = result.prompt_text;
        document.getElementById('negativeOutput').value = result.negative_text;

    }

    copyToClipboard(elementId, event) {
        const text = document.getElementById(elementId).value;
        navigator.clipboard.writeText(text).then(() => {
            const button = event.target.closest('button');
            if (button) {
                const originalHtml = button.innerHTML;
                button.innerHTML = '<span>✅</span> Copied!';
                button.style.background = '#10b981';
                setTimeout(() => {
                    button.innerHTML = originalHtml;
                    button.style.background = '';
                }, 2000);
            }
        });
    }

    exportMetadata() {
        if (!this.lastResult) return;

        const exportData = {
            image: this.lastResult.metadata,
            video: this.lastVideoResult?.metadata || null,
            prompts: {
                image_prompt: this.lastResult.prompt_text,
                image_negative: this.lastResult.negative_text,
                video_prompt: this.lastVideoResult?.video_prompt || null
            }
        };

        const json = JSON.stringify(exportData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prompt-metadata-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIController();
    ui.init();
});

// ============================================================================
// BarCraft Glass Visualizer
// Renders a recipe as liquid poured into its actual glassware (stems omitted):
// each ingredient pours in as a layer sized by true volume for that glass shape,
// bitters fall in as drops, shaken/stirred drinks blend to their final color,
// fizzy drinks bubble, egg-white sours get a foam cap, and the garnish lands last.
// ============================================================================

const SVG_NS = 'http://www.w3.org/2000/svg';
const VIEW_W = 200;
const VIEW_H = 214;
const BASELINE = 204; // where every glass sits, so relative glass sizes stay true
const WALL = 3;

let vizCounter = 0;

// ----------------------------------------------------------------------------
// Glassware profiles: interior half-width (r) at height (y) above the inner floor.
// `base` is the solid glass below the liquid; `capacity` is in oz.
// ----------------------------------------------------------------------------
const GLASSES = {
  coupe:       { label: 'Coupe',        base: 3,  capacity: 6,  profile: [[0, 5], [6, 30], [14, 50], [26, 66], [40, 75], [52, 79], [62, 80]] },
  nickNora:    { label: 'Nick & Nora',  base: 3,  capacity: 5,  profile: [[0, 6], [8, 26], [20, 40], [36, 48], [56, 52], [72, 52], [86, 51]] },
  martini:     { label: 'Martini',      base: 3,  capacity: 7,  profile: [[0, 2], [20, 22], [40, 42], [60, 62], [78, 80]] },
  rocks:       { label: 'Rocks',        base: 14, capacity: 10, profile: [[0, 52], [40, 54], [84, 57]] },
  doubleRocks: { label: 'Double Rocks', base: 14, capacity: 13, profile: [[0, 58], [46, 60], [94, 63]] },
  highball:    { label: 'Highball',     base: 16, capacity: 12, profile: [[0, 34], [80, 35], [150, 37]] },
  collins:     { label: 'Collins',      base: 16, capacity: 13, profile: [[0, 30], [80, 31], [166, 33]] },
  hurricane:   { label: 'Hurricane',    base: 12, capacity: 16, profile: [[0, 22], [24, 32], [58, 40], [88, 30], [120, 34], [154, 46]] },
  flute:       { label: 'Flute',        base: 3,  capacity: 6,  profile: [[0, 4], [12, 15], [40, 22], [100, 25], [136, 27]] },
  wine:        { label: 'Wine',         base: 3,  capacity: 14, profile: [[0, 8], [12, 36], [34, 54], [60, 58], [84, 54], [102, 48]] },
  snifter:     { label: 'Snifter',      base: 3,  capacity: 10, profile: [[0, 10], [14, 40], [40, 58], [66, 54], [90, 40]] },
  mug:         { label: 'Copper Mug',   base: 8,  capacity: 14, profile: [[0, 46], [20, 52], [54, 55], [86, 52], [106, 48]], metal: 'copper' },
  julep:       { label: 'Julep Cup',    base: 8,  capacity: 12, profile: [[0, 40], [50, 43], [102, 48]], metal: 'silver' }
};

// The first glass named wins ("Nick & Nora or Coupe" -> Nick & Nora)
export function resolveGlassType(glassText = '') {
  const first = String(glassText).split(/\s+or\s+|\//i)[0].toLowerCase();
  const all = String(glassText).toLowerCase();
  const test = (s) => {
    if (/nick/.test(s)) return 'nickNora';
    if (/martini/.test(s)) return 'martini';
    if (/coupe/.test(s)) return 'coupe';
    if (/flute/.test(s)) return 'flute';
    if (/snifter/.test(s)) return 'snifter';
    if (/wine/.test(s)) return 'wine';
    if (/hurricane/.test(s)) return 'hurricane';
    if (/copper|mug/.test(s)) return 'mug';
    if (/julep/.test(s)) return 'julep';
    if (/collins|zombie/.test(s)) return 'collins';
    if (/highball|fizz/.test(s)) return 'highball';
    if (/double/.test(s)) return 'doubleRocks';
    if (/rocks|old fashioned|tumbler/.test(s)) return 'rocks';
    return null;
  };
  return test(first) || test(all) || 'rocks';
}

// ----------------------------------------------------------------------------
// Ingredient colors: [hex, opacity]. Clear spirits are faint; juices are cloudy.
// ----------------------------------------------------------------------------
const INGREDIENT_COLORS = {
  // Base spirits
  'london-dry-gin': ['#DCEBF5', 0.16], 'old-tom-gin': ['#EFE7CF', 0.2], 'barrel-rested-gin': ['#E3B866', 0.5],
  'vodka': ['#E4EEF5', 0.14], 'white-rum': ['#EEF2F4', 0.14], 'rhum-agricole': ['#EEF0E6', 0.16], 'cachaca': ['#EEF0E6', 0.16],
  'pisco': ['#F1EEDD', 0.16], 'tequila-blanco': ['#EAF1EE', 0.16], 'tequila-reposado': ['#E9C46A', 0.5], 'mezcal': ['#E7E5D3', 0.22],
  'bourbon': ['#C26A1E', 0.82], 'rye-whiskey': ['#B85C1C', 0.82], 'blended-scotch': ['#C98A2B', 0.72], 'islay-scotch': ['#B9832D', 0.75],
  'cognac': ['#A8521A', 0.84], 'jamaican-rum': ['#C7802E', 0.68], 'applejack': ['#C77B2A', 0.72], 'dark-rum': ['#4A1E08', 0.94],
  // Modifiers & liqueurs
  'sweet-vermouth': ['#6E1A16', 0.9], 'dry-vermouth': ['#EDE6B8', 0.3], 'lillet-blanc': ['#F2D77E', 0.5],
  'campari': ['#D0102C', 0.9], 'aperol': ['#FF5A1F', 0.86], 'cynar': ['#3B2412', 0.92], 'averna-amaro': ['#2E1A0E', 0.94],
  'amaro-nonino': ['#C8742C', 0.75], 'fernet-branca': ['#1F150C', 0.96], 'luxardo-maraschino': ['#F1F1EC', 0.18],
  'green-chartreuse': ['#8DC63F', 0.75], 'yellow-chartreuse': ['#E8CE3A', 0.7], 'benedictine': ['#D99A2B', 0.75],
  'st-germain': ['#F5E6A0', 0.45], 'dry-curacao': ['#D9822B', 0.62], 'grand-marnier': ['#D27A26', 0.72],
  'licor-43': ['#F0B429', 0.75], 'tia-maria': ['#2A160A', 0.96], 'amaretto': ['#A9561B', 0.8], 'cherry-heering': ['#7A0F1F', 0.92],
  'drambuie': ['#D99A2B', 0.75], 'creme-de-menthe': ['#1FB45A', 0.85], 'white-creme-de-cacao': ['#F4EFE2', 0.2],
  'creme-de-violette': ['#7D63B8', 0.75], 'allspice-dram': ['#5C2A12', 0.9], 'falernum': ['#F2E2B8', 0.45],
  'absinthe': ['#A8D46F', 0.6], 'dry-sherry': ['#EAD58C', 0.45], 'dry-red-wine': ['#6B0D24', 0.95], 'champagne': ['#F3E3A6', 0.42],
  // Juices, syrups, dairy
  'lime-juice': ['#D7E79C', 0.7], 'lemon-juice': ['#F6E9A2', 0.72], 'grapefruit-juice': ['#F6A99A', 0.78],
  'pineapple-juice': ['#F6CF4F', 0.88], 'cranberry-juice': ['#A3102F', 0.92], 'cold-brew': ['#2B170B', 0.97], 'fresh-espresso': ['#2A150A', 0.98],
  'simple-syrup': ['#F4F4EE', 0.14], 'brown-simple-syrup': ['#B0702A', 0.6], 'agave-syrup': ['#E8B95A', 0.45], 'honey-syrup': ['#E0A526', 0.65],
  'honey-ginger-syrup': ['#DDA336', 0.68], 'apple-cider-syrup': ['#9A4E17', 0.82], 'maple-syrup': ['#9A5414', 0.8], 'raspberry-syrup': ['#B5123E', 0.9], 'orgeat': ['#F2EADB', 0.88],
  'heavy-cream': ['#FBF6EA', 0.97], 'cream-of-coconut': ['#FAF6EC', 0.96],
  // Mixers
  'club-soda': ['#E8F3FA', 0.1], 'ginger-beer': ['#E9D7A1', 0.6], 'tonic-water': ['#EEF5F8', 0.12],
  // Bitters
  'angostura-bitters': ['#5A1309', 0.95], 'orange-bitters': ['#C8561C', 0.85], 'peychauds-bitters': ['#C3172E', 0.9],
  'chocolate-bitters': ['#3B1F10', 0.95], 'blood-orange-bitters': ['#B42A1E', 0.9], 'lime-bitters': ['#8AAE3A', 0.85],
  'apple-bitters': ['#B8862E', 0.85], 'black-walnut-bitters': ['#3A2414', 0.95], 'spicy-bitters': ['#8E2A10', 0.9], 'australian-bitters': ['#6B2A12', 0.9],
  // Produce
  'fresh-mint': ['#3E9B4F', 1], 'fresh-basil': ['#2F8A45', 1], 'fresh-raspberries': ['#C2224A', 1], 'fresh-strawberries': ['#E0393E', 1],
  'fresh-ginger-root': ['#E9D29A', 1], 'fresh-peach': ['#F5A86B', 1], 'fresh-eggs': ['#F4EAD2', 1]
};

function guessColor(ing) {
  const t = `${ing.id || ''} ${ing.name || ''}`.toLowerCase();
  const rules = [
    [/soda|seltzer|tonic|sparkling water/, ['#E8F3FA', 0.1]],
    [/champagne|prosecco|cava|sparkling/, ['#F3E3A6', 0.42]],
    [/bitters/, ['#5A1309', 0.95]],
    [/espresso|coffee|cold brew|kahl/, ['#2A150A', 0.97]],
    [/cream|milk|coconut|orgeat|egg/, ['#FBF6EA', 0.95]],
    [/campari|aperitivo|bitter red/, ['#D0102C', 0.9]],
    [/aperol/, ['#FF5A1F', 0.86]],
    [/vermouth/, /dry|blanc|bianco/.test(t) ? ['#EDE6B8', 0.3] : ['#6E1A16', 0.9]],
    [/amaro|fernet|cynar|averna/, ['#3B2412', 0.92]],
    [/bourbon|rye|whisk|scotch|cognac|brandy|armagnac|calvados|applejack/, ['#C26A1E', 0.82]],
    [/dark rum|black rum|aged rum|anejo|añejo/, ['#5A260B', 0.9]],
    [/reposado/, ['#E9C46A', 0.5]],
    [/gin|vodka|rum|tequila|mezcal|pisco|cacha|sake|soju/, ['#E4EEF5', 0.16]],
    [/lime/, ['#D7E79C', 0.7]],
    [/lemon|yuzu/, ['#F6E9A2', 0.72]],
    [/grapefruit/, ['#F6A99A', 0.78]],
    [/orange juice|blood orange/, ['#FFA42B', 0.9]],
    [/pineapple|passion|mango/, ['#F6CF4F', 0.88]],
    [/cranberry|cherry|pomegranate|grenadine|raspberry|strawberry/, ['#B5123E', 0.9]],
    [/honey|agave|maple|demerara|brown sugar/, ['#E0A526', 0.6]],
    [/syrup|sugar/, ['#F4F4EE', 0.16]],
    [/wine/, /white|blanc/.test(t) ? ['#F2E3A0', 0.4] : ['#6B0D24', 0.95]],
    [/mint|basil|chartreuse|absinthe|menthe/, ['#8DC63F', 0.75]],
    [/ginger beer/, ['#E9D7A1', 0.6]],
    [/liqueur|curacao|triple sec|cointreau/, ['#F0E6C8', 0.3]]
  ];
  for (const [re, col] of rules) if (re.test(t)) return col;
  return ['#E8E2D0', 0.3];
}

function colorFor(ing) {
  return INGREDIENT_COLORS[ing.id] || guessColor(ing);
}

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgba = ([r, g, b], a) => `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(3)})`;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOutBack = (t) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// Deterministic per-recipe randomness so ice and garnish layouts stay stable
function seededRandom(seedText) {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6D2B79F5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ----------------------------------------------------------------------------
// Glass geometry: smooth radius function + volume lookup for true-to-shape fills
// ----------------------------------------------------------------------------
function buildGeometry(type) {
  const spec = GLASSES[type];
  const pts = spec.profile;
  const height = pts[pts.length - 1][0];

  // Catmull-Rom through the profile points for a smooth silhouette
  const radiusAt = (y) => {
    const yy = clamp(y, 0, height);
    let i = 0;
    while (i < pts.length - 2 && yy > pts[i + 1][0]) i++;
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const t = (yy - p1[0]) / ((p2[0] - p1[0]) || 1);
    const m1 = (p2[1] - p0[1]) / ((p2[0] - p0[0]) || 1) * (p2[0] - p1[0]);
    const m2 = (p3[1] - p1[1]) / ((p3[0] - p1[0]) || 1) * (p2[0] - p1[0]);
    const t2 = t * t;
    const t3 = t2 * t;
    return Math.max(1, (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2);
  };

  // Cumulative volume (round glass, so area ∝ r²)
  const steps = Math.ceil(height);
  const cum = [0];
  for (let s = 1; s <= steps; s++) {
    const r = radiusAt(s - 0.5);
    cum.push(cum[s - 1] + r * r);
  }
  const total = cum[steps];
  const heightForFraction = (f) => {
    const target = clamp(f, 0, 1) * total;
    let lo = 0;
    let hi = steps;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < target) lo = mid; else hi = mid;
    }
    const seg = cum[hi] - cum[lo] || 1;
    return lo + (target - cum[lo]) / seg;
  };

  const floorY = BASELINE - spec.base; // screen y of the inner floor
  const cx = VIEW_W / 2;
  const toScreenY = (y) => floorY - y;

  const sample = (offset) => {
    const left = [];
    const right = [];
    for (let y = 0; y <= height; y += 1) {
      const r = radiusAt(y) + offset;
      left.push([cx - r, toScreenY(y)]);
      right.push([cx + r, toScreenY(y)]);
    }
    return { left, right };
  };

  const inner = sample(0);
  const innerPath = `M ${inner.left.map(p => p.map(n => n.toFixed(1)).join(' ')).join(' L ')} L ${inner.right.reverse().map(p => p.map(n => n.toFixed(1)).join(' ')).join(' L ')} Z`;

  const outer = sample(WALL);
  const r0 = radiusAt(0) + WALL;
  const bottomY = BASELINE;
  const outerLeft = outer.left.slice().reverse(); // top -> floor
  const outerRight = outer.right; // floor -> top
  const corner = Math.min(6, spec.base);
  const outerPath = [
    `M ${outerLeft[0][0].toFixed(1)} ${outerLeft[0][1].toFixed(1)}`,
    ...outerLeft.slice(1).map(p => `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`),
    `L ${(cx - r0).toFixed(1)} ${(bottomY - corner).toFixed(1)}`,
    `Q ${(cx - r0).toFixed(1)} ${bottomY} ${(cx - r0 + corner).toFixed(1)} ${bottomY}`,
    `L ${(cx + r0 - corner).toFixed(1)} ${bottomY}`,
    `Q ${(cx + r0).toFixed(1)} ${bottomY} ${(cx + r0).toFixed(1)} ${(bottomY - corner).toFixed(1)}`,
    ...outerRight.map(p => `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
  ].join(' ');

  // Outline of the liquid body between two heights, hugging the glass walls (for shading)
  const bodyPath = (h0, h1) => {
    if (h1 <= h0) return '';
    const left = [];
    const right = [];
    for (let y = h0; y <= h1; y += 2) {
      const r = radiusAt(y);
      left.push(`${(cx - r).toFixed(1)} ${toScreenY(y).toFixed(1)}`);
      right.push(`${(cx + r).toFixed(1)} ${toScreenY(y).toFixed(1)}`);
    }
    const rTop = radiusAt(h1);
    left.push(`${(cx - rTop).toFixed(1)} ${toScreenY(h1).toFixed(1)}`);
    right.push(`${(cx + rTop).toFixed(1)} ${toScreenY(h1).toFixed(1)}`);
    return `M ${left.join(' L ')} L ${right.reverse().join(' L ')} Z`;
  };

  // Frame each glass to its own height, leaving headroom for the pour stream and garnish
  const rimY = toScreenY(height);
  const viewTop = Math.max(0, Math.floor(rimY - 54));
  return { type, spec, height, radiusAt, heightForFraction, floorY, cx, toScreenY, innerPath, outerPath, bodyPath, rimY, viewTop, viewH: VIEW_H - viewTop };
}

// ----------------------------------------------------------------------------
// Recipe -> pour plan
// ----------------------------------------------------------------------------
const LIQUID_UNITS = new Set(['oz', 'ml', 'cl', 'barspoon', 'part', 'parts', 'tsp']);
const DASH_UNITS = new Set(['dash', 'dashes', 'drop', 'drops']);
const FIZZ_RE = /soda|tonic|ginger-beer|ginger beer|champagne|prosecco|sparkling|cava|seltzer|cola/;

function toOz(ing) {
  const a = typeof ing.amount === 'number' ? ing.amount : 0;
  switch (ing.unit) {
    case 'ml': return a / 29.57;
    case 'cl': return a / 2.957;
    case 'barspoon': return a * 0.17;
    case 'tsp': return a * 0.17;
    default: return a;
  }
}

function shortName(name = '') {
  // "Bourbon (Elijah Craig / WT101)" -> "Bourbon"; keep short qualifiers like "(1:1)"
  return name.replace(/\s*\(([^)]*)\)/g, (m, inner) => (/[/]|\bor\b|\d+(\.\d+)?\s*oz/i.test(inner) || inner.length > 14 ? '' : m)).trim();
}

export function buildPourPlan(recipe) {
  const method = `${recipe.method || ''} ${recipe.techniqueRule || ''}`.toLowerCase();
  const instructions = (recipe.instructions || []).join(' ').toLowerCase();
  const all = `${method} ${instructions}`;

  const isFloat = (ing) => {
    if (/float/i.test(ing.note || '')) return true;
    if (!/float/.test(recipe.method?.toLowerCase() || '')) return false;
    const words = `${ing.id} ${ing.name}`.toLowerCase().split(/[\s-]+/).filter(w => w.length > 3);
    return words.some(w => (recipe.method || '').toLowerCase().includes(w));
  };

  const liquids = [];
  const dashes = [];
  const solids = [];
  let hasEgg = false;

  recipe.ingredients.forEach((ing, idx) => {
    const id = ing.id || '';
    const unit = (ing.unit || '').toLowerCase();
    const entry = { ing, idx, color: colorFor(ing), name: shortName(ing.name) };
    if (id === 'fresh-eggs' || /egg white|aquafaba|albumen/i.test(ing.name || '') || unit === 'albumen') {
      hasEgg = true;
      entry.kind = 'foam';
      solids.push(entry);
    } else if (DASH_UNITS.has(unit)) {
      entry.kind = 'dash';
      entry.count = clamp(Math.round(ing.amount || 1), 1, 4);
      dashes.push(entry);
    } else if (LIQUID_UNITS.has(unit) || (!unit && typeof ing.amount === 'number')) {
      entry.kind = 'liquid';
      entry.oz = Math.max(0.12, toOz(ing));
      entry.float = isFloat(ing);
      liquids.push(entry);
    } else {
      entry.kind = 'solid';
      solids.push(entry);
    }
  });

  const isFizzy = liquids.some(l => FIZZ_RE.test(`${l.ing.id} ${l.ing.name}`.toLowerCase())) || /soda top|top with (club soda|champagne|soda|tonic)/.test(all);
  const isSparklingWine = liquids.some(l => /champagne|prosecco|sparkling/.test(`${l.ing.id} ${l.ing.name}`.toLowerCase()));
  const hasFoam = hasEgg || /foam/.test(method);
  const isBuilt = /build|swizzle/.test(method) && !/shake|stir/.test(method);
  const muddled = /muddle|swizzle/.test(method) && !/double[- ]strain/.test(all);

  // Pour order: base liquids as written, bitters right after the first pour, floats last
  const main = liquids.filter(l => !l.float);
  const floats = liquids.filter(l => l.float);

  return { liquids: [...main, ...floats], main, floats, dashes, solids, isFizzy, isSparklingWine, hasFoam, isBuilt, muddled };
}

function detectIce(iceText = '') {
  const t = iceText.toLowerCase();
  if (/^none|neat|chilled glass|chilled ingredients/.test(t) && !/^none or (1|cubes|large)/.test(t)) return 'none';
  if (/crushed|pebble/.test(t)) return 'crushed';
  if (/single|large|block|rock|one large|big/.test(t)) return 'large';
  if (/ice|cube|spear|packed/.test(t)) return 'cubes';
  return 'none';
}


// ----------------------------------------------------------------------------
// Garnish detection: read the "Garnish with ..." sentence; "X or Y" means X
// ----------------------------------------------------------------------------
const TEMPO = 1.8; // > 1 slows every phase of the pour

function garnishSentence(recipe) {
  const instr = (recipe.instructions || []).join(' ');
  const sentence = instr.split(/(?<=[.!])\s+/).find(s => /garnish/i.test(s));
  if (!sentence) return '';
  return sentence.replace(/^.*?garnish(ed)?\s*/i, '').split(/\s+or\s+/i)[0].toLowerCase();
}

function detectGarnish(recipe) {
  const all = `${(recipe.instructions || []).join(' ')} ${recipe.glass || ''}`.toLowerCase();
  const text = garnishSentence(recipe);
  const g = {};

  if (/salt[- ]rim|salt rim|rimmed with salt|salt-rimmed|sal de gusano|coarse salt/.test(all)) g.rim = /gusano/.test(all) ? '#E7B28A' : '#F7F4EC';
  else if (/sugar rim|sugar-rim|rim.*sugar/.test(all)) g.rim = '#FFFDF6';

  // Without a garnish sentence, only an expressed peel counts (ingredient names would mislead)
  const source = text || (all.match(/express[^.]*?(peel|twist|oils)[^.]*/) || [''])[0];

  const wheel = source.match(/(lime|lemon|orange|grapefruit) (wheel|slice|half[- ]wheel|crescent|wedge|half)/) ||
    source.match(/(half) (lime|lemon|orange|grapefruit) wheel/);
  if (wheel) {
    const fruit = ['lime', 'lemon', 'orange', 'grapefruit'].find(f => wheel[0].includes(f));
    g.wheel = { fruit, half: /half|crescent|wedge/.test(wheel[0]), dried: /dehydrated/.test(source) };
  } else if (/twist|peel|zest|oils/.test(source)) {
    const fruit = (source.match(/(orange|lemon|lime|grapefruit)/) || [])[1] || 'lemon';
    g.twist = { fruit, long: /spiral|long|ring|saturn/.test(source) };
  }

  if (!text) return g;
  if (/cherr/.test(text)) g.cherry = { dark: /luxardo|brandied/.test(text), count: /cherries/.test(text) ? 2 : 1 };
  if (/olive/.test(text)) g.olive = { count: /two|olives/.test(text) ? 2 : 1 };
  if (/onion/.test(text)) g.onion = { count: /two|onions/.test(text) ? 2 : 1 };
  if (/mint/.test(text)) g.mint = { bouquet: /bouquet|generous|sprigs/.test(text) };
  if (/pineapple/.test(text)) g.pineapple = true;
  if (/apple (slice|slices|fan|wheel|chip)/.test(text) && !/pineapple (slice|wheel)/.test(text)) g.apple = { dried: /dehydrated|dried/.test(text) };
  if (/blackberr|raspberr|berries/.test(text)) g.berries = /blackberr/.test(text) ? 'black' : 'rasp';
  if (/candied ginger/.test(text)) g.ginger = true;
  if (/nutmeg|cinnamon/.test(text)) g.dust = 'spice';
  else if (/chocolate/.test(text)) g.dust = 'chocolate';
  else if (/coconut/.test(text)) g.dust = 'coconut';
  if (/coffee beans/.test(text)) g.beans = true;
  return g;
}

// rind, flesh, pith, deep flesh
const CITRUS = {
  lime: ['#4E8A1F', '#C9E27A', '#F3F7DD', '#9CC24A'],
  lemon: ['#E3B814', '#F8E77E', '#FFFBE6', '#EFD246'],
  orange: ['#E8761A', '#FFB347', '#FFF3DE', '#F28C1E'],
  grapefruit: ['#E9774F', '#FF9C86', '#FFF1EA', '#F0705A']
};

const shade = (hex, amt) => {
  const [r, g, b] = hexToRgb(hex);
  const f = (c) => Math.round(clamp(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt), 0, 255));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
};

// Each garnish returns { defs, body }; ids are namespaced per visualizer
const GARNISH_ART = {
  wheel(uid, { fruit, half, dried }) {
    const [rind, flesh, pith, deep] = CITRUS[fruit];
    const id = `${uid}-${fruit}`;
    const n = 10;
    let segs = '';
    for (let k = 0; k < n; k++) {
      const a0 = (k / n) * Math.PI * 2 + 0.05;
      const a1 = ((k + 1) / n) * Math.PI * 2 - 0.05;
      const p = (a, r) => `${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`;
      segs += `<path d="M ${p(a0, 2)} L ${p(a0, 10.4)} A 10.4 10.4 0 0 1 ${p(a1, 10.4)} L ${p(a1, 2)} Z" fill="url(#${id}-flesh)"/>`;
      // juice vesicles
      for (let v = 0; v < 3; v++) {
        const a = a0 + (a1 - a0) * (0.3 + v * 0.2);
        const r = 4.5 + v * 1.8;
        segs += `<ellipse cx="${(Math.cos(a) * r).toFixed(2)}" cy="${(Math.sin(a) * r).toFixed(2)}" rx="1.5" ry="0.55" transform="rotate(${(a * 180 / Math.PI).toFixed(0)} ${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)})" fill="rgba(255,255,255,0.35)"/>`;
      }
    }
    let pores = '';
    for (let k = 0; k < 18; k++) {
      const a = (k / 18) * Math.PI * 2 + 0.17;
      pores += `<circle cx="${(Math.cos(a) * 12.4).toFixed(2)}" cy="${(Math.sin(a) * 12.4).toFixed(2)}" r="0.35" fill="rgba(0,0,0,0.25)"/>`;
    }
    const defs = `
      <radialGradient id="${id}-flesh" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0.15" stop-color="${shade(flesh, 0.35)}"/><stop offset="0.75" stop-color="${flesh}"/><stop offset="1" stop-color="${deep}"/>
      </radialGradient>
      <radialGradient id="${id}-rind" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0.7" stop-color="${shade(rind, 0.15)}"/><stop offset="1" stop-color="${shade(rind, -0.3)}"/>
      </radialGradient>
      <clipPath id="${id}-half"><rect x="-15" y="-15" width="30" height="15.5"/></clipPath>`;
    const body = `
      <g ${half ? `clip-path="url(#${id}-half)"` : ''} ${dried ? 'opacity="0.85"' : ''}>
        <circle r="13" fill="url(#${id}-rind)"/>
        ${pores}
        <circle r="11.4" fill="${pith}"/>
        ${segs}
        <circle r="1.9" fill="${pith}"/>
        <path d="M -9 -6 A 11 11 0 0 1 2 -11" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1" stroke-linecap="round"/>
      </g>`;
    return { defs, body };
  },

  twist(uid, { fruit, long }) {
    const [rind, , pith] = CITRUS[fruit];
    // Corkscrew ribbon: segments alternate between zest and pith as it turns
    const P = long
      ? [[-16, 14], [-8, -20], [18, -18], [28, 48]]
      : [[-15, 10], [-7, -15], [13, -15], [24, 15]];
    const bez = (t) => {
      const u = 1 - t;
      return [0, 1].map(k => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]);
    };
    const N = long ? 70 : 46;
    const turns = long ? 4.5 : 2.4;
    let quads = '';
    let prev = null;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const [x, y] = bez(t);
      const [x2, y2] = bez(Math.min(1, t + 0.01));
      const ang = Math.atan2(y2 - y, x2 - x) + Math.PI / 2;
      const theta = t * turns * Math.PI * 2;
      const c = Math.cos(theta);
      const taper = t < 0.08 ? t / 0.08 : t > 0.92 ? (1 - t) / 0.08 : 1;
      const w = (1.5 + 1.3 * Math.abs(c)) * (0.45 + 0.55 * taper);
      const pt = [x + Math.cos(ang) * w, y + Math.sin(ang) * w, x - Math.cos(ang) * w, y - Math.sin(ang) * w];
      if (prev) {
        const front = c > 0;
        const fill = front ? shade(rind, 0.18 * Math.sin(theta) + 0.05) : shade(rind, -0.28 + 0.08 * Math.sin(theta));
        quads += `<path d="M ${prev[0].toFixed(2)} ${prev[1].toFixed(2)} L ${pt[0].toFixed(2)} ${pt[1].toFixed(2)} L ${pt[2].toFixed(2)} ${pt[3].toFixed(2)} L ${prev[2].toFixed(2)} ${prev[3].toFixed(2)} Z" fill="${fill}" stroke="${fill}" stroke-width="0.3"/>`;
        // The white pith shows along the inner edge where the peel turns away
        if (!front) quads += `<path d="M ${prev[2].toFixed(2)} ${prev[3].toFixed(2)} L ${pt[2].toFixed(2)} ${pt[3].toFixed(2)}" stroke="${pith}" stroke-width="0.9" stroke-linecap="round"/>`;
        else if (i % 3 === 0) quads += `<circle cx="${((prev[0] + pt[2]) / 2).toFixed(2)}" cy="${((prev[1] + pt[3]) / 2).toFixed(2)}" r="0.3" fill="rgba(0,0,0,0.2)"/>`;
        if (front && i % 2 === 0) quads += `<path d="M ${prev[0].toFixed(2)} ${prev[1].toFixed(2)} L ${pt[0].toFixed(2)} ${pt[1].toFixed(2)}" stroke="rgba(255,255,255,0.35)" stroke-width="0.5" stroke-linecap="round"/>`;
      }
      prev = pt;
    }
    return { defs: '', body: `<g>${quads}</g>` };
  },

  cherry(uid, { dark }) {
    const id = `${uid}-cherry`;
    const [hi, mid, lo] = dark ? ['#8A1A2A', '#4A0712', '#22020A'] : ['#E8384F', '#B0102A', '#5E0614'];
    const defs = `
      <radialGradient id="${id}" cx="0.35" cy="0.32" r="0.75">
        <stop offset="0" stop-color="${hi}"/><stop offset="0.55" stop-color="${mid}"/><stop offset="1" stop-color="${lo}"/>
      </radialGradient>
      <linearGradient id="${id}-stem" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stop-color="#5A3A16"/><stop offset="1" stop-color="#6E7A2A"/>
      </linearGradient>`;
    const body = `
      <path d="M 0.5 -5.5 C 1.5 -14, 7 -21, 14 -24" fill="none" stroke="url(#${id}-stem)" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M -6.2 0 C -6.2 -5, -2 -7, 0 -5.2 C 2 -7, 6.2 -5, 6.2 0 C 6.2 5, 3 7, 0 7 C -3 7, -6.2 5, -6.2 0 Z" fill="url(#${id})"/>
      <ellipse cx="0" cy="-5" rx="1.4" ry="0.6" fill="rgba(0,0,0,0.35)"/>
      <ellipse cx="-2.4" cy="-2.2" rx="1.9" ry="1.2" transform="rotate(-30 -2.4 -2.2)" fill="rgba(255,255,255,0.6)"/>
      <circle cx="2.6" cy="3.6" r="0.7" fill="rgba(255,255,255,0.18)"/>`;
    return { defs, body };
  },

  olive(uid, { count }) {
    const id = `${uid}-olive`;
    const defs = `
      <radialGradient id="${id}" cx="0.38" cy="0.32" r="0.75">
        <stop offset="0" stop-color="#B7CF63"/><stop offset="0.6" stop-color="#7C9A2E"/><stop offset="1" stop-color="#465E16"/>
      </radialGradient>
      <radialGradient id="${id}-pim" cx="0.4" cy="0.4" r="0.6">
        <stop offset="0" stop-color="#F0564A"/><stop offset="1" stop-color="#A3241A"/>
      </radialGradient>`;
    let olives = '';
    for (let k = 0; k < count; k++) {
      const off = k * 11;
      olives += `
        <g transform="translate(${off * 0.7} ${off * 0.7}) rotate(45)">
          <ellipse rx="7.4" ry="5.6" fill="url(#${id})"/>
          <ellipse cx="6.2" rx="2.2" ry="2.6" fill="url(#${id}-pim)"/>
          <ellipse cx="-2.5" cy="-2.6" rx="2.6" ry="1.1" fill="rgba(255,255,255,0.45)"/>
        </g>`;
    }
    const body = `
      <line x1="-24" y1="-24" x2="${10 + count * 8}" y2="${10 + count * 8}" stroke="#D8C08A" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="-24" cy="-24" r="2.2" fill="#E2B33C"/><circle cx="-24.7" cy="-24.7" r="0.8" fill="rgba(255,255,255,0.6)"/>
      ${olives}`;
    return { defs, body };
  },

  onion(uid, { count }) {
    const id = `${uid}-onion`;
    const defs = `<radialGradient id="${id}" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#FFFFFA"/><stop offset="0.7" stop-color="#E6E0CC"/><stop offset="1" stop-color="#B9B196"/></radialGradient>`;
    let onions = '';
    for (let k = 0; k < count; k++) {
      const off = k * 9;
      onions += `<g transform="translate(${off * 0.7} ${off * 0.7})"><circle r="4.8" fill="url(#${id})"/>
        <path d="M -3 -2.5 Q 0 -4.6 3 -2.5" fill="none" stroke="rgba(150,140,110,0.5)" stroke-width="0.5"/>
        <path d="M -3.6 0 Q 0 -2.2 3.6 0" fill="none" stroke="rgba(150,140,110,0.4)" stroke-width="0.5"/>
        <circle cx="-1.6" cy="-1.8" r="1.1" fill="rgba(255,255,255,0.8)"/></g>`;
    }
    return { defs, body: `<line x1="-22" y1="-22" x2="${8 + count * 7}" y2="${8 + count * 7}" stroke="#C9A86A" stroke-width="1.4" stroke-linecap="round"/>${onions}` };
  },

  mint(uid, { bouquet }) {
    const id = `${uid}-mint`;
    const defs = `
      <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#7BD389"/><stop offset="0.5" stop-color="#3FA055"/><stop offset="1" stop-color="#23703A"/>
      </linearGradient>`;
    // Serrated leaf from base (0,0) to tip (len,0)
    const leaf = (len, wid) => {
      const top = [];
      const bot = [];
      const teeth = 7;
      for (let i = 0; i <= teeth * 2; i++) {
        const t = i / (teeth * 2);
        const w = Math.sin(Math.PI * Math.pow(t, 0.8)) * wid * (i % 2 ? 1 : 0.86);
        top.push(`${(t * len).toFixed(2)} ${(-w).toFixed(2)}`);
        bot.push(`${(t * len).toFixed(2)} ${w.toFixed(2)}`);
      }
      let veins = `<path d="M 0 0 L ${len * 0.95} 0" stroke="rgba(20,70,35,0.55)" stroke-width="0.5"/>`;
      for (let v = 1; v <= 3; v++) {
        const x = len * (0.18 + v * 0.18);
        const w = Math.sin(Math.PI * Math.pow(x / len, 0.8)) * wid * 0.75;
        veins += `<path d="M ${x - 2} 0 Q ${x} ${-w * 0.5} ${x + 2.5} ${-w}" fill="none" stroke="rgba(20,70,35,0.4)" stroke-width="0.35"/>`;
        veins += `<path d="M ${x - 2} 0 Q ${x} ${w * 0.5} ${x + 2.5} ${w}" fill="none" stroke="rgba(20,70,35,0.4)" stroke-width="0.35"/>`;
      }
      return `<path d="M ${top.join(' L ')} L ${bot.reverse().join(' L ')} Z" fill="url(#${id})"/>${veins}`;
    };
    const sprig = (dx, dy, rot, scale) => `
      <g transform="translate(${dx} ${dy}) rotate(${rot}) scale(${scale})">
        <path d="M 0 0 C 0 -8, 1 -16, 0 -26" fill="none" stroke="#2F7A3E" stroke-width="1.3" stroke-linecap="round"/>
        <g transform="translate(0 -24) rotate(-95)">${leaf(11, 4.2)}</g>
        <g transform="translate(0 -20) rotate(-150)">${leaf(13, 5)}</g>
        <g transform="translate(0 -20) rotate(-30)">${leaf(13, 5)}</g>
        <g transform="translate(0 -12) rotate(-165)">${leaf(15, 5.6)}</g>
        <g transform="translate(0 -12) rotate(-15)">${leaf(15, 5.6)}</g>
      </g>`;
    const body = bouquet
      ? sprig(-8, 4, -14, 1) + sprig(6, 6, 12, 0.92) + sprig(-1, 2, 0, 1.08)
      : sprig(0, 4, -6, 1);
    return { defs, body };
  },

  pineapple(uid) {
    const id = `${uid}-pine`;
    const defs = `
      <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFF1A6"/><stop offset="1" stop-color="#F2C230"/>
      </linearGradient>
      <linearGradient id="${id}-leaf" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#3F7A3A"/><stop offset="1" stop-color="#9DC48A"/>
      </linearGradient>`;
    let fibers = '';
    for (let k = 0; k < 7; k++) fibers += `<line x1="0" y1="18" x2="${-16 + k * 5.3}" y2="2" stroke="rgba(200,150,20,0.35)" stroke-width="0.5"/>`;
    let rind = '';
    for (let k = 0; k < 7; k++) rind += `<path d="M ${-17 + k * 5} 0 l 2.5 -2.5 l 2.5 2.5" fill="none" stroke="#5E4A12" stroke-width="0.6"/>`;
    const body = `
      <path d="M -10 -2 C -14 -18, -12 -28, -16 -38" fill="none" stroke="url(#${id}-leaf)" stroke-width="3" stroke-linecap="round"/>
      <path d="M -6 -2 C -6 -20, -2 -30, -2 -44" fill="none" stroke="url(#${id}-leaf)" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M -2 -2 C 2 -16, 6 -24, 10 -34" fill="none" stroke="url(#${id}-leaf)" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M -18 0 L 18 0 L 0 20 Z" fill="url(#${id})"/>
      ${fibers}
      <rect x="-18" y="-3" width="36" height="3.4" rx="1" fill="#8A7A2A"/>
      ${rind}
      <path d="M -3 0 L 3 0 L 0 16 Z" fill="rgba(255,250,215,0.65)"/>`;
    return { defs, body };
  },

  berries(uid, kind) {
    const [hi, mid, lo] = kind === 'black' ? ['#6A3A7A', '#2E0F36', '#140616'] : ['#F06080', '#C2224A', '#7A0F2A'];
    const berry = (dx, dy) => {
      let d = '';
      const pts = [[0, -4.5], [-3, -2.5], [3, -2.5], [-4, 0.5], [0, -1], [4, 0.5], [-2.6, 3.2], [2.6, 3.2], [0, 2], [0, 5]];
      pts.forEach(([x, y]) => {
        d += `<circle cx="${dx + x}" cy="${dy + y}" r="2.1" fill="${mid}" stroke="${lo}" stroke-width="0.3"/>
              <circle cx="${dx + x - 0.6}" cy="${dy + y - 0.7}" r="0.6" fill="${hi}"/>`;
      });
      return d;
    };
    return { defs: '', body: `<line x1="-20" y1="-16" x2="14" y2="8" stroke="#D8C08A" stroke-width="1.3" stroke-linecap="round"/>${berry(-5, -5)}${berry(6, 3)}` };
  },

  apple(uid, { dried }) {
    const id = `${uid}-apple`;
    const defs = `
      <radialGradient id="${id}-flesh" cx="0.5" cy="0.45" r="0.6">
        <stop offset="0" stop-color="${dried ? '#F6D58A' : '#FFF8E2'}"/><stop offset="1" stop-color="${dried ? '#D9A24A' : '#F1E3B8'}"/>
      </radialGradient>
      <linearGradient id="${id}-skin" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#D8323C"/><stop offset="0.6" stop-color="#A3161F"/><stop offset="1" stop-color="#6E0C14"/>
      </linearGradient>`;
    if (dried) {
      // Translucent dehydrated cross-section: wavy red edge, golden flesh, star-shaped core
      let edge = '';
      for (let k = 0; k <= 36; k++) {
        const a = (k / 36) * Math.PI * 2;
        const r = 12.5 + Math.sin(k * 2.7) * 0.6;
        edge += `${k ? 'L' : 'M'} ${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)} `;
      }
      let star = '';
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
        star += `<ellipse cx="${(Math.cos(a) * 2.6).toFixed(2)}" cy="${(Math.sin(a) * 2.6).toFixed(2)}" rx="1.9" ry="0.8" transform="rotate(${(a * 180 / Math.PI).toFixed(0)} ${(Math.cos(a) * 2.6).toFixed(2)} ${(Math.sin(a) * 2.6).toFixed(2)})" fill="rgba(140,80,20,0.55)"/>`;
        star += `<ellipse cx="${(Math.cos(a) * 2.8).toFixed(2)}" cy="${(Math.sin(a) * 2.8).toFixed(2)}" rx="0.7" ry="0.4" transform="rotate(${(a * 180 / Math.PI).toFixed(0)} ${(Math.cos(a) * 2.8).toFixed(2)} ${(Math.sin(a) * 2.8).toFixed(2)})" fill="#4A2A10"/>`;
      }
      const body = `
        <path d="${edge}Z" fill="url(#${id}-skin)" opacity="0.9"/>
        <circle r="11.4" fill="url(#${id}-flesh)" opacity="0.92"/>
        <circle r="6.5" fill="none" stroke="rgba(160,100,30,0.25)" stroke-width="0.6"/>
        ${star}
        <path d="M -8 -6 A 10 10 0 0 1 1 -10" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="0.9" stroke-linecap="round"/>`;
      return { defs, body };
    }
    // A fan of three thin slices: red skin along the curve, pale flesh, a seed or two
    const slice = (rot, dx, dy) => `
      <g transform="translate(${dx} ${dy}) rotate(${rot})">
        <path d="M -13 0 A 13 9 0 0 1 13 0 Z" fill="url(#${id}-flesh)"/>
        <path d="M -13 0 A 13 9 0 0 1 13 0" fill="none" stroke="url(#${id}-skin)" stroke-width="1.8"/>
        <path d="M -4 0 Q 0 -4.5 4 0" fill="none" stroke="rgba(190,160,90,0.45)" stroke-width="0.6"/>
        <ellipse cx="-1.4" cy="-1.6" rx="0.7" ry="1.1" fill="#4A2A10"/>
        <path d="M -10 -1.5 A 11 7 0 0 1 -2 -7.2" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="0.6" stroke-linecap="round"/>
      </g>`;
    return { defs, body: slice(-28, -6, 3) + slice(0, 0, 0) + slice(26, 6, 3) };
  },

  ginger() {
    let sugar = '';
    for (let k = 0; k < 14; k++) sugar += `<rect x="${(-5 + (k * 37 % 10)).toFixed(1)}" y="${(-5 + (k * 53 % 10)).toFixed(1)}" width="0.9" height="0.9" fill="rgba(255,255,255,0.85)"/>`;
    return { defs: '', body: `<line x1="-18" y1="-18" x2="8" y2="8" stroke="#D8C08A" stroke-width="1.3" stroke-linecap="round"/><rect x="-5.5" y="-5.5" width="11" height="11" rx="2.5" fill="#E8C66A" stroke="#C9A040" stroke-width="0.6"/>${sugar}` };
  },

  beans() {
    const bean = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="3.6" ry="2.5" fill="#4A2A16"/><ellipse rx="3.6" ry="2.5" fill="none" stroke="#2A160A" stroke-width="0.4"/><path d="M -2.8 0.3 Q 0 -1.2 2.8 0.3" fill="none" stroke="#1A0C04" stroke-width="0.6"/><ellipse cx="-1.2" cy="-1.2" rx="1.2" ry="0.5" fill="rgba(255,255,255,0.3)"/></g>`;
    return { defs: '', body: bean(-7, 0, -10) + bean(0, -2.5, 15) + bean(7, 0, 5) };
  }
};

// ----------------------------------------------------------------------------
// GlassViz: one animated glass bound to a container
// ----------------------------------------------------------------------------
export class GlassViz {
  constructor(container, recipe, { animate = true, legendEl = null, formatAmount = null, compact = false } = {}) {
    this.container = container;
    this.recipe = recipe;
    this.legendEl = legendEl;
    this.formatAmount = formatAmount;
    this.compact = compact;
    this.uid = `gv${++vizCounter}`;
    this.reducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.animate = animate && !this.reducedMotion;
    this.rand = seededRandom(recipe.id || recipe.name || 'drink');
    this.frame = null;
    this.destroyed = false;
    this.splash = [];
    this.aeration = [];
    this.ripples = [];

    this.geo = buildGeometry(resolveGlassType(recipe.glass));
    this.plan = buildPourPlan(recipe);
    this.iceType = detectIce(recipe.ice);
    this.garnish = detectGarnish(recipe);
    this.chilled = !compact && (this.iceType !== 'none' || /chill|frost|freez/i.test(`${recipe.ice} ${recipe.glass}`) || this.geo.spec.metal === 'silver');

    this.computeLayers();
    this.buildTimeline();
    this.render();
    this.renderLegend();

    if (this.animate) {
      this.start();
    } else {
      this.drawAt(this.totalDuration + 6000);
      if (!compact && !this.reducedMotion && this.bubbles.length) this.startIdle();
    }
  }

  // Layer boundaries in glass-height units, sized by real volume in this glass shape
  computeLayers() {
    const { liquids } = this.plan;
    const totalOz = liquids.reduce((a, l) => a + l.oz, 0) || 1;
    const dilution = this.plan.isBuilt ? 1.05 : 1.25;
    const fillFraction = clamp((totalOz * dilution) / this.geo.spec.capacity, 0.38, this.plan.hasFoam ? 0.8 : 0.88);

    let cumOz = 0;
    this.layers = liquids.map(l => {
      const startF = (cumOz / totalOz) * fillFraction;
      cumOz += l.oz;
      const endF = (cumOz / totalOz) * fillFraction;
      return {
        ...l,
        y0: this.geo.heightForFraction(startF),
        y1: this.geo.heightForFraction(endF),
        rgb: hexToRgb(l.color[0]),
        alpha: l.color[1]
      };
    });

    // Final blended color: hue weighted by strength, opacity mixed by transmittance
    const mainLayers = this.layers.filter(l => !l.float);
    let wSum = 0;
    const mix = [0, 0, 0];
    let logT = 0;
    let vSum = 0;
    mainLayers.forEach(l => {
      const w = l.oz * (0.08 + l.alpha);
      mix[0] += l.rgb[0] * w;
      mix[1] += l.rgb[1] * w;
      mix[2] += l.rgb[2] * w;
      wSum += w;
      logT += Math.log(Math.max(0.02, 1 - l.alpha)) * l.oz;
      vSum += l.oz;
    });
    // Muddled or shaken fruit colors the drink even when it's strained out
    this.plan.solids.filter(sd => sd.kind === 'solid' && /berr|strawberr|peach|cherr/.test(sd.ing.id || '')).forEach(sd => {
      const w = clamp((sd.ing.amount || 2) * 0.14, 0.45, 0.8);
      const rgb = hexToRgb(sd.color[0]);
      mix[0] += rgb[0] * w;
      mix[1] += rgb[1] * w;
      mix[2] += rgb[2] * w;
      wSum += w;
      logT += Math.log(0.3) * w * 0.5;
      vSum += w * 0.5;
    });
    // Bitters tint the blend a little
    this.plan.dashes.forEach(d => {
      const w = 0.05 * d.count;
      const rgb = hexToRgb(d.color[0]);
      mix[0] += rgb[0] * w;
      mix[1] += rgb[1] * w;
      mix[2] += rgb[2] * w;
      wSum += w;
    });
    this.blendRgb = wSum ? mix.map(c => c / wSum) : [230, 230, 220];
    this.blendAlpha = clamp((vSum ? 1 - Math.exp(logT / vSum) : 0.3) + 0.08, 0.3, 0.96);
    this.shouldBlend = mainLayers.length > 1;
    this.mainCount = mainLayers.length;
    this.mainTopY = mainLayers.length ? mainLayers[mainLayers.length - 1].y1 : 0;
    this.foamHeight = this.plan.hasFoam ? Math.min(15, this.geo.height * 0.13) : 0;
    if (this.foamHeight) {
      this.layers.filter(l => l.float).forEach(l => {
        l.y0 += this.foamHeight;
        l.y1 = Math.min(this.geo.height - 1, l.y1 + this.foamHeight);
      });
    }
    this.liquidTopY = this.layers.length ? this.layers[this.layers.length - 1].y1 : 0;
  }

  buildTimeline() {
    const T = (ms) => ms * TEMPO;
    const events = [];
    this.iceDur = T(560);
    let t = this.iceType === 'none' ? T(140) : T(660);
    const mainLayers = this.layers.filter(l => !l.float);
    const floatLayers = this.layers.filter(l => l.float);
    const maxOz = Math.max(...this.layers.map(l => l.oz), 1);

    const pourEvent = (layer) => {
      const dur = T(clamp(320 + 520 * (layer.oz / maxOz), 340, 900));
      events.push({ kind: 'pour', layer, start: t, end: t + dur });
      t += dur + T(110);
    };
    const dropEvents = (x0) => {
      this.plan.dashes.forEach(d => {
        for (let k = 0; k < d.count; k++) {
          events.push({ kind: 'drop', dash: d, start: t, end: t + T(380), x: x0 + (this.rand() - 0.5) * 16 });
          t += T(170);
        }
        t += T(120);
      });
    };

    mainLayers.forEach((layer, i) => {
      pourEvent(layer);
      if (i === 0 && this.plan.dashes.length) {
        dropEvents(this.geo.cx + 10);
        t += T(200);
      }
    });
    if (!mainLayers.length && this.plan.dashes.length) dropEvents(this.geo.cx + 10);

    if (this.shouldBlend) {
      events.push({ kind: 'blend', start: t + T(120), end: t + T(1300) });
      t += T(1300);
    }
    if (this.plan.hasFoam) {
      events.push({ kind: 'foam', start: t, end: t + T(800) });
      t += T(800);
    }
    floatLayers.forEach(pourEvent);
    events.push({ kind: 'garnish', start: t + T(100), end: t + T(900) });
    t += T(900);

    this.events = events;
    this.totalDuration = t;
  }

  render() {
    const g = this.geo;
    const id = this.uid;
    const metal = g.spec.metal;
    const glassStroke = metal === 'copper' ? `url(#${id}-copper)` : metal === 'silver' ? 'rgba(225, 230, 238, 0.9)' : `url(#${id}-rimGrad)`;
    const glassFill = metal === 'copper' ? 'rgba(184, 98, 46, 0.3)' : metal === 'silver' ? 'rgba(210, 216, 226, 0.24)' : 'rgba(255, 255, 255, 0.035)';

    const shadowR = g.spec.base > 6 ? g.radiusAt(0) + 22 : Math.max(g.radiusAt(g.height * 0.6), 30) * 0.75;
    const baseBlock = g.spec.base > 6
      ? `<rect x="${(g.cx - g.radiusAt(0) - WALL + 1).toFixed(1)}" y="${g.floorY.toFixed(1)}" width="${(2 * (g.radiusAt(0) + WALL) - 2).toFixed(1)}" height="${(g.spec.base - 1).toFixed(1)}" rx="4" fill="url(#${id}-base)"/>
         <line x1="${(g.cx - g.radiusAt(0) + 4).toFixed(1)}" y1="${(g.floorY + 1.5).toFixed(1)}" x2="${(g.cx + g.radiusAt(0) - 4).toFixed(1)}" y2="${(g.floorY + 1.5).toFixed(1)}" stroke="rgba(255,255,255,0.22)" stroke-width="0.8" stroke-linecap="round"/>`
      : '';

    // Reflection streaks along the walls
    const streak = (from, to, k) => {
      const pts = [];
      for (let y = g.height * from; y <= g.height * to; y += 1.5) pts.push(`${(g.cx + g.radiusAt(y) * k).toFixed(1)},${g.toScreenY(y).toFixed(1)}`);
      return pts.join(' ');
    };

    const handle = g.type === 'mug'
      ? `<path d="M ${g.cx + 56} ${g.toScreenY(84)} C ${g.cx + 88} ${g.toScreenY(84)}, ${g.cx + 88} ${g.toScreenY(26)}, ${g.cx + 56} ${g.toScreenY(26)}" fill="none" stroke="url(#${id}-copper)" stroke-width="7" stroke-linecap="round"/>
         <path d="M ${g.cx + 58} ${g.toScreenY(80)} C ${g.cx + 82} ${g.toScreenY(80)}, ${g.cx + 82} ${g.toScreenY(32)}, ${g.cx + 58} ${g.toScreenY(32)}" fill="none" stroke="rgba(255,220,180,0.35)" stroke-width="1.2" stroke-linecap="round"/>`
      : '';

    const frost = metal === 'silver' || /frost/i.test(this.recipe.ice || '')
      ? `<path d="${g.outerPath}" fill="url(#${id}-frost)" opacity="0.6"/>`
      : '';

    this.container.innerHTML = `
      <svg class="glass-viz-svg" viewBox="0 ${g.viewTop} ${VIEW_W} ${g.viewH}" role="img" aria-label="${(this.recipe.name || 'Cocktail').replace(/"/g, '')} in a ${g.spec.label} glass">
        <defs>
          <clipPath id="${id}-clip"><path d="${g.innerPath}"/></clipPath>
          <clipPath id="${id}-outer"><path d="${g.outerPath}"/></clipPath>
          <linearGradient id="${id}-rimGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="rgba(255,255,255,0.6)"/>
            <stop offset="0.5" stop-color="rgba(255,255,255,0.16)"/>
            <stop offset="1" stop-color="rgba(255,255,255,0.42)"/>
          </linearGradient>
          <linearGradient id="${id}-copper" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#F3B07A"/><stop offset="0.45" stop-color="#C46A32"/><stop offset="1" stop-color="#8A4420"/>
          </linearGradient>
          <linearGradient id="${id}-base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="rgba(255,255,255,0.16)"/><stop offset="1" stop-color="rgba(255,255,255,0.05)"/>
          </linearGradient>
          <radialGradient id="${id}-spot" cx="0.5" cy="0.45" r="0.55">
            <stop offset="0" stop-color="rgba(245,190,110,0.16)"/>
            <stop offset="1" stop-color="rgba(245,190,110,0)"/>
          </radialGradient>
          <radialGradient id="${id}-backlight" cx="0.5" cy="0.62" r="0.5">
            <stop offset="0" stop-color="rgba(255,244,225,0.15)"/>
            <stop offset="1" stop-color="rgba(255,244,225,0.03)"/>
          </radialGradient>
          <radialGradient id="${id}-shadow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stop-color="rgba(0,0,0,0.55)"/>
            <stop offset="1" stop-color="rgba(0,0,0,0)"/>
          </radialGradient>
          <linearGradient id="${id}-depth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="rgba(255,255,255,0.06)"/>
            <stop offset="0.35" stop-color="rgba(0,0,0,0)"/>
            <stop offset="1" stop-color="rgba(0,0,0,0.26)"/>
          </linearGradient>
          <linearGradient id="${id}-cyl" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="rgba(0,0,0,0.32)"/>
            <stop offset="0.14" stop-color="rgba(0,0,0,0.06)"/>
            <stop offset="0.28" stop-color="rgba(255,255,255,0.12)"/>
            <stop offset="0.4" stop-color="rgba(255,255,255,0)"/>
            <stop offset="0.82" stop-color="rgba(0,0,0,0.06)"/>
            <stop offset="1" stop-color="rgba(0,0,0,0.34)"/>
          </linearGradient>
          <linearGradient id="${id}-ice" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="rgba(255,255,255,0.42)"/>
            <stop offset="0.45" stop-color="rgba(205,228,255,0.1)"/>
            <stop offset="0.8" stop-color="rgba(235,245,255,0.16)"/>
            <stop offset="1" stop-color="rgba(255,255,255,0.3)"/>
          </linearGradient>
          <linearGradient id="${id}-foam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#FFFBF0"/><stop offset="0.6" stop-color="#F3E8CE"/><stop offset="1" stop-color="#E2D2AE"/>
          </linearGradient>
          <linearGradient id="${id}-stream" x1="0" y1="0" x2="1" y2="0">
            <stop class="s0" offset="0"/><stop class="s1" offset="0.32"/><stop class="s2" offset="0.45"/><stop class="s3" offset="0.62"/><stop class="s4" offset="1"/>
          </linearGradient>
          <pattern id="${id}-frost" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.3" r="0.8" fill="rgba(255,255,255,0.35)"/>
            <circle cx="3.8" cy="3.6" r="0.55" fill="rgba(255,255,255,0.25)"/>
          </pattern>
        </defs>

        ${this.compact ? '' : `<ellipse cx="${g.cx}" cy="${(g.viewTop + g.viewH * 0.52).toFixed(1)}" rx="${VIEW_W * 0.5}" ry="${(g.viewH * 0.52).toFixed(1)}" fill="url(#${id}-spot)"/>`}
        <ellipse cx="${g.cx}" cy="${BASELINE + 3}" rx="${shadowR.toFixed(1)}" ry="5" fill="url(#${id}-shadow)"/>
        <ellipse class="gv-caustic" cx="${g.cx}" cy="${BASELINE + 3}" rx="${(shadowR * 0.7).toFixed(1)}" ry="3.5" fill="transparent"/>

        <path d="${g.outerPath}" fill="${glassFill}"/>
        ${baseBlock}

        <g clip-path="url(#${id}-clip)">
          <rect x="0" y="${g.viewTop}" width="${VIEW_W}" height="${g.viewH}" fill="url(#${id}-backlight)"/>
          <g class="gv-layers"></g>
          <path class="gv-blend" d=""/>
          <path class="gv-shade-depth" d="" fill="url(#${id}-depth)"/>
          <path class="gv-shade-cyl" d="" fill="url(#${id}-cyl)"/>
          <g class="gv-solids"></g>
          <g class="gv-aerate"></g>
          <path class="gv-foam" d="" fill="url(#${id}-foam)"/>
          <g class="gv-foam-dots"></g>
          <g class="gv-bubbles"></g>
          <path class="gv-sheen" d="" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3"/>
          <g class="gv-ice"></g>
          <path class="gv-meniscus" d="" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="0.9" stroke-linecap="round"/>
          <g class="gv-ripples"></g>
        </g>

        ${frost}
        <g class="gv-condensation" clip-path="url(#${id}-outer)" opacity="0"></g>
        <path d="${g.outerPath}" fill="none" stroke="${glassStroke}" stroke-width="1.5" stroke-linejoin="round"/>
        <polyline points="${streak(0.1, 0.88, -0.82)}" fill="none" stroke="rgba(255,255,255,${metal ? 0.22 : 0.17})" stroke-width="3.4" stroke-linecap="round"/>
        <polyline points="${streak(0.16, 0.6, -0.68)}" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1.2" stroke-linecap="round"/>
        <polyline points="${streak(0.3, 0.72, 0.88)}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-linecap="round"/>
        ${handle}
        <g class="gv-ice-top"></g>
        <g class="gv-rim"></g>
        <g class="gv-drops"></g>
        <path class="gv-stream" d="" fill="url(#${id}-stream)"/>
        <g class="gv-splash"></g>
        <g class="gv-garnish"></g>
      </svg>
    `;

    const svg = this.container.querySelector('svg');
    this.svg = svg;
    const q = (sel) => svg.querySelector(sel);
    this.el = {
      layers: q('.gv-layers'), blend: q('.gv-blend'), shadeDepth: q('.gv-shade-depth'), shadeCyl: q('.gv-shade-cyl'),
      solids: q('.gv-solids'), aerate: q('.gv-aerate'), foam: q('.gv-foam'), foamDots: q('.gv-foam-dots'),
      bubbles: q('.gv-bubbles'), sheen: q('.gv-sheen'), ice: q('.gv-ice'), meniscus: q('.gv-meniscus'), ripples: q('.gv-ripples'),
      condensation: q('.gv-condensation'), iceTop: q('.gv-ice-top'), rim: q('.gv-rim'), drops: q('.gv-drops'),
      stream: q('.gv-stream'), splash: q('.gv-splash'), garnish: q('.gv-garnish'), caustic: q('.gv-caustic'),
      streamStops: ['s0', 's1', 's2', 's3', 's4'].map(c => q(`.${c}`)),
      defs: q('defs')
    };

    this.layerEls = this.layers.map(() => {
      const p = document.createElementNS(SVG_NS, 'path');
      this.el.layers.appendChild(p);
      return p;
    });

    this.buildIce();
    this.buildSolids();
    this.buildRim();
    this.buildGarnish();
    this.buildBubbles();
    this.buildCondensation();
  }

  // --- Static scene pieces -------------------------------------------------
  buildIce() {
    const g = this.geo;
    const id = this.uid;
    const rand = seededRandom(`${this.recipe.id}-ice`);
    const cubes = [];
    const cube = (x, y, s, rot, big = false) => {
      const grp = document.createElementNS(SVG_NS, 'g');
      grp.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})`);
      const h = s / 2;
      const inset = s * 0.13;
      let inner = '';
      if (big) {
        inner += `<ellipse cx="${(s * 0.06).toFixed(1)}" cy="${(s * 0.08).toFixed(1)}" rx="${(s * 0.22).toFixed(1)}" ry="${(s * 0.18).toFixed(1)}" fill="rgba(255,255,255,0.07)"/>`;
        for (let k = 0; k < 5; k++) inner += `<circle cx="${((rand() - 0.5) * s * 0.4).toFixed(1)}" cy="${((rand() - 0.5) * s * 0.4).toFixed(1)}" r="${(0.4 + rand() * 0.6).toFixed(2)}" fill="rgba(255,255,255,0.35)"/>`;
      }
      grp.innerHTML = `
        <rect x="${-h}" y="${-h}" width="${s}" height="${s}" rx="${Math.max(2.2, s * 0.15)}" fill="url(#${id}-ice)" stroke="rgba(255,255,255,0.55)" stroke-width="0.8"/>
        <rect x="${-h + inset}" y="${-h + inset}" width="${s - inset * 2}" height="${s - inset * 2}" rx="${Math.max(1.4, s * 0.1)}" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="0.7"/>
        ${inner}
        <path d="M ${-h + 2.6} ${(-h + s * 0.34).toFixed(1)} L ${-h + 2.6} ${-h + 2.6} L ${(-h + s * 0.38).toFixed(1)} ${-h + 2.6}" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.1" stroke-linecap="round"/>
        <path d="M ${(h - 2.4).toFixed(1)} ${(h - s * 0.3).toFixed(1)} L ${(h - 2.4).toFixed(1)} ${(h - 2.4).toFixed(1)} L ${(h - s * 0.26).toFixed(1)} ${(h - 2.4).toFixed(1)}" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="0.8" stroke-linecap="round"/>
      `;
      cubes.push({ el: grp });
      return grp;
    };

    if (this.iceType === 'large') {
      const s = Math.min(2 * g.radiusAt(0) * 0.78, 2 * g.radiusAt(20) * 0.78, 64, g.height * 0.62);
      this.el.ice.appendChild(cube(g.cx, g.floorY - s / 2 - 1, s, -4 + rand() * 8, true));
    } else if (this.iceType === 'cubes') {
      const s = clamp(g.radiusAt(g.height * 0.5) * 0.62, 18, 28);
      const topLimit = g.height - s * 0.3;
      let y = s / 2 + 1;
      let row = 0;
      while (y < topLimit) {
        const r = g.radiusAt(y) - 2;
        const cols = Math.max(1, Math.floor((2 * r) / (s + 1)));
        const span = cols * (s + 1);
        for (let c = 0; c < cols; c++) {
          const x = g.cx - span / 2 + (s + 1) * (c + 0.5) + (row % 2 ? 3 : -3) + (rand() - 0.5) * 3;
          this.el.ice.appendChild(cube(x, g.toScreenY(y) + (rand() - 0.5) * 2, s, (rand() - 0.5) * 18));
        }
        y += s * 0.92;
        row++;
      }
    } else if (this.iceType === 'crushed') {
      const pieces = [];
      const area = 2 * g.radiusAt(g.height * 0.5) * g.height;
      const n = clamp(Math.round(area / 55), 22, 120);
      for (let i = 0; i < n; i++) {
        const y = rand() * (g.height + 4);
        const r = g.radiusAt(Math.min(y, g.height));
        pieces.push([g.cx + (rand() * 2 - 1) * (r - 3), g.toScreenY(y), 3.5 + rand() * 5]);
      }
      const rimR = g.radiusAt(g.height);
      for (let i = 0; i < 18; i++) {
        const x = g.cx + (rand() * 2 - 1) * rimR * 0.92;
        const bulge = (1 - Math.pow((x - g.cx) / rimR, 2)) * 13;
        pieces.push([x, g.rimY - rand() * bulge, 3.5 + rand() * 4, true]);
      }
      pieces.forEach(([x, y, s, above]) => {
        const pts = [];
        const sides = 5 + Math.floor(rand() * 3);
        for (let k = 0; k < sides; k++) {
          const ang = (k / sides) * Math.PI * 2 + rand() * 0.5;
          const rr = s * (0.6 + rand() * 0.4);
          pts.push([x + Math.cos(ang) * rr, y + Math.sin(ang) * rr]);
        }
        const grp = document.createElementNS(SVG_NS, 'g');
        grp.innerHTML = `<polygon points="${pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ')}" fill="url(#${id}-ice)" stroke="rgba(255,255,255,0.5)" stroke-width="0.6"/>
          <line x1="${pts[0][0].toFixed(1)}" y1="${pts[0][1].toFixed(1)}" x2="${pts[1][0].toFixed(1)}" y2="${pts[1][1].toFixed(1)}" stroke="rgba(255,255,255,0.75)" stroke-width="0.8" stroke-linecap="round"/>`;
        (above ? this.el.iceTop : this.el.ice).appendChild(grp);
        cubes.push({ el: grp });
      });
    }
    this.iceCubes = cubes;
  }

  buildSolids() {
    if (!this.plan.muddled) return;
    const g = this.geo;
    const rand = seededRandom(`${this.recipe.id}-solids`);
    const pieces = [];
    this.plan.solids.filter(s => s.kind === 'solid').forEach(s => {
      const id = s.ing.id || '';
      const n = clamp(Math.round(s.ing.amount || 3), 2, 7);
      for (let i = 0; i < n; i++) {
        const y = rand() * Math.max(6, this.mainTopY * 0.55) + 2;
        const r = g.radiusAt(y) - 6;
        const x = g.cx + (rand() * 2 - 1) * r;
        const el = document.createElementNS(SVG_NS, 'g');
        const sy = g.toScreenY(y);
        if (/mint|basil/.test(id)) {
          el.innerHTML = `<path d="M -6 0 Q -1 -4.8 6 0 Q -1 4.8 -6 0 Z" fill="${s.color[0]}" stroke="rgba(20,60,30,0.6)" stroke-width="0.5"/><path d="M -5 0 L 5 0" stroke="rgba(20,60,30,0.6)" stroke-width="0.4"/>`;
        } else if (/ginger|peach/.test(id)) {
          el.innerHTML = `<path d="M -4 -3 L 4 -3 L 5 3 L -5 3 Z" fill="${s.color[0]}" stroke="rgba(0,0,0,0.15)" stroke-width="0.4"/>`;
        } else {
          el.innerHTML = `<circle r="3.4" fill="${s.color[0]}"/><circle cx="-1" cy="-1" r="1" fill="rgba(255,255,255,0.35)"/>`;
        }
        el.setAttribute('transform', `translate(${x.toFixed(1)} ${sy.toFixed(1)}) rotate(${(rand() * 360).toFixed(0)})`);
        el.setAttribute('opacity', '0');
        this.el.solids.appendChild(el);
        pieces.push(el);
      }
    });
    this.solidEls = pieces;
  }

  buildRim() {
    if (!this.garnish.rim) return;
    const g = this.geo;
    const rand = seededRandom(`${this.recipe.id}-rim`);
    const r = g.radiusAt(g.height) + WALL / 2;
    let html = '';
    [-1, 1].forEach(side => {
      for (let i = 0; i < 38; i++) {
        const dy = Math.pow(rand(), 1.6) * 10;
        const x = g.cx + side * (r + (rand() - 0.5) * 3.6);
        const s = 0.7 + rand() * 1.2;
        html += `<rect x="${(x - s / 2).toFixed(2)}" y="${(g.rimY + dy - s / 2).toFixed(2)}" width="${s.toFixed(2)}" height="${s.toFixed(2)}" transform="rotate(${(rand() * 90).toFixed(0)} ${x.toFixed(1)} ${(g.rimY + dy).toFixed(1)})" fill="${this.garnish.rim}" opacity="${(0.7 + rand() * 0.3).toFixed(2)}"/>`;
      }
    });
    this.el.rim.innerHTML = html;
  }

  buildGarnish() {
    const g = this.geo;
    const gar = this.garnish;
    const rimR = g.radiusAt(g.height) + WALL;
    const items = [];
    let defs = '';

    const add = (art, x, y, rot = 0, inGlass = false, scale = 1) => {
      defs += art.defs;
      const grp = document.createElementNS(SVG_NS, 'g');
      grp.innerHTML = art.body;
      grp.setAttribute('opacity', '0');
      this.el.garnish.appendChild(grp);
      items.push({ el: grp, x, y, rot, inGlass, scale });
    };

    const surfaceTop = g.toScreenY(Math.max(this.liquidTopY, this.mainTopY + this.foamHeight));
    if (gar.wheel) add(GARNISH_ART.wheel(this.uid, gar.wheel), g.cx + rimR - 4, g.rimY + 2, -16);
    else if (gar.twist) add(GARNISH_ART.twist(this.uid, gar.twist), g.cx + rimR - 20, g.rimY - 3, 6);
    if (gar.apple) {
      const onLeft = Boolean(gar.wheel || gar.twist);
      add(GARNISH_ART.apple(this.uid, gar.apple), onLeft ? g.cx - rimR + 6 : g.cx + rimR - 8, g.rimY - (gar.apple.dried ? -2 : 4), onLeft ? 18 : -14, false, 0.95);
    }
    if (gar.pineapple) add(GARNISH_ART.pineapple(this.uid), g.cx - rimR + 8, g.rimY + 2, -14, false, 0.9);
    if (gar.cherry) {
      const restY = this.iceType === 'none' ? g.floorY - 7.5 : g.rimY + 4;
      add(GARNISH_ART.cherry(this.uid, gar.cherry), g.cx - 6, restY, 0, this.iceType === 'none');
    }
    if (gar.olive) add(GARNISH_ART.olive(this.uid, gar.olive), g.cx - 4, g.rimY + Math.min(28, g.height * 0.38), 0, true);
    if (gar.onion) add(GARNISH_ART.onion(this.uid, gar.onion), g.cx - 2, g.rimY + Math.min(26, g.height * 0.36), 0, true);
    if (gar.berries) add(GARNISH_ART.berries(this.uid, gar.berries), g.cx + 4, g.rimY - 2, 0);
    if (gar.ginger) add(GARNISH_ART.ginger(this.uid), g.cx + rimR - 10, g.rimY - 4, 0);
    if (gar.mint) add(GARNISH_ART.mint(this.uid, gar.mint), g.cx - rimR * 0.42, g.rimY + 8, -8, false, 1.05);
    if (gar.beans) add(GARNISH_ART.beans(this.uid), g.cx, surfaceTop - 1, 0, true);

    if (defs) this.el.defs.insertAdjacentHTML('beforeend', defs);
    this.garnishItems = items;

    if (gar.dust) {
      const rand = seededRandom(`${this.recipe.id}-dust`);
      const top = Math.max(this.liquidTopY, this.mainTopY + this.foamHeight);
      const r = g.radiusAt(top) * 0.72;
      const colors = { spice: ['#7A4A26', '#9A6232', '#5A3218'], chocolate: ['#2A160A', '#3E2212', '#1A0C04'], coconut: ['#FFFFFF', '#F2EEE4', '#E6DFCF'] }[gar.dust];
      let dots = '';
      for (let i = 0; i < 34; i++) {
        const c = colors[i % 3];
        const x = g.cx + (rand() * 2 - 1) * r;
        const y = g.toScreenY(top) + 0.6 + rand() * 2.2;
        dots += gar.dust === 'spice'
          ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.35 + rand() * 0.55).toFixed(2)}" fill="${c}"/>`
          : `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(1 + rand() * 1.6).toFixed(2)}" height="0.6" transform="rotate(${(rand() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${c}"/>`;
      }
      this.dustHtml = dots;
    }
  }

  buildBubbles() {
    this.bubbles = [];
    if (!this.plan.isFizzy && !this.plan.isSparklingWine) return;
    const n = this.compact ? 6 : (this.plan.isSparklingWine ? 34 : 24);
    for (let i = 0; i < n; i++) {
      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('fill', 'rgba(255,255,255,0.16)');
      c.setAttribute('stroke', 'rgba(255,255,255,0.7)');
      c.setAttribute('stroke-width', '0.35');
      c.setAttribute('opacity', '0');
      this.el.bubbles.appendChild(c);
      this.bubbles.push({ el: c, ...this.spawnBubble(true) });
    }
  }

  spawnBubble(initial = false) {
    const fine = this.plan.isSparklingWine;
    // Champagne bubbles stream from nucleation points; soda bubbles are scattered
    const lane = fine ? [-0.35, 0, 0.3][Math.floor(Math.random() * 3)] : (Math.random() * 2 - 1) * 0.8;
    return {
      lane,
      y: initial ? Math.random() * this.mainTopY : Math.random() * 3,
      r: fine ? 0.55 + Math.random() * 0.55 : 0.7 + Math.random() * 1.4,
      speed: (fine ? 22 + Math.random() * 12 : 11 + Math.random() * 14) / Math.sqrt(TEMPO),
      wobble: Math.random() * Math.PI * 2
    };
  }

  // Beads of condensation that form on the outside of chilled glasses
  buildCondensation() {
    if (!this.chilled) return;
    const g = this.geo;
    const rand = seededRandom(`${this.recipe.id}-dew`);
    const n = clamp(Math.round(g.height * 0.32), 14, 48);
    let html = '';
    for (let i = 0; i < n; i++) {
      const y = 3 + Math.pow(rand(), 1.3) * (Math.min(this.liquidTopY, g.height) - 5);
      const r = g.radiusAt(y) + WALL;
      // Beads gather toward the edges of the glass where it curves away
      const side = rand() < 0.5 ? -1 : 1;
      const x = g.cx + side * r * (1 - Math.pow(rand(), 1.8) * 0.9);
      const s = 0.35 + Math.pow(rand(), 2.2) * 0.9;
      const sy = g.toScreenY(y);
      html += `<ellipse cx="${x.toFixed(1)}" cy="${sy.toFixed(1)}" rx="${s.toFixed(2)}" ry="${(s * 1.3).toFixed(2)}" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.28)" stroke-width="0.2"/>`;
      if (s > 0.7) html += `<circle cx="${(x - s * 0.3).toFixed(2)}" cy="${(sy - s * 0.45).toFixed(2)}" r="${(s * 0.26).toFixed(2)}" fill="rgba(255,255,255,0.6)"/>`;
    }
    // A couple of drips running down
    for (let k = 0; k < 2; k++) {
      const x = g.cx + (k ? 0.55 : -0.3) * g.radiusAt(g.height * 0.4);
      const y0 = g.toScreenY(g.height * (0.55 - k * 0.15));
      html += `<path d="M ${x.toFixed(1)} ${y0.toFixed(1)} l 0 9" stroke="rgba(255,255,255,0.18)" stroke-width="1" stroke-linecap="round"/><ellipse cx="${x.toFixed(1)}" cy="${(y0 + 10).toFixed(1)}" rx="1.1" ry="1.5" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.45)" stroke-width="0.25"/>`;
    }
    this.el.condensation.innerHTML = html;
  }

  // --- Legend --------------------------------------------------------------
  renderLegend() {
    if (!this.legendEl) return;
    const fmt = this.formatAmount || ((ing) => `${ing.amount ?? ''} ${ing.unit ?? ''}`.trim());
    const rows = this.recipe.ingredients.map((ing, idx) => {
      const layer = this.layers.find(l => l.idx === idx);
      const dash = this.plan.dashes.find(d => d.idx === idx);
      const solid = this.plan.solids.find(s => s.idx === idx);
      const color = (layer || dash || solid)?.color || colorFor(ing);
      const swatchClass = dash ? 'drop' : solid ? (solid.kind === 'foam' ? 'foam' : 'solid') : 'liquid';
      const fill = swatchClass === 'liquid' ? rgba(hexToRgb(color[0]), Math.max(color[1], 0.35)) : color[0];
      return `
        <li class="gv-legend-row" data-legend-idx="${idx}">
          <span class="gv-swatch ${swatchClass}" style="--sw:${fill}"></span>
          <span class="gv-legend-amt">${fmt(ing)}</span>
          <span class="gv-legend-name">${shortName(ing.name)}</span>
        </li>`;
    }).join('');
    this.legendEl.innerHTML = `<ul class="gv-legend">${rows}</ul>`;
    this.legendRows = Array.from(this.legendEl.querySelectorAll('[data-legend-idx]'));
    if (this.animate) this.legendRows.forEach(r => r.classList.add('pending'));
  }

  setLegendState(idx, stateName) {
    if (!this.legendRows) return;
    const row = this.legendRows.find(r => Number(r.dataset.legendIdx) === idx);
    if (!row) return;
    row.classList.toggle('pending', stateName === 'pending');
    row.classList.toggle('active', stateName === 'active');
  }

  // --- Animation loop ------------------------------------------------------
  start() {
    this.startTime = null;
    this.lastTs = null;
    const tick = (ts) => {
      if (this.destroyed) return;
      if (this.startTime === null) this.startTime = ts;
      this.drawAt(ts - this.startTime, ts);
      if (!this.animate) return; // finished; drawAt may have handed off to the idle loop
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  startIdle() {
    const tick = (ts) => {
      if (this.destroyed) return;
      this.drawAt(this.totalDuration + 6000, ts);
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  replay() {
    if (this.reducedMotion) return;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.animate = true;
    this.splash = [];
    this.aeration = [];
    this.ripples = [];
    if (this.legendRows) this.legendRows.forEach(r => { r.classList.add('pending'); r.classList.remove('active'); });
    this.start();
  }

  destroy() {
    this.destroyed = true;
    if (this.frame) cancelAnimationFrame(this.frame);
  }

  // Liquid surface: two travelling sines for an organic ripple
  waveY(baseY, x, amp, phase) {
    return baseY + Math.sin(x * 0.085 + phase) * amp + Math.sin(x * 0.23 - phase * 1.3) * amp * 0.32;
  }

  // Interfaces between layers swirl while the drink is shaken or stirred together
  interfaceY(baseY, x, amp, phase, k) {
    if (amp <= 0.01) return baseY;
    return baseY + Math.sin(x * 0.055 + phase * 0.7 + k * 1.9) * amp + Math.sin(x * 0.14 - phase * 1.1 + k) * amp * 0.45;
  }

  edge(fn, step = 4) {
    const pts = [];
    for (let x = 0; x <= VIEW_W; x += step) pts.push(`${x} ${fn(x).toFixed(2)}`);
    return pts;
  }

  drawAt(t, ts = 0) {
    const g = this.geo;
    const done = t >= this.totalDuration;
    const phase = ts / (380 * Math.sqrt(TEMPO));
    const dt = this.lastTs ? Math.min(0.05, (ts - this.lastTs) / 1000) : 0;
    this.lastTs = ts;
    const live = this.animate || (!this.compact && !this.reducedMotion);

    // Ice settles in first, with a little bounce
    if (this.iceCubes && this.iceCubes.length) {
      const k = this.animate ? easeOutBack(clamp(t / this.iceDur, 0, 1)) : 1;
      const lift = (1 - k) * -70;
      const op = this.animate ? clamp(t / (this.iceDur * 0.4), 0, 1) : 1;
      [this.el.ice, this.el.iceTop].forEach(el => {
        el.setAttribute('transform', `translate(0 ${lift.toFixed(1)})`);
        el.setAttribute('opacity', op.toFixed(2));
      });
    }

    // Progress of each event
    let activePour = null;
    let surfaceAmp = 0.4;
    let foamProgress = 0;
    let blendProgress = 0;
    let blendRaw = 0;
    let garnishProgress = 0;
    const fills = this.layers.map(() => 0);

    this.events.forEach(ev => {
      const p = clamp((t - ev.start) / (ev.end - ev.start), 0, 1);
      if (ev.kind === 'pour') {
        const i = this.layers.indexOf(ev.layer);
        fills[i] = easeInOut(p);
        if (p > 0 && p < 1) {
          activePour = { layer: ev.layer, p, idx: i };
          surfaceAmp = Math.max(surfaceAmp, 1.4 + 1.2 * Math.sin(p * Math.PI));
          this.setLegendState(ev.layer.idx, 'active');
        } else if (p >= 1) {
          this.setLegendState(ev.layer.idx, 'done');
        }
      } else if (ev.kind === 'blend') {
        blendRaw = p;
        blendProgress = easeInOut(p);
        if (p > 0 && p < 1) surfaceAmp = Math.max(surfaceAmp, 1.8 * Math.sin(p * Math.PI));
      } else if (ev.kind === 'foam') {
        foamProgress = easeOutCubic(p);
      } else if (ev.kind === 'garnish') {
        garnishProgress = p;
      } else if (ev.kind === 'drop' && p > 0) {
        this.setLegendState(ev.dash.idx, p >= 1 ? 'done' : 'active');
      }
    });
    if (done) {
      this.layers.forEach((_, i) => { fills[i] = 1; });
      if (this.shouldBlend) blendProgress = 1;
      if (this.plan.hasFoam) foamProgress = 1;
      garnishProgress = 1;
      if (this.legendRows) this.legendRows.forEach(r => r.classList.remove('pending', 'active'));
    }
    if (this.legendRows && t > 200) {
      this.plan.solids.forEach(s => this.setLegendState(s.idx, s.kind === 'foam' ? (foamProgress > 0 ? 'done' : 'pending') : 'done'));
    }

    // Current height of each layer's top
    const tops = this.layers.map((l, i) => lerp(l.y0, l.y1, fills[i]));
    let topIdx = -1;
    this.layers.forEach((_, i) => { if (fills[i] > 0) topIdx = i; });
    const topY = topIdx >= 0 ? tops[topIdx] : 0;
    const swirlAmp = blendRaw > 0 && blendRaw < 1 ? 6 * Math.sin(blendRaw * Math.PI) : 0;
    const merged = blendProgress >= 1 && this.shouldBlend;
    const foamOn = foamProgress > 0;

    // Boundary function for the top of layer i
    const topEdge = (i) => {
      const yS = g.toScreenY(tops[i]);
      const isSurface = i === topIdx && !(foamOn && !this.layers[i].float);
      if (isSurface) return (x) => this.waveY(yS, x, surfaceAmp, phase);
      const nextPouring = activePour && activePour.idx === i + 1 ? 0.9 * Math.sin(activePour.p * Math.PI) : 0;
      const amp = (this.layers[i].float ? 0 : swirlAmp) + nextPouring;
      return (x) => this.interfaceY(yS, x, amp, phase, i);
    };
    const floorEdge = () => g.toScreenY(this.layers.length ? this.layers[0].y0 : 0) + 0.6;

    // Liquid layers (or the merged blend)
    this.layers.forEach((layer, i) => {
      const el = this.layerEls[i];
      if (fills[i] <= 0 || (merged && !layer.float)) {
        el.setAttribute('d', '');
        return;
      }
      const top = this.edge(topEdge(i));
      const bot = this.edge(i > 0 ? topEdge(i - 1) : floorEdge).reverse();
      el.setAttribute('d', `M ${top.join(' L ')} L ${bot.join(' L ')} Z`);
      let rgb = layer.rgb;
      let a = layer.alpha;
      if (blendProgress > 0 && !layer.float) {
        rgb = rgb.map((c, k) => lerp(c, this.blendRgb[k], blendProgress));
        a = lerp(a, this.blendAlpha, blendProgress);
      }
      el.setAttribute('fill', rgba(rgb, a));
    });

    if (merged && this.mainCount) {
      const lastMain = this.mainCount - 1;
      const top = this.edge(topEdge(lastMain));
      const yBot = floorEdge();
      this.el.blend.setAttribute('d', `M ${top.join(' L ')} L ${VIEW_W} ${yBot.toFixed(1)} L 0 ${yBot.toFixed(1)} Z`);
      this.el.blend.setAttribute('fill', rgba(this.blendRgb, this.blendAlpha));
    } else {
      this.el.blend.setAttribute('d', '');
    }

    // Depth and cylindrical shading over the liquid body
    const bodyTop = topIdx >= 0 ? (foamOn ? Math.min(topY, this.mainTopY) : topY) : 0;
    const body = topIdx >= 0 ? g.bodyPath(this.layers[0].y0, Math.max(this.layers[0].y0, bodyTop)) : '';
    this.el.shadeDepth.setAttribute('d', body);
    this.el.shadeCyl.setAttribute('d', body);

    // Meniscus and sheen on the visible surface
    const surfaceVisible = topIdx >= 0 && (!foamOn || this.layers[topIdx].float) && topY > 0.5;
    if (surfaceVisible) {
      const yS = g.toScreenY(topY);
      const r = g.radiusAt(topY);
      const xL = g.cx - r + 0.6;
      const xR = g.cx + r - 0.6;
      let d = `M ${xL.toFixed(1)} ${(yS - 2.4).toFixed(1)} Q ${(xL + 2.2).toFixed(1)} ${(yS - 0.2).toFixed(1)} ${(xL + 5).toFixed(1)} ${this.waveY(yS, xL + 5, surfaceAmp, phase).toFixed(2)}`;
      for (let x = Math.ceil((xL + 8) / 4) * 4; x < xR - 5; x += 4) d += ` L ${x} ${this.waveY(yS, x, surfaceAmp, phase).toFixed(2)}`;
      d += ` L ${(xR - 5).toFixed(1)} ${this.waveY(yS, xR - 5, surfaceAmp, phase).toFixed(2)} Q ${(xR - 2.2).toFixed(1)} ${(yS - 0.2).toFixed(1)} ${xR.toFixed(1)} ${(yS - 2.4).toFixed(1)}`;
      this.el.meniscus.setAttribute('d', d);
      this.el.sheen.setAttribute('d', `M ${this.edge((x) => this.waveY(yS, x, surfaceAmp, phase) + 2.6, 6).join(' L ')}`);
    } else {
      this.el.meniscus.setAttribute('d', '');
      this.el.sheen.setAttribute('d', '');
    }

    // Light through the drink tints the bar top
    if (topIdx >= 0) {
      const glowRgb = blendProgress > 0 ? this.blendRgb : this.layers[topIdx].rgb;
      this.el.caustic.setAttribute('fill', rgba(glowRgb, 0.24));
    }

    // Pour stream: tapered, wobbling, with a bright core
    const surfaceScreenY = g.toScreenY(topY);
    const streamX = g.cx + 8;
    if (activePour && !this.compact) {
      const { layer, p } = activePour;
      if (this.streamLayer !== layer) {
        this.streamLayer = layer;
        const a = Math.max(0.6, layer.alpha);
        const stops = [rgba(layer.rgb.map(c => c * 0.8), a), rgba(layer.rgb, a), rgba(layer.rgb.map(c => c + (255 - c) * 0.55), Math.min(1, a + 0.15)), rgba(layer.rgb, a), rgba(layer.rgb.map(c => c * 0.7), a)];
        this.el.streamStops.forEach((s, k) => s.setAttribute('stop-color', stops[k]));
      }
      const headIn = clamp(p / 0.1, 0, 1);
      const tailOut = clamp((p - 0.84) / 0.16, 0, 1);
      const y0 = lerp(g.viewTop - 4, surfaceScreenY, easeInOut(tailOut));
      const y1 = lerp(g.viewTop - 4, surfaceScreenY, easeOutCubic(headIn));
      if (y1 - y0 > 0.5) {
        const left = [];
        const right = [];
        const ys = [];
        for (let y = y0; y < y1; y += 4) ys.push(y);
        ys.push(y1);
        for (const y of ys) {
          const f = (y - g.viewTop) / Math.max(1, surfaceScreenY - g.viewTop);
          const w = lerp(5.2, 3.1, f) * (1 - tailOut * 0.55);
          const xc = streamX + Math.sin(y * 0.12 + ts / 80) * 0.5 * f;
          left.push(`${(xc - w / 2).toFixed(2)} ${y.toFixed(1)}`);
          right.push(`${(xc + w / 2).toFixed(2)} ${y.toFixed(1)}`);
        }
        this.el.stream.setAttribute('d', `M ${left.join(' L ')} L ${right.reverse().join(' L ')} Z`);
      } else {
        this.el.stream.setAttribute('d', '');
      }

      // Splash droplets and aeration bubbles at the point of impact
      if (headIn >= 1 && tailOut < 1 && dt > 0) {
        const rate = 34 * (1 - tailOut);
        if (Math.random() < rate * dt) {
          this.splash.push({ x: streamX + (Math.random() - 0.5) * 3, y: surfaceScreenY - 1, vx: (Math.random() - 0.5) * 34, vy: -(18 + Math.random() * 30), r: 0.6 + Math.random() * 0.9, rgb: layer.rgb, a: Math.max(0.65, layer.alpha) });
        }
        if (Math.random() < rate * 1.4 * dt) {
          this.aeration.push({ x: streamX + (Math.random() - 0.5) * 6, y: surfaceScreenY + 3 + Math.random() * 12, vx: (Math.random() - 0.5) * 8, vy: -(6 + Math.random() * 10), r: 0.45 + Math.random() * 0.9, life: 0.7 + Math.random() * 0.8 });
        }
      }
    } else {
      this.el.stream.setAttribute('d', '');
      this.streamLayer = null;
    }

    // Shaking/stirring stirs up fine bubbles through the body
    if (blendRaw > 0 && blendRaw < 1 && dt > 0 && Math.random() < 30 * dt * Math.sin(blendRaw * Math.PI)) {
      const y = lerp(this.layers[0].y0 + 2, Math.max(4, topY - 2), Math.random());
      const r = g.radiusAt(y) * 0.85;
      this.aeration.push({ x: g.cx + (Math.random() * 2 - 1) * r, y: g.toScreenY(y), vx: (Math.random() - 0.5) * 10, vy: -(5 + Math.random() * 8), r: 0.4 + Math.random() * 0.7, life: 0.8 + Math.random() * 0.8 });
    }

    // Advance particles
    if (dt > 0) {
      this.splash.forEach(s => { s.vy += 150 * dt; s.x += s.vx * dt; s.y += s.vy * dt; });
      this.splash = this.splash.filter(s => s.y < surfaceScreenY + 1 || s.vy < 0);
      this.aeration.forEach(b => { b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt; });
      this.aeration = this.aeration.filter(b => b.life > 0 && b.y > surfaceScreenY + 1);
      this.ripples.forEach(r => { r.age += dt; });
      this.ripples = this.ripples.filter(r => r.age < 0.9);
    }
    this.el.splash.innerHTML = this.splash.map(s => `<circle cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="${s.r.toFixed(2)}" fill="${rgba(s.rgb, s.a)}"/>`).join('');
    this.el.aerate.innerHTML = this.aeration.map(b => `<circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="${b.r.toFixed(2)}" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,${(0.6 * Math.min(1, b.life * 2)).toFixed(2)})" stroke-width="0.3"/>`).join('');

    // Bitters drops with a ripple where they land
    let dropsHtml = '';
    this.events.forEach(ev => {
      if (ev.kind !== 'drop') return;
      const p = (t - ev.start) / (ev.end - ev.start);
      if (p >= 1 && !ev.rippled && live && t - ev.end < 500) {
        ev.rippled = true;
        this.ripples.push({ x: ev.x, age: 0 });
      }
      if (p < 1 && ev.rippled) ev.rippled = false;
      if (p <= 0 || p >= 1) return;
      const y = lerp(g.viewTop - 6, surfaceScreenY, p * p);
      const [r, gg, b] = hexToRgb(ev.dash.color[0]);
      const stretch = 1 + p * 0.6;
      dropsHtml += `<g transform="translate(${ev.x} ${y.toFixed(1)}) scale(1 ${stretch.toFixed(2)})">
        <path d="M 0 -5 Q 3.2 -0.4 0 2.2 Q -3.2 -0.4 0 -5 Z" fill="rgb(${r},${gg},${b})"/>
        <ellipse cx="-0.8" cy="-0.6" rx="0.6" ry="1" fill="rgba(255,255,255,0.5)"/></g>`;
      if (p > 0.9) surfaceAmp = Math.max(surfaceAmp, 1.3);
    });
    this.el.drops.innerHTML = dropsHtml;
    this.el.ripples.innerHTML = this.ripples.map(rp => {
      const k = rp.age / 0.9;
      return `<ellipse cx="${rp.x}" cy="${(surfaceScreenY + 0.5).toFixed(1)}" rx="${(2 + k * 14).toFixed(1)}" ry="${(0.6 + k * 1.6).toFixed(2)}" fill="none" stroke="rgba(255,255,255,${(0.5 * (1 - k)).toFixed(2)})" stroke-width="0.6"/>`;
    }).join('');

    // Muddled bits appear once liquid covers them
    if (this.solidEls) {
      const vis = topY > 4 ? 0.92 : 0;
      this.solidEls.forEach(el => el.setAttribute('opacity', vis));
    }

    // Foam cap: rises as a scalloped head with micro-bubbles
    if (foamOn) {
      const base = this.mainTopY;
      const top = base + this.foamHeight * foamProgress;
      const yb = g.toScreenY(base) + 1;
      const yt = g.toScreenY(top);
      const rand = seededRandom(`${this.recipe.id}-scallop`);
      let d = `M 0 ${yb.toFixed(1)} L 0 ${yt.toFixed(1)}`;
      for (let x = 0; x < VIEW_W; x += 6) {
        const bump = 0.8 + rand() * 1.4;
        d += ` Q ${x + 3} ${(yt - bump).toFixed(2)} ${x + 6} ${(yt + (rand() - 0.5) * 0.6).toFixed(2)}`;
      }
      d += ` L ${VIEW_W} ${yb.toFixed(1)} Z`;
      this.el.foam.setAttribute('d', d);
      if (!this.foamDotsBuilt && foamProgress >= 1) {
        const fr = seededRandom(`${this.recipe.id}-foam`);
        const r = g.radiusAt(top);
        let dots = '';
        for (let i = 0; i < 70; i++) {
          const fy = yt + 1.5 + fr() * (yb - yt - 2);
          const fx = g.cx + (fr() * 2 - 1) * r;
          const fr2 = 0.3 + Math.pow(fr(), 2) * 1.3;
          dots += `<circle cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="${fr2.toFixed(2)}" fill="rgba(255,255,255,0.3)" stroke="rgba(170,145,100,0.45)" stroke-width="0.25"/>`;
        }
        dots += `<path d="M ${(g.cx - r).toFixed(1)} ${(yb - 1).toFixed(1)} L ${(g.cx + r).toFixed(1)} ${(yb - 1).toFixed(1)}" stroke="rgba(150,120,80,0.25)" stroke-width="1.5"/>`;
        // Bitters dotted across the foam (Pisco Sour style)
        const decor = this.plan.dashes.find(dd => (dd.ing.unit || '').startsWith('drop'));
        if (decor) {
          for (let k = -1; k <= 1; k++) {
            const cx = g.cx + k * r * 0.4;
            dots += `<ellipse cx="${cx.toFixed(1)}" cy="${(yt + 1.2).toFixed(1)}" rx="2.8" ry="1.1" fill="${decor.color[0]}"/><path d="M ${(cx - 2.2).toFixed(1)} ${(yt + 1.2).toFixed(1)} q 2.2 -0.4 4.4 0" stroke="rgba(255,255,255,0.25)" stroke-width="0.3" fill="none"/>`;
          }
        }
        if (this.dustHtml) dots += this.dustHtml;
        this.el.foamDots.innerHTML = dots;
        this.foamDotsBuilt = true;
      }
    } else {
      this.el.foam.setAttribute('d', '');
      if (this.foamDotsBuilt) {
        this.el.foamDots.innerHTML = '';
        this.foamDotsBuilt = false;
      }
      if (this.dustHtml && garnishProgress > 0 && !this.dustShown) {
        this.el.foamDots.innerHTML = this.dustHtml;
        this.dustShown = true;
      } else if (garnishProgress === 0 && this.dustShown) {
        this.el.foamDots.innerHTML = '';
        this.dustShown = false;
      }
    }

    // Bubbles rise once the fizzy part is in the glass
    if (this.bubbles.length) {
      const fizzReady = this.plan.isFizzy
        ? (done || this.layers.some((l, i) => fills[i] > 0.5 && FIZZ_RE.test(`${l.ing.id} ${l.ing.name}`.toLowerCase())))
        : done;
      const top = Math.min(topY, this.mainTopY);
      this.bubbles.forEach(b => {
        if (!fizzReady || top < 6) {
          b.el.setAttribute('opacity', '0');
          return;
        }
        if (live && dt > 0) {
          b.y += b.speed * dt;
          b.wobble += dt * 3;
        }
        if (b.y > top - 1.5) Object.assign(b, this.spawnBubble());
        const rr = g.radiusAt(b.y) - 3;
        const x = g.cx + b.lane * rr + Math.sin(b.wobble) * 0.8;
        b.el.setAttribute('cx', x.toFixed(1));
        b.el.setAttribute('cy', g.toScreenY(b.y).toFixed(1));
        b.el.setAttribute('r', (b.r * (1 + (b.y / Math.max(top, 1)) * 0.45)).toFixed(2));
        b.el.setAttribute('opacity', '0.85');
      });
    }

    // Condensation beads form on chilled glasses after the pour
    if (this.chilled) {
      const dew = this.animate ? clamp((t - this.totalDuration * 0.55) / (2600 * TEMPO), 0, 1) : 1;
      this.el.condensation.setAttribute('opacity', (dew * 0.8).toFixed(2));
    }

    // Garnish lands last, settling with a little sway
    this.garnishItems.forEach((item, k) => {
      const p = clamp((garnishProgress - k * 0.18) / 0.82, 0, 1);
      const e = easeOutBack(p);
      const y = lerp(item.y - (item.inGlass ? 80 : 46), item.y, e);
      const sway = Math.sin(p * Math.PI * 3) * (1 - p) * 7;
      item.el.setAttribute('transform', `translate(${item.x.toFixed(1)} ${y.toFixed(1)}) rotate(${(item.rot * e + sway).toFixed(1)}) scale(${item.scale})`);
      item.el.setAttribute('opacity', p > 0 ? Math.min(1, p * 3).toFixed(2) : '0');
    });

    // Let the surface settle and the condensation form, then idle
    if (done && this.animate && t > this.totalDuration + 2600 * TEMPO) {
      if (this.frame) cancelAnimationFrame(this.frame);
      this.frame = null;
      this.animate = false;
      this.splash = [];
      this.aeration = [];
      this.el.splash.innerHTML = '';
      this.el.aerate.innerHTML = '';
      if (this.bubbles.length) this.startIdle();
    }
  }
}

// Small static glass for catalog thumbnails
export function renderStaticGlass(container, recipe) {
  return new GlassViz(container, recipe, { animate: false, compact: true });
}

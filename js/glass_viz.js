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
  'cognac': ['#A8521A', 0.84], 'applejack': ['#C77B2A', 0.72], 'dark-rum': ['#4A1E08', 0.94],
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
  'honey-ginger-syrup': ['#DDA336', 0.68], 'maple-syrup': ['#9A5414', 0.8], 'raspberry-syrup': ['#B5123E', 0.9], 'orgeat': ['#F2EADB', 0.88],
  'heavy-cream': ['#FBF6EA', 0.97], 'cream-of-coconut': ['#FAF6EC', 0.96],
  // Mixers
  'club-soda': ['#E8F3FA', 0.1], 'ginger-beer': ['#E9D7A1', 0.6], 'tonic-water': ['#EEF5F8', 0.12],
  // Bitters
  'angostura-bitters': ['#5A1309', 0.95], 'orange-bitters': ['#C8561C', 0.85], 'peychauds-bitters': ['#C3172E', 0.9],
  'chocolate-bitters': ['#3B1F10', 0.95], 'blood-orange-bitters': ['#B42A1E', 0.9], 'lime-bitters': ['#8AAE3A', 0.85],
  'apple-bitters': ['#B8862E', 0.85], 'spicy-bitters': ['#8E2A10', 0.9], 'australian-bitters': ['#6B2A12', 0.9],
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

  // Frame each glass to its own height, leaving headroom for the pour stream and garnish
  const rimY = toScreenY(height);
  const viewTop = Math.max(0, Math.floor(rimY - 54));
  return { type, spec, height, radiusAt, heightForFraction, floorY, cx, toScreenY, innerPath, outerPath, rimY, viewTop, viewH: VIEW_H - viewTop };
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

function detectGarnish(recipe) {
  const text = `${(recipe.instructions || []).join(' ')} ${recipe.glass || ''}`.toLowerCase();
  const g = {};
  if (/salt[- ]rim|salt rim|rimmed with salt|salt-rimmed|sal de gusano|coarse salt/.test(text)) g.rim = /gusano/.test(text) ? '#E7B28A' : '#F5F2EA';
  else if (/sugar rim|sugar-rim|rim.*sugar/.test(text)) g.rim = '#FFFDF6';

  const wheel = text.match(/(lime|lemon|orange|grapefruit) (wheel|slice|half-wheel|half wheel)/);
  const wedge = text.match(/(lime|lemon) wedge/);
  if (wheel) g.wheel = wheel[1];
  else if (wedge) g.wheel = wedge[1];
  else if (/twist|peel/.test(text)) g.twist = /orange (peel|twist)|orange oils|orange zest/.test(text) ? 'orange' : (/grapefruit/.test(text) ? 'grapefruit' : 'lemon');

  if (/cherr/.test(text)) g.cherry = true;
  if (/olive/.test(text)) g.olive = true;
  if (/mint sprig|sprig of mint|mint bouquet|garnish with (fresh )?mint|mint crown/.test(text)) g.mint = true;
  if (/nutmeg|cinnamon/.test(text)) g.spice = true;
  if (/coffee beans/.test(text)) g.beans = true;
  return g;
}

const RIND = {
  lime: ['#6FA62E', '#DDEFA8'],
  lemon: ['#E9C62A', '#FBF1B5'],
  orange: ['#EE8A1E', '#FFD69A'],
  grapefruit: ['#F08A6E', '#FBC7B5']
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

    this.geo = buildGeometry(resolveGlassType(recipe.glass));
    this.plan = buildPourPlan(recipe);
    this.iceType = detectIce(recipe.ice);
    this.garnish = detectGarnish(recipe);

    this.computeLayers();
    this.buildTimeline();
    this.render();
    this.renderLegend();

    if (this.animate) {
      this.start();
    } else {
      this.drawAt(this.totalDuration + 1);
      if (!compact && !this.reducedMotion && this.plan.isFizzy) this.startIdle();
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

    // Final blended color for shaken / stirred drinks (floats stay separate)
    const mainLayers = this.layers.filter(l => !l.float);
    let wSum = 0;
    const mix = [0, 0, 0];
    // Opacity mixes by transmittance: light through the blend is the product of each part's share
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
    if (this.foamHeight === undefined) this.foamHeight = 0;
    this.liquidTopY = this.layers.length ? this.layers[this.layers.length - 1].y1 : 0;
    this.mainTopY = mainLayers.length ? mainLayers[mainLayers.length - 1].y1 : 0;
    this.foamHeight = this.plan.hasFoam ? Math.min(14, this.geo.height * 0.12) : 0;
    if (this.foamHeight) {
      this.layers.filter(l => l.float).forEach(l => {
        l.y0 += this.foamHeight;
        l.y1 = Math.min(this.geo.height - 1, l.y1 + this.foamHeight);
      });
      this.liquidTopY = this.layers[this.layers.length - 1].y1;
    }
  }

  buildTimeline() {
    const events = [];
    let t = this.iceType === 'none' ? 150 : 650; // ice drops in first
    const mainLayers = this.layers.filter(l => !l.float);
    const floatLayers = this.layers.filter(l => l.float);
    const maxOz = Math.max(...this.layers.map(l => l.oz), 1);

    const pourEvent = (layer) => {
      const dur = clamp(320 + 520 * (layer.oz / maxOz), 340, 900);
      events.push({ kind: 'pour', layer, start: t, end: t + dur });
      t += dur + 90;
    };

    mainLayers.forEach((layer, i) => {
      pourEvent(layer);
      if (i === 0 && this.plan.dashes.length) {
        this.plan.dashes.forEach(d => {
          for (let k = 0; k < d.count; k++) {
            events.push({ kind: 'drop', dash: d, start: t, end: t + 420, x: this.geo.cx + 10 + (this.rand() - 0.5) * 18 });
            t += 150;
          }
          t += 120;
        });
        t += 200;
      }
    });
    if (!mainLayers.length && this.plan.dashes.length) {
      this.plan.dashes.forEach(d => {
        for (let k = 0; k < d.count; k++) {
          events.push({ kind: 'drop', dash: d, start: t, end: t + 420, x: this.geo.cx + 10 });
          t += 150;
        }
      });
    }

    if (this.shouldBlend) {
      events.push({ kind: 'blend', start: t + 100, end: t + 1100 });
      t += 1100;
    }
    if (this.plan.hasFoam) {
      events.push({ kind: 'foam', start: t, end: t + 700 });
      t += 700;
    }
    floatLayers.forEach(pourEvent);
    events.push({ kind: 'garnish', start: t + 80, end: t + 700 });
    t += 700;

    this.events = events;
    this.totalDuration = t;
  }

  render() {
    const g = this.geo;
    const id = this.uid;
    const metal = g.spec.metal;
    const glassStroke = metal === 'copper' ? 'rgba(232, 150, 92, 0.85)' : metal === 'silver' ? 'rgba(225, 230, 238, 0.85)' : `url(#${id}-rimGrad)`;
    const glassFill = metal === 'copper' ? 'rgba(184, 98, 46, 0.32)' : metal === 'silver' ? 'rgba(210, 216, 226, 0.26)' : 'rgba(255, 255, 255, 0.035)';

    // Stemless bowls cast a wide soft shadow; tumblers a tight one under the base
    const shadowR = g.spec.base > 6 ? g.radiusAt(0) + 22 : Math.max(g.radiusAt(g.height * 0.6), 30) * 0.75;
    const baseBlock = g.spec.base > 6
      ? `<rect x="${(g.cx - g.radiusAt(0) - WALL + 1).toFixed(1)}" y="${g.floorY.toFixed(1)}" width="${(2 * (g.radiusAt(0) + WALL) - 2).toFixed(1)}" height="${(g.spec.base - 1).toFixed(1)}" rx="4" fill="rgba(255,255,255,0.11)"/>
         <line x1="${(g.cx - g.radiusAt(0) + 4).toFixed(1)}" y1="${(g.floorY + 2).toFixed(1)}" x2="${(g.cx + g.radiusAt(0) - 4).toFixed(1)}" y2="${(g.floorY + 2).toFixed(1)}" stroke="rgba(255,255,255,0.18)" stroke-width="1" stroke-linecap="round"/>`
      : '';

    // Reflection streaks along the left and right walls
    const hlPts = [];
    for (let y = g.height * 0.12; y <= g.height * 0.86; y += 2) hlPts.push(`${(g.cx - g.radiusAt(y) * 0.8).toFixed(1)},${g.toScreenY(y).toFixed(1)}`);
    const hlPts2 = [];
    for (let y = g.height * 0.3; y <= g.height * 0.7; y += 2) hlPts2.push(`${(g.cx + g.radiusAt(y) * 0.86).toFixed(1)},${g.toScreenY(y).toFixed(1)}`);

    const handle = g.type === 'mug'
      ? `<path d="M ${g.cx + 56} ${g.toScreenY(84)} C ${g.cx + 86} ${g.toScreenY(84)}, ${g.cx + 86} ${g.toScreenY(26)}, ${g.cx + 56} ${g.toScreenY(26)}" fill="none" stroke="rgba(232,150,92,0.85)" stroke-width="7" stroke-linecap="round"/>`
      : '';

    const frost = metal === 'silver' || /frost/i.test(this.recipe.ice || '')
      ? `<path d="${g.outerPath}" fill="url(#${id}-frost)" opacity="0.55"/>`
      : '';

    this.container.innerHTML = `
      <svg class="glass-viz-svg" viewBox="0 ${g.viewTop} ${VIEW_W} ${g.viewH}" role="img" aria-label="${(this.recipe.name || 'Cocktail').replace(/"/g, '')} in a ${g.spec.label} glass">
        <defs>
          <clipPath id="${id}-clip"><path d="${g.innerPath}"/></clipPath>
          <linearGradient id="${id}-rimGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="rgba(255,255,255,0.55)"/>
            <stop offset="0.5" stop-color="rgba(255,255,255,0.18)"/>
            <stop offset="1" stop-color="rgba(255,255,255,0.4)"/>
          </linearGradient>
          <radialGradient id="${id}-spot" cx="0.5" cy="0.45" r="0.55">
            <stop offset="0" stop-color="rgba(245,190,110,0.16)"/>
            <stop offset="1" stop-color="rgba(245,190,110,0)"/>
          </radialGradient>
          <radialGradient id="${id}-backlight" cx="0.5" cy="0.62" r="0.5">
            <stop offset="0" stop-color="rgba(255,244,225,0.14)"/>
            <stop offset="1" stop-color="rgba(255,244,225,0.03)"/>
          </radialGradient>
          <radialGradient id="${id}-shadow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stop-color="rgba(0,0,0,0.55)"/>
            <stop offset="1" stop-color="rgba(0,0,0,0)"/>
          </radialGradient>
          <pattern id="${id}-frost" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.9" fill="rgba(255,255,255,0.35)"/>
            <circle cx="4.5" cy="4" r="0.6" fill="rgba(255,255,255,0.25)"/>
          </pattern>
        </defs>

        ${this.compact ? '' : `<ellipse cx="${g.cx}" cy="${(g.viewTop + g.viewH * 0.52).toFixed(1)}" rx="${VIEW_W * 0.5}" ry="${(g.viewH * 0.52).toFixed(1)}" fill="url(#${id}-spot)"/>`}
        <ellipse class="gv-glow" cx="${g.cx}" cy="${BASELINE + 3}" rx="${shadowR.toFixed(1)}" ry="5" fill="url(#${id}-shadow)"/>
        <ellipse class="gv-caustic" cx="${g.cx}" cy="${BASELINE + 3}" rx="${(shadowR * 0.7).toFixed(1)}" ry="3.5" fill="transparent"/>

        <path d="${g.outerPath}" fill="${glassFill}"/>
        ${baseBlock}

        <g clip-path="url(#${id}-clip)">
          <rect x="0" y="0" width="${VIEW_W}" height="${VIEW_H}" fill="url(#${id}-backlight)"/>
          <g class="gv-layers"></g>
          <path class="gv-blend" d=""/>
          <g class="gv-solids"></g>
          <path class="gv-foam" d="" fill="#F3EAD4"/>
          <g class="gv-foam-dots"></g>
          <g class="gv-bubbles"></g>
          <g class="gv-ice"></g>
          <path class="gv-surface" d="" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
        </g>

        ${frost}
        <path d="${g.outerPath}" fill="none" stroke="${glassStroke}" stroke-width="1.6" stroke-linejoin="round"/>
        <polyline points="${hlPts.join(' ')}" fill="none" stroke="rgba(255,255,255,${metal ? 0.22 : 0.16})" stroke-width="3.2" stroke-linecap="round"/>
        <polyline points="${hlPts2.join(' ')}" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="2" stroke-linecap="round"/>
        ${handle}
        <g class="gv-ice-top"></g>
        <g class="gv-rim"></g>
        <g class="gv-drops"></g>
        <rect class="gv-stream" x="0" y="0" width="0" height="0" rx="2"/>
        <g class="gv-garnish"></g>
      </svg>
    `;

    const svg = this.container.querySelector('svg');
    this.svg = svg;
    this.el = {
      layers: svg.querySelector('.gv-layers'),
      blend: svg.querySelector('.gv-blend'),
      solids: svg.querySelector('.gv-solids'),
      foam: svg.querySelector('.gv-foam'),
      foamDots: svg.querySelector('.gv-foam-dots'),
      bubbles: svg.querySelector('.gv-bubbles'),
      ice: svg.querySelector('.gv-ice'),
      iceTop: svg.querySelector('.gv-ice-top'),
      surface: svg.querySelector('.gv-surface'),
      rim: svg.querySelector('.gv-rim'),
      drops: svg.querySelector('.gv-drops'),
      stream: svg.querySelector('.gv-stream'),
      garnish: svg.querySelector('.gv-garnish'),
      caustic: svg.querySelector('.gv-caustic')
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
  }

  // --- Static scene pieces -------------------------------------------------
  buildIce() {
    const g = this.geo;
    const rand = seededRandom(`${this.recipe.id}-ice`);
    const cubes = [];
    const cube = (x, y, s, rot, extraClass = '') => {
      const grp = document.createElementNS(SVG_NS, 'g');
      grp.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})`);
      grp.setAttribute('class', `gv-cube ${extraClass}`);
      grp.innerHTML = `
        <rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="${Math.max(2, s * 0.14)}" fill="rgba(225,240,255,0.16)" stroke="rgba(255,255,255,0.5)" stroke-width="0.9"/>
        <path d="M ${-s / 2 + 3} ${-s / 2 + s * 0.3} L ${-s / 2 + 3} ${-s / 2 + 3} L ${-s / 2 + s * 0.35} ${-s / 2 + 3}" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.2" stroke-linecap="round"/>
      `;
      cubes.push({ el: grp, x, y, s });
      return grp;
    };

    if (this.iceType === 'large') {
      const s = Math.min(2 * g.radiusAt(0) * 0.78, 2 * g.radiusAt(20) * 0.78, 64, g.height * 0.62);
      this.el.ice.appendChild(cube(g.cx, g.floorY - s / 2 - 1, s, -4 + rand() * 8));
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
      const n = clamp(Math.round(area / 70), 18, 90);
      for (let i = 0; i < n; i++) {
        const y = rand() * (g.height + 4);
        const r = g.radiusAt(Math.min(y, g.height));
        const x = g.cx + (rand() * 2 - 1) * (r - 3);
        pieces.push([x, g.toScreenY(y), 4 + rand() * 5]);
      }
      // A mound of crushed ice above the rim
      const rimR = g.radiusAt(g.height);
      for (let i = 0; i < 14; i++) {
        const x = g.cx + (rand() * 2 - 1) * rimR * 0.9;
        const bulge = (1 - Math.pow((x - g.cx) / rimR, 2)) * 12;
        pieces.push([x, g.rimY - rand() * bulge, 4 + rand() * 4, true]);
      }
      pieces.forEach(([x, y, s, above]) => {
        const pts = [];
        const sides = 5 + Math.floor(rand() * 2);
        for (let k = 0; k < sides; k++) {
          const ang = (k / sides) * Math.PI * 2 + rand() * 0.5;
          const rr = s * (0.6 + rand() * 0.4);
          pts.push(`${(x + Math.cos(ang) * rr).toFixed(1)},${(y + Math.sin(ang) * rr).toFixed(1)}`);
        }
        const poly = document.createElementNS(SVG_NS, 'polygon');
        poly.setAttribute('points', pts.join(' '));
        poly.setAttribute('fill', 'rgba(230,242,255,0.2)');
        poly.setAttribute('stroke', 'rgba(255,255,255,0.45)');
        poly.setAttribute('stroke-width', '0.7');
        (above ? this.el.iceTop : this.el.ice).appendChild(poly);
        cubes.push({ el: poly, x, y, s });
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
        const el = document.createElementNS(SVG_NS, 'path');
        const sy = g.toScreenY(y);
        const rot = rand() * 360;
        if (/mint|basil/.test(id)) {
          el.setAttribute('d', `M -6 0 Q 0 -4.5 6 0 Q 0 4.5 -6 0 Z M -6 0 L 6 0`);
          el.setAttribute('fill', s.color[0]);
          el.setAttribute('stroke', 'rgba(20,60,30,0.6)');
          el.setAttribute('stroke-width', '0.6');
        } else if (/ginger|peach/.test(id)) {
          el.setAttribute('d', 'M -4 -3 L 4 -3 L 5 3 L -5 3 Z');
          el.setAttribute('fill', s.color[0]);
        } else {
          el.setAttribute('d', 'M -3.5 0 A 3.5 3.5 0 1 0 3.5 0 A 3.5 3.5 0 1 0 -3.5 0');
          el.setAttribute('fill', s.color[0]);
        }
        el.setAttribute('transform', `translate(${x.toFixed(1)} ${sy.toFixed(1)}) rotate(${rot.toFixed(0)})`);
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
      for (let i = 0; i < 22; i++) {
        const dy = rand() * 9;
        const x = g.cx + side * (r + (rand() - 0.5) * 3.4);
        html += `<circle cx="${x.toFixed(1)}" cy="${(g.rimY + dy).toFixed(1)}" r="${(0.7 + rand() * 0.8).toFixed(2)}" fill="${this.garnish.rim}"/>`;
      }
    });
    this.el.rim.innerHTML = html;
  }

  buildGarnish() {
    const g = this.geo;
    const gar = this.garnish;
    const rimR = g.radiusAt(g.height) + WALL;
    const items = [];

    const add = (html, x, y, rot = 0, inGlass = false) => {
      const grp = document.createElementNS(SVG_NS, 'g');
      grp.innerHTML = html;
      grp.dataset.x = x;
      grp.dataset.y = y;
      grp.dataset.rot = rot;
      grp.setAttribute('opacity', '0');
      this.el.garnish.appendChild(grp);
      items.push({ el: grp, x, y, rot, inGlass });
    };

    if (gar.wheel) {
      const [rind, flesh] = RIND[gar.wheel];
      let seg = '';
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        seg += `<line x1="0" y1="0" x2="${(Math.cos(a) * 9).toFixed(1)}" y2="${(Math.sin(a) * 9).toFixed(1)}" stroke="rgba(255,255,255,0.65)" stroke-width="0.8"/>`;
      }
      add(`<circle r="12" fill="${rind}"/><circle r="10" fill="${flesh}"/>${seg}<circle r="1.6" fill="rgba(255,255,255,0.8)"/>`,
        g.cx + rimR - 4, g.rimY + 2, -18);
    } else if (gar.twist) {
      const [rind, flesh] = RIND[gar.twist];
      add(`<path d="M 0 0 C 10 -8, 20 6, 30 -2 C 36 -6, 40 -2, 42 4" fill="none" stroke="${rind}" stroke-width="5" stroke-linecap="round"/>
           <path d="M 1 -0.5 C 10 -8.5, 20 5.5, 30 -2.5" fill="none" stroke="${flesh}" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>`,
        g.cx + rimR - 22, g.rimY - 4, 8);
    }
    if (gar.cherry) {
      const restY = this.iceType === 'none' ? g.floorY - 7 : g.rimY + 6;
      add(`<path d="M 0 -6 C 2 -16, 8 -22, 14 -24" fill="none" stroke="#5B3A1A" stroke-width="1.4" stroke-linecap="round"/>
           <circle r="7" fill="#7E0B1D"/><circle cx="-2.5" cy="-2.5" r="2" fill="rgba(255,255,255,0.45)"/>`,
        g.cx - 6, restY, 0, true);
    }
    if (gar.olive) {
      add(`<line x1="-26" y1="-26" x2="12" y2="12" stroke="#C9B48A" stroke-width="1.6" stroke-linecap="round"/>
           <ellipse rx="7" ry="5.5" fill="#6E8B2E" transform="rotate(45)"/><circle cx="2.5" cy="-2.5" r="2" fill="#C0392B"/>`,
        g.cx - 4, g.rimY + Math.min(30, g.height * 0.4), 0, true);
    }
    if (gar.mint) {
      add(`<path d="M 0 0 L 0 -16" stroke="#2F7A3E" stroke-width="1.6"/>
           <path d="M 0 -14 Q -12 -22 -16 -12 Q -6 -8 0 -14 Z" fill="#46A35A"/>
           <path d="M 0 -18 Q 10 -30 16 -20 Q 6 -14 0 -18 Z" fill="#3E9B4F"/>
           <path d="M 0 -8 Q 12 -14 14 -4 Q 5 -2 0 -8 Z" fill="#52B067"/>`,
        g.cx - rimR * 0.45, g.rimY + 6, -10);
    }
    if (gar.beans) {
      add(`<ellipse cx="-6" rx="3.2" ry="2.2" fill="#3B2314"/><ellipse cx="0" cy="-1" rx="3.2" ry="2.2" fill="#3B2314"/><ellipse cx="6" rx="3.2" ry="2.2" fill="#3B2314"/>`,
        g.cx, g.toScreenY(this.liquidTopY + this.foamHeight) - 1, 0, true);
    }
    this.garnishItems = items;

    if (gar.spice) {
      const rand = seededRandom(`${this.recipe.id}-spice`);
      const top = this.liquidTopY + this.foamHeight;
      const r = g.radiusAt(top) * 0.7;
      let dots = '';
      for (let i = 0; i < 16; i++) {
        dots += `<circle cx="${(g.cx + (rand() * 2 - 1) * r).toFixed(1)}" cy="${(g.toScreenY(top) + 1 + rand() * 2).toFixed(1)}" r="${(0.6 + rand() * 0.6).toFixed(2)}" fill="#7A4A26"/>`;
      }
      this.spiceHtml = dots;
    }
  }

  buildBubbles() {
    this.bubbles = [];
    if (!this.plan.isFizzy && !this.plan.isSparklingWine) return;
    const n = this.compact ? 6 : (this.plan.isSparklingWine ? 26 : 18);
    for (let i = 0; i < n; i++) {
      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('fill', 'rgba(255,255,255,0.55)');
      c.setAttribute('opacity', '0');
      this.el.bubbles.appendChild(c);
      this.bubbles.push({ el: c, ...this.spawnBubble(true) });
    }
  }

  spawnBubble(initial = false) {
    const g = this.geo;
    const fine = this.plan.isSparklingWine;
    // Champagne bubbles stream from a few nucleation points; soda bubbles are scattered
    const lane = fine ? [-0.35, 0, 0.3][Math.floor(Math.random() * 3)] : (Math.random() * 2 - 1) * 0.8;
    const top = this.mainTopY;
    return {
      lane,
      y: initial ? Math.random() * top : Math.random() * 3,
      r: fine ? 0.6 + Math.random() * 0.6 : 0.8 + Math.random() * 1.4,
      speed: fine ? 26 + Math.random() * 14 : 14 + Math.random() * 18,
      wobble: Math.random() * Math.PI * 2
    };
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
      const [r, gr, b] = hexToRgb(color[0]);
      const fill = swatchClass === 'liquid' ? rgba([r, gr, b], Math.max(color[1], 0.35)) : color[0];
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
    const tick = (ts) => {
      if (this.destroyed) return;
      if (this.startTime === null) this.startTime = ts;
      const t = ts - this.startTime;
      this.drawAt(t, ts);
      if (!this.animate) return; // finished; drawAt may have handed off to the idle loop
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  startIdle() {
    const tick = (ts) => {
      if (this.destroyed) return;
      this.drawAt(this.totalDuration + 1, ts);
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  replay() {
    if (this.reducedMotion) return;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.animate = true;
    this.lastTs = null;
    if (this.legendRows) this.legendRows.forEach(r => { r.classList.add('pending'); r.classList.remove('active'); });
    this.start();
  }

  destroy() {
    this.destroyed = true;
    if (this.frame) cancelAnimationFrame(this.frame);
  }

  waveY(baseY, x, amp, phase) {
    return baseY + Math.sin(x * 0.09 + phase) * amp + Math.sin(x * 0.21 - phase * 1.3) * amp * 0.35;
  }

  drawAt(t, ts = 0) {
    const g = this.geo;
    const done = t >= this.totalDuration;
    const phase = ts / 380;
    const dt = this.lastTs ? Math.min(0.05, (ts - this.lastTs) / 1000) : 0.016;
    this.lastTs = ts;

    // Ice settles in before anything is poured
    if (this.iceCubes && this.iceCubes.length) {
      const k = this.animate ? easeOutBack(clamp(t / 550, 0, 1)) : 1;
      const lift = (1 - k) * -60;
      this.el.ice.setAttribute('transform', `translate(0 ${lift.toFixed(1)})`);
      this.el.iceTop.setAttribute('transform', `translate(0 ${lift.toFixed(1)})`);
      this.el.ice.setAttribute('opacity', clamp(t / 200, 0, 1).toFixed(2));
      this.el.iceTop.setAttribute('opacity', clamp(t / 200, 0, 1).toFixed(2));
    }

    // Work out each layer's current fill height and the active pour
    let activePour = null;
    let surfaceAmp = 0.45;
    let foamProgress = 0;
    let blendProgress = 0;
    let garnishProgress = 0;
    const fills = this.layers.map(() => 0);

    this.events.forEach(ev => {
      const p = clamp((t - ev.start) / (ev.end - ev.start), 0, 1);
      if (ev.kind === 'pour') {
        const i = this.layers.indexOf(ev.layer);
        fills[i] = easeInOut(p);
        if (p > 0 && p < 1) {
          activePour = { layer: ev.layer, p };
          surfaceAmp = Math.max(surfaceAmp, 2.2);
        }
        if (p > 0 && p < 1) this.setLegendState(ev.layer.idx, 'active');
        else if (p >= 1) this.setLegendState(ev.layer.idx, 'done');
      } else if (ev.kind === 'blend') {
        blendProgress = easeInOut(p);
        if (p > 0 && p < 1) surfaceAmp = Math.max(surfaceAmp, 1.6 * Math.sin(p * Math.PI));
      } else if (ev.kind === 'foam') {
        foamProgress = easeOutCubic(p);
      } else if (ev.kind === 'garnish') {
        garnishProgress = p;
      } else if (ev.kind === 'drop') {
        if (p > 0) this.setLegendState(ev.dash.idx, p >= 1 ? 'done' : 'active');
      }
    });
    if (done) {
      this.layers.forEach((_, i) => { fills[i] = 1; });
      if (this.shouldBlend) blendProgress = 1;
      if (this.plan.hasFoam) foamProgress = 1;
      garnishProgress = 1;
      if (this.legendRows) this.legendRows.forEach(r => r.classList.remove('pending', 'active'));
    }
    // Solids and foam entries in the legend light up with the pour
    if (this.legendRows && t > 200) {
      this.plan.solids.forEach(s => {
        if (s.kind === 'foam') this.setLegendState(s.idx, foamProgress > 0 ? 'done' : 'pending');
        else this.setLegendState(s.idx, 'done');
      });
    }

    // Draw liquid layers bottom-up; the current top surface ripples
    let topY = 0;
    let topIdx = -1;
    this.layers.forEach((layer, i) => {
      const h0 = layer.y0;
      const h1 = lerp(h0, layer.y1, fills[i]);
      if (fills[i] > 0) {
        topY = h1;
        topIdx = i;
      }
    });

    const merged = blendProgress >= 1 && this.shouldBlend;
    const mainCount = this.layers.filter(l => !l.float).length;
    this.layers.forEach((layer, i) => {
      const el = this.layerEls[i];
      if (fills[i] <= 0 || (merged && !layer.float)) {
        el.setAttribute('d', '');
        return;
      }
      const h0 = layer.y0;
      const h1 = lerp(h0, layer.y1, fills[i]);
      const yTop = g.toScreenY(h1);
      const yBot = g.toScreenY(h0) + 0.6;
      const isTop = i === topIdx && !(foamProgress > 0 && !layer.float);
      let d = `M 0 ${yBot.toFixed(1)} L 0 ${yTop.toFixed(1)}`;
      if (isTop) {
        for (let x = 0; x <= VIEW_W; x += 8) d += ` L ${x} ${this.waveY(yTop, x, surfaceAmp, phase).toFixed(2)}`;
      } else {
        d += ` L ${VIEW_W} ${yTop.toFixed(1)}`;
      }
      d += ` L ${VIEW_W} ${yBot.toFixed(1)} Z`;
      el.setAttribute('d', d);

      let rgb = layer.rgb;
      let a = layer.alpha;
      if (blendProgress > 0 && !layer.float) {
        rgb = rgb.map((c, k) => lerp(c, this.blendRgb[k], blendProgress));
        a = lerp(a, this.blendAlpha, blendProgress);
      }
      el.setAttribute('fill', rgba(rgb, a));
    });

    // Once blended, the main body is one continuous liquid
    if (merged && mainCount) {
      const first = this.layers[0];
      const lastMain = this.layers[mainCount - 1];
      const yTop = g.toScreenY(lastMain.y1);
      const yBot = g.toScreenY(first.y0) + 0.6;
      const waveTop = !this.layers.some((l, k) => l.float && fills[k] > 0) && foamProgress === 0;
      let d = `M 0 ${yBot.toFixed(1)} L 0 ${yTop.toFixed(1)}`;
      if (waveTop) {
        for (let x = 0; x <= VIEW_W; x += 8) d += ` L ${x} ${this.waveY(yTop, x, surfaceAmp, phase).toFixed(2)}`;
      } else {
        d += ` L ${VIEW_W} ${yTop.toFixed(1)}`;
      }
      d += ` L ${VIEW_W} ${yBot.toFixed(1)} Z`;
      this.el.blend.setAttribute('d', d);
      this.el.blend.setAttribute('fill', rgba(this.blendRgb, this.blendAlpha));
    } else {
      this.el.blend.setAttribute('d', '');
    }

    // Surface highlight line on the very top of the liquid
    if (topIdx >= 0 && foamProgress === 0) {
      const yTop = g.toScreenY(topY);
      let d = '';
      for (let x = 0; x <= VIEW_W; x += 8) d += `${x === 0 ? 'M' : 'L'} ${x} ${this.waveY(yTop, x, surfaceAmp, phase).toFixed(2)} `;
      this.el.surface.setAttribute('d', d);
    } else {
      this.el.surface.setAttribute('d', '');
    }

    // Colored light under the glass
    if (topIdx >= 0) {
      const glowRgb = blendProgress > 0 ? this.blendRgb : this.layers[topIdx].rgb;
      this.el.caustic.setAttribute('fill', rgba(glowRgb, 0.22));
    }

    // Pour stream from above the rim into the surface
    const stream = this.el.stream;
    if (activePour) {
      const { layer, p } = activePour;
      const surfaceScreenY = g.toScreenY(topY);
      const headIn = clamp(p / 0.12, 0, 1);
      const tailOut = clamp((p - 0.82) / 0.18, 0, 1);
      const startY = lerp(g.viewTop - 4, surfaceScreenY, tailOut);
      const endY = lerp(g.viewTop - 4, surfaceScreenY, headIn);
      const w = lerp(5.5, 2, tailOut) + Math.sin(ts / 60) * 0.4;
      const x = g.cx + 8 + Math.sin(ts / 140) * 0.8;
      stream.setAttribute('x', (x - w / 2).toFixed(1));
      stream.setAttribute('y', startY.toFixed(1));
      stream.setAttribute('width', w.toFixed(1));
      stream.setAttribute('height', Math.max(0, endY - startY).toFixed(1));
      stream.setAttribute('fill', rgba(layer.rgb, Math.max(0.55, layer.alpha)));
    } else {
      stream.setAttribute('height', '0');
    }

    // Bitters drops
    let dropsHtml = '';
    this.events.forEach(ev => {
      if (ev.kind !== 'drop') return;
      const p = (t - ev.start) / (ev.end - ev.start);
      if (p <= 0 || p >= 1) return;
      const surfaceY = g.toScreenY(topY);
      const y = lerp(g.viewTop - 6, surfaceY, p * p);
      const [r, gg, b] = hexToRgb(ev.dash.color[0]);
      dropsHtml += `<path d="M ${ev.x} ${(y - 5).toFixed(1)} Q ${ev.x + 3} ${(y - 0.5).toFixed(1)} ${ev.x} ${(y + 2).toFixed(1)} Q ${ev.x - 3} ${(y - 0.5).toFixed(1)} ${ev.x} ${(y - 5).toFixed(1)} Z" fill="rgb(${r},${gg},${b})"/>`;
      if (p > 0.92) surfaceAmp = Math.max(surfaceAmp, 1.4);
    });
    this.el.drops.innerHTML = dropsHtml;

    // Muddled bits appear once the first liquid covers them
    if (this.solidEls) {
      const vis = topY > 4 ? 0.9 : 0;
      this.solidEls.forEach(el => el.setAttribute('opacity', vis));
    }

    // Foam cap grows on top of the main liquid
    if (foamProgress > 0) {
      const base = this.mainTopY;
      const top = base + this.foamHeight * foamProgress;
      const yb = g.toScreenY(base) + 1;
      const yt = g.toScreenY(top);
      let d = `M 0 ${yb.toFixed(1)} L 0 ${yt.toFixed(1)}`;
      for (let x = 0; x <= VIEW_W; x += 6) d += ` L ${x} ${(yt + Math.sin(x * 0.35) * 0.7 + Math.cos(x * 0.13) * 0.6).toFixed(2)}`;
      d += ` L ${VIEW_W} ${yb.toFixed(1)} Z`;
      this.el.foam.setAttribute('d', d);
      if (!this.foamDotsBuilt && foamProgress >= 1) {
        const rand = seededRandom(`${this.recipe.id}-foam`);
        const r = g.radiusAt(top);
        let dots = '';
        for (let i = 0; i < 26; i++) {
          const fy = yt + 2 + rand() * (yb - yt - 3);
          dots += `<circle cx="${(g.cx + (rand() * 2 - 1) * r).toFixed(1)}" cy="${fy.toFixed(1)}" r="${(0.5 + rand() * 0.9).toFixed(2)}" fill="rgba(200,180,140,0.45)"/>`;
        }
        // Bitters dotted across the foam (Pisco Sour style)
        const decor = this.plan.dashes.find(dd => (dd.ing.unit || '').startsWith('drop'));
        if (decor) {
          for (let k = -1; k <= 1; k++) dots += `<ellipse cx="${(g.cx + k * r * 0.4).toFixed(1)}" cy="${(yt + 1.4).toFixed(1)}" rx="2.6" ry="1.1" fill="${decor.color[0]}"/>`;
        }
        if (this.spiceHtml) dots += this.spiceHtml;
        this.el.foamDots.innerHTML = dots;
        this.foamDotsBuilt = true;
      }
    } else {
      this.el.foam.setAttribute('d', '');
      if (this.foamDotsBuilt) {
        this.el.foamDots.innerHTML = '';
        this.foamDotsBuilt = false;
      }
      if (this.spiceHtml && garnishProgress > 0 && !this.spiceShown) {
        this.el.foamDots.innerHTML = this.spiceHtml;
        this.spiceShown = true;
      } else if (garnishProgress === 0 && this.spiceShown) {
        this.el.foamDots.innerHTML = '';
        this.spiceShown = false;
      }
    }

    // Bubbles rise once the fizzy part is in the glass
    if (this.bubbles.length) {
      const fizzReady = this.plan.isFizzy ? (done || this.layers.some((l, i) => fills[i] > 0.5 && FIZZ_RE.test(`${l.ing.id} ${l.ing.name}`.toLowerCase()))) : done;
      const top = Math.min(topY, this.mainTopY);
      this.bubbles.forEach(b => {
        if (!fizzReady || top < 6) {
          b.el.setAttribute('opacity', '0');
          return;
        }
        if (this.animate || !this.compact) {
          b.y += b.speed * dt;
          b.wobble += dt * 4;
        }
        if (b.y > top - 1.5) Object.assign(b, this.spawnBubble());
        const r = g.radiusAt(b.y) - 3;
        const x = g.cx + b.lane * r + Math.sin(b.wobble) * 0.8;
        b.el.setAttribute('cx', x.toFixed(1));
        b.el.setAttribute('cy', g.toScreenY(b.y).toFixed(1));
        b.el.setAttribute('r', (b.r * (1 + b.y / Math.max(top, 1) * 0.4)).toFixed(2));
        b.el.setAttribute('opacity', '0.75');
      });
    }

    // Garnish drops onto the rim (or into the glass) last
    this.garnishItems.forEach((item, k) => {
      const p = clamp((garnishProgress - k * 0.15) / 0.85, 0, 1);
      const e = easeOutBack(p);
      const y = lerp(item.y - (item.inGlass ? 70 : 40), item.y, e);
      item.el.setAttribute('transform', `translate(${item.x.toFixed(1)} ${y.toFixed(1)}) rotate(${(item.rot * e).toFixed(1)})`);
      item.el.setAttribute('opacity', p > 0 ? Math.min(1, p * 3).toFixed(2) : '0');
    });

    // Stop the frame loop when nothing is moving any more
    // Keep the loop alive for a moment so the surface settles, then idle
    if (done && this.animate && t > this.totalDuration + 1600) {
      if (this.frame) cancelAnimationFrame(this.frame);
      this.frame = null;
      this.animate = false;
      if (this.bubbles.length) this.startIdle();
    }
  }
}

// Small static glass for catalog thumbnails
export function renderStaticGlass(container, recipe) {
  return new GlassViz(container, recipe, { animate: false, compact: true });
}

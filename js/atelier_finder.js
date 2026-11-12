// ============================================================================
// BarCraft Atelier Finder
// Drink-style filters, a forgiving full-text search, and the "Help me choose"
// recommender. Pure functions over recipe objects so they are easy to test.
// ============================================================================

const ids = (recipe) => recipe.ingredients.map(i => (i.id || '').toLowerCase());
const has = (recipe, re) => ids(recipe).some(id => re.test(id)) || recipe.ingredients.some(i => re.test((i.name || '').toLowerCase()));
const tagged = (recipe, re) => (recipe.tags || []).some(t => re.test(t.toLowerCase()));
const flavor = (recipe, key) => (recipe.flavor && recipe.flavor[key]) || 0;
const methodText = (recipe) => `${recipe.method || ''} ${recipe.category || ''}`.toLowerCase();

const CITRUS = /lime-juice|lemon-juice|grapefruit-juice|orange-juice|yuzu/;
const FIZZ = /club-soda|ginger-beer|champagne|prosecco|tonic|soda|sparkling|cola/;
const BASE_SPIRIT = /gin|vodka|rum|cachaca|agricole|tequila|mezcal|bourbon|rye|whisk|scotch|cognac|brandy|pisco|applejack/;

export function isZeroProof(recipe) {
  return /zero-proof/i.test(recipe.category || '') || tagged(recipe, /zero-proof|mocktail/);
}

// Spirit-forward amount of base spirit, in oz
function baseSpiritOz(recipe) {
  return recipe.ingredients
    .filter(i => i.unit === 'oz' && BASE_SPIRIT.test(`${i.id} ${i.name}`.toLowerCase()) && !/bitters/.test(i.id || ''))
    .reduce((a, i) => a + (i.amount || 0), 0);
}

// Strong modifiers (liqueurs, amari, vermouth) also count toward strength
function liqueurOz(recipe) {
  return recipe.ingredients
    .filter(i => i.unit === 'oz' && /liqueur|chartreuse|campari|amaro|vermouth|heering|benedictine|maraschino|curacao|cointreau|grand-marnier|licor|tia-maria|drambuie|falernum|absinthe|fernet|creme-de|bitters/.test(`${i.id} ${i.name}`.toLowerCase()))
    .reduce((a, i) => a + (i.amount || 0), 0);
}

// ----------------------------------------------------------------------------
// Drink-style filters (replace the old "moods")
// ----------------------------------------------------------------------------
export const STYLE_FILTERS = [
  { id: 'all', label: 'All', icon: '🍸', test: () => true },
  { id: 'strong', label: 'Strong & Stirred', icon: '🥃', test: r => !isZeroProof(r) && (/stirred|spirit-forward/.test(methodText(r)) || (flavor(r, 'boozy') >= 5 && !has(r, CITRUS))) },
  { id: 'sour', label: 'Sours', icon: '🍋', test: r => has(r, CITRUS) && !has(r, FIZZ) && !isZeroProof(r) },
  { id: 'egg-white', label: 'Egg White', icon: '🥚', test: r => has(r, /fresh-eggs|egg white|albumen|aquafaba/) || tagged(r, /egg white/) },
  { id: 'fizzy', label: 'Fizzy & Long', icon: '🫧', test: r => has(r, FIZZ) },
  { id: 'bitter', label: 'Bitter & Aperitivo', icon: '🍊', test: r => has(r, /campari|aperol|amaro|averna|cynar|fernet|suze/) || flavor(r, 'bitter') >= 4 },
  { id: 'tropical', label: 'Tropical & Tiki', icon: '🌴', test: r => has(r, /pineapple|orgeat|falernum|coconut|passion|allspice/) || tagged(r, /tiki|tropical/) },
  { id: 'herbal', label: 'Herbal', icon: '🌿', test: r => has(r, /chartreuse|benedictine|absinthe|fresh-mint|fresh-basil|drambuie|creme-de-menthe/) },
  { id: 'floral', label: 'Floral', icon: '🌸', test: r => has(r, /st-germain|elderflower|violette|lillet/) || tagged(r, /floral/) },
  { id: 'fruity', label: 'Fruity', icon: '🍓', test: r => has(r, /raspberr|strawberr|peach|cherry-heering|cranberry|apple-cider|raspberry-syrup|blackberr/) || tagged(r, /fruity|berry/) },
  { id: 'smoky', label: 'Smoky', icon: '🔥', test: r => has(r, /mezcal|islay/) || tagged(r, /smoky|smoke/) },
  { id: 'coffee', label: 'Coffee', icon: '☕', test: r => has(r, /cold-brew|espresso|tia-maria|coffee/) },
  { id: 'creamy', label: 'Creamy & Dessert', icon: '🍮', test: r => has(r, /heavy-cream|cream-of-coconut|creme-de-cacao|white-creme-de-cacao/) },
  { id: 'low-abv', label: 'Low-ABV', icon: '🍷', test: r => !isZeroProof(r) && (tagged(r, /low-abv/) || (baseSpiritOz(r) <= 0.5 && liqueurOz(r) <= 1)) },
  { id: 'zero-proof', label: 'Zero-Proof', icon: '🍃', test: r => isZeroProof(r) },
  { id: 'custom', label: 'My Creations', icon: '🎨', test: r => Boolean(r.isCustom) }
];

export function matchesStyle(recipe, styleId) {
  const f = STYLE_FILTERS.find(s => s.id === styleId);
  return f ? f.test(recipe) : true;
}

// ----------------------------------------------------------------------------
// Availability ("Show") filters
// ----------------------------------------------------------------------------
export const SHOW_FILTERS = [
  { id: 'all', label: 'Everything', test: () => true },
  { id: 'can-make', label: 'Can make now', test: a => a.canMake },
  { id: 'with-swap', label: 'With a swap', test: a => !a.canMake && a.canMakeWithSub },
  { id: 'missing-1', label: 'One bottle away', test: a => !a.canMake && !a.canMakeWithSub && a.missingCount === 1 },
  { id: 'favorites', label: 'Favorites', test: a => a.isFavorite },
  { id: 'want-to-try', label: 'Want to try', test: a => a.isWantToTry }
];

export function matchesShow(item, showId) {
  const f = SHOW_FILTERS.find(s => s.id === showId);
  return f ? f.test(item) : true;
}

// ----------------------------------------------------------------------------
// Search: every word must match somewhere (name, ingredients, tags, glass,
// method, notes, garnish). Common synonyms and flavor words are understood,
// and a leading "-" or "no " excludes a word ("sour -egg", "no egg").
// ----------------------------------------------------------------------------
const SYNONYMS = {
  whiskey: ['whiskey', 'whisky', 'bourbon', 'rye', 'scotch'],
  whisky: ['whiskey', 'whisky', 'bourbon', 'rye', 'scotch'],
  agave: ['tequila', 'mezcal', 'agave'],
  tequila: ['tequila', 'mezcal'],
  brandy: ['brandy', 'cognac', 'pisco', 'applejack', 'armagnac'],
  rum: ['rum', 'cachaça', 'cachaca', 'agricole'],
  citrus: ['lemon', 'lime', 'grapefruit', 'orange'],
  bubbly: ['champagne', 'prosecco', 'sparkling', 'soda', 'tonic', 'ginger beer'],
  sparkling: ['champagne', 'prosecco', 'sparkling', 'soda', 'tonic', 'ginger beer'],
  fizzy: ['champagne', 'prosecco', 'sparkling', 'soda', 'tonic', 'ginger beer', 'fizz'],
  egg: ['egg', 'albumen', 'aquafaba'],
  coffee: ['coffee', 'espresso', 'cold brew', 'tia maria'],
  martini: ['martini'],
  tiki: ['tiki', 'tropical', 'orgeat', 'falernum', 'pineapple']
};

const FLAVOR_WORDS = { sweet: 'sweet', sour: 'sour', tart: 'sour', boozy: 'boozy', strong: 'boozy', herbal: 'herbal' };

const searchCache = new WeakMap();
function searchText(recipe) {
  if (searchCache.has(recipe)) return searchCache.get(recipe);
  const text = [
    recipe.name, recipe.category, recipe.glass, recipe.ice, recipe.method, recipe.techniqueRule,
    ...(recipe.tags || []),
    ...recipe.ingredients.map(i => `${i.name} ${(i.id || '').replace(/-/g, ' ')} ${i.note || ''}`),
    ...(recipe.instructions || [])
  ].join(' ').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  searchCache.set(recipe, text);
  return text;
}

export function parseQuery(query) {
  const raw = (query || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  if (!raw) return { include: [], exclude: [] };
  const words = raw.replace(/\bno\s+/g, '-').replace(/\bwithout\s+/g, '-').split(/\s+/).filter(Boolean);
  const include = [];
  const exclude = [];
  words.forEach(w => {
    if (w.startsWith('-') && w.length > 1) exclude.push(w.slice(1));
    else if (w.length > 0) include.push(w);
  });
  return { include, exclude };
}

// Words answered by what the drink is, not by text that happens to contain them
const CONCEPT_WORDS = {
  mocktail: (r) => isZeroProof(r),
  mocktails: (r) => isZeroProof(r),
  'zero-proof': (r) => isZeroProof(r),
  'non-alcoholic': (r) => isZeroProof(r),
  nonalcoholic: (r) => isZeroProof(r),
  bitter: (r) => matchesStyle(r, 'bitter'),
  fizzy: (r) => matchesStyle(r, 'fizzy'),
  stirred: (r) => matchesStyle(r, 'strong'),
  creamy: (r) => matchesStyle(r, 'creamy') || matchesStyle(r, 'egg-white'),
  smoky: (r) => matchesStyle(r, 'smoky'),
  tropical: (r) => matchesStyle(r, 'tropical'),
  floral: (r) => matchesStyle(r, 'floral'),
  fruity: (r) => matchesStyle(r, 'fruity'),
  'low-abv': (r) => matchesStyle(r, 'low-abv')
};

function termMatches(recipe, term) {
  if (CONCEPT_WORDS[term]) return CONCEPT_WORDS[term](recipe);
  const text = searchText(recipe);
  const options = SYNONYMS[term] || [term];
  if (options.some(o => text.includes(o))) return true;
  // Plural/singular forgiveness ("sours" -> "sour")
  if (term.length > 3 && term.endsWith('s') && text.includes(term.slice(0, -1))) return true;
  const fl = FLAVOR_WORDS[term];
  return Boolean(fl && flavor(recipe, fl) >= 4);
}

export function matchesSearch(recipe, parsed) {
  if (!parsed.include.length && !parsed.exclude.length) return true;
  return parsed.include.every(t => termMatches(recipe, t)) && !parsed.exclude.some(t => termMatches(recipe, t));
}

export const SEARCH_SUGGESTIONS = ['gin sour', 'whiskey stirred', 'mezcal', 'no egg', 'champagne', 'coupe', 'bitter', 'coffee'];

// ----------------------------------------------------------------------------
// "Help me choose": a few quick decisions, then scored recommendations
// ----------------------------------------------------------------------------
export function spiritOf(recipe) {
  const t = recipe.ingredients.filter(i => i.unit === 'oz').map(i => `${i.id} ${i.name}`.toLowerCase()).join(' ');
  return {
    whiskey: /bourbon|rye|scotch|whisk/.test(t),
    gin: /\bgin\b|-gin/.test(t),
    rum: /rum|cachaca|cachaça|agricole/.test(t),
    agave: /tequila|mezcal/.test(t),
    vodka: /vodka/.test(t),
    brandy: /cognac|brandy|pisco|applejack/.test(t)
  };
}

export const CHOOSER_STEPS = [
  {
    id: 'spirit',
    question: 'What spirit sounds good?',
    options: [
      { id: 'whiskey', label: 'Whiskey', icon: '🥃' },
      { id: 'gin', label: 'Gin', icon: '🌲' },
      { id: 'rum', label: 'Rum', icon: '🏝️' },
      { id: 'agave', label: 'Tequila or Mezcal', icon: '🌵' },
      { id: 'vodka', label: 'Vodka', icon: '🧊' },
      { id: 'brandy', label: 'Brandy or Cognac', icon: '🍇' },
      { id: 'light', label: 'Low or no alcohol', icon: '🍃' },
      { id: 'any', label: 'Surprise me', icon: '🎲' }
    ]
  },
  {
    id: 'style',
    question: 'How do you want it to drink?',
    options: [
      { id: 'strong', label: 'Strong & stirred', hint: 'Slow sipper, spirit up front', icon: '🥃' },
      { id: 'sour', label: 'Bright & tart', hint: 'Fresh citrus, shaken', icon: '🍋' },
      { id: 'fizzy', label: 'Long & bubbly', hint: 'Tall and refreshing', icon: '🫧' },
      { id: 'creamy', label: 'Rich & silky', hint: 'Egg white, cream or coffee', icon: '🍮' },
      { id: 'any', label: 'No preference', icon: '🤷' }
    ]
  },
  {
    id: 'flavor',
    question: 'Pick a flavor to lean into',
    options: [
      { id: 'sweet', label: 'A little sweet', icon: '🍯' },
      { id: 'bitter', label: 'Bitter', icon: '🍊' },
      { id: 'herbal', label: 'Herbal', icon: '🌿' },
      { id: 'fruity', label: 'Fruity', icon: '🍓' },
      { id: 'smoky', label: 'Smoky', icon: '🔥' },
      { id: 'any', label: 'Anything goes', icon: '✨' }
    ]
  },
  {
    id: 'stock',
    question: 'Only drinks you can make tonight?',
    options: [
      { id: 'ready', label: 'Yes, from my bar', hint: 'Swaps allowed', icon: '✅' },
      { id: 'any', label: 'Show me everything', hint: "I don't mind shopping", icon: '🛒' }
    ]
  }
];

const STYLE_FOR_CHOICE = {
  strong: (r) => matchesStyle(r, 'strong'),
  sour: (r) => matchesStyle(r, 'sour'),
  fizzy: (r) => matchesStyle(r, 'fizzy'),
  creamy: (r) => matchesStyle(r, 'egg-white') || matchesStyle(r, 'creamy') || matchesStyle(r, 'coffee')
};

const FLAVOR_FOR_CHOICE = {
  sweet: (r) => flavor(r, 'sweet') >= 3,
  bitter: (r) => matchesStyle(r, 'bitter'),
  herbal: (r) => matchesStyle(r, 'herbal') || flavor(r, 'herbal') >= 4,
  fruity: (r) => matchesStyle(r, 'fruity') || matchesStyle(r, 'tropical'),
  smoky: (r) => matchesStyle(r, 'smoky')
};

const LABELS = Object.fromEntries(CHOOSER_STEPS.flatMap(s => s.options.map(o => [`${s.id}:${o.id}`, o.label])));

// analyzed: [{ recipe, canMake, canMakeWithSub, isFavorite, isWantToTry, ... }]
export function recommendDrinks(analyzed, answers, count = 3) {
  const spirit = answers.spirit || 'any';
  const style = STYLE_FOR_CHOICE[answers.style] ? answers.style : 'any';
  const fl = FLAVOR_FOR_CHOICE[answers.flavor] ? answers.flavor : 'any';
  const readyOnly = answers.stock === 'ready';

  const passesSpirit = (r) => {
    if (spirit === 'any') return !isZeroProof(r);
    if (spirit === 'light') return isZeroProof(r) || matchesStyle(r, 'low-abv');
    return spiritOf(r)[spirit];
  };
  const passesStock = (a) => !readyOnly || a.canMake || a.canMakeWithSub;

  const score = (a) => {
    const r = a.recipe;
    let s = 0;
    const reasons = [];
    if (spirit !== 'any') reasons.push(LABELS[`spirit:${spirit}`]);
    if (style !== 'any' && STYLE_FOR_CHOICE[style](r)) { s += 5; reasons.push(LABELS[`style:${style}`].toLowerCase()); }
    if (fl !== 'any' && FLAVOR_FOR_CHOICE[fl](r)) { s += 4; reasons.push(LABELS[`flavor:${fl}`].toLowerCase()); }
    if (a.canMake) { s += 2; reasons.push('ready to pour'); } else if (a.canMakeWithSub) { s += 1; reasons.push('ready with a swap'); }
    if (a.isFavorite) s += 1.5;
    if (a.isWantToTry) { s += 1.5; reasons.push('on your want-to-try list'); }
    // A small stable shuffle so equal scores don't always return the same drinks
    s += ((r.id.length * 7 + (answers.seed || 0)) % 10) / 20;
    return { ...a, score: s, reasons };
  };

  let pool = analyzed.filter(a => passesSpirit(a.recipe) && passesStock(a));
  let relaxed = false;
  if (pool.length === 0) {
    // Nothing fits every answer: keep the spirit, drop the stock limit, then drop the spirit
    pool = analyzed.filter(a => passesSpirit(a.recipe));
    if (pool.length === 0) pool = analyzed.filter(a => !isZeroProof(a.recipe));
    relaxed = true;
  }
  const ranked = pool.map(score).sort((a, b) => b.score - a.score);
  // If style and flavor both missed for the top pick, say we stretched
  const exact = ranked.filter(x => (style === 'any' || STYLE_FOR_CHOICE[style](x.recipe)) && (fl === 'any' || FLAVOR_FOR_CHOICE[fl](x.recipe)));
  return { picks: ranked.slice(0, count), relaxed: relaxed || exact.length === 0, total: pool.length };
}

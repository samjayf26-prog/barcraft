// ============================================================================
// BarCraft Matching & Recommendation Engine
// 'What Can I Make?', Missing 1 Ingredient, Unlock Yield, and Daily Drink
// ============================================================================

import { MASTER_RECIPES, SUBSTITUTION_KNOWLEDGE_BASE } from './db.js';
import { inventoryManager } from './inventory.js';

export function getAllRecipes() {
  const custom = inventoryManager.loadCustomRecipes();
  const overrides = inventoryManager.loadRecipeOverrides();

  const masterMerged = MASTER_RECIPES.map(recipe => {
    if (overrides && overrides[recipe.id]) {
      return { ...recipe, ...overrides[recipe.id], isEdited: true };
    }
    return recipe;
  });

  return [...masterMerged, ...custom];
}

/**
 * Returns all substitutions applicable to a given recipe, prioritized by
 * whether the original ingredient is currently missing and the substitute is in stock.
 */
export function getSubstitutionsForRecipe(recipe, inStockIds) {
  if (!recipe || !recipe.ingredients) return [];
  const inStock = inStockIds || inventoryManager.getInStockIngredientIds();
  const allIngredients = inventoryManager.getAllIngredients();
  const ingNameMap = new Map(allIngredients.map(i => [i.id, i.name]));
  const results = [];

  recipe.ingredients.forEach(ing => {
    const isMissing = !inStock.has(ing.id);
    const readableOriginalName = ingNameMap.get(ing.id) || ing.name;

    // Find all substitution pairings from knowledge base where originalId matches this recipe ingredient
    const candidates = SUBSTITUTION_KNOWLEDGE_BASE.filter(sub => sub.originalId === ing.id);

    candidates.forEach(sub => {
      const substituteInStock = inStock.has(sub.substituteId);
      const readableSubName = ingNameMap.get(sub.substituteId) || sub.substituteId;

      results.push({
        ...sub,
        originalIngredientId: ing.id,
        originalIngredientName: readableOriginalName,
        substituteName: readableSubName,
        isOriginalMissing: isMissing,
        substituteInStock
      });
    });
  });

  // Sort candidates:
  // 1. Missing original with in-stock substitute (highest priority)
  // 2. In-stock substitute
  // 3. Recommended > Acceptable > Creative
  const confScore = { 'recommended': 1, 'acceptable': 2, 'creative': 3 };
  results.sort((a, b) => {
    if (a.isOriginalMissing && a.substituteInStock && (!b.isOriginalMissing || !b.substituteInStock)) return -1;
    if (b.isOriginalMissing && b.substituteInStock && (!a.isOriginalMissing || !a.substituteInStock)) return 1;
    if (a.substituteInStock && !b.substituteInStock) return -1;
    if (b.substituteInStock && !a.substituteInStock) return 1;
    return (confScore[a.confidence] || 9) - (confScore[b.confidence] || 9);
  });

  return results;
}

/**
 * Computes availability status for all recipes against current in-stock inventory.
 * Also evaluates smart substitutions for missing ingredients.
 */
export function analyzeRecipesAvailability() {
  const recipes = getAllRecipes();
  const inStockIds = inventoryManager.getInStockIngredientIds();
  const allIngredients = inventoryManager.getAllIngredients();
  const ingNameMap = new Map(allIngredients.map(i => [i.id, i.name]));

  return recipes.map(recipe => {
    const missing = [];
    const available = [];

    recipe.ingredients.forEach(ing => {
      // If the ingredient is marked optional, skip from hard missing requirement
      if (ing.optional) {
        if (inStockIds.has(ing.id)) available.push(ing);
        return;
      }

      if (inStockIds.has(ing.id)) {
        available.push(ing);
      } else {
        const readableName = ingNameMap.get(ing.id) || ing.name;
        missing.push({
          id: ing.id,
          name: readableName,
          amount: ing.amount,
          unit: ing.unit
        });
      }
    });

    const totalRequired = recipe.ingredients.filter(i => !i.optional).length;
    const canMake = missing.length === 0;

    // Check intelligent substitution options
    const allSubs = getSubstitutionsForRecipe(recipe, inStockIds);
    // Find substitutions that resolve missing ingredients with in-stock items
    const activeSubCandidates = allSubs.filter(s => s.isOriginalMissing && s.substituteInStock);
    const resolvedMissingIds = new Set(activeSubCandidates.map(s => s.originalIngredientId));

    // canMakeWithSub is true when not directly makeable, but EVERY missing ingredient has an in-stock substitute!
    const canMakeWithSub = !canMake && missing.length > 0 && missing.every(m => resolvedMissingIds.has(m.id));

    // Summary of primary substitution (for cards and previews)
    const primarySub = activeSubCandidates[0] || null;
    const primarySubSummary = primarySub 
      ? `${primarySub.substituteName} for ${primarySub.originalIngredientName}`
      : null;

    const matchPercentage = totalRequired > 0 
      ? Math.round(((totalRequired - missing.length) / totalRequired) * 100)
      : 100;

    return {
      recipe,
      canMake,
      canMakeWithSub,
      substitutions: allSubs,
      substitutionsAvailable: allSubs.filter(s => s.substituteInStock),
      primarySubSummary,
      missingCount: missing.length,
      missingIngredients: missing,
      availableIngredients: available,
      matchPercentage,
      isFavorite: inventoryManager.isFavorite(recipe.id),
      isWantToTry: inventoryManager.isWantToTry(recipe.id)
    };
  });
}

/**
 * Computes the Marginal Recipe Yield ("Next Bottle to Buy" Recommender).
 * Identifies which missing ingredients unlock the maximum number of new cocktails.
 */
export function calculateUnlockRecommendations() {
  const analyzed = analyzeRecipesAvailability();
  const inStockIds = inventoryManager.getInStockIngredientIds();
  const allIngredients = inventoryManager.getAllIngredients();
  const ingredientMap = new Map(allIngredients.map(i => [i.id, i]));

  // Find all missing ingredients across recipes that are currently Missing 1
  const unlockYieldMap = new Map();

  analyzed.forEach(item => {
    if (item.missingCount === 1) {
      const missingIng = item.missingIngredients[0];
      if (!unlockYieldMap.has(missingIng.id)) {
        const fullItem = ingredientMap.get(missingIng.id);
        unlockYieldMap.set(missingIng.id, {
          id: missingIng.id,
          name: fullItem ? fullItem.name : missingIng.name,
          category: fullItem ? fullItem.category : 'Modifier',
          benchmark: fullItem ? fullItem.benchmark : '',
          unlocksNow: [], // Recipes that become 100% makeable!
          unlocksPartial: [] // Recipes that move closer
        });
      }
      unlockYieldMap.get(missingIng.id).unlocksNow.push(item.recipe);
    } else if (item.missingCount === 2) {
      item.missingIngredients.forEach(missingIng => {
        if (!unlockYieldMap.has(missingIng.id)) {
          const fullItem = ingredientMap.get(missingIng.id);
          unlockYieldMap.set(missingIng.id, {
            id: missingIng.id,
            name: fullItem ? fullItem.name : missingIng.name,
            category: fullItem ? fullItem.category : 'Modifier',
            benchmark: fullItem ? fullItem.benchmark : '',
            unlocksNow: [],
            unlocksPartial: []
          });
        }
        unlockYieldMap.get(missingIng.id).unlocksPartial.push(item.recipe);
      });
    }
  });

  // Convert to array and sort by unlock yield count
  const sorted = Array.from(unlockYieldMap.values())
    .filter(item => !inStockIds.has(item.id))
    .sort((a, b) => {
      // Prioritize bottles that directly unlock cocktails (Missing 1 -> 0)
      if (b.unlocksNow.length !== a.unlocksNow.length) {
        return b.unlocksNow.length - a.unlocksNow.length;
      }
      return b.unlocksPartial.length - a.unlocksPartial.length;
    });

  return sorted;
}

/**
 * Returns a drink recommendation.
 * - When isSurpriseMe is true: randomly selects from ALL currently in-stock cocktails across the entire database!
 * - When isSurpriseMe is false: deterministic daily pick from all in-stock cocktails based on today's calendar date.
 */
export function getDrinkRecommendation({ isSurpriseMe = false, offset = 0 } = {}) {
  const analyzed = analyzeRecipesAvailability();
  // Filter for ALL drinks the user has 100% in-stock ingredients for:
  const canMake = analyzed.filter(a => a.canMake);

  // Pool: All in-stock drinks across all categories (not just favorites).
  // Falls back to drinks makeable with smart substitutes, then to all analyzed recipes.
  const pool = canMake.length > 0 ? canMake : (canMakeWithSub.length > 0 ? canMakeWithSub : analyzed);
  if (pool.length === 0) return null;

  if (isSurpriseMe) {
    // Pure random pick across ALL currently in-stock drinks
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  // Deterministic daily pick from all in-stock drinks
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash + offset) % pool.length;
  return pool[index];
}

export function getDailyDrinkRecommendation(seedOffset = 0) {
  return getDrinkRecommendation({ isSurpriseMe: false, offset: seedOffset });
}

export function getRandomInStockDrink() {
  return getDrinkRecommendation({ isSurpriseMe: true });
}


/**
 * Filters the analyzed recipe list according to active UI filters.
 */
export function filterRecipes(analyzedList, {
  availabilityFilter = 'all', // 'all', 'can-make', 'substitutes', 'missing-1', 'favorites', 'want-to-try'
  categoryFilter = 'all',
  spiritFilter = 'all',
  modifierFilter = 'all',
  keywordFilter = 'all',
  tagFilter = 'all',
  searchQuery = ''
}) {
  const query = searchQuery.trim().toLowerCase();

  return analyzedList.filter(item => {
    const { recipe, canMake, canMakeWithSub, missingCount, isFavorite, isWantToTry } = item;

    // Availability Filter
    if (availabilityFilter === 'can-make' && !canMake) return false;
    if (availabilityFilter === 'substitutes' && !canMake && !canMakeWithSub) return false;
    if (availabilityFilter === 'missing-1' && missingCount !== 1) return false;
    if (availabilityFilter === 'favorites' && !isFavorite) return false;
    if (availabilityFilter === 'want-to-try' && !isWantToTry) return false;

    // Category Filter
    if (categoryFilter !== 'all' && recipe.category !== categoryFilter) {
      return false;
    }

    // Spirit Base Filter
    if (spiritFilter !== 'all') {
      const matchSpirit = recipe.ingredients.some(ing => {
        const id = ing.id.toLowerCase();
        const name = ing.name.toLowerCase();
        if (spiritFilter === 'whiskey') return id.includes('whiskey') || id.includes('bourbon') || id.includes('scotch') || id.includes('rye');
        if (spiritFilter === 'gin') return id.includes('gin');
        if (spiritFilter === 'rum') return id.includes('rum') || id.includes('cachaca') || id.includes('agricole');
        if (spiritFilter === 'tequila') return id.includes('tequila') || id.includes('mezcal');
        if (spiritFilter === 'vodka') return id.includes('vodka');
        if (spiritFilter === 'brandy') return id.includes('cognac') || id.includes('brandy') || id.includes('applejack') || id.includes('pisco');
        if (spiritFilter === 'sparkling') return id.includes('champagne') || id.includes('prosecco');
        if (spiritFilter === 'zero-proof') return recipe.category.includes('Zero-Proof');
        return id.includes(spiritFilter) || name.includes(spiritFilter);
      });
      if (!matchSpirit) return false;
    }

    // Modifier / Liqueur Filter
    if (modifierFilter !== 'all') {
      if (modifierFilter === 'custom-riffs') {
        const isRiffOrCustom = recipe.isCustom || recipe.isRiff || (recipe.tags && recipe.tags.some(t => t.toLowerCase().includes('riff') || t.toLowerCase().includes('custom')));
        if (!isRiffOrCustom) return false;
      } else {
        const matchModifier = recipe.ingredients.some(ing => {
          const id = ing.id.toLowerCase();
          const name = ing.name.toLowerCase();
          if (modifierFilter === 'vermouth') {
            return id.includes('vermouth') || name.includes('vermouth') || id.includes('carpano') || id.includes('punt-e-mes') || id.includes('lillet') || name.includes('lillet');
          }
          if (modifierFilter === 'campari-aperitivo') {
            return id.includes('campari') || name.includes('campari') || id.includes('aperol') || name.includes('aperol') || id.includes('suze') || id.includes('red-bitter');
          }
          if (modifierFilter === 'chartreuse') {
            return id.includes('chartreuse') || name.includes('chartreuse');
          }
          if (modifierFilter === 'amaro') {
            return id.includes('amaro') || name.includes('amaro') || id.includes('cynar') || id.includes('averna') || id.includes('fernet') || id.includes('nonino') || id.includes('montenegro');
          }
          if (modifierFilter === 'orange-liqueur') {
            return id.includes('cointreau') || name.includes('cointreau') || id.includes('triple-sec') || id.includes('curacao') || id.includes('grand-marnier');
          }
          if (modifierFilter === 'maraschino') {
            return id.includes('maraschino') || name.includes('maraschino') || id.includes('luxardo');
          }
          if (modifierFilter === 'herbal-botanical') {
            return id.includes('benedictine') || id.includes('absinthe') || id.includes('st-germain') || id.includes('elderflower') || id.includes('drambuie') || id.includes('galliano');
          }
          if (modifierFilter === 'coffee-chocolate') {
            return id.includes('coffee') || id.includes('kahlua') || id.includes('tia-maria') || id.includes('cacao') || id.includes('espresso');
          }
          if (modifierFilter === 'orgeat-almond') {
            return id.includes('orgeat') || name.includes('orgeat') || id.includes('amaretto') || name.includes('amaretto');
          }
          if (modifierFilter === 'syrups') {
            return id.includes('syrup') || name.includes('syrup') || id.includes('agave') || id.includes('grenadine') || id.includes('honey');
          }
          if (modifierFilter === 'bitters') {
            return id.includes('bitters') || name.includes('bitters') || id.includes('angostura') || id.includes('peychaud');
          }
          if (modifierFilter === 'egg-white') {
            return id.includes('egg-white') || name.includes('egg white');
          }
          return false;
        });
        if (!matchModifier) return false;
      }
    }

    // Keyword Quick-Filter Chip
    if (keywordFilter !== 'all') {
      const kw = keywordFilter.toLowerCase();
      if (kw === 'riffs' || kw === 'custom') {
        const isRiffOrCustom = recipe.isCustom || recipe.isRiff || (recipe.tags && recipe.tags.some(t => t.toLowerCase().includes('riff') || t.toLowerCase().includes('custom')));
        if (!isRiffOrCustom) return false;
      } else {
        const matchName = recipe.name.toLowerCase().includes(kw);
        const matchIng = recipe.ingredients.some(i => i.name.toLowerCase().includes(kw) || i.id.toLowerCase().includes(kw));
        const matchTag = recipe.tags && recipe.tags.some(t => t.toLowerCase().includes(kw));
        const matchGlass = recipe.glass && recipe.glass.toLowerCase().includes(kw);
        const matchIce = recipe.ice && recipe.ice.toLowerCase().includes(kw);
        const matchMethod = recipe.method && recipe.method.toLowerCase().includes(kw);
        if (!matchName && !matchIng && !matchTag && !matchGlass && !matchIce && !matchMethod) {
          return false;
        }
      }
    }

    // Tag Filter
    if (tagFilter !== 'all') {
      if (!recipe.tags || !recipe.tags.some(t => t.toLowerCase() === tagFilter.toLowerCase())) {
        return false;
      }
    }

    // Text Search (Multi-term keyword search)
    if (query) {
      const terms = query.split(/\s+/).filter(Boolean);
      const matchesAllTerms = terms.every(term => {
        if (term === 'riff' || term === 'riffs') {
          return recipe.isRiff || recipe.name.toLowerCase().includes('riff') || (recipe.tags && recipe.tags.some(t => t.toLowerCase().includes('riff')));
        }
        if (term === 'custom') {
          return recipe.isCustom || (recipe.tags && recipe.tags.some(t => t.toLowerCase().includes('custom')));
        }
        const matchName = recipe.name.toLowerCase().includes(term);
        const matchIng = recipe.ingredients.some(i => i.name.toLowerCase().includes(term) || i.id.toLowerCase().includes(term));
        const matchTag = recipe.tags && recipe.tags.some(t => t.toLowerCase().includes(term));
        const matchCategory = recipe.category.toLowerCase().includes(term);
        const matchGlass = recipe.glass && recipe.glass.toLowerCase().includes(term);
        const matchIce = recipe.ice && recipe.ice.toLowerCase().includes(term);
        const matchMethod = recipe.method && recipe.method.toLowerCase().includes(term);
        const matchTechnique = recipe.techniqueRule && recipe.techniqueRule.toLowerCase().includes(term);
        return matchName || matchIng || matchTag || matchCategory || matchGlass || matchIce || matchMethod || matchTechnique;
      });

      if (!matchesAllTerms) {
        return false;
      }
    }

    return true;
  });
}

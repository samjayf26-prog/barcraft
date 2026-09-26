// ============================================================================
// BarCraft Matching & Recommendation Engine
// 'What Can I Make?', Missing 1 Ingredient, Unlock Yield, and Daily Drink
// ============================================================================

import { MASTER_RECIPES } from './db.js';
import { inventoryManager } from './inventory.js';

export function getAllRecipes() {
  const custom = inventoryManager.loadCustomRecipes();
  return [...MASTER_RECIPES, ...custom];
}

/**
 * Computes availability status for all recipes against current in-stock inventory.
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
    const matchPercentage = totalRequired > 0 
      ? Math.round(((totalRequired - missing.length) / totalRequired) * 100)
      : 100;

    return {
      recipe,
      canMake: missing.length === 0,
      missingCount: missing.length,
      missingIngredients: missing,
      availableIngredients: available,
      matchPercentage,
      isFavorite: inventoryManager.isFavorite(recipe.id)
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
 * Returns a revolving Daily Drink Recommendation.
 * Deterministic for each calendar day, prioritizing "Can Make Now" and favorites.
 */
export function getDailyDrinkRecommendation(seedOffset = 0) {
  const analyzed = analyzeRecipesAvailability();
  const canMake = analyzed.filter(a => a.canMake);

  // Pool to pick from: prefer favorites you can make, then any you can make, then all favorites
  let candidatePool = canMake.filter(a => a.isFavorite);
  if (candidatePool.length === 0) {
    candidatePool = canMake;
  }
  if (candidatePool.length === 0) {
    candidatePool = analyzed.filter(a => a.isFavorite);
  }
  if (candidatePool.length === 0) {
    candidatePool = analyzed;
  }

  // Generate deterministic index using today's date string + offset
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash + seedOffset) % candidatePool.length;
  return candidatePool[index];
}

/**
 * Filters the analyzed recipe list according to active UI filters.
 */
export function filterRecipes(analyzedList, {
  availabilityFilter = 'all', // 'all', 'can-make', 'missing-1', 'favorites'
  categoryFilter = 'all',
  spiritFilter = 'all',
  tagFilter = 'all',
  searchQuery = ''
}) {
  const query = searchQuery.trim().toLowerCase();

  return analyzedList.filter(item => {
    const { recipe, canMake, missingCount, isFavorite } = item;

    // Availability Filter
    if (availabilityFilter === 'can-make' && !canMake) return false;
    if (availabilityFilter === 'missing-1' && missingCount !== 1) return false;
    if (availabilityFilter === 'favorites' && !isFavorite) return false;

    // Category Filter
    if (categoryFilter !== 'all' && recipe.category !== categoryFilter) {
      return false;
    }

    // Spirit Base Filter
    if (spiritFilter !== 'all') {
      const matchSpirit = recipe.ingredients.some(ing => {
        const id = ing.id.toLowerCase();
        const name = ing.name.toLowerCase();
        if (spiritFilter === 'whiskey') return id.includes('whiskey') || id.includes('bourbon') || id.includes('scotch');
        if (spiritFilter === 'gin') return id.includes('gin');
        if (spiritFilter === 'rum') return id.includes('rum');
        if (spiritFilter === 'tequila') return id.includes('tequila');
        if (spiritFilter === 'mezcal') return id.includes('mezcal');
        if (spiritFilter === 'vodka') return id.includes('vodka');
        if (spiritFilter === 'zero-proof') return recipe.category.includes('Zero-Proof');
        return id.includes(spiritFilter) || name.includes(spiritFilter);
      });
      if (!matchSpirit) return false;
    }

    // Tag Filter
    if (tagFilter !== 'all') {
      if (!recipe.tags || !recipe.tags.some(t => t.toLowerCase() === tagFilter.toLowerCase())) {
        return false;
      }
    }

    // Text Search
    if (query) {
      const matchName = recipe.name.toLowerCase().includes(query);
      const matchIng = recipe.ingredients.some(i => i.name.toLowerCase().includes(query));
      const matchTag = recipe.tags && recipe.tags.some(t => t.toLowerCase().includes(query));
      const matchCategory = recipe.category.toLowerCase().includes(query);
      if (!matchName && !matchIng && !matchTag && !matchCategory) {
        return false;
      }
    }

    return true;
  });
}

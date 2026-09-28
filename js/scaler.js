// ============================================================================
// BarCraft Recipe Scaler, Unit Converter & Batching Dilution Engine
// Handles oz to ml, multi-serving multipliers, and freezer batch calculations
// ============================================================================

export function formatFractionalOz(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '';
  const rounded = Math.round(amount * 100) / 100;

  // Exact fraction lookup table for standard cocktail specs
  const fractionMap = {
    0.15: '1 barspoon (~⅛ oz)',
    0.2: '⅕ oz',
    0.25: '¼ oz',
    0.33: '⅓ oz',
    0.5: '½ oz',
    0.66: '⅔ oz',
    0.75: '¾ oz',
    1.0: '1 oz',
    1.25: '1¼ oz',
    1.5: '1½ oz',
    1.75: '1¾ oz',
    2.0: '2 oz',
    2.25: '2¼ oz',
    2.5: '2½ oz',
    3.0: '3 oz',
    4.0: '4 oz'
  };

  if (fractionMap[rounded]) return fractionMap[rounded];

  // Whole number + fraction check
  const whole = Math.floor(rounded);
  const remainder = Math.round((rounded - whole) * 100) / 100;

  if (remainder === 0) return `${whole} oz`;
  if (remainder === 0.25) return whole > 0 ? `${whole}¼ oz` : '¼ oz';
  if (remainder === 0.5) return whole > 0 ? `${whole}½ oz` : '½ oz';
  if (remainder === 0.75) return whole > 0 ? `${whole}¾ oz` : '¾ oz';
  if (remainder === 0.33) return whole > 0 ? `${whole}⅓ oz` : '⅓ oz';
  if (remainder === 0.66) return whole > 0 ? `${whole}⅔ oz` : '⅔ oz';

  return `${rounded} oz`;
}

export function ozToMl(ozAmount) {
  // Standard Difford's & global craft cocktail rounding
  const standardConversions = {
    0.15: 5,   // Barspoon
    0.25: 7.5,
    0.33: 10,
    0.5: 15,
    0.66: 20,
    0.75: 22.5,
    1.0: 30,
    1.25: 37.5,
    1.5: 45,
    1.75: 52.5,
    2.0: 60,
    2.5: 75,
    3.0: 90,
    4.0: 120
  };

  const rounded = Math.round(ozAmount * 100) / 100;
  if (standardConversions[rounded] !== undefined) {
    return standardConversions[rounded];
  }
  return Math.round(ozAmount * 29.5735 * 10) / 10;
}

export function formatAmount(amount, unit = 'oz', ingUnit = 'oz') {
  if (amount === undefined || amount === null) return '';
  if (!ingUnit || ingUnit === 'oz') {
    if (unit === 'ml') {
      return `${ozToMl(amount)} ml`;
    }
    return formatFractionalOz(amount);
  }
  return `${amount} ${ingUnit}`.trim();
}

/**
 * Scales an individual ingredient based on unit, count, and multiplier.
 */
export function scaleIngredient(ingredient, multiplier = 1, unit = 'oz') {
  const scaled = { ...ingredient };

  if (ingredient.unit === 'oz') {
    const rawOz = ingredient.amount * multiplier;
    scaled.scaledAmount = rawOz;

    if (unit === 'ml') {
      const mlVal = ozToMl(rawOz);
      scaled.displayText = `${mlVal} ml`;
    } else {
      scaled.displayText = formatFractionalOz(rawOz);
    }
  } else if (ingredient.unit === 'albumen' || ingredient.unit === 'eggs') {
    // Dampened egg white scaling: 1 for 1-2 drinks, 2 for 3-5 drinks, 3 for 6-8 drinks
    let whites = 1;
    if (multiplier <= 2) whites = 1;
    else if (multiplier <= 5) whites = 2;
    else whites = Math.ceil(multiplier * 0.4);
    scaled.displayText = `${whites} large egg white${whites > 1 ? 's' : ''}`;
  } else if (ingredient.unit === 'dashes') {
    // Bitters scaling: slightly dampened past 4 servings
    let dashes = ingredient.amount * multiplier;
    if (multiplier >= 6) dashes = Math.round(dashes * 0.85);
    scaled.displayText = `${dashes} dashes`;
  } else if (ingredient.unit === 'drops') {
    scaled.displayText = `${ingredient.amount * multiplier} drops`;
  } else if (ingredient.unit === 'slices' || ingredient.unit === 'berries' || ingredient.unit === 'leaves') {
    const count = ingredient.amount * multiplier;
    scaled.displayText = `${count} ${ingredient.unit}`;
  } else {
    // Fallback or top up
    scaled.displayText = ingredient.amount 
      ? `${ingredient.amount * multiplier} ${ingredient.unit}`
      : (ingredient.note || 'To taste');
  }

  if (ingredient.note && ingredient.unit === 'oz') {
    scaled.displayText += ` (${ingredient.note})`;
  }

  return scaled;
}

/**
 * Estimated ABV table for key spirits & liqueurs
 */
const INGREDIENT_ABV = {
  'bourbon': 45,
  'rye-whiskey': 50,
  'london-dry-gin': 45,
  'old-tom-gin': 42,
  'barrel-rested-gin': 45,
  'white-rum': 40,
  'dark-rum': 43,
  'tequila-blanco': 40,
  'tequila-reposado': 40,
  'mezcal': 45,
  'vodka': 40,
  'blended-scotch': 40,
  'islay-scotch': 46,
  'cognac': 40,
  'pisco': 42,
  'applejack': 50,
  'campari': 25,
  'aperol': 11,
  'sweet-vermouth': 16,
  'dry-vermouth': 18,
  'amaretto': 28,
  'amaro-nonino': 35,
  'averna-amaro': 29,
  'luxardo-maraschino': 32,
  'green-chartreuse': 55,
  'yellow-chartreuse': 43,
  'st-germain': 20,
  'dry-curacao': 40,
  'cointreau': 40,
  'grand-marnier': 40,
  'licor-43': 31,
  'tia-maria': 20,
  'cynar': 16.5,
  'fernet-branca': 39,
  'absinthe': 68,
  'creme-de-violette': 22,
  'white-creme-de-cacao': 24,
  'benedictine': 40,
  'lillet-blanc': 17
};

/**
 * Batching & Dilution Math Calculator
 * Computes exact water to add when batching without shaking/stirring in ice.
 */
export function calculateBatchMetrics(recipe, servings = 8) {
  let totalAlcoholVolMl = 0;
  let totalCocktailLiquidMl = 0;

  const isStirred = recipe.category.includes('Stirred') || recipe.method.toLowerCase().includes('stir');
  // Stirred drinks target 20-22% dilution; Shaken drinks target 27-30%
  const dilutionRatio = isStirred ? 0.22 : 0.28;

  recipe.ingredients.forEach(ing => {
    if (ing.unit === 'oz' && ing.amount) {
      const ml = ozToMl(ing.amount * servings);
      totalCocktailLiquidMl += ml;

      const abv = INGREDIENT_ABV[ing.id] || 0;
      totalAlcoholVolMl += (ml * (abv / 100));
    }
  });

  const waterToAddMl = Math.round(totalCocktailLiquidMl * dilutionRatio);
  const totalBatchVolMl = totalCocktailLiquidMl + waterToAddMl;

  const finalAbv = totalBatchVolMl > 0 
    ? Math.round((totalAlcoholVolMl / totalBatchVolMl) * 1000) / 10
    : 0;

  return {
    servings,
    dilutionRatioPercent: Math.round(dilutionRatio * 100),
    isStirred,
    waterToAddMl,
    waterToAddOz: Math.round((waterToAddMl / 29.5735) * 10) / 10,
    totalCocktailLiquidMl,
    totalBatchVolMl,
    totalBatchVolOz: Math.round((totalBatchVolMl / 29.5735) * 10) / 10,
    calculatedAbv: finalAbv,
    freezerSafe: finalAbv >= 22
  };
}

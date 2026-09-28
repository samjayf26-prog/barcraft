// ============================================================================
// BarCraft Inventory & Storage Manager
// Handles In-Stock / Out-of-Stock loop, auto-shopping list sync, category bumping,
// Want-to-Try bookmarks, and localStorage persistence
// ============================================================================

import { INITIAL_INVENTORY, MASTER_RECIPES } from './db.js';

const STORAGE_KEYS = {
  INVENTORY: 'barcraft_inventory_v1',
  SHOPPING_LIST: 'barcraft_shopping_v1',
  CUSTOM_RECIPES: 'barcraft_custom_recipes_v1',
  RECIPE_OVERRIDES: 'barcraft_recipe_overrides_v1',
  FAVORITES: 'barcraft_favorites_v1',
  WANT_TO_TRY: 'barcraft_want_to_try_v1',
  USER_SETTINGS: 'barcraft_settings_v1'
};

class InventoryManager {
  constructor() {
    this.inventory = this.loadInventory();
    this.shoppingList = this.loadShoppingList();
    this.customRecipes = this.loadCustomRecipes();
    this.recipeOverrides = this.loadRecipeOverrides();
    this.favorites = this.loadFavorites();
    this.wantToTry = this.loadWantToTry();
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(event, payload) {
    this.listeners.forEach(cb => {
      try {
        cb(event, payload);
      } catch (err) {
        console.error('Inventory listener error:', err);
      }
    });
  }

  // --- Inventory ---
  loadInventory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      if (data) {
        const saved = JSON.parse(data);
        const savedMap = new Map(saved.map(item => [item.id, item]));

        // Intelligently merge INITIAL_INVENTORY with saved user stock state
        // This ensures existing users gain new ingredients and rich metadata (pricing, benchmarks, defaultListType)
        const merged = INITIAL_INVENTORY.map(initItem => {
          const userItem = savedMap.get(initItem.id);
          if (userItem) {
            return {
              ...initItem,
              inStock: userItem.inStock !== undefined ? userItem.inStock : initItem.inStock,
              customPrice: userItem.customPrice || null
            };
          }
          return { ...initItem };
        });

        // Also keep any custom ingredients the user manually added
        saved.forEach(userItem => {
          if (userItem.isCustom && !merged.some(m => m.id === userItem.id)) {
            merged.push(userItem);
          }
        });

        return merged;
      }
    } catch (e) {
      console.warn('Could not load inventory from localStorage', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_INVENTORY));
  }

  saveInventory() {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(this.inventory));
    } catch (e) {
      console.error('Failed to save inventory to localStorage', e);
    }
  }

  getAllIngredients() {
    return this.inventory;
  }

  getInStockIngredientIds() {
    return new Set(
      this.inventory.filter(item => item.inStock).map(item => item.id)
    );
  }

  getIngredientById(id) {
    return this.inventory.find(item => item.id === id);
  }

  toggleStock(id, forceValue = null) {
    const item = this.getIngredientById(id);
    if (!item) return;

    const newStatus = forceValue !== null ? forceValue : !item.inStock;
    item.inStock = newStatus;
    this.saveInventory();

    // Auto Shopping-List Integration:
    if (!newStatus) {
      // Marked OUT of stock -> auto-add to shopping list in appropriate category (staples vs wishlist)
      this.addToShoppingList(item.id, item.name, item.category, 'auto-out-of-stock');
      this.notify('stock_depleted', { item });
    } else {
      // Marked back in stock -> check off in shopping list
      this.markShoppingItemCompleted(item.id);
      this.notify('stock_restocked', { item });
    }

    this.notify('inventory_changed', { item });
    return item;
  }

  addCustomIngredient(name, category = 'Other', benchmark = '', inStock = true, defaultListType = 'wishlist', suggestedPrice = '') {
    const cleanName = name.trim();
    if (!cleanName) return null;

    const id = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = this.getIngredientById(id);
    if (existing) {
      existing.inStock = inStock;
      if (benchmark) existing.benchmark = benchmark;
      if (suggestedPrice) existing.suggestedPrice = suggestedPrice;
      this.saveInventory();
      this.notify('inventory_changed', { item: existing });
      return existing;
    }

    const newItem = {
      id,
      name: cleanName,
      category: category || 'Modifiers & Liqueurs',
      inStock,
      benchmark: benchmark || 'Custom addition',
      suggestedPrice: suggestedPrice || '',
      defaultListType: defaultListType || 'wishlist',
      valueRationale: 'Custom user addition',
      isCustom: true
    };

    this.inventory.push(newItem);
    this.saveInventory();
    this.notify('inventory_changed', { item: newItem });
    return newItem;
  }

  // --- Shopping List (Staples vs Wishlist) ---
  loadShoppingList() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
      if (data) {
        const list = JSON.parse(data);
        // Ensure each item has listType ('staples' or 'wishlist') and price guidance
        return list.map(item => {
          const invItem = this.getIngredientById(item.id);
          const listType = item.listType || (invItem?.defaultListType) || 'wishlist';
          const suggestedPrice = item.suggestedPrice || (invItem?.suggestedPrice) || '';
          const valueRationale = item.valueRationale || (invItem?.valueRationale) || '';
          return {
            ...item,
            listType,
            suggestedPrice,
            valueRationale
          };
        });
      }
    } catch (e) {
      console.warn('Could not load shopping list', e);
    }
    return [];
  }

  saveShoppingList() {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(this.shoppingList));
    } catch (e) {
      console.error('Failed to save shopping list', e);
    }
  }

  getShoppingList() {
    return this.shoppingList;
  }

  addToShoppingList(id, name, category, source = 'manual', explicitListType = null) {
    const invItem = id ? this.getIngredientById(id) : null;
    const resolvedListType = explicitListType || invItem?.defaultListType || 'wishlist';
    const suggestedPrice = invItem?.suggestedPrice || '';
    const valueRationale = invItem?.valueRationale || '';

    const existing = this.shoppingList.find(item => item.id === id || item.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      existing.checked = false;
      if (explicitListType) existing.listType = explicitListType;
      if (!existing.suggestedPrice && suggestedPrice) existing.suggestedPrice = suggestedPrice;
      if (!existing.valueRationale && valueRationale) existing.valueRationale = valueRationale;
      this.saveShoppingList();
      this.notify('shopping_changed', { list: this.shoppingList });
      return existing;
    }

    const newItem = {
      id: id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      category: category || 'Pantry',
      listType: resolvedListType, // 'staples' | 'wishlist'
      suggestedPrice,
      valueRationale,
      checked: false,
      source,
      addedAt: Date.now()
    };

    this.shoppingList.unshift(newItem);
    this.saveShoppingList();
    this.notify('shopping_changed', { list: this.shoppingList });
    return newItem;
  }

  /**
   * Bumps a shopping list item between 'staples' and 'wishlist' categories.
   */
  moveShoppingItemCategory(id, targetType) {
    const item = this.shoppingList.find(i => i.id === id);
    if (!item) return;

    item.listType = targetType; // 'staples' | 'wishlist'
    this.saveShoppingList();
    this.notify('shopping_changed', { list: this.shoppingList, item });
    return item;
  }

  toggleShoppingItem(id) {
    const item = this.shoppingList.find(i => i.id === id);
    if (!item) return;

    item.checked = !item.checked;
    this.saveShoppingList();

    // If checked (bought), immediately restock in inventory!
    if (item.checked) {
      const invItem = this.getIngredientById(item.id);
      if (invItem && !invItem.inStock) {
        invItem.inStock = true;
        this.saveInventory();
        this.notify('stock_restocked', { item: invItem });
      }
    }

    this.notify('shopping_changed', { list: this.shoppingList });
  }

  markShoppingItemCompleted(id) {
    const item = this.shoppingList.find(i => i.id === id);
    if (item) {
      item.checked = true;
      this.saveShoppingList();
      this.notify('shopping_changed', { list: this.shoppingList });
    }
  }

  removeShoppingItem(id) {
    this.shoppingList = this.shoppingList.filter(i => i.id !== id);
    this.saveShoppingList();
    this.notify('shopping_changed', { list: this.shoppingList });
  }

  clearCheckedShoppingItems() {
    this.shoppingList = this.shoppingList.filter(i => !i.checked);
    this.saveShoppingList();
    this.notify('shopping_changed', { list: this.shoppingList });
  }

  // --- Favorites ---
  loadFavorites() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (data) {
        return new Set(JSON.parse(data));
      }
    } catch (e) {
      console.warn('Could not load favorites', e);
    }
    // Default favorites from database:
    const initialFavorites = MASTER_RECIPES.filter(r => r.isFavorite).map(r => r.id);
    return new Set(initialFavorites);
  }

  saveFavorites() {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(Array.from(this.favorites)));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }

  isFavorite(recipeId) {
    return this.favorites.has(recipeId);
  }

  toggleFavorite(recipeId) {
    if (this.favorites.has(recipeId)) {
      this.favorites.delete(recipeId);
    } else {
      this.favorites.add(recipeId);
    }
    this.saveFavorites();
    this.notify('favorites_changed', { favorites: this.favorites });
  }

  // --- Want to Try Bookmarking ---
  loadWantToTry() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WANT_TO_TRY);
      if (data) {
        return new Set(JSON.parse(data));
      }
    } catch (e) {
      console.warn('Could not load want-to-try list', e);
    }
    return new Set();
  }

  saveWantToTry() {
    try {
      localStorage.setItem(STORAGE_KEYS.WANT_TO_TRY, JSON.stringify(Array.from(this.wantToTry)));
    } catch (e) {
      console.error('Failed to save want-to-try list', e);
    }
  }

  isWantToTry(recipeId) {
    return this.wantToTry.has(recipeId);
  }

  toggleWantToTry(recipeId) {
    let newState = false;
    if (this.wantToTry.has(recipeId)) {
      this.wantToTry.delete(recipeId);
      newState = false;
    } else {
      this.wantToTry.add(recipeId);
      newState = true;
    }
    this.saveWantToTry();
    this.notify('want_to_try_changed', { wantToTry: this.wantToTry, recipeId, isWantToTry: newState });
    return newState;
  }

  getWantToTryIds() {
    return Array.from(this.wantToTry);
  }

  // --- Custom Recipes ---
  loadCustomRecipes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_RECIPES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Could not load custom recipes', e);
    }
    return [];
  }

  saveCustomRecipes() {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(this.customRecipes));
    } catch (e) {
      console.error('Failed to save custom recipes', e);
    }
  }

  addCustomRecipe(recipe) {
    if (!recipe.id) {
      recipe.id = 'custom-' + Date.now();
    }
    recipe.isCustom = true;
    recipe.createdAt = recipe.createdAt || new Date().toISOString();
    recipe.updatedAt = new Date().toISOString();
    this.customRecipes.push(recipe);
    this.saveCustomRecipes();
    this.notify('recipes_changed', { customRecipes: this.customRecipes });
    return recipe;
  }

  updateCustomRecipe(recipeId, updatedData) {
    const idx = this.customRecipes.findIndex(r => r.id === recipeId);
    if (idx !== -1) {
      this.customRecipes[idx] = {
        ...this.customRecipes[idx],
        ...updatedData,
        id: recipeId,
        isCustom: true,
        updatedAt: new Date().toISOString()
      };
      this.saveCustomRecipes();
      this.notify('recipes_changed', { customRecipes: this.customRecipes });
      return this.customRecipes[idx];
    }
    return null;
  }

  deleteCustomRecipe(recipeId) {
    const prevLen = this.customRecipes.length;
    this.customRecipes = this.customRecipes.filter(r => r.id !== recipeId);
    if (this.customRecipes.length !== prevLen) {
      this.saveCustomRecipes();
      if (this.favorites.has(recipeId)) {
        this.favorites.delete(recipeId);
        this.saveFavorites();
      }
      if (this.wantToTry.has(recipeId)) {
        this.wantToTry.delete(recipeId);
        this.saveWantToTry();
      }
      this.notify('recipes_changed', { customRecipes: this.customRecipes });
      return true;
    }
    return false;
  }

  getCustomRecipeById(recipeId) {
    return this.customRecipes.find(r => r.id === recipeId) || null;
  }

  // --- Recipe Overrides (for modifying built-in master recipes) ---
  loadRecipeOverrides() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECIPE_OVERRIDES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Could not load recipe overrides', e);
    }
    return {};
  }

  saveRecipeOverrides() {
    try {
      localStorage.setItem(STORAGE_KEYS.RECIPE_OVERRIDES, JSON.stringify(this.recipeOverrides));
    } catch (e) {
      console.error('Failed to save recipe overrides', e);
    }
  }

  saveRecipeOverride(recipeId, recipeData) {
    if (!this.recipeOverrides) this.recipeOverrides = this.loadRecipeOverrides();
    this.recipeOverrides[recipeId] = {
      ...recipeData,
      id: recipeId,
      isEdited: true,
      updatedAt: new Date().toISOString()
    };
    this.saveRecipeOverrides();
    this.notify('recipes_changed', { overrides: this.recipeOverrides });
    return this.recipeOverrides[recipeId];
  }

  revertRecipeOverride(recipeId) {
    if (!this.recipeOverrides) this.recipeOverrides = this.loadRecipeOverrides();
    if (this.recipeOverrides[recipeId]) {
      delete this.recipeOverrides[recipeId];
      this.saveRecipeOverrides();
      this.notify('recipes_changed', { overrides: this.recipeOverrides });
      return true;
    }
    return false;
  }

  isRecipeOverridden(recipeId) {
    if (!this.recipeOverrides) this.recipeOverrides = this.loadRecipeOverrides();
    return Boolean(this.recipeOverrides[recipeId]);
  }

  // --- Backup & Restore ---
  exportBackupJSON() {
    const backup = {
      version: 3,
      timestamp: new Date().toISOString(),
      inventory: this.inventory,
      shoppingList: this.shoppingList,
      favorites: Array.from(this.favorites),
      wantToTry: Array.from(this.wantToTry),
      customRecipes: this.customRecipes,
      recipeOverrides: this.recipeOverrides
    };
    return JSON.stringify(backup, null, 2);
  }

  importBackupJSON(jsonStr) {
    try {
      const backup = JSON.parse(jsonStr);
      if (backup.inventory) {
        this.inventory = backup.inventory;
        this.saveInventory();
      }
      if (backup.shoppingList) {
        this.shoppingList = backup.shoppingList;
        this.saveShoppingList();
      }
      if (backup.favorites) {
        this.favorites = new Set(backup.favorites);
        this.saveFavorites();
      }
      if (backup.wantToTry) {
        this.wantToTry = new Set(backup.wantToTry);
        this.saveWantToTry();
      }
      if (backup.customRecipes) {
        this.customRecipes = backup.customRecipes;
        this.saveCustomRecipes();
      }
      if (backup.recipeOverrides) {
        this.recipeOverrides = backup.recipeOverrides;
        this.saveRecipeOverrides();
      }
      this.notify('backup_restored', {});
      return true;
    } catch (e) {
      console.error('Failed to import backup', e);
      return false;
    }
  }

  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.SHOPPING_LIST);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_RECIPES);
    localStorage.removeItem(STORAGE_KEYS.RECIPE_OVERRIDES);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    localStorage.removeItem(STORAGE_KEYS.WANT_TO_TRY);
    this.inventory = JSON.parse(JSON.stringify(INITIAL_INVENTORY));
    this.shoppingList = [];
    this.customRecipes = [];
    this.recipeOverrides = {};
    this.favorites = new Set(MASTER_RECIPES.filter(r => r.isFavorite).map(r => r.id));
    this.wantToTry = new Set();
    this.saveInventory();
    this.saveFavorites();
    this.saveWantToTry();
    this.notify('data_reset', {});
  }
}

export const inventoryManager = new InventoryManager();

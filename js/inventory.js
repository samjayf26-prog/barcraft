// ============================================================================
// BarCraft Inventory & Storage Manager
// Handles In-Stock / Out-of-Stock loop, auto-shopping list sync, and persistence
// ============================================================================

import { INITIAL_INVENTORY, MASTER_RECIPES } from './db.js';

const STORAGE_KEYS = {
  INVENTORY: 'barcraft_inventory_v1',
  SHOPPING_LIST: 'barcraft_shopping_v1',
  CUSTOM_RECIPES: 'barcraft_custom_recipes_v1',
  FAVORITES: 'barcraft_favorites_v1',
  USER_SETTINGS: 'barcraft_settings_v1'
};

class InventoryManager {
  constructor() {
    this.inventory = this.loadInventory();
    this.shoppingList = this.loadShoppingList();
    this.customRecipes = this.loadCustomRecipes();
    this.favorites = this.loadFavorites();
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
        return JSON.parse(data);
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
      // Marked OUT of stock -> auto-add to shopping list if not present
      this.addToShoppingList(item.id, item.name, item.category, 'auto-out-of-stock');
      this.notify('stock_depleted', { item });
    } else {
      // Marked back in stock -> uncheck or remove from shopping list if desired
      this.markShoppingItemCompleted(item.id);
      this.notify('stock_restocked', { item });
    }

    this.notify('inventory_changed', { item });
    return item;
  }

  addCustomIngredient(name, category = 'Other', benchmark = '', inStock = true) {
    const cleanName = name.trim();
    if (!cleanName) return null;

    const id = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = this.getIngredientById(id);
    if (existing) {
      existing.inStock = inStock;
      if (benchmark) existing.benchmark = benchmark;
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
      isCustom: true
    };

    this.inventory.push(newItem);
    this.saveInventory();
    this.notify('inventory_changed', { item: newItem });
    return newItem;
  }

  // --- Shopping List ---
  loadShoppingList() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
      if (data) {
        return JSON.parse(data);
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

  addToShoppingList(id, name, category, source = 'manual') {
    const existing = this.shoppingList.find(item => item.id === id || item.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      existing.checked = false;
      this.saveShoppingList();
      this.notify('shopping_changed', { list: this.shoppingList });
      return existing;
    }

    const newItem = {
      id: id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      category: category || 'Pantry',
      checked: false,
      source,
      addedAt: Date.now()
    };

    this.shoppingList.unshift(newItem);
    this.saveShoppingList();
    this.notify('shopping_changed', { list: this.shoppingList });
    return newItem;
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
    recipe.id = 'custom-' + Date.now();
    recipe.isCustom = true;
    this.customRecipes.push(recipe);
    this.saveCustomRecipes();
    this.notify('recipes_changed', { customRecipes: this.customRecipes });
    return recipe;
  }

  // --- Backup & Restore ---
  exportBackupJSON() {
    const backup = {
      version: 1,
      timestamp: new Date().toISOString(),
      inventory: this.inventory,
      shoppingList: this.shoppingList,
      favorites: Array.from(this.favorites),
      customRecipes: this.customRecipes
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
      if (backup.customRecipes) {
        this.customRecipes = backup.customRecipes;
        this.saveCustomRecipes();
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
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    this.inventory = JSON.parse(JSON.stringify(INITIAL_INVENTORY));
    this.shoppingList = [];
    this.customRecipes = [];
    this.favorites = new Set(MASTER_RECIPES.filter(r => r.isFavorite).map(r => r.id));
    this.saveInventory();
    this.saveFavorites();
    this.notify('data_reset', {});
  }
}

export const inventoryManager = new InventoryManager();

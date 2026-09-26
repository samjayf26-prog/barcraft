// ============================================================================
// BarCraft Main Application Controller
// Tab routing, reactive rendering, modals, timers, and user interactions
// ============================================================================

import { BUDGETING_RULES, BOTTLE_PRICING_KNOWLEDGE_BASE, MECHANICAL_RULES } from './db.js';
import { inventoryManager } from './inventory.js';
import {
  analyzeRecipesAvailability,
  calculateUnlockRecommendations,
  getDailyDrinkRecommendation,
  getRandomInStockDrink,
  filterRecipes,
  getAllRecipes
} from './matching.js';
import { scaleIngredient, calculateBatchMetrics, formatFractionalOz, ozToMl } from './scaler.js';
import { soundEffects, wakeLockManager, CocktailTimer } from './timers.js';

// Application State
const state = {
  activeTab: 'recipes', // 'recipes' | 'inventory' | 'shopping' | 'unlock' | 'guide'
  activeUnit: localStorage.getItem('barcraft_unit') || 'oz', // 'oz' | 'ml'
  availabilityFilter: 'all', // 'all' | 'can-make' | 'missing-1' | 'favorites'
  categoryFilter: 'all',
  spiritFilter: 'all',
  searchQuery: '',
  activeModalRecipe: null,
  activeMultiplier: 1,
  activeTimer: null,
  activeTimerPhase: '',
  dailyOffset: 0,
  lastToastTimeout: null
};

// DOM Elements Cache
const elements = {};

function initDom() {
  elements.app = document.getElementById('app');
  elements.unitToggle = document.getElementById('unitToggle');
  elements.dailyCard = document.getElementById('dailyDrinkCard');
  elements.dailyShuffleBtn = document.getElementById('dailyShuffleBtn');
  elements.dailyMakeBtn = document.getElementById('dailyMakeBtn');
  elements.searchInput = document.getElementById('searchInput');
  elements.clearSearchBtn = document.getElementById('clearSearchBtn');
  elements.filterChips = document.querySelectorAll('.filter-chip');
  elements.categoryFilter = document.getElementById('categoryFilter');
  elements.spiritFilter = document.getElementById('spiritFilter');
  elements.recipeListContainer = document.getElementById('recipeListContainer');
  elements.inventoryContainer = document.getElementById('inventoryContainer');
  elements.shoppingContainer = document.getElementById('shoppingContainer');
  elements.unlockContainer = document.getElementById('unlockContainer');
  elements.guideContainer = document.getElementById('guideContainer');
  elements.bottomNav = document.getElementById('bottomNav');
  elements.modalOverlay = document.getElementById('modalOverlay');
  elements.modalSheet = document.getElementById('modalSheet');
  elements.modalCloseBtn = document.getElementById('modalCloseBtn');
  elements.toastContainer = document.getElementById('toastContainer');
  elements.shoppingBadge = document.getElementById('shoppingBadge');
  elements.addIngredientModal = document.getElementById('addIngredientModal');
  elements.backupModal = document.getElementById('backupModal');
}

// ============================================================================
// Notification Toasts
// ============================================================================
export function showToast(message, undoAction = null, duration = 4000) {
  if (!elements.toastContainer) return;

  elements.toastContainer.innerHTML = '';
  const toast = document.createElement('div');
  toast.className = 'toast';

  const textSpan = document.createElement('span');
  textSpan.textContent = message;
  toast.appendChild(textSpan);

  if (undoAction) {
    const undoBtn = document.createElement('button');
    undoBtn.className = 'toast-undo-btn';
    undoBtn.textContent = 'UNDO';
    undoBtn.onclick = () => {
      undoAction();
      toast.remove();
    };
    toast.appendChild(undoBtn);
  }

  elements.toastContainer.appendChild(toast);

  if (state.lastToastTimeout) clearTimeout(state.lastToastTimeout);
  state.lastToastTimeout = setTimeout(() => {
    toast.remove();
  }, duration);
}

// ============================================================================
// Render: Daily Drink Hero Card
// ============================================================================
function renderDailyDrink(forcedDrink = null) {
  const daily = forcedDrink || state.currentDailyDrink || getDailyDrinkRecommendation(state.dailyOffset);
  if (!daily || !elements.dailyCard) return;
  state.currentDailyDrink = daily;

  const { recipe, canMake, missingCount, missingIngredients } = daily;

  const tagLabel = elements.dailyCard.querySelector('.daily-tag');
  if (tagLabel) {
    tagLabel.textContent = forcedDrink ? '🎲 Surprise Pick' : '★ Daily Cocktail Pick';
  }

  document.getElementById('dailyDrinkTitle').textContent = recipe.name;
  
  let statusBadgeHtml = '';
  if (canMake) {
    statusBadgeHtml = `<span class="status-pill can-make">✓ Ready to Mix (100% in stock)</span>`;
  } else if (missingCount === 1) {
    statusBadgeHtml = `<span class="status-pill missing-one">Missing: ${missingIngredients[0].name}</span>`;
  } else {
    statusBadgeHtml = `<span class="status-pill missing-many">Missing ${missingCount} ingredients</span>`;
  }
  document.getElementById('dailyStatusBadge').innerHTML = statusBadgeHtml;

  // Primary ingredients summary
  const spiritAndModifier = recipe.ingredients
    .slice(0, 3)
    .map(i => i.name)
    .join(' • ');
  document.getElementById('dailyDrinkSummary').textContent = `${recipe.glass} Glass • ${spiritAndModifier}`;

  elements.dailyMakeBtn.onclick = () => {
    soundEffects.playClick();
    openRecipeModal(recipe);
  };
}

// ============================================================================
// Render: Recipes Tab
// ============================================================================
function renderRecipesTab() {
  const analyzed = analyzeRecipesAvailability();

  // Update counts on filter chips
  const canMakeCount = analyzed.filter(a => a.canMake).length;
  const missingOneCount = analyzed.filter(a => a.missingCount === 1).length;
  const favoritesCount = analyzed.filter(a => a.isFavorite).length;
  const wantToTryCount = analyzed.filter(a => a.isWantToTry).length;

  const countAllEl = document.getElementById('countAll');
  if (countAllEl) countAllEl.textContent = analyzed.length;
  const countCanMakeEl = document.getElementById('countCanMake');
  if (countCanMakeEl) countCanMakeEl.textContent = canMakeCount;
  const countMissing1El = document.getElementById('countMissing1');
  if (countMissing1El) countMissing1El.textContent = missingOneCount;
  const countFavEl = document.getElementById('countFavorites');
  if (countFavEl) countFavEl.textContent = favoritesCount;
  const countTryEl = document.getElementById('countWantToTry');
  if (countTryEl) countTryEl.textContent = wantToTryCount;

  // Filter list
  const filtered = filterRecipes(analyzed, {
    availabilityFilter: state.availabilityFilter,
    categoryFilter: state.categoryFilter,
    spiritFilter: state.spiritFilter,
    searchQuery: state.searchQuery
  });

  if (filtered.length === 0) {
    elements.recipeListContainer.innerHTML = `
      <div style="text-align: center; padding: 48px 16px; color: var(--text-secondary);">
        <div style="font-size: 36px; margin-bottom: 8px;">🍸</div>
        <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">No Cocktails Found</div>
        <div style="font-size: 13px;">Try adjusting your filters or search query.</div>
      </div>
    `;
    return;
  }

  const inStockIds = inventoryManager.getInStockIngredientIds();

  elements.recipeListContainer.innerHTML = filtered.map(item => {
    const { recipe, canMake, missingCount, missingIngredients, isFavorite, isWantToTry } = item;

    // Status Pill
    let badgeHtml = '';
    if (canMake) {
      badgeHtml = `<span class="status-pill can-make">✓ Can Make</span>`;
    } else if (missingCount === 1) {
      badgeHtml = `<span class="status-pill missing-one">Need ${missingIngredients[0].name}</span>`;
    } else {
      badgeHtml = `<span class="status-pill missing-many">${missingCount} missing</span>`;
    }

    // Ingredients preview tags
    const ingTagsHtml = recipe.ingredients.map(ing => {
      const isMissing = !inStockIds.has(ing.id);
      return `<span class="ing-tag ${isMissing ? 'missing' : ''}">${isMissing ? '✕ ' : ''}${ing.name}</span>`;
    }).join('');

    return `
      <div class="recipe-card" data-recipe-id="${recipe.id}">
        <div class="recipe-card-header">
          <div class="recipe-title-group">
            <div class="recipe-title">
              <span>${recipe.name}</span>
              <span class="favorite-star ${isFavorite ? 'active' : ''}" data-fav-id="${recipe.id}" title="Toggle Favorite">★</span>
              <span class="want-to-try-btn ${isWantToTry ? 'active' : ''}" data-try-id="${recipe.id}" title="Want to Try">🔖</span>
            </div>
            <div class="recipe-meta-row">
              <span>${recipe.category}</span>
              <span>•</span>
              <span>${recipe.glass}</span>
            </div>
          </div>
          <div>${badgeHtml}</div>
        </div>

        <div class="recipe-ingredients-preview">
          <div class="ing-tag-list">${ingTagsHtml}</div>
        </div>

        <div class="recipe-card-footer">
          <div class="recipe-footer-tags">
            ${(recipe.tags || []).slice(0, 3).map(t => `<span class="tag-label">${t}</span>`).join('')}
          </div>
          <span style="font-weight: 600; color: var(--accent-orange);">View Specs →</span>
        </div>
      </div>
    `;
  }).join('');

  // Attach card click handlers
  elements.recipeListContainer.querySelectorAll('.recipe-card').forEach(card => {
    const recipeId = card.getAttribute('data-recipe-id');
    const recipe = analyzed.find(a => a.recipe.id === recipeId)?.recipe;

    card.onclick = (e) => {
      // If clicked on favorite star, toggle favorite without opening modal
      if (e.target.classList.contains('favorite-star')) {
        e.stopPropagation();
        inventoryManager.toggleFavorite(recipeId);
        soundEffects.playClick();
        renderRecipesTab();
        return;
      }
      // If clicked on want to try bookmark, toggle want to try without opening modal
      if (e.target.classList.contains('want-to-try-btn')) {
        e.stopPropagation();
        const isNow = inventoryManager.toggleWantToTry(recipeId);
        soundEffects.playClick();
        showToast(isNow ? `Added "${recipe ? recipe.name : 'drink'}" to Want to Try` : `Removed "${recipe ? recipe.name : 'drink'}" from Want to Try`);
        renderRecipesTab();
        return;
      }
      soundEffects.playClick();
      if (recipe) openRecipeModal(recipe);
    };
  });
}

// ============================================================================
// Render: Inventory Tab
// ============================================================================
function renderInventoryTab() {
  const allIngredients = inventoryManager.getAllIngredients();
  const query = state.searchQuery.toLowerCase().trim();

  // Filter ingredients
  const filtered = allIngredients.filter(item => {
    if (!query) return true;
    return item.name.toLowerCase().includes(query) ||
           item.category.toLowerCase().includes(query) ||
           (item.benchmark && item.benchmark.toLowerCase().includes(query));
  });

  // Group by category
  const groups = {};
  filtered.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  const categories = Object.keys(groups);

  if (categories.length === 0) {
    elements.inventoryContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 16px; color: var(--text-secondary);">
        No ingredients found matching "${state.searchQuery}".
      </div>
    `;
    return;
  }

  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
      <span style="font-size: 13px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.8px;">
        Tap button to toggle stock status
      </span>
      <button id="addCustomIngBtn" class="unit-toggle-btn" style="background: var(--text-primary); color: #fff; border: none;">
        + Add Ingredient
      </button>
    </div>
  `;

  categories.forEach(cat => {
    const items = groups[cat];
    const inStockCount = items.filter(i => i.inStock).length;

    html += `
      <div class="inv-category-group">
        <div class="inv-category-header">
          <span>${cat}</span>
          <span style="font-size: 12px; font-weight: 600; color: var(--text-muted);">${inStockCount}/${items.length} In Stock</span>
        </div>
        ${items.map(item => `
          <div class="inv-item-row">
            <div class="inv-item-info">
              <div class="inv-item-name">${item.name}</div>
              ${item.benchmark ? `<div class="inv-item-benchmark">${item.benchmark}</div>` : ''}
            </div>
            <button class="inv-toggle-btn ${item.inStock ? 'in-stock' : 'out-stock'}" data-inv-id="${item.id}">
              ${item.inStock ? '✓ In Stock' : '✕ Out of Stock'}
            </button>
          </div>
        `).join('')}
      </div>
    `;
  });

  elements.inventoryContainer.innerHTML = html;

  // Bind toggle clicks
  elements.inventoryContainer.querySelectorAll('.inv-toggle-btn').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      const id = btn.getAttribute('data-inv-id');
      const item = inventoryManager.toggleStock(id);
      if (!item.inStock) {
        showToast(`Marked ${item.name} out of stock (added to Shopping List)`, () => {
          inventoryManager.toggleStock(item.id, true);
        });
      } else {
        showToast(`Restocked ${item.name} into bar inventory`);
      }
      renderAll();
    };
  });

  // Bind Add Custom Ingredient button
  const addBtn = document.getElementById('addCustomIngBtn');
  if (addBtn) {
    addBtn.onclick = () => openAddIngredientModal();
  }
}

// ============================================================================
// Render: Shopping List Tab
// ============================================================================
// ============================================================================
// Render: Shopping List Tab (Staples vs. Wishlist & Price Targets)
// ============================================================================
function renderShoppingTab() {
  const shoppingList = inventoryManager.getShoppingList();
  const unchecked = shoppingList.filter(i => !i.checked);

  // Update navbar shopping badge
  if (elements.shoppingBadge) {
    if (unchecked.length > 0) {
      elements.shoppingBadge.textContent = unchecked.length;
      elements.shoppingBadge.style.display = 'flex';
    } else {
      elements.shoppingBadge.style.display = 'none';
    }
  }

  if (shoppingList.length === 0) {
    elements.shoppingContainer.innerHTML = `
      <div class="shopping-card" style="text-align: center; padding: 48px 16px;">
        <div style="font-size: 36px; margin-bottom: 8px;">🛒</div>
        <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">Shopping List is Clear</div>
        <div style="font-size: 13px; color: var(--text-secondary); max-width: 320px; margin: 0 auto 16px auto;">
          Marking an ingredient out of stock automatically adds it here with suggested price guidelines!
        </div>
        <button id="shopAddManualBtn" class="unit-toggle-btn" style="background: var(--text-primary); color: #fff; border: none; padding: 8px 18px;">
          + Add Bottle / Ingredient
        </button>
      </div>
    `;
    const btn = document.getElementById('shopAddManualBtn');
    if (btn) btn.onclick = () => openAddIngredientModal(true);
    return;
  }

  const staples = shoppingList.filter(i => (i.listType || 'wishlist') === 'staples');
  const wishlist = shoppingList.filter(i => (i.listType || 'wishlist') === 'wishlist');

  function renderGroupHtml(title, icon, subtitle, items, currentType, otherType) {
    const uncheckedCount = items.filter(i => !i.checked).length;
    const bumpLabel = otherType === 'staples' ? '⇄ To Staples' : '⇄ To Wishlist';
    const bumpTooltip = otherType === 'staples' ? 'Move to Staples' : 'Move to Wishlist';

    let groupHtml = `
      <div class="shopping-group">
        <div class="shopping-group-header">
          <div class="shopping-group-title">
            <span>${icon} ${title}</span>
            <span class="shopping-group-count">${uncheckedCount} Needed</span>
          </div>
          <span style="font-size: 11px; font-weight: 700; color: var(--text-secondary);">
            ${items.length} Total
          </span>
        </div>
        <div class="shopping-group-subtext">${subtitle}</div>
    `;

    if (items.length === 0) {
      groupHtml += `
        <div style="font-size: 13px; color: var(--text-muted); padding: 16px 0; text-align: center; font-style: italic;">
          No items in ${title}.
        </div>
      `;
    } else {
      groupHtml += `<div class="shopping-group-items">`;
      items.forEach(item => {
        groupHtml += `
          <div class="shopping-item-row" data-shop-id="${item.id}">
            <div class="shopping-checkbox-wrapper" data-shop-check="${item.id}">
              <div class="custom-checkbox ${item.checked ? 'checked' : ''}">
                ${item.checked ? '✓' : ''}
              </div>
              <div class="shopping-item-details">
                <div class="shopping-item-text ${item.checked ? 'checked' : ''}">
                  <span>${item.name}</span>
                  ${item.suggestedPrice ? `<span class="shopping-price-tag" title="Optimal Price Target">🎯 Target: ${item.suggestedPrice}</span>` : ''}
                </div>
                <div class="shopping-item-sub">
                  <span>${item.category}</span>
                  ${item.benchmark ? ` • <em>${item.benchmark}</em>` : ''}
                </div>
                ${item.valueRationale ? `<div class="shopping-rationale">💡 ${item.valueRationale}</div>` : ''}
              </div>
            </div>
            <div class="shopping-actions">
              <button class="shopping-bump-btn" data-shop-bump="${item.id}" data-target-type="${otherType}" title="${bumpTooltip}">
                ${bumpLabel}
              </button>
              <button class="shopping-remove-btn" data-shop-remove="${item.id}" title="Remove">×</button>
            </div>
          </div>
        `;
      });
      groupHtml += `</div>`;
    }

    groupHtml += `</div>`;
    return groupHtml;
  }

  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <span style="font-size: 13px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">
        ${unchecked.length} Item${unchecked.length === 1 ? '' : 's'} Total Needed
      </span>
      <div style="display: flex; gap: 8px;">
        <button id="shopAddManualBtn" class="unit-toggle-btn" style="background: var(--surface-card);">+ Add Item</button>
        ${shoppingList.some(i => i.checked) ? `
          <button id="clearCompletedBtn" class="unit-toggle-btn" style="color: var(--status-red);">Clear Done</button>
        ` : ''}
      </div>
    </div>
  `;

  // Render Staples group first, then Wishlist group
  html += renderGroupHtml(
    'Staples',
    '🧺',
    'Core spirits, fresh citrus, basic syrups & essential mixers needed on hand',
    staples,
    'staples',
    'wishlist'
  );

  html += renderGroupHtml(
    'Wishlist',
    '✨',
    'Specialty liqueurs, rare amari, exotic modifiers & experimental bottles',
    wishlist,
    'wishlist',
    'staples'
  );

  elements.shoppingContainer.innerHTML = html;

  // Bind checkbox toggle (Mark bought -> Auto restocks!)
  elements.shoppingContainer.querySelectorAll('[data-shop-check]').forEach(el => {
    el.onclick = () => {
      soundEffects.playClick();
      const id = el.getAttribute('data-shop-check');
      inventoryManager.toggleShoppingItem(id);
      showToast(`Restocked item into bar inventory!`);
      renderAll();
    };
  });

  // Bind Bump Category Button (Staples <-> Wishlist)
  elements.shoppingContainer.querySelectorAll('[data-shop-bump]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      soundEffects.playClick();
      const id = btn.getAttribute('data-shop-bump');
      const targetType = btn.getAttribute('data-target-type');
      const item = inventoryManager.moveShoppingItemCategory(id, targetType);
      showToast(`Moved ${item ? item.name : 'item'} to ${targetType === 'staples' ? 'Staples' : 'Wishlist'}`);
      renderShoppingTab();
    };
  });

  // Bind remove button
  elements.shoppingContainer.querySelectorAll('[data-shop-remove]').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation();
      soundEffects.playClick();
      const id = el.getAttribute('data-shop-remove');
      inventoryManager.removeShoppingItem(id);
      renderShoppingTab();
    };
  });

  // Bind Clear Completed
  const clearBtn = document.getElementById('clearCompletedBtn');
  if (clearBtn) {
    clearBtn.onclick = () => {
      soundEffects.playClick();
      inventoryManager.clearCheckedShoppingItems();
      renderShoppingTab();
    };
  }

  // Bind Add Item
  const addBtn = document.getElementById('shopAddManualBtn');
  if (addBtn) {
    addBtn.onclick = () => openAddIngredientModal(true);
  }
}

// ============================================================================
// Render: Unlock More Drinks Tab (Next Bottle Recommender)
// ============================================================================
function renderUnlockTab() {
  const recommendations = calculateUnlockRecommendations();
  const shoppingListIds = new Set(inventoryManager.getShoppingList().map(s => s.id));

  let html = `
    <div class="unlock-hero">
      <div class="unlock-hero-title">Marginal Bottle Recommender</div>
      <div class="unlock-hero-subtitle">
        These missing ingredients will unlock the highest number of new cocktails in your bar with a single purchase.
      </div>
    </div>
  `;

  if (recommendations.length === 0) {
    html += `
      <div class="unlock-card" style="text-align: center; padding: 36px 16px;">
        <div style="font-size: 32px; margin-bottom: 6px;">🎉</div>
        <div style="font-weight: 700; font-size: 16px;">Fully Stocked Bar!</div>
        <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
          You currently have ingredients to make all cocktails in the master database.
        </div>
      </div>
    `;
    elements.unlockContainer.innerHTML = html;
    return;
  }

  recommendations.slice(0, 10).forEach(rec => {
    const isAlreadyOnList = shoppingListIds.has(rec.id);
    const unlockCocktailNames = rec.unlocksNow.map(r => r.name).join(', ');

    html += `
      <div class="unlock-card">
        <div class="unlock-card-top">
          <div>
            <div class="unlock-bottle-name">${rec.name}</div>
            <div style="font-size: 12px; color: var(--text-secondary);">${rec.category}</div>
          </div>
          <span class="unlock-pill">+${rec.unlocksNow.length} New Cocktails</span>
        </div>

        <div class="unlock-recipes-list">
          <strong>Directly unlocks:</strong> ${unlockCocktailNames}
        </div>

        ${rec.benchmark ? `<div style="font-size: 12px; color: var(--text-muted); margin-bottom: 10px;">Benchmark: ${rec.benchmark}</div>` : ''}

        <button class="add-unlock-btn" data-unlock-id="${rec.id}" data-unlock-name="${rec.name}" data-unlock-cat="${rec.category}">
          ${isAlreadyOnList ? '✓ Already on Shopping List' : '+ Add to Shopping List'}
        </button>
      </div>
    `;
  });

  elements.unlockContainer.innerHTML = html;

  elements.unlockContainer.querySelectorAll('.add-unlock-btn').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      const id = btn.getAttribute('data-unlock-id');
      const name = btn.getAttribute('data-unlock-name');
      const cat = btn.getAttribute('data-unlock-cat');
      inventoryManager.addToShoppingList(id, name, cat, 'unlock-recommender');
      btn.textContent = '✓ Added to Shopping List';
      btn.style.backgroundColor = 'var(--status-green-bg)';
      btn.style.color = 'var(--status-green)';
      showToast(`Added ${name} to Shopping List`);
      renderShoppingTab();
    };
  });
}

// ============================================================================
// Render: Technique Guide & Budgeting Architecture Tab
// ============================================================================
function renderGuideTab() {
  let html = `
    <!-- Budgeting Architecture -->
    <div class="inv-category-group" style="margin-bottom: 18px;">
      <div class="inv-category-header">
        <span>${BUDGETING_RULES.title}</span>
        <span style="color: var(--accent-orange);">Strategic Capital Allocation</span>
      </div>
      <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.45;">
        ${BOTTLE_PRICING_KNOWLEDGE_BASE.corePhilosophy}
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 8px;">
        ${BUDGETING_RULES.tiers.map(t => `
          <div style="padding: 12px; background: var(--bg-cream); border-radius: var(--radius-sm); border-left: 3px solid var(--accent-orange);">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; flex-wrap: wrap; gap: 4px;">
              <span style="font-weight: 800; font-size: 14px; color: var(--text-primary);">${t.tier}</span>
              <span style="font-size: 12px; font-weight: 700; color: var(--accent-orange);">${t.allocation}</span>
            </div>
            <div style="font-size: 13px; color: var(--text-primary); margin-bottom: 6px; line-height: 1.4;">${t.strategy}</div>
            <div style="font-size: 11px; color: var(--text-muted);">
              <strong>Benchmarks:</strong> ${t.benchmarks.join(' • ')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Spirit-by-Spirit Bottle Pricing Knowledge Base -->
    <div class="inv-category-group" style="margin-bottom: 18px;">
      <div class="inv-category-header">
        <span>🍾 Spirit-by-Spirit Spend Guide</span>
        <span style="color: var(--accent-orange);">Optimal Resource Usage</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 8px;">
        ${BOTTLE_PRICING_KNOWLEDGE_BASE.categories.map(cat => `
          <div style="padding: 14px; background: var(--bg-cream); border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
              <span style="font-weight: 800; font-size: 15px; color: var(--text-primary);">${cat.category}</span>
              <div style="display: flex; gap: 6px; align-items: center;">
                <span class="shopping-price-tag">${cat.recommendedRange}</span>
                <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${cat.spendTier.includes('HIGH') ? '#FFEBE6' : cat.spendTier.includes('LOW') ? '#E8F5E9' : '#FFF3E0'}; color: ${cat.spendTier.includes('HIGH') ? 'var(--status-red)' : cat.spendTier.includes('LOW') ? 'var(--status-green)' : 'var(--accent-orange)'};">
                  ${cat.spendTier}
                </span>
              </div>
            </div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 10px; line-height: 1.45;">
              <strong>Rule:</strong> ${cat.keyInsight}
            </div>
            <div style="font-size: 12px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">
              Proven Value Benchmarks:
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${cat.topValuePicks.map(p => `
                <div style="background: var(--surface-card); padding: 8px 10px; border-radius: 6px; font-size: 12px; border: 1px solid var(--border-light);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                    <span style="font-weight: 700; color: var(--text-primary);">${p.name}</span>
                    <span style="font-weight: 700; color: var(--accent-orange);">${p.price} (${p.proof}° proof)</span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-muted);">${p.role}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Mechanical Execution Rules -->
    <div class="inv-category-group" style="margin-bottom: 18px;">
      <div class="inv-category-header">
        <span>Mechanical Execution Rules</span>
        <span style="color: var(--text-secondary);">Physics & Technique</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
        ${MECHANICAL_RULES.map(r => `
          <div style="padding: 12px; background: var(--bg-cream); border-radius: var(--radius-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 14px; color: var(--text-primary);">${r.title}</span>
              <span class="status-pill missing-one" style="font-size: 10px;">${r.badge}</span>
            </div>
            <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.45;">${r.rule}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Data Backup & Reset -->
    <div class="inv-category-group">
      <div class="inv-category-header">
        <span>Data Backup & Sync</span>
      </div>
      <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
        Export your custom recipes, favorites, and inventory adjustments as a JSON file, or restore a backup.
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button id="exportBackupBtn" class="unit-toggle-btn" style="background: var(--text-primary); color: #fff; border: none;">
          Export Backup JSON
        </button>
        <button id="importBackupBtn" class="unit-toggle-btn">
          Import Backup
        </button>
        <button id="resetDefaultsBtn" class="unit-toggle-btn" style="color: var(--status-red); border-color: rgba(211,47,47,0.3);">
          Reset to Factory Defaults
        </button>
      </div>
    </div>
  `;

  elements.guideContainer.innerHTML = html;

  document.getElementById('exportBackupBtn').onclick = () => {
    soundEffects.playClick();
    const json = inventoryManager.exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcraft_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Backup JSON downloaded successfully');
  };

  document.getElementById('importBackupBtn').onclick = () => {
    soundEffects.playClick();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const success = inventoryManager.importBackupJSON(evt.target.result);
        if (success) {
          showToast('Backup restored successfully!');
          renderAll();
        } else {
          alert('Failed to parse backup JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  document.getElementById('resetDefaultsBtn').onclick = () => {
    if (confirm('Are you sure you want to reset inventory and custom recipes to original defaults?')) {
      inventoryManager.resetAllData();
      showToast('Reset all data to defaults.');
      renderAll();
    }
  };
}

// ============================================================================
// Recipe Modal & Bartender Mode Controller
// ============================================================================
function openRecipeModal(recipe) {
  state.activeModalRecipe = recipe;
  state.activeMultiplier = 1;
  renderModalContent();

  elements.modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeRecipeModal() {
  if (state.activeTimer) {
    state.activeTimer.stop();
    state.activeTimer = null;
  }
  wakeLockManager.releaseWakeLock();
  elements.modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  state.activeModalRecipe = null;
}

function renderModalContent() {
  const recipe = state.activeModalRecipe;
  if (!recipe) return;

  const inStockIds = inventoryManager.getInStockIngredientIds();
  const isFav = inventoryManager.isFavorite(recipe.id);
  const isWantToTry = inventoryManager.isWantToTry(recipe.id);

  // Scaled Ingredients
  const scaledIngredients = recipe.ingredients.map(ing => {
    return scaleIngredient(ing, state.activeMultiplier, state.activeUnit);
  });

  // Batching Dilution calculation if multiplier >= 4
  let batchMetricsHtml = '';
  if (state.activeMultiplier >= 4) {
    const batch = calculateBatchMetrics(recipe, state.activeMultiplier);
    batchMetricsHtml = `
      <div class="batch-dilution-box">
        <div class="batch-dilution-title">❄️ Pitcher & Freezer Dilution Guide</div>
        <div class="batch-metric-row">
          <span>Dilution Water to Add:</span>
          <span><strong>${state.activeUnit === 'ml' ? `${batch.waterToAddMl} ml` : `${batch.waterToAddOz} oz`}</strong> (filtered cold water)</span>
        </div>
        <div class="batch-metric-row">
          <span>Total Batch Yield:</span>
          <span>${state.activeUnit === 'ml' ? `${batch.totalBatchVolMl} ml` : `${batch.totalBatchVolOz} oz`}</span>
        </div>
        <div class="batch-metric-row">
          <span>Estimated Batch ABV:</span>
          <span>${batch.calculatedAbv}% ABV</span>
        </div>
        <div style="font-size: 11px; margin-top: 6px; color: ${batch.freezerSafe ? '#2E7D32' : '#D32F2F'}; font-weight: 600;">
          ${batch.freezerSafe ? '✓ Freezer Safe: Cocktail will chill without freezing solid.' : '⚠️ Low ABV (<22%): Store chilled in fridge, or add water only when serving.'}
        </div>
      </div>
    `;
  }

  // Timer Section HTML
  let timerSectionHtml = '';
  if (recipe.timer) {
    timerSectionHtml = `
      <div class="timer-section" id="modalTimerBox">
        <div class="timer-title">⏱️ ${recipe.timer.label || 'Mixing Timer'}</div>
        <div class="timer-display" id="modalTimerDisplay">${recipe.timer.seconds || recipe.timer.drySeconds}s</div>
        <div class="timer-controls">
          <button class="timer-action-btn" id="modalTimerStartBtn">Start Timer</button>
          <button class="timer-reset-btn" id="modalTimerResetBtn">Reset</button>
        </div>
      </div>
    `;
  }

  elements.modalSheet.innerHTML = `
    <div class="sheet-handle"></div>
    <div class="modal-header-row">
      <div>
        <div class="modal-title">
          ${recipe.name}
          <span class="favorite-star ${isFav ? 'active' : ''}" id="modalFavStar" style="cursor: pointer; font-size: 20px;" title="Toggle Favorite">★</span>
          <span class="want-to-try-btn ${isWantToTry ? 'active' : ''}" id="modalWantToTryBtn" style="cursor: pointer; font-size: 19px; margin-left: 6px;" title="Toggle Want to Try">🔖</span>
        </div>
        <div class="recipe-meta-row" style="margin-top: 4px;">
          <span>${recipe.category}</span>
          <span>•</span>
          <span>${recipe.glass} Glass</span>
          <span>•</span>
          <span>${recipe.ice}</span>
        </div>
      </div>
      <button class="modal-close-btn" id="modalCloseInnerBtn">✕</button>
    </div>

    <!-- Scaler Controls -->
    <div class="serving-scaler-box">
      <span class="scaler-label">Servings:</span>
      <div class="scaler-buttons">
        <button class="scaler-btn ${state.activeMultiplier === 1 ? 'active' : ''}" data-scale="1">1x</button>
        <button class="scaler-btn ${state.activeMultiplier === 2 ? 'active' : ''}" data-scale="2">2x</button>
        <button class="scaler-btn ${state.activeMultiplier === 4 ? 'active' : ''}" data-scale="4">4x</button>
        <button class="scaler-btn ${state.activeMultiplier === 8 ? 'active' : ''}" data-scale="8">8x Pitcher</button>
      </div>
    </div>

    ${batchMetricsHtml}

    <!-- Ingredients Table -->
    <div class="spec-table">
      ${scaledIngredients.map(ing => {
        const inStock = inStockIds.has(ing.id);
        return `
          <div class="spec-row">
            <div class="spec-name-group">
              <span class="spec-amount">${ing.displayText}</span>
              <span class="spec-name">${ing.name}</span>
            </div>
            <button class="spec-status-btn ${inStock ? 'in-stock' : 'out-stock'}" data-stock-toggle="${ing.id}">
              ${inStock ? '✓ In Stock' : '✕ Out (Add to List)'}
            </button>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Mechanical Technique Box -->
    ${recipe.techniqueRule ? `
      <div class="technique-box">
        <div class="technique-title">Execution Rule & Science</div>
        <div class="technique-desc">${recipe.techniqueRule}</div>
      </div>
    ` : ''}

    ${timerSectionHtml}

    <!-- Instructions Steps -->
    <div style="margin-bottom: 24px;">
      <div style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; color: var(--text-secondary);">
        Preparation Method
      </div>
      <ol style="padding-left: 20px; font-size: 14px; line-height: 1.6; color: var(--text-primary);">
        ${recipe.instructions.map(step => `<li style="margin-bottom: 6px;">${step}</li>`).join('')}
      </ol>
    </div>
  `;

  // Bind close buttons
  document.getElementById('modalCloseInnerBtn').onclick = closeRecipeModal;

  // Bind favorite star
  document.getElementById('modalFavStar').onclick = () => {
    soundEffects.playClick();
    inventoryManager.toggleFavorite(recipe.id);
    renderModalContent();
    renderRecipesTab();
  };

  // Bind want to try button
  const wantBtn = document.getElementById('modalWantToTryBtn');
  if (wantBtn) {
    wantBtn.onclick = () => {
      soundEffects.playClick();
      const isNow = inventoryManager.toggleWantToTry(recipe.id);
      showToast(isNow ? `Added "${recipe.name}" to Want to Try` : `Removed "${recipe.name}" from Want to Try`);
      renderModalContent();
      renderRecipesTab();
    };
  }

  // Bind scaler buttons
  elements.modalSheet.querySelectorAll('.scaler-btn').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      state.activeMultiplier = parseInt(btn.getAttribute('data-scale'), 10);
      renderModalContent();
    };
  });

  // Bind ingredient stock toggle buttons
  elements.modalSheet.querySelectorAll('[data-stock-toggle]').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      const ingId = btn.getAttribute('data-stock-toggle');
      const item = inventoryManager.toggleStock(ingId);
      if (!item.inStock) {
        showToast(`Marked ${item.name} out of stock & added to Shopping List`, () => {
          inventoryManager.toggleStock(item.id, true);
        });
      } else {
        showToast(`Restocked ${item.name}`);
      }
      renderModalContent();
      renderAll();
    };
  });

  // Bind Timer if present
  setupModalTimer(recipe);
}

function setupModalTimer(recipe) {
  if (!recipe.timer) return;

  const displayEl = document.getElementById('modalTimerDisplay');
  const startBtn = document.getElementById('modalTimerStartBtn');
  const resetBtn = document.getElementById('modalTimerResetBtn');
  if (!displayEl || !startBtn) return;

  let timerConfig = recipe.timer;
  let totalSec = timerConfig.seconds || timerConfig.drySeconds;

  const timer = new CocktailTimer({
    totalSeconds: totalSec,
    phaseName: timerConfig.drySeconds ? 'Dry Shake' : 'Mixing',
    onTick: (remaining, total, phase) => {
      displayEl.textContent = `${remaining}s`;
      displayEl.style.color = 'var(--accent-orange)';
    },
    onComplete: (phase) => {
      if (timerConfig.wetSeconds && phase === 'Dry Shake') {
        // Multi-phase: prompt for wet shake!
        displayEl.textContent = 'Add Ice!';
        startBtn.textContent = 'Start Wet Shake (12s)';
        startBtn.onclick = () => {
          soundEffects.playClick();
          const wetTimer = new CocktailTimer({
            totalSeconds: timerConfig.wetSeconds,
            phaseName: 'Wet Shake',
            onTick: (rem) => { displayEl.textContent = `${rem}s`; },
            onComplete: () => {
              displayEl.textContent = 'Complete! Strain Drink.';
              startBtn.textContent = 'Done';
            }
          });
          state.activeTimer = wetTimer;
          wetTimer.start();
        };
      } else {
        displayEl.textContent = 'Done! Strain Drink.';
        startBtn.textContent = 'Restart';
        startBtn.onclick = () => {
          setupModalTimer(recipe);
        };
      }
    }
  });

  state.activeTimer = timer;

  startBtn.onclick = () => {
    soundEffects.playClick();
    if (!timer.isRunning) {
      timer.start();
      startBtn.textContent = 'Pause';
    } else {
      timer.pause();
      startBtn.textContent = 'Resume';
    }
  };

  resetBtn.onclick = () => {
    soundEffects.playClick();
    timer.reset();
    displayEl.textContent = `${totalSec}s`;
    startBtn.textContent = 'Start Timer';
  };
}

// ============================================================================
// Modals: Add Custom Ingredient
// ============================================================================
function openAddIngredientModal(autoAddToShopping = false) {
  const name = prompt("Enter ingredient name (e.g. 'Green Chartreuse' or 'Passionfruit Syrup'):");
  if (!name || !name.trim()) return;

  const category = prompt("Category (Base Spirits / Modifiers & Liqueurs / Pantry & Juices / Syrups / Bitters / Produce):", "Modifiers & Liqueurs");
  const benchmark = prompt("Benchmark bottle/brand (optional):", "");

  const item = inventoryManager.addCustomIngredient(name, category, benchmark, !autoAddToShopping);
  if (autoAddToShopping) {
    inventoryManager.addToShoppingList(item.id, item.name, item.category, 'manual');
    showToast(`Added ${item.name} to Shopping List`);
  } else {
    showToast(`Added ${item.name} to Bar Inventory`);
  }
  renderAll();
}

// ============================================================================
// Master Render Coordinator
// ============================================================================
function renderAll() {
  renderDailyDrink();
  renderRecipesTab();
  renderInventoryTab();
  renderShoppingTab();
  renderUnlockTab();
  renderGuideTab();
}

// ============================================================================
// Event Listeners & Tab Navigation
// ============================================================================
function setupEventListeners() {
  // Navigation tabs
  elements.bottomNav.querySelectorAll('.nav-item').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      const tab = btn.getAttribute('data-tab');
      switchTab(tab);
    };
  });

  // Unit toggle button (oz <-> ml)
  elements.unitToggle.onclick = () => {
    soundEffects.playClick();
    state.activeUnit = state.activeUnit === 'oz' ? 'ml' : 'oz';
    elements.unitToggle.textContent = state.activeUnit === 'oz' ? 'oz' : 'ml';
    localStorage.setItem('barcraft_unit', state.activeUnit);
    showToast(`Switched units to ${state.activeUnit}`);
    if (state.activeModalRecipe) renderModalContent();
    renderRecipesTab();
  };
  elements.unitToggle.textContent = state.activeUnit;

  // Daily drink shuffle button ("Surprise Me") - draws from ALL in-stock drinks!
  elements.dailyShuffleBtn.onclick = () => {
    soundEffects.playClick();
    const surprise = getRandomInStockDrink();
    if (surprise) {
      renderDailyDrink(surprise);
      showToast(`Surprise: ${surprise.recipe.name}!`);
    } else {
      showToast('No drinks currently in stock.');
    }
  };

  // Search input & clear
  elements.searchInput.oninput = (e) => {
    state.searchQuery = e.target.value;
    elements.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    renderRecipesTab();
    renderInventoryTab();
  };

  elements.clearSearchBtn.onclick = () => {
    soundEffects.playClick();
    state.searchQuery = '';
    elements.searchInput.value = '';
    elements.clearSearchBtn.style.display = 'none';
    renderRecipesTab();
    renderInventoryTab();
  };

  // Availability filter chips
  elements.filterChips.forEach(chip => {
    chip.onclick = () => {
      soundEffects.playClick();
      elements.filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.availabilityFilter = chip.getAttribute('data-filter');
      renderRecipesTab();
    };
  });

  // Secondary dropdown filters
  elements.categoryFilter.onchange = (e) => {
    state.categoryFilter = e.target.value;
    renderRecipesTab();
  };

  elements.spiritFilter.onchange = (e) => {
    state.spiritFilter = e.target.value;
    renderRecipesTab();
  };

  // Modal overlay click outside to close
  elements.modalOverlay.onclick = (e) => {
    if (e.target === elements.modalOverlay) {
      closeRecipeModal();
    }
  };

  // Subscribe to inventory changes for reactive auto-update
  inventoryManager.subscribe((event, payload) => {
    renderAll();
  });
}

function switchTab(tabName) {
  state.activeTab = tabName;

  // Update navbar styling
  elements.bottomNav.querySelectorAll('.nav-item').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Show/hide screen containers
  const screens = {
    recipes: document.getElementById('recipesScreen'),
    inventory: document.getElementById('inventoryScreen'),
    shopping: document.getElementById('shoppingScreen'),
    unlock: document.getElementById('unlockScreen'),
    guide: document.getElementById('guideScreen')
  };

  Object.keys(screens).forEach(key => {
    if (screens[key]) {
      screens[key].style.display = key === tabName ? 'block' : 'none';
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// Service Worker Registration for Offline PWA
// ============================================================================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Service Worker registered successfully:', reg.scope))
        .catch(err => console.warn('Service Worker registration failed:', err));
    });
  }
}

// Initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initDom();
  setupEventListeners();
  renderAll();
  registerServiceWorker();
});

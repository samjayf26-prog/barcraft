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
  getAllRecipes,
  getSubstitutionsForRecipe
} from './matching.js';
import { scaleIngredient, calculateBatchMetrics, formatFractionalOz, ozToMl } from './scaler.js';
import { soundEffects, wakeLockManager, CocktailTimer } from './timers.js';
import { quizEngine } from './quiz.js';

// Application State
const state = {
  activeTab: 'recipes', // 'recipes' | 'inventory' | 'shopping' | 'unlock' | 'guide' | 'quiz'
  activeUnit: localStorage.getItem('barcraft_unit') || 'oz', // 'oz' | 'ml'
  availabilityFilter: 'all', // 'all' | 'can-make' | 'substitutes' | 'missing-1' | 'favorites' | 'want-to-try'
  categoryFilter: 'all',
  spiritFilter: 'all',
  searchQuery: '',
  activeModalRecipe: null,
  activeSubstitutions: {}, // recipeId -> { [subId]: boolean }
  activeMultiplier: 1,
  activeTimer: null,
  activeTimerPhase: '',
  dailyOffset: 0,
  lastToastTimeout: null,
  quizAutoAdvanceInterval: null
};

function clearQuizAutoAdvance() {
  if (state.quizAutoAdvanceInterval) {
    clearInterval(state.quizAutoAdvanceInterval);
    state.quizAutoAdvanceInterval = null;
  }
}

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
  elements.toggleFilterSheetBtn = document.getElementById('toggleFilterSheetBtn');
  elements.secondaryFilters = document.getElementById('secondaryFilters');
  elements.filterChips = document.querySelectorAll('.filter-chip');
  elements.categoryFilter = document.getElementById('categoryFilter');
  elements.spiritFilter = document.getElementById('spiritFilter');
  elements.recipeListContainer = document.getElementById('recipeListContainer');
  elements.inventoryContainer = document.getElementById('inventoryContainer');
  elements.shoppingContainer = document.getElementById('shoppingContainer');
  elements.unlockContainer = document.getElementById('unlockContainer');
  elements.guideContainer = document.getElementById('guideContainer');
  elements.quizContainer = document.getElementById('quizContainer');
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
  const canMakeSubCount = analyzed.filter(a => a.canMakeWithSub).length;
  const missingOneCount = analyzed.filter(a => a.missingCount === 1).length;
  const favoritesCount = analyzed.filter(a => a.isFavorite).length;
  const wantToTryCount = analyzed.filter(a => a.isWantToTry).length;

  const countAllEl = document.getElementById('countAll');
  if (countAllEl) countAllEl.textContent = analyzed.length;
  const countCanMakeEl = document.getElementById('countCanMake');
  if (countCanMakeEl) countCanMakeEl.textContent = canMakeCount;
  const countSubstitutesEl = document.getElementById('countSubstitutes');
  if (countSubstitutesEl) countSubstitutesEl.textContent = canMakeSubCount > 0 ? `+${canMakeSubCount}` : 0;
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
    const { recipe, canMake, canMakeWithSub, missingCount, missingIngredients, isFavorite, isWantToTry } = item;

    // Minimal Status Indicator
    let statusBadgeHtml = '';
    if (canMake) {
      statusBadgeHtml = `<span class="minimal-status ready" title="Ready to Mix">● Ready</span>`;
    } else if (canMakeWithSub) {
      statusBadgeHtml = `<span class="minimal-status sub" title="Can Make with In-Stock Substitute">● Sub</span>`;
    } else if (missingCount === 1) {
      statusBadgeHtml = `<span class="minimal-status need1" title="Missing: ${missingIngredients[0].name}">Need 1</span>`;
    } else {
      statusBadgeHtml = `<span class="minimal-status missing">${missingCount} miss</span>`;
    }

    // Clean typographical ingredient list (calm, elegant, no chunky pills)
    const ingredientText = recipe.ingredients.map(ing => {
      const isMissing = !inStockIds.has(ing.id);
      if (isMissing) {
        const hasSub = item.substitutionsAvailable && item.substitutionsAvailable.some(s => s.originalIngredientId === ing.id);
        if (hasSub) {
          return `<span class="ing-phrase sub" title="In-stock substitute available">🔄 ${ing.name}</span>`;
        }
        return `<span class="ing-phrase missing" title="Missing ingredient">${ing.name}</span>`;
      }
      return `<span class="ing-phrase">${ing.name}</span>`;
    }).join('<span class="ing-bullet">•</span>');

    const subHintLine = (canMakeWithSub && item.primarySubSummary)
      ? `<div class="minimal-subnote"><span>🔄</span> Sub: ${item.primarySubSummary}</div>`
      : '';

    return `
      <div class="recipe-card minimal-card" data-recipe-id="${recipe.id}">
        <div class="minimal-card-top">
          <div class="minimal-card-title">${recipe.name}</div>
          <div class="minimal-card-actions">
            ${statusBadgeHtml}
            <span class="favorite-star ${isFavorite ? 'active' : ''}" data-fav-id="${recipe.id}" title="Toggle Favorite">★</span>
            <span class="want-to-try-btn ${isWantToTry ? 'active' : ''}" data-try-id="${recipe.id}" title="Want to Try">🔖</span>
          </div>
        </div>

        <div class="minimal-card-ingredients">
          ${ingredientText}
        </div>

        ${subHintLine}

        <div class="minimal-card-footer">
          <span>${recipe.category}</span>
          <span>•</span>
          <span>${recipe.glass}</span>
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
              ${(item.suggestedPrice || item.benchmark) ? `
                <div class="inv-item-meta-line">
                  ${item.suggestedPrice ? `<span class="inv-price-tag">${item.suggestedPrice}</span>` : ''}
                  ${item.benchmark ? `<span class="inv-benchmark-text">${item.benchmark}</span>` : ''}
                </div>
              ` : ''}
              ${item.valueRationale ? `
                <details class="inv-guide-details">
                  <summary class="inv-guide-summary">Buying Guide ▾</summary>
                  <div class="inv-guide-text">${item.valueRationale}</div>
                </details>
              ` : ''}
            </div>
            <button class="inv-toggle-btn ${item.inStock ? 'in-stock' : 'out-stock'}" data-inv-id="${item.id}">
              ${item.inStock ? '✓ Stocked' : '✕ Out'}
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
                  ${item.suggestedPrice ? `<span class="shopping-price-tag">${item.suggestedPrice}</span>` : ''}
                </div>
                <div class="shopping-item-sub">
                  <span>${item.category}</span>
                  ${item.benchmark ? ` • <em>${item.benchmark}</em>` : ''}
                </div>
                ${item.valueRationale ? `
                  <details class="inv-guide-details" style="margin-top: 4px;">
                    <summary class="inv-guide-summary">Pricing Rationale ▾</summary>
                    <div class="inv-guide-text">${item.valueRationale}</div>
                  </details>
                ` : ''}
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
// Render: Quiz / Mixology Academy Screen
// Zero-typing interactive formats, scorecard, rank progression & celebrations
// ============================================================================
function renderQuizTab() {
  if (!elements.quizContainer) return;
  if (!quizEngine.isAnswered) {
    clearQuizAutoAdvance();
  }

  const currentRank = quizEngine.getCurrentRank();
  const nextRank = quizEngine.getNextRank();
  const progressPct = quizEngine.getRankProgressPercent();
  const progress = quizEngine.progress;

  if (quizEngine.state === 'hub') {
    // Render Academy Hub View
    const totalAns = progress.totalAnswered || 0;
    const totalCorr = progress.totalCorrect || 0;
    const accuracy = totalAns > 0 ? Math.round((totalCorr / totalAns) * 100) : 0;

    let html = `
      <div class="quiz-container">
        <!-- Hub Header -->
        <div class="quiz-header">
          <div class="quiz-header-badge">🎓 BarCraft Mixology Academy</div>
          <h2 class="quiz-header-title">Test Your Bar Knowledge</h2>
          <p class="quiz-header-sub">Sharpen your palate, spot rogue ingredients, craft recipes, and master bar economics with 100% touch drills.</p>
        </div>

        <!-- Bartender Rank Hero Card -->
        <div class="quiz-rank-card">
          <div class="quiz-rank-top">
            <div class="quiz-rank-icon">${currentRank.icon}</div>
            <div class="quiz-rank-info">
              <div class="quiz-rank-badge">Rank ${currentRank.level} • Bartender Certification</div>
              <div class="quiz-rank-title">${currentRank.title}</div>
            </div>
          </div>
          <div class="quiz-xp-track">
            <div class="quiz-xp-fill" style="width: ${progressPct}%;"></div>
          </div>
          <div class="quiz-xp-labels">
            <span>${progress.xp} XP</span>
            <span>${nextRank ? `Next Rank: ${nextRank.title} (${nextRank.minXp} XP)` : 'Max Rank Reached! 👑'}</span>
          </div>
        </div>

        <!-- Mini Stats Grid -->
        <div class="quiz-stats-row">
          <div class="quiz-stat-pill">
            <div class="quiz-stat-val">⭐ ${progress.xp}</div>
            <div class="quiz-stat-label">Total XP</div>
          </div>
          <div class="quiz-stat-pill">
            <div class="quiz-stat-val">🎯 ${accuracy}%</div>
            <div class="quiz-stat-label">Accuracy</div>
          </div>
          <div class="quiz-stat-pill">
            <div class="quiz-stat-val">🔥 ${progress.bestStreak}</div>
            <div class="quiz-stat-label">Best Streak</div>
          </div>
        </div>

        <!-- Quiz Workout Modes -->
        <div class="inv-category-header" style="margin-top: 6px;">
          <span>Choose Your Challenge</span>
          <span style="color: var(--accent-orange);">100% Tap & Shake</span>
        </div>

        <div class="quiz-modes-list">
          <button class="quiz-mode-btn featured" id="startDailyWorkoutBtn">
            <div class="quiz-mode-icon">⚡</div>
            <div class="quiz-mode-text">
              <div class="quiz-mode-header">
                <span class="quiz-mode-title">Daily Mixology Workout</span>
                <span class="quiz-mode-tag">5 Quick Questions</span>
              </div>
              <div class="quiz-mode-desc">A rapid blend of What's Missing, Spot the Imposter, and Technique drills.</div>
            </div>
            <div class="quiz-mode-arrow">➔</div>
          </button>

          <button class="quiz-mode-btn" id="startCertificationBtn">
            <div class="quiz-mode-icon">🎓</div>
            <div class="quiz-mode-text">
              <div class="quiz-mode-header">
                <span class="quiz-mode-title">Academy Certification Exam</span>
                <span class="quiz-mode-tag">10 Questions • +150 XP</span>
              </div>
              <div class="quiz-mode-desc">Comprehensive test spanning bottle budgeting, shaker ratios, and classic specs.</div>
            </div>
            <div class="quiz-mode-arrow">➔</div>
          </button>

          <button class="quiz-mode-btn" id="startShakerDrillBtn">
            <div class="quiz-mode-icon">🍸</div>
            <div class="quiz-mode-text">
              <div class="quiz-mode-header">
                <span class="quiz-mode-title">Shaker Masterclass</span>
                <span class="quiz-mode-tag">5 Build Challenges</span>
              </div>
              <div class="quiz-mode-desc">Select correct spirits, modifiers, and citrus from the shelf to build real cocktails.</div>
            </div>
            <div class="quiz-mode-arrow">➔</div>
          </button>
        </div>

        <!-- Pro Bartender Wisdom Box -->
        <div class="quiz-tip-box">
          <div class="quiz-tip-icon">💡</div>
          <div>
            <strong>Bar Rule of Thumb:</strong> When shaking citrus drinks, always build from cheapest to most expensive ingredient (citrus & syrup first, expensive spirit last) so a spill costs pennies, not dollars!
          </div>
        </div>
      </div>
    `;

    elements.quizContainer.innerHTML = html;

    // Mode listeners
    document.getElementById('startDailyWorkoutBtn').onclick = () => {
      soundEffects.playClick();
      quizEngine.startNewRound(5);
      renderQuizTab();
    };

    document.getElementById('startCertificationBtn').onclick = () => {
      soundEffects.playClick();
      quizEngine.startNewRound(10);
      renderQuizTab();
    };

    document.getElementById('startShakerDrillBtn').onclick = () => {
      soundEffects.playClick();
      quizEngine.startNewRound(5);
      for (let i = 0; i < 3; i++) {
        quizEngine.currentRound[i] = quizEngine.generateBuildCocktailQuestion();
      }
      quizEngine.activeQuestion = quizEngine.currentRound[0];
      renderQuizTab();
    };

    return;
  }

  if (quizEngine.state === 'question' || quizEngine.state === 'feedback') {
    // Render Active Question
    const q = quizEngine.activeQuestion;
    const qIdx = quizEngine.currentQuestionIndex + 1;
    const totalQ = quizEngine.currentRound.length;
    const progressPct = Math.round((qIdx / totalQ) * 100);
    const streak = quizEngine.roundStreak;
    const comboMult = streak >= 5 ? 2.0 : streak >= 3 ? 1.5 : 1.0;

    let questionContentHtml = '';

    if (q.type === 'WHATS_MISSING') {
      // Recipe Card with a blank mystery slot
      const targetId = q.targetIng?.id || q.targetIngredient?.id;
      questionContentHtml = `
        <div class="quiz-recipe-spec-box">
          <div class="quiz-spec-drink">🍸 ${q.cocktailName} Spec</div>
          <div class="quiz-spec-list">
            ${q.recipe.ingredients.map(ing => {
              if (ing.id === targetId) {
                return `
                  <div class="quiz-spec-item blank-target">
                    <span>❓ ??? (${ing.amount || 'standard'}${ing.unit ? ` ${ing.unit}` : ''})</span>
                    <span style="font-size: 11px; text-transform: uppercase;">[ MISSING ]</span>
                  </div>
                `;
              } else {
                return `
                  <div class="quiz-spec-item">
                    <span>${ing.name}</span>
                    <span style="color: var(--text-muted); font-size: 12px;">${ing.amount || ''}${ing.unit ? ` ${ing.unit}` : ''}</span>
                  </div>
                `;
              }
            }).join('')}
          </div>
        </div>

        <div class="quiz-options-list" style="margin-top: 14px;">
          ${q.options.map((opt, i) => {
            let stateClass = '';
            if (quizEngine.isAnswered) {
              if (opt.isCorrect) stateClass = 'correct';
              else if (quizEngine.selectedAnswer === opt) stateClass = 'incorrect';
            }
            return `
              <button class="quiz-option-btn ${stateClass}" data-opt-idx="${i}" ${quizEngine.isAnswered ? 'disabled' : ''}>
                <span>${opt.text || opt.name || 'Option'}</span>
                <span class="quiz-opt-icon">${quizEngine.isAnswered ? (opt.isCorrect ? '✅' : quizEngine.selectedAnswer === opt ? '❌' : '') : '👉'}</span>
              </button>
            `;
          }).join('')}
        </div>
      `;
    } else if (q.type === 'WHATS_EXTRA') {
      // Imposter Grid
      questionContentHtml = `
        <div class="quiz-imposter-grid">
          ${q.options.map((opt, i) => {
            let stateClass = '';
            if (quizEngine.isAnswered) {
              if (opt.isCorrect) stateClass = 'busted'; // Tapped imposter
              else if (quizEngine.selectedAnswer === opt) stateClass = 'innocent';
            }
            return `
              <div class="quiz-imposter-tile ${stateClass}" data-opt-idx="${i}">
                <div class="quiz-imposter-icon">${opt.icon || '🥃'}</div>
                <div class="quiz-imposter-name">${opt.text || opt.name || 'Ingredient'}</div>
                ${quizEngine.isAnswered && opt.isCorrect ? '<span style="font-size: 10px; font-weight: 800; color: var(--status-green);">🕵️ THE IMPOSTER!</span>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else if (q.type === 'BUILD_COCKTAIL') {
      // Shaker Bench
      const selected = Array.from(quizEngine.selectedBuilderIngredients);
      const isReadyToShake = selected.length === q.requiredCount;

      questionContentHtml = `
        <div class="quiz-workbench">
          <!-- Shaker Vessel -->
          <div class="quiz-shaker-box">
            <div class="quiz-shaker-header">
              <span>🍸 Shaker Tin (${selected.length} / ${q.requiredCount} ingredients)</span>
              <span>Tap pill to remove</span>
            </div>
            <div class="quiz-shaker-slots">
              ${selected.length === 0 ? '<div class="quiz-shaker-empty">Shaker is empty. Tap ingredients below to add!</div>' : ''}
              ${selected.map(id => {
                const item = q.shelf.find(x => x.id === id);
                return `
                  <div class="quiz-shaker-pill" data-remove-id="${id}">
                    <span>${item ? (item.name || item.text) : id}</span>
                    <span class="remove-icon">✕</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Ingredient Shelf -->
          <div class="quiz-shelf-title">Bar Shelf (Select ${q.requiredCount}):</div>
          <div class="quiz-shelf-grid">
            ${q.shelf.map(item => {
              const inShaker = quizEngine.selectedBuilderIngredients.has(item.id);
              return `
                <button class="quiz-shelf-chip ${inShaker ? 'in-shaker' : ''}" data-shelf-id="${item.id}" ${quizEngine.isAnswered ? 'disabled' : ''}>
                  <span>${item.icon || '🥃'}</span> <span>${item.name || item.text}</span>
                </button>
              `;
            }).join('')}
          </div>

          ${!quizEngine.isAnswered ? `
            <button class="quiz-shake-btn ${isReadyToShake ? 'ready' : ''}" id="shakeCocktailBtn" ${!isReadyToShake ? 'disabled' : ''}>
              <span>🍸</span>
              <span>SHAKE & SERVE!</span>
            </button>
          ` : ''}
        </div>
      `;
    } else {
      // Multiple Choice (Technique & Budgeting)
      questionContentHtml = `
        <div class="quiz-options-list">
          ${q.options.map((opt, i) => {
            let stateClass = '';
            if (quizEngine.isAnswered) {
              if (opt.isCorrect) stateClass = 'correct';
              else if (quizEngine.selectedAnswer === opt) stateClass = 'incorrect';
            }
            return `
              <button class="quiz-option-btn ${stateClass}" data-opt-idx="${i}" ${quizEngine.isAnswered ? 'disabled' : ''}>
                <span>${opt.text || opt.name || 'Option'}</span>
                <span class="quiz-opt-icon">${quizEngine.isAnswered ? (opt.isCorrect ? '✅' : quizEngine.selectedAnswer === opt ? '❌' : '') : '👉'}</span>
              </button>
            `;
          }).join('')}
        </div>
      `;
    }

    let feedbackHtml = '';
    if (quizEngine.isAnswered) {
      const isCorrect = (q.type === 'BUILD_COCKTAIL')
        ? (Array.from(quizEngine.selectedBuilderIngredients).length === q.targetIds.size && Array.from(quizEngine.selectedBuilderIngredients).every(id => q.targetIds.has(id)))
        : !!quizEngine.selectedAnswer?.isCorrect;

      feedbackHtml = `
        <div class="quiz-feedback-box ${isCorrect ? 'correct' : 'incorrect'}">
          <div class="quiz-feedback-header">
            <div class="quiz-feedback-status">
              <span>${isCorrect ? '🎉 Flawless Execution!' : '❌ Not Quite Right'}</span>
            </div>
            ${isCorrect ? `<div class="quiz-xp-gain">+${25 * comboMult} XP</div>` : ''}
          </div>
          <div class="quiz-explanation">
            <strong>💡 The Bartender's Notebook:</strong> ${q.explanation}
          </div>
          <button class="quiz-next-btn" id="quizNextBtn">
            <span>Next Challenge</span>
            <span class="auto-advance-badge" id="autoAdvanceCountdown">4s</span>
            <span>➔</span>
            <div class="auto-advance-bar" id="autoAdvanceBar"></div>
          </button>
        </div>
      `;
    }

    let html = `
      <div class="quiz-container">
        <!-- Active HUD -->
        <div class="quiz-hud">
          <button class="quiz-exit-btn" id="quizExitBtn">✕ Quit</button>
          <div class="quiz-hud-center">Question ${qIdx} of ${totalQ}</div>
          <div class="quiz-streak-pill">
            <span>🔥</span>
            <span>${streak > 1 ? `${streak}x Streak` : 'Active'}</span>
            ${comboMult > 1 ? `<span style="opacity: 0.9; font-size: 10px;">(${comboMult}x XP)</span>` : ''}
          </div>
        </div>

        <div class="quiz-progress-track">
          <div class="quiz-progress-fill" style="width: ${progressPct}%;"></div>
        </div>

        <!-- Question Card -->
        <div class="quiz-card">
          <div class="quiz-card-header">
            <span class="quiz-category-tag">${q.badge}</span>
            <h3 class="quiz-question-title">${q.cocktailName ? q.cocktailName : q.typeName}</h3>
            <p class="quiz-question-prompt">${q.prompt}</p>
          </div>

          ${questionContentHtml}

          ${feedbackHtml}
        </div>
      </div>
    `;

    elements.quizContainer.innerHTML = html;

    // Bind Question Handlers
    document.getElementById('quizExitBtn').onclick = () => {
      clearQuizAutoAdvance();
      soundEffects.playClick();
      if (confirm('Exit current workout and return to the Academy Hub?')) {
        quizEngine.state = 'hub';
        renderQuizTab();
      }
    };

    if (!quizEngine.isAnswered) {
      if (q.type === 'BUILD_COCKTAIL') {
        // Shelf chips
        elements.quizContainer.querySelectorAll('.quiz-shelf-chip').forEach(btn => {
          btn.onclick = () => {
            const id = btn.getAttribute('data-shelf-id');
            quizEngine.toggleBuilderIngredient(id);
            renderQuizTab();
          };
        });

        // Remove pills
        elements.quizContainer.querySelectorAll('.quiz-shaker-pill').forEach(pill => {
          pill.onclick = () => {
            const id = pill.getAttribute('data-remove-id');
            quizEngine.toggleBuilderIngredient(id);
            renderQuizTab();
          };
        });

        // Shake button
        const shakeBtn = document.getElementById('shakeCocktailBtn');
        if (shakeBtn) {
          shakeBtn.onclick = () => {
            soundEffects.playShaker();
            shakeBtn.classList.add('ready');
            setTimeout(() => {
              quizEngine.submitAnswer({ isCorrect: true });
              renderQuizTab();
            }, 600);
          };
        }
      } else if (q.type === 'WHATS_EXTRA') {
        // Imposter tiles
        elements.quizContainer.querySelectorAll('.quiz-imposter-tile').forEach(tile => {
          tile.onclick = () => {
            const idx = parseInt(tile.getAttribute('data-opt-idx'), 10);
            const selectedOpt = q.options[idx];
            quizEngine.submitAnswer(selectedOpt);
            renderQuizTab();
          };
        });
      } else {
        // Standard Multiple Choice / Fill in Blank
        elements.quizContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
          btn.onclick = () => {
            const idx = parseInt(btn.getAttribute('data-opt-idx'), 10);
            const selectedOpt = q.options[idx];
            quizEngine.submitAnswer(selectedOpt);
            renderQuizTab();
          };
        });
      }
    } else {
      // Auto-scroll to feedback drawer so the explanation is instantly visible to read
      setTimeout(() => {
        const feedbackBox = elements.quizContainer?.querySelector('.quiz-feedback-box');
        if (feedbackBox) {
          feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);

      // Start auto-advance timer with visual progress bar
      const durationSec = 4;
      let remaining = durationSec;
      const countdownEl = document.getElementById('autoAdvanceCountdown');
      const barEl = document.getElementById('autoAdvanceBar');

      if (barEl) {
        requestAnimationFrame(() => {
          barEl.style.transition = `width ${durationSec}s linear`;
          barEl.style.width = '100%';
        });
      }

      state.quizAutoAdvanceInterval = setInterval(() => {
        remaining -= 1;
        if (countdownEl && remaining > 0) {
          countdownEl.textContent = `${remaining}s`;
        }
        if (remaining <= 0) {
          clearQuizAutoAdvance();
          soundEffects.playClick();
          quizEngine.nextQuestion();
          renderQuizTab();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 1000);

      // Feedback next button click (advances immediately)
      const nextBtn = document.getElementById('quizNextBtn');
      if (nextBtn) {
        nextBtn.onclick = () => {
          clearQuizAutoAdvance();
          soundEffects.playClick();
          quizEngine.nextQuestion();
          renderQuizTab();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };
      }
    }

    return;
  }

  if (quizEngine.state === 'scorecard') {
    // Render Scorecard View
    const score = quizEngine.roundScore;
    const total = quizEngine.currentRound.length;
    const pct = Math.round((score / total) * 100);
    const xp = quizEngine.roundXpEarned;

    let heroIcon = '🍸';
    let title = 'Workout Complete!';
    let stars = '⭐⭐';
    if (pct === 100) {
      heroIcon = '🏆';
      title = 'Flawless Masterclass!';
      stars = '⭐⭐⭐';
    } else if (pct >= 80) {
      heroIcon = '🎖️';
      title = 'Distinguished Bartender!';
      stars = '⭐⭐⭐';
    } else if (pct >= 60) {
      heroIcon = '🍋';
      title = 'Solid Shift Behind the Bar!';
      stars = '⭐⭐';
    } else {
      heroIcon = '🧼';
      title = 'Keep Polishing the Glasses!';
      stars = '⭐';
    }

    let html = `
      <div class="quiz-container">
        <div class="quiz-scorecard">
          <div class="quiz-score-hero-icon">${heroIcon}</div>
          <h2 class="quiz-score-title">${title}</h2>
          <div class="quiz-score-stars">${stars}</div>
          <div style="font-size: 14px; color: var(--text-secondary);">
            You scored <strong>${score} out of ${total}</strong> (${pct}% accuracy).
          </div>

          <div class="quiz-score-metrics">
            <div class="quiz-metric-item">
              <div class="quiz-metric-num" style="color: var(--accent-orange);">+${xp}</div>
              <div class="quiz-metric-lbl">XP Earned</div>
            </div>
            <div class="quiz-metric-item">
              <div class="quiz-metric-num">${pct}%</div>
              <div class="quiz-metric-lbl">Accuracy</div>
            </div>
            <div class="quiz-metric-item">
              <div class="quiz-metric-num">🔥 ${quizEngine.roundStreak}</div>
              <div class="quiz-metric-lbl">Final Streak</div>
            </div>
          </div>

          <!-- Rank Progress Update -->
          <div class="quiz-rank-card" style="text-align: left; padding: 14px 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-weight: 800; font-size: 13px;">${currentRank.icon} ${currentRank.title}</span>
              <span style="font-size: 11px; color: #FFA57D; font-weight: 700;">Total: ${progress.xp} XP</span>
            </div>
            <div class="quiz-xp-track" style="margin-bottom: 0;">
              <div class="quiz-xp-fill" style="width: ${progressPct}%;"></div>
            </div>
          </div>

          <!-- Mistakes Review Drawer if any -->
          ${quizEngine.roundMistakes.length > 0 ? `
            <div class="quiz-review-box">
              <div class="quiz-review-header">
                <span>📝 Bar Notes & Refresher (${quizEngine.roundMistakes.length} to review)</span>
              </div>
              ${quizEngine.roundMistakes.map(m => `
                <div class="quiz-review-item">
                  <div class="quiz-review-item-q">${m.question.cocktailName || m.question.typeName}: ${m.question.prompt}</div>
                  <div class="quiz-review-item-a">💡 ${m.question.explanation}</div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="background: var(--status-green-bg); border: 1px solid rgba(46,125,50,0.3); border-radius: var(--radius-md); padding: 12px; color: var(--status-green); font-size: 13px; font-weight: 700;">
              🎉 Zero mistakes! Your bar specs are encyclopedic.
            </div>
          `}

          <!-- Action buttons -->
          <div class="quiz-actions-row">
            <button class="quiz-btn-primary" id="quizPlayAgainBtn">Play Again 🔄</button>
            <button class="quiz-btn-secondary" id="quizReturnHubBtn">Academy Hub 🎓</button>
          </div>
        </div>
      </div>
    `;

    elements.quizContainer.innerHTML = html;

    document.getElementById('quizPlayAgainBtn').onclick = () => {
      clearQuizAutoAdvance();
      soundEffects.playClick();
      quizEngine.startNewRound(quizEngine.currentRound.length || 5);
      renderQuizTab();
    };

    document.getElementById('quizReturnHubBtn').onclick = () => {
      clearQuizAutoAdvance();
      soundEffects.playClick();
      quizEngine.state = 'hub';
      renderQuizTab();
    };

    return;
  }
}

// ============================================================================
// Recipe Modal & Bartender Mode Controller
// ============================================================================
function openRecipeModal(recipe) {
  state.activeModalRecipe = recipe;
  state.activeMultiplier = 1;

  // Initialize substitutions for this recipe if not set yet
  if (!state.activeSubstitutions[recipe.id]) {
    state.activeSubstitutions[recipe.id] = {};
    const inStockIds = inventoryManager.getInStockIngredientIds();
    const subs = getSubstitutionsForRecipe(recipe, inStockIds);
    // If the recipe is missing ingredients, auto-enable the highest priority in-stock substitution
    // so the drink is immediately ready to mix for the user, while displaying the toggle ON so they can choose!
    const coveredOriginals = new Set();
    subs.filter(s => s.isOriginalMissing && s.substituteInStock).forEach(s => {
      if (!coveredOriginals.has(s.originalIngredientId)) {
        state.activeSubstitutions[recipe.id][s.id] = true;
        coveredOriginals.add(s.originalIngredientId);
      }
    });
  }

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

  // Substitution Engine
  const subs = getSubstitutionsForRecipe(recipe, inStockIds);
  const recipeSubState = state.activeSubstitutions[recipe.id] || {};
  const activeSubs = subs.filter(s => recipeSubState[s.id]);
  const activeSubByOriginal = new Map(activeSubs.map(s => [s.originalIngredientId, s]));

  // Active Substitution Banner
  let subBannerHtml = '';
  if (activeSubs.length > 0) {
    const subNames = activeSubs.map(s => `${s.substituteName} (for ${s.originalIngredientName})`).join(', ');
    subBannerHtml = `
      <div class="sub-active-banner">
        <span>🔄</span>
        <span><strong>Custom Spec Active:</strong> Substituted with ${subNames}. Ready to mix!</span>
      </div>
    `;
  }

  // Scaled Ingredients (applying active substitutions)
  const scaledIngredients = recipe.ingredients.map(ing => {
    const activeSub = activeSubByOriginal.get(ing.id);
    const scaled = scaleIngredient(ing, state.activeMultiplier, state.activeUnit);
    return {
      ...scaled,
      isSubstituted: !!activeSub,
      originalName: ing.name,
      substituteName: activeSub ? activeSub.substituteName : null,
      substituteId: activeSub ? activeSub.substituteId : null,
      activeSub
    };
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

  // Substitution Desk Menu HTML
  let subDeskHtml = '';
  if (subs.length > 0) {
    subDeskHtml = `
      <div class="substitution-desk-section">
        <div class="sub-desk-title">🔄 Mixology Substitution Desk</div>
        <div class="sub-desk-subtitle">
          Customize this spec with in-stock substitutions. Select whether you want to perform each substitution below:
        </div>
        <div class="sub-card-list">
          ${subs.map(s => {
            const isActive = !!recipeSubState[s.id];
            const badgeClass = s.confidence === 'recommended' ? 'recommended' : (s.confidence === 'acceptable' ? 'acceptable' : 'creative');
            const badgeIcon = s.confidence === 'recommended' ? '★' : (s.confidence === 'acceptable' ? '⚖️' : '💡');

            return `
              <div class="sub-desk-card ${isActive ? 'active' : ''}">
                <div class="sub-desk-header">
                  <div class="sub-desk-title-group">
                    <div class="sub-desk-pair">
                      <span class="sub-original-name">${s.originalIngredientName}</span>
                      <span class="sub-arrow">➔</span>
                      <span class="sub-replacement-name">${s.substituteName}</span>
                    </div>
                    <div class="sub-badge-wrapper">
                      <span class="sub-widget-badge ${badgeClass}">${badgeIcon} ${s.confidenceLabel}</span>
                      ${!s.substituteInStock ? '<span style="font-size: 11px; color: var(--status-red); margin-left: 6px; font-weight: 600;">(Out of Stock)</span>' : ''}
                    </div>
                  </div>
                  <div class="sub-toggle-control">
                    <label class="sub-switch" title="Select if you want to perform this substitution">
                      <input 
                        type="checkbox" 
                        class="sub-toggle-input" 
                        data-sub-id="${s.id}" 
                        ${isActive ? 'checked' : ''} 
                        ${!s.substituteInStock ? 'disabled' : ''}
                      >
                      <span class="sub-slider"></span>
                    </label>
                    <span class="sub-switch-label">${isActive ? 'Applied' : 'Original Spec'}</span>
                  </div>
                </div>
                <details class="sub-details-toggle">
                  <summary class="sub-details-summary">Flavor Impact & Tips ▾</summary>
                  <div class="sub-desk-body">
                    <div class="sub-flavor-impact">
                      <strong>Mixology Flavor Impact:</strong>
                      ${s.flavorNote}
                    </div>
                    <div class="sub-ratio-tip">
                      <strong>Bartender Technique Tip:</strong>
                      ${s.ratioAdjustment}
                    </div>
                  </div>
                </details>
              </div>
            `;
          }).join('')}
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

  // Instructions adapted for active substitutions
  const displayInstructions = recipe.instructions.map(step => {
    let modified = step;
    activeSubs.forEach(s => {
      const escaped = s.originalIngredientName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'gi');
      modified = modified.replace(regex, `<strong>${s.substituteName}</strong>`);
    });
    return modified;
  });

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
    ${subBannerHtml}

    <!-- Ingredients Table -->
    <div class="spec-table">
      ${scaledIngredients.map(ing => {
        if (ing.isSubstituted) {
          return `
            <div class="spec-row">
              <div class="spec-name-group">
                <span class="spec-amount">${ing.displayText}</span>
                <span class="spec-name">
                  <span class="spec-original-subbed">${ing.originalName}</span>
                  <span class="spec-subbed-arrow">➔</span>
                  <span class="spec-subbed-name">${ing.substituteName}</span>
                  <span class="sub-badge-inline">Substituted</span>
                </span>
              </div>
              <button class="spec-status-btn subbed" title="Substituted ingredient is in stock">
                ✓ In Stock (Sub)
              </button>
            </div>
          `;
        }

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

    ${subDeskHtml}

    <!-- Mechanical Technique Box (Collapsible in Minimal Mode) -->
    ${recipe.techniqueRule ? `
      <details class="technique-details">
        <summary class="technique-summary">💡 Execution Rule & Science ▾</summary>
        <div class="technique-desc">${recipe.techniqueRule}</div>
      </details>
    ` : ''}

    ${timerSectionHtml}

    <!-- Instructions Steps -->
    <div style="margin-bottom: 24px;">
      <div style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; color: var(--text-secondary);">
        Preparation Method
      </div>
      <ol style="padding-left: 20px; font-size: 14px; line-height: 1.6; color: var(--text-primary);">
        ${displayInstructions.map(step => `<li style="margin-bottom: 6px;">${step}</li>`).join('')}
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

  // Bind substitution toggle switches
  elements.modalSheet.querySelectorAll('.sub-toggle-input').forEach(input => {
    input.onchange = (e) => {
      e.stopPropagation();
      soundEffects.playClick();
      const subId = input.getAttribute('data-sub-id');
      const isChecked = input.checked;
      state.activeSubstitutions[recipe.id] = state.activeSubstitutions[recipe.id] || {};
      
      const subObj = subs.find(s => s.id === subId);
      if (isChecked && subObj) {
        // Auto-disable any other substitution for this original ingredient to avoid conflicts
        subs.filter(s => s.originalIngredientId === subObj.originalIngredientId && s.id !== subId)
            .forEach(other => {
              state.activeSubstitutions[recipe.id][other.id] = false;
            });
        state.activeSubstitutions[recipe.id][subId] = true;
        showToast(`Applied: ${subObj.substituteName} for ${subObj.originalIngredientName}`);
      } else if (subObj) {
        state.activeSubstitutions[recipe.id][subId] = false;
        showToast(`Reverted to original spec: ${subObj.originalIngredientName}`);
      }
      renderModalContent();
      renderRecipesTab();
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
  renderQuizTab();
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
    updateFilterBtnLabel();
    renderRecipesTab();
  };

  elements.spiritFilter.onchange = (e) => {
    state.spiritFilter = e.target.value;
    updateFilterBtnLabel();
    renderRecipesTab();
  };

  function updateFilterBtnLabel() {
    if (!elements.toggleFilterSheetBtn) return;
    const hasFilter = state.categoryFilter !== 'all' || state.spiritFilter !== 'all';
    elements.toggleFilterSheetBtn.classList.toggle('has-filter', hasFilter);
  }

  // Toggle collapsible secondary filters (minimalist mode)
  if (elements.toggleFilterSheetBtn && elements.secondaryFilters) {
    elements.toggleFilterSheetBtn.onclick = () => {
      soundEffects.playClick();
      elements.secondaryFilters.classList.toggle('collapsed');
      const isCollapsed = elements.secondaryFilters.classList.contains('collapsed');
      elements.toggleFilterSheetBtn.textContent = isCollapsed ? 'Filters ▾' : 'Filters ▴';
    };
  }

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
  clearQuizAutoAdvance();
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
    guide: document.getElementById('guideScreen'),
    quiz: document.getElementById('quizScreen')
  };

  Object.keys(screens).forEach(key => {
    if (screens[key]) {
      screens[key].style.display = key === tabName ? 'block' : 'none';
    }
  });

  if (tabName === 'quiz') {
    renderQuizTab();
  }

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

// ============================================================================
// BarCraft v3 "Atelier" Master Application Controller
// Unifies: The Bar, The Backbar, The Academy, The Craft Lab & Bartender Focus HUD
// ============================================================================

import { inventoryManager } from './inventory.js';
import { 
  analyzeRecipesAvailability, 
  filterRecipes, 
  getAllRecipes, 
  getSubstitutionsForRecipe, 
  calculateUnlockRecommendations,
  getDrinkRecommendation
} from './matching.js';
import { scaleIngredient, calculateBatchMetrics, formatAmount } from './scaler.js';
import { CocktailTimer, soundEffects, wakeLockManager } from './timers.js';
import { quizEngine, RANK_LADDER } from './quiz.js';
import { MECHANICAL_RULES } from './db.js';

// Application State
const state = {
  activeHub: 'bar', // 'bar' | 'cabinet' | 'academy'
  barViewMode: 'deck', // 'deck' | 'grid'
  activeMood: 'all', // 'all' | 'nightcap' | 'crisp' | 'aperitivo' | 'tropical' | 'smoky' | 'zero-proof'
  readinessFilter: 'all', // 'all' | 'can-make' | 'substitutes' | 'missing-1' | 'favorites' | 'want-to-try'
  searchQuery: '',
  activeUnit: localStorage.getItem('barcraft_unit') || 'oz',
  deckIndex: 0,
  activeModalRecipe: null,
  activeMultiplier: 1,
  activeSubstitutions: {},
  activeCabinetSegment: 'stock', // 'stock' | 'shopping' | 'unlock'
  activeShoppingSubtab: 'staples', // 'staples' | 'wishlist'
  partyModeActive: false,
  activeTimer: null
};

// Cached DOM Elements
const elements = {};

function initDom() {
  elements.app = document.getElementById('atelierApp');
  elements.inStockPillCount = document.getElementById('inStockPillCount');
  elements.unitToggleBtn = document.getElementById('unitToggleBtn');
  elements.hostModeBtn = document.getElementById('hostModeBtn');
  
  // Hub Screens
  elements.barHub = document.getElementById('barHub');
  elements.cabinetHub = document.getElementById('cabinetHub');
  elements.academyHub = document.getElementById('academyHub');

  // Search & Filters in Bar Hub
  elements.moodCarousel = document.getElementById('moodCarousel');
  elements.atelierSearchInput = document.getElementById('atelierSearchInput');
  elements.clearSearchBtn = document.getElementById('clearSearchBtn');
  elements.viewModeDeckBtn = document.getElementById('viewModeDeckBtn');
  elements.viewModeGridBtn = document.getElementById('viewModeGridBtn');
  elements.readinessPillsRow = document.getElementById('readinessPillsRow');
  elements.barContentContainer = document.getElementById('barContentContainer');

  // Cabinet Hub Containers
  elements.cabinetContainer = document.getElementById('cabinetContainer');

  // Academy Hub Containers
  elements.academyContainer = document.getElementById('academyContainer');

  // Floating Action Button
  elements.craftLabFab = document.getElementById('craftLabFab');

  // Bottom Navigation
  elements.bottomNav = document.getElementById('atelierBottomNav');

  // Modals
  elements.hudModalOverlay = document.getElementById('hudModalOverlay');
  elements.hudModalSheet = document.getElementById('hudModalSheet');
  elements.partyModeOverlay = document.getElementById('partyModeOverlay');
  elements.partyModeContainer = document.getElementById('partyModeContainer');
  elements.craftLabModalOverlay = document.getElementById('craftLabModalOverlay');
  elements.craftLabModalSheet = document.getElementById('craftLabModalSheet');
  elements.toastContainer = document.getElementById('atelierToastContainer');
}

// ============================================================================
// Notification Toasts
// ============================================================================
export function showToast(message, duration = 3500) {
  if (!elements.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'atelier-toast';
  toast.textContent = message;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

// ============================================================================
// Liquid Color Mapping Helper for Visual Silhouettes
// ============================================================================
function getLiquidColor(ing) {
  const text = `${ing.id || ''} ${ing.name || ''}`.toLowerCase();
  if (text.includes('campari') || text.includes('aperol') || text.includes('grenadine') || text.includes('cranberry')) {
    return 'linear-gradient(90deg, #D90429, #EF233C)';
  }
  if (text.includes('whiskey') || text.includes('bourbon') || text.includes('rye') || text.includes('scotch') || text.includes('cognac') || text.includes('brandy') || text.includes('amaro')) {
    return 'linear-gradient(90deg, #D48817, #E8A838)';
  }
  if (text.includes('vermouth') && text.includes('sweet')) {
    return 'linear-gradient(90deg, #8A1C24, #AC2832)';
  }
  if (text.includes('lime') || text.includes('lemon') || text.includes('grapefruit') || text.includes('citrus')) {
    return 'linear-gradient(90deg, #F3C623, #F6D649)';
  }
  if (text.includes('chartreuse') || text.includes('mint') || text.includes('absinthe')) {
    return 'linear-gradient(90deg, #10B981, #34D399)';
  }
  if (text.includes('orgeat') || text.includes('cream') || text.includes('egg') || text.includes('coconut')) {
    return 'linear-gradient(90deg, #F1EFE7, #FFFFFF)';
  }
  if (text.includes('coffee') || text.includes('cacao') || text.includes('kahlua') || text.includes('stout')) {
    return 'linear-gradient(90deg, #3E2723, #5D4037)';
  }
  // Clear spirits (Gin, Vodka, Blanco Tequila, White Rum, Triple Sec, Simple Syrup)
  return 'linear-gradient(90deg, rgba(200, 225, 245, 0.45), rgba(240, 248, 255, 0.65))';
}

// ============================================================================
// HUB 1: THE BAR (Explore, Moods, Deck, & Catalog Grid)
// ============================================================================
function renderBarHub() {
  const analyzed = analyzeRecipesAvailability();
  const inStockIds = inventoryManager.getInStockIngredientIds();

  // Update in-stock counter in header
  if (elements.inStockPillCount) {
    elements.inStockPillCount.textContent = `${inStockIds.size} Bottles In Stock`;
  }

  // Filter recipes based on active mood, search query, and readiness
  const filtered = filterRecipes(analyzed, {
    availabilityFilter: state.readinessFilter,
    moodFilter: state.activeMood,
    searchQuery: state.searchQuery
  });

  // Calculate readiness category counts for pills
  const counts = {
    all: analyzed.length,
    'can-make': analyzed.filter(a => a.canMake).length,
    'substitutes': analyzed.filter(a => a.canMake || a.canMakeWithSub).length,
    'missing-1': analyzed.filter(a => a.missingCount === 1).length,
    'favorites': analyzed.filter(a => a.isFavorite).length,
    'want-to-try': analyzed.filter(a => a.isWantToTry).length
  };

  // Update readiness pills
  elements.readinessPillsRow.querySelectorAll('.readiness-pill').forEach(pill => {
    const key = pill.getAttribute('data-readiness');
    pill.classList.toggle('active', key === state.readinessFilter);
    const countSpan = pill.querySelector('.pill-cnt');
    if (countSpan && counts[key] !== undefined) {
      countSpan.textContent = counts[key];
    }
  });

  // Update mood chips active state
  elements.moodCarousel.querySelectorAll('.mood-chip').forEach(chip => {
    chip.classList.toggle('active', chip.getAttribute('data-mood') === state.activeMood);
  });

  // Render Content based on view mode (Deck vs Grid)
  if (state.barViewMode === 'deck') {
    renderBarDeckView(filtered);
  } else {
    renderBarGridView(filtered);
  }
}

// "Tonight's Pour" Swipeable Deck View (Zero Decision Fatigue)
function renderBarDeckView(recipesList) {
  // Respect the active readiness filter; when 'all' is selected, sort makeable drinks to the top
  let pool = [...recipesList];
  if (state.readinessFilter === 'all') {
    pool.sort((a, b) => {
      const scoreA = a.canMake ? 3 : (a.canMakeWithSub ? 2 : (a.missingCount === 1 ? 1 : 0));
      const scoreB = b.canMake ? 3 : (b.canMakeWithSub ? 2 : (b.missingCount === 1 ? 1 : 0));
      return scoreB - scoreA;
    });
  }

  if (pool.length === 0) {
    elements.barContentContainer.innerHTML = `
      <div class="deck-card" style="text-align: center; padding: 48px 20px;">
        <div style="font-size: 38px; margin-bottom: 10px;">🍸</div>
        <div class="deck-card-title">No Matching Pours</div>
        <div style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 16px;">
          Try selecting another mood or clearing your search.
        </div>
        <button class="deck-btn-mix" id="deckResetFiltersBtn" style="max-width: 200px; margin: 0 auto;">
          Show All Drinks
        </button>
      </div>
    `;
    const resetBtn = document.getElementById('deckResetFiltersBtn');
    if (resetBtn) {
      resetBtn.onclick = () => {
        state.activeMood = 'all';
        state.readinessFilter = 'all';
        state.searchQuery = '';
        if (elements.atelierSearchInput) elements.atelierSearchInput.value = '';
        renderBarHub();
      };
    }
    return;
  }

  // Ensure index is within bounds
  if (state.deckIndex >= pool.length) state.deckIndex = 0;
  if (state.deckIndex < 0) state.deckIndex = pool.length - 1;

  const currentItem = pool[state.deckIndex];
  const { recipe, canMake, canMakeWithSub, isFavorite, isWantToTry } = currentItem;

  // Separate true liquid ingredients from produce/garnishes/bitters
  const isLiquidUnit = (u) => !u || u === 'oz' || u === 'ml' || u === 'cl' || u === 'barspoon' || u === 'part' || u === 'parts';
  let liquidIngredients = recipe.ingredients.filter(ing => isLiquidUnit(ing.unit));
  const accentIngredients = recipe.ingredients.filter(ing => !isLiquidUnit(ing.unit));
  if (liquidIngredients.length === 0) {
    liquidIngredients = recipe.ingredients;
  }

  const totalVolume = liquidIngredients.reduce((acc, ing) => {
    let val = typeof ing.amount === 'number' ? ing.amount : 0.5;
    if (ing.unit === 'barspoon') val = 0.15;
    return acc + val;
  }, 0) || 3.0;

  const liquidLayersHtml = liquidIngredients.map(ing => {
    let val = typeof ing.amount === 'number' ? ing.amount : 0.5;
    if (ing.unit === 'barspoon') val = 0.15;
    const heightPct = Math.max(16, Math.round((val / totalVolume) * 100));
    const grad = getLiquidColor(ing);
    return `
      <div class="vessel-liquid-layer" style="height: ${heightPct}%; background: ${grad};">
        <span class="liquid-layer-name">${ing.name}</span>
        <span class="liquid-layer-amt">${formatAmount(ing.amount, state.activeUnit, ing.unit)}</span>
      </div>
    `;
  }).join('');

  // Accent Produce & Garnish Chips
  let accentsHtml = '';
  if (accentIngredients.length > 0) {
    const chips = accentIngredients.map(ing => {
      let icon = '🌿';
      const text = `${ing.id || ''} ${ing.name || ''}`.toLowerCase();
      if (text.includes('berry') || text.includes('berries') || text.includes('cherry') || text.includes('fruit')) icon = '🍓';
      else if (text.includes('bitter')) icon = '💧';
      else if (text.includes('lemon') || text.includes('lime') || text.includes('orange') || text.includes('grapefruit') || text.includes('twist') || text.includes('peel') || text.includes('wedge')) icon = '🍊';
      else if (text.includes('egg') || text.includes('albumen')) icon = '🥚';
      else if (text.includes('cucumber') || text.includes('olive')) icon = '🥒';
      else if (text.includes('nutmeg') || text.includes('cinnamon') || text.includes('salt')) icon = '✨';

      const displayAmt = formatAmount(ing.amount, state.activeUnit, ing.unit);
      return `<span class="deck-accent-chip">${icon} ${ing.name}${displayAmt ? ` (${displayAmt})` : ''}</span>`;
    }).join('');

    accentsHtml = `<div class="deck-accents-row">${chips}</div>`;
  }

  // Substitution / Missing Callout
  let subCalloutHtml = '';
  if (canMakeWithSub && currentItem.primarySubSummary) {
    subCalloutHtml = `
      <div class="deck-sub-callout">
        <span class="deck-sub-icon">🔄</span>
        <div class="deck-sub-text">
          <div class="deck-sub-title">Smart Substitute Ready</div>
          <div class="deck-sub-desc">Swap <strong>${currentItem.primarySubSummary}</strong> to pour tonight!</div>
        </div>
      </div>
    `;
  } else if (!canMake && currentItem.missingIngredients && currentItem.missingIngredients.length === 1) {
    subCalloutHtml = `
      <div class="deck-missing-callout">
        <span style="font-size: 16px;">🛒</span>
        <div>Missing: <strong>${currentItem.missingIngredients[0].name}</strong> (In Backbar Shopping List)</div>
      </div>
    `;
  }

  elements.barContentContainer.innerHTML = `
    <div class="deck-view-container">
      <div class="deck-card" id="activeDeckCard">
        <div class="deck-card-eyebrow">
          <span class="status-tag ${canMake ? 'ready' : (canMakeWithSub ? 'sub' : 'need1')}">
            ${canMake ? '✓ Ready to Pour' : (canMakeWithSub ? '🔄 Ready with Sub' : 'Need 1 Bottle')}
          </span>
          <span class="deck-card-counter">
            ${state.deckIndex + 1} of ${pool.length} Pours
          </span>
        </div>

        <div class="deck-card-title">${recipe.name}</div>
        <div class="deck-card-sub">
          <span>${recipe.category}</span>
          <span>•</span>
          <span>${recipe.glass}</span>
          ${recipe.isRiff ? `<span style="color:var(--accent-purple);">🎨 Riff</span>` : ''}
          ${recipe.isCustom ? `<span style="color:var(--accent-emerald);">★ Custom</span>` : ''}
        </div>

        <!-- Sensory Liquid Ratio Fill Silhouette -->
        <div class="vessel-mini-silhouette">
          ${liquidLayersHtml}
        </div>
        ${accentsHtml}

        ${subCalloutHtml}

        <!-- Specs Quick Summary -->
        <div class="deck-specs-summary">
          <div class="deck-spec-row">
            <span>Glassware</span>
            <span class="spec-val">${recipe.glass} (${recipe.ice})</span>
          </div>
          <div class="deck-spec-row">
            <span>Technique</span>
            <span class="spec-val">${recipe.method}</span>
          </div>
          ${recipe.techniqueRule ? `
            <div class="deck-spec-row">
              <span>Bar Rule</span>
              <span class="spec-val" style="color: var(--accent-amber); font-style: italic;">${recipe.techniqueRule}</span>
            </div>
          ` : ''}
        </div>

        <!-- Deck Actions with Prev and Next -->
        <div class="deck-card-actions">
          <button class="deck-btn-fav ${isFavorite ? 'active' : ''}" id="deckFavBtn" title="Toggle Favorite">★</button>
          <button class="deck-btn-fav ${isWantToTry ? 'active' : ''}" id="deckWantBtn" title="Want to Try" style="color: #EC4899;">🔖</button>
          <button class="deck-btn-nav" id="deckPrevBtn" title="Previous Drink Card">‹ Prev</button>
          <button class="deck-btn-mix" id="deckMixBtn">
            <span>Mix This Pour →</span>
          </button>
          <button class="deck-btn-nav" id="deckNextBtn" title="Next Drink Card">Next ›</button>
        </div>
      </div>
    </div>
  `;

  // Attach Deck Listeners
  const card = document.getElementById('activeDeckCard');

  const navigateDeck = (step) => {
    state.deckIndex = (state.deckIndex + step + pool.length) % pool.length;
    renderBarHub();
  };

  const triggerCardExit = (step) => {
    if (!card) {
      navigateDeck(step);
      return;
    }
    card.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease';
    const exitX = step > 0 ? -120 : 120;
    const exitRot = step > 0 ? -8 : 8;
    card.style.transform = `translateX(${exitX}%) rotate(${exitRot}deg)`;
    card.style.opacity = '0';
    soundEffects.playClick();
    setTimeout(() => {
      navigateDeck(step);
    }, 180);
  };

  // Next & Prev Buttons
  const nextBtn = document.getElementById('deckNextBtn');
  if (nextBtn) nextBtn.onclick = () => triggerCardExit(1);

  const prevBtn = document.getElementById('deckPrevBtn');
  if (prevBtn) prevBtn.onclick = () => triggerCardExit(-1);

  // Mix Pour Button
  const mixBtn = document.getElementById('deckMixBtn');
  if (mixBtn) {
    mixBtn.onclick = () => {
      soundEffects.playClick();
      openBartenderHUD(recipe);
    };
  }

  // Favorites & Want-to-Try Buttons
  const favBtn = document.getElementById('deckFavBtn');
  if (favBtn) {
    favBtn.onclick = () => {
      soundEffects.playClick();
      inventoryManager.toggleFavorite(recipe.id);
      renderBarHub();
    };
  }

  const wantBtn = document.getElementById('deckWantBtn');
  if (wantBtn) {
    wantBtn.onclick = () => {
      soundEffects.playClick();
      const isNow = inventoryManager.toggleWantToTry(recipe.id);
      showToast(isNow ? `Added "${recipe.name}" to Want to Try` : `Removed "${recipe.name}"`);
      renderBarHub();
    };
  }

  // Touch Swipe Event Handlers for Mobile Thumb Ergonomics
  if (card) {
    let touchStartX = 0;
    let touchStartY = 0;
    let currentDeltaX = 0;
    let isDragging = false;
    let isHorizontalGesture = false;

    card.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      currentDeltaX = 0;
      isDragging = true;
      isHorizontalGesture = false;
      card.style.transition = 'none';
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;

      if (!isHorizontalGesture && Math.abs(deltaX) > 8) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          isHorizontalGesture = true;
        } else {
          isDragging = false;
          return;
        }
      }

      if (isHorizontalGesture) {
        currentDeltaX = deltaX;
        const rot = deltaX * 0.04;
        const op = Math.max(0.4, 1 - Math.abs(deltaX) / 450);
        card.style.transform = `translateX(${deltaX}px) rotate(${rot}deg)`;
        card.style.opacity = `${op}`;
      }
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
      if (!isDragging || !isHorizontalGesture) {
        isDragging = false;
        return;
      }
      isDragging = false;
      if (currentDeltaX < -45) {
        triggerCardExit(1);
      } else if (currentDeltaX > 45) {
        triggerCardExit(-1);
      } else {
        card.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
        card.style.transform = '';
        card.style.opacity = '1';
      }
    }, { passive: true });
  }
}

// Curated Catalog Grid View (Atmospheric Cards)
function renderBarGridView(recipesList) {
  if (recipesList.length === 0) {
    elements.barContentContainer.innerHTML = `
      <div style="text-align: center; padding: 48px 16px; color: var(--text-secondary);">
        <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
        <div style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">No Cocktails Found</div>
        <div style="font-size: 13px;">Try clearing filters or adjusting your search term.</div>
      </div>
    `;
    return;
  }

  const inStockIds = inventoryManager.getInStockIngredientIds();

  const cardsHtml = recipesList.map(item => {
    const { recipe, canMake, canMakeWithSub, missingCount, missingIngredients, isFavorite, isWantToTry } = item;

    let statusTagHtml = '';
    if (canMake) {
      statusTagHtml = `<span class="status-tag ready">✓ Ready</span>`;
    } else if (canMakeWithSub) {
      statusTagHtml = `<span class="status-tag sub">🔄 Sub</span>`;
    } else if (missingCount === 1) {
      statusTagHtml = `<span class="status-tag need1">Need 1</span>`;
    } else {
      statusTagHtml = `<span class="status-tag missing">${missingCount} miss</span>`;
    }

    // Clean ingredients preview
    const ingPreview = recipe.ingredients.map(i => {
      const isMissing = !inStockIds.has(i.id);
      if (isMissing) {
        return `<span class="card-ing-item missing">${i.name}</span>`;
      }
      return `<span class="card-ing-item">${i.name}</span>`;
    }).join(' • ');

    return `
      <div class="catalog-card" data-recipe-id="${recipe.id}">
        <div>
          <div class="card-top-row">
            <div class="card-title-group">
              <div class="card-cocktail-name">${recipe.name}</div>
              <div class="card-glass-category">${recipe.category} • ${recipe.glass}</div>
            </div>
            <div class="card-quick-actions">
              <button class="card-star-btn ${isFavorite ? 'active' : ''}" data-fav="${recipe.id}">★</button>
              <button class="card-want-btn ${isWantToTry ? 'active' : ''}" data-want="${recipe.id}">🔖</button>
            </div>
          </div>

          <div class="card-ingredients-strip" style="margin-top: 8px;">
            ${ingPreview}
          </div>
        </div>

        <div class="card-footer-row">
          <div>${statusTagHtml}</div>
          <span style="color: var(--accent-amber); font-weight: 700;">Mix →</span>
        </div>
      </div>
    `;
  }).join('');

  elements.barContentContainer.innerHTML = `<div class="catalog-grid">${cardsHtml}</div>`;

  // Attach card click handlers
  elements.barContentContainer.querySelectorAll('.catalog-card').forEach(card => {
    card.onclick = (e) => {
      if (e.target.closest('.card-star-btn') || e.target.closest('.card-want-btn')) return;
      soundEffects.playClick();
      const rid = card.getAttribute('data-recipe-id');
      const item = recipesList.find(r => r.recipe.id === rid);
      if (item) openBartenderHUD(item.recipe);
    };
  });

  // Favorite toggle
  elements.barContentContainer.querySelectorAll('[data-fav]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      soundEffects.playClick();
      const rid = btn.getAttribute('data-fav');
      inventoryManager.toggleFavorite(rid);
      renderBarHub();
    };
  });

  // Want to try toggle
  elements.barContentContainer.querySelectorAll('[data-want]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      soundEffects.playClick();
      const rid = btn.getAttribute('data-want');
      const isNow = inventoryManager.toggleWantToTry(rid);
      showToast(isNow ? `Added to Want to Try` : `Removed`);
      renderBarHub();
    };
  });
}

// ============================================================================
// HUB 2: THE BACKBAR (Inventory, Shopping List, & Unlock Optimizer)
// ============================================================================
function renderCabinetHub() {
  const inStockIds = inventoryManager.getInStockIngredientIds();
  const allIngredients = inventoryManager.getAllIngredients();
  const shoppingList = inventoryManager.getShoppingList();
  const unlockList = calculateUnlockRecommendations();

  // Segment Tab Bar
  const segmentHeaderHtml = `
    <div class="cabinet-tabs-switcher">
      <button class="cabinet-tab-btn ${state.activeCabinetSegment === 'stock' ? 'active' : ''}" data-cab="stock">
        🥃 My Stock (${inStockIds.size})
      </button>
      <button class="cabinet-tab-btn ${state.activeCabinetSegment === 'shopping' ? 'active' : ''}" data-cab="shopping">
        🛒 Shopping (${shoppingList.length})
      </button>
      <button class="cabinet-tab-btn ${state.activeCabinetSegment === 'unlock' ? 'active' : ''}" data-cab="unlock">
        💡 Unlock (+${unlockList.length})
      </button>
    </div>
  `;

  let contentHtml = '';

  if (state.activeCabinetSegment === 'stock') {
    // 3 Visual Backbar Shelves: Top Shelf Spirits, Modifiers & Amari, Pantry & Juices
    const shelves = [
      { name: 'Top Shelf (Base Spirits)', category: 'Base Spirits', icon: '🥃' },
      { name: 'Middle Tier (Modifiers, Vermouths & Amari)', category: 'Modifiers & Liqueurs', icon: '🍷' },
      { name: 'Speed Well (Pantry, Juices, Syrups & Bitters)', category: 'Pantry, Produce & Syrups', icon: '🍋' }
    ];

    contentHtml = shelves.map(shelf => {
      const items = allIngredients.filter(i => {
        if (shelf.category === 'Base Spirits') return i.category === 'Base Spirits';
        if (shelf.category === 'Modifiers & Liqueurs') return i.category === 'Modifiers & Liqueurs' || i.category.includes('Liqueur');
        return i.category !== 'Base Spirits' && !i.category.includes('Liqueur');
      });

      const cards = items.map(bottle => {
        const inStock = inStockIds.has(bottle.id);
        return `
          <div class="bottle-item-card ${inStock ? 'in-stock' : 'out-of-stock'}">
            <div class="bottle-info">
              <span class="bottle-name">${bottle.name}</span>
              ${bottle.benchmark ? `<span class="bottle-meta">${bottle.benchmark}</span>` : ''}
              ${bottle.suggestedPrice ? `<span class="bottle-price-pill">${bottle.suggestedPrice}</span>` : ''}
            </div>
            <button class="stock-toggle-switch ${inStock ? 'in-stock' : 'out-stock'}" data-stock-toggle="${bottle.id}">
              ${inStock ? '✓ Stocked' : '+ Add'}
            </button>
          </div>
        `;
      }).join('');

      return `
        <div class="shelf-section">
          <div class="shelf-header">
            <span class="shelf-title">${shelf.icon} ${shelf.name}</span>
            <span style="font-size: 11px; color: var(--text-muted);">${items.filter(i => inStockIds.has(i.id)).length} / ${items.length}</span>
          </div>
          <div class="shelf-bottle-grid">${cards}</div>
        </div>
      `;
    }).join('');

  } else if (state.activeCabinetSegment === 'shopping') {
    // Shopping List (Staples vs Wishlist)
    const staples = shoppingList.filter(i => (i.listType || 'wishlist') === 'staples');
    const wishlist = shoppingList.filter(i => (i.listType || 'wishlist') === 'wishlist');
    const activeItems = state.activeShoppingSubtab === 'staples' ? staples : wishlist;

    contentHtml = `
      <div class="shopping-subtabs">
        <button class="shopping-subtab-btn ${state.activeShoppingSubtab === 'staples' ? 'active' : ''}" data-subtab="staples">
          Essential Staples (${staples.length})
        </button>
        <button class="shopping-subtab-btn ${state.activeShoppingSubtab === 'wishlist' ? 'active' : ''}" data-subtab="wishlist">
          Wishlist (${wishlist.length})
        </button>
      </div>

      <div style="margin-bottom: 16px;">
        ${activeItems.length === 0 ? `
          <div style="text-align: center; padding: 36px 0; color: var(--text-muted);">
            No items in ${state.activeShoppingSubtab}. Marking a bottle out of stock automatically adds it here!
          </div>
        ` : activeItems.map(item => `
          <div class="shopping-item-row">
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--text-primary);">${item.name}</div>
              <div style="font-size: 11.5px; color: var(--accent-amber);">${item.suggestedPrice || 'Suggested benchmark: $25–$35'}</div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="hud-btn" data-shop-bump="${item.id}" title="Move to other list">⇄</button>
              <button class="hud-btn" data-shop-check="${item.id}" style="color: var(--accent-emerald);">✓ Bought</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

  } else if (state.activeCabinetSegment === 'unlock') {
    // Unlock Optimizer
    contentHtml = `
      <div style="margin-bottom: 12px; font-size: 13px; color: var(--text-secondary);">
        Sorted by highest drink yield. Adding these bottles unlocks the most new recipes right now:
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${unlockList.slice(0, 15).map(u => `
          <div class="bottle-item-card in-stock" style="border-left: 3px solid var(--accent-amber);">
            <div class="bottle-info">
              <span class="bottle-name">${u.name}</span>
              <span class="bottle-meta" style="color: var(--accent-amber); font-weight: 700;">
                Unlocks ${u.unlocksNow.length} new cocktails immediately!
              </span>
              <span style="font-size: 11px; color: var(--text-muted);">
                ${u.unlocksNow.map(r => r.name).slice(0, 3).join(', ')}...
              </span>
            </div>
            <button class="hud-btn" data-unlock-add="${u.id}">+ Shopping</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  elements.cabinetContainer.innerHTML = segmentHeaderHtml + contentHtml;

  // Bind Segment Switcher
  elements.cabinetContainer.querySelectorAll('.cabinet-tab-btn').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      state.activeCabinetSegment = btn.getAttribute('data-cab');
      renderCabinetHub();
    };
  });

  // Bind Stock Toggles
  elements.cabinetContainer.querySelectorAll('[data-stock-toggle]').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      const id = btn.getAttribute('data-stock-toggle');
      const item = inventoryManager.toggleStock(id);
      showToast(item.inStock ? `Restocked ${item.name}` : `Depleted ${item.name} (Added to Shopping)`);
      renderCabinetHub();
      renderBarHub();
    };
  });

  // Bind Shopping Subtabs
  elements.cabinetContainer.querySelectorAll('.shopping-subtab-btn').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      state.activeShoppingSubtab = btn.getAttribute('data-subtab');
      renderCabinetHub();
    };
  });

  // Bind Shopping Item Bought
  elements.cabinetContainer.querySelectorAll('[data-shop-check]').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playChime();
      const id = btn.getAttribute('data-shop-check');
      inventoryManager.purchaseItem(id);
      showToast(`Celebration! Restocked into your Bar Inventory 🎉`);
      renderCabinetHub();
      renderBarHub();
    };
  });

  // Bind Shopping Item Bump
  elements.cabinetContainer.querySelectorAll('[data-shop-bump]').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      const id = btn.getAttribute('data-shop-bump');
      const targetType = state.activeShoppingSubtab === 'staples' ? 'wishlist' : 'staples';
      inventoryManager.bumpShoppingItemType(id, targetType);
      showToast(`Moved to ${targetType}`);
      renderCabinetHub();
    };
  });

  // Bind Unlock to Shopping
  elements.cabinetContainer.querySelectorAll('[data-unlock-add]').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      const id = btn.getAttribute('data-unlock-add');
      const all = inventoryManager.getAllIngredients();
      const bottle = all.find(b => b.id === id);
      if (bottle) {
        inventoryManager.addToShoppingList(bottle.id, bottle.name, bottle.category, 'manual');
        showToast(`Added ${bottle.name} to Shopping List`);
        renderCabinetHub();
      }
    };
  });
}

// ============================================================================
// HUB 3: THE ACADEMY (Gamified Drills & Technique Codex)
// ============================================================================
function renderAcademyHub() {
  const progress = quizEngine.getProgress();
  const currentRank = quizEngine.getCurrentRank();
  const nextRank = RANK_LADDER.find(r => r.rank === currentRank.rank + 1);
  const xpNeeded = nextRank ? nextRank.xpRequired : progress.xp;
  const progressPct = nextRank ? Math.min(100, Math.round((progress.xp / nextRank.xpRequired) * 100)) : 100;

  if (quizEngine.state === 'question') {
    renderActiveQuizQuestion();
    return;
  }

  elements.academyContainer.innerHTML = `
    <!-- Hero Rank Progress Card -->
    <div class="academy-hero-card">
      <div class="rank-badge-row">
        <span class="rank-title">${currentRank.icon} ${currentRank.title}</span>
        <span class="streak-pill-academy">🔥 ${progress.streak} Streak</span>
      </div>
      <div class="xp-track-bar">
        <div class="xp-fill-bar" style="width: ${progressPct}%;"></div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 11.5px; color: var(--text-secondary);">
        <span>Rank ${currentRank.rank} / ${RANK_LADDER.length}</span>
        <span>${progress.xp} / ${xpNeeded} XP</span>
      </div>
    </div>

    <!-- Drill Launcher Grid -->
    <div class="drill-launcher-grid">
      <div class="drill-launcher-card" id="startQuickWorkoutBtn">
        <span class="drill-icon">⚡</span>
        <span class="drill-title">Daily Workout</span>
        <span class="drill-sub">5 rapid-fire interactive drills</span>
      </div>
      <div class="drill-launcher-card" id="startMasterclassBtn">
        <span class="drill-icon">🏆</span>
        <span class="drill-title">Masterclass</span>
        <span class="drill-sub">10-question certification drill</span>
      </div>
    </div>

    <!-- Bartender's Codex (Technique Insights) -->
    <div style="margin-top: 10px;">
      <div style="font-family: var(--font-serif); font-size: 18px; font-weight: 700; margin-bottom: 12px; color: var(--text-primary);">
        📖 The Bartender's Codex
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${MECHANICAL_RULES.map(rule => `
          <div class="bottle-item-card in-stock" style="border-left: 3px solid var(--accent-amber); flex-direction: column; align-items: flex-start; gap: 6px;">
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <span style="font-weight: 700; font-size: 13.5px; color: var(--text-primary);">${rule.title}</span>
              <span class="hud-pill" style="font-size: 10px;">${rule.badge}</span>
            </div>
            <div style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.45;">
              ${rule.rule}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('startQuickWorkoutBtn').onclick = () => {
    soundEffects.playClick();
    quizEngine.startNewRound(5);
    renderAcademyHub();
  };

  document.getElementById('startMasterclassBtn').onclick = () => {
    soundEffects.playClick();
    quizEngine.startNewRound(10);
    renderAcademyHub();
  };
}

function renderActiveQuizQuestion() {
  const current = quizEngine.getCurrentQuestion();
  if (!current) return;

  const qNum = quizEngine.currentQuestionIndex + 1;
  const qTotal = quizEngine.currentRound.length;

  elements.academyContainer.innerHTML = `
    <div class="academy-hero-card" style="margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span class="hud-pill">Question ${qNum} of ${qTotal}</span>
        <button class="hud-btn" id="exitQuizBtn" style="padding: 3px 9px;">✕ Exit</button>
      </div>
      <div style="font-family: var(--font-serif); font-size: 19px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
        ${current.cocktailName || 'Cocktail Specs'}
      </div>
      <div style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.4;">
        ${current.prompt}
      </div>
    </div>

    <!-- Options Grid (Zero typing, 1-tap touch answers) -->
    <div style="display: flex; flex-direction: column; gap: 8px;" id="quizOptionsList">
      ${(current.options || []).map((opt, idx) => `
        <button class="bottle-item-card in-stock" data-quiz-opt="${idx}" style="cursor: pointer; padding: 14px; text-align: left;">
          <span style="font-weight: 700; font-size: 14px; color: var(--text-primary);">${opt.text || opt}</span>
        </button>
      `).join('')}
    </div>
  `;

  document.getElementById('exitQuizBtn').onclick = () => {
    soundEffects.playClick();
    quizEngine.state = 'hub';
    renderAcademyHub();
  };

  elements.academyContainer.querySelectorAll('[data-quiz-opt]').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-quiz-opt'), 10);
      const isCorrect = quizEngine.submitAnswer(idx);
      if (isCorrect) {
        soundEffects.playChime();
        btn.style.background = 'var(--status-ready-bg)';
        btn.style.borderColor = 'var(--status-ready)';
        showToast('✓ Spot On!');
      } else {
        soundEffects.playShaker();
        btn.style.background = 'rgba(239, 68, 68, 0.2)';
        btn.style.borderColor = '#EF4444';
        showToast('✕ Refresher needed!');
      }
      setTimeout(() => {
        if (quizEngine.state === 'question') {
          renderActiveQuizQuestion();
        } else {
          renderAcademyHub();
        }
      }, 900);
    };
  });
}

// ============================================================================
// BARTENDER FOCUS HUD (Full Screen Mixing View)
// ============================================================================
export function openBartenderHUD(recipe) {
  state.activeModalRecipe = recipe;
  state.activeMultiplier = 1;
  state.activeSubstitutions = {};

  // If any ingredient is missing and has an in-stock substitution, pre-select it
  const inStockIds = inventoryManager.getInStockIngredientIds();
  const allSubs = getSubstitutionsForRecipe(recipe, inStockIds);
  const autoSubs = allSubs.filter(s => s.isOriginalMissing && s.substituteInStock);
  autoSubs.forEach(s => {
    state.activeSubstitutions[s.originalIngredientId] = s.substituteIngredientId;
  });

  wakeLockManager.requestWakeLock();
  renderBartenderHUDContent();
  elements.hudModalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeBartenderHUD() {
  if (state.activeTimer) {
    state.activeTimer.stop();
    state.activeTimer = null;
  }
  wakeLockManager.releaseWakeLock();
  elements.hudModalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  state.activeModalRecipe = null;
}

function renderBartenderHUDContent() {
  const recipe = state.activeModalRecipe;
  if (!recipe) return;

  const inStockIds = inventoryManager.getInStockIngredientIds();
  const allIngredients = inventoryManager.getAllIngredients();
  const ingNameMap = new Map(allIngredients.map(i => [i.id, i.name]));

  // Apply active substitutions to ingredients
  const scaledIngredients = recipe.ingredients.map(ing => {
    let effectiveIng = { ...ing };
    const subTargetId = state.activeSubstitutions[ing.id];
    if (subTargetId) {
      const subName = ingNameMap.get(subTargetId) || subTargetId;
      effectiveIng.name = `${subName} (Sub for ${ing.name})`;
      effectiveIng.subbed = true;
      effectiveIng.effectiveId = subTargetId;
    } else {
      effectiveIng.effectiveId = ing.id;
    }
    const scaled = scaleIngredient(effectiveIng, state.activeMultiplier, state.activeUnit);
    scaled.effectiveId = effectiveIng.effectiveId;
    scaled.isSubbed = !!effectiveIng.subbed;
    return scaled;
  });

  const batchMetrics = calculateBatchMetrics(scaledIngredients, state.activeMultiplier);

  // Available in-stock substitutions for this recipe
  const allSubs = getSubstitutionsForRecipe(recipe, inStockIds);
  const viableSubs = allSubs.filter(s => s.substituteInStock);

  let substitutionsHtml = '';
  if (viableSubs.length > 0) {
    substitutionsHtml = `
      <div class="hud-substitution-card">
        <div class="hud-sub-header">
          <span>🔄 Smart Substitutions</span>
          <span class="hud-sub-badge">${viableSubs.length} Available</span>
        </div>
        <div class="hud-sub-options-list">
          ${viableSubs.map(s => {
            const isChecked = state.activeSubstitutions[s.originalIngredientId] === s.substituteIngredientId;
            return `
              <label class="hud-sub-toggle-item ${isChecked ? 'active' : ''}">
                <input type="checkbox" data-sub-orig="${s.originalIngredientId}" data-sub-target="${s.substituteIngredientId}" ${isChecked ? 'checked' : ''}>
                <div class="hud-sub-item-details">
                  <div class="hud-sub-item-title">
                    Use <strong>${s.substituteName}</strong> instead of ${s.originalIngredientName}
                  </div>
                  ${s.notes ? `<div class="hud-sub-item-note">${s.notes}</div>` : ''}
                </div>
              </label>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Ratio stack rows
  const ratioRowsHtml = scaledIngredients.map(ing => {
    const inStock = inStockIds.has(ing.effectiveId);
    return `
      <div class="ratio-row-item ${ing.isSubbed ? 'subbed' : ''}">
        <div class="ratio-amount-name">
          <span class="ratio-amt">${ing.displayText}</span>
          <span class="ratio-name">${ing.name}</span>
        </div>
        <button class="stock-toggle-switch ${inStock ? 'in-stock' : 'out-stock'}" data-hud-stock="${ing.effectiveId}">
          ${inStock ? '✓ Stocked' : '✕ Out'}
        </button>
      </div>
    `;
  }).join('');

  // Step cards
  const stepsHtml = (recipe.instructions || []).map((step, idx) => `
    <div class="hud-step-card">
      <span class="hud-step-idx">${idx + 1}.</span>
      <span>${step}</span>
    </div>
  `).join('');

  elements.hudModalSheet.innerHTML = `
    <div class="hud-sheet-header">
      <div>
        <div style="font-family: var(--font-serif); font-size: 22px; font-weight: 700; color: var(--text-primary);">
          ${recipe.name}
        </div>
        <div style="font-size: 12px; color: var(--text-muted);">${recipe.category}</div>
      </div>
      <button class="hud-close-x" id="hudCloseBtn">✕</button>
    </div>

    <!-- Spec Metadata Strip -->
    <div class="spec-metadata-strip">
      <span class="spec-meta-pill">🍸 ${recipe.glass}</span>
      <span class="spec-meta-pill">🧊 ${recipe.ice}</span>
      <span class="spec-meta-pill">⚡ ${recipe.method}</span>
      ${batchMetrics ? `<span class="spec-meta-pill">⚖️ ~${batchMetrics.abv}% ABV • +${batchMetrics.dilutionPct}% Dilution</span>` : ''}
    </div>

    ${substitutionsHtml}

    <!-- Scaler Multiplier Controls -->
    <div class="hud-scaler-box">
      <span style="font-size: 12.5px; font-weight: 700; color: var(--text-secondary);">Batch Scaler:</span>
      <div class="scaler-pills">
        <button class="scaler-pill-btn ${state.activeMultiplier === 1 ? 'active' : ''}" data-scale="1">1x</button>
        <button class="scaler-pill-btn ${state.activeMultiplier === 2 ? 'active' : ''}" data-scale="2">2x</button>
        <button class="scaler-pill-btn ${state.activeMultiplier === 4 ? 'active' : ''}" data-scale="4">4x</button>
        <button class="scaler-pill-btn ${state.activeMultiplier === 8 ? 'active' : ''}" data-scale="8">8x Pitcher</button>
      </div>
    </div>

    <!-- Jigger Ratio Stack -->
    <div class="ratio-stack-vessel">
      <div class="ratio-stack-title">Measured Pour Spec</div>
      ${ratioRowsHtml}
    </div>

    <!-- Precision Acoustic Shake/Stir Timer -->
    <div class="hud-timer-card">
      <div>
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-secondary);">
          ${recipe.method.toLowerCase().includes('stir') ? 'Stirring Timer' : 'Chilling Shake Timer'}
        </div>
        <div class="hud-timer-num" id="hudTimerDisplay">
          ${recipe.timer ? (recipe.timer.seconds || 15) : (recipe.method.toLowerCase().includes('stir') ? 35 : 12)}s
        </div>
      </div>
      <button class="hud-timer-btn" id="hudTimerStartBtn">Start Timer ▶</button>
    </div>

    <!-- Preparation Step Cards -->
    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-secondary); margin-bottom: 8px;">
      Directions
    </div>
    <div class="hud-step-list">
      ${stepsHtml}
    </div>

    <!-- Quick Riff Button -->
    <button class="deck-btn-mix" id="hudRiffBtn" style="width: 100%; margin-top: 10px; background: var(--bg-surface-elevated); color: var(--text-primary); border: 1px solid var(--border-glass-active);">
      <span>🎨 Open in Craft Lab (Riff This Drink)</span>
    </button>
  `;

  // Attach HUD Listeners
  document.getElementById('hudCloseBtn').onclick = closeBartenderHUD;

  // Substitutions checkboxes
  elements.hudModalSheet.querySelectorAll('input[data-sub-orig]').forEach(checkbox => {
    checkbox.onchange = () => {
      soundEffects.playClick();
      const origId = checkbox.getAttribute('data-sub-orig');
      const targetId = checkbox.getAttribute('data-sub-target');
      if (checkbox.checked) {
        state.activeSubstitutions[origId] = targetId;
        showToast('Applied substitute pour');
      } else {
        delete state.activeSubstitutions[origId];
        showToast('Restored standard pour');
      }
      renderBartenderHUDContent();
    };
  });

  // Multiplier pills
  elements.hudModalSheet.querySelectorAll('.scaler-pill-btn').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      state.activeMultiplier = parseInt(btn.getAttribute('data-scale'), 10);
      renderBartenderHUDContent();
    };
  });

  // Stock toggles inside HUD
  elements.hudModalSheet.querySelectorAll('[data-hud-stock]').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      const id = btn.getAttribute('data-hud-stock');
      inventoryManager.toggleStock(id);
      renderBartenderHUDContent();
      renderBarHub();
    };
  });

  // Riff Button inside HUD
  const riffBtn = document.getElementById('hudRiffBtn');
  if (riffBtn) {
    riffBtn.onclick = () => {
      soundEffects.playClick();
      closeBartenderHUD();
      openCraftLabModal(recipe);
    };
  }

  // Setup Timer
  const timerStartBtn = document.getElementById('hudTimerStartBtn');
  const timerDisplay = document.getElementById('hudTimerDisplay');
  const initialSec = recipe.timer ? (recipe.timer.seconds || 15) : (recipe.method.toLowerCase().includes('stir') ? 35 : 12);

  const timer = new CocktailTimer({
    totalSeconds: initialSec,
    phaseName: 'Chilling & Dilution',
    onTick: (rem) => {
      timerDisplay.textContent = `${rem}s`;
    },
    onComplete: () => {
      soundEffects.playChime();
      timerDisplay.textContent = 'Ready! Strain.';
      timerStartBtn.textContent = 'Done ✓';
    }
  });
  state.activeTimer = timer;

  timerStartBtn.onclick = () => {
    soundEffects.playClick();
    if (!timer.isRunning) {
      timer.start();
      timerStartBtn.textContent = 'Pause ❚❚';
    } else {
      timer.pause();
      timerStartBtn.textContent = 'Resume ▶';
    }
  };
}

// ============================================================================
// GUEST PARTY MODE (Digital Host Menu)
// ============================================================================
function openPartyMode() {
  state.partyModeActive = true;
  const analyzed = analyzeRecipesAvailability();
  // Filter for ONLY 100% in-stock drinks for guests
  const readyDrinks = analyzed.filter(a => a.canMake);

  elements.partyModeContainer.innerHTML = `
    <button class="party-exit-btn" id="exitPartyBtn">✕ Exit Host Mode</button>
    <div class="party-menu-header">
      <div class="party-menu-title">Tonight at the Bar</div>
      <div class="party-menu-sub">Tap any drink to request a pour</div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 14px; max-width: 480px; margin: 0 auto; width: 100%;">
      ${readyDrinks.length === 0 ? `
        <div style="text-align: center; color: var(--text-muted); padding: 40px 0;">
          No drinks currently 100% in stock. Restock bottles in The Backbar to populate your guest menu!
        </div>
      ` : readyDrinks.slice(0, 10).map(d => `
        <div class="catalog-card" style="padding: 18px;" data-order-drink="${d.recipe.name}">
          <div>
            <div style="font-family: var(--font-serif); font-size: 19px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
              ${d.recipe.name}
            </div>
            <div style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.45;">
              ${d.recipe.ingredients.map(i => i.name).join(' • ')}
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <span style="font-size: 11.5px; color: var(--accent-amber);">${d.recipe.glass}</span>
            <button class="hud-btn" style="background: var(--accent-amber); color: #0B0B0E;">I'll Have This →</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  elements.partyModeOverlay.classList.add('active');

  document.getElementById('exitPartyBtn').onclick = () => {
    soundEffects.playClick();
    elements.partyModeOverlay.classList.remove('active');
    state.partyModeActive = false;
  };

  elements.partyModeContainer.querySelectorAll('[data-order-drink]').forEach(card => {
    card.onclick = () => {
      const name = card.getAttribute('data-order-drink');
      soundEffects.playChime();
      showToast(`🎉 Order Placed: 1x ${name}! The bartender is crafting it.`);
    };
  });
}

// ============================================================================
// THE CRAFT LAB (Riff Workbench & Custom Drink Studio)
// ============================================================================
function openCraftLabModal(sourceRecipe = null) {
  const isRiff = Boolean(sourceRecipe);
  const title = isRiff ? `🎨 Riff Studio: ${sourceRecipe.name}` : '🧪 Craft Lab: New Creation';

  let initialName = isRiff ? `${sourceRecipe.name} (Riff)` : '';
  let initialCategory = isRiff ? sourceRecipe.category : 'Spirit-Forward & Stirred';
  let initialGlass = isRiff ? sourceRecipe.glass : 'Coupe';

  elements.craftLabModalSheet.innerHTML = `
    <div class="hud-sheet-header">
      <div style="font-family: var(--font-serif); font-size: 20px; font-weight: 700; color: var(--text-primary);">
        ${title}
      </div>
      <button class="hud-close-x" id="craftLabCloseBtn">✕</button>
    </div>

    <!-- Smart Whisperer Insight -->
    <div style="background: rgba(245, 166, 35, 0.08); border-left: 3px solid var(--accent-amber); padding: 10px 14px; border-radius: 0 8px 8px 0; margin-bottom: 16px;">
      <div style="font-size: 11px; font-weight: 800; color: var(--accent-amber); text-transform: uppercase;">
        💡 Mixologist Whisperer
      </div>
      <div style="font-size: 12.5px; color: var(--text-primary); margin-top: 2px;">
        ${isRiff ? `Riffing preserves the canonical baseline. Your custom ratios will be saved as an independent creation!` : `Experiment with ratios (2:1:1 sour or 2:1 Manhattan ratio) and tag flavor profiles.`}
      </div>
    </div>

    <form id="craftLabForm" style="display: flex; flex-direction: column; gap: 14px;">
      <div>
        <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px; display: block;">Cocktail Name</label>
        <input type="text" id="labDrinkName" class="atelier-search-input" value="${initialName}" placeholder="e.g. Smoky Mezcal Negroni" required>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px; display: block;">Category</label>
          <select id="labCategory" class="atelier-search-input" style="padding-right: 12px;">
            <option value="Spirit-Forward & Stirred" ${initialCategory === 'Spirit-Forward & Stirred' ? 'selected' : ''}>Spirit-Forward</option>
            <option value="Acid-Driven Sours & Smashes" ${initialCategory === 'Acid-Driven Sours & Smashes' ? 'selected' : ''}>Sours & Smashes</option>
            <option value="Equal-Parts & Modern Classics" ${initialCategory === 'Equal-Parts & Modern Classics' ? 'selected' : ''}>Equal-Parts</option>
            <option value="Highballs & Spritzes" ${initialCategory === 'Highballs & Spritzes' ? 'selected' : ''}>Highballs</option>
            <option value="Custom & Riffs" selected>Custom & Riffs</option>
          </select>
        </div>
        <div>
          <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px; display: block;">Glassware</label>
          <select id="labGlass" class="atelier-search-input" style="padding-right: 12px;">
            <option value="Coupe" ${initialGlass.includes('Coupe') ? 'selected' : ''}>Coupe</option>
            <option value="Rocks Glass" ${initialGlass.includes('Rocks') ? 'selected' : ''}>Rocks</option>
            <option value="Highball" ${initialGlass.includes('Highball') ? 'selected' : ''}>Highball</option>
            <option value="Nick & Nora" ${initialGlass.includes('Nick') ? 'selected' : ''}>Nick & Nora</option>
          </select>
        </div>
      </div>

      <button type="submit" class="deck-btn-mix" style="margin-top: 10px;">
        <span>Save Creation to Book 💾</span>
      </button>
    </form>
  `;

  elements.craftLabModalOverlay.classList.add('active');

  document.getElementById('craftLabCloseBtn').onclick = () => {
    elements.craftLabModalOverlay.classList.remove('active');
  };

  document.getElementById('craftLabForm').onsubmit = (e) => {
    e.preventDefault();
    soundEffects.playChime();
    const name = document.getElementById('labDrinkName').value.trim();
    const category = document.getElementById('labCategory').value;
    const glass = document.getElementById('labGlass').value;

    const baseIngs = sourceRecipe ? sourceRecipe.ingredients : [
      { id: 'bourbon', name: 'Bourbon', amount: 2, unit: 'oz' },
      { id: 'sweet-vermouth', name: 'Sweet Vermouth', amount: 0.75, unit: 'oz' }
    ];

    const customDrink = {
      name,
      category,
      glass,
      ice: sourceRecipe ? sourceRecipe.ice : 'Large Clear Ice Cube',
      method: sourceRecipe ? sourceRecipe.method : 'Stirred with Ice & Strained',
      ingredients: baseIngs,
      instructions: sourceRecipe ? sourceRecipe.instructions : ['Stir with dense ice for 30s. Strain into chilled glass.'],
      isRiff,
      parentRecipeId: sourceRecipe ? sourceRecipe.id : null,
      riffParentName: sourceRecipe ? sourceRecipe.name : null,
      tags: ['Custom', 'Riff']
    };

    inventoryManager.addCustomRecipe(customDrink);
    elements.craftLabModalOverlay.classList.remove('active');
    showToast(`Saved "${name}" to your Cocktail Book!`);
    renderBarHub();
  };
}

// ============================================================================
// Event Listeners & Hub Switching
// ============================================================================
function setupEventListeners() {
  // Bottom Navigation Hub Switcher
  elements.bottomNav.querySelectorAll('.nav-hub-btn').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      const targetHub = btn.getAttribute('data-hub');
      switchHub(targetHub);
    };
  });

  // Unit Toggle
  elements.unitToggleBtn.onclick = () => {
    soundEffects.playClick();
    state.activeUnit = state.activeUnit === 'oz' ? 'ml' : 'oz';
    elements.unitToggleBtn.textContent = state.activeUnit;
    localStorage.setItem('barcraft_unit', state.activeUnit);
    showToast(`Units set to ${state.activeUnit}`);
    renderBarHub();
  };
  elements.unitToggleBtn.textContent = state.activeUnit;

  // Host Mode Button
  elements.hostModeBtn.onclick = () => {
    soundEffects.playClick();
    openPartyMode();
  };

  // Search input
  elements.atelierSearchInput.oninput = (e) => {
    state.searchQuery = e.target.value;
    elements.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    renderBarHub();
  };

  elements.clearSearchBtn.onclick = () => {
    soundEffects.playClick();
    state.searchQuery = '';
    elements.atelierSearchInput.value = '';
    elements.clearSearchBtn.style.display = 'none';
    renderBarHub();
  };

  // Mood Chips
  elements.moodCarousel.querySelectorAll('.mood-chip').forEach(chip => {
    chip.onclick = () => {
      soundEffects.playClick();
      const mood = chip.getAttribute('data-mood');
      state.activeMood = mood;
      state.deckIndex = 0;
      renderBarHub();
    };
  });

  // Readiness Filter Pills
  elements.readinessPillsRow.querySelectorAll('.readiness-pill').forEach(pill => {
    pill.onclick = () => {
      soundEffects.playClick();
      state.readinessFilter = pill.getAttribute('data-readiness');
      state.deckIndex = 0;
      renderBarHub();
    };
  });

  // View Mode Switcher (Deck vs Grid)
  elements.viewModeDeckBtn.onclick = () => {
    soundEffects.playClick();
    state.barViewMode = 'deck';
    elements.viewModeDeckBtn.classList.add('active');
    elements.viewModeGridBtn.classList.remove('active');
    renderBarHub();
  };

  elements.viewModeGridBtn.onclick = () => {
    soundEffects.playClick();
    state.barViewMode = 'grid';
    elements.viewModeGridBtn.classList.add('active');
    elements.viewModeDeckBtn.classList.remove('active');
    renderBarHub();
  };

  // Floating Action Button (Craft Lab)
  elements.craftLabFab.onclick = () => {
    soundEffects.playClick();
    openCraftLabModal();
  };

  // Modal Overlay Click outside to close
  elements.hudModalOverlay.onclick = (e) => {
    if (e.target === elements.hudModalOverlay) closeBartenderHUD();
  };

  elements.craftLabModalOverlay.onclick = (e) => {
    if (e.target === elements.craftLabModalOverlay) {
      elements.craftLabModalOverlay.classList.remove('active');
    }
  };

  // Keyboard Left / Right arrow navigation for Tonight's Pour Deck
  window.addEventListener('keydown', (e) => {
    if (state.activeHub !== 'bar' || state.barViewMode !== 'deck') return;
    if (state.activeModalRecipe || elements.craftLabModalOverlay.classList.contains('active')) return;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextBtn = document.getElementById('deckNextBtn');
      if (nextBtn) nextBtn.click();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevBtn = document.getElementById('deckPrevBtn');
      if (prevBtn) prevBtn.click();
    }
  });

  // Reactive subscription to inventory updates
  inventoryManager.subscribe(() => {
    renderBarHub();
    if (state.activeHub === 'cabinet') renderCabinetHub();
  });
}

function switchHub(hubName) {
  state.activeHub = hubName;

  // Toggle Hub Views
  elements.barHub.style.display = hubName === 'bar' ? 'block' : 'none';
  elements.cabinetHub.style.display = hubName === 'cabinet' ? 'block' : 'none';
  elements.academyHub.style.display = hubName === 'academy' ? 'block' : 'none';

  // Toggle Nav Button Styles
  elements.bottomNav.querySelectorAll('.nav-hub-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-hub') === hubName);
  });

  // Render Target Hub Content
  if (hubName === 'bar') renderBarHub();
  if (hubName === 'cabinet') renderCabinetHub();
  if (hubName === 'academy') renderAcademyHub();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Master Initialization
export function initAtelierApp() {
  initDom();
  setupEventListeners();
  renderBarHub();
}

// Auto-run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAtelierApp);
} else {
  initAtelierApp();
}

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
  partyView: 'menu', // 'menu' | 'orders'
  partyGuestName: '',
  activeTimer: null
};

// Cached DOM Elements
const elements = {};

// Escapes user-entered text for safe use in HTML attributes and content
const escapeAttr = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');


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
  // Show one toast at a time so rapid actions don't stack bubbles over the header
  elements.toastContainer.replaceChildren();
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
    elements.inStockPillCount.textContent = `${inStockIds.size} in stock`;
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
            <span>Glass</span>
            <span class="spec-val">${recipe.glass}</span>
          </div>
          <div class="deck-spec-row">
            <span>Ice</span>
            <span class="spec-val">${recipe.ice}</span>
          </div>
          <div class="deck-spec-row">
            <span>Technique</span>
            <span class="spec-val">${recipe.method}</span>
          </div>
        </div>
        ${recipe.techniqueRule ? `<div class="deck-bar-rule">${recipe.techniqueRule}</div>` : ''}

        <!-- Deck Actions with Prev and Next -->
        <div class="deck-card-actions">
          <button class="deck-btn-nav" id="deckPrevBtn" title="Previous drink (← key or swipe right)" aria-label="Previous drink">‹</button>
          <button class="deck-btn-fav ${isFavorite ? 'active' : ''}" id="deckFavBtn" title="Toggle Favorite" aria-label="Favorite">★</button>
          <button class="deck-btn-mix" id="deckMixBtn">
            <span>Mix This Pour →</span>
          </button>
          <button class="deck-btn-fav want ${isWantToTry ? 'active' : ''}" id="deckWantBtn" title="Want to Try" aria-label="Want to try">🔖</button>
          <button class="deck-btn-nav" id="deckNextBtn" title="Next drink (→ key or swipe left)" aria-label="Next drink">›</button>
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
  const shoppingList = inventoryManager.getShoppingList().filter(i => !i.checked);
  const unlockList = calculateUnlockRecommendations().filter(u => u.unlocksNow.length > 0);

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
        💡 Unlock (${unlockList.length})
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
          <div class="atelier-empty-state">
            Nothing on your ${state.activeShoppingSubtab === 'staples' ? 'staples' : 'wishlist'} list. Mark a bottle out of stock and it lands here automatically.
          </div>
        ` : activeItems.map(item => `
          <div class="shopping-item-row">
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--text-primary);">${item.name}</div>
              <div style="font-size: 11.5px; color: var(--accent-amber);">${item.suggestedPrice || 'Suggested benchmark: $25–$35'}</div>
            </div>
            <div class="shopping-row-actions">
              <button class="hud-btn" data-shop-bump="${item.id}" title="Move to ${state.activeShoppingSubtab === 'staples' ? 'wishlist' : 'staples'}">⇄</button>
              <button class="hud-btn" data-shop-remove="${item.id}" title="Remove from list">✕</button>
              <button class="hud-btn shop-bought-btn" data-shop-check="${item.id}">✓ Bought</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

  } else if (state.activeCabinetSegment === 'unlock') {
    // Unlock Optimizer
    contentHtml = `
      ${unlockList.length === 0 ? `
        <div class="atelier-empty-state">
          No single bottle unlocks a new drink right now. Every recipe you're one bottle away from is already covered.
        </div>
      ` : `
      <div style="margin-bottom: 12px; font-size: 13px; color: var(--text-secondary);">
        Sorted by drink yield. Each of these bottles makes new recipes pourable immediately:
      </div>
      `}
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${unlockList.slice(0, 15).map(u => `
          <div class="bottle-item-card in-stock" style="border-left: 3px solid var(--accent-amber);">
            <div class="bottle-info">
              <span class="bottle-name">${u.name}</span>
              <span class="bottle-meta" style="color: var(--accent-amber); font-weight: 700;">
                Unlocks ${u.unlocksNow.length} new cocktail${u.unlocksNow.length === 1 ? '' : 's'}
              </span>
              <span style="font-size: 11px; color: var(--text-muted);">
                ${u.unlocksNow.map(r => r.name).slice(0, 3).join(', ')}${u.unlocksNow.length > 3 ? ` +${u.unlocksNow.length - 3} more` : ''}
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
      inventoryManager.toggleShoppingItem(id);
      showToast(`Bought and restocked 🎉`);
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
      inventoryManager.moveShoppingItemCategory(id, targetType);
      showToast(`Moved to ${targetType}`);
      renderCabinetHub();
    };
  });

  // Bind Shopping Item Remove
  elements.cabinetContainer.querySelectorAll('[data-shop-remove]').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      inventoryManager.removeShoppingItem(btn.getAttribute('data-shop-remove'));
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
  if (quizEngine.state === 'question' || quizEngine.state === 'feedback') {
    renderAcademyQuestion();
    return;
  }
  if (quizEngine.state === 'scorecard') {
    renderAcademyScorecard();
    return;
  }

  const progress = quizEngine.progress;
  const currentRank = quizEngine.getCurrentRank();
  const nextRank = quizEngine.getNextRank();
  const progressPct = quizEngine.getRankProgressPercent();
  const accuracy = progress.totalAnswered > 0
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
    : 0;

  elements.academyContainer.innerHTML = `
    <div class="academy-hero-card">
      <div class="rank-badge-row">
        <span class="rank-title">${currentRank.icon} ${currentRank.title}</span>
        <span class="streak-pill-academy">Rank ${currentRank.level} / ${RANK_LADDER.length}</span>
      </div>
      <div class="academy-rank-desc">${currentRank.desc}</div>
      <div class="xp-track-bar">
        <div class="xp-fill-bar" style="width: ${progressPct}%;"></div>
      </div>
      <div class="academy-xp-labels">
        <span>${Math.round(progress.xp)} XP</span>
        <span>${nextRank ? `${nextRank.minXp} XP → ${nextRank.title}` : 'Top rank reached'}</span>
      </div>
    </div>

    <div class="academy-stats-row">
      <div class="academy-stat"><span class="academy-stat-val">${progress.roundsPlayed}</span><span class="academy-stat-lbl">Rounds</span></div>
      <div class="academy-stat"><span class="academy-stat-val">${accuracy}%</span><span class="academy-stat-lbl">Accuracy</span></div>
      <div class="academy-stat"><span class="academy-stat-val">${progress.bestStreak}</span><span class="academy-stat-lbl">Best Streak</span></div>
    </div>

    <div class="drill-launcher-grid">
      <button class="drill-launcher-card" data-drill="workout">
        <span class="drill-icon">⚡</span>
        <span class="drill-title">Daily Workout</span>
        <span class="drill-sub">5 mixed drills</span>
      </button>
      <button class="drill-launcher-card" data-drill="masterclass">
        <span class="drill-icon">🏆</span>
        <span class="drill-title">Masterclass</span>
        <span class="drill-sub">10-question certification</span>
      </button>
      <button class="drill-launcher-card drill-launcher-wide" data-drill="build">
        <span class="drill-icon">🍸</span>
        <span class="drill-title">Build the Drink</span>
        <span class="drill-sub">5 rounds assembling specs from the shelf</span>
      </button>
    </div>

    <div class="academy-section-title">📖 The Bartender's Codex</div>
    <div class="codex-list">
      ${MECHANICAL_RULES.map(rule => `
        <details class="codex-item">
          <summary>
            <span class="codex-item-title">${rule.title}</span>
            <span class="hud-pill codex-badge">${rule.badge}</span>
          </summary>
          <div class="codex-item-body">${rule.rule}</div>
        </details>
      `).join('')}
    </div>
  `;

  elements.academyContainer.querySelectorAll('[data-drill]').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      const drill = btn.getAttribute('data-drill');
      if (drill === 'masterclass') {
        quizEngine.startNewRound(10);
      } else if (drill === 'build') {
        quizEngine.startNewRound(5);
        quizEngine.currentRound = quizEngine.currentRound.map(() => quizEngine.generateBuildCocktailQuestion());
        quizEngine.activeQuestion = quizEngine.currentRound[0];
      } else {
        quizEngine.startNewRound(5);
      }
      renderAcademyHub();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  });
}

function renderAcademyQuestion() {
  const q = quizEngine.activeQuestion;
  if (!q) {
    quizEngine.state = 'hub';
    renderAcademyHub();
    return;
  }

  const qNum = quizEngine.currentQuestionIndex + 1;
  const qTotal = quizEngine.currentRound.length;
  const answered = quizEngine.isAnswered;
  const progressPct = Math.round(((qNum - (answered ? 0 : 1)) / qTotal) * 100);

  // Spec preview for "What's Missing?"
  let specHtml = '';
  if (q.type === 'WHATS_MISSING' && q.maskedIngredients) {
    specHtml = `
      <div class="quiz-spec-preview">
        ${q.maskedIngredients.map(i => `
          <div class="quiz-spec-line ${i.isMasked ? 'masked' : ''}">
            <span>${i.amount ? formatAmount(i.amount, state.activeUnit, i.unit) : ''}</span>
            <span>${i.isMasked ? (answered ? i.name : '? ? ?') : i.name}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  let answerHtml = '';
  if (q.type === 'BUILD_COCKTAIL') {
    const selected = quizEngine.selectedBuilderIngredients;
    answerHtml = `
      <div class="quiz-shelf-label">Your shaker: ${selected.size} / ${q.requiredCount}</div>
      <div class="quiz-shelf">
        ${q.shelf.map(item => {
          let cls = selected.has(item.id) ? 'picked' : '';
          if (answered) {
            if (item.isRequired) cls = 'correct';
            else if (selected.has(item.id)) cls = 'incorrect';
          }
          return `<button class="quiz-shelf-btn ${cls}" data-shelf-id="${item.id}" ${answered ? 'disabled' : ''}>${item.icon || ''} ${item.text}</button>`;
        }).join('')}
      </div>
      ${!answered ? `
        <button class="deck-btn-mix quiz-submit-btn" id="quizShakeBtn" ${selected.size === q.requiredCount ? '' : 'disabled'}>
          <span>Shake It 🍸</span>
        </button>
      ` : ''}
    `;
  } else {
    answerHtml = `
      <div class="quiz-options">
        ${(q.options || []).map((opt, idx) => {
          let cls = '';
          if (answered) {
            if (opt.isCorrect) cls = 'correct';
            else if (quizEngine.selectedAnswer === opt) cls = 'incorrect';
          }
          return `
            <button class="quiz-option ${cls}" data-quiz-opt="${idx}" ${answered ? 'disabled' : ''}>
              ${opt.icon ? `<span class="quiz-option-icon">${opt.icon}</span>` : ''}
              <span>${opt.text || opt.name}</span>
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  let feedbackHtml = '';
  if (answered) {
    const isCorrect = q.type === 'BUILD_COCKTAIL'
      ? (quizEngine.selectedBuilderIngredients.size === q.targetIds.size &&
         Array.from(quizEngine.selectedBuilderIngredients).every(id => q.targetIds.has(id)))
      : !!quizEngine.selectedAnswer?.isCorrect;
    feedbackHtml = `
      <div class="quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="quiz-feedback-head">${isCorrect ? '✓ Spot on' : '✕ Not quite'}${isCorrect ? `<span>+25 XP</span>` : ''}</div>
        <div class="quiz-feedback-body">${q.explanation || ''}</div>
      </div>
      <button class="deck-btn-mix quiz-submit-btn" id="quizNextBtn">
        <span>${qNum === qTotal ? 'See Results →' : 'Next Question →'}</span>
      </button>
    `;
  }

  elements.academyContainer.innerHTML = `
    <div class="quiz-hud-row">
      <button class="hud-btn" id="exitQuizBtn">✕ Exit</button>
      <span class="quiz-hud-count">Question ${qNum} of ${qTotal}</span>
      <span class="streak-pill-academy">🔥 ${quizEngine.roundStreak}</span>
    </div>
    <div class="xp-track-bar quiz-progress"><div class="xp-fill-bar" style="width: ${progressPct}%;"></div></div>

    <div class="academy-hero-card quiz-question-card">
      <span class="hud-pill">${q.badge || q.typeName || 'Drill'}</span>
      <div class="quiz-question-title">${q.cocktailName || ''}</div>
      <div class="quiz-question-prompt">${q.prompt}</div>
      ${specHtml}
    </div>

    ${answerHtml}
    ${feedbackHtml}
  `;

  document.getElementById('exitQuizBtn').onclick = () => {
    soundEffects.playClick();
    quizEngine.state = 'hub';
    renderAcademyHub();
  };

  elements.academyContainer.querySelectorAll('[data-quiz-opt]').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-quiz-opt'), 10);
      quizEngine.submitAnswer(q.options[idx]);
      renderAcademyQuestion();
    };
  });

  elements.academyContainer.querySelectorAll('[data-shelf-id]').forEach(btn => {
    btn.onclick = () => {
      quizEngine.toggleBuilderIngredient(btn.getAttribute('data-shelf-id'));
      renderAcademyQuestion();
    };
  });

  const shakeBtn = document.getElementById('quizShakeBtn');
  if (shakeBtn) {
    shakeBtn.onclick = () => {
      quizEngine.submitAnswer(null);
      renderAcademyQuestion();
    };
  }

  const nextBtn = document.getElementById('quizNextBtn');
  if (nextBtn) {
    nextBtn.onclick = () => {
      quizEngine.nextQuestion();
      renderAcademyHub();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    nextBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function renderAcademyScorecard() {
  const total = quizEngine.currentRound.length;
  const score = quizEngine.roundScore;
  const flawless = score === total;
  const rank = quizEngine.getCurrentRank();

  elements.academyContainer.innerHTML = `
    <div class="academy-hero-card quiz-scorecard">
      <div class="quiz-score-icon">${flawless ? '🏆' : score >= total / 2 ? '🍸' : '🧊'}</div>
      <div class="quiz-question-title">${flawless ? 'Flawless Round' : 'Round Complete'}</div>
      <div class="quiz-score-big">${score} / ${total}</div>
      <div class="academy-xp-labels" style="justify-content: center; gap: 16px;">
        <span>+${Math.round(quizEngine.roundXpEarned)} XP earned</span>
        <span>${rank.icon} ${rank.title}</span>
      </div>
    </div>
    ${quizEngine.roundMistakes.length > 0 ? `
      <div class="academy-section-title">Review</div>
      <div class="codex-list">
        ${quizEngine.roundMistakes.map(m => `
          <div class="codex-item open-static">
            <div class="codex-item-title">${m.question.cocktailName || m.question.typeName}</div>
            <div class="codex-item-body">${m.question.explanation || ''}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}
    <div class="quiz-score-actions">
      <button class="deck-btn-nav" id="quizBackBtn">Back to Academy</button>
      <button class="deck-btn-mix" id="quizAgainBtn"><span>Play Again</span></button>
    </div>
  `;

  document.getElementById('quizBackBtn').onclick = () => {
    soundEffects.playClick();
    quizEngine.state = 'hub';
    renderAcademyHub();
  };
  document.getElementById('quizAgainBtn').onclick = () => {
    soundEffects.playClick();
    quizEngine.startNewRound(total);
    renderAcademyHub();
  };
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
  if (!state.partyModeActive) document.body.style.overflow = '';
  state.activeModalRecipe = null;
}

function renderBartenderHUDContent() {
  const recipe = state.activeModalRecipe;
  if (!recipe) return;

  // A re-render replaces the timer display, so stop any timer bound to the old one
  if (state.activeTimer) {
    state.activeTimer.stop();
    state.activeTimer = null;
  }

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

  // ABV & dilution are computed per serving, using whichever bottles are actually being poured
  const effectiveRecipe = {
    ...recipe,
    ingredients: scaledIngredients.map(ing => ({ ...ing, id: ing.effectiveId }))
  };
  const batchMetrics = calculateBatchMetrics(effectiveRecipe, 1);
  const prebatchMetrics = state.activeMultiplier >= 4 ? calculateBatchMetrics(effectiveRecipe, state.activeMultiplier) : null;

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
      ${batchMetrics.calculatedAbv > 0 ? `<span class="spec-meta-pill">⚖️ ~${batchMetrics.calculatedAbv}% ABV after dilution</span>` : ''}
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

    ${prebatchMetrics ? `
      <div class="hud-prebatch-note">
        <strong>Pre-batching ${state.activeMultiplier} servings?</strong> Add ${state.activeUnit === 'ml' ? `${prebatchMetrics.waterToAddMl} ml` : `${prebatchMetrics.waterToAddOz} oz`} of cold water
        (${prebatchMetrics.dilutionRatioPercent}% dilution) and chill instead of ${prebatchMetrics.isStirred ? 'stirring' : 'shaking'} each serving.
        ${prebatchMetrics.freezerSafe ? 'Strong enough to keep in the freezer.' : 'Keep it in the fridge.'}
      </div>
    ` : ''}

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

    <div class="hud-footer-actions">
      <button class="deck-btn-nav" id="hudRiffBtn">🎨 Riff in Craft Lab</button>
      ${recipe.isCustom ? `
        <button class="deck-btn-nav" id="hudEditBtn">✏️ Edit</button>
        <button class="deck-btn-nav hud-delete-btn" id="hudDeleteBtn">Delete</button>
      ` : ''}
    </div>
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

  const editBtn = document.getElementById('hudEditBtn');
  if (editBtn) {
    editBtn.onclick = () => {
      soundEffects.playClick();
      closeBartenderHUD();
      openCraftLabModal(recipe, { editing: true });
    };
  }

  const deleteBtn = document.getElementById('hudDeleteBtn');
  if (deleteBtn) {
    deleteBtn.onclick = () => {
      if (!confirm(`Delete "${recipe.name}" from your cocktail book?`)) return;
      inventoryManager.deleteCustomRecipe(recipe.id);
      closeBartenderHUD();
      showToast(`Deleted "${recipe.name}"`);
      renderBarHub();
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
      timerDisplay.textContent = 'Strain!';
      timerStartBtn.textContent = 'Restart ↺';
    }
  });
  state.activeTimer = timer;

  timerStartBtn.onclick = () => {
    soundEffects.playClick();
    if (!timer.isRunning) {
      if (timer.remainingSeconds <= 0) {
        timer.remainingSeconds = timer.totalSeconds;
        timerDisplay.textContent = `${timer.totalSeconds}s`;
      }
      timer.start();
      timerStartBtn.textContent = 'Pause ❚❚';
    } else {
      timer.pause();
      timerStartBtn.textContent = 'Resume ▶';
    }
  };
}

// ============================================================================
// GUEST PARTY MODE (Digital Host Menu + Order Queue)
// ============================================================================
const PARTY_ORDERS_KEY = 'barcraft_party_orders';

function loadPartyOrders() {
  try {
    const raw = localStorage.getItem(PARTY_ORDERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function savePartyOrders(orders) {
  try {
    localStorage.setItem(PARTY_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn('Could not save party orders', e);
  }
  updateHostBadge();
}

function updateHostBadge() {
  if (!elements.hostModeBtn) return;
  const open = loadPartyOrders().length;
  elements.hostModeBtn.innerHTML = open > 0
    ? `🎉 Host <span class="host-order-badge">${open}</span>`
    : '🎉 Host';
}

function openPartyMode(view = 'menu') {
  state.partyModeActive = true;
  state.partyView = view;
  renderPartyMode();
  elements.partyModeOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePartyMode() {
  elements.partyModeOverlay.classList.remove('active');
  state.partyModeActive = false;
  document.body.style.overflow = '';
}

function renderPartyMode() {
  const orders = loadPartyOrders();
  const view = state.partyView || 'menu';

  const topBar = `
    <div class="party-top-bar">
      <button class="party-exit-btn" id="exitPartyBtn">✕ Exit</button>
      <div class="party-view-toggle">
        <button class="${view === 'menu' ? 'active' : ''}" data-party-view="menu">Guest Menu</button>
        <button class="${view === 'orders' ? 'active' : ''}" data-party-view="orders">Orders${orders.length ? ` (${orders.length})` : ''}</button>
      </div>
    </div>
  `;

  let body = '';
  if (view === 'orders') {
    body = `
      <div class="party-menu-header">
        <div class="party-menu-title">Order Queue</div>
        <div class="party-menu-sub">${orders.length ? 'Oldest first. Mix, then mark served.' : 'No open orders.'}</div>
      </div>
      <div class="party-list">
        ${orders.map((o, idx) => `
          <div class="party-order-row">
            <div class="party-order-num">${idx + 1}</div>
            <div class="party-order-info">
              <div class="party-order-drink">${o.name}</div>
              <div class="party-order-meta">${o.guest ? `${escapeAttr(o.guest)} · ` : ''}${new Date(o.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
            </div>
            <button class="hud-btn" data-order-mix="${o.id}">Mix</button>
            <button class="hud-btn party-served-btn" data-order-served="${o.id}">✓ Served</button>
          </div>
        `).join('')}
      </div>
      ${orders.length > 1 ? `<button class="party-clear-btn" id="clearOrdersBtn">Clear all orders</button>` : ''}
    `;
  } else {
    const ready = analyzeRecipesAvailability().filter(a => a.canMake);
    const byCategory = new Map();
    ready.forEach(d => {
      const cat = d.recipe.category || 'House Pours';
      if (!byCategory.has(cat)) byCategory.set(cat, []);
      byCategory.get(cat).push(d.recipe);
    });

    body = `
      <div class="party-menu-header">
        <div class="party-menu-title">Tonight at the Bar</div>
        <div class="party-menu-sub">Everything here can be poured right now</div>
      </div>
      <label class="party-guest-field">
        <span>Your name</span>
        <input type="text" id="partyGuestName" class="lab-input" placeholder="Optional, so the bartender knows who it's for" value="${escapeAttr(state.partyGuestName || '')}" autocomplete="off">
      </label>
      ${ready.length === 0 ? `
        <div class="atelier-empty-state">No drinks are fully in stock. Restock bottles in The Backbar to build tonight's menu.</div>
      ` : Array.from(byCategory.entries()).map(([cat, recipes]) => `
        <div class="party-category">${cat}</div>
        <div class="party-list">
          ${recipes.map(r => `
            <div class="party-drink-card">
              <div class="party-drink-name">${r.name}</div>
              <div class="party-drink-ings">${r.ingredients.map(i => i.name).join(' · ')}</div>
              <div class="party-drink-foot">
                <span>${r.glass}</span>
                <button class="party-order-btn" data-order-recipe="${r.id}">I'll Have This</button>
              </div>
            </div>
          `).join('')}
        </div>
      `).join('')}
    `;
  }

  elements.partyModeContainer.innerHTML = topBar + `<div class="party-body">${body}</div>`;

  document.getElementById('exitPartyBtn').onclick = () => {
    soundEffects.playClick();
    closePartyMode();
  };

  elements.partyModeContainer.querySelectorAll('[data-party-view]').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      state.partyView = btn.getAttribute('data-party-view');
      renderPartyMode();
      elements.partyModeOverlay.scrollTop = 0;
    };
  });

  const guestInput = document.getElementById('partyGuestName');
  if (guestInput) {
    guestInput.oninput = () => { state.partyGuestName = guestInput.value; };
  }

  elements.partyModeContainer.querySelectorAll('[data-order-recipe]').forEach(btn => {
    btn.onclick = () => {
      const recipe = getAllRecipes().find(r => r.id === btn.getAttribute('data-order-recipe'));
      if (!recipe) return;
      const guest = (state.partyGuestName || '').trim();
      const next = loadPartyOrders();
      next.push({ id: `ord-${Date.now()}`, recipeId: recipe.id, name: recipe.name, guest, at: Date.now() });
      savePartyOrders(next);
      soundEffects.playChime();
      showToast(`🎉 ${guest ? `${guest}'s` : 'Your'} ${recipe.name} is in the queue`);
      btn.textContent = 'Ordered ✓';
      btn.disabled = true;
      setTimeout(() => renderPartyMode(), 1200);
    };
  });

  elements.partyModeContainer.querySelectorAll('[data-order-served]').forEach(btn => {
    btn.onclick = () => {
      soundEffects.playClick();
      savePartyOrders(loadPartyOrders().filter(o => o.id !== btn.getAttribute('data-order-served')));
      renderPartyMode();
    };
  });

  elements.partyModeContainer.querySelectorAll('[data-order-mix]').forEach(btn => {
    btn.onclick = () => {
      const order = loadPartyOrders().find(o => o.id === btn.getAttribute('data-order-mix'));
      const recipe = order && getAllRecipes().find(r => r.id === order.recipeId);
      if (!recipe) {
        showToast('That drink is no longer in your book');
        return;
      }
      soundEffects.playClick();
      openBartenderHUD(recipe);
    };
  });

  const clearBtn = document.getElementById('clearOrdersBtn');
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (!confirm('Clear every open order?')) return;
      savePartyOrders([]);
      renderPartyMode();
    };
  }
}

// ============================================================================
// THE CRAFT LAB (Riff Workbench & Custom Drink Studio)
// ============================================================================
const LAB_CATEGORIES = [
  'Spirit-Forward & Stirred',
  'Acid-Driven Sours & Smashes',
  'Velvety Sours & Meringue',
  'Equal-Parts & Modern Classics',
  'Zero-Proof Mocktails',
  'Custom & Riffs'
];
const LAB_UNITS = ['oz', 'dashes', 'barspoon', 'drops', 'leaves', 'slices', 'berries', 'pinch', 'albumen'];
const LAB_GLASSES = ['Coupe', 'Nick & Nora', 'Rocks Glass', 'Double Rocks Glass', 'Tall Highball Glass', 'Collins Glass', 'Martini Glass', 'Copper Mug', 'Wine Glass'];
const LAB_ICE = ['None (Chilled Glass)', 'Single Large Cube', 'Fresh Ice Packed', 'Crushed Ice', 'Dense Ice Packed to Lip'];
const LAB_METHODS = ['Stir 30s & Strain', 'Hard Shake & Double Strain', 'Shake & Soda Top', 'Dry Shake + Wet Shake', 'Build in Glass', 'Muddle & Shake'];

function labIngredientRowHtml(ing = {}) {
  const unit = ing.unit || 'oz';
  return `
    <div class="lab-ing-row">
      <input type="number" class="lab-input lab-ing-amount" step="0.25" min="0" inputmode="decimal" value="${ing.amount ?? ''}" placeholder="2">
      <select class="lab-input lab-ing-unit">
        ${LAB_UNITS.map(u => `<option value="${u}" ${u === unit ? 'selected' : ''}>${u}</option>`).join('')}
        ${LAB_UNITS.includes(unit) ? '' : `<option value="${escapeAttr(unit)}" selected>${escapeAttr(unit)}</option>`}
      </select>
      <input type="text" class="lab-input lab-ing-name" list="labIngredientOptions" value="${escapeAttr(ing.name)}" placeholder="Ingredient">
      <button type="button" class="lab-ing-remove" title="Remove ingredient">✕</button>
    </div>
  `;
}

function openCraftLabModal(sourceRecipe = null, { editing = false } = {}) {
  const isEdit = editing && sourceRecipe && sourceRecipe.isCustom;
  const isRiff = Boolean(sourceRecipe) && !isEdit;
  const title = isEdit ? `✏️ Edit: ${sourceRecipe.name}` : isRiff ? `🎨 Riff on ${sourceRecipe.name}` : '🧪 New Creation';

  const base = sourceRecipe || {};
  const initialName = isEdit ? base.name : isRiff ? `${base.name} (Riff)` : '';
  const initialCategory = isRiff ? 'Custom & Riffs' : (base.category || 'Custom & Riffs');
  const initialIngredients = base.ingredients && base.ingredients.length
    ? base.ingredients
    : [{ amount: 2, unit: 'oz', name: '' }, { amount: 0.75, unit: 'oz', name: '' }, { amount: 0.75, unit: 'oz', name: '' }];

  const allIngredients = inventoryManager.getAllIngredients();

  elements.craftLabModalSheet.innerHTML = `
    <div class="hud-sheet-header">
      <div class="lab-title">${escapeAttr(title)}</div>
      <button class="hud-close-x" id="craftLabCloseBtn">✕</button>
    </div>

    <div class="lab-whisper">
      <div class="lab-whisper-label">💡 Mixologist Whisperer</div>
      <div>${isRiff
        ? 'The original stays untouched. Your riff saves as its own drink, linked back to the classic.'
        : 'Start from a proven ratio: 2 : ¾ : ¾ for sours, 2 : 1 + bitters for stirred drinks, equal parts for Last Word–style builds.'}</div>
    </div>

    <form id="craftLabForm" class="lab-form" novalidate>
      <label class="lab-field">
        <span class="lab-label">Cocktail Name</span>
        <input type="text" id="labDrinkName" class="lab-input" value="${escapeAttr(initialName)}" placeholder="e.g. Smoky Mezcal Negroni" required>
      </label>

      <div class="lab-grid-2">
        <label class="lab-field">
          <span class="lab-label">Category</span>
          <select id="labCategory" class="lab-input">
            ${LAB_CATEGORIES.map(c => `<option value="${escapeAttr(c)}" ${c === initialCategory ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </label>
        <label class="lab-field">
          <span class="lab-label">Glassware</span>
          <input type="text" id="labGlass" class="lab-input" list="labGlassOptions" value="${escapeAttr(base.glass || 'Coupe')}">
        </label>
        <label class="lab-field">
          <span class="lab-label">Ice</span>
          <input type="text" id="labIce" class="lab-input" list="labIceOptions" value="${escapeAttr(base.ice || 'None (Chilled Glass)')}">
        </label>
        <label class="lab-field">
          <span class="lab-label">Method</span>
          <input type="text" id="labMethod" class="lab-input" list="labMethodOptions" value="${escapeAttr(base.method || 'Stir 30s & Strain')}">
        </label>
      </div>

      <div class="lab-field">
        <span class="lab-label">Spec</span>
        <div id="labIngredientRows" class="lab-ing-list">
          ${initialIngredients.map(labIngredientRowHtml).join('')}
        </div>
        <button type="button" class="lab-add-ing" id="labAddIngBtn">+ Add Ingredient</button>
        <div class="lab-live-metrics" id="labLiveMetrics"></div>
      </div>

      <label class="lab-field">
        <span class="lab-label">Directions <span class="lab-hint">One step per line</span></span>
        <textarea id="labInstructions" class="lab-input lab-textarea" rows="4" placeholder="Stir with ice for 30 seconds.&#10;Strain into a chilled coupe.">${escapeAttr((base.instructions || []).join('\n'))}</textarea>
      </label>

      <label class="lab-field">
        <span class="lab-label">Tasting Note <span class="lab-hint">Optional</span></span>
        <input type="text" id="labNote" class="lab-input" value="${escapeAttr(isEdit ? (base.techniqueRule || '') : '')}" placeholder="What makes this one sing?">
      </label>

      <div class="lab-error" id="labError" hidden></div>

      <button type="submit" class="deck-btn-mix">
        <span>${isEdit ? 'Save Changes' : 'Save to Cocktail Book'}</span>
      </button>
    </form>

    <datalist id="labIngredientOptions">${allIngredients.map(i => `<option value="${escapeAttr(i.name)}"></option>`).join('')}</datalist>
    <datalist id="labGlassOptions">${LAB_GLASSES.map(g => `<option value="${g}"></option>`).join('')}</datalist>
    <datalist id="labIceOptions">${LAB_ICE.map(g => `<option value="${g}"></option>`).join('')}</datalist>
    <datalist id="labMethodOptions">${LAB_METHODS.map(g => `<option value="${g}"></option>`).join('')}</datalist>
  `;

  elements.craftLabModalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  const rowsContainer = document.getElementById('labIngredientRows');
  const metricsEl = document.getElementById('labLiveMetrics');
  const errorEl = document.getElementById('labError');

  const resolveIngredient = (name) => {
    const clean = name.trim();
    const match = allIngredients.find(i => i.name.toLowerCase() === clean.toLowerCase());
    if (match) return { id: match.id, name: match.name };
    // Keep the original spec's id when a riff leaves the name unchanged
    const original = (base.ingredients || []).find(i => i.name.toLowerCase() === clean.toLowerCase());
    if (original) return { id: original.id, name: original.name };
    return { id: clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), name: clean };
  };

  const readIngredients = () => Array.from(rowsContainer.querySelectorAll('.lab-ing-row')).map(row => {
    const name = row.querySelector('.lab-ing-name').value.trim();
    if (!name) return null;
    const amountRaw = parseFloat(row.querySelector('.lab-ing-amount').value);
    const unit = row.querySelector('.lab-ing-unit').value;
    const resolved = resolveIngredient(name);
    const ing = { id: resolved.id, name: resolved.name, unit };
    if (!Number.isNaN(amountRaw)) ing.amount = amountRaw;
    return ing;
  }).filter(Boolean);

  const updateMetrics = () => {
    const ings = readIngredients();
    const liquidOz = ings.filter(i => i.unit === 'oz' && i.amount).reduce((a, i) => a + i.amount, 0);
    if (liquidOz === 0) {
      metricsEl.textContent = '';
      return;
    }
    const metrics = calculateBatchMetrics({
      category: document.getElementById('labCategory').value,
      method: document.getElementById('labMethod').value,
      ingredients: ings
    }, 1);
    const vol = state.activeUnit === 'ml' ? `${Math.round(liquidOz * 29.57)} ml` : `${Math.round(liquidOz * 100) / 100} oz`;
    metricsEl.textContent = `${vol} of liquid${metrics.calculatedAbv > 0 ? ` · ~${metrics.calculatedAbv}% ABV after dilution` : ''}`;
  };

  const bindRow = (row) => {
    row.querySelector('.lab-ing-remove').onclick = () => {
      row.remove();
      updateMetrics();
    };
    row.querySelectorAll('input, select').forEach(el => { el.oninput = updateMetrics; });
  };
  rowsContainer.querySelectorAll('.lab-ing-row').forEach(bindRow);
  document.getElementById('craftLabForm').addEventListener('input', () => { errorEl.hidden = true; });
  document.getElementById('labMethod').oninput = updateMetrics;
  document.getElementById('labCategory').onchange = updateMetrics;
  updateMetrics();

  document.getElementById('labAddIngBtn').onclick = () => {
    soundEffects.playClick();
    rowsContainer.insertAdjacentHTML('beforeend', labIngredientRowHtml({ unit: 'oz' }));
    const row = rowsContainer.lastElementChild;
    bindRow(row);
    row.querySelector('.lab-ing-name').focus();
  };

  const closeLab = () => {
    elements.craftLabModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };
  document.getElementById('craftLabCloseBtn').onclick = closeLab;

  document.getElementById('craftLabForm').onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('labDrinkName').value.trim();
    const ingredients = readIngredients();
    const instructions = document.getElementById('labInstructions').value
      .split('\n').map(line => line.trim()).filter(Boolean);
    const note = document.getElementById('labNote').value.trim();

    if (!name) {
      errorEl.textContent = 'Give your drink a name.';
      errorEl.hidden = false;
      return;
    }
    if (ingredients.length < 2) {
      errorEl.textContent = 'Add at least two ingredients to the spec.';
      errorEl.hidden = false;
      return;
    }

    const drink = {
      name,
      category: document.getElementById('labCategory').value,
      glass: document.getElementById('labGlass').value.trim() || 'Coupe',
      ice: document.getElementById('labIce').value.trim() || 'None (Chilled Glass)',
      method: document.getElementById('labMethod').value.trim() || 'Stir 30s & Strain',
      ingredients,
      instructions: instructions.length ? instructions : ['Combine ingredients with ice, chill, and strain into the prepared glass.'],
      techniqueRule: note
    };

    soundEffects.playChime();
    if (isEdit) {
      inventoryManager.updateCustomRecipe(sourceRecipe.id, drink);
      showToast(`Updated "${name}"`);
    } else {
      inventoryManager.addCustomRecipe({
        ...drink,
        isRiff,
        parentRecipeId: isRiff ? sourceRecipe.id : null,
        riffParentName: isRiff ? sourceRecipe.name : null,
        tags: isRiff ? ['Riff', 'Custom'] : ['Custom'],
        flavor: isRiff ? sourceRecipe.flavor : undefined
      });
      showToast(`Saved "${name}" to your Cocktail Book`);
    }
    closeLab();
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
  const labHeaderBtn = document.getElementById('craftLabHeaderBtn');
  if (labHeaderBtn) {
    labHeaderBtn.onclick = () => {
      soundEffects.playClick();
      openCraftLabModal();
    };
  }

  // Modal Overlay Click outside to close
  elements.hudModalOverlay.onclick = (e) => {
    if (e.target === elements.hudModalOverlay) closeBartenderHUD();
  };

  elements.craftLabModalOverlay.onclick = (e) => {
    if (e.target === elements.craftLabModalOverlay) {
      elements.craftLabModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
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

  if (elements.craftLabFab) elements.craftLabFab.style.display = hubName === 'bar' ? '' : 'none';

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
  updateHostBadge();
  renderBarHub();
}

// Auto-run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAtelierApp);
} else {
  initAtelierApp();
}

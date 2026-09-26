// ============================================================================
// BarCraft Academy: Interactive Mixology Quiz Engine
// Zero-typing interactive formats, gamified ranks, XP progression & animations
// ============================================================================

import { MASTER_RECIPES, INITIAL_INVENTORY, BOTTLE_PRICING_KNOWLEDGE_BASE, MECHANICAL_RULES } from './db.js';
import { soundEffects } from './timers.js';
import { inventoryManager } from './inventory.js';

const STORAGE_KEYS = {
  QUIZ_PROGRESS: 'barcraft_quiz_progress_v2'
};

const RANKS = [
  { level: 1, title: 'Barback', minXp: 0, maxXp: 150, icon: '🧼', desc: 'Learning the tools, glassware, and backbar layout.' },
  { level: 2, title: 'Apprentice Mixologist', minXp: 150, maxXp: 500, icon: '🍋', desc: 'Mastering citrus balance, simple ratios, and proper ice handling.' },
  { level: 3, title: 'Journeyman Bartender', minXp: 500, maxXp: 1200, icon: '🧊', desc: 'Commanding classic formulas, egg white foam science, and stirring precision.' },
  { level: 4, title: 'Head Bartender', minXp: 1200, maxXp: 2500, icon: '🍸', desc: 'Effortlessly dissecting complex Tiki riffs, amari balance, and spirit terroir.' },
  { level: 5, title: 'Master Mixologist', minXp: 2500, maxXp: 99999, icon: '👑', desc: 'True legend of the craft. Encyclopedic cocktail memory and flawless execution.' }
];

export class QuizEngine {
  constructor() {
    this.progress = this.loadProgress();
    this.currentRound = [];
    this.currentQuestionIndex = 0;
    this.roundScore = 0;
    this.roundXpEarned = 0;
    this.roundStreak = 0;
    this.roundMistakes = [];
    this.selectedBuilderIngredients = new Set();
    this.state = 'hub'; // 'hub' | 'question' | 'feedback' | 'scorecard'
    this.activeQuestion = null;
    this.selectedAnswer = null;
    this.isAnswered = false;
  }

  loadProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Could not load quiz progress', e);
    }
    return {
      xp: 0,
      roundsPlayed: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      bestStreak: 0
    };
  }

  saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(this.progress));
    } catch (e) {
      console.error('Failed to save quiz progress', e);
    }
  }

  getCurrentRank() {
    const xp = this.progress.xp;
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (xp >= RANKS[i].minXp) return RANKS[i];
    }
    return RANKS[0];
  }

  getNextRank() {
    const current = this.getCurrentRank();
    const nextIndex = RANKS.findIndex(r => r.level === current.level + 1);
    return nextIndex !== -1 ? RANKS[nextIndex] : null;
  }

  getRankProgressPercent() {
    const current = this.getCurrentRank();
    const next = this.getNextRank();
    if (!next) return 100;
    const range = next.minXp - current.minXp;
    const progress = this.progress.xp - current.minXp;
    return Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
  }

  // Helper: Get visual icon for any ingredient
  getIngredientIcon(item) {
    const name = (typeof item === 'string' ? item : (item?.name || item?.text || '')).toLowerCase();
    const cat = (typeof item === 'object' ? (item?.category || '') : '').toLowerCase();

    if (name.includes('bitter')) return '🪵';
    if (name.includes('lime') || name.includes('lemon') || name.includes('grapefruit') || name.includes('citrus') || name.includes('orange juice')) return '🍋';
    if (name.includes('syrup') || name.includes('sugar') || name.includes('honey') || name.includes('grenadine') || name.includes('agave') || name.includes('orgeat')) return '🍯';
    if (name.includes('egg') || name.includes('cream') || name.includes('milk')) return '🥚';
    if (name.includes('soda') || name.includes('tonic') || name.includes('ginger beer') || name.includes('ale') || name.includes('prosecco') || name.includes('champagne') || name.includes('sparkling') || name.includes('cider')) return '🫧';
    if (name.includes('mint') || name.includes('basil') || name.includes('rosemary') || name.includes('olive') || name.includes('cherry') || name.includes('berry') || name.includes('raspberry') || name.includes('strawberry')) return '🌿';
    if (name.includes('vermouth') || name.includes('campari') || name.includes('aperol') || name.includes('curaçao') || name.includes('curacao') || name.includes('cointreau') || name.includes('maraschino') || name.includes('chartreuse') || name.includes('amaro') || name.includes('liqueur') || name.includes('triple sec') || cat.includes('modifier')) return '🍸';
    if (name.includes('whiskey') || name.includes('bourbon') || name.includes('rye') || name.includes('scotch') || name.includes('rum') || name.includes('gin') || name.includes('tequila') || name.includes('mezcal') || name.includes('vodka') || name.includes('cognac') || name.includes('brandy') || cat.includes('spirit') || cat.includes('base')) return '🥃';
    return '✨';
  }

  // ==========================================================================
  // Question Generators (100% Touch-Driven, Diverse Formats)
  // ==========================================================================

  // Format 1: "What's Missing?" (Fill in the blank spec)
  generateWhatsMissingQuestion() {
    // Select recipe with at least 3 required ingredients
    const validRecipes = MASTER_RECIPES.filter(r => r.ingredients.filter(i => !i.optional).length >= 3);
    const recipe = validRecipes[Math.floor(Math.random() * validRecipes.length)];

    // Pick one required ingredient to hide
    const reqIngredients = recipe.ingredients.filter(i => !i.optional);
    const targetIng = reqIngredients[Math.floor(Math.random() * reqIngredients.length)];

    // Pick 3 distractors from inventory not in recipe
    const recipeIngIds = new Set(recipe.ingredients.map(i => i.id));
    const pool = INITIAL_INVENTORY.filter(i => !recipeIngIds.has(i.id));

    // Prefer distractors of same general category (base vs modifier vs pantry)
    const targetInventoryItem = INITIAL_INVENTORY.find(inv => inv.id === targetIng.id);
    const targetCategory = targetInventoryItem?.category || '';
    let categorizedPool = pool.filter(i => i.category === targetCategory);
    if (categorizedPool.length < 3) categorizedPool = pool;

    const shuffledPool = [...categorizedPool].sort(() => 0.5 - Math.random());
    const distractors = shuffledPool.slice(0, 3).map(i => ({
      id: i.id,
      name: i.name,
      text: i.name,
      icon: this.getIngredientIcon(i),
      isCorrect: false
    }));

    const options = [
      { id: targetIng.id, name: targetIng.name, text: targetIng.name, icon: this.getIngredientIcon(targetIng), isCorrect: true },
      ...distractors
    ].sort(() => 0.5 - Math.random());

    const maskedIngredients = recipe.ingredients.map(i => {
      if (i.id === targetIng.id) {
        return { ...i, isMasked: true };
      }
      return { ...i, isMasked: false };
    });

    return {
      type: 'WHATS_MISSING',
      typeName: "What's Missing?",
      badge: '🧩 Fill the Blank',
      cocktailName: recipe.name,
      recipe,
      targetIng,
      targetIngredient: targetIng,
      maskedIngredients,
      options,
      prompt: `Complete the authentic spec for <strong>${recipe.name}</strong>. Which key ingredient is missing?`,
      explanation: `<strong>${recipe.name}</strong> calls for <strong>${targetIng.amount ? `${targetIng.amount} ${targetIng.unit || 'oz'} ` : ''}${targetIng.name}</strong>. ${recipe.techniqueRule || ''}`
    };
  }

  // Format 2: "Spot the Imposter" (What's Extra?)
  generateWhatsExtraQuestion() {
    const validRecipes = MASTER_RECIPES.filter(r => {
      const req = r.ingredients.filter(i => !i.optional);
      return req.length >= 3 && req.length <= 5;
    });
    const recipe = validRecipes[Math.floor(Math.random() * validRecipes.length)];
    const recipeIngIds = new Set(recipe.ingredients.map(i => i.id));

    // Common fun mixology traps
    const trapMap = {
      'classic-mai-tai': { name: 'Pineapple Juice', category: 'Pantry & Juices', reason: "Authentic 1944 Mai Tai never contains pineapple juice—only rum, lime, curaçao, and orgeat!" },
      'sidecar': { name: 'Sweet Vermouth', category: 'Modifiers & Liqueurs', reason: "The Sidecar is a crisp French sour of Cognac, orange curaçao, and lemon; sweet vermouth belongs in a Metropolitan." },
      'classic-negroni': { name: 'Vodka', category: 'Base Spirits', reason: "The Negroni is equal parts London Dry Gin, sweet vermouth, and Campari. Using vodka turns it into a Camparinha!" },
      'house-old-fashioned': { name: 'Fresh Lime Juice', category: 'Pantry & Juices', reason: "An Old Fashioned is strictly spirit-forward with whiskey, sugar, and bitters. Zero citrus juice!" },
      'aviation': { name: 'Green Chartreuse', category: 'Modifiers & Liqueurs', reason: "Aviation uses sky-blue Crème de Violette and Maraschino. Green Chartreuse belongs in The Last Word!" },
      'cosmopolitan': { name: 'Orange Juice', category: 'Pantry & Juices', reason: "The Cosmopolitan gets its citrus from fresh lime and triple sec with tart cranberry juice—never orange juice." }
    };

    let imposter = null;
    let customReason = '';
    if (trapMap[recipe.id]) {
      const trap = trapMap[recipe.id];
      imposter = {
        id: 'imposter-trap',
        name: trap.name,
        text: trap.name,
        icon: this.getIngredientIcon(trap.name),
        isCorrect: true
      };
      customReason = trap.reason;
    } else {
      const pool = INITIAL_INVENTORY.filter(i => !recipeIngIds.has(i.id));
      const randomFake = pool[Math.floor(Math.random() * pool.length)];
      imposter = {
        id: randomFake.id,
        name: randomFake.name,
        text: randomFake.name,
        icon: this.getIngredientIcon(randomFake),
        isCorrect: true
      };
      customReason = `Real ${recipe.name} does not call for ${randomFake.name}. It relies on the balance of its core authentic ingredients.`;
    }

    const realIngredients = recipe.ingredients.filter(i => !i.optional).map(i => ({
      id: i.id,
      name: i.name,
      text: i.name,
      icon: this.getIngredientIcon(i),
      isCorrect: false
    }));
    const options = [...realIngredients, imposter].sort(() => 0.5 - Math.random());

    return {
      type: 'WHATS_EXTRA',
      typeName: 'Spot the Imposter',
      badge: '🚫 Find the Fake',
      cocktailName: recipe.name,
      recipe,
      imposter,
      options,
      prompt: `A rogue bartender snuck a fake ingredient into <strong>${recipe.name}</strong>! Tap the imposter to bust it:`,
      explanation: `Busted! <strong>${imposter.name}</strong> does NOT belong in a ${recipe.name}! ${customReason}`
    };
  }

  // Format 3: "Bar Crafting Bench" (Tap to select exact 2-4 ingredients)
  generateBuildCocktailQuestion() {
    const validRecipes = MASTER_RECIPES.filter(r => {
      const req = r.ingredients.filter(i => !i.optional);
      return req.length >= 2 && req.length <= 4;
    });
    const recipe = validRecipes[Math.floor(Math.random() * validRecipes.length)];
    const reqIngredients = recipe.ingredients.filter(i => !i.optional);
    const recipeIngIds = new Set(reqIngredients.map(i => i.id));

    // Plausible distractors (4 distractors)
    const pool = INITIAL_INVENTORY.filter(i => !recipeIngIds.has(i.id));
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const distractors = shuffledPool.slice(0, 4).map(i => ({
      id: i.id,
      name: i.name,
      text: i.name,
      icon: this.getIngredientIcon(i),
      isRequired: false
    }));

    const required = reqIngredients.map(i => ({
      id: i.id,
      name: i.name,
      text: i.name,
      icon: this.getIngredientIcon(i),
      isRequired: true
    }));
    const shelf = [...required, ...distractors].sort(() => 0.5 - Math.random());

    return {
      type: 'BUILD_COCKTAIL',
      typeName: 'Bar Crafting Bench',
      badge: '🍸 Build the Drink',
      cocktailName: recipe.name,
      recipe,
      requiredCount: required.length,
      targetIds: recipeIngIds,
      shelf,
      prompt: `Assemble <strong>${recipe.name}</strong> at your station! Tap the exact <strong>${required.length} ingredients</strong> needed:`,
      explanation: `<strong>${recipe.name}</strong> is crafted from: ${reqIngredients.map(i => `<strong>${i.name}</strong>`).join(', ')}. ${recipe.techniqueRule || ''}`
    };
  }

  // Format 4: Glassware, Method & Ice Specs
  generateGlassAndMethodQuestion() {
    const validRecipes = MASTER_RECIPES.filter(r => r.glass && r.method);
    const recipe = validRecipes[Math.floor(Math.random() * validRecipes.length)];

    const isStirred = recipe.method.toLowerCase().includes('stir') || (recipe.category && recipe.category.includes('Stirred'));
    const correctSpec = `${recipe.glass} Glass • ${recipe.ice} • ${isStirred ? 'Stirred' : 'Shaken'}`;

    const fakeGlasses = ['Nick & Nora Glass', 'Highball Glass', 'Coupe Glass', 'Double Rocks Glass'].filter(g => !recipe.glass.includes(g.split(' ')[0]));
    const wrongSpec1 = `${fakeGlasses[0] || 'Coupe Glass'} • ${recipe.ice.includes('None') ? 'Packed Crushed Ice' : 'None (Chilled Glass)'} • ${isStirred ? 'Shaken' : 'Stirred'}`;
    const wrongSpec2 = `${fakeGlasses[1] || 'Copper Mug'} • Cubed Ice • ${isStirred ? 'Shaken' : 'Stirred'}`;

    const options = [
      { text: correctSpec, name: correctSpec, isCorrect: true },
      { text: wrongSpec1, name: wrongSpec1, isCorrect: false },
      { text: wrongSpec2, name: wrongSpec2, isCorrect: false }
    ].sort(() => 0.5 - Math.random());

    return {
      type: 'GLASS_AND_METHOD',
      typeName: 'Glassware & Physics',
      badge: '🧊 Glass & Ice Master',
      cocktailName: recipe.name,
      recipe,
      options,
      prompt: `What is the proper service spec and technique for <strong>${recipe.name}</strong>?`,
      explanation: `<strong>${recipe.name}</strong> calls for a <strong>${recipe.glass}</strong>, served with <strong>${recipe.ice}</strong>, executed via <strong>${recipe.method}</strong>.`
    };
  }

  // Format 5: Bottle Budgeting & Resource Optimization
  generateBudgetingQuestion() {
    const categories = BOTTLE_PRICING_KNOWLEDGE_BASE.categories;
    const cat = categories[Math.floor(Math.random() * categories.length)];

    let prompt = '';
    let options = [];
    let explanation = '';

    if (cat.category.includes('Whiskey')) {
      prompt = 'When shopping for Bourbon or Rye for craft cocktails, what is the single most critical quality indicator?';
      options = [
        { text: 'Target 100+ proof (Bottled-in-Bond) to resist ice melt dilution', isCorrect: true },
        { text: 'Buy the most expensive 80-proof whiskey in a heavy crystal decanter', isCorrect: false },
        { text: 'Whiskey proof does not matter once you add sugar and ice', isCorrect: false }
      ];
      explanation = 'High proof is king! 100+ proof (or barrel-proof) whiskey contains higher alcohol density that withstands melted ice dilution in Old Fashioneds and Manhattans without washing out.';
    } else if (cat.category.includes('Vodka')) {
      prompt = 'What is the optimal budgeting strategy when buying vodka for home cocktails?';
      options = [
        { text: 'Spend $15–$20 on Smirnoff or Stolichnaya; expensive vodkas taste identical in mixed drinks', isCorrect: true },
        { text: 'Always spend $50+ on ultra-luxury French or artisanal vodkas', isCorrect: false },
        { text: 'Vodka requires 15 years of oak barrel aging to taste good', isCorrect: false }
      ];
      explanation = 'By US law, vodka is chemically defined as a neutral spirit without distinctive character. In blind taste tests, $16 vodka performs identically to $60 luxury brands in Espresso Martinis, Mules, and Cosmopolitans.';
    } else if (cat.category.includes('Agave')) {
      prompt = 'What should you ALWAYS look for on the label when buying Tequila for Margaritas & Palomas?';
      options = [
        { text: '"100% de Agave" and additive-free production (Target: $50–$65)', isCorrect: true },
        { text: '"Mixto" (made with 49% industrial cane sugar) to save $5', isCorrect: false },
        { text: 'Gold coloring added to simulate oak aging', isCorrect: false }
      ];
      explanation = 'Always verify "100% de Agave". Mixto tequilas are cut with industrial cane sugar and artificial caramel color that cause headaches and lack real agave terroir.';
    } else if (cat.category.includes('Vermouth')) {
      prompt = 'What is the golden rule of Sweet and Dry Vermouth storage?';
      options = [
        { text: 'Buy 375ml half-bottles and ALWAYS store inside the refrigerator at 38°F', isCorrect: true },
        { text: 'Keep 1-liter bottles at room temperature on the bar cart indefinitely', isCorrect: false },
        { text: 'Vermouth is high-proof distilled liquor that never oxidizes', isCorrect: false }
      ];
      explanation = 'Vermouth is fortified wine, NOT a distilled spirit! Once opened, it begins oxidizing immediately at room temperature. Always buy 375ml half-bottles and keep refrigerated.';
    } else {
      prompt = 'Why is buying pre-bottled simple syrup ($7 for 12 oz) considered poor resource allocation?';
      options = [
        { text: 'You can make 1:1 simple syrup at home in 2 minutes for under $0.20 using cane sugar and warm water', isCorrect: true },
        { text: 'Commercial syrups contain special mixology preservatives you cannot recreate', isCorrect: false },
        { text: 'Simple syrup requires a professional industrial distillery', isCorrect: false }
      ];
      explanation = 'Never buy bottled simple syrup! Shaking equal parts white cane sugar and warm water in a mason jar yields crystal-clear syrup for pennies.';
    }

    options.forEach(o => { o.name = o.text; });

    return {
      type: 'BUDGET_SAVVY',
      typeName: 'Bar Economics',
      badge: '🍾 Spend Savvy',
      cocktailName: cat.category,
      options: options.sort(() => 0.5 - Math.random()),
      prompt,
      explanation
    };
  }

  // ==========================================================================
  // Round Controller
  // ==========================================================================

  startNewRound(questionCount = 5) {
    this.roundScore = 0;
    this.roundXpEarned = 0;
    this.roundStreak = 0;
    this.roundMistakes = [];
    this.currentQuestionIndex = 0;
    this.selectedBuilderIngredients.clear();

    // Generate balanced diverse questions
    const generatorFns = [
      () => this.generateWhatsMissingQuestion(),
      () => this.generateWhatsExtraQuestion(),
      () => this.generateBuildCocktailQuestion(),
      () => this.generateGlassAndMethodQuestion(),
      () => this.generateBudgetingQuestion()
    ];

    // Shuffle and pick
    const shuffledFns = [...generatorFns].sort(() => 0.5 - Math.random());
    this.currentRound = [];
    for (let i = 0; i < questionCount; i++) {
      const fn = shuffledFns[i % shuffledFns.length];
      this.currentRound.push(fn());
    }

    this.activeQuestion = this.currentRound[0];
    this.isAnswered = false;
    this.selectedAnswer = null;
    this.state = 'question';
  }

  submitAnswer(selectedObj) {
    if (this.isAnswered) return null;
    this.isAnswered = true;
    this.selectedAnswer = selectedObj;

    const q = this.activeQuestion;
    let isCorrect = false;

    if (q.type === 'BUILD_COCKTAIL') {
      // Checked via checkBuilderAnswer
      const chosen = Array.from(this.selectedBuilderIngredients);
      const targetIds = q.targetIds;
      isCorrect = chosen.length === targetIds.size && chosen.every(id => targetIds.has(id));
    } else {
      isCorrect = !!selectedObj.isCorrect;
    }

    this.progress.totalAnswered += 1;

    if (isCorrect) {
      this.roundScore += 1;
      this.roundStreak += 1;
      this.progress.totalCorrect += 1;

      if (this.roundStreak > this.progress.bestStreak) {
        this.progress.bestStreak = this.roundStreak;
      }

      // Combo Multiplier: 1x, 1.25x, 1.5x, 2.0x
      const comboMult = this.roundStreak >= 5 ? 2.0 : this.roundStreak >= 3 ? 1.5 : 1.0;
      const baseEarned = 25 * comboMult;
      this.roundXpEarned += baseEarned;
      this.progress.xp += baseEarned;

      soundEffects.playCorrect(this.roundStreak);
    } else {
      this.roundStreak = 0;
      this.roundMistakes.push({
        question: q,
        userSelected: selectedObj
      });
      soundEffects.playIncorrect();
    }

    this.saveProgress();
    this.state = 'feedback';

    return {
      isCorrect,
      streak: this.roundStreak,
      xpEarned: isCorrect ? 25 : 0,
      explanation: q.explanation
    };
  }

  nextQuestion() {
    this.currentQuestionIndex += 1;
    this.selectedBuilderIngredients.clear();
    this.isAnswered = false;
    this.selectedAnswer = null;

    if (this.currentQuestionIndex >= this.currentRound.length) {
      // Round Complete!
      this.state = 'scorecard';
      this.progress.roundsPlayed += 1;

      // Completion bonus:
      let bonusXp = 25;
      if (this.roundScore === this.currentRound.length) bonusXp = 75; // Flawless round!
      this.roundXpEarned += bonusXp;
      this.progress.xp += bonusXp;
      this.saveProgress();

      soundEffects.playFanfare();
    } else {
      this.activeQuestion = this.currentRound[this.currentQuestionIndex];
      this.state = 'question';
    }
  }

  toggleBuilderIngredient(id) {
    if (this.isAnswered) return;
    if (this.selectedBuilderIngredients.has(id)) {
      this.selectedBuilderIngredients.delete(id);
    } else {
      if (this.selectedBuilderIngredients.size < (this.activeQuestion?.requiredCount || 4)) {
        this.selectedBuilderIngredients.add(id);
      }
    }
    soundEffects.playClick();
  }
}

export const quizEngine = new QuizEngine();

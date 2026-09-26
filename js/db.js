// ============================================================================
// BarCraft Master Database
// Pre-populated with User Inventory, Pantry Matrix, Technique Rules & Master Recipes
// ============================================================================

export const BUDGETING_RULES = {
  title: "$200 Base Spirit Rule",
  tiers: [
    {
      tier: "Bottom Tier",
      allocation: "$15 Vodka, $30 White Rum",
      strategy: "Minimal spending. Flavor profile is clean/neutral; money does not scale linearly to taste when mixed with heavy citrus or syrups.",
      benchmarks: ["Stolichnaya / Smirnoff (Vodka)", "Planteray 3 Stars / Probitas (White Rum)"]
    },
    {
      tier: "Mid Tier",
      allocation: "$35 London Dry Gin",
      strategy: "Focus on structural backbone, botanical density, and proof (44–47% ABV) to survive dilution.",
      benchmarks: ["Beefeater", "Tanqueray", "Ford's"]
    },
    {
      tier: "Top Tier",
      allocation: "$55 Bourbon, $65 Tequila Blanco",
      strategy: "Heavy capital allocation. Target barrel proof/high-proof whiskey (100+ proof) and 100% blue agave, traditionally produced (additive-free/tahona-crushed) tequila.",
      benchmarks: ["Wild Turkey 101 / Rare Breed (Bourbon)", "Tequila Ocho / Siete Leguas (Tequila Blanco)"]
    }
  ]
};

export const MECHANICAL_RULES = [
  {
    id: "egg-white-sour",
    title: "Egg White / Foam Sours",
    badge: "15s Dry + 12s Wet",
    rule: "Always execute a 15-second dry shake (no ice) to shear albumen proteins into micro-foam, followed by a violent 10–12 second wet shake with dense ice. Double-strain through a fine-mesh sieve."
  },
  {
    id: "spirit-forward-stirred",
    title: "Spirit-Forward / Stirred (Zero-Citrus)",
    badge: "35s Stir • Never Shake",
    rule: "Zero citrus. Never shake. Stir continuously with solid, dense ice for 30–40 seconds to target 20–25% dilution and sub-freezing chill without aeration."
  },
  {
    id: "highballs-carbonation",
    title: "Highballs & Carbonation",
    badge: "Vertical Barspoon Lift",
    rule: "Pack glassware to the lip with dense ice to minimize surface melt. Top with cold carbonated mixers; pull a barspoon vertically from bottom to top exactly once to preserve CO₂."
  }
];

export const INITIAL_INVENTORY = [
  // Base Spirits
  { id: "bourbon", name: "Bourbon", category: "Base Spirits", inStock: true, benchmark: "Wild Turkey 101 / Rare Breed / Elijah Craig" },
  { id: "rye-whiskey", name: "Rye Whiskey", category: "Base Spirits", inStock: true, benchmark: "Old Overholt / Rittenhouse" },
  { id: "white-rum", name: "White Rum", category: "Base Spirits", inStock: true, benchmark: "Planteray 3 Stars / Probitas" },
  { id: "dark-rum", name: "Dark Rum", category: "Base Spirits", inStock: true, benchmark: "Gosling's Black Seal / Jamaican pot-still" },
  { id: "london-dry-gin", name: "London Dry Gin", category: "Base Spirits", inStock: true, benchmark: "Beefeater / Tanqueray / Ford's" },
  { id: "old-tom-gin", name: "Old Tom Gin", category: "Base Spirits", inStock: true, benchmark: "Hayman's / Ransom" },
  { id: "barrel-rested-gin", name: "Barrel-Rested Gin", category: "Base Spirits", inStock: true, benchmark: "Barr Hill Tom Cat / Bluecoat" },
  { id: "tequila-blanco", name: "Tequila Blanco", category: "Base Spirits", inStock: true, benchmark: "Tequila Ocho / Siete Leguas (100% Blue Agave)" },
  { id: "tequila-reposado", name: "Tequila Reposado", category: "Base Spirits", inStock: true, benchmark: "Tequila Ocho Reposado / Fortaleza" },
  { id: "mezcal", name: "Mezcal", category: "Base Spirits", inStock: true, benchmark: "Del Maguey Vida (Artisanal Espadín)" },
  { id: "vodka", name: "Vodka", category: "Base Spirits", inStock: true, benchmark: "Stolichnaya / Smirnoff (80-proof)" },
  { id: "blended-scotch", name: "Blended Scotch", category: "Base Spirits", inStock: true, benchmark: "Monkey Shoulder / Famous Grouse" },
  { id: "islay-scotch", name: "Islay Scotch", category: "Base Spirits", inStock: true, benchmark: "Laphroaig 10 / Ardbeg 10" },
  { id: "cognac", name: "Cognac", category: "Base Spirits", inStock: true, benchmark: "Pierre Ferrand 1840 / Remy Martin" },
  { id: "pisco", name: "Pisco", category: "Base Spirits", inStock: true, benchmark: "Barsol Quebranta" },
  { id: "applejack", name: "Applejack", category: "Base Spirits", inStock: true, benchmark: "Laird's Bottled in Bond" },

  // Modifiers & Liqueurs
  { id: "luxardo-maraschino", name: "Luxardo Maraschino", category: "Modifiers & Liqueurs", inStock: true, benchmark: "32% ABV, nutty cherry-pit distillate" },
  { id: "sweet-vermouth", name: "Sweet Vermouth", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Cocchi Storico di Torino / Carpano Antica (Keep Refrigerated!)" },
  { id: "dry-vermouth", name: "Dry Vermouth", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Dolin Dry / Noilly Prat" },
  { id: "amaretto", name: "Amaretto", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Disaronno / Lazzaroni" },
  { id: "aperol", name: "Aperol", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Bittersweet orange & gentian aperitivo" },
  { id: "amaro-nonino", name: "Amaro Nonino", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Alpine herb, grappa-based amaro with orange" },
  { id: "dry-curacao", name: "Dry Curacao / Triple Sec", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Pierre Ferrand Dry Curaçao / Cointreau" },
  { id: "st-germain", name: "Elderflower Liqueur (St. Germain)", category: "Modifiers & Liqueurs", inStock: true, benchmark: "St. Germain Elderflower" },
  { id: "averna-amaro", name: "Averna Amaro", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Rich Sicilian amaro" },
  { id: "campari", name: "Campari", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Iconic red bitter aperitivo" },
  { id: "green-chartreuse", name: "Green Chartreuse", category: "Modifiers & Liqueurs", inStock: true, benchmark: "110-proof monastic herbal liqueur" },
  { id: "yellow-chartreuse", name: "Yellow Chartreuse", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Milder, honey-saffron monastic liqueur" },
  { id: "lillet-blanc", name: "Lillet Blanc", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Bordeaux aperitif wine" },
  { id: "licor-43", name: "Licor 43", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Spanish vanilla & citrus botanical liqueur" },
  { id: "tia-maria", name: "Tia Maria / Coffee Liqueur", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Tia Maria / Mr. Black" },
  { id: "cynar", name: "Cynar", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Artichoke & herbal bittersweet amaro" },
  { id: "fernet-branca", name: "Fernet-Branca", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Intensely herbal, menthol-camphor amaro" },
  { id: "absinthe", name: "Absinthe", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Anise/wormwood spirit (for glass rinses)" },
  { id: "creme-de-violette", name: "Crème de Violette", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Rothman & Winter floral violette" },
  { id: "white-creme-de-cacao", name: "White Crème de Cacao", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Clear chocolate liqueur" },
  { id: "benedictine", name: "Bénédictine", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Spiced herbal liqueur" },
  { id: "grand-marnier", name: "Grand Marnier", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Cognac-based bitter orange liqueur" },
  { id: "orgeat", name: "Orgeat Syrup", category: "Modifiers & Liqueurs", inStock: true, benchmark: "Almond, rose water, orange blossom" },

  // Pantry, Syrups & Juices
  { id: "lime-juice", name: "Fresh Lime Juice", category: "Pantry & Juices", inStock: true, benchmark: "Juiced fresh; never bottled" },
  { id: "lemon-juice", name: "Fresh Lemon Juice", category: "Pantry & Juices", inStock: true, benchmark: "Juiced fresh; never bottled" },
  { id: "grapefruit-juice", name: "Fresh Grapefruit Juice", category: "Pantry & Juices", inStock: true, benchmark: "Freshly squeezed ruby red grapefruit" },
  { id: "pineapple-juice", name: "Pineapple Juice", category: "Pantry & Juices", inStock: true, benchmark: "Cold-pressed/unfiltered (bromelain micro-foam)" },
  { id: "simple-syrup", name: "Simple Syrup (1:1)", category: "Syrups", inStock: true, benchmark: "1 part sugar : 1 part water" },
  { id: "brown-simple-syrup", name: "Brown Simple Syrup", category: "Syrups", inStock: true, benchmark: "1:1 demerara / turbinado sugar" },
  { id: "honey-syrup", name: "Honey Syrup (1:1)", category: "Syrups", inStock: true, benchmark: "1:1 wildflower honey and warm water" },
  { id: "agave-syrup", name: "Agave Syrup (1:1)", category: "Syrups", inStock: true, benchmark: "1:1 light/amber agave nectar and water" },
  { id: "raspberry-syrup", name: "Raspberry Syrup / Grenadine", category: "Syrups", inStock: true, benchmark: "Fresh raspberry reduction or real pomegranate grenadine" },
  { id: "honey-ginger-syrup", name: "Honey-Ginger Syrup", category: "Syrups", inStock: true, benchmark: "Simmered fresh ginger root in honey syrup" },
  { id: "maple-syrup", name: "Maple Syrup", category: "Syrups", inStock: true, benchmark: "Grade A dark robust maple syrup" },
  { id: "cold-brew", name: "Cold Brew Coffee", category: "Pantry & Juices", inStock: true, benchmark: "Concentrated smooth cold brew" },
  { id: "heavy-cream", name: "Heavy Cream", category: "Pantry & Juices", inStock: true, benchmark: "Heavy whipping cream" },
  { id: "dry-red-wine", name: "Dry Red Wine", category: "Pantry & Juices", inStock: true, benchmark: "Cabernet Sauvignon, Syrah, or Malbec" },

  // Mixers & Carbonation
  { id: "club-soda", name: "Club Soda", category: "Mixers", inStock: true, benchmark: "High-carbonation soda water (cold)" },
  { id: "ginger-beer", name: "Spicy Ginger Beer", category: "Mixers", inStock: true, benchmark: "Fever-Tree / Reed's Extra Ginger Beer" },

  // Bitters
  { id: "angostura-bitters", name: "Angostura Aromatic Bitters", category: "Bitters", inStock: true, benchmark: "Trinidadian classic aromatic gentian bitters" },
  { id: "australian-bitters", name: "Australian Bitters", category: "Bitters", inStock: true, benchmark: "Botanical spice bitters" },
  { id: "orange-bitters", name: "Orange Bitters", category: "Bitters", inStock: true, benchmark: "Regan's No. 6 or Angostura Orange" },
  { id: "apple-bitters", name: "Apple Bitters", category: "Bitters", inStock: true, benchmark: "Woodsy crisp apple bitters" },
  { id: "peychauds-bitters", name: "Peychaud's Bitters", category: "Bitters", inStock: true, benchmark: "New Orleans anise-forward red bitters" },
  { id: "chocolate-bitters", name: "Chocolate Bitters", category: "Bitters", inStock: true, benchmark: "Scrappy's or Fee Brothers Aztec Chocolate" },
  { id: "blood-orange-bitters", name: "Blood Orange Bitters", category: "Bitters", inStock: true, benchmark: "Citrus floral bitters" },
  { id: "lime-bitters", name: "Lime Bitters", category: "Bitters", inStock: true, benchmark: "Zesty aromatic lime peel bitters" },
  { id: "spicy-bitters", name: "Spicy Bitters", category: "Bitters", inStock: true, benchmark: "Habanero or chili bitters" },

  // Perishables & Produce
  { id: "fresh-eggs", name: "Fresh Eggs (Albumen)", category: "Produce & Perishables", inStock: true, benchmark: "Grade A organic eggs (albumen for foam)" },
  { id: "fresh-strawberries", name: "Fresh Strawberries", category: "Produce & Perishables", inStock: true, benchmark: "Ripe sweet strawberries" },
  { id: "fresh-ginger-root", name: "Fresh Ginger Root", category: "Produce & Perishables", inStock: true, benchmark: "Peeled raw pungent ginger" },
  { id: "fresh-mint", name: "Fresh Mint", category: "Produce & Perishables", inStock: true, benchmark: "Aromatic spearmint leaves" },
  { id: "fresh-cucumber", name: "Fresh Cucumber", category: "Produce & Perishables", inStock: true, benchmark: "Crisp English cucumber" },
  { id: "fresh-raspberries", name: "Fresh Raspberries", category: "Produce & Perishables", inStock: true, benchmark: "Plump fresh raspberries" },
  { id: "fresh-peach", name: "Fresh Peach", category: "Produce & Perishables", inStock: true, benchmark: "Ripe peeled juicy peach" },
  { id: "fresh-basil", name: "Fresh Basil", category: "Produce & Perishables", inStock: true, benchmark: "Sweet Italian Genovese basil" }
];

export const MASTER_RECIPES = [
  // ==========================================
  // THE LOCKED FAVORITES (4)
  // ==========================================
  {
    id: "raspberry-mint-gin-sour",
    name: "The Raspberry Mint Gin Sour",
    category: "Locked Favorites",
    isFavorite: true,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Muddle & Violent Shake",
    techniqueRule: "Muddle fruit & mint gently with syrup to release oils without releasing bitter tannin. Double-strain through a fine-mesh sieve.",
    tags: ["Favorite", "Citrusy", "Fruity", "Gin", "Herbal"],
    flavor: { boozy: 3, sweet: 3, sour: 4, bitter: 1, herbal: 4 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin", amount: 2.0, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.75, unit: "oz" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 0.5, unit: "oz" },
      { id: "fresh-raspberries", name: "Fresh Raspberries", amount: 4, unit: "berries", note: "Muddled (4–5 berries)" },
      { id: "fresh-mint", name: "Fresh Mint", amount: 5, unit: "leaves", note: "Muddled (5–6 leaves)" }
    ],
    instructions: [
      "Add fresh raspberries, mint leaves, and simple syrup to your shaker tin.",
      "Muddle gently into a smooth puree without over-shredding the mint.",
      "Add 2.0 oz London Dry Gin and 0.75 oz fresh lime juice.",
      "Fill shaker with dense ice and shake violently for 12 seconds.",
      "Double-strain through a fine-mesh sieve into a pre-chilled coupe glass."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Violent Shake" }
  },
  {
    id: "the-tropical-dark-sour",
    name: "The Tropical Dark Sour",
    category: "Locked Favorites",
    isFavorite: true,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Bromelain Foam Hard Shake",
    techniqueRule: "Cold-pressed pineapple juice contains bromelain enzyme. Shaking hard for 15–20s creates a luxurious natural micro-foam without egg whites.",
    tags: ["Favorite", "Tropical", "Dark Rum", "Sour", "Foam"],
    flavor: { boozy: 3, sweet: 3, sour: 3, bitter: 1, herbal: 1 },
    ingredients: [
      { id: "dark-rum", name: "Dark Rum", amount: 2.0, unit: "oz" },
      { id: "pineapple-juice", name: "Pineapple Juice", amount: 1.5, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.5, unit: "oz" },
      { id: "agave-syrup", name: "Agave Syrup (1:1)", amount: 0.25, unit: "oz" }
    ],
    instructions: [
      "Combine dark rum, pineapple juice, lime juice, and agave syrup in a shaker tin.",
      "Add solid, dense ice cubes.",
      "Shake hard and aerated for 15–20 seconds to activate the bromelain micro-foam.",
      "Single-strain into a chilled coupe glass to preserve the textured foam head."
    ],
    timer: { type: "shake", seconds: 18, label: "18s Bromelain Shake" }
  },
  {
    id: "the-strawberry-agave-sour",
    name: "The Strawberry Agave Sour",
    category: "Locked Favorites",
    isFavorite: true,
    glass: "Rocks Glass",
    ice: "Large Rock",
    method: "Muddle & Hard Shake",
    techniqueRule: "Muddle strawberries into agave syrup. Double-strain over a single dense clear rock.",
    tags: ["Favorite", "Tequila", "Fruity", "Sour", "Refreshing"],
    flavor: { boozy: 3, sweet: 3, sour: 3, bitter: 1, herbal: 2 },
    ingredients: [
      { id: "tequila-blanco", name: "Tequila Blanco (or Barrel-Rested Gin)", amount: 2.0, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.75, unit: "oz" },
      { id: "agave-syrup", name: "Agave Syrup (1:1)", amount: 0.5, unit: "oz" },
      { id: "fresh-strawberries", name: "Fresh Strawberries", amount: 2, unit: "sliced", note: "Muddled" }
    ],
    instructions: [
      "Slice 2 fresh strawberries and place in the shaker tin with agave syrup.",
      "Muddle thoroughly until juice and pulp infuse with the syrup.",
      "Add 2.0 oz Tequila Blanco (or Barrel-Rested Gin) and 0.75 oz fresh lime juice.",
      "Fill with dense ice and shake hard for 12 seconds.",
      "Double-strain into a rocks glass over a single large clear ice rock."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "elderflower-old-tom-fizz",
    name: "The Elderflower Old Tom Fizz",
    category: "Locked Favorites",
    isFavorite: true,
    glass: "Fizz / Highball Glass",
    ice: "Dense Ice Packed to Lip",
    method: "Shake & Vertical Barspoon Lift",
    techniqueRule: "Pack glassware to lip with dense ice to minimize surface melt. Top with cold club soda and pull barspoon vertically once to preserve carbonation.",
    tags: ["Favorite", "Floral", "Effervescent", "Gin", "Refreshing"],
    flavor: { boozy: 2, sweet: 3, sour: 3, bitter: 2, herbal: 4 },
    ingredients: [
      { id: "old-tom-gin", name: "Old Tom Gin", amount: 1.5, unit: "oz" },
      { id: "st-germain", name: "Elderflower Liqueur (St. Germain)", amount: 0.5, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.75, unit: "oz" },
      { id: "honey-syrup", name: "Honey Syrup (1:1)", amount: 0.25, unit: "oz" },
      { id: "dry-curacao", name: "Dry Curacao / Triple Sec", amount: 0.25, unit: "oz" },
      { id: "angostura-bitters", name: "Angostura Aromatic Bitters", amount: 2, unit: "dashes" },
      { id: "club-soda", name: "Club Soda", amount: 2.0, unit: "oz", note: "Top to fill" }
    ],
    instructions: [
      "Combine Old Tom Gin, St. Germain, lime juice, honey syrup, triple sec, and 2 dashes of bitters in a shaker with ice.",
      "Shake hard for 10 seconds to chill and dilute.",
      "Strain into a chilled fizz/highball glass packed tightly to the lip with dense ice.",
      "Top with cold high-carbonation club soda.",
      "Insert barspoon to the very bottom and pull vertically upward once to integrate without knocking out CO₂."
    ],
    timer: { type: "shake", seconds: 10, label: "10s Fizz Shake" }
  },

  // ==========================================
  // I. SPIRIT-FORWARD & STIRRED (Zero-Citrus Sippers)
  // ==========================================
  {
    id: "house-old-fashioned",
    name: "House Old Fashioned",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Cube",
    method: "Stir 35s Continuously",
    techniqueRule: "Zero citrus juice. Never shake. Stir continuously with solid ice for 35s to hit 20-25% dilution. Express oils of fresh orange peel over glass.",
    tags: ["Spirit-Forward", "Whiskey", "Classic", "Stirred"],
    flavor: { boozy: 5, sweet: 2, sour: 0, bitter: 3, herbal: 2 },
    ingredients: [
      { id: "bourbon", name: "Bourbon (Elijah Craig / WT101)", amount: 2.0, unit: "oz" },
      { id: "brown-simple-syrup", name: "Brown Simple Syrup", amount: 0.5, unit: "oz" },
      { id: "angostura-bitters", name: "Angostura Aromatic Bitters", amount: 2, unit: "dashes" },
      { id: "orange-bitters", name: "Orange Bitters", amount: 2, unit: "dashes" }
    ],
    instructions: [
      "Combine bourbon, brown simple syrup, Angostura, and orange bitters in a mixing glass.",
      "Add solid, dense ice cubes.",
      "Stir smoothly and continuously for 35 seconds.",
      "Strain over a single large rock in a rocks glass.",
      "Express the aromatic essential oils from an orange peel over the rim."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "barrel-rested-honey-old-fashioned",
    name: "Barrel-Rested Honey Old Fashioned",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Cube",
    method: "Stir 35s",
    techniqueRule: "Barrel-rested gin carries wood tannin and botanicals that pair exceptionally with wildflower honey.",
    tags: ["Spirit-Forward", "Gin", "Woodsy", "Stirred"],
    flavor: { boozy: 4, sweet: 2, sour: 0, bitter: 2, herbal: 4 },
    ingredients: [
      { id: "barrel-rested-gin", name: "Barrel-Rested Gin (or Bourbon)", amount: 2.0, unit: "oz" },
      { id: "honey-syrup", name: "Honey Syrup (1:1)", amount: 0.25, unit: "oz" },
      { id: "australian-bitters", name: "Australian Bitters", amount: 2, unit: "dashes" }
    ],
    instructions: [
      "Combine barrel-rested gin, honey syrup, and Australian bitters in a mixing glass with dense ice.",
      "Stir for 35 seconds until chilled and silky.",
      "Strain over a large rock in a rocks glass."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "dark-rum-old-fashioned",
    name: "Dark Rum Old Fashioned",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Rock",
    method: "Stir 30s",
    techniqueRule: "Rich pot-still molasses notes balanced by agave and spice bitters.",
    tags: ["Spirit-Forward", "Dark Rum", "Rich", "Stirred"],
    flavor: { boozy: 4, sweet: 2, sour: 0, bitter: 2, herbal: 2 },
    ingredients: [
      { id: "dark-rum", name: "Dark Rum", amount: 2.0, unit: "oz" },
      { id: "agave-syrup", name: "Agave Syrup (1:1)", amount: 0.15, unit: "oz", note: "1 barspoon" },
      { id: "australian-bitters", name: "Australian / Aromatic Bitters", amount: 2, unit: "dashes" }
    ],
    instructions: [
      "Combine dark rum, 1 barspoon agave syrup, and 2 dashes bitters in a mixing glass.",
      "Add ice and stir for 30 seconds.",
      "Strain over a large rock in a rocks glass."
    ],
    timer: { type: "stir", seconds: 30, label: "30s Stir Timer" }
  },
  {
    id: "improved-whiskey-cocktail",
    name: "Improved Whiskey Cocktail",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Rock",
    method: "Stir 35s",
    techniqueRule: "19th-century classic elevated by dry, nutty Maraschino liqueur and aromatic bitters.",
    tags: ["Spirit-Forward", "Whiskey", "Vintage", "Stirred"],
    flavor: { boozy: 5, sweet: 2, sour: 0, bitter: 3, herbal: 3 },
    ingredients: [
      { id: "rye-whiskey", name: "Rye Whiskey or Bourbon", amount: 2.0, unit: "oz" },
      { id: "luxardo-maraschino", name: "Luxardo Maraschino", amount: 0.15, unit: "oz", note: "1 barspoon" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 0.15, unit: "oz", note: "1 barspoon" },
      { id: "angostura-bitters", name: "Angostura Aromatic Bitters", amount: 2, unit: "dashes" }
    ],
    instructions: [
      "Combine whiskey, maraschino, simple syrup, and bitters in a mixing glass with dense ice.",
      "Stir for 35 seconds to chill and dilute.",
      "Strain over a single large rock in a double old fashioned glass."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "oaxacan-old-fashioned",
    name: "Oaxacan Old Fashioned",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Cube",
    method: "Stir 35s",
    techniqueRule: "Created by Phil Ward at Death & Co. Split base of smoky artisanal mezcal and aged reposado agave.",
    tags: ["Spirit-Forward", "Mezcal", "Tequila", "Smoky", "Stirred"],
    flavor: { boozy: 5, sweet: 2, sour: 0, bitter: 2, herbal: 3 },
    ingredients: [
      { id: "mezcal", name: "Mezcal", amount: 1.5, unit: "oz" },
      { id: "tequila-reposado", name: "Tequila Reposado (or Blanco)", amount: 0.5, unit: "oz" },
      { id: "agave-syrup", name: "Agave Syrup (1:1)", amount: 0.15, unit: "oz", note: "1 barspoon" },
      { id: "lime-bitters", name: "Lime Bitters", amount: 2, unit: "dashes" },
      { id: "angostura-bitters", name: "Angostura Aromatic Bitters", amount: 1, unit: "dash" }
    ],
    instructions: [
      "Combine mezcal, tequila, agave syrup, and bitters in a mixing glass filled with ice.",
      "Stir 35 seconds until well chilled.",
      "Strain over a large cube in a rocks glass.",
      "Express a flamed lime peel over the surface."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "coffee-old-fashioned",
    name: "Coffee Old Fashioned",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Cube",
    method: "Stir 35s",
    techniqueRule: "Rye whiskey backbone balanced by vanilla-citrus Licor 43 and dark coffee.",
    tags: ["Spirit-Forward", "Coffee", "Whiskey", "Dessert Note"],
    flavor: { boozy: 4, sweet: 3, sour: 0, bitter: 3, herbal: 2 },
    ingredients: [
      { id: "rye-whiskey", name: "Rye Whiskey", amount: 1.5, unit: "oz" },
      { id: "licor-43", name: "Licor 43", amount: 0.25, unit: "oz" },
      { id: "tia-maria", name: "Tia Maria / Coffee Liqueur", amount: 0.5, unit: "oz" },
      { id: "cold-brew", name: "Cold Brew Coffee", amount: 0.5, unit: "oz" },
      { id: "chocolate-bitters", name: "Chocolate Bitters", amount: 2, unit: "dashes" },
      { id: "blood-orange-bitters", name: "Blood Orange Bitters", amount: 2, unit: "dashes" }
    ],
    instructions: [
      "Combine rye, Licor 43, coffee liqueur, cold brew, and both bitters in a mixing glass with ice.",
      "Stir for 35 seconds.",
      "Strain over a single large cube in a rocks glass."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "carajillo-old-fashioned",
    name: "Carajillo Old Fashioned",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Rock",
    method: "Stir 30s",
    techniqueRule: "Spanish carajillo riff blending whiskey, cognac warmth, and sweet Licor 43.",
    tags: ["Spirit-Forward", "Whiskey", "Cognac", "Coffee", "Stirred"],
    flavor: { boozy: 4, sweet: 3, sour: 0, bitter: 2, herbal: 1 },
    ingredients: [
      { id: "rye-whiskey", name: "Rye Whiskey", amount: 1.0, unit: "oz" },
      { id: "cognac", name: "Cognac", amount: 0.5, unit: "oz" },
      { id: "licor-43", name: "Licor 43", amount: 0.5, unit: "oz" },
      { id: "tia-maria", name: "Tia Maria / Coffee Liqueur", amount: 0.5, unit: "oz" }
    ],
    instructions: [
      "Combine rye, cognac, Licor 43, and coffee liqueur in a mixing glass with dense ice.",
      "Stir 30 seconds until cold.",
      "Strain over a large ice rock."
    ],
    timer: { type: "stir", seconds: 30, label: "30s Stir Timer" }
  },
  {
    id: "house-manhattan",
    name: "House Manhattan",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Stir 35s",
    techniqueRule: "Grand Marnier adds cognac body and bitter orange depth to the classic 100-proof rye structure.",
    tags: ["Spirit-Forward", "Whiskey", "Vermouth", "Iconic"],
    flavor: { boozy: 5, sweet: 3, sour: 0, bitter: 3, herbal: 3 },
    ingredients: [
      { id: "rye-whiskey", name: "Old Overholt Rye", amount: 2.0, unit: "oz" },
      { id: "grand-marnier", name: "Grand Marnier", amount: 0.5, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth (Cocchi / Carpano)", amount: 0.75, unit: "oz" },
      { id: "angostura-bitters", name: "Angostura Aromatic Bitters", amount: 2, unit: "dashes" }
    ],
    instructions: [
      "Combine rye whiskey, Grand Marnier, sweet vermouth, and Angostura in a mixing glass.",
      "Fill with dense ice and stir continuously for 35 seconds.",
      "Strain into a chilled coupe glass.",
      "Garnish with a brandied Luxardo cherry."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "the-martinez",
    name: "The Martinez",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Stir 35–40s",
    techniqueRule: "The historical progenitor of the Martini. Sweet vermouth meets botanical gin and Maraschino.",
    tags: ["Spirit-Forward", "Gin", "Vermouth", "Vintage"],
    flavor: { boozy: 4, sweet: 3, sour: 0, bitter: 2, herbal: 5 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin (or Old Tom)", amount: 1.5, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth", amount: 1.5, unit: "oz" },
      { id: "luxardo-maraschino", name: "Luxardo Maraschino", amount: 0.15, unit: "oz", note: "1 barspoon" },
      { id: "orange-bitters", name: "Orange Bitters", amount: 2, unit: "dashes" }
    ],
    instructions: [
      "Combine gin, sweet vermouth, maraschino, and orange bitters in a mixing glass with ice.",
      "Stir 35–40 seconds to achieve smooth silky dilution.",
      "Strain into a chilled coupe. Express lemon or orange peel."
    ],
    timer: { type: "stir", seconds: 38, label: "38s Stir Timer" }
  },
  {
    id: "classic-manhattan",
    name: "The Classic Manhattan",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Stir 35s",
    techniqueRule: "2:1 Rye to Sweet Vermouth ratio. Pure classic elegance.",
    tags: ["Spirit-Forward", "Whiskey", "Classic", "Stirred"],
    flavor: { boozy: 5, sweet: 2, sour: 0, bitter: 2, herbal: 3 },
    ingredients: [
      { id: "rye-whiskey", name: "Rye Whiskey", amount: 2.0, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth", amount: 1.0, unit: "oz" },
      { id: "angostura-bitters", name: "Angostura Aromatic Bitters", amount: 2, unit: "dashes" }
    ],
    instructions: [
      "Combine rye, sweet vermouth, and Angostura in a mixing glass with ice.",
      "Stir smoothly for 35 seconds.",
      "Strain into a chilled coupe and garnish with a brandied cherry."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "black-manhattan",
    name: "Black Manhattan",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Stir 35s",
    techniqueRule: "Created by Todd Smith at Bourbon & Branch. Replaces sweet vermouth with bittersweet Italian Amaro Averna.",
    tags: ["Spirit-Forward", "Whiskey", "Amaro", "Bittersweet"],
    flavor: { boozy: 5, sweet: 2, sour: 0, bitter: 4, herbal: 4 },
    ingredients: [
      { id: "rye-whiskey", name: "Rye Whiskey", amount: 2.0, unit: "oz" },
      { id: "averna-amaro", name: "Averna Amaro (or Nonino)", amount: 1.0, unit: "oz" },
      { id: "brown-simple-syrup", name: "Brown Simple Syrup", amount: 0.5, unit: "oz" },
      { id: "angostura-bitters", name: "Angostura Aromatic Bitters", amount: 2, unit: "dashes" },
      { id: "orange-bitters", name: "Orange Bitters", amount: 1, unit: "dash" }
    ],
    instructions: [
      "Combine rye, Averna, brown simple syrup, and bitters in a mixing glass with ice.",
      "Stir 35 seconds until sub-freezing chill is reached.",
      "Strain into a coupe. Garnish with Luxardo cherry."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "the-godfather",
    name: "The Godfather",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Cube",
    method: "Stir in Glass or Mixing Glass",
    techniqueRule: "1970s icon. 4:1 ratio of high-proof Bourbon to sweet almond Amaretto.",
    tags: ["Spirit-Forward", "Bourbon", "Nutty", "Stirred"],
    flavor: { boozy: 5, sweet: 3, sour: 0, bitter: 1, herbal: 1 },
    ingredients: [
      { id: "bourbon", name: "Bourbon", amount: 2.0, unit: "oz" },
      { id: "amaretto", name: "Amaretto", amount: 0.5, unit: "oz" }
    ],
    instructions: [
      "Combine bourbon and amaretto over a single large clear cube in a rocks glass.",
      "Stir for 25 seconds until chilled and integrated."
    ],
    timer: { type: "stir", seconds: 25, label: "25s Stir Timer" }
  },
  {
    id: "lucky-bastard",
    name: "Lucky Bastard",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Large Cube",
    method: "Stir 35s",
    techniqueRule: "Rich demerara brown simple and Carpano Antica botanical weight support 100-proof Rittenhouse rye.",
    tags: ["Spirit-Forward", "Whiskey", "Rich", "Stirred"],
    flavor: { boozy: 5, sweet: 3, sour: 0, bitter: 3, herbal: 3 },
    ingredients: [
      { id: "rye-whiskey", name: "Rittenhouse Rye", amount: 2.0, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth (Carpano Antica)", amount: 0.75, unit: "oz" },
      { id: "brown-simple-syrup", name: "Brown Simple Syrup", amount: 0.5, unit: "oz" },
      { id: "angostura-bitters", name: "Angostura Bitters", amount: 2, unit: "dashes" },
      { id: "orange-bitters", name: "Orange Bitters (Regan's)", amount: 2, unit: "dashes" }
    ],
    instructions: [
      "Stir all ingredients over dense ice in a mixing glass for 35 seconds.",
      "Strain over a large rock and express fresh orange peel."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "angels-and-demons",
    name: "Angels & Demons",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Large Cube",
    method: "Stir 35s",
    techniqueRule: "Dark maple syrup and crisp apple bitters bring an autumn orchard depth to high-rye bourbon.",
    tags: ["Spirit-Forward", "Bourbon", "Maple", "Woodsy"],
    flavor: { boozy: 5, sweet: 3, sour: 0, bitter: 2, herbal: 3 },
    ingredients: [
      { id: "bourbon", name: "Bourbon (Old Grand-Dad / WT101)", amount: 2.0, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth (Carpano Antica)", amount: 0.75, unit: "oz" },
      { id: "maple-syrup", name: "Maple Syrup", amount: 0.15, unit: "oz", note: "1 barspoon" },
      { id: "apple-bitters", name: "Apple Bitters", amount: 2, unit: "dashes" }
    ],
    instructions: [
      "Combine bourbon, vermouth, maple syrup, and apple bitters in a mixing glass.",
      "Stir 35 seconds with ice.",
      "Strain over a large cube in a rocks glass."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "little-italy",
    name: "Little Italy",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Stir 35s",
    techniqueRule: "Audrey Saunders modern classic from Pegu Club. Cynar provides savory vegetal bittersweetness.",
    tags: ["Spirit-Forward", "Whiskey", "Amaro", "Stirred"],
    flavor: { boozy: 5, sweet: 2, sour: 0, bitter: 4, herbal: 4 },
    ingredients: [
      { id: "rye-whiskey", name: "Rye Whiskey", amount: 2.0, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth", amount: 0.75, unit: "oz" },
      { id: "cynar", name: "Cynar", amount: 0.5, unit: "oz" }
    ],
    instructions: [
      "Combine rye, sweet vermouth, and Cynar in a mixing glass with ice.",
      "Stir 35 seconds.",
      "Strain into a chilled coupe. Garnish with a brandied cherry."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "toronto",
    name: "Toronto",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Stir 35s",
    techniqueRule: "Fernet-Branca's bold menthol and saffron cuts through the grain character of rye.",
    tags: ["Spirit-Forward", "Whiskey", "Fernet", "Herbal"],
    flavor: { boozy: 5, sweet: 1, sour: 0, bitter: 5, herbal: 5 },
    ingredients: [
      { id: "rye-whiskey", name: "Rye or Canadian Whisky", amount: 2.0, unit: "oz" },
      { id: "fernet-branca", name: "Fernet-Branca", amount: 0.25, unit: "oz" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 0.25, unit: "oz" },
      { id: "angostura-bitters", name: "Angostura Aromatic Bitters", amount: 2, unit: "dashes" }
    ],
    instructions: [
      "Stir rye, Fernet, simple syrup, and bitters over ice for 35 seconds.",
      "Strain into a chilled coupe. Express orange twist over glass."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "greenpoint",
    name: "Greenpoint",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Stir 35s",
    techniqueRule: "Michael McIlroy (Milk & Honey) Manhattan riff featuring herbal saffron-honey Yellow Chartreuse.",
    tags: ["Spirit-Forward", "Whiskey", "Chartreuse", "Stirred"],
    flavor: { boozy: 5, sweet: 3, sour: 0, bitter: 3, herbal: 4 },
    ingredients: [
      { id: "rye-whiskey", name: "Rye Whiskey", amount: 2.0, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth", amount: 0.5, unit: "oz" },
      { id: "yellow-chartreuse", name: "Yellow Chartreuse", amount: 0.5, unit: "oz" },
      { id: "angostura-bitters", name: "Angostura Aromatic Bitters", amount: 1, unit: "dash" },
      { id: "orange-bitters", name: "Orange Bitters", amount: 1, unit: "dash" }
    ],
    instructions: [
      "Combine rye, vermouth, Yellow Chartreuse, and both bitters in a mixing glass with ice.",
      "Stir 35 seconds.",
      "Strain into a chilled coupe and garnish with lemon twist."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "classic-negroni",
    name: "Classic Negroni",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Fresh Ice / Large Cube",
    method: "Stir 30s",
    techniqueRule: "1:1:1 holy trinity. Botanical gin, bittersweet Campari, and rich Italian sweet vermouth.",
    tags: ["Spirit-Forward", "Gin", "Campari", "Bitter", "Iconic"],
    flavor: { boozy: 4, sweet: 3, sour: 0, bitter: 5, herbal: 4 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin", amount: 1.5, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth", amount: 1.0, unit: "oz" },
      { id: "campari", name: "Campari", amount: 1.0, unit: "oz" }
    ],
    instructions: [
      "Combine gin, sweet vermouth, and Campari in a mixing glass with solid ice.",
      "Stir 30 seconds.",
      "Strain into a rocks glass over fresh ice. Express orange wheel or peel."
    ],
    timer: { type: "stir", seconds: 30, label: "30s Stir Timer" }
  },
  {
    id: "boulevardier",
    name: "Boulevardier",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass or Coupe",
    ice: "Large Rock (if on rocks)",
    method: "Stir 30s",
    techniqueRule: "Erskine Gwynne 1927 classic. Swaps gin for high-proof bourbon, yielding warming caramel and bitter orange harmony.",
    tags: ["Spirit-Forward", "Bourbon", "Campari", "Bitter"],
    flavor: { boozy: 5, sweet: 3, sour: 0, bitter: 4, herbal: 3 },
    ingredients: [
      { id: "bourbon", name: "Bourbon", amount: 1.5, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth", amount: 1.0, unit: "oz" },
      { id: "campari", name: "Campari", amount: 1.0, unit: "oz" }
    ],
    instructions: [
      "Combine bourbon, sweet vermouth, and Campari in a mixing glass with ice.",
      "Stir 30 seconds.",
      "Strain into a chilled coupe or rocks glass over a large rock. Express orange peel."
    ],
    timer: { type: "stir", seconds: 30, label: "30s Stir Timer" }
  },
  {
    id: "old-pal",
    name: "Old Pal",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Stir 30s",
    techniqueRule: "Equal parts spicy rye, crisp dry vermouth, and Campari. Bone-dry and bracingly bitter.",
    tags: ["Spirit-Forward", "Whiskey", "Campari", "Dry", "Bitter"],
    flavor: { boozy: 5, sweet: 1, sour: 0, bitter: 5, herbal: 3 },
    ingredients: [
      { id: "rye-whiskey", name: "Rye Whiskey", amount: 1.0, unit: "oz" },
      { id: "campari", name: "Campari", amount: 1.0, unit: "oz" },
      { id: "dry-vermouth", name: "Dry Vermouth", amount: 1.0, unit: "oz" }
    ],
    instructions: [
      "Stir rye, Campari, and dry vermouth over ice for 30 seconds.",
      "Strain into a chilled coupe with a fresh lemon twist."
    ],
    timer: { type: "stir", seconds: 30, label: "30s Stir Timer" }
  },
  {
    id: "kingston-negroni",
    name: "Kingston Negroni",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Cube",
    method: "Stir 30s",
    techniqueRule: "Created by Joaquín Simó at Death & Co. High-ester Jamaican dark rum withstands Campari with ripe banana and molasses funk.",
    tags: ["Spirit-Forward", "Dark Rum", "Campari", "Funky"],
    flavor: { boozy: 5, sweet: 3, sour: 0, bitter: 5, herbal: 3 },
    ingredients: [
      { id: "dark-rum", name: "Jamaican Dark / Aged Rum", amount: 1.0, unit: "oz" },
      { id: "campari", name: "Campari", amount: 1.0, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth", amount: 1.0, unit: "oz" }
    ],
    instructions: [
      "Stir Jamaican dark rum, Campari, and sweet vermouth with ice for 30 seconds.",
      "Strain over a large ice rock. Express orange peel."
    ],
    timer: { type: "stir", seconds: 30, label: "30s Stir Timer" }
  },
  {
    id: "kingston-sound-system",
    name: "Kingston Sound System",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Stir 30s",
    techniqueRule: "Swaps Campari for Aperol to let the Jamaican pot-still esters take center stage alongside sweet vermouth.",
    tags: ["Spirit-Forward", "Dark Rum", "Aperol", "Aperitivo"],
    flavor: { boozy: 4, sweet: 3, sour: 0, bitter: 3, herbal: 3 },
    ingredients: [
      { id: "dark-rum", name: "Jamaican Rum", amount: 1.0, unit: "oz" },
      { id: "aperol", name: "Aperol", amount: 1.0, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth", amount: 1.0, unit: "oz" }
    ],
    instructions: [
      "Stir rum, Aperol, and sweet vermouth over dense ice for 30 seconds.",
      "Strain into a chilled coupe."
    ],
    timer: { type: "stir", seconds: 30, label: "30s Stir Timer" }
  },
  {
    id: "left-hand",
    name: "Left Hand",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Cube",
    method: "Stir 35s",
    techniqueRule: "Sam Ross creation. Boulevardier variation accented by rich chocolate bitters and brandied cherry.",
    tags: ["Spirit-Forward", "Bourbon", "Chocolate", "Bitter"],
    flavor: { boozy: 5, sweet: 3, sour: 0, bitter: 4, herbal: 3 },
    ingredients: [
      { id: "bourbon", name: "Bourbon", amount: 1.5, unit: "oz" },
      { id: "campari", name: "Campari", amount: 0.75, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth", amount: 0.75, unit: "oz" },
      { id: "chocolate-bitters", name: "Chocolate Bitters", amount: 2, unit: "dashes" }
    ],
    instructions: [
      "Stir bourbon, Campari, sweet vermouth, and chocolate bitters over ice for 35 seconds.",
      "Strain into a rocks glass over a big cube."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "rosita",
    name: "Rosita",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Fresh Ice",
    method: "Stir 30s",
    techniqueRule: "Smoky mezcal or tequila blanco meets Campari and vermouth with a spicy bitter punch.",
    tags: ["Spirit-Forward", "Mezcal", "Campari", "Spicy"],
    flavor: { boozy: 4, sweet: 2, sour: 0, bitter: 4, herbal: 3 },
    ingredients: [
      { id: "mezcal", name: "Mezcal (or Tequila)", amount: 1.0, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth", amount: 1.0, unit: "oz" },
      { id: "campari", name: "Campari", amount: 1.0, unit: "oz" },
      { id: "spicy-bitters", name: "Spicy Bitters", amount: 1, unit: "dash" }
    ],
    instructions: [
      "Stir all ingredients over ice for 30 seconds.",
      "Strain into a rocks glass over fresh ice with an orange twist."
    ],
    timer: { type: "stir", seconds: 30, label: "30s Stir Timer" }
  },
  {
    id: "hanky-panky",
    name: "Hanky Panky",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Stir 35s",
    techniqueRule: "Invented by Ada Coleman at the Savoy Hotel in 1903. 2 dashes of Fernet completely transforms gin and vermouth.",
    tags: ["Spirit-Forward", "Gin", "Fernet", "Savoy Classic"],
    flavor: { boozy: 4, sweet: 2, sour: 0, bitter: 4, herbal: 5 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin", amount: 1.5, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth", amount: 1.5, unit: "oz" },
      { id: "fernet-branca", name: "Fernet-Branca", amount: 2, unit: "dashes" }
    ],
    instructions: [
      "Stir gin, vermouth, and 2 dashes Fernet-Branca with ice for 35 seconds.",
      "Strain into a chilled coupe and express orange peel."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "vieux-carre",
    name: "Vieux Carré",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Cube",
    method: "Stir 35s",
    techniqueRule: "Walter Bergeron 1930s Carousel Bar tribute. Rye spice, rich cognac, herbal Bénédictine, and split bitters.",
    tags: ["Spirit-Forward", "Whiskey", "Cognac", "New Orleans"],
    flavor: { boozy: 5, sweet: 3, sour: 0, bitter: 3, herbal: 4 },
    ingredients: [
      { id: "rye-whiskey", name: "Rye Whiskey", amount: 0.75, unit: "oz" },
      { id: "cognac", name: "Cognac", amount: 0.75, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth", amount: 0.75, unit: "oz" },
      { id: "benedictine", name: "Bénédictine", amount: 0.15, unit: "oz", note: "1 barspoon" },
      { id: "peychauds-bitters", name: "Peychaud's Bitters", amount: 2, unit: "dashes" },
      { id: "angostura-bitters", name: "Angostura Aromatic Bitters", amount: 2, unit: "dashes" }
    ],
    instructions: [
      "Stir rye, cognac, sweet vermouth, Bénédictine, and both bitters over ice for 35 seconds.",
      "Strain over a large rock in a rocks glass. Express lemon peel."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "sazerac",
    name: "Sazerac",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Chilled Old Fashioned Glass",
    ice: "None (Served Neat)",
    method: "Stir & Absinthe Rinse",
    techniqueRule: "Coat a frozen rocks glass with an absinthe rinse and discard excess. Stir rye, simple, and Peychaud's with ice; strain neat.",
    tags: ["Spirit-Forward", "Whiskey", "Absinthe", "New Orleans", "Neat"],
    flavor: { boozy: 5, sweet: 2, sour: 0, bitter: 3, herbal: 4 },
    ingredients: [
      { id: "rye-whiskey", name: "Old Overholt Rye", amount: 2.0, unit: "oz" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 0.5, unit: "oz" },
      { id: "peychauds-bitters", name: "Peychaud's Bitters", amount: 4, unit: "dashes" },
      { id: "absinthe", name: "Absinthe", amount: 0.25, unit: "oz", note: "Glass rinse" }
    ],
    instructions: [
      "Swirl absinthe in a chilled rocks glass to coat the entire interior, then discard excess.",
      "In a mixing glass, combine rye, simple syrup, and Peychaud's with dense ice.",
      "Stir for 35 seconds.",
      "Strain neat into the absinthe-rinsed glass. Express lemon peel and twist onto rim."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "bijou",
    name: "Bijou",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Stir 35s",
    techniqueRule: "Harry Johnson 1890s jewel drink: Diamond (Gin), Ruby (Sweet Vermouth), Emerald (Green Chartreuse).",
    tags: ["Spirit-Forward", "Gin", "Chartreuse", "Herbal", "Vintage"],
    flavor: { boozy: 5, sweet: 3, sour: 0, bitter: 3, herbal: 5 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin", amount: 1.0, unit: "oz" },
      { id: "sweet-vermouth", name: "Sweet Vermouth", amount: 1.0, unit: "oz" },
      { id: "green-chartreuse", name: "Green Chartreuse", amount: 1.0, unit: "oz" },
      { id: "orange-bitters", name: "Orange Bitters", amount: 1, unit: "dash" }
    ],
    instructions: [
      "Stir gin, vermouth, Green Chartreuse, and orange bitters over ice for 35 seconds.",
      "Strain into a chilled coupe. Garnish with a cocktail cherry or lemon twist."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },
  {
    id: "tuxedo-no-2",
    name: "Tuxedo No. 2",
    category: "Spirit-Forward & Stirred",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Stir 35s",
    techniqueRule: "Dry gin martini enhanced by nutty Luxardo Maraschino and a subtle absinthe whisper.",
    tags: ["Spirit-Forward", "Gin", "Maraschino", "Absinthe"],
    flavor: { boozy: 5, sweet: 1, sour: 0, bitter: 3, herbal: 4 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin", amount: 2.0, unit: "oz" },
      { id: "dry-vermouth", name: "Dry Vermouth", amount: 1.0, unit: "oz" },
      { id: "luxardo-maraschino", name: "Luxardo Maraschino", amount: 0.25, unit: "oz" },
      { id: "absinthe", name: "Absinthe", amount: 2, unit: "dashes" },
      { id: "orange-bitters", name: "Orange Bitters", amount: 2, unit: "dashes" }
    ],
    instructions: [
      "Stir gin, dry vermouth, maraschino, absinthe, and bitters with ice for 35 seconds.",
      "Strain into a chilled coupe with a lemon twist."
    ],
    timer: { type: "stir", seconds: 35, label: "35s Stir Timer" }
  },

  // ==========================================
  // II. VELVETY SOURS & MERINGUE BUILDS (Egg White / Foam)
  // ==========================================
  {
    id: "the-clover-club",
    name: "The Clover Club",
    category: "Velvety Sours & Meringue",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Dry Shake 15s + Wet Shake 12s",
    techniqueRule: "Pre-Prohibition Philadelphia classic. 15s dry shake shears albumen into micro-bubbles before ice chill.",
    tags: ["Egg White", "Sour", "Gin", "Berry", "Silky"],
    flavor: { boozy: 3, sweet: 3, sour: 4, bitter: 1, herbal: 3 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin", amount: 1.5, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.75, unit: "oz" },
      { id: "raspberry-syrup", name: "Raspberry Syrup", amount: 0.5, unit: "oz" },
      { id: "fresh-eggs", name: "Egg White", amount: 1, unit: "albumen" }
    ],
    instructions: [
      "Combine gin, lemon juice, raspberry syrup, and egg white in shaker without ice.",
      "Dry shake vigorously for 15 seconds to emulsify the foam.",
      "Add solid ice and wet shake violently for 12 seconds.",
      "Double-strain through a fine-mesh sieve into a chilled coupe."
    ],
    timer: { type: "dry-wet", drySeconds: 15, wetSeconds: 12, label: "15s Dry + 12s Wet Shake" }
  },
  {
    id: "morgenthaler-amaretto-sour",
    name: "Morgenthaler Amaretto Sour",
    category: "Velvety Sours & Meringue",
    isFavorite: false,
    glass: "Chilled Coupe or Rocks",
    ice: "None (or Fresh Rock)",
    method: "Dry Shake 15s + Wet Shake 12s",
    techniqueRule: "Jeffrey Morgenthaler's masterstroke: 0.75 oz cask-strength bourbon fixes the low-proof sweetness of amaretto.",
    tags: ["Egg White", "Sour", "Amaretto", "Bourbon", "Silky"],
    flavor: { boozy: 3, sweet: 4, sour: 4, bitter: 1, herbal: 2 },
    ingredients: [
      { id: "amaretto", name: "Amaretto", amount: 1.5, unit: "oz" },
      { id: "bourbon", name: "High-Proof Bourbon", amount: 0.75, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.75, unit: "oz" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 0.25, unit: "oz" },
      { id: "fresh-eggs", name: "Egg White", amount: 1, unit: "albumen" }
    ],
    instructions: [
      "Combine amaretto, high-proof bourbon, lemon juice, simple syrup, and egg white in shaker.",
      "Dry shake (no ice) for 15 seconds.",
      "Add dense ice and shake violently for 12 seconds.",
      "Double-strain into a chilled coupe or over fresh ice in a rocks glass."
    ],
    timer: { type: "dry-wet", drySeconds: 15, wetSeconds: 12, label: "15s Dry + 12s Wet Shake" }
  },
  {
    id: "the-aperol-gin-sour",
    name: "The Aperol Gin Sour",
    category: "Velvety Sours & Meringue",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Dry Shake 15s + Wet Shake 12s",
    techniqueRule: "Aperol adds bittersweet gentian and vibrant pastel coral hue beneath the frothy white head.",
    tags: ["Egg White", "Sour", "Gin", "Aperol", "Aperitivo"],
    flavor: { boozy: 3, sweet: 3, sour: 4, bitter: 2, herbal: 3 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin", amount: 1.5, unit: "oz" },
      { id: "aperol", name: "Aperol", amount: 0.75, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.75, unit: "oz" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 0.25, unit: "oz" },
      { id: "fresh-eggs", name: "Egg White", amount: 1, unit: "albumen" }
    ],
    instructions: [
      "Combine gin, Aperol, lemon, simple, and egg white in shaker tin.",
      "Dry shake 15 seconds.",
      "Add ice and wet shake violently for 12 seconds.",
      "Double-strain into a coupe."
    ],
    timer: { type: "dry-wet", drySeconds: 15, wetSeconds: 12, label: "15s Dry + 12s Wet Shake" }
  },
  {
    id: "new-york-sour",
    name: "New York Sour",
    category: "Velvety Sours & Meringue",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Fresh Ice",
    method: "Dry/Wet Shake & Wine Float",
    techniqueRule: "Gently float dry red wine over the back of a spoon across the dense foam head for a stunning two-tone layer.",
    tags: ["Egg White", "Whiskey", "Wine Float", "Visual Stunner"],
    flavor: { boozy: 4, sweet: 3, sour: 4, bitter: 2, herbal: 1 },
    ingredients: [
      { id: "bourbon", name: "Bourbon", amount: 1.5, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 1.0, unit: "oz" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 0.5, unit: "oz" },
      { id: "fresh-eggs", name: "Egg White", amount: 0.5, unit: "albumen" },
      { id: "dry-red-wine", name: "Dry Red Wine", amount: 0.5, unit: "oz", note: "Floated on top" }
    ],
    instructions: [
      "Dry shake bourbon, lemon juice, simple syrup, and egg white for 15 seconds.",
      "Add ice, wet shake for 12 seconds, and strain over fresh ice in a rocks glass.",
      "Slowly pour dry red wine over the back of a barspoon so it rests between the whiskey and foam."
    ],
    timer: { type: "dry-wet", drySeconds: 15, wetSeconds: 12, label: "15s Dry + 12s Wet Shake" }
  },
  {
    id: "tequiliation",
    name: "Tequiliation",
    category: "Velvety Sours & Meringue",
    isFavorite: false,
    glass: "Nick & Nora Glass",
    ice: "None (Chilled Glass)",
    method: "Dry Shake 15s + Wet Shake 12s",
    techniqueRule: "Floral violette and elderflower grounded by tequila blanco and a vital pinch of kosher salt to enhance aroma.",
    tags: ["Egg White", "Tequila", "Floral", "Complex"],
    flavor: { boozy: 3, sweet: 3, sour: 3, bitter: 1, herbal: 4 },
    ingredients: [
      { id: "tequila-blanco", name: "Tequila Blanco", amount: 1.0, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.75, unit: "oz" },
      { id: "creme-de-violette", name: "Crème de Violette", amount: 0.25, unit: "oz" },
      { id: "st-germain", name: "Elderflower Liqueur (St. Germain)", amount: 0.5, unit: "oz" },
      { id: "licor-43", name: "Licor 43", amount: 0.25, unit: "oz" },
      { id: "fresh-eggs", name: "Egg White", amount: 1, unit: "albumen" }
    ],
    instructions: [
      "Combine all ingredients and a pinch of salt in shaker.",
      "Dry shake 15 seconds, then wet shake 12 seconds with ice.",
      "Double-strain into a chilled Nick & Nora glass."
    ],
    timer: { type: "dry-wet", drySeconds: 15, wetSeconds: 12, label: "15s Dry + 12s Wet Shake" }
  },
  {
    id: "carajillo-sour",
    name: "Carajillo Sour",
    category: "Velvety Sours & Meringue",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Rock",
    method: "Dry Shake 15s + Wet Shake 12s",
    techniqueRule: "Rich cold brew coffee and Spanish Licor 43 whipped with egg white into a creamy caffeinated cloud.",
    tags: ["Egg White", "Coffee", "Dessert", "Foam"],
    flavor: { boozy: 2, sweet: 4, sour: 1, bitter: 3, herbal: 2 },
    ingredients: [
      { id: "cold-brew", name: "Cold Brew Coffee", amount: 1.5, unit: "oz" },
      { id: "licor-43", name: "Licor 43", amount: 1.0, unit: "oz" },
      { id: "fresh-eggs", name: "Egg White", amount: 1, unit: "albumen" }
    ],
    instructions: [
      "Add cold brew, Licor 43, pinch of salt, and egg white to shaker.",
      "Dry shake 15 seconds, then wet shake 12 seconds with ice.",
      "Strain over a single large rock in a rocks glass."
    ],
    timer: { type: "dry-wet", drySeconds: 15, wetSeconds: 12, label: "15s Dry + 12s Wet Shake" }
  },
  {
    id: "pisco-sour",
    name: "Pisco Sour",
    category: "Velvety Sours & Meringue",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Dry Shake 15s + Wet Shake 12s",
    techniqueRule: "Peruvian national drink. Drops of Angostura bitters on the foam surface neutralize sulfur aroma.",
    tags: ["Egg White", "Pisco", "South American", "Silky Sour"],
    flavor: { boozy: 4, sweet: 3, sour: 4, bitter: 1, herbal: 2 },
    ingredients: [
      { id: "pisco", name: "Pisco", amount: 2.0, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 1.0, unit: "oz" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 0.75, unit: "oz" },
      { id: "fresh-eggs", name: "Egg White", amount: 1, unit: "albumen" },
      { id: "angostura-bitters", name: "Angostura Bitters", amount: 3, unit: "drops", note: "Garnish on foam" }
    ],
    instructions: [
      "Dry shake pisco, lime juice, simple syrup, and egg white for 15 seconds.",
      "Wet shake with ice for 12 seconds.",
      "Double-strain into a coupe. Drop 3 dots of Angostura on top and drag a toothpick through."
    ],
    timer: { type: "dry-wet", drySeconds: 15, wetSeconds: 12, label: "15s Dry + 12s Wet Shake" }
  },
  {
    id: "trinidad-sour",
    name: "Trinidad Sour",
    category: "Velvety Sours & Meringue",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Hard Shake 15s",
    techniqueRule: "Giuseppe González genius build: A full 1.5 oz of Angostura Bitters acts as the primary base spirit!",
    tags: ["Bitters-Base", "Angostura", "Bold", "Sour"],
    flavor: { boozy: 4, sweet: 3, sour: 4, bitter: 5, herbal: 5 },
    ingredients: [
      { id: "angostura-bitters", name: "Angostura Aromatic Bitters", amount: 1.5, unit: "oz" },
      { id: "rye-whiskey", name: "Rye Whiskey", amount: 0.5, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 1.0, unit: "oz" },
      { id: "orgeat", name: "Orgeat Syrup", amount: 1.0, unit: "oz" }
    ],
    instructions: [
      "Combine Angostura bitters, rye whiskey, fresh lemon juice, and orgeat in a shaker with ice.",
      "Shake hard for 15 seconds.",
      "Strain into a chilled coupe."
    ],
    timer: { type: "shake", seconds: 15, label: "15s Hard Shake" }
  },
  {
    id: "pink-lady",
    name: "Pink Lady",
    category: "Velvety Sours & Meringue",
    isFavorite: false,
    glass: "Nick & Nora Glass",
    ice: "None (Chilled Glass)",
    method: "Dry Shake 15s + Wet Shake 12s",
    techniqueRule: "1930s high-society cocktail. Applejack and gin softened by grenadine and luscious foam.",
    tags: ["Egg White", "Gin", "Applejack", "Grenadine"],
    flavor: { boozy: 3, sweet: 3, sour: 3, bitter: 1, herbal: 3 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin", amount: 1.5, unit: "oz" },
      { id: "applejack", name: "Applejack", amount: 0.5, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.5, unit: "oz" },
      { id: "raspberry-syrup", name: "Grenadine / Raspberry Syrup", amount: 0.5, unit: "oz" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 0.25, unit: "oz" },
      { id: "fresh-eggs", name: "Egg White", amount: 1, unit: "albumen" }
    ],
    instructions: [
      "Dry shake all ingredients for 15 seconds without ice.",
      "Add ice and wet shake hard for 12 seconds.",
      "Double-strain into a chilled Nick & Nora glass."
    ],
    timer: { type: "dry-wet", drySeconds: 15, wetSeconds: 12, label: "15s Dry + 12s Wet Shake" }
  },
  {
    id: "ramos-gin-fizz",
    name: "Ramos Gin Fizz",
    category: "Velvety Sours & Meringue",
    isFavorite: false,
    glass: "Collins Glass",
    ice: "None (Settle in Freezer)",
    method: "Heavy Shake & Freezer Settle",
    techniqueRule: "Heavy shake cream and egg white. Pour into chilled Collins glass, rest in freezer 3 minutes, then pour club soda through center to lift foam head over the rim.",
    tags: ["Egg White", "Cream", "Legendary", "New Orleans"],
    flavor: { boozy: 3, sweet: 4, sour: 3, bitter: 0, herbal: 3 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin", amount: 2.0, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.5, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.5, unit: "oz" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 1.0, unit: "oz" },
      { id: "heavy-cream", name: "Heavy Cream", amount: 1.0, unit: "oz" },
      { id: "fresh-eggs", name: "Egg White", amount: 1, unit: "albumen" },
      { id: "club-soda", name: "Club Soda", amount: 2.0, unit: "oz", note: "Top through center" }
    ],
    instructions: [
      "Combine gin, citrus juices, simple syrup, cream, and egg white in shaker.",
      "Dry shake for 30 seconds, then add ice and shake heavily for 45 seconds.",
      "Pour into an un-iced Collins glass and settle in freezer for 3 minutes.",
      "Slowly pour cold club soda straight down the center to lift the cylindrical meringue head above the rim."
    ],
    timer: { type: "shake", seconds: 45, label: "45s Heavy Shake" }
  },

  // ==========================================
  // III. EQUAL-PARTS & MODERN CLASSICS (Shaken)
  // ==========================================
  {
    id: "the-paper-plane",
    name: "The Paper Plane",
    category: "Equal-Parts & Modern Classics",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Hard Shake 12s",
    techniqueRule: "Sam Ross 2008 modern classic. Exact 1:1:1:1 equal parts Bourbon, Aperol, Amaro Nonino, and Lemon.",
    tags: ["Equal-Parts", "Bourbon", "Amaro", "Aperol", "Modern Classic"],
    flavor: { boozy: 3, sweet: 3, sour: 4, bitter: 3, herbal: 3 },
    ingredients: [
      { id: "bourbon", name: "Bourbon", amount: 0.75, unit: "oz" },
      { id: "aperol", name: "Aperol", amount: 0.75, unit: "oz" },
      { id: "amaro-nonino", name: "Amaro Nonino", amount: 0.75, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.75, unit: "oz" }
    ],
    instructions: [
      "Combine equal 0.75 oz parts in a shaker with dense ice.",
      "Hard shake for 12 seconds.",
      "Double-strain into a chilled coupe."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "the-last-word",
    name: "The Last Word",
    category: "Equal-Parts & Modern Classics",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Hard Shake 12s",
    techniqueRule: "Detroit Athletic Club 1916 recipe revived by Murray Stenson. 1:1:1:1 equal parts Gin, Green Chartreuse, Maraschino, Lime.",
    tags: ["Equal-Parts", "Gin", "Chartreuse", "Maraschino", "Iconic"],
    flavor: { boozy: 4, sweet: 3, sour: 4, bitter: 2, herbal: 5 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin", amount: 0.75, unit: "oz" },
      { id: "green-chartreuse", name: "Green Chartreuse", amount: 0.75, unit: "oz" },
      { id: "luxardo-maraschino", name: "Luxardo Maraschino", amount: 0.75, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.75, unit: "oz" }
    ],
    instructions: [
      "Combine all equal 0.75 oz parts with ice in shaker.",
      "Hard shake for 12 seconds.",
      "Double-strain into a chilled coupe."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "final-ward",
    name: "Final Ward",
    category: "Equal-Parts & Modern Classics",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Hard Shake 12s",
    techniqueRule: "Phil Ward riff on The Last Word swapping Gin $\\rightarrow$ Rye Whiskey and Lime $\\rightarrow$ Lemon.",
    tags: ["Equal-Parts", "Whiskey", "Chartreuse", "Maraschino"],
    flavor: { boozy: 4, sweet: 3, sour: 4, bitter: 2, herbal: 5 },
    ingredients: [
      { id: "rye-whiskey", name: "Rye Whiskey", amount: 1.0, unit: "oz" },
      { id: "green-chartreuse", name: "Green Chartreuse", amount: 1.0, unit: "oz" },
      { id: "luxardo-maraschino", name: "Luxardo Maraschino", amount: 1.0, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 1.0, unit: "oz" }
    ],
    instructions: [
      "Combine all equal parts in shaker with dense ice.",
      "Hard shake 12 seconds and double-strain into a chilled coupe."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "naked-and-famous",
    name: "Naked & Famous",
    category: "Equal-Parts & Modern Classics",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Hard Shake 12s",
    techniqueRule: "Joaquín Simó modern classic. Equal parts Mezcal, Aperol, Yellow Chartreuse, and Lime.",
    tags: ["Equal-Parts", "Mezcal", "Aperol", "Chartreuse", "Smoky"],
    flavor: { boozy: 4, sweet: 3, sour: 4, bitter: 3, herbal: 4 },
    ingredients: [
      { id: "mezcal", name: "Mezcal", amount: 0.75, unit: "oz" },
      { id: "aperol", name: "Aperol", amount: 0.75, unit: "oz" },
      { id: "yellow-chartreuse", name: "Yellow Chartreuse", amount: 0.75, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.75, unit: "oz" }
    ],
    instructions: [
      "Combine equal 0.75 oz parts in shaker with ice.",
      "Hard shake 12 seconds.",
      "Double-strain into a coupe."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "division-bell",
    name: "Division Bell",
    category: "Equal-Parts & Modern Classics",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Hard Shake 12s",
    techniqueRule: "Phil Ward creation. Mezcal base with Aperol, Maraschino, and Lime.",
    tags: ["Shaken", "Mezcal", "Aperol", "Maraschino"],
    flavor: { boozy: 4, sweet: 3, sour: 4, bitter: 3, herbal: 3 },
    ingredients: [
      { id: "mezcal", name: "Mezcal", amount: 1.0, unit: "oz" },
      { id: "aperol", name: "Aperol", amount: 0.75, unit: "oz" },
      { id: "luxardo-maraschino", name: "Luxardo Maraschino", amount: 0.5, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.75, unit: "oz" }
    ],
    instructions: [
      "Combine all ingredients in shaker with ice.",
      "Shake hard for 12 seconds.",
      "Double-strain into a chilled coupe."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "corpse-reviver-no-2",
    name: "Corpse Reviver #2",
    category: "Equal-Parts & Modern Classics",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Hard Shake & Absinthe Rinse",
    techniqueRule: "Equal parts Gin, Cointreau, Lillet Blanc, Lemon with an absinthe-rinsed coupe.",
    tags: ["Equal-Parts", "Gin", "Lillet", "Absinthe", "Savoy"],
    flavor: { boozy: 3, sweet: 3, sour: 4, bitter: 1, herbal: 4 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin", amount: 0.75, unit: "oz" },
      { id: "dry-curacao", name: "Cointreau / Triple Sec", amount: 0.75, unit: "oz" },
      { id: "lillet-blanc", name: "Lillet Blanc", amount: 0.75, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.75, unit: "oz" },
      { id: "absinthe", name: "Absinthe", amount: 0.15, unit: "oz", note: "Glass rinse" }
    ],
    instructions: [
      "Rinse a chilled coupe glass with absinthe and dump the excess.",
      "Shake gin, Cointreau, Lillet Blanc, and lemon juice hard with ice for 12 seconds.",
      "Strain into the absinthe-rinsed coupe."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "twentieth-century",
    name: "20th Century",
    category: "Equal-Parts & Modern Classics",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Shake 12s",
    techniqueRule: "1937 British classic named for the New York-Chicago express train. White crème de cacao and Lillet.",
    tags: ["Shaken", "Gin", "Lillet", "Cacao"],
    flavor: { boozy: 3, sweet: 3, sour: 4, bitter: 1, herbal: 3 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin", amount: 1.5, unit: "oz" },
      { id: "lillet-blanc", name: "Lillet Blanc", amount: 0.75, unit: "oz" },
      { id: "white-creme-de-cacao", name: "White Crème de Cacao", amount: 0.75, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.75, unit: "oz" }
    ],
    instructions: [
      "Shake all ingredients with ice for 12 seconds.",
      "Double-strain into a coupe. Garnish with lemon twist."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },

  // ==========================================
  // IV. ACID-DRIVEN SOURS, SMASHES & BUCKS
  // ==========================================
  {
    id: "classic-daiquiri",
    name: "Classic Daiquiri",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Hard Shake 10s",
    techniqueRule: "The ultimate test of a bartender. 2:0.75:0.75 ratio. Shake fast and violently with dense ice to aerate without over-diluting.",
    tags: ["Sour", "White Rum", "Classic", "Essential"],
    flavor: { boozy: 3, sweet: 3, sour: 4, bitter: 0, herbal: 1 },
    ingredients: [
      { id: "white-rum", name: "White Rum (Planteray 3 Stars)", amount: 2.0, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.75, unit: "oz" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 0.75, unit: "oz" }
    ],
    instructions: [
      "Combine rum, fresh lime, and simple syrup with dense ice.",
      "Hard shake for 10 seconds.",
      "Double-strain into a chilled coupe."
    ],
    timer: { type: "shake", seconds: 10, label: "10s Fast Shake" }
  },
  {
    id: "hemingway-daiquiri",
    name: "Hemingway Daiquiri",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Hard Shake 12s",
    techniqueRule: "El Floridita standard. Fresh ruby red grapefruit and nutty Luxardo Maraschino replace standard sugar.",
    tags: ["Sour", "White Rum", "Grapefruit", "Maraschino"],
    flavor: { boozy: 3, sweet: 2, sour: 4, bitter: 2, herbal: 2 },
    ingredients: [
      { id: "white-rum", name: "White Rum", amount: 2.0, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.75, unit: "oz" },
      { id: "grapefruit-juice", name: "Fresh Grapefruit Juice", amount: 0.5, unit: "oz" },
      { id: "luxardo-maraschino", name: "Luxardo Maraschino", amount: 0.5, unit: "oz" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 0.25, unit: "oz" }
    ],
    instructions: [
      "Shake all ingredients hard with ice for 12 seconds.",
      "Double-strain into a chilled coupe."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "mary-pickford",
    name: "Mary Pickford",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Hard Shake 15s",
    techniqueRule: "1920s Havana classic. Shake hard for 15s to activate pineapple foam head.",
    tags: ["Sour", "White Rum", "Pineapple", "Tropical"],
    flavor: { boozy: 3, sweet: 3, sour: 3, bitter: 1, herbal: 1 },
    ingredients: [
      { id: "white-rum", name: "White Rum", amount: 1.5, unit: "oz" },
      { id: "pineapple-juice", name: "Pineapple Juice", amount: 1.5, unit: "oz" },
      { id: "luxardo-maraschino", name: "Luxardo Maraschino", amount: 0.25, unit: "oz" },
      { id: "raspberry-syrup", name: "Grenadine or Raspberry Syrup", amount: 0.25, unit: "oz" }
    ],
    instructions: [
      "Shake hard for 15 seconds to create a dense pineapple head.",
      "Single-strain into a coupe."
    ],
    timer: { type: "shake", seconds: 15, label: "15s Shake" }
  },
  {
    id: "stan-the-man",
    name: "Stan the Man",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Fresh Ice",
    method: "Shake 12s",
    techniqueRule: "Bourbon sour boosted with nutty Luxardo Maraschino.",
    tags: ["Sour", "Bourbon", "Maraschino", "Refreshing"],
    flavor: { boozy: 4, sweet: 3, sour: 4, bitter: 1, herbal: 2 },
    ingredients: [
      { id: "bourbon", name: "Bourbon", amount: 1.5, unit: "oz" },
      { id: "luxardo-maraschino", name: "Luxardo Maraschino", amount: 0.5, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 1.0, unit: "oz" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 0.5, unit: "oz" }
    ],
    instructions: [
      "Shake all ingredients with ice for 12 seconds.",
      "Strain over fresh ice in a rocks glass."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "tommys-margarita",
    name: "Tommy's Margarita",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Fresh Ice",
    method: "Hard Shake 12s",
    techniqueRule: "Julio Bermejo 1990 San Francisco modern masterwork. Eliminates orange liqueur in favor of pure 100% blue agave nectar.",
    tags: ["Sour", "Tequila", "Agave", "Essential"],
    flavor: { boozy: 4, sweet: 3, sour: 4, bitter: 0, herbal: 2 },
    ingredients: [
      { id: "tequila-blanco", name: "Tequila Blanco (100% Blue Agave)", amount: 2.0, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.75, unit: "oz" },
      { id: "agave-syrup", name: "Agave Syrup (1:1)", amount: 0.5, unit: "oz" }
    ],
    instructions: [
      "Shake tequila, lime, and agave nectar hard with ice for 12 seconds.",
      "Strain over fresh ice in a rocks glass with a half salted rim."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "bitter-strawberry-margarita",
    name: "Bitter-Strawberry Margarita",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Fresh Ice",
    method: "Muddle & Hard Shake",
    techniqueRule: "Fresh strawberries muddled into Aperol and agave create an alluring bittersweet summer profile.",
    tags: ["Sour", "Tequila", "Strawberry", "Aperol"],
    flavor: { boozy: 3, sweet: 3, sour: 4, bitter: 2, herbal: 2 },
    ingredients: [
      { id: "tequila-blanco", name: "Tequila Blanco", amount: 1.5, unit: "oz" },
      { id: "aperol", name: "Aperol", amount: 0.5, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.75, unit: "oz" },
      { id: "agave-syrup", name: "Agave Syrup (1:1)", amount: 0.25, unit: "oz" },
      { id: "fresh-strawberries", name: "Fresh Strawberries", amount: 2, unit: "sliced", note: "Muddled" }
    ],
    instructions: [
      "Muddle 2 fresh strawberries with agave in shaker.",
      "Add tequila, Aperol, lime juice, and ice.",
      "Shake hard for 12 seconds and double-strain over fresh ice."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "the-bees-knees",
    name: "The Bee's Knees",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Coupe",
    ice: "None (Chilled Glass)",
    method: "Hard Shake 12s",
    techniqueRule: "Prohibition gem. Honey syrup provides floral richness that binds gin botanicals to lemon acidity.",
    tags: ["Sour", "Gin", "Honey", "Classic"],
    flavor: { boozy: 3, sweet: 3, sour: 4, bitter: 0, herbal: 4 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin", amount: 2.0, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.75, unit: "oz" },
      { id: "honey-syrup", name: "Honey Syrup (1:1)", amount: 0.75, unit: "oz" }
    ],
    instructions: [
      "Combine gin, lemon juice, and honey syrup with ice.",
      "Shake hard for 12 seconds.",
      "Double-strain into a chilled coupe with a lemon twist."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "gold-rush",
    name: "Gold Rush",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Rock",
    method: "Hard Shake 12s",
    techniqueRule: "T.J. Siegal 2001 Milk & Honey modern classic. A Bee's Knees made with rich Bourbon over a rock.",
    tags: ["Sour", "Bourbon", "Honey", "Modern Classic"],
    flavor: { boozy: 4, sweet: 3, sour: 4, bitter: 0, herbal: 2 },
    ingredients: [
      { id: "bourbon", name: "Bourbon", amount: 2.0, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.75, unit: "oz" },
      { id: "honey-syrup", name: "Honey Syrup (1:1)", amount: 0.75, unit: "oz" }
    ],
    instructions: [
      "Shake bourbon, lemon juice, and honey syrup hard with ice for 12 seconds.",
      "Strain over a single large rock in a rocks glass."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "fresh-ginger-gold-rush",
    name: "Fresh Ginger Gold Rush",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Rock",
    method: "Muddle & Hard Shake",
    techniqueRule: "Muddling raw fresh ginger root unlocks spicy pungent gingerols directly into the honey-bourbon sour.",
    tags: ["Sour", "Bourbon", "Ginger", "Spicy Honey"],
    flavor: { boozy: 4, sweet: 3, sour: 4, bitter: 0, herbal: 3 },
    ingredients: [
      { id: "bourbon", name: "Bourbon", amount: 2.0, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.75, unit: "oz" },
      { id: "honey-syrup", name: "Honey Syrup (1:1)", amount: 0.75, unit: "oz" },
      { id: "fresh-ginger-root", name: "Fresh Ginger Root", amount: 3, unit: "slices", note: "Muddled to paste" }
    ],
    instructions: [
      "Muddle 3 slices of fresh peeled ginger root vigorously into the honey syrup.",
      "Add bourbon, lemon juice, and ice.",
      "Shake hard for 12 seconds and double-strain over a large rock."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "penicillin",
    name: "Penicillin",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Cube",
    method: "Shake & Islay Peat Spritz",
    techniqueRule: "Sam Ross 2005 Milk & Honey legend. Blended scotch sour with honey-ginger, finished with an aromatic mist of peated Islay Scotch.",
    tags: ["Sour", "Scotch", "Honey-Ginger", "Smoky", "Modern Classic"],
    flavor: { boozy: 4, sweet: 3, sour: 4, bitter: 1, herbal: 3 },
    ingredients: [
      { id: "blended-scotch", name: "Blended Scotch", amount: 2.0, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.75, unit: "oz" },
      { id: "honey-ginger-syrup", name: "Honey-Ginger Syrup", amount: 0.75, unit: "oz" },
      { id: "islay-scotch", name: "Islay Scotch", amount: 0.25, unit: "oz", note: "Floated / Spritzed" }
    ],
    instructions: [
      "Shake blended scotch, lemon juice, and honey-ginger syrup hard with ice for 12 seconds.",
      "Strain over a large clear rock in a rocks glass.",
      "Gently float or mist peated Islay Scotch across the surface. Garnish with candied ginger."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "the-oaxaca-mule",
    name: "The Oaxaca Mule",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Tall Highball Glass",
    ice: "Fresh Ice Packed",
    method: "Short Shake & Vertical Lift",
    techniqueRule: "Short shake spirits and citrus for 6s only; top with spicy ginger beer and pull barspoon up once.",
    tags: ["Highball", "Mezcal", "Vodka", "Ginger Beer"],
    flavor: { boozy: 3, sweet: 3, sour: 3, bitter: 1, herbal: 3 },
    ingredients: [
      { id: "vodka", name: "Vodka (or 2.0 oz pure Mezcal)", amount: 1.5, unit: "oz" },
      { id: "mezcal", name: "Mezcal", amount: 0.5, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.75, unit: "oz" },
      { id: "agave-syrup", name: "Agave Syrup (1:1)", amount: 0.5, unit: "oz" },
      { id: "ginger-beer", name: "Spicy Ginger Beer", amount: 3.0, unit: "oz", note: "Top to fill" }
    ],
    instructions: [
      "Short shake vodka, mezcal, lime juice, and agave with ice for 6 seconds.",
      "Strain into a tall glass packed with fresh ice.",
      "Top with 3.0 oz spicy ginger beer and pull barspoon vertically up once."
    ],
    timer: { type: "shake", seconds: 6, label: "6s Short Shake" }
  },
  {
    id: "the-smoky-greyhound",
    name: "The Smoky Greyhound",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Tall Highball Glass",
    ice: "Dense Ice Packed",
    method: "Shake & Soda Top",
    techniqueRule: "Grapefruit and mezcal smoke harmonize beautifully.",
    tags: ["Highball", "Mezcal", "Vodka", "Grapefruit", "Smoky"],
    flavor: { boozy: 3, sweet: 2, sour: 4, bitter: 2, herbal: 2 },
    ingredients: [
      { id: "vodka", name: "Vodka", amount: 1.25, unit: "oz" },
      { id: "mezcal", name: "Mezcal", amount: 0.75, unit: "oz" },
      { id: "grapefruit-juice", name: "Fresh Grapefruit Juice", amount: 2.0, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.5, unit: "oz" },
      { id: "agave-syrup", name: "Agave Syrup (1:1)", amount: 0.5, unit: "oz" },
      { id: "club-soda", name: "Club Soda", amount: 2.0, unit: "oz", note: "Top to fill" }
    ],
    instructions: [
      "Shake spirits, juices, and agave with ice for 10 seconds.",
      "Strain into a highball packed with ice.",
      "Top with cold club soda and pull barspoon up once."
    ],
    timer: { type: "shake", seconds: 10, label: "10s Shake" }
  },
  {
    id: "botanical-paloma",
    name: "The Botanical Paloma (Gin Paloma)",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Tall Highball Glass",
    ice: "Dense Ice Packed to Lip",
    method: "Shake & Soda Top",
    techniqueRule: "A pinch of kosher salt cuts the grapefruit bitterness and elevates London Dry gin botanicals.",
    tags: ["Highball", "Gin", "Grapefruit", "Effervescent"],
    flavor: { boozy: 3, sweet: 2, sour: 4, bitter: 2, herbal: 4 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin", amount: 2.0, unit: "oz" },
      { id: "grapefruit-juice", name: "Fresh Grapefruit Juice", amount: 2.0, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.5, unit: "oz" },
      { id: "agave-syrup", name: "Agave Syrup (1:1)", amount: 0.5, unit: "oz" },
      { id: "club-soda", name: "Club Soda", amount: 2.0, unit: "oz", note: "Top to fill" }
    ],
    instructions: [
      "Add gin, grapefruit juice, lime juice, agave syrup, and a pinch of kosher salt to shaker with ice.",
      "Shake hard for 10 seconds.",
      "Strain into a tall glass packed with ice.",
      "Top with 2.0 oz cold club soda and lift once."
    ],
    timer: { type: "shake", seconds: 10, label: "10s Shake" }
  },
  {
    id: "sparkling-salty-dog",
    name: "Sparkling Salty Dog (Vodka Paloma)",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Salt-Rimmed Highball",
    ice: "Dense Ice Packed",
    method: "Shake & Soda Top",
    techniqueRule: "Salt-rimmed highball packed with dense ice. Clean, crisp, and thirst-quenching.",
    tags: ["Highball", "Vodka", "Grapefruit", "Salty Rim"],
    flavor: { boozy: 3, sweet: 2, sour: 4, bitter: 2, herbal: 1 },
    ingredients: [
      { id: "vodka", name: "Vodka", amount: 2.0, unit: "oz" },
      { id: "grapefruit-juice", name: "Fresh Grapefruit Juice", amount: 2.0, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.5, unit: "oz" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 0.5, unit: "oz" },
      { id: "club-soda", name: "Club Soda", amount: 2.0, unit: "oz", note: "Top to fill" }
    ],
    instructions: [
      "Run a lime wedge along rim of highball glass and dip in coarse salt.",
      "Pack glass with ice.",
      "Shake vodka, grapefruit juice, lime, and simple syrup with ice for 10 seconds.",
      "Strain into glass, top with club soda, and pull barspoon up once."
    ],
    timer: { type: "shake", seconds: 10, label: "10s Shake" }
  },
  {
    id: "mezcal-strawberry-smash",
    name: "Mezcal Strawberry Smash",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Single Large Rock",
    method: "Muddle & Hard Shake",
    techniqueRule: "Smoky Espadín mezcal and ripe berries with lime and agave over a big rock.",
    tags: ["Smash", "Mezcal", "Strawberry", "Smoky"],
    flavor: { boozy: 4, sweet: 3, sour: 4, bitter: 1, herbal: 2 },
    ingredients: [
      { id: "mezcal", name: "Mezcal", amount: 2.0, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.75, unit: "oz" },
      { id: "agave-syrup", name: "Agave Syrup (1:1)", amount: 0.5, unit: "oz" },
      { id: "fresh-strawberries", name: "Fresh Strawberries", amount: 2, unit: "muddled" }
    ],
    instructions: [
      "Muddle 2 fresh strawberries in agave syrup.",
      "Add mezcal, lime juice, and ice.",
      "Shake hard for 12 seconds and double-strain over a large rock."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "peach-mint-smash",
    name: "Peach-Mint Smash",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Crushed Ice",
    method: "Muddle & Shake",
    techniqueRule: "Double-strain over crushed ice. Mint and ripe peach express sweet summer aromatics.",
    tags: ["Smash", "Bourbon", "Mint", "Peach", "Crushed Ice"],
    flavor: { boozy: 3, sweet: 4, sour: 3, bitter: 0, herbal: 4 },
    ingredients: [
      { id: "bourbon", name: "Bourbon", amount: 2.0, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.75, unit: "oz" },
      { id: "honey-syrup", name: "Honey Syrup (1:1)", amount: 0.5, unit: "oz" },
      { id: "fresh-peach", name: "Fresh Peach", amount: 1, unit: "slice", note: "Muddled" },
      { id: "fresh-mint", name: "Fresh Mint", amount: 5, unit: "leaves", note: "Muddled" }
    ],
    instructions: [
      "Gently muddle peach and mint leaves with honey syrup in shaker.",
      "Add bourbon, lemon juice, and ice.",
      "Shake hard for 12 seconds.",
      "Double-strain over crushed ice in a rocks glass. Garnish with mint sprig."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "strawberry-bourbon-buck",
    name: "Strawberry Bourbon Buck",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Highball Glass",
    ice: "Fresh Ice Packed",
    method: "Muddle, Shake & Ginger Beer",
    techniqueRule: "Spicy ginger beer carbonation lifts the muddled strawberry and rich bourbon.",
    tags: ["Buck", "Bourbon", "Strawberry", "Ginger Beer"],
    flavor: { boozy: 3, sweet: 3, sour: 3, bitter: 1, herbal: 2 },
    ingredients: [
      { id: "bourbon", name: "Bourbon", amount: 2.0, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.75, unit: "oz" },
      { id: "agave-syrup", name: "Agave Syrup (1:1)", amount: 0.5, unit: "oz" },
      { id: "fresh-strawberries", name: "Fresh Strawberries", amount: 2, unit: "muddled" },
      { id: "ginger-beer", name: "Spicy Ginger Beer", amount: 3.0, unit: "oz", note: "Top to fill" }
    ],
    instructions: [
      "Muddle strawberries with agave.",
      "Add bourbon, lemon juice, and ice; shake 10 seconds.",
      "Double-strain over fresh ice in highball; top with ginger beer."
    ],
    timer: { type: "shake", seconds: 10, label: "10s Shake" }
  },
  {
    id: "gin-basil-smash",
    name: "Gin Basil Smash",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Fresh Ice / Rock",
    method: "Muddle & Hard Shake",
    techniqueRule: "Jörg Meyer 2008 Hamburg creation. Muddle 8 basil leaves into syrup until vivid emerald green before shaking.",
    tags: ["Smash", "Gin", "Basil", "Emerald Green"],
    flavor: { boozy: 3, sweet: 3, sour: 4, bitter: 0, herbal: 5 },
    ingredients: [
      { id: "london-dry-gin", name: "London Dry Gin", amount: 2.0, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.75, unit: "oz" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 0.5, unit: "oz" },
      { id: "fresh-basil", name: "Fresh Basil", amount: 8, unit: "leaves", note: "Muddled" }
    ],
    instructions: [
      "Muddle 8 basil leaves with simple syrup vigorously until thoroughly broken down and deep green.",
      "Add gin, lemon juice, and solid ice.",
      "Hard shake for 12 seconds.",
      "Double-strain through fine sieve over fresh ice in a rocks glass."
    ],
    timer: { type: "shake", seconds: 12, label: "12s Shake" }
  },
  {
    id: "jungle-bird",
    name: "Jungle Bird",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Rocks Glass",
    ice: "Crushed Ice",
    method: "Hard Shake 15s",
    techniqueRule: "1973 Kuala Lumpur Hilton tiki icon. Dark Jamaican rum, pineapple foam, and bitter Campari.",
    tags: ["Tiki", "Dark Rum", "Campari", "Pineapple", "Crushed Ice"],
    flavor: { boozy: 4, sweet: 3, sour: 3, bitter: 3, herbal: 2 },
    ingredients: [
      { id: "dark-rum", name: "Dark Rum", amount: 1.5, unit: "oz" },
      { id: "pineapple-juice", name: "Pineapple Juice", amount: 1.5, unit: "oz" },
      { id: "campari", name: "Campari", amount: 0.75, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.5, unit: "oz" },
      { id: "simple-syrup", name: "Simple Syrup (1:1)", amount: 0.5, unit: "oz" }
    ],
    instructions: [
      "Shake all ingredients hard with ice for 15 seconds to generate pineapple foam.",
      "Strain over crushed ice in a rocks glass.",
      "Garnish with pineapple wedge and fresh mint."
    ],
    timer: { type: "shake", seconds: 15, label: "15s Tiki Shake" }
  },
  {
    id: "dark-n-stormy",
    name: "Dark 'n' Stormy",
    category: "Acid-Driven Sours & Smashes",
    isFavorite: false,
    glass: "Highball Glass",
    ice: "Fresh Ice Packed",
    method: "Build & Dark Rum Float",
    techniqueRule: "Build ginger beer and lime over ice first, then float black rum on top to mimic a storm cloud on the horizon.",
    tags: ["Highball", "Dark Rum", "Ginger Beer", "Layered"],
    flavor: { boozy: 3, sweet: 3, sour: 3, bitter: 1, herbal: 2 },
    ingredients: [
      { id: "dark-rum", name: "Gosling's Black Seal Dark Rum", amount: 2.0, unit: "oz", note: "Floated on top" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.5, unit: "oz" },
      { id: "ginger-beer", name: "Spicy Ginger Beer", amount: 4.0, unit: "oz" }
    ],
    instructions: [
      "Fill a highball glass completely with fresh ice.",
      "Add fresh lime juice and spicy ginger beer.",
      "Carefully float 2.0 oz dark rum on top of the ginger beer using a barspoon.",
      "Serve un-stirred with a lime wheel."
    ]
  },

  // ==========================================
  // V. ZERO-PROOF DIVISION (Mocktails)
  // ==========================================
  {
    id: "grapefruit-raspberry-fizz",
    name: "The Grapefruit-Raspberry Fizz",
    category: "Zero-Proof Mocktails",
    isFavorite: false,
    glass: "Tall Highball Glass",
    ice: "Fresh Ice Packed",
    method: "Shake & Soda Top",
    techniqueRule: "Tart grapefruit and rich raspberry syrup topped with lively cold club soda.",
    tags: ["Mocktail", "Zero-Proof", "Grapefruit", "Raspberry", "Fizzy"],
    flavor: { boozy: 0, sweet: 3, sour: 4, bitter: 1, herbal: 1 },
    ingredients: [
      { id: "grapefruit-juice", name: "Fresh Grapefruit Juice", amount: 2.0, unit: "oz" },
      { id: "lemon-juice", name: "Fresh Lemon Juice", amount: 0.75, unit: "oz" },
      { id: "raspberry-syrup", name: "Raspberry Syrup", amount: 0.5, unit: "oz" },
      { id: "club-soda", name: "Club Soda", amount: 3.0, unit: "oz", note: "Top to fill" }
    ],
    instructions: [
      "Shake grapefruit juice, lemon juice, and raspberry syrup with ice for 10 seconds.",
      "Strain over fresh ice in a tall highball glass.",
      "Top with cold club soda and pull barspoon up once."
    ],
    timer: { type: "shake", seconds: 10, label: "10s Shake" }
  },
  {
    id: "strawberry-ginger-smash",
    name: "The Strawberry-Ginger Smash",
    category: "Zero-Proof Mocktails",
    isFavorite: false,
    glass: "Tall Highball Glass",
    ice: "Fresh Ice Packed",
    method: "Muddle & Double Strain",
    techniqueRule: "Muddle raw ginger root and strawberries into a paste with agave nectar for spicy natural complexity.",
    tags: ["Mocktail", "Zero-Proof", "Strawberry", "Ginger", "Refreshing"],
    flavor: { boozy: 0, sweet: 3, sour: 4, bitter: 0, herbal: 2 },
    ingredients: [
      { id: "fresh-strawberries", name: "Fresh Strawberries", amount: 2, unit: "sliced" },
      { id: "fresh-ginger-root", name: "Fresh Ginger Root", amount: 3, unit: "slices" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.75, unit: "oz" },
      { id: "agave-syrup", name: "Agave Syrup (1:1)", amount: 0.75, unit: "oz" },
      { id: "club-soda", name: "Club Soda", amount: 3.0, unit: "oz", note: "Top to fill" }
    ],
    instructions: [
      "Muddle ginger and strawberries into a paste with agave syrup.",
      "Add lime juice and ice; shake hard for 15 seconds.",
      "Double-strain over fresh ice in a highball and top with club soda."
    ],
    timer: { type: "shake", seconds: 15, label: "15s Shake" }
  },
  {
    id: "pineapple-ginger-foam",
    name: "The Pineapple Ginger Foam",
    category: "Zero-Proof Mocktails",
    isFavorite: false,
    glass: "Tall Highball Glass",
    ice: "Fresh Ice Packed",
    method: "Bromelain Foam Shake & Ginger Beer",
    techniqueRule: "Shake cold-pressed pineapple juice hard for 15-20s to activate bromelain foam, then single strain over ginger beer.",
    tags: ["Mocktail", "Zero-Proof", "Pineapple", "Ginger Beer", "Foam"],
    flavor: { boozy: 0, sweet: 4, sour: 3, bitter: 0, herbal: 2 },
    ingredients: [
      { id: "pineapple-juice", name: "Pineapple Juice", amount: 2.0, unit: "oz" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.75, unit: "oz" },
      { id: "honey-syrup", name: "Honey Syrup (1:1)", amount: 0.5, unit: "oz" },
      { id: "ginger-beer", name: "Spicy Ginger Beer", amount: 3.0, unit: "oz", note: "Top to fill" }
    ],
    instructions: [
      "Shake pineapple juice, lime juice, and honey syrup hard with ice for 18 seconds.",
      "Single-strain over fresh ice in a tall glass to keep the thick foam head.",
      "Gently pour spicy ginger beer down the inside wall to preserve the foam."
    ],
    timer: { type: "shake", seconds: 18, label: "18s Foam Shake" }
  },
  {
    id: "raspberry-mint-smash",
    name: "The Raspberry Mint Smash",
    category: "Zero-Proof Mocktails",
    isFavorite: false,
    glass: "Tall Highball Glass",
    ice: "Dense Ice Packed to Lip",
    method: "Muddle, Shake & Soda",
    techniqueRule: "Gently press raspberries and mint in agave before a short 10s shake; double-strain over ice.",
    tags: ["Mocktail", "Zero-Proof", "Raspberry", "Mint", "Effervescent"],
    flavor: { boozy: 0, sweet: 3, sour: 3, bitter: 0, herbal: 4 },
    ingredients: [
      { id: "fresh-raspberries", name: "Fresh Raspberries", amount: 4, unit: "berries" },
      { id: "fresh-mint", name: "Fresh Mint", amount: 5, unit: "leaves" },
      { id: "lime-juice", name: "Fresh Lime Juice", amount: 0.75, unit: "oz" },
      { id: "agave-syrup", name: "Agave Syrup (1:1)", amount: 0.5, unit: "oz" },
      { id: "club-soda", name: "Club Soda", amount: 3.0, unit: "oz", note: "Top to fill" }
    ],
    instructions: [
      "Muddle raspberries and mint with agave syrup.",
      "Add lime juice and ice; shake 10 seconds.",
      "Double-strain into a tall glass packed with ice and top with club soda."
    ],
    timer: { type: "shake", seconds: 10, label: "10s Shake" }
  }
];

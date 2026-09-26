// ============================================================================
// BarCraft Master Database
// Pre-populated with User Inventory, Bottle Pricing Architecture, Pantry Matrix,
// Technique Rules & Vast Cocktail Library (137+ Curated Cocktails)
// ============================================================================

export const BUDGETING_RULES = {
  "title": "$200 Base Spirit & Bottle Budgeting Rule",
  "tiers": [
    {
      "tier": "Tier 1: High Capital Allocation ($45\u2013$70+)",
      "allocation": "Bourbon ($50\u2013$65), Tequila Blanco ($50\u2013$65), Peated Scotch ($60\u2013$75)",
      "strategy": "Maximize spend here. Flavor directly scales with proof and agricultural production. For Bourbon and Rye, demand 100+ proof (Bottled-in-Bond or Barrel Proof) so alcohol density withstands ice dilution. For Agave, demand 100% Blue Weber Agave, tahona-crushed, and zero additives.",
      "benchmarks": [
        "Wild Turkey 101 / Rare Breed (Bourbon)",
        "Tequila Ocho / Fortaleza / Siete Leguas (Agave)",
        "Laphroaig 10 (Peated Scotch)"
      ]
    },
    {
      "tier": "Tier 2: Mid-Range Structural Backbones ($25\u2013$38)",
      "allocation": "London Dry Gin ($25\u2013$35), Rye ($25\u2013$35), Aged Rum ($25\u2013$35), Dry Cura\u00e7ao ($32), Campari ($32)",
      "strategy": "High botanical density and proofs between 44\u201350% ABV at modest cost. Beefeater, Tanqueray, and Ford's have intense juniper backbones that hold through citrus and vermouth. Rittenhouse Bonded 100-proof rye dominates Manhattans for under $30.",
      "benchmarks": [
        "Beefeater / Tanqueray / Ford's (Gin)",
        "Rittenhouse Bonded (Rye)",
        "Pierre Ferrand Dry Cura\u00e7ao",
        "Campari"
      ]
    },
    {
      "tier": "Tier 3: Strict Minimum Spending ($15\u2013$22)",
      "allocation": "Vodka ($15\u2013$20), White Rum ($20\u2013$25), Sweet & Dry Vermouth ($14\u2013$20 half bottles)",
      "strategy": "Vodka is chemically defined as neutral spirit without distinctive character. Spending more than $20 on luxury vodka is wasted capital\u2014it tastes identical to Smirnoff or Stolichnaya in cocktails. For Vermouth, always buy 375ml half-bottles and keep them in the fridge.",
      "benchmarks": [
        "Smirnoff / Stolichnaya (Vodka)",
        "Planteray 3 Stars / Probitas (Rum)",
        "Dolin / Cocchi Torino (Vermouth)"
      ]
    },
    {
      "tier": "Tier 4: Pennies DIY Home Production ($1 DIY)",
      "allocation": "Simple Syrup, Demerara Syrup, Honey Syrup, Agave Syrup",
      "strategy": "Never purchase pre-bottled simple syrup ($6\u2013$9 for sugar water). Dissolve equal parts cane sugar in warm water for 2 minutes for under $0.20. Dilute honey and agave 1:1 with warm water to prevent ice coagulation.",
      "benchmarks": [
        "Equal parts white cane sugar : warm water",
        "Equal parts turbinado/demerara : warm water",
        "1:1 raw honey : warm water"
      ]
    }
  ]
};

export const BOTTLE_PRICING_KNOWLEDGE_BASE = {
  "corePhilosophy": "Spend where alcohol density and agricultural terroir determine the cocktail's flavor architecture; economize ruthlessly on neutral carriers and make syrups at home.",
  "categories": [
    {
      "category": "American Whiskey (Bourbon & Rye)",
      "recommendedRange": "$25 \u2013 $60",
      "spendTier": "HIGH",
      "keyInsight": "Proof is king. Look for Bottled-in-Bond (exactly 100 proof) or barrel proof. 80-proof whiskey washes out into watery sugar when stirred with ice or shaken with lemon.",
      "topValuePicks": [
        {
          "name": "Wild Turkey 101 Bourbon",
          "price": "$26\u2013$30",
          "proof": 101,
          "role": "The gold-standard high-proof budget bourbon for Sours and Old Fashioneds."
        },
        {
          "name": "Rittenhouse Rye Bottled-in-Bond",
          "price": "$26\u2013$30",
          "proof": 100,
          "role": "Unbeatable rye spice and proof density for Manhattans and Sazeracs."
        },
        {
          "name": "Elijah Craig Small Batch",
          "price": "$32\u2013$38",
          "proof": 94,
          "role": "Rich charred oak, vanilla, and caramel balance."
        },
        {
          "name": "Wild Turkey Rare Breed",
          "price": "$52\u2013$60",
          "proof": 116.8,
          "role": "Uncut barrel-proof majesty; creates transcendent Old Fashioneds."
        }
      ]
    },
    {
      "category": "Agave Spirits (Tequila & Mezcal)",
      "recommendedRange": "$38 \u2013 $65",
      "spendTier": "HIGH",
      "keyInsight": "Never buy 'Mixto' (51% agave, 49% industrial cane sugar). Always verify '100% de Agave' and prioritize additive-free distilleries. Terroir and slow brick-oven roasting shine cleanly in sours.",
      "topValuePicks": [
        {
          "name": "Tequila Ocho Plata",
          "price": "$50\u2013$60",
          "proof": 80,
          "role": "Single-estate, additive-free benchmark; sublime agave sweetness and pepper."
        },
        {
          "name": "Siete Leguas Blanco",
          "price": "$52\u2013$62",
          "proof": 80,
          "role": "Tahona-milled authentic heritage tequila with earth and citrus depth."
        },
        {
          "name": "Cimarron Blanco",
          "price": "$28\u2013$34 (1 Liter)",
          "proof": 80,
          "role": "Best value 100% agave well spirit on earth for high-volume Margaritas."
        },
        {
          "name": "Del Maguey Vida Mezcal",
          "price": "$38\u2013$45",
          "proof": 84,
          "role": "Artisanal Espad\u00edn roasted in conical earthen pits; definitive smoke and tropical fruit."
        }
      ]
    },
    {
      "category": "Gin (London Dry, Old Tom, Botanical)",
      "recommendedRange": "$22 \u2013 $38",
      "spendTier": "MODERATE",
      "keyInsight": "Do not overspend on boutique floral gins for classic cocktail work. High botanical volume and 44\u201347% ABV density (Beefeater at 44%, Tanqueray at 47.3%) provide the essential juniper skeleton.",
      "topValuePicks": [
        {
          "name": "Beefeater London Dry",
          "price": "$22\u2013$26",
          "proof": 88,
          "role": "Benchmark citrus-forward London dry; flawless in French 75, Gimlets, and Negronis."
        },
        {
          "name": "Tanqueray Export Strength",
          "price": "$25\u2013$30",
          "proof": 94.6,
          "role": "Four-botanical powerhouse that punches cleanly through sweet vermouth."
        },
        {
          "name": "Ford's Gin",
          "price": "$26\u2013$32",
          "proof": 90,
          "role": "Formulated specifically by bartenders as a versatile universal mixing gin."
        },
        {
          "name": "Hayman's Old Tom",
          "price": "$30\u2013$36",
          "proof": 82.8,
          "role": "Rich, subtly sweet historic gin for authentic Martinez and Tom Collins."
        }
      ]
    },
    {
      "category": "Rum & Sugarcane (White, Dark, Agricole, Cacha\u00e7a)",
      "recommendedRange": "$20 \u2013 $36",
      "spendTier": "MODERATE",
      "keyInsight": "Avoid artificially sweetened spiced rums and neutral industrial molasses rums. Look for multi-island blends with high-ester Jamaican pot-still rum or pure fresh cane juice spirits.",
      "topValuePicks": [
        {
          "name": "Planteray (Plantation) 3 Stars",
          "price": "$20\u2013$25",
          "proof": 82.4,
          "role": "Blend of Barbados, Trinidad, and unaged Jamaican pot-still. Unrivaled Daiquiri base."
        },
        {
          "name": "Gosling's Black Seal",
          "price": "$22\u2013$26",
          "proof": 80,
          "role": "Bermudian molasses dark rum; essential float for Dark 'n' Stormy and Mai Tai."
        },
        {
          "name": "Cl\u00e9ment / Rhum J.M Blanc (Agricole)",
          "price": "$30\u2013$36",
          "proof": 100,
          "role": "Distilled from fresh Martinique sugarcane juice with vibrant grassy vegetal notes."
        },
        {
          "name": "Novo Fogo Cacha\u00e7a",
          "price": "$26\u2013$32",
          "proof": 80,
          "role": "Organic Brazilian fresh cane spirit with banana, passionfruit, and grassy notes for Caipirinhas."
        }
      ]
    },
    {
      "category": "Vodka",
      "recommendedRange": "$14 \u2013 $20",
      "spendTier": "LOW (ECONOMIZE)",
      "keyInsight": "Spending >$22 is pure marketing. In double-blind cocktail tests, $16 vodka (Smirnoff, Stolichnaya) performs indistinguishably from $50 bottles in Espresso Martinis, Mules, and Cosmopolitans.",
      "topValuePicks": [
        {
          "name": "Smirnoff No. 21",
          "price": "$14\u2013$17",
          "proof": 80,
          "role": "Consistently rated #1 in blind tastings; ultra-clean neutral ethanol profile."
        },
        {
          "name": "Stolichnaya / Luksusowa",
          "price": "$16\u2013$20",
          "proof": 80,
          "role": "Smooth wheat or Polish potato distillate for clean highballs."
        }
      ]
    },
    {
      "category": "Aromatized Wines (Sweet & Dry Vermouth, Lillet)",
      "recommendedRange": "$12 \u2013 $22",
      "spendTier": "STORAGE-CRITICAL",
      "keyInsight": "Vermouth is fortified wine, NOT a distilled spirit. Once opened, it oxidizes within weeks at room temperature. Buy 375ml half-bottles and keep stored inside the refrigerator at 38\u00b0F.",
      "topValuePicks": [
        {
          "name": "Dolin Blanc / Dry",
          "price": "$12\u2013$16 (375ml)",
          "proof": 35,
          "role": "Clean, alpine herb French vermouth for Dry Martinis and Corpse Revivers."
        },
        {
          "name": "Cocchi Storico di Torino",
          "price": "$14\u2013$18 (375ml)",
          "proof": 32,
          "role": "Rich cacao, vanilla, and rhubarb sweet vermouth; the ultimate Manhattan partner."
        },
        {
          "name": "Carpano Antica Formula",
          "price": "$20\u2013$24 (375ml)",
          "proof": 33,
          "role": "Vanilla-heavy, opulent vermouth for robust 100-proof rye whiskey cocktails."
        }
      ]
    },
    {
      "category": "Specialty Herbal Liqueurs & Amari",
      "recommendedRange": "$24 \u2013 $75",
      "spendTier": "VARIABLE / LONG LASTING",
      "keyInsight": "Used in 0.25\u20130.75 oz measures. A $70 bottle of Green Chartreuse or $35 bottle of Maraschino lasts 40\u201380 cocktails, making the cost per drink only $0.45\u2013$0.90.",
      "topValuePicks": [
        {
          "name": "Campari",
          "price": "$30\u2013$36",
          "proof": 48,
          "role": "Bitter gentian and bitter orange; irreplaceable structural heart of Negroni and Boulevardier."
        },
        {
          "name": "Green Chartreuse",
          "price": "$65\u2013$78",
          "proof": 110,
          "role": "Monastic secret of 130 alpine plants; impossible to substitute in The Last Word."
        },
        {
          "name": "Luxardo Maraschino",
          "price": "$34\u2013$40",
          "proof": 64,
          "role": "Dry cherry pit and herbal aroma; 1 bottle lasts for years in Aviations and Martinezes."
        },
        {
          "name": "Pierre Ferrand Dry Cura\u00e7ao",
          "price": "$32\u2013$38",
          "proof": 80,
          "role": "Bitter Laraha orange peel with French brandy base; replaces cheap cloying triple secs."
        }
      ]
    }
  ]
};

export const MECHANICAL_RULES = [
  {
    "id": "egg-white-sour",
    "title": "Egg White / Foam Sours",
    "badge": "15s Dry + 12s Wet",
    "rule": "Always execute a 15-second dry shake (no ice) to shear albumen proteins into micro-foam, followed by a violent 10\u201312 second wet shake with dense ice. Double-strain through a fine-mesh sieve."
  },
  {
    "id": "spirit-forward-stirred",
    "title": "Spirit-Forward / Stirred (Zero-Citrus)",
    "badge": "35s Stir \u2022 Never Shake",
    "rule": "Zero citrus. Never shake. Stir continuously with solid, dense ice for 30\u201340 seconds to target 20\u201325% dilution and sub-freezing chill without aeration or ice fragments."
  },
  {
    "id": "highballs-carbonation",
    "title": "Highballs & Carbonation",
    "badge": "Vertical Barspoon Lift",
    "rule": "Pack glassware to the lip with dense ice to minimize surface melt. Top with cold carbonated mixers; pull a barspoon vertically from bottom to top exactly once to preserve effervescence."
  }
];

export const INITIAL_INVENTORY = [
  {
    "id": "bourbon",
    "name": "Bourbon",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Wild Turkey 101 / Rare Breed / Elijah Craig",
    "suggestedPrice": "$45\u2013$60",
    "defaultListType": "staples",
    "valueRationale": "Target 100+ proof (Bottled-in-Bond). Higher alcohol density resists melted ice dilution in Old Fashioneds."
  },
  {
    "id": "rye-whiskey",
    "name": "Rye Whiskey",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Old Overholt / Rittenhouse Bonded",
    "suggestedPrice": "$26\u2013$35",
    "defaultListType": "staples",
    "valueRationale": "100-proof bonded rye gives aggressive pepper spice that punches through sweet vermouth in Manhattans."
  },
  {
    "id": "london-dry-gin",
    "name": "London Dry Gin",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Beefeater / Tanqueray / Ford's",
    "suggestedPrice": "$24\u2013$34",
    "defaultListType": "staples",
    "valueRationale": "Target 44\u201347% ABV. High juniper and citrus botanical density provides the essential structural backbone."
  },
  {
    "id": "old-tom-gin",
    "name": "Old Tom Gin",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Hayman's / Ransom",
    "suggestedPrice": "$32\u2013$42",
    "defaultListType": "wishlist",
    "valueRationale": "Subtly sweet, malted 19th-century gin style. Unlocks authentic Martinezes and historic fizzes."
  },
  {
    "id": "barrel-rested-gin",
    "name": "Barrel-Rested Gin",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Barr Hill Tom Cat / Bluecoat",
    "suggestedPrice": "$40\u2013$50",
    "defaultListType": "wishlist",
    "valueRationale": "Charred oak aging marries botanical juniper with vanilla and caramel whiskey notes."
  },
  {
    "id": "tequila-blanco",
    "name": "Tequila Blanco",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Tequila Ocho / Siete Leguas / Fortaleza (100% Blue Agave)",
    "suggestedPrice": "$50\u2013$65",
    "defaultListType": "staples",
    "valueRationale": "Prioritize 100% blue agave, tahona-crushed, additive-free bottles. The fresh agave terroir cannot be replicated."
  },
  {
    "id": "tequila-reposado",
    "name": "Tequila Reposado",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Tequila Ocho Reposado / Siete Leguas",
    "suggestedPrice": "$55\u2013$70",
    "defaultListType": "wishlist",
    "valueRationale": "Aged 2\u201311 months in oak casks; adds mellow vanilla and baking spice to agave cocktails."
  },
  {
    "id": "mezcal",
    "name": "Mezcal",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Del Maguey Vida (Artisanal Espad\u00edn)",
    "suggestedPrice": "$38\u2013$48",
    "defaultListType": "wishlist",
    "valueRationale": "Earthen pit-roasted agave provides unmistakable woodsmoke, vegetal mineral terroir, and tropical fruit."
  },
  {
    "id": "white-rum",
    "name": "White Rum",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Planteray 3 Stars / Probitas",
    "suggestedPrice": "$20\u2013$26",
    "defaultListType": "staples",
    "valueRationale": "Multi-island blend with real pot-still character. Avoid flavorless industrial column-still rums."
  },
  {
    "id": "dark-rum",
    "name": "Dark Rum",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Gosling's Black Seal / Jamaican Pot Still",
    "suggestedPrice": "$24\u2013$34",
    "defaultListType": "wishlist",
    "valueRationale": "High-ester molasses funk and heavy oak color. Essential float for Dark 'n' Stormy and Mai Tai."
  },
  {
    "id": "rhum-agricole",
    "name": "Rhum Agricole Blanc",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Cl\u00e9ment / Rhum J.M Blanc (50% ABV)",
    "suggestedPrice": "$30\u2013$40",
    "defaultListType": "wishlist",
    "valueRationale": "Distilled from 100% pure fresh-pressed Martinique sugarcane juice. Grassy, floral, and vibrant for Ti' Punch."
  },
  {
    "id": "cachaca",
    "name": "Cacha\u00e7a",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Novo Fogo / Avu\u00e1 / Leblon",
    "suggestedPrice": "$25\u2013$34",
    "defaultListType": "wishlist",
    "valueRationale": "Brazilian fresh sugarcane spirit. Vibrant, grassy, and fruity\u2014the indispensable soul of the Caipirinha."
  },
  {
    "id": "vodka",
    "name": "Vodka",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Smirnoff No. 21 / Stolichnaya (80-proof)",
    "suggestedPrice": "$15\u2013$20",
    "defaultListType": "staples",
    "valueRationale": "Defined as neutral spirit without distinctive aroma or taste. Spending >$20 is wasted capital; tastes identical in cocktails."
  },
  {
    "id": "blended-scotch",
    "name": "Blended Scotch",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Monkey Shoulder / Famous Grouse",
    "suggestedPrice": "$28\u2013$38",
    "defaultListType": "wishlist",
    "valueRationale": "Balanced malt and grain blend with honey and orchard fruit. Ideal base for Penicillins and Rob Roys."
  },
  {
    "id": "islay-scotch",
    "name": "Islay Scotch",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Laphroaig 10 / Ardbeg 10",
    "suggestedPrice": "$60\u2013$75",
    "defaultListType": "wishlist",
    "valueRationale": "Extreme peat smoke and medicinal brine. Used in tiny float barspoons; 1 bottle lasts over 100 drinks."
  },
  {
    "id": "cognac",
    "name": "Cognac / French Brandy",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Pierre Ferrand 1840 / Remy Martin 1738",
    "suggestedPrice": "$38\u2013$48",
    "defaultListType": "wishlist",
    "valueRationale": "VS or VSOP French grape brandy. Adds silky grape body and oak spice to Sidecars and Vieux Carr\u00e9."
  },
  {
    "id": "pisco",
    "name": "Pisco",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Barsol Quebranta",
    "suggestedPrice": "$28\u2013$36",
    "defaultListType": "wishlist",
    "valueRationale": "Unaged Peruvian grape distillate. Single-distilled to proof for authentic velvety Pisco Sours."
  },
  {
    "id": "applejack",
    "name": "Applejack",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Laird's Bottled in Bond (100 Proof)",
    "suggestedPrice": "$28\u2013$35",
    "defaultListType": "wishlist",
    "valueRationale": "100-proof American apple brandy. Brings robust baked apple and barrel spice to Pink Ladies."
  },
  {
    "id": "champagne",
    "name": "Sparkling Wine / Champagne / Prosecco",
    "category": "Base Spirits",
    "inStock": true,
    "benchmark": "Dry Brut Prosecco / Champagne (La Marca / Roederer)",
    "suggestedPrice": "$14\u2013$25",
    "defaultListType": "wishlist",
    "valueRationale": "Crisp effervescence for French 75, Spritzes, and Seelbach. Buy dry (Brut) to prevent cloying sweetness."
  },
  {
    "id": "campari",
    "name": "Campari",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Iconic red bitter gentian aperitivo",
    "suggestedPrice": "$30\u2013$36",
    "defaultListType": "staples",
    "valueRationale": "Irreplaceable bitter orange and gentian backbone. Structural heart of Negroni, Boulevardier, and Jungle Bird."
  },
  {
    "id": "aperol",
    "name": "Aperol",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Bittersweet orange & gentian aperitivo (11% ABV)",
    "suggestedPrice": "$24\u2013$30",
    "defaultListType": "wishlist",
    "valueRationale": "Gentle, accessible bittersweet orange. Essential for Paper Plane, Naked & Famous, and Spritzes."
  },
  {
    "id": "sweet-vermouth",
    "name": "Sweet Vermouth",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Cocchi Storico di Torino / Carpano Antica",
    "suggestedPrice": "$14\u2013$20 (375ml)",
    "defaultListType": "staples",
    "valueRationale": "Aromatized wine. ALWAYS buy 375ml half-bottles and store in refrigerator at 38\u00b0F to prevent oxidation."
  },
  {
    "id": "dry-vermouth",
    "name": "Dry Vermouth",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Dolin Dry / Noilly Prat",
    "suggestedPrice": "$12\u2013$16 (375ml)",
    "defaultListType": "staples",
    "valueRationale": "Crisp herbal fortified wine for Dry Martinis. Keep refrigerated; replace every 2\u20133 months."
  },
  {
    "id": "dry-curacao",
    "name": "Dry Curacao / Cointreau / Triple Sec",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Pierre Ferrand Dry Cura\u00e7ao / Cointreau",
    "suggestedPrice": "$30\u2013$38",
    "defaultListType": "staples",
    "valueRationale": "Bitter Laraha orange peel distillate. Essential modifier for authentic Margaritas, Sidecars, and Mai Tais."
  },
  {
    "id": "luxardo-maraschino",
    "name": "Luxardo Maraschino",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "32% ABV, nutty marasca cherry-pit distillate",
    "suggestedPrice": "$34\u2013$40",
    "defaultListType": "wishlist",
    "valueRationale": "Aromatic, dry, nutty botanical profile. Used in barspoons; 1 bottle easily lasts 40+ drinks."
  },
  {
    "id": "green-chartreuse",
    "name": "Green Chartreuse",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "110-proof monastic herbal liqueur",
    "suggestedPrice": "$65\u2013$78",
    "defaultListType": "wishlist",
    "valueRationale": "130 secret botanicals. High price is justified by unreplicable herbal complexity in The Last Word."
  },
  {
    "id": "yellow-chartreuse",
    "name": "Yellow Chartreuse",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Milder, honey-saffron monastic liqueur",
    "suggestedPrice": "$65\u2013$75",
    "defaultListType": "wishlist",
    "valueRationale": "Saffron, honey, and floral sweetness. Core component of Naked & Famous and Greenpoint."
  },
  {
    "id": "st-germain",
    "name": "Elderflower Liqueur (St. Germain)",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "St. Germain Elderflower",
    "suggestedPrice": "$34\u2013$40",
    "defaultListType": "wishlist",
    "valueRationale": "Fresh elderflower blossoms with lychee and pear notes. Lifts gin, tequila, and sparkling fizzes."
  },
  {
    "id": "amaro-nonino",
    "name": "Amaro Nonino",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Alpine herb, grappa-based amaro with orange",
    "suggestedPrice": "$45\u2013$55",
    "defaultListType": "wishlist",
    "valueRationale": "Grappa-based alpine amaro aged in Nevers oak. Required for the world-famous Paper Plane."
  },
  {
    "id": "averna-amaro",
    "name": "Averna Amaro",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Rich Sicilian amaro",
    "suggestedPrice": "$30\u2013$38",
    "defaultListType": "wishlist",
    "valueRationale": "Dark caramel, citrus peel, and Mediterranean herbs. Transforms Manhattan into the Black Manhattan."
  },
  {
    "id": "cynar",
    "name": "Cynar",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Artichoke & herbal bittersweet amaro",
    "suggestedPrice": "$24\u2013$30",
    "defaultListType": "wishlist",
    "valueRationale": "Savory, earthy bittersweet profile. Outstanding in Little Italy and complex Negroni riffs."
  },
  {
    "id": "fernet-branca",
    "name": "Fernet-Branca",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Intensely herbal, menthol-camphor amaro",
    "suggestedPrice": "$30\u2013$38",
    "defaultListType": "wishlist",
    "valueRationale": "Menthol and bitter saffron. Used in dashes and rinses; 1 bottle lasts practically forever."
  },
  {
    "id": "amaretto",
    "name": "Amaretto",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Disaronno / Lazzaroni",
    "suggestedPrice": "$24\u2013$32",
    "defaultListType": "wishlist",
    "valueRationale": "Sweet almond and apricot-pit warmth for Morgenthaler Amaretto Sours and Godfathers."
  },
  {
    "id": "lillet-blanc",
    "name": "Lillet Blanc",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Bordeaux aromatized wine",
    "suggestedPrice": "$18\u2013$24",
    "defaultListType": "wishlist",
    "valueRationale": "Candied orange, honey, and pine resin. Essential for Vesper Martini and Corpse Reviver #2."
  },
  {
    "id": "licor-43",
    "name": "Licor 43",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Spanish vanilla & citrus botanical liqueur",
    "suggestedPrice": "$26\u2013$34",
    "defaultListType": "wishlist",
    "valueRationale": "Vanilla, Mediterranean citrus, and spices. The key to Carajillos and Tequiliation."
  },
  {
    "id": "tia-maria",
    "name": "Tia Maria / Coffee Liqueur",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Tia Maria / Mr. Black / Kahl\u00faa",
    "suggestedPrice": "$25\u2013$34",
    "defaultListType": "staples",
    "valueRationale": "Real roasted Arabica coffee liqueur for Espresso Martinis, White Russians, and coffee builds."
  },
  {
    "id": "absinthe",
    "name": "Absinthe",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Pernod / St. George / Grande Absente",
    "suggestedPrice": "$55\u2013$70",
    "defaultListType": "wishlist",
    "valueRationale": "Used strictly in rinses (Sazerac, Corpse Reviver #2); one 750ml bottle will last a decade."
  },
  {
    "id": "creme-de-violette",
    "name": "Cr\u00e8me de Violette",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Rothman & Winter floral violette",
    "suggestedPrice": "$24\u2013$30",
    "defaultListType": "wishlist",
    "valueRationale": "Floral violet flower petals. Required in quarter-ounce drops for the sky-blue Aviation."
  },
  {
    "id": "white-creme-de-cacao",
    "name": "White Cr\u00e8me de Cacao",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Tempus Fugit / Marie Brizard",
    "suggestedPrice": "$22\u2013$32",
    "defaultListType": "wishlist",
    "valueRationale": "Clear cocoa and vanilla liqueur for 20th Century, Brandy Alexander, and Grasshopper."
  },
  {
    "id": "creme-de-menthe",
    "name": "Green Cr\u00e8me de Menthe",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Tempus Fugit / Giffard Menthe Pastille",
    "suggestedPrice": "$20\u2013$28",
    "defaultListType": "wishlist",
    "valueRationale": "Vibrant spearmint herbal liqueur for the classic Grasshopper and Stinger."
  },
  {
    "id": "cherry-heering",
    "name": "Cherry Heering / Cherry Liqueur",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Peter Heering Cherry Liqueur",
    "suggestedPrice": "$30\u2013$38",
    "defaultListType": "wishlist",
    "valueRationale": "Rich Danish dark cherry liqueur for Singapore Sling and Blood and Sand."
  },
  {
    "id": "drambuie",
    "name": "Drambuie",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Drambuie Scottish Heather Honey Liqueur",
    "suggestedPrice": "$35\u2013$44",
    "defaultListType": "wishlist",
    "valueRationale": "Aged Scotch whiskey infused with heather honey and herbs. Essential for the Rusty Nail."
  },
  {
    "id": "benedictine",
    "name": "B\u00e9n\u00e9dictine",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "B\u00e9n\u00e9dictine D.O.M. Herbal Liqueur",
    "suggestedPrice": "$38\u2013$46",
    "defaultListType": "wishlist",
    "valueRationale": "Cognac-based elixir with 27 herbs and spices. Essential for Vieux Carr\u00e9 and Singapore Sling."
  },
  {
    "id": "grand-marnier",
    "name": "Grand Marnier",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Cordon Rouge Cognac Orange Liqueur",
    "suggestedPrice": "$38\u2013$48",
    "defaultListType": "wishlist",
    "valueRationale": "Cognac backbone infused with bitter Caribbean oranges for premium Manhattans."
  },
  {
    "id": "orgeat",
    "name": "Orgeat Syrup",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Liber & Co. / Small Hand Foods Almond Orgeat",
    "suggestedPrice": "$10\u2013$14",
    "defaultListType": "wishlist",
    "valueRationale": "Toasted almond, orange flower water, and rosewater. Vital for Mai Tais and Trinidad Sours."
  },
  {
    "id": "falernum",
    "name": "Velvet Falernum",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "John D. Taylor's Velvet Falernum",
    "suggestedPrice": "$18\u2013$24",
    "defaultListType": "wishlist",
    "valueRationale": "Barbadian spiced lime, clove, ginger, and almond liqueur. Core component of Tiki drinks."
  },
  {
    "id": "allspice-dram",
    "name": "Allspice / Pimento Dram",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "St. Elizabeth Allspice Dram",
    "suggestedPrice": "$28\u2013$35",
    "defaultListType": "wishlist",
    "valueRationale": "Jamaican pot-still rum steeped with pimento berries. The soul of the Lion's Tail."
  },
  {
    "id": "dry-sherry",
    "name": "Dry Fino / Manzanilla Sherry",
    "category": "Modifiers & Liqueurs",
    "inStock": true,
    "benchmark": "Lustau Jarana Fino / Tio Pepe",
    "suggestedPrice": "$14\u2013$20",
    "defaultListType": "wishlist",
    "valueRationale": "Bone-dry, saline fortified Andalusian wine for low-ABV Bamboo and Adonis cocktails."
  },
  {
    "id": "lime-juice",
    "name": "Fresh Lime Juice",
    "category": "Pantry & Juices",
    "inStock": true,
    "benchmark": "Juiced fresh; never bottled",
    "suggestedPrice": "$3\u2013$5 (bag of limes)",
    "defaultListType": "staples",
    "valueRationale": "Always squeeze fresh limes. Bottled lime juice has preservative oils that ruin cocktail aromatics."
  },
  {
    "id": "lemon-juice",
    "name": "Fresh Lemon Juice",
    "category": "Pantry & Juices",
    "inStock": true,
    "benchmark": "Juiced fresh; never bottled",
    "suggestedPrice": "$3\u2013$5 (bag of lemons)",
    "defaultListType": "staples",
    "valueRationale": "Always squeeze fresh lemons. Acidity balance is the #1 variable in craft sours."
  },
  {
    "id": "grapefruit-juice",
    "name": "Fresh Grapefruit Juice",
    "category": "Pantry & Juices",
    "inStock": true,
    "benchmark": "Freshly squeezed ruby red grapefruit",
    "suggestedPrice": "$3\u2013$5",
    "defaultListType": "staples",
    "valueRationale": "Fresh tart ruby grapefruit pairs with tequila, gin, and mezcal."
  },
  {
    "id": "pineapple-juice",
    "name": "Pineapple Juice",
    "category": "Pantry & Juices",
    "inStock": true,
    "benchmark": "Cold-pressed / Dole 100% canned juice",
    "suggestedPrice": "$3\u2013$6",
    "defaultListType": "staples",
    "valueRationale": "Contains bromelain enzyme; creates dense natural foam heads when shaken violently."
  },
  {
    "id": "cranberry-juice",
    "name": "100% Tart Cranberry Juice",
    "category": "Pantry & Juices",
    "inStock": true,
    "benchmark": "Ocean Spray 100% or pure unsweetened",
    "suggestedPrice": "$4\u2013$6",
    "defaultListType": "wishlist",
    "valueRationale": "Adds ruby color and clean astringency to Cosmopolitans."
  },
  {
    "id": "fresh-espresso",
    "name": "Fresh Espresso / Cold Brew",
    "category": "Pantry & Juices",
    "inStock": true,
    "benchmark": "Fresh hot espresso shot or strong cold brew",
    "suggestedPrice": "$1\u2013$3",
    "defaultListType": "staples",
    "valueRationale": "Hot espresso whips with ice to create the signature velvety crema on Espresso Martinis."
  },
  {
    "id": "cream-of-coconut",
    "name": "Cream of Coconut",
    "category": "Pantry & Juices",
    "inStock": true,
    "benchmark": "Coco Lopez / Coco Real",
    "suggestedPrice": "$4\u2013$6",
    "defaultListType": "wishlist",
    "valueRationale": "Sweetened coconut cream for authentic Pi\u00f1a Coladas and painkillers."
  },
  {
    "id": "simple-syrup",
    "name": "Simple Syrup (1:1)",
    "category": "Syrups",
    "inStock": true,
    "benchmark": "1 part cane sugar : 1 part water",
    "suggestedPrice": "$1 DIY (make at home)",
    "defaultListType": "staples",
    "valueRationale": "Make at home for pennies in 2 minutes: shake equal parts white sugar and warm water."
  },
  {
    "id": "brown-simple-syrup",
    "name": "Brown Simple Syrup",
    "category": "Syrups",
    "inStock": true,
    "benchmark": "1:1 demerara / turbinado sugar",
    "suggestedPrice": "$1 DIY",
    "defaultListType": "staples",
    "valueRationale": "Demerara sugar provides rich molasses depth for Old Fashioneds."
  },
  {
    "id": "honey-syrup",
    "name": "Honey Syrup (1:1)",
    "category": "Syrups",
    "inStock": true,
    "benchmark": "1:1 wildflower honey and warm water",
    "suggestedPrice": "$1 DIY",
    "defaultListType": "staples",
    "valueRationale": "Diluting honey with warm water prevents it from seizing up upon contact with cold ice."
  },
  {
    "id": "agave-syrup",
    "name": "Agave Syrup (1:1)",
    "category": "Syrups",
    "inStock": true,
    "benchmark": "1:1 light/amber agave nectar and water",
    "suggestedPrice": "$1 DIY",
    "defaultListType": "staples",
    "valueRationale": "Natural companion to blue agave spirits (Tequila, Mezcal)."
  },
  {
    "id": "raspberry-syrup",
    "name": "Raspberry Syrup / Grenadine",
    "category": "Syrups",
    "inStock": true,
    "benchmark": "Fresh raspberry reduction or pomegranate grenadine",
    "suggestedPrice": "$2 DIY / $8",
    "defaultListType": "wishlist",
    "valueRationale": "Muddle fresh berries into syrup or buy pure pomegranate grenadine (Liber & Co.)."
  },
  {
    "id": "honey-ginger-syrup",
    "name": "Honey-Ginger Syrup",
    "category": "Syrups",
    "inStock": true,
    "benchmark": "Simmered fresh ginger root in honey syrup",
    "suggestedPrice": "$2 DIY",
    "defaultListType": "wishlist",
    "valueRationale": "Simmer sliced raw ginger root in equal parts honey and water for Penicillins."
  },
  {
    "id": "maple-syrup",
    "name": "Maple Syrup",
    "category": "Syrups",
    "inStock": true,
    "benchmark": "Grade A dark robust maple syrup",
    "suggestedPrice": "$6\u2013$9",
    "defaultListType": "staples",
    "valueRationale": "Rich woodsy sweetness for autumn whiskey sours and flips."
  },
  {
    "id": "cold-brew",
    "name": "Cold Brew Coffee",
    "category": "Pantry & Juices",
    "inStock": true,
    "benchmark": "Smooth cold brew concentrate",
    "suggestedPrice": "$3\u2013$5",
    "defaultListType": "staples",
    "valueRationale": "Smooth, low-acid coffee base for low-proof coffee cocktails."
  },
  {
    "id": "heavy-cream",
    "name": "Heavy Cream",
    "category": "Pantry & Juices",
    "inStock": true,
    "benchmark": "Organic heavy whipping cream",
    "suggestedPrice": "$3\u2013$5",
    "defaultListType": "staples",
    "valueRationale": "Rich dairy texture for Ramos Gin Fizz, White Russian, and Grasshopper."
  },
  {
    "id": "dry-red-wine",
    "name": "Dry Red Wine",
    "category": "Pantry & Juices",
    "inStock": true,
    "benchmark": "Cabernet Sauvignon, Syrah, or Malbec",
    "suggestedPrice": "$10\u2013$15",
    "defaultListType": "wishlist",
    "valueRationale": "Floating 0.5 oz creates the iconic crimson collar on a New York Sour."
  },
  {
    "id": "club-soda",
    "name": "Club Soda",
    "category": "Mixers",
    "inStock": true,
    "benchmark": "High-carbonation soda water (Q Mixers / Fever-Tree)",
    "suggestedPrice": "$4\u2013$7",
    "defaultListType": "staples",
    "valueRationale": "Cold high-carbonation bubbles lift aromatics without adding sugar."
  },
  {
    "id": "ginger-beer",
    "name": "Spicy Ginger Beer",
    "category": "Mixers",
    "inStock": true,
    "benchmark": "Fever-Tree / Reed's Extra Ginger Beer",
    "suggestedPrice": "$5\u2013$8",
    "defaultListType": "staples",
    "valueRationale": "Real fiery ginger root bite for Mules, Bucks, and Dark 'n' Stormies."
  },
  {
    "id": "angostura-bitters",
    "name": "Angostura Aromatic Bitters",
    "category": "Bitters",
    "inStock": true,
    "benchmark": "Trinidadian classic aromatic gentian bitters",
    "suggestedPrice": "$10\u2013$14",
    "defaultListType": "staples",
    "valueRationale": "The bartender's salt and pepper. Essential in 80% of classic cocktails."
  },
  {
    "id": "australian-bitters",
    "name": "Australian Bitters",
    "category": "Bitters",
    "inStock": true,
    "benchmark": "Botanical spice bitters",
    "suggestedPrice": "$10\u2013$14",
    "defaultListType": "wishlist",
    "valueRationale": "Spiced Australian botanicals for unique aromatic complexity."
  },
  {
    "id": "orange-bitters",
    "name": "Orange Bitters",
    "category": "Bitters",
    "inStock": true,
    "benchmark": "Regan's No. 6 or Angostura Orange",
    "suggestedPrice": "$10\u2013$14",
    "defaultListType": "staples",
    "valueRationale": "Bitter orange peel and cardamom botanicals for Martinis and Old Fashioneds."
  },
  {
    "id": "apple-bitters",
    "name": "Apple Bitters",
    "category": "Bitters",
    "inStock": true,
    "benchmark": "Woodsy crisp apple bitters",
    "suggestedPrice": "$10\u2013$14",
    "defaultListType": "wishlist",
    "valueRationale": "Crisp spiced orchard notes for seasonal whiskey drinks."
  },
  {
    "id": "peychauds-bitters",
    "name": "Peychaud's Bitters",
    "category": "Bitters",
    "inStock": true,
    "benchmark": "New Orleans anise-forward red bitters",
    "suggestedPrice": "$10\u2013$14",
    "defaultListType": "wishlist",
    "valueRationale": "Floral cherry-red bitters; vital for authentic Sazeracs and Vieux Carr\u00e9."
  },
  {
    "id": "chocolate-bitters",
    "name": "Chocolate Bitters",
    "category": "Bitters",
    "inStock": true,
    "benchmark": "Scrappy's or Fee Brothers Aztec Chocolate",
    "suggestedPrice": "$10\u2013$14",
    "defaultListType": "wishlist",
    "valueRationale": "Rich cocoa and cinnamon for rum and dark spirit stirred builds."
  },
  {
    "id": "blood-orange-bitters",
    "name": "Blood Orange Bitters",
    "category": "Bitters",
    "inStock": true,
    "benchmark": "Citrus floral bitters",
    "suggestedPrice": "$10\u2013$14",
    "defaultListType": "wishlist",
    "valueRationale": "Zesty tart citrus aromatics."
  },
  {
    "id": "lime-bitters",
    "name": "Lime Bitters",
    "category": "Bitters",
    "inStock": true,
    "benchmark": "Zesty aromatic lime peel bitters",
    "suggestedPrice": "$10\u2013$14",
    "defaultListType": "wishlist",
    "valueRationale": "Intense cold-pressed lime oils."
  },
  {
    "id": "spicy-bitters",
    "name": "Spicy Bitters",
    "category": "Bitters",
    "inStock": true,
    "benchmark": "Habanero or chili bitters",
    "suggestedPrice": "$10\u2013$14",
    "defaultListType": "wishlist",
    "valueRationale": "Controlled capsaicin heat for Margaritas and Mezcal builds."
  },
  {
    "id": "fresh-eggs",
    "name": "Fresh Eggs (Albumen)",
    "category": "Produce & Perishables",
    "inStock": true,
    "benchmark": "Grade A organic eggs (albumen for foam)",
    "suggestedPrice": "$4\u2013$6",
    "defaultListType": "staples",
    "valueRationale": "Egg white shears into microscopic velvet foam. Dry shake first for 15s."
  },
  {
    "id": "fresh-strawberries",
    "name": "Fresh Strawberries",
    "category": "Produce & Perishables",
    "inStock": true,
    "benchmark": "Ripe sweet strawberries",
    "suggestedPrice": "$3\u2013$5",
    "defaultListType": "wishlist",
    "valueRationale": "Muddle fresh for Smashes and Margaritas."
  },
  {
    "id": "fresh-ginger-root",
    "name": "Fresh Ginger Root",
    "category": "Produce & Perishables",
    "inStock": true,
    "benchmark": "Peeled raw pungent ginger",
    "suggestedPrice": "$1\u2013$2",
    "defaultListType": "wishlist",
    "valueRationale": "Raw gingerols provide intense heat for Fresh Ginger Gold Rush."
  },
  {
    "id": "fresh-mint",
    "name": "Fresh Mint",
    "category": "Produce & Perishables",
    "inStock": true,
    "benchmark": "Aromatic spearmint leaves",
    "suggestedPrice": "$2\u2013$3",
    "defaultListType": "staples",
    "valueRationale": "Clap mint between hands to release aromatic menthol oils without tearing bitter veins."
  },
  {
    "id": "fresh-cucumber",
    "name": "Fresh Cucumber",
    "category": "Produce & Perishables",
    "inStock": true,
    "benchmark": "Crisp English cucumber",
    "suggestedPrice": "$1\u2013$2",
    "defaultListType": "wishlist",
    "valueRationale": "Cool vegetal aroma for gin highballs."
  },
  {
    "id": "fresh-raspberries",
    "name": "Fresh Raspberries",
    "category": "Produce & Perishables",
    "inStock": true,
    "benchmark": "Plump fresh raspberries",
    "suggestedPrice": "$3\u2013$5",
    "defaultListType": "wishlist",
    "valueRationale": "Muddle into gin and tequila for berry sours and Clover Clubs."
  },
  {
    "id": "fresh-peach",
    "name": "Fresh Peach",
    "category": "Produce & Perishables",
    "inStock": true,
    "benchmark": "Ripe peeled juicy peach",
    "suggestedPrice": "$2\u2013$3",
    "defaultListType": "wishlist",
    "valueRationale": "Puree or muddle for authentic Venetian Bellinis."
  },
  {
    "id": "fresh-basil",
    "name": "Fresh Basil",
    "category": "Produce & Perishables",
    "inStock": true,
    "benchmark": "Sweet Italian Genovese basil",
    "suggestedPrice": "$2\u2013$3",
    "defaultListType": "wishlist",
    "valueRationale": "Muddle with gin and lemon for the vibrant green Gin Basil Smash."
  }
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
  },
  {
  "id": "aviation",
  "name": "Aviation",
  "category": "Equal-Parts & Modern Classics",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Hard Shake & Double Strain",
  "techniqueRule": "Measure Cr\u00e8me de Violette with extreme precision. More than 0.25 oz overwhelms the delicate gin and Maraschino and turns the drink soap-purple.",
  "tags": [
    "Gin",
    "Floral",
    "Citrusy",
    "Classic",
    "Hugo Ensslin 1916"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 2,
    "sour": 3,
    "bitter": 1,
    "herbal": 4
  },
  "timer": {
    "label": "Hard Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "london-dry-gin",
      "name": "London Dry Gin",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "luxardo-maraschino",
      "name": "Luxardo Maraschino",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "creme-de-violette",
      "name": "Cr\u00e8me de Violette",
      "amount": 0.25,
      "unit": "oz"
    },
    {
      "id": "lemon-juice",
      "name": "Fresh Lemon Juice",
      "amount": 0.75,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine London Dry Gin, Luxardo Maraschino, Cr\u00e8me de Violette, and fresh lemon juice in a shaker tin.",
    "Fill with dense ice and shake hard for 12 seconds until thoroughly chilled and aerated.",
    "Fine-strain into a chilled coupe glass. Garnish with a brandied Luxardo cherry dropped into the bottom."
  ]
},
  {
  "id": "french-75",
  "name": "French 75",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Flute or Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Shake & Top with Champagne",
  "techniqueRule": "Shake the base ingredients aggressively with ice, strain into the flute, and gently top with cold dry sparkling wine. Lift gently with barspoon once.",
  "tags": [
    "Gin",
    "Sparkling",
    "Effervescent",
    "Citrusy",
    "Classic Paris 1915"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 2,
    "sour": 3,
    "bitter": 0,
    "herbal": 2
  },
  "timer": {
    "label": "Shake Base",
    "seconds": 10
  },
  "ingredients": [
    {
      "id": "london-dry-gin",
      "name": "London Dry Gin",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "lemon-juice",
      "name": "Fresh Lemon Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "champagne",
      "name": "Sparkling Wine / Champagne / Prosecco",
      "amount": 2.5,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine gin, fresh lemon juice, and simple syrup in a shaker tin with ice.",
    "Shake vigorously for 10 seconds until cold.",
    "Strain into a chilled champagne flute.",
    "Top with 2.5 oz cold dry Champagne or Prosecco. Express lemon peel over the surface."
  ]
},
  {
  "id": "sidecar",
  "name": "Sidecar",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Coupe (Sugar Rim Optional)",
  "ice": "None (Chilled Glass)",
  "method": "Vigorous Shake",
  "techniqueRule": "The French school balances rich grape brandy with dry cura\u00e7ao and crisp lemon juice. Use a 2 : 0.75 : 0.75 ratio for pristine crispness.",
  "tags": [
    "Cognac",
    "Citrusy",
    "Tart",
    "Classic Paris 1920s"
  ],
  "flavor": {
    "boozy": 4,
    "sweet": 2,
    "sour": 4,
    "bitter": 0,
    "herbal": 1
  },
  "timer": {
    "label": "Vigorous Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "cognac",
      "name": "Cognac / French Brandy",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "dry-curacao",
      "name": "Dry Curacao / Cointreau / Triple Sec",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "lemon-juice",
      "name": "Fresh Lemon Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.25,
      "unit": "oz",
      "optional": true
    }
  ],
  "instructions": [
    "Optionally sugar-rim half of a chilled coupe glass with a lemon wedge and superfine cane sugar.",
    "Add Cognac, Dry Cura\u00e7ao, fresh lemon juice, and simple syrup to shaker tin with ice.",
    "Shake violently for 12 seconds.",
    "Double-strain into the prepared coupe. Garnish with an expressed orange twist."
  ]
},
  {
  "id": "espresso-martini",
  "name": "Espresso Martini",
  "category": "Equal-Parts & Modern Classics",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Violent Aeration Shake",
  "techniqueRule": "Shaking hot or freshly pulled espresso with cold ice and vodka creates a magnificent, dense crema foam head. Shake as hard as humanly possible.",
  "tags": [
    "Vodka",
    "Coffee",
    "Dick Bradsell 1983",
    "Rich",
    "Modern Classic"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 3,
    "sour": 0,
    "bitter": 3,
    "herbal": 0
  },
  "timer": {
    "label": "Violent Shake for Crema",
    "seconds": 14
  },
  "ingredients": [
    {
      "id": "vodka",
      "name": "Vodka",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "tia-maria",
      "name": "Tia Maria / Coffee Liqueur",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "fresh-espresso",
      "name": "Fresh Espresso / Cold Brew",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.25,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Brew a fresh shot of espresso (or use rich cold-brew concentrate).",
    "Combine vodka, coffee liqueur, espresso, and simple syrup in your shaker tin.",
    "Fill tin with large, solid ice cubes. Shake with maximum velocity for 14 seconds.",
    "Fine strain immediately into a chilled coupe to lay down a silky dense crema head.",
    "Garnish with 3 coffee beans placed in a triangle representing health, wealth, and happiness."
  ]
},
  {
  "id": "cosmopolitan",
  "name": "Cosmopolitan",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Coupe or Martini",
  "ice": "None (Chilled Glass)",
  "method": "Crisp Shake & Double Strain",
  "techniqueRule": "Toby Cecchini's 1988 Odeon spec: 100% tart cranberry juice is used for pastel pink hue and dry astringency, not high-fructose sweetness.",
  "tags": [
    "Vodka",
    "Citrusy",
    "Modern Classic",
    "NYC 1988",
    "Iconic"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 2,
    "sour": 4,
    "bitter": 1,
    "herbal": 0
  },
  "timer": {
    "label": "Crisp Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "vodka",
      "name": "Vodka",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "dry-curacao",
      "name": "Dry Curacao / Cointreau / Triple Sec",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "cranberry-juice",
      "name": "100% Tart Cranberry Juice",
      "amount": 0.5,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine vodka, Cointreau or Dry Cura\u00e7ao, fresh lime juice, and cranberry juice in shaker.",
    "Fill with dense ice and shake hard for 12 seconds.",
    "Double-strain into a chilled coupe glass. Garnish with a flamed orange peel coin."
  ]
},
  {
  "id": "dry-martini",
  "name": "Classic Dry Martini",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Nick & Nora or Coupe",
  "ice": "None (Chilled Glass)",
  "method": "35-Second Cold Stir",
  "techniqueRule": "Zero citrus. Never shake. Stir continuously with solid ice for 35 seconds to reach -2\u00b0C and target 22% dilution without cloudy air bubbles.",
  "tags": [
    "Gin",
    "Dry",
    "Spirit-Forward",
    "Classic",
    "Stirred"
  ],
  "flavor": {
    "boozy": 5,
    "sweet": 0,
    "sour": 0,
    "bitter": 1,
    "herbal": 4
  },
  "timer": {
    "label": "Continuous Cold Stir",
    "seconds": 35
  },
  "ingredients": [
    {
      "id": "london-dry-gin",
      "name": "London Dry Gin",
      "amount": 2.5,
      "unit": "oz"
    },
    {
      "id": "dry-vermouth",
      "name": "Dry Vermouth",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "orange-bitters",
      "name": "Orange Bitters",
      "amount": 1,
      "unit": "dash"
    }
  ],
  "instructions": [
    "Pre-chill your Nick & Nora or martini glass with ice water.",
    "Add gin, refrigerated dry vermouth, and a dash of orange bitters to a mixing glass.",
    "Pack glass with solid ice and stir smoothly for 35 seconds.",
    "Discard chilling ice from glass and strain with a julep strainer.",
    "Express oils from a lemon peel twist across the top, or garnish with a Spanish olive."
  ]
},
  {
  "id": "vodka-martini",
  "name": "Classic Vodka Martini",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Nick & Nora or Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Cold Stir",
  "techniqueRule": "Ultra-clean and freezing cold. Stirring preserves crystal clarity and silky texture.",
  "tags": [
    "Vodka",
    "Dry",
    "Spirit-Forward",
    "Clean"
  ],
  "flavor": {
    "boozy": 5,
    "sweet": 0,
    "sour": 0,
    "bitter": 1,
    "herbal": 1
  },
  "timer": {
    "label": "Cold Stir",
    "seconds": 35
  },
  "ingredients": [
    {
      "id": "vodka",
      "name": "Vodka",
      "amount": 2.5,
      "unit": "oz"
    },
    {
      "id": "dry-vermouth",
      "name": "Dry Vermouth",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "orange-bitters",
      "name": "Orange Bitters",
      "amount": 1,
      "unit": "dash",
      "optional": true
    }
  ],
  "instructions": [
    "Combine vodka and dry vermouth in a mixing glass with clean ice.",
    "Stir gracefully for 35 seconds until freezing cold.",
    "Strain into a pre-chilled glass. Garnish with a lemon twist or Castelvetrano olive."
  ]
},
  {
  "id": "vesper-martini",
  "name": "Vesper Martini",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Shaken Cold (Ian Fleming 1953)",
  "techniqueRule": "James Bond's Casino Royale formula: Three measures of Gordon's, one of vodka, half of Kina Lillet (Lillet Blanc). Shaken until ice-cold.",
  "tags": [
    "Gin",
    "Vodka",
    "Spirit-Forward",
    "Ian Fleming",
    "Historic"
  ],
  "flavor": {
    "boozy": 5,
    "sweet": 1,
    "sour": 0,
    "bitter": 1,
    "herbal": 3
  },
  "timer": {
    "label": "Shaken Ice-Cold",
    "seconds": 15
  },
  "ingredients": [
    {
      "id": "london-dry-gin",
      "name": "London Dry Gin",
      "amount": 2.25,
      "unit": "oz"
    },
    {
      "id": "vodka",
      "name": "Vodka",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "lillet-blanc",
      "name": "Lillet Blanc",
      "amount": 0.5,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine gin, vodka, and Lillet Blanc in a shaker tin.",
    "Fill with ice and shake hard until ice crystals form on the shaker wall.",
    "Double strain into a deeply chilled goblet or coupe.",
    "Garnish with a large, thin slice of lemon peel."
  ]
},
  {
  "id": "gimlet",
  "name": "Classic Gin Gimlet",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Violent Shake",
  "techniqueRule": "Skip bottled preserved lime cordial. Freshly squeezed lime juice and 1:1 simple syrup with 47% ABV London dry gin creates the definitive modern craft gimlet.",
  "tags": [
    "Gin",
    "Citrusy",
    "Classic",
    "British Naval"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 2,
    "sour": 4,
    "bitter": 0,
    "herbal": 3
  },
  "timer": {
    "label": "Violent Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "london-dry-gin",
      "name": "London Dry Gin",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.75,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Add gin, fresh lime juice, and simple syrup to shaker tin with ice.",
    "Shake vigorously for 12 seconds.",
    "Double-strain into a chilled coupe glass. Garnish with a thin lime wheel."
  ]
},
  {
  "id": "vodka-gimlet",
  "name": "Vodka Gimlet",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Coupe or Rocks",
  "ice": "None or Large Cube",
  "method": "Violent Shake",
  "techniqueRule": "Clean and crisp; the neutral vodka lets the tart lime oil and cane sugar shine through with pure clarity.",
  "tags": [
    "Vodka",
    "Citrusy",
    "Refreshing",
    "Clean"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 2,
    "sour": 4,
    "bitter": 0,
    "herbal": 0
  },
  "timer": {
    "label": "Violent Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "vodka",
      "name": "Vodka",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.75,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine vodka, fresh lime juice, and simple syrup in shaker with ice.",
    "Shake hard for 12 seconds.",
    "Strain into a chilled coupe or over fresh ice in a rocks glass. Garnish with a lime wheel."
  ]
},
  {
  "id": "southside",
  "name": "Southside",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Muddle & Shake",
  "techniqueRule": "Gently slap the mint before shaking to break the aromatic oil veins without turning the drink bitter.",
  "tags": [
    "Gin",
    "Mint",
    "Citrusy",
    "Refreshing",
    "Chicago 1920s"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 2,
    "sour": 3,
    "bitter": 0,
    "herbal": 4
  },
  "timer": {
    "label": "Shake with Mint",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "london-dry-gin",
      "name": "London Dry Gin",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "lemon-juice",
      "name": "Fresh Lemon Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "fresh-mint",
      "name": "Fresh Mint",
      "amount": 6,
      "unit": "leaves",
      "note": "Clapped / shaken"
    }
  ],
  "instructions": [
    "Clap mint leaves sharply between your palms and drop into shaker tin.",
    "Add gin, lemon juice, simple syrup, and ice.",
    "Shake vigorously for 12 seconds.",
    "Double strain through a fine-mesh strainer into a chilled coupe. Float a single mint leaf on top."
  ]
},
  {
  "id": "moscow-mule",
  "name": "Moscow Mule",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Copper Mug or Highball",
  "ice": "Crushed Ice",
  "method": "Build in Glass",
  "techniqueRule": "Pack mug with crushed ice. Add vodka and fresh lime juice, top with fiery ginger beer, and lift once with a barspoon.",
  "tags": [
    "Vodka",
    "Ginger",
    "Effervescent",
    "1941 Los Angeles",
    "Highball"
  ],
  "flavor": {
    "boozy": 2,
    "sweet": 2,
    "sour": 3,
    "bitter": 0,
    "herbal": 2
  },
  "ingredients": [
    {
      "id": "vodka",
      "name": "Vodka",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "ginger-beer",
      "name": "Spicy Ginger Beer",
      "amount": 4.0,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Squeeze 0.5 oz fresh lime juice into a copper mug or highball glass.",
    "Add 2.0 oz vodka.",
    "Fill mug to the brim with crushed ice.",
    "Top with 4.0 oz spicy ginger beer.",
    "Gently stir to blend. Garnish with a lime wheel and a slapped sprig of fresh mint."
  ]
},
  {
  "id": "classic-mojito",
  "name": "Classic Mojito",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Highball",
  "ice": "Crushed Ice",
  "method": "Gentle Muddle & Swizzle",
  "techniqueRule": "Never shred the mint. Gently press mint leaves with simple syrup to extract menthol oils. Pack with crushed ice and churn.",
  "tags": [
    "White Rum",
    "Mint",
    "Cuba",
    "Refreshing",
    "Summer"
  ],
  "flavor": {
    "boozy": 2,
    "sweet": 3,
    "sour": 3,
    "bitter": 0,
    "herbal": 4
  },
  "ingredients": [
    {
      "id": "white-rum",
      "name": "White Rum",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "fresh-mint",
      "name": "Fresh Mint",
      "amount": 8,
      "unit": "leaves"
    },
    {
      "id": "club-soda",
      "name": "Club Soda",
      "amount": 2.0,
      "unit": "oz"
    }
  ],
  "instructions": [
    "In a highball glass, gently muddle fresh mint leaves with simple syrup and lime juice.",
    "Add white rum and fill glass halfway with crushed ice.",
    "Swizzle or stir briskly with a barspoon until frosty on the outside.",
    "Top with more crushed ice and splash 2 oz cold club soda over the top.",
    "Garnish with a generous bouquet of mint sprigs."
  ]
},
  {
  "id": "caipirinha",
  "name": "Caipirinha",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Double Rocks",
  "ice": "Crushed Ice",
  "method": "Direct Muddle in Glass",
  "techniqueRule": "The national cocktail of Brazil. Cut half a fresh lime into wedges, muddle aggressively with sugar to express essential rind oils, add Cacha\u00e7a, and churn with crushed ice.",
  "tags": [
    "Cacha\u00e7a",
    "Citrusy",
    "Brazil",
    "National Drink",
    "Muddled"
  ],
  "flavor": {
    "boozy": 4,
    "sweet": 3,
    "sour": 4,
    "bitter": 1,
    "herbal": 2
  },
  "ingredients": [
    {
      "id": "cachaca",
      "name": "Cacha\u00e7a",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.75,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Cut half a fresh lime into small wedges and place in a double rocks glass.",
    "Add 0.75 oz simple syrup (or 2 tsp granulated sugar).",
    "Muddle firmly to extract all lime juice and aromatic peel oils.",
    "Add 2.0 oz Cacha\u00e7a.",
    "Fill glass completely with crushed ice and stir thoroughly to blend and frost."
  ]
},
  {
  "id": "ti-punch",
  "name": "Ti' Punch (Petit Punch)",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Small Tumbler / Rocks",
  "ice": "None or 1 Small Cube (Tradition: Neat)",
  "method": "Swizzle in Glass",
  "techniqueRule": "'Chacun pr\u00e9pare sa propre mort' (Each person prepares their own death). Squeeze a coin disc of fresh lime into cane syrup and Rhum Agricole.",
  "tags": [
    "Rhum Agricole",
    "Martinique",
    "Cane Spirit",
    "Terroir",
    "Historic"
  ],
  "flavor": {
    "boozy": 5,
    "sweet": 2,
    "sour": 3,
    "bitter": 0,
    "herbal": 3
  },
  "ingredients": [
    {
      "id": "rhum-agricole",
      "name": "Rhum Agricole Blanc",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.25,
      "unit": "oz",
      "note": "Preferably cane syrup"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.25,
      "unit": "oz",
      "note": "Squeezed lime coin"
    }
  ],
  "instructions": [
    "Slice a small coin of lime peel with a disc of fruit pulp.",
    "Squeeze the lime coin into a small tumbler glass and drop the peel inside.",
    "Add 0.25 oz cane syrup or brown simple syrup.",
    "Pour in 2.0 oz of 50% ABV Rhum Agricole Blanc.",
    "Swizzle gently with a bois l\u00e9l\u00e9 or barspoon. Sip neat or with a single ice cube."
  ]
},
  {
  "id": "pina-colada",
  "name": "Pi\u00f1a Colada",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Hurricane or Highball",
  "ice": "Crushed Ice",
  "method": "Violent Shake & Churn",
  "techniqueRule": "Ramon 'Monchito' Marrero 1954 Puerto Rico spec. High-speed shaking whips fresh pineapple juice bromelain enzyme and cream of coconut into a velvety froth without needing an electric blender.",
  "tags": [
    "Rum",
    "Tropical",
    "Puerto Rico 1954",
    "Coconut",
    "Summer"
  ],
  "flavor": {
    "boozy": 2,
    "sweet": 4,
    "sour": 2,
    "bitter": 0,
    "herbal": 0
  },
  "timer": {
    "label": "Violent Whip Shake",
    "seconds": 15
  },
  "ingredients": [
    {
      "id": "white-rum",
      "name": "White Rum",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "dark-rum",
      "name": "Dark Rum",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "pineapple-juice",
      "name": "Pineapple Juice",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "cream-of-coconut",
      "name": "Cream of Coconut",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.5,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine white rum, dark rum, pineapple juice, cream of coconut, and fresh lime juice in shaker.",
    "Add 1 cup of crushed ice and shake with maximum violence for 15 seconds until thick and frosty.",
    "Pour unstrained into a hurricane glass.",
    "Garnish with a fresh pineapple wedge, cherry, and mint bouquet."
  ]
},
  {
  "id": "classic-mai-tai",
  "name": "Classic Mai Tai (1944 Trader Vic)",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Double Rocks",
  "ice": "Crushed Ice",
  "method": "Violent Shake & Dirty Dump",
  "techniqueRule": "The original 1944 Oakland formula: aged dark Jamaican rum blended with grassy Agricole, French dry cura\u00e7ao, rich almond orgeat, and fresh lime juice. Never use pineapple or orange juice in a real Mai Tai!",
  "tags": [
    "Rum",
    "Tiki",
    "Trader Vic 1944",
    "Orgeat",
    "Citrusy"
  ],
  "flavor": {
    "boozy": 4,
    "sweet": 3,
    "sour": 4,
    "bitter": 0,
    "herbal": 2
  },
  "timer": {
    "label": "Tiki Aeration Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "dark-rum",
      "name": "Dark Rum",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "rhum-agricole",
      "name": "Rhum Agricole Blanc",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "dry-curacao",
      "name": "Dry Curacao / Cointreau / Triple Sec",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "orgeat",
      "name": "Orgeat Syrup",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.25,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.75,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine both rums, dry cura\u00e7ao, orgeat, simple syrup, and fresh lime juice in shaker.",
    "Fill shaker with 1 cup of crushed ice and a few cubes.",
    "Shake vigorously for 12 seconds until tin is frosted.",
    "Pour entire contents (dirty dump) into a double rocks glass.",
    "Invert the spent lime half on top to represent an island, and plant a mint sprig to resemble a palm tree."
  ]
},
  {
  "id": "zombie",
  "name": "The Zombie",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Zombie Glass or Highball",
  "ice": "Crushed Ice",
  "method": "Hard Shake",
  "techniqueRule": "Donn Beach 1934 Hollywood formula. Three distinct rums balanced with falernum, grapefruit, lime, and a subtle whisper of absinthe and grenadine.",
  "tags": [
    "Rum",
    "Tiki",
    "Donn Beach 1934",
    "Potent",
    "Complex"
  ],
  "flavor": {
    "boozy": 5,
    "sweet": 3,
    "sour": 3,
    "bitter": 1,
    "herbal": 3
  },
  "timer": {
    "label": "Hard Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "white-rum",
      "name": "White Rum",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "dark-rum",
      "name": "Dark Rum",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "grapefruit-juice",
      "name": "Fresh Grapefruit Juice",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "falernum",
      "name": "Velvet Falernum",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "raspberry-syrup",
      "name": "Raspberry Syrup / Grenadine",
      "amount": 0.25,
      "unit": "oz"
    },
    {
      "id": "absinthe",
      "name": "Absinthe",
      "amount": 1,
      "unit": "dash"
    },
    {
      "id": "angostura-bitters",
      "name": "Angostura Aromatic Bitters",
      "amount": 1,
      "unit": "dash"
    }
  ],
  "instructions": [
    "Combine all ingredients in a cocktail shaker with a generous cup of crushed ice.",
    "Shake with high energy for 12 seconds.",
    "Strain into a tall glass packed with fresh crushed ice.",
    "Garnish with a mint bouquet and a brandied cherry."
  ]
},
  {
  "id": "singapore-sling",
  "name": "Singapore Sling",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Highball or Hurricane",
  "ice": "Highball Ice",
  "method": "Shake & Top with Club Soda",
  "techniqueRule": "Ngiam Tong Boon 1915, Raffles Hotel. Rich Cherry Heering and B\u00e9n\u00e9dictine dance with gin, pineapple, and citrus, crowned with soda.",
  "tags": [
    "Gin",
    "Fruity",
    "Historic",
    "Raffles Hotel 1915",
    "Tiki"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 3,
    "sour": 3,
    "bitter": 1,
    "herbal": 3
  },
  "timer": {
    "label": "Vigorous Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "london-dry-gin",
      "name": "London Dry Gin",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "cherry-heering",
      "name": "Cherry Heering / Cherry Liqueur",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "dry-curacao",
      "name": "Dry Curacao / Cointreau / Triple Sec",
      "amount": 0.25,
      "unit": "oz"
    },
    {
      "id": "benedictine",
      "name": "B\u00e9n\u00e9dictine",
      "amount": 0.25,
      "unit": "oz"
    },
    {
      "id": "pineapple-juice",
      "name": "Pineapple Juice",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "raspberry-syrup",
      "name": "Raspberry Syrup / Grenadine",
      "amount": 0.25,
      "unit": "oz"
    },
    {
      "id": "angostura-bitters",
      "name": "Angostura Aromatic Bitters",
      "amount": 1,
      "unit": "dash"
    },
    {
      "id": "club-soda",
      "name": "Club Soda",
      "amount": 1.0,
      "unit": "oz",
      "optional": true
    }
  ],
  "instructions": [
    "Add gin, cherry heering, cura\u00e7ao, B\u00e9n\u00e9dictine, pineapple juice, lime juice, grenadine, and bitters to shaker with ice.",
    "Shake vigorously for 12 seconds.",
    "Strain into a tall ice-filled glass. Top with a splash of club soda.",
    "Garnish with a pineapple wedge and maraschino cherry."
  ]
},
  {
  "id": "blood-and-sand",
  "name": "Blood and Sand",
  "category": "Equal-Parts & Modern Classics",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Equal-Parts Hard Shake",
  "techniqueRule": "Named after Rudolph Valentino's 1922 bullfighter film. Scotch, sweet vermouth, Cherry Heering, and fresh citrus. Shake violently to combine.",
  "tags": [
    "Scotch",
    "Equal-Parts",
    "Classic 1922",
    "Fruity",
    "Unique"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 3,
    "sour": 2,
    "bitter": 1,
    "herbal": 2
  },
  "timer": {
    "label": "Hard Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "blended-scotch",
      "name": "Blended Scotch",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "cherry-heering",
      "name": "Cherry Heering / Cherry Liqueur",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "sweet-vermouth",
      "name": "Sweet Vermouth",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "grapefruit-juice",
      "name": "Fresh Grapefruit Juice",
      "amount": 0.75,
      "unit": "oz",
      "note": "Fresh orange or ruby grapefruit"
    }
  ],
  "instructions": [
    "Combine blended Scotch, Cherry Heering, sweet vermouth, and fresh juice in shaker with ice.",
    "Shake hard for 12 seconds.",
    "Strain into a chilled coupe glass. Garnish with a flamed orange peel."
  ]
},
  {
  "id": "bramble",
  "name": "The Bramble",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Old Fashioned / Rocks",
  "ice": "Crushed Ice",
  "method": "Shake & Crown with Berry Bleed",
  "techniqueRule": "Dick Bradsell, London 1984. Shake the gin sour with crushed ice, then slowly drizzle raspberry syrup or blackberry liqueur over the top to bleed through the ice like fresh morning brambles.",
  "tags": [
    "Gin",
    "Berries",
    "London 1984",
    "Modern Classic",
    "Visual"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 3,
    "sour": 4,
    "bitter": 0,
    "herbal": 2
  },
  "timer": {
    "label": "Shake Gin Sour",
    "seconds": 10
  },
  "ingredients": [
    {
      "id": "london-dry-gin",
      "name": "London Dry Gin",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "lemon-juice",
      "name": "Fresh Lemon Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "raspberry-syrup",
      "name": "Raspberry Syrup / Grenadine",
      "amount": 0.5,
      "unit": "oz",
      "note": "Blackberry liqueur or raspberry syrup bleed"
    }
  ],
  "instructions": [
    "Combine gin, fresh lemon juice, and simple syrup in shaker with ice.",
    "Shake for 10 seconds and strain into a rocks glass packed with crushed ice.",
    "Lace the berry syrup gently over the top of the ice mountain, letting it bleed down through the crushed ice.",
    "Garnish with two fresh blackberries or raspberries and a lemon wheel."
  ]
},
  {
  "id": "white-russian",
  "name": "White Russian",
  "category": "Equal-Parts & Modern Classics",
  "isFavorite": false,
  "glass": "Rocks Glass",
  "ice": "Large Solid Ice Cube",
  "method": "Build & Float Cream",
  "techniqueRule": "Build vodka and coffee liqueur over clean ice, then gently float cold heavy cream over the back of a barspoon for stunning layered contrast.",
  "tags": [
    "Vodka",
    "Coffee",
    "Creamy",
    "1960s Classic",
    "The Dude"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 4,
    "sour": 0,
    "bitter": 2,
    "herbal": 0
  },
  "ingredients": [
    {
      "id": "vodka",
      "name": "Vodka",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "tia-maria",
      "name": "Tia Maria / Coffee Liqueur",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "heavy-cream",
      "name": "Heavy Cream",
      "amount": 1.0,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Fill a rocks glass with solid ice cubes.",
    "Pour in vodka and coffee liqueur; stir briefly to chill.",
    "Carefully pour 1.0 oz cold heavy cream over the back of a barspoon so it floats like a cloud on top.",
    "Serve layered, or gently swirl before drinking."
  ]
},
  {
  "id": "black-russian",
  "name": "Black Russian",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Rocks Glass",
  "ice": "Large Clear Ice Cube",
  "method": "Cold Stir",
  "techniqueRule": "Gustaaf Tops 1949 Hotel Metropole Brussels. The original coffee-vodka duel. Low dilution, bold roasted bean and crisp spirit.",
  "tags": [
    "Vodka",
    "Coffee",
    "Brussels 1949",
    "Spirit-Forward"
  ],
  "flavor": {
    "boozy": 4,
    "sweet": 3,
    "sour": 0,
    "bitter": 3,
    "herbal": 0
  },
  "timer": {
    "label": "Cold Stir",
    "seconds": 25
  },
  "ingredients": [
    {
      "id": "vodka",
      "name": "Vodka",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "tia-maria",
      "name": "Tia Maria / Coffee Liqueur",
      "amount": 1.0,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine vodka and coffee liqueur in a mixing glass with ice.",
    "Stir smoothly for 25 seconds.",
    "Strain over a fresh large ice cube in a chilled rocks glass."
  ]
},
  {
  "id": "americano",
  "name": "Americano",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Highball",
  "ice": "Highball Ice Spears or Cubes",
  "method": "Build in Glass",
  "techniqueRule": "Gaspare Campari 1860s Milan. The father of the Negroni. Equal parts bitter Campari and rich sweet vermouth topped with crisp carbonation.",
  "tags": [
    "Campari",
    "Vermouth",
    "Low-ABV",
    "Aperitivo",
    "Milan 1860s"
  ],
  "flavor": {
    "boozy": 2,
    "sweet": 2,
    "sour": 0,
    "bitter": 4,
    "herbal": 4
  },
  "ingredients": [
    {
      "id": "campari",
      "name": "Campari",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "sweet-vermouth",
      "name": "Sweet Vermouth",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "club-soda",
      "name": "Club Soda",
      "amount": 2.5,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Fill a highball glass with tall ice cubes.",
    "Add Campari and sweet vermouth.",
    "Top with cold club soda.",
    "Gently stir with a barspoon from bottom to top once to integrate.",
    "Garnish with a half orange wheel."
  ]
},
  {
  "id": "garibaldi",
  "name": "Garibaldi (Fluffy Orange & Campari)",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Highball",
  "ice": "One Large Ice Cube",
  "method": "Aerated Citrus Build",
  "techniqueRule": "Dante NYC technique: Blend fresh orange juice on high speed or shake violently for 15 seconds without ice to aerate into micro-fluff, then pour over Campari.",
  "tags": [
    "Campari",
    "Aperitivo",
    "Dante NYC",
    "Bittersweet",
    "Fluffy"
  ],
  "flavor": {
    "boozy": 2,
    "sweet": 2,
    "sour": 3,
    "bitter": 4,
    "herbal": 3
  },
  "ingredients": [
    {
      "id": "campari",
      "name": "Campari",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "grapefruit-juice",
      "name": "Fresh Grapefruit Juice",
      "amount": 3.5,
      "unit": "oz",
      "note": "High-speed aerated citrus juice"
    }
  ],
  "instructions": [
    "Add 1.5 oz Campari to a highball glass over a single solid ice cube.",
    "Aerate fresh citrus juice in a blender on high or shake violently in an empty tin for 15s to produce fluffy cloud texture.",
    "Pour fluffy aerated juice gently over the Campari.",
    "Garnish with an orange wedge pinned to the rim."
  ]
},
  {
  "id": "rusty-nail",
  "name": "Rusty Nail",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Rocks Glass",
  "ice": "Large Clear Ice Cube",
  "method": "Cold Stir",
  "techniqueRule": "The Rat Pack 1960s 21 Club classic. Blended Scotch whiskey sweetened and perfumed with Drambuie (heather honey, Scotch, and secret herbs).",
  "tags": [
    "Scotch",
    "Spirit-Forward",
    "1960s Classic",
    "Honey",
    "Drambuie"
  ],
  "flavor": {
    "boozy": 5,
    "sweet": 3,
    "sour": 0,
    "bitter": 1,
    "herbal": 3
  },
  "timer": {
    "label": "Cold Stir",
    "seconds": 30
  },
  "ingredients": [
    {
      "id": "blended-scotch",
      "name": "Blended Scotch",
      "amount": 1.75,
      "unit": "oz"
    },
    {
      "id": "drambuie",
      "name": "Drambuie",
      "amount": 0.75,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine Scotch and Drambuie in a mixing glass with dense ice.",
    "Stir continuously for 30 seconds.",
    "Strain over a large clear ice block in an old fashioned glass.",
    "Express a wide strip of lemon peel over the drink and drop it in."
  ]
},
  {
  "id": "grasshopper",
  "name": "Grasshopper",
  "category": "Equal-Parts & Modern Classics",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Violent Shake & Double Strain",
  "techniqueRule": "Tujague's New Orleans 1918. Equal parts green cr\u00e8me de menthe, white cr\u00e8me de cacao, and cold heavy cream shaken until sub-zero and frothy.",
  "tags": [
    "Mint",
    "Chocolate",
    "Creamy",
    "New Orleans 1918",
    "Dessert"
  ],
  "flavor": {
    "boozy": 2,
    "sweet": 5,
    "sour": 0,
    "bitter": 0,
    "herbal": 3
  },
  "timer": {
    "label": "Violent Cream Shake",
    "seconds": 15
  },
  "ingredients": [
    {
      "id": "creme-de-menthe",
      "name": "Green Cr\u00e8me de Menthe",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "white-creme-de-cacao",
      "name": "White Cr\u00e8me de Cacao",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "heavy-cream",
      "name": "Heavy Cream",
      "amount": 1.0,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine green cr\u00e8me de menthe, white cr\u00e8me de cacao, and heavy cream in a shaker tin.",
    "Fill with ice and shake with violent force for 15 seconds.",
    "Double strain into a well-chilled coupe glass.",
    "Garnish with freshly grated dark chocolate or a mint leaf."
  ]
},
  {
  "id": "brandy-alexander",
  "name": "Brandy Alexander",
  "category": "Equal-Parts & Modern Classics",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Hard Shake & Nutmeg Dust",
  "techniqueRule": "Equal parts rich Cognac, white cr\u00e8me de cacao, and heavy cream. Freshly grated nutmeg across the foam head is essential for warm aroma.",
  "tags": [
    "Cognac",
    "Creamy",
    "Chocolate",
    "Classic 1920s",
    "Nutmeg"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 4,
    "sour": 0,
    "bitter": 0,
    "herbal": 1
  },
  "timer": {
    "label": "Hard Shake",
    "seconds": 14
  },
  "ingredients": [
    {
      "id": "cognac",
      "name": "Cognac / French Brandy",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "white-creme-de-cacao",
      "name": "White Cr\u00e8me de Cacao",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "heavy-cream",
      "name": "Heavy Cream",
      "amount": 1.0,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine Cognac, white cr\u00e8me de cacao, and heavy cream in a cocktail shaker with ice.",
    "Shake vigorously for 14 seconds.",
    "Strain into a chilled coupe glass.",
    "Garnish with fresh whole nutmeg grated finely over the top."
  ]
},
  {
  "id": "corpse-reviver-no-1",
  "name": "Corpse Reviver #1",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Nick & Nora or Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Cold Stir",
  "techniqueRule": "Savoy Cocktail Book 1930. The stirred brandy cousin of #2. French Cognac meets bonded applejack and Italian sweet vermouth.",
  "tags": [
    "Cognac",
    "Applejack",
    "Savoy 1930",
    "Spirit-Forward",
    "Historic"
  ],
  "flavor": {
    "boozy": 5,
    "sweet": 2,
    "sour": 0,
    "bitter": 1,
    "herbal": 2
  },
  "timer": {
    "label": "Cold Stir",
    "seconds": 35
  },
  "ingredients": [
    {
      "id": "cognac",
      "name": "Cognac / French Brandy",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "applejack",
      "name": "Applejack",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "sweet-vermouth",
      "name": "Sweet Vermouth",
      "amount": 0.75,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine Cognac, applejack, and sweet vermouth in a mixing glass with dense ice.",
    "Stir smoothly for 35 seconds.",
    "Strain into a chilled glass.",
    "Express an orange peel twist over the surface."
  ]
},
  {
  "id": "el-diablo",
  "name": "El Diablo",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Highball",
  "ice": "Highball Ice",
  "method": "Shake & Crown with Ginger Beer",
  "techniqueRule": "Trader Vic 1946. Tequila reposado and fresh lime juice topped with spicy ginger beer, crowned with a berry bleed.",
  "tags": [
    "Tequila",
    "Ginger",
    "Trader Vic 1946",
    "Effervescent",
    "Spicy"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 3,
    "sour": 4,
    "bitter": 0,
    "herbal": 1
  },
  "timer": {
    "label": "Shake Base",
    "seconds": 10
  },
  "ingredients": [
    {
      "id": "tequila-reposado",
      "name": "Tequila Reposado",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "raspberry-syrup",
      "name": "Raspberry Syrup / Grenadine",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "ginger-beer",
      "name": "Spicy Ginger Beer",
      "amount": 3.0,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Add tequila, lime juice, and raspberry syrup to shaker tin with ice.",
    "Shake for 10 seconds.",
    "Strain into a tall glass packed with fresh ice.",
    "Top with 3.0 oz spicy ginger beer.",
    "Garnish with a lime wheel and fresh berries."
  ]
},
  {
  "id": "siesta",
  "name": "Siesta",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Vigorous Shake",
  "techniqueRule": "Katie Stipe, NYC 2006. The modern classic that proved Campari belongs with tequila. Tart grapefruit and fresh lime buffer the bitter gentian.",
  "tags": [
    "Tequila",
    "Campari",
    "Modern Classic",
    "NYC 2006",
    "Grapefruit"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 2,
    "sour": 4,
    "bitter": 2,
    "herbal": 2
  },
  "timer": {
    "label": "Vigorous Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "tequila-blanco",
      "name": "Tequila Blanco",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "campari",
      "name": "Campari",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "grapefruit-juice",
      "name": "Fresh Grapefruit Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.75,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine all ingredients in a cocktail shaker filled with ice.",
    "Shake hard for 12 seconds until thoroughly chilled and aerated.",
    "Double-strain into a chilled coupe glass.",
    "Garnish with a grapefruit wheel or lime wheel."
  ]
},
  {
  "id": "enzoni",
  "name": "Enzoni",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Rocks Glass",
  "ice": "Large Clear Ice Cube",
  "method": "Muddle & Shake",
  "techniqueRule": "Vincenzo Errico, Milk & Honey NYC. The bridge between a Gin Sour and a Negroni. Muddled green or red grapes soften Campari's sharp bitterness.",
  "tags": [
    "Gin",
    "Campari",
    "Milk & Honey",
    "Modern Classic",
    "Grapes"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 3,
    "sour": 3,
    "bitter": 3,
    "herbal": 3
  },
  "timer": {
    "label": "Shake with Muddled Fruit",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "london-dry-gin",
      "name": "London Dry Gin",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "campari",
      "name": "Campari",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "lemon-juice",
      "name": "Fresh Lemon Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "fresh-raspberries",
      "name": "Fresh Raspberries",
      "amount": 4,
      "unit": "berries",
      "note": "Or 5 fresh grapes, muddled"
    }
  ],
  "instructions": [
    "In a shaker tin, gently muddle fresh fruit with simple syrup.",
    "Add gin, Campari, fresh lemon juice, and ice.",
    "Shake vigorously for 12 seconds.",
    "Double-strain over a large ice block in an old fashioned glass."
  ]
},
  {
  "id": "lions-tail",
  "name": "Lion's Tail",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Hard Shake",
  "techniqueRule": "Clarke Gale 1937. An iconic bourbon sour uniquely paired with Jamaican allspice (pimento) dram and fresh lime instead of lemon.",
  "tags": [
    "Bourbon",
    "Allspice",
    "Spice",
    "1930s Classic",
    "Lime"
  ],
  "flavor": {
    "boozy": 4,
    "sweet": 3,
    "sour": 3,
    "bitter": 1,
    "herbal": 4
  },
  "timer": {
    "label": "Hard Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "bourbon",
      "name": "Bourbon",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "allspice-dram",
      "name": "Allspice / Pimento Dram",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.25,
      "unit": "oz"
    },
    {
      "id": "angostura-bitters",
      "name": "Angostura Aromatic Bitters",
      "amount": 2,
      "unit": "dashes"
    }
  ],
  "instructions": [
    "Combine bourbon, allspice dram, fresh lime juice, simple syrup, and bitters in shaker.",
    "Fill with ice and shake hard for 12 seconds.",
    "Fine strain into a chilled coupe glass. Garnish with a lime wheel or expressed orange peel."
  ]
},
  {
  "id": "bamboo",
  "name": "Bamboo Cocktail",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Nick & Nora or Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Cold Stir",
  "techniqueRule": "Louis Eppinger, Grand Hotel, Yokohama, Japan 1890s. The definitive low-ABV masterwork. Equal parts dry sherry and sweet vermouth with twin bitters.",
  "tags": [
    "Sherry",
    "Low-ABV",
    "Japan 1890s",
    "Aperitivo",
    "Stirred"
  ],
  "flavor": {
    "boozy": 2,
    "sweet": 2,
    "sour": 0,
    "bitter": 2,
    "herbal": 4
  },
  "timer": {
    "label": "Cold Stir",
    "seconds": 30
  },
  "ingredients": [
    {
      "id": "dry-sherry",
      "name": "Dry Fino / Manzanilla Sherry",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "sweet-vermouth",
      "name": "Sweet Vermouth",
      "amount": 1.5,
      "unit": "oz",
      "note": "Or dry vermouth for French Bamboo"
    },
    {
      "id": "angostura-bitters",
      "name": "Angostura Aromatic Bitters",
      "amount": 1,
      "unit": "dash"
    },
    {
      "id": "orange-bitters",
      "name": "Orange Bitters",
      "amount": 1,
      "unit": "dash"
    }
  ],
  "instructions": [
    "Combine dry sherry, vermouth, and both bitters in a mixing glass with clean ice.",
    "Stir gracefully for 30 seconds until cold and diluted.",
    "Strain into a chilled Nick & Nora glass.",
    "Express a lemon peel twist across the glass and discard or drape on the rim."
  ]
},
  {
  "id": "adonis",
  "name": "Adonis Cocktail",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Nick & Nora or Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Cold Stir",
  "techniqueRule": "Created in 1884 at the Hoffman House NYC to honor the long-running Broadway musical. Dry sherry meets Italian sweet vermouth and orange bitters.",
  "tags": [
    "Sherry",
    "Low-ABV",
    "Historic 1884",
    "Broadway",
    "Stirred"
  ],
  "flavor": {
    "boozy": 2,
    "sweet": 3,
    "sour": 0,
    "bitter": 2,
    "herbal": 4
  },
  "timer": {
    "label": "Cold Stir",
    "seconds": 30
  },
  "ingredients": [
    {
      "id": "dry-sherry",
      "name": "Dry Fino / Manzanilla Sherry",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "sweet-vermouth",
      "name": "Sweet Vermouth",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "orange-bitters",
      "name": "Orange Bitters",
      "amount": 2,
      "unit": "dashes"
    }
  ],
  "instructions": [
    "Combine dry Fino sherry, sweet vermouth, and orange bitters in mixing glass with ice.",
    "Stir for 30 seconds until cold and silky.",
    "Strain into a chilled cocktail glass.",
    "Garnish with a flamed orange peel."
  ]
},
  {
  "id": "rob-roy",
  "name": "Rob Roy",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Nick & Nora or Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Cold Stir",
  "techniqueRule": "Waldorf Astoria NYC 1894. The Manhattan made with blended Scotch whisky. Rich malt and peat smoke meet sweet red vermouth.",
  "tags": [
    "Scotch",
    "Spirit-Forward",
    "Classic 1894",
    "NYC",
    "Stirred"
  ],
  "flavor": {
    "boozy": 5,
    "sweet": 2,
    "sour": 0,
    "bitter": 2,
    "herbal": 3
  },
  "timer": {
    "label": "Cold Stir",
    "seconds": 35
  },
  "ingredients": [
    {
      "id": "blended-scotch",
      "name": "Blended Scotch",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "sweet-vermouth",
      "name": "Sweet Vermouth",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "angostura-bitters",
      "name": "Angostura Aromatic Bitters",
      "amount": 2,
      "unit": "dashes"
    }
  ],
  "instructions": [
    "Add Scotch, sweet vermouth, and bitters to a mixing glass filled with ice.",
    "Stir continuously for 35 seconds.",
    "Strain into a chilled coupe or Nick & Nora glass.",
    "Garnish with a brandied cherry."
  ]
},
  {
  "id": "bobby-burns",
  "name": "Bobby Burns",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Nick & Nora or Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Cold Stir",
  "techniqueRule": "Savoy Cocktail Book 1930. Dedicated to the Scottish poet Robert Burns. Scotch and sweet vermouth elevated with a barspoon of honeyed B\u00e9n\u00e9dictine.",
  "tags": [
    "Scotch",
    "Benedictine",
    "Historic",
    "Savoy 1930",
    "Stirred"
  ],
  "flavor": {
    "boozy": 5,
    "sweet": 3,
    "sour": 0,
    "bitter": 2,
    "herbal": 4
  },
  "timer": {
    "label": "Cold Stir",
    "seconds": 35
  },
  "ingredients": [
    {
      "id": "blended-scotch",
      "name": "Blended Scotch",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "sweet-vermouth",
      "name": "Sweet Vermouth",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "benedictine",
      "name": "B\u00e9n\u00e9dictine",
      "amount": 0.25,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine Scotch, sweet vermouth, and B\u00e9n\u00e9dictine in a mixing glass with dense ice.",
    "Stir smoothly for 35 seconds.",
    "Strain into a chilled glass.",
    "Express a lemon peel twist across the top and serve."
  ]
},
  {
  "id": "godmother",
  "name": "Godmother",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Rocks Glass",
  "ice": "Large Clear Ice Cube",
  "method": "Build & Stir in Glass",
  "techniqueRule": "The lighter companion to The Godfather. Clean vodka pairs with sweet nutty Italian amaretto over a slow-melting ice block.",
  "tags": [
    "Vodka",
    "Amaretto",
    "1970s Classic",
    "Stirred"
  ],
  "flavor": {
    "boozy": 4,
    "sweet": 3,
    "sour": 0,
    "bitter": 0,
    "herbal": 0
  },
  "ingredients": [
    {
      "id": "vodka",
      "name": "Vodka",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "amaretto",
      "name": "Amaretto",
      "amount": 0.75,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Add vodka and amaretto to a rocks glass over a large clear ice cube.",
    "Stir for 20 seconds to chill and dilute.",
    "Garnish with an orange twist or maraschino cherry."
  ]
},
  {
  "id": "french-connection",
  "name": "French Connection",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Snifter or Rocks",
  "ice": "Large Ice Cube or Neat",
  "method": "Gentle Stir",
  "techniqueRule": "Named after the 1971 Gene Hackman film. Fine French Cognac and Italian amaretto in a silky, warming digestif.",
  "tags": [
    "Cognac",
    "Amaretto",
    "Digestif",
    "1970s Classic",
    "Rich"
  ],
  "flavor": {
    "boozy": 5,
    "sweet": 3,
    "sour": 0,
    "bitter": 0,
    "herbal": 1
  },
  "ingredients": [
    {
      "id": "cognac",
      "name": "Cognac / French Brandy",
      "amount": 1.75,
      "unit": "oz"
    },
    {
      "id": "amaretto",
      "name": "Amaretto",
      "amount": 0.75,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Pour Cognac and amaretto into a snifter or an old fashioned glass with a large ice cube.",
    "Stir gently for 15 seconds to combine.",
    "Savor slowly as the aromatics develop with warmth."
  ]
},
  {
  "id": "classic-paloma",
  "name": "Traditional Paloma",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Highball (Salt Rim)",
  "ice": "Highball Ice",
  "method": "Shake & Top with Club Soda",
  "techniqueRule": "Mexico's most consumed cocktail. Don Javier Delgado Corona, La Capilla, Tequila, Jalisco. Fresh ruby red grapefruit and lime with a salted rim.",
  "tags": [
    "Tequila",
    "Grapefruit",
    "Mexico",
    "National Drink",
    "Refreshing"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 2,
    "sour": 4,
    "bitter": 1,
    "herbal": 1
  },
  "timer": {
    "label": "Shake Base",
    "seconds": 10
  },
  "ingredients": [
    {
      "id": "tequila-blanco",
      "name": "Tequila Blanco",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "grapefruit-juice",
      "name": "Fresh Grapefruit Juice",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "agave-syrup",
      "name": "Agave Syrup (1:1)",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "club-soda",
      "name": "Club Soda",
      "amount": 2.0,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Rim half of a highball glass with sea salt and fill with ice.",
    "Shake tequila, grapefruit juice, lime juice, and agave syrup with ice for 10 seconds.",
    "Strain into the prepared glass.",
    "Top with 2.0 oz crisp club soda and lift once with a barspoon.",
    "Garnish with a fresh grapefruit crescent."
  ]
},
  {
  "id": "mezcalita",
  "name": "Mezcalita",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Rocks Glass (Sal de Gusano Rim)",
  "ice": "Large Clear Ice Cube",
  "method": "Violent Shake",
  "techniqueRule": "The smoky artisanal Oaxacan sister to the Margarita. Espad\u00edn mezcal shaken with orange dry cura\u00e7ao, lime, and agave nectar.",
  "tags": [
    "Mezcal",
    "Citrusy",
    "Smoky",
    "Oaxaca",
    "Craft Classic"
  ],
  "flavor": {
    "boozy": 4,
    "sweet": 2,
    "sour": 4,
    "bitter": 1,
    "herbal": 3
  },
  "timer": {
    "label": "Violent Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "mezcal",
      "name": "Mezcal",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "dry-curacao",
      "name": "Dry Curacao / Cointreau / Triple Sec",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "agave-syrup",
      "name": "Agave Syrup (1:1)",
      "amount": 0.25,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Rim half of a rocks glass with chili salt or sea salt and add a large ice cube.",
    "Add mezcal, dry cura\u00e7ao, fresh lime juice, and agave syrup to shaker with ice.",
    "Shake with violent force for 12 seconds.",
    "Double-strain into the rocks glass. Garnish with a dehydrated lime wheel."
  ]
},
  {
  "id": "blinker",
  "name": "The Blinker",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Hard Shake",
  "techniqueRule": "Patrick Gavin Duffy 1934. Rye whiskey paired brilliantly with tart grapefruit juice and raspberry syrup (or real grenadine).",
  "tags": [
    "Rye",
    "Grapefruit",
    "Raspberry",
    "1930s Classic",
    "Fruity"
  ],
  "flavor": {
    "boozy": 4,
    "sweet": 3,
    "sour": 3,
    "bitter": 1,
    "herbal": 2
  },
  "timer": {
    "label": "Hard Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "rye-whiskey",
      "name": "Rye Whiskey",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "grapefruit-juice",
      "name": "Fresh Grapefruit Juice",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "raspberry-syrup",
      "name": "Raspberry Syrup / Grenadine",
      "amount": 0.5,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine rye whiskey, fresh grapefruit juice, and raspberry syrup in shaker with ice.",
    "Shake hard for 12 seconds until thoroughly chilled.",
    "Double-strain into a chilled coupe glass.",
    "Garnish with a grapefruit twist."
  ]
},
  {
  "id": "seelbach",
  "name": "Seelbach Cocktail",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Coupe or Flute",
  "ice": "None (Chilled Glass)",
  "method": "Stir & Crown with Champagne",
  "techniqueRule": "Historic Louisville hotel legend. Bourbon and triple sec heavily spiced with 7 dashes of Angostura and 7 dashes of Peychaud's, topped with brut Champagne.",
  "tags": [
    "Bourbon",
    "Sparkling",
    "Bitters-Heavy",
    "Louisville",
    "Effervescent"
  ],
  "flavor": {
    "boozy": 4,
    "sweet": 2,
    "sour": 0,
    "bitter": 3,
    "herbal": 4
  },
  "ingredients": [
    {
      "id": "bourbon",
      "name": "Bourbon",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "dry-curacao",
      "name": "Dry Curacao / Cointreau / Triple Sec",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "angostura-bitters",
      "name": "Angostura Aromatic Bitters",
      "amount": 7,
      "unit": "dashes"
    },
    {
      "id": "peychauds-bitters",
      "name": "Peychaud's Bitters",
      "amount": 7,
      "unit": "dashes"
    },
    {
      "id": "champagne",
      "name": "Sparkling Wine / Champagne / Prosecco",
      "amount": 3.5,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Add bourbon, cura\u00e7ao, and 14 total dashes of bitters to a mixing glass with ice.",
    "Stir for 15 seconds to chill.",
    "Strain into a chilled champagne flute or coupe.",
    "Top with 3.5 oz cold dry brut Champagne. Garnish with a long orange peel spiral."
  ]
},
  {
  "id": "old-cuban",
  "name": "Old Cuban",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Muddle, Shake & Crown with Champagne",
  "techniqueRule": "Audrey Saunders, Pegu Club NYC 2001. An aged rum Mojito meets a French 75. Clapped mint, aged rum, lime, and Angostura, crowned with Champagne.",
  "tags": [
    "Rum",
    "Sparkling",
    "Mint",
    "Audrey Saunders 2001",
    "Pegu Club"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 2,
    "sour": 3,
    "bitter": 1,
    "herbal": 4
  },
  "timer": {
    "label": "Shake Base with Mint",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "dark-rum",
      "name": "Dark Rum",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "angostura-bitters",
      "name": "Angostura Aromatic Bitters",
      "amount": 2,
      "unit": "dashes"
    },
    {
      "id": "fresh-mint",
      "name": "Fresh Mint",
      "amount": 6,
      "unit": "leaves"
    },
    {
      "id": "champagne",
      "name": "Sparkling Wine / Champagne / Prosecco",
      "amount": 2.0,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Clap mint leaves and add to shaker with rum, lime juice, simple syrup, bitters, and ice.",
    "Shake vigorously for 12 seconds.",
    "Double-strain into a chilled coupe glass.",
    "Top with 2.0 oz cold dry Champagne. Float a single mint leaf on top."
  ]
},
  {
  "id": "airmail",
  "name": "Airmail",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Flute or Highball",
  "ice": "None or Cubes",
  "method": "Shake & Top with Champagne",
  "techniqueRule": "1930s Bacardi promotional classic celebrating international airmail service. Aged rum, honey syrup, and fresh lime topped with dry bubbly.",
  "tags": [
    "Rum",
    "Honey",
    "Sparkling",
    "1930s Classic",
    "Effervescent"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 3,
    "sour": 3,
    "bitter": 0,
    "herbal": 1
  },
  "timer": {
    "label": "Shake Base",
    "seconds": 10
  },
  "ingredients": [
    {
      "id": "dark-rum",
      "name": "Dark Rum",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "honey-syrup",
      "name": "Honey Syrup (1:1)",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "champagne",
      "name": "Sparkling Wine / Champagne / Prosecco",
      "amount": 2.5,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine dark rum, fresh lime juice, and honey syrup in shaker with ice.",
    "Shake for 10 seconds.",
    "Strain into a chilled champagne flute or ice-filled glass.",
    "Top with 2.5 oz cold dry sparkling wine. Garnish with a mint sprig or lime wheel."
  ]
},
  {
  "id": "queens-park-swizzle",
  "name": "Queen's Park Swizzle",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Highball",
  "ice": "Crushed Ice",
  "method": "Swizzle in Glass",
  "techniqueRule": "Queen's Park Hotel, Port of Spain, Trinidad 1920. Mint and demerara swizzled with rum, crowned with heavy Angostura bitters that seep like lava through the frost.",
  "tags": [
    "Rum",
    "Mint",
    "Trinidad 1920",
    "Swizzle",
    "Aromatic"
  ],
  "flavor": {
    "boozy": 4,
    "sweet": 3,
    "sour": 3,
    "bitter": 2,
    "herbal": 4
  },
  "ingredients": [
    {
      "id": "dark-rum",
      "name": "Dark Rum",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "brown-simple-syrup",
      "name": "Brown Simple Syrup",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "fresh-mint",
      "name": "Fresh Mint",
      "amount": 8,
      "unit": "leaves"
    },
    {
      "id": "angostura-bitters",
      "name": "Angostura Aromatic Bitters",
      "amount": 4,
      "unit": "dashes",
      "note": "Floated on crushed ice"
    }
  ],
  "instructions": [
    "In a tall highball glass, gently muddle fresh mint leaves with lime juice and demerara syrup.",
    "Add rum and fill glass 2/3 full with crushed ice.",
    "Insert a swizzle stick or barspoon and churn vigorously between palms until frost forms on glass.",
    "Pack more crushed ice to the brim and float 4 generous dashes of Angostura bitters on top.",
    "Garnish with a sprawling mint bouquet."
  ]
},
  {
  "id": "corn-n-oil",
  "name": "Corn 'n' Oil",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Rocks Glass",
  "ice": "Crushed Ice or Large Cube",
  "method": "Build & Float",
  "techniqueRule": "The national drink of Barbados. Spiced Velvet Falernum (clove, lime, almond) provides the foundation, topped with a rich dark pot-still black rum float resembling dark oil.",
  "tags": [
    "Rum",
    "Falernum",
    "Barbados",
    "Tiki",
    "Historic"
  ],
  "flavor": {
    "boozy": 4,
    "sweet": 3,
    "sour": 2,
    "bitter": 1,
    "herbal": 3
  },
  "ingredients": [
    {
      "id": "falernum",
      "name": "Velvet Falernum",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "angostura-bitters",
      "name": "Angostura Aromatic Bitters",
      "amount": 2,
      "unit": "dashes"
    },
    {
      "id": "dark-rum",
      "name": "Dark Rum",
      "amount": 2.0,
      "unit": "oz",
      "note": "Floated on top"
    }
  ],
  "instructions": [
    "Add Velvet Falernum, lime juice, and bitters to a rocks glass filled with crushed ice; stir gently.",
    "Carefully float 2.0 oz dark black rum over the back of a barspoon on top.",
    "Garnish with a spent lime half."
  ]
},
  {
  "id": "saturn",
  "name": "The Saturn",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "Crushed Ice / Chilled",
  "method": "Violent Shake & Double Strain",
  "techniqueRule": "J. 'Popo' Galsini 1967. Winner of the International Bartenders Association World Championship. A rare and sublime gin-based Tiki masterpiece with passionfruit/raspberry, orgeat, and falernum.",
  "tags": [
    "Gin",
    "Tiki",
    "IBA Champion 1967",
    "Orgeat",
    "Fruity"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 3,
    "sour": 4,
    "bitter": 0,
    "herbal": 3
  },
  "timer": {
    "label": "Violent Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "london-dry-gin",
      "name": "London Dry Gin",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "lemon-juice",
      "name": "Fresh Lemon Juice",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "raspberry-syrup",
      "name": "Raspberry Syrup / Grenadine",
      "amount": 0.5,
      "unit": "oz",
      "note": "Or passion fruit syrup"
    },
    {
      "id": "falernum",
      "name": "Velvet Falernum",
      "amount": 0.25,
      "unit": "oz"
    },
    {
      "id": "orgeat",
      "name": "Orgeat Syrup",
      "amount": 0.25,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine all ingredients in a shaker with crushed ice.",
    "Shake with high energy for 12 seconds until frosty.",
    "Strain into a chilled coupe glass.",
    "Garnish with a lemon peel peeled in a spiral ring to resemble Saturn's rings around a cocktail cherry."
  ]
},
  {
  "id": "army-and-navy",
  "name": "Army & Navy",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Hard Shake",
  "techniqueRule": "David Embury, Fine Art of Mixing Drinks 1948. Gin sour enriched by toasted almond orgeat and Angostura bitters.",
  "tags": [
    "Gin",
    "Orgeat",
    "Classic 1948",
    "Almond",
    "Sour"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 2,
    "sour": 4,
    "bitter": 1,
    "herbal": 3
  },
  "timer": {
    "label": "Hard Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "london-dry-gin",
      "name": "London Dry Gin",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "lemon-juice",
      "name": "Fresh Lemon Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "orgeat",
      "name": "Orgeat Syrup",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "angostura-bitters",
      "name": "Angostura Aromatic Bitters",
      "amount": 1,
      "unit": "dash"
    }
  ],
  "instructions": [
    "Combine gin, fresh lemon juice, orgeat, and Angostura bitters in shaker with ice.",
    "Shake vigorously for 12 seconds.",
    "Double-strain into a pre-chilled coupe.",
    "Express a grapefruit or lemon peel twist over the top."
  ]
},
  {
  "id": "pegu-club",
  "name": "Pegu Club",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Hard Shake",
  "techniqueRule": "1920s British officers' club in Rangoon, Burma. Gin and orange curacao amplified by fresh lime and both Angostura and orange bitters.",
  "tags": [
    "Gin",
    "Burma 1920s",
    "Classic",
    "Citrusy",
    "Bitters"
  ],
  "flavor": {
    "boozy": 4,
    "sweet": 2,
    "sour": 4,
    "bitter": 2,
    "herbal": 3
  },
  "timer": {
    "label": "Hard Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "london-dry-gin",
      "name": "London Dry Gin",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "dry-curacao",
      "name": "Dry Curacao / Cointreau / Triple Sec",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "angostura-bitters",
      "name": "Angostura Aromatic Bitters",
      "amount": 1,
      "unit": "dash"
    },
    {
      "id": "orange-bitters",
      "name": "Orange Bitters",
      "amount": 1,
      "unit": "dash"
    }
  ],
  "instructions": [
    "Add gin, cura\u00e7ao, fresh lime juice, and both bitters to cocktail shaker with ice.",
    "Shake hard for 12 seconds.",
    "Double-strain into a chilled coupe glass. Garnish with a lime wheel."
  ]
},
  {
  "id": "champs-elysees",
  "name": "Champs-\u00c9lys\u00e9es",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Hard Shake",
  "techniqueRule": "Harry McElhone, Harry's New York Bar, Paris 1925. French Cognac meets pungent 110-proof Green Chartreuse, sweetened lightly with lemon and Angostura.",
  "tags": [
    "Cognac",
    "Chartreuse",
    "Paris 1925",
    "Herbal",
    "Sophisticated"
  ],
  "flavor": {
    "boozy": 4,
    "sweet": 2,
    "sour": 3,
    "bitter": 1,
    "herbal": 4
  },
  "timer": {
    "label": "Hard Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "cognac",
      "name": "Cognac / French Brandy",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "green-chartreuse",
      "name": "Green Chartreuse",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "lemon-juice",
      "name": "Fresh Lemon Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.25,
      "unit": "oz"
    },
    {
      "id": "angostura-bitters",
      "name": "Angostura Aromatic Bitters",
      "amount": 1,
      "unit": "dash"
    }
  ],
  "instructions": [
    "Combine Cognac, Green Chartreuse, lemon juice, simple syrup, and bitters in shaker.",
    "Fill with ice and shake vigorously for 12 seconds.",
    "Double strain into a chilled coupe glass. Garnish with an expressed lemon twist."
  ]
},
  {
  "id": "de-la-louisiane",
  "name": "De La Louisiane",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Nick & Nora or Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Cold Stir",
  "techniqueRule": "Restaurant de la Louisiane, New Orleans 1930s. The richer, herbal cousin of the Vieux Carr\u00e9. 100-proof rye whiskey, sweet vermouth, B\u00e9n\u00e9dictine, absinthe, and Peychaud's.",
  "tags": [
    "Rye",
    "New Orleans 1930s",
    "Spirit-Forward",
    "Absinthe",
    "Stirred"
  ],
  "flavor": {
    "boozy": 5,
    "sweet": 3,
    "sour": 0,
    "bitter": 2,
    "herbal": 4
  },
  "timer": {
    "label": "Cold Stir",
    "seconds": 35
  },
  "ingredients": [
    {
      "id": "rye-whiskey",
      "name": "Rye Whiskey",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "sweet-vermouth",
      "name": "Sweet Vermouth",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "benedictine",
      "name": "B\u00e9n\u00e9dictine",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "absinthe",
      "name": "Absinthe",
      "amount": 3,
      "unit": "dashes"
    },
    {
      "id": "peychauds-bitters",
      "name": "Peychaud's Bitters",
      "amount": 3,
      "unit": "dashes"
    }
  ],
  "instructions": [
    "Add rye whiskey, sweet vermouth, B\u00e9n\u00e9dictine, absinthe, and Peychaud's bitters to mixing glass.",
    "Fill with dense ice and stir continuously for 35 seconds.",
    "Strain into a pre-chilled glass. Garnish with brandied cocktail cherries."
  ]
},
  {
  "id": "monte-carlo",
  "name": "Monte Carlo",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Old Fashioned / Rocks",
  "ice": "Large Clear Ice Block",
  "method": "Cold Stir",
  "techniqueRule": "David Embury 1948. A luxurious Manhattan riff replacing vermouth entirely with herbal B\u00e9n\u00e9dictine liqueur.",
  "tags": [
    "Rye",
    "Benedictine",
    "Spirit-Forward",
    "Classic",
    "Stirred"
  ],
  "flavor": {
    "boozy": 5,
    "sweet": 3,
    "sour": 0,
    "bitter": 2,
    "herbal": 4
  },
  "timer": {
    "label": "Cold Stir",
    "seconds": 30
  },
  "ingredients": [
    {
      "id": "rye-whiskey",
      "name": "Rye Whiskey",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "benedictine",
      "name": "B\u00e9n\u00e9dictine",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "angostura-bitters",
      "name": "Angostura Aromatic Bitters",
      "amount": 2,
      "unit": "dashes"
    }
  ],
  "instructions": [
    "Combine rye whiskey, B\u00e9n\u00e9dictine, and Angostura bitters in a mixing glass with ice.",
    "Stir for 30 seconds until cold and well integrated.",
    "Strain over a large clear ice cube in a rocks glass.",
    "Express an orange peel twist across the glass and drop it in."
  ]
},
  {
  "id": "tipperary",
  "name": "Tipperary",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Cold Stir",
  "techniqueRule": "Hugo Ensslin 1916. Whiskey paired with sweet vermouth and vibrant Green Chartreuse. Equal parts or 2:1:0.5 ratio yields an astonishing herbal depth.",
  "tags": [
    "Whiskey",
    "Chartreuse",
    "Classic 1916",
    "Herbal",
    "Stirred"
  ],
  "flavor": {
    "boozy": 5,
    "sweet": 2,
    "sour": 0,
    "bitter": 2,
    "herbal": 4
  },
  "timer": {
    "label": "Cold Stir",
    "seconds": 35
  },
  "ingredients": [
    {
      "id": "rye-whiskey",
      "name": "Rye Whiskey",
      "amount": 1.5,
      "unit": "oz",
      "note": "Or Irish whiskey"
    },
    {
      "id": "sweet-vermouth",
      "name": "Sweet Vermouth",
      "amount": 1.0,
      "unit": "oz"
    },
    {
      "id": "green-chartreuse",
      "name": "Green Chartreuse",
      "amount": 0.5,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine whiskey, sweet vermouth, and Green Chartreuse in mixing glass with ice.",
    "Stir smoothly for 35 seconds.",
    "Strain into a chilled cocktail coupe.",
    "Express oils from an orange peel across the drink and discard."
  ]
},
  {
  "id": "carajillo-mexicano",
  "name": "Shaken Carajillo (Espresso & Licor 43)",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Rocks Glass",
  "ice": "Large Ice Block",
  "method": "Hard Aeration Shake",
  "techniqueRule": "The undisputed king of Mexican post-dinner cocktails. Pour hot espresso directly over ice with Spanish Licor 43 and shake vigorously for an instant frothy crown.",
  "tags": [
    "Coffee",
    "Licor 43",
    "Mexico",
    "Digestif",
    "Frothy"
  ],
  "flavor": {
    "boozy": 2,
    "sweet": 4,
    "sour": 0,
    "bitter": 2,
    "herbal": 2
  },
  "timer": {
    "label": "Aeration Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "licor-43",
      "name": "Licor 43",
      "amount": 1.75,
      "unit": "oz"
    },
    {
      "id": "fresh-espresso",
      "name": "Fresh Espresso / Cold Brew",
      "amount": 1.75,
      "unit": "oz",
      "note": "Fresh hot espresso shot"
    }
  ],
  "instructions": [
    "Brew a fresh hot espresso shot.",
    "Add Licor 43 and hot espresso to a shaker packed with solid ice.",
    "Shake with maximum speed for 12 seconds until thick crema foam develops.",
    "Strain over a fresh large ice block in a rocks glass."
  ]
},
  {
  "id": "batida-de-coco",
  "name": "Batida de Coco",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Highball",
  "ice": "Crushed Ice",
  "method": "Violent Shake & Churn",
  "techniqueRule": "Rio de Janeiro beach staple. Fresh Brazilian Cacha\u00e7a shaken violently with sweet cream of coconut, fresh lime juice, and crushed ice.",
  "tags": [
    "Cacha\u00e7a",
    "Coconut",
    "Brazil",
    "Tropical",
    "Beach"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 4,
    "sour": 2,
    "bitter": 0,
    "herbal": 1
  },
  "timer": {
    "label": "Violent Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "cachaca",
      "name": "Cacha\u00e7a",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "cream-of-coconut",
      "name": "Cream of Coconut",
      "amount": 1.25,
      "unit": "oz"
    },
    {
      "id": "lime-juice",
      "name": "Fresh Lime Juice",
      "amount": 0.5,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine Cacha\u00e7a, cream of coconut, and fresh lime juice in shaker.",
    "Add 1 cup of crushed ice and shake hard for 12 seconds.",
    "Pour entire contents into a tall highball glass.",
    "Garnish with toasted coconut flakes or a lime wheel."
  ]
},
  {
  "id": "painkiller",
  "name": "The Painkiller",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Highball or Hurricane",
  "ice": "Crushed Ice",
  "method": "Violent Shake & Nutmeg Dust",
  "techniqueRule": "Soggy Dollar Bar, British Virgin Islands 1970s. Dark rum, pineapple, orange juice, and cream of coconut crowned with a mountain of fresh crushed ice and freshly grated nutmeg.",
  "tags": [
    "Rum",
    "Tropical",
    "BVI 1970s",
    "Nutmeg",
    "Tiki"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 4,
    "sour": 2,
    "bitter": 0,
    "herbal": 1
  },
  "timer": {
    "label": "Violent Shake",
    "seconds": 12
  },
  "ingredients": [
    {
      "id": "dark-rum",
      "name": "Dark Rum",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "pineapple-juice",
      "name": "Pineapple Juice",
      "amount": 3.0,
      "unit": "oz"
    },
    {
      "id": "grapefruit-juice",
      "name": "Fresh Grapefruit Juice",
      "amount": 1.0,
      "unit": "oz",
      "note": "Fresh orange or grapefruit"
    },
    {
      "id": "cream-of-coconut",
      "name": "Cream of Coconut",
      "amount": 1.0,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Add dark rum, pineapple juice, citrus juice, and cream of coconut to shaker with ice.",
    "Shake with great force for 12 seconds.",
    "Strain into a tall glass filled with crushed ice.",
    "Generously grate whole fresh nutmeg across the top of the ice. Garnish with a pineapple wedge."
  ]
},
  {
  "id": "mint-julep",
  "name": "Classic Mint Julep",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Silver Julep Cup or Double Rocks",
  "ice": "Crushed Ice (Frost Coating)",
  "method": "Muddle, Pack Ice & Swizzle",
  "techniqueRule": "Kentucky Derby 1875 tradition. Pack crushed ice into a silver julep cup until the outside is completely coated in white frost. 100+ proof bourbon essential.",
  "tags": [
    "Bourbon",
    "Mint",
    "Kentucky Derby",
    "Southern Classic",
    "Historic"
  ],
  "flavor": {
    "boozy": 4,
    "sweet": 3,
    "sour": 0,
    "bitter": 0,
    "herbal": 4
  },
  "ingredients": [
    {
      "id": "bourbon",
      "name": "Bourbon",
      "amount": 2.5,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.5,
      "unit": "oz"
    },
    {
      "id": "fresh-mint",
      "name": "Fresh Mint",
      "amount": 8,
      "unit": "leaves"
    }
  ],
  "instructions": [
    "In a julep cup, gently press fresh mint leaves with simple syrup to release aromatics without bruising.",
    "Add bourbon and fill glass 2/3 full with crushed ice.",
    "Swizzle or stir briskly until thick white frost develops on the outside metal of the cup.",
    "Pack more crushed ice into an overflowing dome on top.",
    "Insert a bouquet of slapped mint sprigs right next to a short straw so every sip is perfumed with fresh mint oils."
  ]
},
  {
  "id": "bourbon-whiskey-sour",
  "name": "Traditional Whiskey Sour",
  "category": "Velvety Sours & Meringue",
  "isFavorite": false,
  "glass": "Coupe or Rocks",
  "ice": "None (Coupe) or Large Cube",
  "method": "15s Dry Shake + 12s Wet Shake",
  "techniqueRule": "Execute a 15-second dry shake (no ice) to shear albumen proteins into micro-foam, followed by a violent 10\u201312 second wet shake with dense ice. Double-strain through a fine-mesh sieve.",
  "tags": [
    "Bourbon",
    "Egg White",
    "Velvety",
    "Classic 1870",
    "Meringue"
  ],
  "flavor": {
    "boozy": 3,
    "sweet": 2,
    "sour": 4,
    "bitter": 1,
    "herbal": 1
  },
  "timer": {
    "label": "Dry Shake (No Ice)",
    "drySeconds": 15,
    "wetSeconds": 12
  },
  "ingredients": [
    {
      "id": "bourbon",
      "name": "Bourbon",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "lemon-juice",
      "name": "Fresh Lemon Juice",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.75,
      "unit": "oz"
    },
    {
      "id": "fresh-eggs",
      "name": "Fresh Eggs (Albumen)",
      "amount": 0.75,
      "unit": "oz",
      "note": "White of 1 egg"
    },
    {
      "id": "angostura-bitters",
      "name": "Angostura Aromatic Bitters",
      "amount": 2,
      "unit": "dashes",
      "note": "Garnish drops on foam"
    }
  ],
  "instructions": [
    "Add bourbon, lemon juice, simple syrup, and fresh egg white to shaker tin without ice.",
    "Dry shake for 15 seconds to shear proteins into a thick micro-foam.",
    "Add large ice cubes and wet shake hard for 12 seconds until icy cold.",
    "Double-strain through fine mesh into a chilled coupe.",
    "Drop 2\u20133 dashes of Angostura bitters on the foam head and drag a toothpick through to create aromatic hearts."
  ]
},
  {
  "id": "aperol-spritz",
  "name": "Classic Aperol Spritz",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Large Wine Glass",
  "ice": "Cubed Ice",
  "method": "3-2-1 Italian Build",
  "techniqueRule": "The Venetian 3-2-1 rule: 3 parts Prosecco, 2 parts Aperol, 1 part Club Soda. Build over plenty of ice and stir once.",
  "tags": [
    "Aperol",
    "Sparkling",
    "Venice",
    "Aperitivo",
    "Low-ABV"
  ],
  "flavor": {
    "boozy": 2,
    "sweet": 3,
    "sour": 1,
    "bitter": 2,
    "herbal": 3
  },
  "ingredients": [
    {
      "id": "champagne",
      "name": "Sparkling Wine / Champagne / Prosecco",
      "amount": 3.0,
      "unit": "oz"
    },
    {
      "id": "aperol",
      "name": "Aperol",
      "amount": 2.0,
      "unit": "oz"
    },
    {
      "id": "club-soda",
      "name": "Club Soda",
      "amount": 1.0,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Fill a large stemmed wine glass with ice cubes.",
    "Pour in 3.0 oz dry Prosecco.",
    "Add 2.0 oz Aperol in a circular motion.",
    "Splash 1.0 oz club soda over the top.",
    "Stir gently once from the bottom. Garnish with a fresh orange slice and an olive."
  ]
},
  {
  "id": "bellini",
  "name": "Venetian Bellini",
  "category": "Acid-Driven Sours & Smashes",
  "isFavorite": false,
  "glass": "Champagne Flute",
  "ice": "None (Chilled Ingredients)",
  "method": "Gentle Fold in Glass",
  "techniqueRule": "Giuseppe Cipriani, Harry's Bar, Venice 1948. Fresh white peach puree gently folded into chilled dry Italian Prosecco.",
  "tags": [
    "Sparkling",
    "Peach",
    "Venice 1948",
    "Harry's Bar",
    "Brunch"
  ],
  "flavor": {
    "boozy": 2,
    "sweet": 3,
    "sour": 2,
    "bitter": 0,
    "herbal": 0
  },
  "ingredients": [
    {
      "id": "fresh-peach",
      "name": "Fresh Peach",
      "amount": 1.5,
      "unit": "oz",
      "note": "Pureed fresh white peach"
    },
    {
      "id": "simple-syrup",
      "name": "Simple Syrup (1:1)",
      "amount": 0.25,
      "unit": "oz",
      "optional": true
    },
    {
      "id": "champagne",
      "name": "Sparkling Wine / Champagne / Prosecco",
      "amount": 3.5,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Puree fresh peeled peach into a smooth coulis.",
    "Pour peach puree into the bottom of a chilled champagne flute.",
    "Slowly pour in cold dry Prosecco or Champagne.",
    "Gently stir with a barspoon to fold the puree into the sparkling wine without knocking out carbonation."
  ]
},
  {
  "id": "negroni-sbagliato",
  "name": "Negroni Sbagliato",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Rocks or Wine Glass",
  "ice": "Large Ice Cubes",
  "method": "Build in Glass",
  "techniqueRule": "Mirko Stocchetto, Bar Basso, Milan 1972 ('Sbagliato' = 'Mistaken'). A bartender mistakenly reached for sparkling wine instead of gin while making a Negroni, creating a sparkling sensation.",
  "tags": [
    "Campari",
    "Sparkling",
    "Milan 1972",
    "Aperitivo",
    "Effervescent"
  ],
  "flavor": {
    "boozy": 2,
    "sweet": 3,
    "sour": 0,
    "bitter": 4,
    "herbal": 4
  },
  "ingredients": [
    {
      "id": "campari",
      "name": "Campari",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "sweet-vermouth",
      "name": "Sweet Vermouth",
      "amount": 1.5,
      "unit": "oz"
    },
    {
      "id": "champagne",
      "name": "Sparkling Wine / Champagne / Prosecco",
      "amount": 1.5,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Fill a rocks or wine glass with large ice cubes.",
    "Add Campari and sweet vermouth.",
    "Top with 1.5 oz chilled dry Prosecco or sparkling wine.",
    "Gently lift once with a barspoon. Garnish with an orange wheel."
  ]
},
  {
  "id": "gibson",
  "name": "The Gibson",
  "category": "Spirit-Forward & Stirred",
  "isFavorite": false,
  "glass": "Nick & Nora or Coupe",
  "ice": "None (Chilled Glass)",
  "method": "Cold Stir",
  "techniqueRule": "Players Club NYC 1890s. London dry gin and dry vermouth garnished with a savory pickled cocktail onion, imparting a subtle brine umami note.",
  "tags": [
    "Gin",
    "Savory",
    "Classic 1890s",
    "Umami",
    "Stirred"
  ],
  "flavor": {
    "boozy": 5,
    "sweet": 0,
    "sour": 0,
    "bitter": 1,
    "herbal": 4
  },
  "timer": {
    "label": "Cold Stir",
    "seconds": 35
  },
  "ingredients": [
    {
      "id": "london-dry-gin",
      "name": "London Dry Gin",
      "amount": 2.5,
      "unit": "oz"
    },
    {
      "id": "dry-vermouth",
      "name": "Dry Vermouth",
      "amount": 0.5,
      "unit": "oz"
    }
  ],
  "instructions": [
    "Combine gin and refrigerated dry vermouth in a mixing glass with dense ice.",
    "Stir smoothly for 35 seconds until freezing cold.",
    "Strain into a pre-chilled glass.",
    "Garnish with two pickled cocktail onions pinned on a bamboo pick."
  ]
}
];

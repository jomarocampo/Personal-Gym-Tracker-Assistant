interface MealSeed {
  name: string;
  category:
    | "breakfast"
    | "lunch"
    | "dinner"
    | "snack"
    | "pre_workout"
    | "post_workout";
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  ingredients: string;
  instructions: string;
  tags: string;
}

export const SEED_MEALS: MealSeed[] = [
  // ─── BREAKFAST (8) ───────────────────────────────────────────────
  {
    name: "Oatmeal with Banana",
    category: "breakfast",
    calories: 350,
    protein_g: 10,
    carbs_g: 62,
    fat_g: 7,
    fiber_g: 8,
    ingredients: '["rolled oats", "banana", "honey", "cinnamon", "milk"]',
    instructions:
      "Cook oats with milk, slice banana on top, drizzle with honey and sprinkle cinnamon.",
    tags: '["meal_prep", "quick"]',
  },
  {
    name: "Egg White Omelette",
    category: "breakfast",
    calories: 220,
    protein_g: 28,
    carbs_g: 6,
    fat_g: 9,
    fiber_g: 2,
    ingredients:
      '["egg whites", "spinach", "bell pepper", "onion", "feta cheese"]',
    instructions:
      "Whisk egg whites, pour into a heated non-stick pan, add vegetables and cheese, fold and serve.",
    tags: '["high_protein", "low_carb", "cutting"]',
  },
  {
    name: "Greek Yogurt Parfait",
    category: "breakfast",
    calories: 310,
    protein_g: 22,
    carbs_g: 40,
    fat_g: 8,
    fiber_g: 4,
    ingredients:
      '["greek yogurt", "granola", "mixed berries", "honey", "chia seeds"]',
    instructions:
      "Layer Greek yogurt with granola, berries, and chia seeds in a glass. Drizzle with honey.",
    tags: '["high_protein", "quick"]',
  },
  {
    name: "Protein Pancakes",
    category: "breakfast",
    calories: 420,
    protein_g: 35,
    carbs_g: 45,
    fat_g: 10,
    fiber_g: 5,
    ingredients:
      '["protein powder", "oats", "egg whites", "banana", "baking powder"]',
    instructions:
      "Blend all ingredients, cook on a non-stick pan over medium heat until bubbles form, flip and cook through.",
    tags: '["high_protein", "bulking", "meal_prep"]',
  },
  {
    name: "Avocado Toast with Eggs",
    category: "breakfast",
    calories: 380,
    protein_g: 18,
    carbs_g: 30,
    fat_g: 22,
    fiber_g: 7,
    ingredients:
      '["whole grain bread", "avocado", "eggs", "salt", "red pepper flakes", "lemon juice"]',
    instructions:
      "Toast bread, mash avocado with lemon juice and salt, spread on toast, and top with fried or poached eggs.",
    tags: '["quick"]',
  },
  {
    name: "Overnight Oats",
    category: "breakfast",
    calories: 370,
    protein_g: 15,
    carbs_g: 55,
    fat_g: 10,
    fiber_g: 8,
    ingredients:
      '["rolled oats", "milk", "chia seeds", "maple syrup", "peanut butter", "blueberries"]',
    instructions:
      "Mix oats, milk, chia seeds, and maple syrup in a jar. Refrigerate overnight and top with peanut butter and blueberries.",
    tags: '["meal_prep", "quick"]',
  },
  {
    name: "Breakfast Burrito",
    category: "breakfast",
    calories: 480,
    protein_g: 30,
    carbs_g: 40,
    fat_g: 20,
    fiber_g: 5,
    ingredients:
      '["whole wheat tortilla", "scrambled eggs", "black beans", "cheddar cheese", "salsa", "avocado"]',
    instructions:
      "Scramble eggs, warm tortilla, fill with eggs, beans, cheese, avocado, and salsa. Roll tightly and serve.",
    tags: '["high_protein", "bulking", "meal_prep"]',
  },
  {
    name: "Cottage Cheese Bowl with Berries",
    category: "breakfast",
    calories: 260,
    protein_g: 24,
    carbs_g: 28,
    fat_g: 6,
    fiber_g: 3,
    ingredients:
      '["cottage cheese", "strawberries", "blueberries", "flax seeds", "honey"]',
    instructions:
      "Spoon cottage cheese into a bowl, top with fresh berries and flax seeds, drizzle honey.",
    tags: '["high_protein", "cutting", "quick"]',
  },

  // ─── LUNCH (9) ──────────────────────────────────────────────────
  {
    name: "Grilled Chicken Salad",
    category: "lunch",
    calories: 400,
    protein_g: 40,
    carbs_g: 18,
    fat_g: 18,
    fiber_g: 5,
    ingredients:
      '["chicken breast", "mixed greens", "cherry tomatoes", "cucumber", "olive oil", "balsamic vinegar"]',
    instructions:
      "Grill seasoned chicken breast, slice and place over mixed greens with vegetables. Dress with olive oil and balsamic.",
    tags: '["high_protein", "low_carb", "cutting", "meal_prep"]',
  },
  {
    name: "Turkey Wrap",
    category: "lunch",
    calories: 390,
    protein_g: 32,
    carbs_g: 35,
    fat_g: 14,
    fiber_g: 4,
    ingredients:
      '["whole wheat tortilla", "turkey slices", "lettuce", "tomato", "mustard", "swiss cheese"]',
    instructions:
      "Layer turkey, cheese, lettuce, and tomato on a tortilla. Add mustard, roll tightly, and slice in half.",
    tags: '["high_protein", "meal_prep", "quick"]',
  },
  {
    name: "Quinoa Bowl",
    category: "lunch",
    calories: 450,
    protein_g: 20,
    carbs_g: 58,
    fat_g: 16,
    fiber_g: 9,
    ingredients:
      '["quinoa", "chickpeas", "cucumber", "red onion", "feta cheese", "olive oil", "lemon juice"]',
    instructions:
      "Cook quinoa and let cool. Toss with chickpeas, diced vegetables, feta, olive oil, and lemon juice.",
    tags: '["vegan", "meal_prep"]',
  },
  {
    name: "Tuna Sandwich",
    category: "lunch",
    calories: 420,
    protein_g: 35,
    carbs_g: 38,
    fat_g: 14,
    fiber_g: 4,
    ingredients:
      '["canned tuna", "whole grain bread", "greek yogurt", "celery", "lettuce", "lemon juice"]',
    instructions:
      "Mix tuna with Greek yogurt, diced celery, and lemon juice. Spread on bread with lettuce.",
    tags: '["high_protein", "quick"]',
  },
  {
    name: "Chicken Stir Fry",
    category: "lunch",
    calories: 440,
    protein_g: 38,
    carbs_g: 35,
    fat_g: 16,
    fiber_g: 5,
    ingredients:
      '["chicken breast", "broccoli", "bell pepper", "snap peas", "soy sauce", "sesame oil", "brown rice"]',
    instructions:
      "Stir-fry sliced chicken until cooked, add vegetables and soy sauce, cook until tender. Serve over brown rice.",
    tags: '["high_protein", "meal_prep"]',
  },
  {
    name: "Brown Rice and Salmon",
    category: "lunch",
    calories: 520,
    protein_g: 38,
    carbs_g: 48,
    fat_g: 18,
    fiber_g: 4,
    ingredients:
      '["salmon fillet", "brown rice", "asparagus", "lemon", "olive oil", "garlic"]',
    instructions:
      "Bake salmon at 400F for 12 minutes with lemon and garlic. Serve alongside cooked brown rice and steamed asparagus.",
    tags: '["high_protein", "bulking", "meal_prep"]',
  },
  {
    name: "Lean Beef Tacos",
    category: "lunch",
    calories: 460,
    protein_g: 34,
    carbs_g: 38,
    fat_g: 18,
    fiber_g: 6,
    ingredients:
      '["lean ground beef", "corn tortillas", "lettuce", "tomato", "cheddar cheese", "salsa", "lime"]',
    instructions:
      "Brown ground beef with taco seasoning. Serve in warm corn tortillas with lettuce, tomato, cheese, and salsa.",
    tags: '["high_protein"]',
  },
  {
    name: "Mediterranean Bowl",
    category: "lunch",
    calories: 480,
    protein_g: 25,
    carbs_g: 52,
    fat_g: 20,
    fiber_g: 8,
    ingredients:
      '["falafel", "hummus", "brown rice", "cucumber", "tomato", "red onion", "tahini"]',
    instructions:
      "Arrange rice in a bowl, top with falafel, hummus, diced vegetables, and drizzle with tahini.",
    tags: '["vegan", "meal_prep"]',
  },
  {
    name: "Chicken Caesar Wrap",
    category: "lunch",
    calories: 430,
    protein_g: 36,
    carbs_g: 32,
    fat_g: 17,
    fiber_g: 3,
    ingredients:
      '["grilled chicken", "romaine lettuce", "parmesan cheese", "caesar dressing", "whole wheat tortilla"]',
    instructions:
      "Slice grilled chicken, toss with romaine and Caesar dressing, wrap in tortilla with parmesan.",
    tags: '["high_protein", "quick"]',
  },

  // ─── DINNER (9) ─────────────────────────────────────────────────
  {
    name: "Steak and Sweet Potato",
    category: "dinner",
    calories: 580,
    protein_g: 42,
    carbs_g: 45,
    fat_g: 24,
    fiber_g: 6,
    ingredients:
      '["sirloin steak", "sweet potato", "olive oil", "garlic", "rosemary", "green beans"]',
    instructions:
      "Season steak with garlic and rosemary, grill to desired doneness. Bake sweet potato at 400F for 40 minutes. Serve with steamed green beans.",
    tags: '["high_protein", "bulking"]',
  },
  {
    name: "Grilled Salmon with Vegetables",
    category: "dinner",
    calories: 490,
    protein_g: 40,
    carbs_g: 22,
    fat_g: 26,
    fiber_g: 6,
    ingredients:
      '["salmon fillet", "zucchini", "bell pepper", "asparagus", "olive oil", "lemon", "dill"]',
    instructions:
      "Grill salmon and vegetables brushed with olive oil and seasoned with dill and lemon for 10-12 minutes.",
    tags: '["high_protein", "low_carb", "cutting"]',
  },
  {
    name: "Chicken Breast with Rice",
    category: "dinner",
    calories: 500,
    protein_g: 44,
    carbs_g: 50,
    fat_g: 10,
    fiber_g: 3,
    ingredients:
      '["chicken breast", "white rice", "broccoli", "soy sauce", "garlic powder", "olive oil"]',
    instructions:
      "Bake seasoned chicken breast at 375F for 22 minutes. Serve with steamed rice and broccoli.",
    tags: '["high_protein", "bulking", "meal_prep"]',
  },
  {
    name: "Lean Beef and Broccoli",
    category: "dinner",
    calories: 460,
    protein_g: 38,
    carbs_g: 30,
    fat_g: 20,
    fiber_g: 5,
    ingredients:
      '["lean beef strips", "broccoli", "soy sauce", "garlic", "ginger", "sesame oil", "brown rice"]',
    instructions:
      "Stir-fry beef strips with garlic and ginger, add broccoli and soy sauce. Serve over brown rice.",
    tags: '["high_protein", "meal_prep"]',
  },
  {
    name: "Shrimp Pasta",
    category: "dinner",
    calories: 520,
    protein_g: 34,
    carbs_g: 58,
    fat_g: 16,
    fiber_g: 4,
    ingredients:
      '["shrimp", "whole wheat pasta", "garlic", "cherry tomatoes", "olive oil", "parsley", "parmesan"]',
    instructions:
      "Cook pasta al dente. Saute shrimp with garlic and tomatoes in olive oil. Toss with pasta and top with parmesan.",
    tags: '["high_protein"]',
  },
  {
    name: "Turkey Meatballs",
    category: "dinner",
    calories: 470,
    protein_g: 38,
    carbs_g: 42,
    fat_g: 16,
    fiber_g: 5,
    ingredients:
      '["ground turkey", "whole wheat breadcrumbs", "egg", "garlic", "marinara sauce", "whole wheat spaghetti"]',
    instructions:
      "Mix turkey with breadcrumbs, egg, and garlic, form into balls. Bake at 400F for 20 minutes. Serve with marinara over spaghetti.",
    tags: '["high_protein", "meal_prep"]',
  },
  {
    name: "Baked Cod with Quinoa",
    category: "dinner",
    calories: 420,
    protein_g: 36,
    carbs_g: 40,
    fat_g: 12,
    fiber_g: 5,
    ingredients:
      '["cod fillet", "quinoa", "lemon", "cherry tomatoes", "olive oil", "capers", "spinach"]',
    instructions:
      "Bake cod at 400F for 15 minutes with lemon and tomatoes. Serve over quinoa with sauteed spinach.",
    tags: '["high_protein", "cutting"]',
  },
  {
    name: "Chicken Fajitas",
    category: "dinner",
    calories: 490,
    protein_g: 36,
    carbs_g: 40,
    fat_g: 20,
    fiber_g: 6,
    ingredients:
      '["chicken breast", "bell peppers", "onion", "whole wheat tortillas", "lime", "cumin", "sour cream"]',
    instructions:
      "Slice and saute chicken with peppers and onion seasoned with cumin and lime. Serve in warm tortillas with sour cream.",
    tags: '["high_protein", "meal_prep"]',
  },
  {
    name: "Tofu and Vegetable Curry",
    category: "dinner",
    calories: 430,
    protein_g: 20,
    carbs_g: 48,
    fat_g: 18,
    fiber_g: 7,
    ingredients:
      '["firm tofu", "coconut milk", "curry paste", "sweet potato", "spinach", "brown rice", "garlic"]',
    instructions:
      "Cube tofu and brown in a pan. Add curry paste, coconut milk, and diced sweet potato. Simmer 20 minutes, stir in spinach, serve over rice.",
    tags: '["vegan", "meal_prep"]',
  },

  // ─── SNACK (8) ──────────────────────────────────────────────────
  {
    name: "Protein Shake",
    category: "snack",
    calories: 200,
    protein_g: 30,
    carbs_g: 12,
    fat_g: 4,
    fiber_g: 1,
    ingredients: '["whey protein powder", "milk", "ice"]',
    instructions: "Blend protein powder with milk and ice until smooth.",
    tags: '["high_protein", "quick"]',
  },
  {
    name: "Trail Mix",
    category: "snack",
    calories: 280,
    protein_g: 8,
    carbs_g: 30,
    fat_g: 16,
    fiber_g: 3,
    ingredients:
      '["almonds", "cashews", "dried cranberries", "dark chocolate chips", "pumpkin seeds"]',
    instructions:
      "Combine all ingredients in a container. Portion into serving-sized bags for easy snacking.",
    tags: '["quick", "meal_prep"]',
  },
  {
    name: "Rice Cakes with Peanut Butter",
    category: "snack",
    calories: 230,
    protein_g: 8,
    carbs_g: 28,
    fat_g: 10,
    fiber_g: 2,
    ingredients: '["rice cakes", "peanut butter", "honey"]',
    instructions:
      "Spread peanut butter on rice cakes and drizzle with a touch of honey.",
    tags: '["quick"]',
  },
  {
    name: "Cottage Cheese and Fruit",
    category: "snack",
    calories: 180,
    protein_g: 20,
    carbs_g: 18,
    fat_g: 3,
    fiber_g: 2,
    ingredients: '["cottage cheese", "pineapple chunks", "cinnamon"]',
    instructions:
      "Scoop cottage cheese into a bowl and top with pineapple and cinnamon.",
    tags: '["high_protein", "cutting", "quick"]',
  },
  {
    name: "Hard-Boiled Eggs",
    category: "snack",
    calories: 140,
    protein_g: 12,
    carbs_g: 1,
    fat_g: 10,
    fiber_g: 0,
    ingredients: '["eggs", "salt", "pepper"]',
    instructions:
      "Boil eggs for 10 minutes, cool in ice water, peel, and season with salt and pepper.",
    tags: '["high_protein", "low_carb", "meal_prep", "quick"]',
  },
  {
    name: "Beef Jerky",
    category: "snack",
    calories: 170,
    protein_g: 24,
    carbs_g: 6,
    fat_g: 5,
    fiber_g: 0,
    ingredients: '["beef jerky"]',
    instructions: "Open package and enjoy. Choose a low-sodium variety when possible.",
    tags: '["high_protein", "low_carb", "quick"]',
  },
  {
    name: "Banana with Almond Butter",
    category: "snack",
    calories: 260,
    protein_g: 7,
    carbs_g: 32,
    fat_g: 14,
    fiber_g: 4,
    ingredients: '["banana", "almond butter"]',
    instructions:
      "Slice banana and spread almond butter on each slice, or dip directly.",
    tags: '["quick", "vegan"]',
  },
  {
    name: "Edamame",
    category: "snack",
    calories: 190,
    protein_g: 17,
    carbs_g: 14,
    fat_g: 8,
    fiber_g: 8,
    ingredients: '["edamame", "sea salt"]',
    instructions:
      "Steam or microwave edamame for 3-4 minutes. Sprinkle with sea salt and serve.",
    tags: '["high_protein", "vegan", "quick"]',
  },

  // ─── PRE-WORKOUT (6) ────────────────────────────────────────────
  {
    name: "Banana and Oats",
    category: "pre_workout",
    calories: 300,
    protein_g: 8,
    carbs_g: 55,
    fat_g: 6,
    fiber_g: 6,
    ingredients: '["banana", "rolled oats", "honey", "cinnamon"]',
    instructions:
      "Cook oats, slice banana on top, drizzle with honey. Eat 45-60 minutes before workout.",
    tags: '["quick"]',
  },
  {
    name: "Rice Cakes with Honey",
    category: "pre_workout",
    calories: 180,
    protein_g: 3,
    carbs_g: 40,
    fat_g: 1,
    fiber_g: 1,
    ingredients: '["rice cakes", "honey"]',
    instructions:
      "Drizzle honey over rice cakes. Eat 30 minutes before training for quick energy.",
    tags: '["quick"]',
  },
  {
    name: "PB&J Sandwich",
    category: "pre_workout",
    calories: 380,
    protein_g: 12,
    carbs_g: 50,
    fat_g: 16,
    fiber_g: 4,
    ingredients:
      '["whole wheat bread", "peanut butter", "strawberry jam"]',
    instructions:
      "Spread peanut butter and jam on bread slices. Eat 60 minutes before workout.",
    tags: '["quick", "bulking"]',
  },
  {
    name: "Fruit Smoothie",
    category: "pre_workout",
    calories: 250,
    protein_g: 5,
    carbs_g: 55,
    fat_g: 2,
    fiber_g: 4,
    ingredients: '["banana", "strawberries", "orange juice", "honey"]',
    instructions:
      "Blend all fruits with orange juice and honey until smooth. Drink 30-45 minutes before training.",
    tags: '["quick", "vegan"]',
  },
  {
    name: "Granola Bar",
    category: "pre_workout",
    calories: 210,
    protein_g: 5,
    carbs_g: 35,
    fat_g: 7,
    fiber_g: 3,
    ingredients:
      '["oats", "honey", "peanut butter", "dark chocolate chips", "dried cranberries"]',
    instructions:
      "Mix ingredients, press into a pan, refrigerate for 2 hours, and cut into bars. Eat one bar 30 minutes before workout.",
    tags: '["meal_prep", "quick"]',
  },
  {
    name: "Apple Slices with Peanut Butter",
    category: "pre_workout",
    calories: 240,
    protein_g: 7,
    carbs_g: 30,
    fat_g: 12,
    fiber_g: 5,
    ingredients: '["apple", "peanut butter"]',
    instructions:
      "Slice apple and serve with peanut butter for dipping. Eat 30-45 minutes before workout.",
    tags: '["quick", "vegan"]',
  },

  // ─── POST-WORKOUT (6) ───────────────────────────────────────────
  {
    name: "Whey Protein with Banana",
    category: "post_workout",
    calories: 320,
    protein_g: 35,
    carbs_g: 38,
    fat_g: 4,
    fiber_g: 3,
    ingredients: '["whey protein powder", "banana", "milk", "ice"]',
    instructions:
      "Blend protein powder, banana, milk, and ice until smooth. Drink within 30 minutes after workout.",
    tags: '["high_protein", "quick"]',
  },
  {
    name: "Chicken and White Rice",
    category: "post_workout",
    calories: 480,
    protein_g: 42,
    carbs_g: 52,
    fat_g: 8,
    fiber_g: 2,
    ingredients:
      '["chicken breast", "white rice", "soy sauce", "garlic powder"]',
    instructions:
      "Grill or bake seasoned chicken breast, serve with steamed white rice. Eat within 1 hour after training.",
    tags: '["high_protein", "bulking", "meal_prep"]',
  },
  {
    name: "Chocolate Milk",
    category: "post_workout",
    calories: 250,
    protein_g: 16,
    carbs_g: 36,
    fat_g: 5,
    fiber_g: 1,
    ingredients: '["whole milk", "chocolate syrup"]',
    instructions:
      "Mix chocolate syrup into cold milk. Drink immediately after workout for fast recovery.",
    tags: '["quick"]',
  },
  {
    name: "Tuna and Crackers",
    category: "post_workout",
    calories: 280,
    protein_g: 28,
    carbs_g: 24,
    fat_g: 8,
    fiber_g: 2,
    ingredients:
      '["canned tuna", "whole wheat crackers", "lemon juice", "black pepper"]',
    instructions:
      "Drain tuna, season with lemon juice and pepper, serve on whole wheat crackers.",
    tags: '["high_protein", "quick"]',
  },
  {
    name: "Protein Bar with Fruit",
    category: "post_workout",
    calories: 330,
    protein_g: 25,
    carbs_g: 38,
    fat_g: 10,
    fiber_g: 3,
    ingredients: '["protein bar", "apple"]',
    instructions:
      "Eat a protein bar with a piece of fruit within 30 minutes of finishing your workout.",
    tags: '["high_protein", "quick"]',
  },
  {
    name: "Greek Yogurt with Granola and Honey",
    category: "post_workout",
    calories: 350,
    protein_g: 24,
    carbs_g: 44,
    fat_g: 8,
    fiber_g: 3,
    ingredients: '["greek yogurt", "granola", "honey", "banana"]',
    instructions:
      "Spoon yogurt into a bowl, top with granola and sliced banana, drizzle with honey. Eat after training.",
    tags: '["high_protein", "quick"]',
  },
];

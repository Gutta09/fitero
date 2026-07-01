export type Food = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  category: string;
};

export const FOOD_DB: Food[] = [
  // ── PROTEINS ──────────────────────────────────────────────
  { id: "chicken-breast", name: "Chicken Breast (cooked)", calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: "100g", category: "Protein" },
  { id: "chicken-thigh", name: "Chicken Thigh (cooked)", calories: 209, protein: 26, carbs: 0, fat: 11, servingSize: "100g", category: "Protein" },
  { id: "turkey-breast", name: "Turkey Breast (cooked)", calories: 135, protein: 30, carbs: 0, fat: 1, servingSize: "100g", category: "Protein" },
  { id: "beef-lean-93", name: "Lean Ground Beef 93%", calories: 152, protein: 21, carbs: 0, fat: 7, servingSize: "100g", category: "Protein" },
  { id: "beef-steak", name: "Sirloin Steak (cooked)", calories: 207, protein: 26, carbs: 0, fat: 11, servingSize: "100g", category: "Protein" },
  { id: "salmon", name: "Salmon (cooked)", calories: 208, protein: 28, carbs: 0, fat: 10, servingSize: "100g", category: "Protein" },
  { id: "tuna-canned", name: "Canned Tuna in Water", calories: 116, protein: 26, carbs: 0, fat: 1, servingSize: "100g", category: "Protein" },
  { id: "tilapia", name: "Tilapia (cooked)", calories: 128, protein: 26, carbs: 0, fat: 2.7, servingSize: "100g", category: "Protein" },
  { id: "shrimp", name: "Shrimp (cooked)", calories: 99, protein: 24, carbs: 0, fat: 0.3, servingSize: "100g", category: "Protein" },
  { id: "egg-whole", name: "Whole Egg", calories: 72, protein: 6.3, carbs: 0.4, fat: 5, servingSize: "1 large (50g)", category: "Protein" },
  { id: "egg-white", name: "Egg White", calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, servingSize: "1 large (33g)", category: "Protein" },
  { id: "greek-yogurt-0", name: "Greek Yogurt 0% Fat", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, servingSize: "100g", category: "Protein" },
  { id: "greek-yogurt-2", name: "Greek Yogurt 2% Fat", calories: 73, protein: 9, carbs: 4, fat: 2, servingSize: "100g", category: "Protein" },
  { id: "cottage-cheese", name: "Cottage Cheese 2%", calories: 90, protein: 12, carbs: 4, fat: 2.5, servingSize: "100g", category: "Protein" },
  { id: "whey-protein", name: "Whey Protein Powder", calories: 120, protein: 24, carbs: 3, fat: 2, servingSize: "1 scoop (30g)", category: "Protein" },
  { id: "casein-protein", name: "Casein Protein Powder", calories: 115, protein: 24, carbs: 2, fat: 1, servingSize: "1 scoop (30g)", category: "Protein" },
  { id: "milk-skim", name: "Skim Milk", calories: 35, protein: 3.4, carbs: 4.9, fat: 0.1, servingSize: "100ml", category: "Protein" },
  { id: "milk-whole", name: "Whole Milk", calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, servingSize: "100ml", category: "Protein" },

  // ── CARBOHYDRATES ─────────────────────────────────────────
  { id: "rice-white", name: "White Rice (cooked)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, servingSize: "100g", category: "Carbs" },
  { id: "rice-brown", name: "Brown Rice (cooked)", calories: 112, protein: 2.6, carbs: 24, fat: 0.8, servingSize: "100g", category: "Carbs" },
  { id: "rice-jasmine", name: "Jasmine Rice (cooked)", calories: 129, protein: 2.4, carbs: 28, fat: 0.2, servingSize: "100g", category: "Carbs" },
  { id: "oats-rolled", name: "Rolled Oats (dry)", calories: 389, protein: 17, carbs: 66, fat: 7, servingSize: "100g", category: "Carbs" },
  { id: "sweet-potato", name: "Sweet Potato (baked)", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, servingSize: "100g", category: "Carbs" },
  { id: "white-potato", name: "White Potato (boiled)", calories: 87, protein: 1.9, carbs: 20, fat: 0.1, servingSize: "100g", category: "Carbs" },
  { id: "pasta-cooked", name: "Pasta (cooked)", calories: 131, protein: 5, carbs: 25, fat: 1.1, servingSize: "100g", category: "Carbs" },
  { id: "bread-whole-wheat", name: "Whole Wheat Bread", calories: 247, protein: 13, carbs: 41, fat: 4.2, servingSize: "100g", category: "Carbs" },
  { id: "bread-white", name: "White Bread", calories: 265, protein: 9, carbs: 49, fat: 3.2, servingSize: "100g", category: "Carbs" },
  { id: "bagel", name: "Plain Bagel", calories: 270, protein: 10, carbs: 53, fat: 1.5, servingSize: "1 bagel (105g)", category: "Carbs" },
  { id: "banana", name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, servingSize: "1 medium (118g)", category: "Carbs" },
  { id: "apple", name: "Apple", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, servingSize: "100g", category: "Carbs" },
  { id: "orange", name: "Orange", calories: 47, protein: 0.9, carbs: 12, fat: 0.1, servingSize: "100g", category: "Carbs" },
  { id: "blueberries", name: "Blueberries", calories: 57, protein: 0.7, carbs: 14, fat: 0.3, servingSize: "100g", category: "Carbs" },
  { id: "strawberries", name: "Strawberries", calories: 32, protein: 0.7, carbs: 8, fat: 0.3, servingSize: "100g", category: "Carbs" },
  { id: "mango", name: "Mango", calories: 60, protein: 0.8, carbs: 15, fat: 0.4, servingSize: "100g", category: "Carbs" },
  { id: "quinoa", name: "Quinoa (cooked)", calories: 120, protein: 4.4, carbs: 22, fat: 1.9, servingSize: "100g", category: "Carbs" },
  { id: "corn-tortilla", name: "Corn Tortilla", calories: 218, protein: 6, carbs: 46, fat: 3, servingSize: "100g", category: "Carbs" },

  // ── FATS ──────────────────────────────────────────────────
  { id: "avocado", name: "Avocado", calories: 160, protein: 2, carbs: 9, fat: 15, servingSize: "100g", category: "Fats" },
  { id: "almonds", name: "Almonds", calories: 579, protein: 21, carbs: 22, fat: 50, servingSize: "100g", category: "Fats" },
  { id: "peanuts", name: "Peanuts", calories: 567, protein: 26, carbs: 16, fat: 49, servingSize: "100g", category: "Fats" },
  { id: "peanut-butter", name: "Peanut Butter", calories: 588, protein: 25, carbs: 20, fat: 50, servingSize: "100g", category: "Fats" },
  { id: "almond-butter", name: "Almond Butter", calories: 614, protein: 21, carbs: 19, fat: 56, servingSize: "100g", category: "Fats" },
  { id: "walnuts", name: "Walnuts", calories: 654, protein: 15, carbs: 14, fat: 65, servingSize: "100g", category: "Fats" },
  { id: "olive-oil", name: "Olive Oil", calories: 884, protein: 0, carbs: 0, fat: 100, servingSize: "1 tbsp (14g)", category: "Fats" },
  { id: "coconut-oil", name: "Coconut Oil", calories: 862, protein: 0, carbs: 0, fat: 100, servingSize: "1 tbsp (14g)", category: "Fats" },
  { id: "chia-seeds", name: "Chia Seeds", calories: 486, protein: 17, carbs: 42, fat: 31, servingSize: "100g", category: "Fats" },
  { id: "flaxseeds", name: "Flaxseeds", calories: 534, protein: 18, carbs: 29, fat: 42, servingSize: "100g", category: "Fats" },

  // ── VEGETABLES ────────────────────────────────────────────
  { id: "broccoli", name: "Broccoli (cooked)", calories: 35, protein: 2.4, carbs: 7, fat: 0.4, servingSize: "100g", category: "Vegetables" },
  { id: "spinach", name: "Spinach (raw)", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: "100g", category: "Vegetables" },
  { id: "kale", name: "Kale (raw)", calories: 35, protein: 2.9, carbs: 6, fat: 0.5, servingSize: "100g", category: "Vegetables" },
  { id: "asparagus", name: "Asparagus (cooked)", calories: 22, protein: 2.4, carbs: 4.1, fat: 0.2, servingSize: "100g", category: "Vegetables" },
  { id: "green-beans", name: "Green Beans (cooked)", calories: 31, protein: 1.8, carbs: 7, fat: 0.1, servingSize: "100g", category: "Vegetables" },
  { id: "bell-pepper", name: "Bell Pepper (raw)", calories: 31, protein: 1, carbs: 6, fat: 0.3, servingSize: "100g", category: "Vegetables" },
  { id: "cucumber", name: "Cucumber (raw)", calories: 16, protein: 0.7, carbs: 4, fat: 0.1, servingSize: "100g", category: "Vegetables" },
  { id: "tomato", name: "Tomato (raw)", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, servingSize: "100g", category: "Vegetables" },
  { id: "mushrooms", name: "Mushrooms (cooked)", calories: 28, protein: 2, carbs: 5, fat: 0.5, servingSize: "100g", category: "Vegetables" },
  { id: "onion", name: "Onion (raw)", calories: 40, protein: 1.1, carbs: 9, fat: 0.1, servingSize: "100g", category: "Vegetables" },

  // ── DAIRY / EXTRAS ────────────────────────────────────────
  { id: "cheddar-cheese", name: "Cheddar Cheese", calories: 402, protein: 25, carbs: 1.3, fat: 33, servingSize: "100g", category: "Dairy" },
  { id: "mozzarella", name: "Mozzarella", calories: 280, protein: 28, carbs: 2.2, fat: 17, servingSize: "100g", category: "Dairy" },
  { id: "butter", name: "Butter", calories: 717, protein: 0.9, carbs: 0.1, fat: 81, servingSize: "100g", category: "Dairy" },
  { id: "mass-gainer", name: "Mass Gainer Shake", calories: 400, protein: 30, carbs: 60, fat: 5, servingSize: "1 serving (150g)", category: "Supplements" },
  { id: "protein-bar", name: "Protein Bar (avg)", calories: 200, protein: 20, carbs: 22, fat: 7, servingSize: "1 bar (60g)", category: "Supplements" },
  { id: "rice-cakes", name: "Rice Cakes (plain)", calories: 387, protein: 7, carbs: 82, fat: 2.8, servingSize: "100g", category: "Carbs" },
];

export const FOOD_CATEGORIES = [...new Set(FOOD_DB.map((f) => f.category))];

export function searchFoods(query: string): Food[] {
  const q = query.toLowerCase().trim();
  if (!q) return FOOD_DB.slice(0, 10);
  return FOOD_DB.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
  ).slice(0, 12);
}

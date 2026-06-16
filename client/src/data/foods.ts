export type Food = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
};

export const FOOD_DB: Food[] = [
  { id: "chicken-breast", name: "Chicken Breast (cooked)", calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: "100g" },
  { id: "rice-white", name: "White Rice (cooked)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, servingSize: "100g" },
  { id: "rice-brown", name: "Brown Rice (cooked)", calories: 112, protein: 2.6, carbs: 24, fat: 0.8, servingSize: "100g" },
  { id: "egg-whole", name: "Whole Egg", calories: 72, protein: 6.3, carbs: 0.4, fat: 5, servingSize: "1 large" },
  { id: "egg-white", name: "Egg White", calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, servingSize: "1 large" },
  { id: "oats", name: "Rolled Oats (dry)", calories: 389, protein: 17, carbs: 66, fat: 7, servingSize: "100g" },
  { id: "sweet-potato", name: "Sweet Potato (baked)", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, servingSize: "100g" },
  { id: "salmon", name: "Atlantic Salmon (cooked)", calories: 208, protein: 28, carbs: 0, fat: 10, servingSize: "100g" },
  { id: "tuna-canned", name: "Canned Tuna in Water", calories: 116, protein: 26, carbs: 0, fat: 1, servingSize: "100g" },
  { id: "beef-lean", name: "Lean Ground Beef 93%", calories: 215, protein: 28, carbs: 0, fat: 11, servingSize: "100g" },
  { id: "greek-yogurt", name: "Greek Yogurt (plain, 0%)", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, servingSize: "100g" },
  { id: "cottage-cheese", name: "Cottage Cheese 2%", calories: 90, protein: 12, carbs: 4, fat: 2.5, servingSize: "100g" },
  { id: "whey-protein", name: "Whey Protein Powder", calories: 120, protein: 24, carbs: 3, fat: 2, servingSize: "1 scoop (30g)" },
  { id: "banana", name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, servingSize: "1 medium (118g)" },
  { id: "apple", name: "Apple", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, servingSize: "100g" },
  { id: "blueberries", name: "Blueberries", calories: 57, protein: 0.7, carbs: 14, fat: 0.3, servingSize: "100g" },
  { id: "broccoli", name: "Broccoli (cooked)", calories: 35, protein: 2.4, carbs: 7, fat: 0.4, servingSize: "100g" },
  { id: "spinach", name: "Spinach (raw)", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: "100g" },
  { id: "almonds", name: "Almonds", calories: 579, protein: 21, carbs: 22, fat: 50, servingSize: "100g" },
  { id: "olive-oil", name: "Olive Oil", calories: 884, protein: 0, carbs: 0, fat: 100, servingSize: "100ml" },
  { id: "avocado", name: "Avocado", calories: 160, protein: 2, carbs: 9, fat: 15, servingSize: "100g" },
  { id: "milk-2pct", name: "Milk 2%", calories: 50, protein: 3.4, carbs: 5, fat: 2, servingSize: "100ml" },
  { id: "pasta", name: "Pasta (cooked)", calories: 131, protein: 5, carbs: 25, fat: 1.1, servingSize: "100g" },
  { id: "bread-whole", name: "Whole Wheat Bread", calories: 247, protein: 13, carbs: 41, fat: 4.2, servingSize: "100g" },
  { id: "peanut-butter", name: "Peanut Butter", calories: 588, protein: 25, carbs: 20, fat: 50, servingSize: "100g" },
];

export function searchFoods(query: string): Food[] {
  const q = query.toLowerCase().trim();
  if (!q) return FOOD_DB.slice(0, 8);
  return FOOD_DB.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 10);
}

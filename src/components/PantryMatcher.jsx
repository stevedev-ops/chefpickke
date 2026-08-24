import React, { useState } from 'react';
import { ShoppingBag, Check, Sparkles, Utensils } from 'lucide-react';

const COMMON_KENYAN_INGREDIENTS = [
  "Meat / Beef", "Eggs", "Cabbage", "Tomatoes", "Red Onions", "Maize Flour (Unga)", 
  "Chicken (Kuku)", "Rice (Pishori/Basmati)", "Garlic", "Ginger", 
  "Coconut Milk", "Potatoes (Viazi)", "Sukuma Wiki", "Managu", "Omena", 
  "Beans (Maharagwe)", "Ndengu / Kamande (Lentils)", "Dhania (Coriander)", 
  "Chili / Pilipili", "Carrots", "Pork", "Tilapia / Fish"
];

// Kenyan Ingredient Synonym Dictionary
const SYNONYM_MAP = {
  "meat": ["beef", "meat", "nyama", "sirloin", "ribeye", "steak", "chunks", "minced"],
  "meat / beef": ["beef", "meat", "nyama", "sirloin", "ribeye", "steak", "chunks", "minced"],
  "beef": ["beef", "meat", "nyama", "sirloin", "ribeye", "steak", "chunks", "minced"],
  "chicken (kuku)": ["chicken", "kuku", "wings", "drumsticks"],
  "chicken": ["chicken", "kuku", "wings", "drumsticks"],
  "kuku": ["chicken", "kuku", "wings", "drumsticks"],
  "tilapia / fish": ["fish", "tilapia", "samaki", "ngege", "omena"],
  "fish": ["fish", "tilapia", "samaki", "ngege", "omena"],
  "maize flour (unga)": ["maize flour", "unga", "flour"],
  "maize flour": ["maize flour", "unga", "flour"],
  "unga": ["maize flour", "unga", "flour"],
  "potatoes (viazi)": ["potatoes", "potato", "viazi", "waru", "fries", "chips"],
  "potatoes": ["potatoes", "potato", "viazi", "waru", "fries", "chips"],
  "viazi": ["potatoes", "potato", "viazi", "waru", "fries", "chips"],
  "ndengu / kamande (lentils)": ["lentils", "kamande", "ndengu", "mung beans"],
  "ndengu": ["lentils", "kamande", "ndengu", "mung beans"],
  "kamande": ["lentils", "kamande", "ndengu", "mung beans"],
  "dhania (coriander)": ["coriander", "dhania", "cilantro"],
  "dhania": ["coriander", "dhania", "cilantro"]
};

export default function PantryMatcher({ recipes, onSelectRecipe }) {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [customInput, setCustomInput] = useState('');

  const toggleIngredient = (ing) => {
    setSelectedIngredients(prev =>
      prev.includes(ing)
        ? prev.filter(item => item !== ing)
        : [...prev, ing]
    );
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (customInput.trim() && !selectedIngredients.includes(customInput.trim())) {
      setSelectedIngredients(prev => [...prev, customInput.trim()]);
      setCustomInput('');
    }
  };

  const matchedRecipes = recipes.map(recipe => {
    if (selectedIngredients.length === 0) return { ...recipe, matchCount: 0, matchPercentage: 0, matchedItems: [] };

    const recipeIngNames = recipe.ingredients.map(i => i.name.toLowerCase());
    
    const matchedItems = selectedIngredients.filter(userIng => {
      const userIngLower = userIng.toLowerCase().trim();
      const synonyms = SYNONYM_MAP[userIngLower] || [userIngLower.replace(/ \(.*\)/, '')];

      return recipeIngNames.some(rIng => {
        return synonyms.some(syn => rIng.includes(syn.toLowerCase()));
      });
    });

    const matchPercentage = Math.round((matchedItems.length / Math.max(selectedIngredients.length, 1)) * 100);

    return {
      ...recipe,
      matchCount: matchedItems.length,
      matchPercentage,
      matchedItems
    };
  })
  .filter(r => selectedIngredients.length === 0 || r.matchCount > 0)
  .sort((a, b) => b.matchCount - a.matchCount || b.matchPercentage - a.matchPercentage);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-slate-900/60 backdrop-blur-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>What's In My Kitchen? 🧺</span>
            <span className="text-xs bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-bold">Pantry Matcher</span>
          </h2>
          <p className="text-xs text-slate-400">
            Select what you have at home. Smart matching automatically recognizes Meat = Beef = Nyama!
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Tap ingredients in your kitchen:
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_KENYAN_INGREDIENTS.map(ing => {
            const isSelected = selectedIngredients.includes(ing);
            return (
              <button
                key={ing}
                onClick={() => toggleIngredient(ing)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{ing}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleAddCustom} className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Add custom ingredient (e.g., Royco, Lemon, Milk)..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition border border-slate-700"
          >
            Add Ingredient
          </button>
        </form>
      </div>

      {selectedIngredients.length > 0 && (
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Matching Meals ({matchedRecipes.length} recipes match your kitchen)</span>
            </h3>
            <button
              onClick={() => setSelectedIngredients([])}
              className="text-xs text-amber-400 hover:underline"
            >
              Clear Selection
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedRecipes.slice(0, 6).map(recipe => (
              <div
                key={recipe.id}
                onClick={() => onSelectRecipe(recipe)}
                className="bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl cursor-pointer transition flex gap-3 group"
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-20 h-20 rounded-xl object-cover group-hover:scale-105 transition"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                        {recipe.matchCount} matched ({recipe.matchPercentage}%)
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition line-clamp-1">
                      {recipe.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      Chef: {recipe.chef.name}
                    </p>
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                    <Utensils className="w-3 h-3" />
                    <span className="truncate">Matched: {recipe.matchedItems.join(", ")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

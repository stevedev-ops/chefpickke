import React from 'react';
import { Sparkles, Dices, Clock, Flame, Utensils, Play, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MealDecider({ recipes, featuredMeal, setFeaturedMeal, onSelectRecipe }) {

  const triggerSpin = () => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.4 } });
    const randomIndex = Math.floor(Math.random() * recipes.length);
    setFeaturedMeal(recipes[randomIndex]);
  };

  if (!featuredMeal) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 p-4 sm:p-6 shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Meal Decider Engine</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-heading font-black text-white leading-tight">
              What Should You Eat Today? 🇰🇪
            </h2>
            <p className="text-xs text-slate-400 max-w-lg">
              Can't decide? Let ChefPick pick a random delicious meal made with local market ingredients!
            </p>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
            <button
              onClick={triggerSpin}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Dices className="w-4 h-4" />
              <span>Try Another Meal! 🎲</span>
            </button>

            <button
              onClick={() => onSelectRecipe(featuredMeal)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition border border-slate-800"
            >
              <span>View Recipe</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Featured Meal Card Preview */}
        <div 
          onClick={() => onSelectRecipe(featuredMeal)}
          className="w-full md:w-80 glass-panel p-3.5 rounded-2xl border border-slate-800 hover:border-amber-500/40 cursor-pointer transition flex items-center gap-3.5 group bg-slate-950/70"
        >
          <img
            src={featuredMeal.image}
            alt={featuredMeal.title}
            className="w-20 h-20 rounded-xl object-cover border border-slate-800 group-hover:scale-105 transition"
          />
          <div className="flex-1 min-w-0 space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              Today's Choice
            </span>
            <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition line-clamp-1">
              {featuredMeal.title}
            </h3>
            <p className="text-[10px] text-slate-400 line-clamp-1">
              Chef: {featuredMeal.chef.name}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold pt-0.5">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> {featuredMeal.prepTime + featuredMeal.cookTime}m</span>
              <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" /> {featuredMeal.calories}cal</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

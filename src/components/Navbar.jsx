import React from 'react';
import { Utensils, Search, Dices } from 'lucide-react';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  favoritesCount,
  onRollRandom
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20">
            <Utensils className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="flex items-baseline gap-1">
            <h1 className="font-heading font-black text-base sm:text-lg tracking-tight text-white">
              ChefPick<span className="text-amber-500 ml-0.5">KE</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wide hidden lg:inline border-l border-slate-800 pl-2">
              Kenyan Chef Recipes
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-sm sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search recipes, chefs, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition"
            />
          </div>
        </div>

        {/* Actions Header Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRollRandom}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20"
          >
            <Dices className="w-3.5 h-3.5 shrink-0" />
            <span>Decide My Meal 🎲</span>
          </button>
        </div>

      </div>
    </header>
  );
}

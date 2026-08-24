import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Trash2, Plus, ShoppingBag, X, Sparkles, Search, Check, Filter } from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { id: 'lunch', label: 'Lunch', icon: '☀️' },
  { id: 'dinner', label: 'Dinner', icon: '🌙' }
];

export default function WeeklyPlanner({ recipes = [], onSelectRecipe }) {
  const [plannerState, setPlannerState] = useState(() => {
    const saved = localStorage.getItem('chefpick_weekly_planner');
    return saved ? JSON.parse(saved) : {};
  });

  const [activePickerSlot, setActivePickerSlot] = useState(null);
  const [draggedRecipe, setDraggedRecipe] = useState(null);
  const [showGroceryList, setShowGroceryList] = useState(false);
  const [trayFilter, setTrayFilter] = useState('all'); // 'all', 'breakfast', 'lunch', 'dinner'
  const [pickerFilter, setPickerFilter] = useState('all');
  const [pickerSearch, setPickerSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('chefpick_weekly_planner', JSON.stringify(plannerState));
  }, [plannerState]);

  // When activePickerSlot opens, default the modal filter to that meal type!
  useEffect(() => {
    if (activePickerSlot) {
      setPickerFilter(activePickerSlot.mealType.id);
      setPickerSearch('');
    }
  }, [activePickerSlot]);

  const handleAssignRecipe = (day, mealId, recipe) => {
    const key = `${day}-${mealId}`;
    setPlannerState(prev => ({
      ...prev,
      [key]: recipe
    }));
    setActivePickerSlot(null);
  };

  const handleRemoveRecipe = (day, mealId) => {
    const key = `${day}-${mealId}`;
    setPlannerState(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleClearWeek = () => {
    if (window.confirm("Clear your entire weekly meal plan?")) {
      setPlannerState({});
    }
  };

  const handleDragStart = (e, recipe) => {
    setDraggedRecipe(recipe);
    e.dataTransfer.setData('text/plain', recipe.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, day, mealId) => {
    e.preventDefault();
    if (draggedRecipe) {
      handleAssignRecipe(day, mealId, draggedRecipe);
      setDraggedRecipe(null);
    }
  };

  // Smart Meal Classification Helper
  const isMealMatch = (recipe, targetMealId) => {
    if (!targetMealId || targetMealId === 'all') return true;
    const target = targetMealId.toLowerCase();
    const cat = (recipe.category || '').toLowerCase();
    const cats = (recipe.categories || []).map(c => c.toLowerCase()).join(' ');
    const title = (recipe.title || '').toLowerCase();

    if (target === 'breakfast') {
      return cat.includes('breakfast') || cats.includes('breakfast') || cat.includes('snack') || 
             title.includes('breakfast') || title.includes('chai') || title.includes('mandazi') || 
             title.includes('uji') || title.includes('omelet') || title.includes('pancake') || 
             title.includes('egg') || title.includes('kebab') || title.includes('nduma') || 
             title.includes('muffin') || title.includes('saute') || title.includes('viazi karai') ||
             title.includes('coleslaw') || title.includes('hotdog') || title.includes('boerewors');
    } else if (target === 'lunch') {
      return cat.includes('lunch') || cats.includes('lunch') || cat.includes('traditional') || 
             title.includes('lunch') || title.includes('stew') || title.includes('fry') || 
             title.includes('ugali') || title.includes('rice') || title.includes('mukimo') || 
             title.includes('matoke') || title.includes('beans') || title.includes('ndengu') ||
             title.includes('mahara') || title.includes('mrenda') || title.includes('kunde');
    } else if (target === 'dinner') {
      return cat.includes('supper') || cat.includes('dinner') || cats.includes('supper') || cats.includes('gourmet') || 
             title.includes('supper') || title.includes('dinner') || title.includes('biryani') || 
             title.includes('curry') || title.includes('paka') || title.includes('samaki') || 
             title.includes('prawns') || title.includes('calamari') || title.includes('butter chicken') ||
             title.includes('pilau') || title.includes('choma') || title.includes('steak') || title.includes('ngisi');
    }
    return false;
  };

  // Top tray filtered & sorted recipes
  const trayRecipes = useMemo(() => {
    let list = [...recipes];
    if (trayFilter !== 'all') {
      list = list.filter(r => isMealMatch(r, trayFilter));
    }
    return list;
  }, [recipes, trayFilter]);

  // Picker Modal sorted recipes: Prioritizes target meal matches at the VERY TOP!
  const sortedPickerRecipes = useMemo(() => {
    let list = [...recipes];
    if (pickerSearch.trim()) {
      const query = pickerSearch.toLowerCase();
      list = list.filter(r => 
        r.title.toLowerCase().includes(query) || 
        r.chef.name.toLowerCase().includes(query) ||
        (r.category || '').toLowerCase().includes(query)
      );
    }

    const targetMealId = pickerFilter !== 'all' ? pickerFilter : (activePickerSlot ? activePickerSlot.mealType.id : null);

    if (!targetMealId) return list;

    // Sort so exact matches come FIRST
    return list.sort((a, b) => {
      const matchA = isMealMatch(a, targetMealId);
      const matchB = isMealMatch(b, targetMealId);
      if (matchA && !matchB) return -1;
      if (!matchA && matchB) return 1;
      return 0;
    });
  }, [recipes, pickerFilter, pickerSearch, activePickerSlot]);

  const getAggregatedGroceryList = () => {
    const ingredientMap = new Map();
    Object.values(plannerState).forEach(recipe => {
      if (recipe && recipe.ingredients) {
        recipe.ingredients.forEach(ing => {
          const key = ing.name.toLowerCase();
          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key);
            existing.count += 1;
          } else {
            ingredientMap.set(key, { ...ing, count: 1 });
          }
        });
      }
    });
    return Array.from(ingredientMap.values());
  };

  const scheduledRecipesCount = Object.keys(plannerState).length;
  const groceryItems = getAggregatedGroceryList();

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
              <span>Weekly Meal Planner Calendar 📅</span>
            </h2>
            <p className="text-xs text-slate-400">
              Drag & drop recipes into your Monday–Sunday schedule, or tap slots to pick meals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {scheduledRecipesCount > 0 && (
            <button
              onClick={() => setShowGroceryList(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold transition shadow-lg shadow-emerald-500/10"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Week's Grocery List ({groceryItems.length})</span>
            </button>
          )}

          {scheduledRecipesCount > 0 && (
            <button
              onClick={handleClearWeek}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-bold transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Week</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Quick Tray with Filter Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Drag Meals From Here</span>
          </span>
          
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            <button
              onClick={() => setTrayFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                trayFilter === 'all' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({recipes.length})
            </button>
            {MEAL_TYPES.map(m => (
              <button
                key={m.id}
                onClick={() => setTrayFilter(m.id)}
                className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                  trayFilter === m.id ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
          {trayRecipes.map(r => (
            <div
              key={r.id}
              draggable
              onDragStart={(e) => handleDragStart(e, r)}
              onClick={() => onSelectRecipe(r)}
              className="shrink-0 w-36 bg-slate-950 border border-slate-800 rounded-2xl p-2 cursor-grab active:cursor-grabbing hover:border-amber-500/50 transition group"
            >
              <img
                src={r.image}
                alt={r.title}
                className="w-full h-16 object-cover rounded-xl mb-1.5"
              />
              <h4 className="text-[11px] font-bold text-slate-200 line-clamp-1 group-hover:text-amber-400 transition">
                {r.title}
              </h4>
              <p className="text-[9px] text-slate-400">{r.chef.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7 Day Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {DAYS_OF_WEEK.map(day => (
          <div
            key={day}
            className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-extrabold text-white">{day}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400">
                {Object.keys(plannerState).filter(k => k.startsWith(day)).length}/3
              </span>
            </div>

            <div className="space-y-2.5">
              {MEAL_TYPES.map(meal => {
                const slotKey = `${day}-${meal.id}`;
                const assignedRecipe = plannerState[slotKey];

                return (
                  <div
                    key={meal.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, meal.id)}
                    className={`rounded-xl p-2 border transition ${
                      assignedRecipe
                        ? 'bg-slate-900 border-slate-700'
                        : 'bg-slate-900/40 border-dashed border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <span>{meal.icon}</span>
                        <span>{meal.label}</span>
                      </span>
                      {assignedRecipe && (
                        <button
                          onClick={() => handleRemoveRecipe(day, meal.id)}
                          className="text-slate-500 hover:text-red-400 transition"
                          title="Remove Meal"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {assignedRecipe ? (
                      <div
                        onClick={() => onSelectRecipe(assignedRecipe)}
                        className="cursor-pointer group space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={assignedRecipe.image}
                            alt={assignedRecipe.title}
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="text-[11px] font-bold text-white group-hover:text-amber-400 transition truncate">
                              {assignedRecipe.title}
                            </h5>
                            <p className="text-[9px] text-slate-400 truncate">
                              {assignedRecipe.prepTime + assignedRecipe.cookTime} mins
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActivePickerSlot({ day, mealType: meal })}
                        className="w-full py-2 flex items-center justify-center gap-1 text-[10px] font-bold text-slate-500 hover:text-amber-400 transition"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add {meal.label}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Selection Modal */}
      {activePickerSlot && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>{activePickerSlot.mealType.icon}</span>
                  <span>Select {activePickerSlot.mealType.label} for {activePickerSlot.day}</span>
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  ✨ Top {activePickerSlot.mealType.label} dishes prioritized at the top of the list!
                </p>
              </div>
              <button
                onClick={() => setActivePickerSlot(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs & Search */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${activePickerSlot.mealType.label.toLowerCase()} dishes...`}
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <button
                  onClick={() => setPickerFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                    pickerFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  All Recipes
                </button>
                {MEAL_TYPES.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPickerFilter(m.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 whitespace-nowrap ${
                      pickerFilter === m.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label} First</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipe List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {sortedPickerRecipes.map(r => {
                const isTopMatch = isMealMatch(r, activePickerSlot.mealType.id);

                return (
                  <div
                    key={r.id}
                    onClick={() => handleAssignRecipe(activePickerSlot.day, activePickerSlot.mealType.id, r)}
                    className={`p-2.5 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 group ${
                      isTopMatch 
                        ? 'bg-slate-900 border-amber-500/40 hover:border-amber-500/80 shadow-md shadow-amber-500/5' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition line-clamp-1">
                            {r.title}
                          </h4>
                          {isTopMatch && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              {activePickerSlot.mealType.icon} {activePickerSlot.mealType.label} Match
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">
                          By {r.chef.name} • {r.prepTime + r.cookTime} mins
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-amber-400 group-hover:translate-x-0.5 transition shrink-0">
                      Select +
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Grocery List Modal */}
      {showGroceryList && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">Weekly Market Grocery List</h3>
              </div>
              <button
                onClick={() => setShowGroceryList(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Combined ingredients for all meals scheduled in your Monday–Sunday calendar:
            </p>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {groceryItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-200 capitalize">{item.name}</span>
                  <span className="text-slate-400 font-bold bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    {item.amount * item.count} {item.unit} ({item.count}x meals)
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const text = groceryItems.map(i => `- ${i.name}: ${i.amount * i.count} ${i.unit}`).join('\n');
                navigator.clipboard.writeText(`ChefPick Kenya Weekly Grocery List:\n${text}`);
                alert("Grocery list copied to clipboard! 📋");
              }}
              className="w-full py-3 rounded-2xl bg-emerald-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20"
            >
              📋 Copy Grocery List to Clipboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import MealDecider from './components/MealDecider';
import PantryMatcher from './components/PantryMatcher';
import WeeklyPlanner from './components/WeeklyPlanner';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import AddRecipeModal from './components/AddRecipeModal';
import ChefSpotlight from './components/ChefSpotlight';
import { INITIAL_RECIPES } from './data/chefRecipes';
import { Utensils, Heart, ThumbsUp, Flame, Sparkles, ShoppingBag, TrendingUp, Award, RotateCcw, Calendar } from 'lucide-react';

export default function App() {
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem('chefpick_recipes');
    if (!saved) return INITIAL_RECIPES;

    try {
      const parsedSaved = JSON.parse(saved);
      const savedMap = new Map(parsedSaved.map(r => [r.id, r]));
      
      const merged = INITIAL_RECIPES.map(initR => {
        const savedR = savedMap.get(initR.id);
        if (savedR) {
          return {
            ...initR,
            likes: savedR.likes !== undefined ? savedR.likes : initR.likes,
            dislikes: savedR.dislikes !== undefined ? savedR.dislikes : initR.dislikes,
            cookedCount: savedR.cookedCount !== undefined ? savedR.cookedCount : initR.cookedCount
          };
        }
        return initR;
      });

      const userAdded = parsedSaved.filter(r => !INITIAL_RECIPES.some(i => i.id === r.id));
      return [...merged, ...userAdded];
    } catch (e) {
      return INITIAL_RECIPES;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeRecipeModal, setActiveRecipeModal] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [featuredMeal, setFeaturedMeal] = useState(recipes[0] || INITIAL_RECIPES[0]);
  const [showPantry, setShowPantry] = useState(false);
  const [showWeeklyPlanner, setShowWeeklyPlanner] = useState(false);

  // Check if URL has ?chef=true or ?portal=chef parameter for Chef Portal Mode
  const [isChefPortal, setIsChefPortal] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('chef') === 'true' || params.get('portal') === 'chef' || params.get('mode') === 'chef';
    }
    return false;
  });

  useEffect(() => {
    if (isChefPortal) {
      setIsAddModalOpen(true);
    }
  }, [isChefPortal]);

  const handleCopyChefLink = () => {
    if (typeof window !== 'undefined') {
      const chefUrl = `${window.location.origin}${window.location.pathname}?chef=true`;
      navigator.clipboard.writeText(chefUrl);
      alert(`Chef Portal Link Copied to Clipboard! 📋\n\nSend this link to chefs:\n${chefUrl}`);
    }
  };

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('chefpick_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // User Reactions (Like/Dislike)
  const [userReactions, setUserReactions] = useState(() => {
    const saved = localStorage.getItem('chefpick_user_reactions');
    return saved ? JSON.parse(saved) : {};
  });

  // Cook Counts
  const [cookCounts, setCookCounts] = useState(() => {
    const saved = localStorage.getItem('chefpick_cook_counts');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('chefpick_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('chefpick_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('chefpick_user_reactions', JSON.stringify(userReactions));
  }, [userReactions]);

  useEffect(() => {
    localStorage.setItem('chefpick_cook_counts', JSON.stringify(cookCounts));
  }, [cookCounts]);

  const handleToggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleLike = (id) => {
    const currentReaction = userReactions[id];
    let newReaction = 'like';
    if (currentReaction === 'like') newReaction = null;

    setUserReactions(prev => ({ ...prev, [id]: newReaction }));

    setRecipes(prev => prev.map(r => {
      if (r.id === id) {
        let likes = r.likes || 0;
        let dislikes = r.dislikes || 0;
        if (currentReaction === 'like') likes = Math.max(0, likes - 1);
        else {
          likes += 1;
          if (currentReaction === 'dislike') dislikes = Math.max(0, dislikes - 1);
        }
        return { ...r, likes, dislikes };
      }
      return r;
    }));
  };

  const handleDislike = (id) => {
    const currentReaction = userReactions[id];
    let newReaction = 'dislike';
    if (currentReaction === 'dislike') newReaction = null;

    setUserReactions(prev => ({ ...prev, [id]: newReaction }));

    setRecipes(prev => prev.map(r => {
      if (r.id === id) {
        let likes = r.likes || 0;
        let dislikes = r.dislikes || 0;
        if (currentReaction === 'dislike') dislikes = Math.max(0, dislikes - 1);
        else {
          dislikes += 1;
          if (currentReaction === 'like') likes = Math.max(0, likes - 1);
        }
        return { ...r, likes, dislikes };
      }
      return r;
    }));
  };

  const handleRecordCook = (id) => {
    setCookCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setRecipes(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, cookedCount: (r.cookedCount || 0) + 1 };
      }
      return r;
    }));
  };

  const handleAddRecipe = (newRecipe) => {
    setRecipes(prev => [newRecipe, ...prev]);
    setFeaturedMeal(newRecipe);
  };

  const handleRollMealOfDay = () => {
    const randomIndex = Math.floor(Math.random() * recipes.length);
    setFeaturedMeal(recipes[randomIndex]);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleResetData = () => {
    localStorage.removeItem('chefpick_recipes');
    setRecipes(INITIAL_RECIPES);
  };

  // DYNAMIC RE-RANKING SPOTLIGHTS BASED ON LIVE USER REACTIONS
  const sortedByLikes = [...recipes].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  const sortedByCooks = [...recipes].sort((a, b) => (b.cookedCount || 0) - (a.cookedCount || 0));

  const mostLikedMeal = sortedByLikes[0];
  const mostCookedMeal = sortedByCooks[0];
  const topCookedToday = sortedByCooks.slice(0, 3);

  // CATEGORY & SEARCH FILTERING LOGIC
  const filteredRecipes = recipes.filter(r => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      r.title.toLowerCase().includes(query) ||
      (r.chef && r.chef.name.toLowerCase().includes(query)) ||
      (r.category && r.category.toLowerCase().includes(query)) ||
      (r.ingredients && r.ingredients.some(i => i.name.toLowerCase().includes(query)));

    let matchesCategory = true;
    if (selectedCategory === '🔥 Most Liked') {
      matchesCategory = (r.likes || 0) >= 250;
    } else if (selectedCategory === '🍳 Most Cooked') {
      matchesCategory = (r.cookedCount || 0) >= 120;
    } else if (selectedCategory !== 'All') {
      const selectedLower = selectedCategory.toLowerCase().trim();
      const mainCatMatches = r.category && r.category.toLowerCase().trim() === selectedLower;
      const arrayCatMatches = r.categories && r.categories.some(c => c.toLowerCase().trim() === selectedLower);
      matchesCategory = mainCatMatches || arrayCatMatches;
    }

    const matchesFavorites = !showOnlyFavorites || favorites.includes(r.id);

    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const categories = ["All", "🔥 Most Liked", "🍳 Most Cooked", "Swahili", "Gourmet", "Fast & Easy", "High Protein", "Comfort Food", "Mama Mboga Specials"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onRollRandom={handleRollMealOfDay}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-12">
        
        {/* Featured Randomizer Card */}
        <MealDecider
          recipes={recipes}
          featuredMeal={featuredMeal}
          setFeaturedMeal={setFeaturedMeal}
          onSelectRecipe={setActiveRecipeModal}
        />

        {/* Action Bar: Weekly Planner & Kitchen Pantry Matcher Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setShowWeeklyPlanner(!showWeeklyPlanner)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-xs transition bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/20"
          >
            <Calendar className="w-4 h-4" />
            <span>{showWeeklyPlanner ? "Hide Weekly Planner Calendar" : "📅 Weekly Meal Planner Calendar (Monday–Sunday)"}</span>
          </button>

          <button
            onClick={() => setShowPantry(!showPantry)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-xs transition bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-white"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>{showPantry ? "Hide Kitchen Matcher" : "🧺 What's In My Kitchen? (Match Ingredients)"}</span>
          </button>
        </div>

        {/* Weekly Meal Planner Calendar */}
        {showWeeklyPlanner && (
          <WeeklyPlanner
            recipes={recipes}
            onSelectRecipe={setActiveRecipeModal}
          />
        )}

        {/* Pantry Component */}
        {showPantry && (
          <PantryMatcher
            recipes={recipes}
            onSelectRecipe={setActiveRecipeModal}
          />
        )}

        {/* DYNAMIC LIVE SPOTLIGHT CARDS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Live User Ratings Spotlight</span>
            </h2>
            <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full font-medium">
              ⚡ Dynamically calculated from live likes & cook reviews
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dynamic Most Liked */}
            {mostLikedMeal && (
              <div 
                onClick={() => setActiveRecipeModal(mostLikedMeal)}
                className="glass-panel p-5 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 flex items-center justify-between gap-4 cursor-pointer hover:border-amber-500 transition group"
              >
                <div className="space-y-1.5 flex-1">
                  <span className="text-[10px] font-extrabold uppercase bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-md">
                    <ThumbsUp className="w-3 h-3 fill-slate-950" /> Most Liked in Kenya
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition line-clamp-1">{mostLikedMeal.title}</h3>
                  <p className="text-xs text-slate-400">By {mostLikedMeal.chef.name} • {mostLikedMeal.likes || 0} Thumbs Up 👍</p>
                  <span className="text-xs font-bold text-amber-400 group-hover:underline pt-1 block">
                    View Recipe →
                  </span>
                </div>
                <img
                  src={mostLikedMeal.image}
                  alt={mostLikedMeal.title}
                  className="w-20 h-20 rounded-2xl object-cover border border-amber-500/40 group-hover:scale-105 transition"
                />
              </div>
            )}

            {/* Dynamic Most Cooked */}
            {mostCookedMeal && (
              <div 
                onClick={() => setActiveRecipeModal(mostCookedMeal)}
                className="glass-panel p-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-950 flex items-center justify-between gap-4 cursor-pointer hover:border-emerald-500 transition group"
              >
                <div className="space-y-1.5 flex-1">
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-md">
                    <Utensils className="w-3 h-3" /> Most Cooked Meal
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition line-clamp-1">{mostCookedMeal.title}</h3>
                  <p className="text-xs text-slate-400">By {mostCookedMeal.chef.name} • Cooked {mostCookedMeal.cookedCount || 0}x 🍳</p>
                  <span className="text-xs font-bold text-emerald-400 group-hover:underline pt-1 block">
                    View Recipe →
                  </span>
                </div>
                <img
                  src={mostCookedMeal.image}
                  alt={mostCookedMeal.title}
                  className="w-20 h-20 rounded-2xl object-cover border border-emerald-500/40 group-hover:scale-105 transition"
                />
              </div>
            )}
          </div>
        </div>

        {/* WHAT MOST PEOPLE COOKED TODAY SECTION */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-extrabold text-white">What Most People Cooked Today 🍳🔥</h3>
            </div>
            <span className="text-xs text-slate-400">Real-time daily cooking activity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topCookedToday.map((meal, idx) => (
              <div
                key={meal.id}
                onClick={() => setActiveRecipeModal(meal)}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition flex items-center gap-3 group"
              >
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-extrabold text-xs flex items-center justify-center shrink-0">
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition truncate">
                    {meal.title}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Cooked <strong className="text-amber-400">{meal.cookedCount || 0} times</strong> today
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recipe Grid & Category Filters */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white flex items-center gap-2">
                <span>Kenyan Chef Recipes ({filteredRecipes.length})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Ingredients from local Kenyan markets + direct videos from Dennis Ombachi, Chef Ali, Kaluhi, Sueh Owino, and more.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition border ${
                  showOnlyFavorites
                    ? 'bg-red-500/20 border-red-500/50 text-red-400'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-red-400' : ''}`} />
                <span>Favorites ({favorites.length})</span>
              </button>

              <button
                onClick={handleResetData}
                className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
                title="Reset Recipes & Sync New Meals"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelectRecipe={setActiveRecipeModal}
                  isFavorite={favorites.includes(recipe.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  userReaction={userReactions[recipe.id]}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800 space-y-4">
              <Utensils className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-xl font-bold text-slate-300">No Meals Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No recipes matched "{selectedCategory}". Click "All" or tap another category chip!
              </p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
              >
                Show All Meals
              </button>
            </div>
          )}
        </section>

        <ChefSpotlight />
      </main>

      {activeRecipeModal && (
        <RecipeModal
          recipe={activeRecipeModal}
          onClose={() => setActiveRecipeModal(null)}
          isFavorite={favorites.includes(activeRecipeModal.id)}
          onToggleFavorite={handleToggleFavorite}
          onLike={handleLike}
          onDislike={handleDislike}
          onRecordCook={handleRecordCook}
          userReaction={userReactions[activeRecipeModal.id]}
        />
      )}

      {isAddModalOpen && (
        <AddRecipeModal
          onClose={() => setIsAddModalOpen(false)}
          onAddRecipe={handleAddRecipe}
        />
      )}

      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500 space-y-3">
        <p>ChefPick Kenya 🇰🇪 • Made with ingredients found in Kenyan local markets & top online chef videos.</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleCopyChefLink}
            className="text-[11px] font-bold text-slate-400 hover:text-amber-400 transition flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800"
          >
            <span>👨‍🍳 Send Recipe Submission Link to Chefs</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

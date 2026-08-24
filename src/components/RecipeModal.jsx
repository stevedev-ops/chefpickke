import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Play, Clock, Flame, ThumbsUp, ThumbsDown, Heart, Check, Users, ChefHat, ExternalLink, Sparkles, Utensils } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RecipeModal({
  recipe,
  onClose,
  isFavorite,
  onToggleFavorite,
  onLike,
  onDislike,
  onRecordCook,
  userReaction
}) {
  const [servings, setServings] = useState(2);
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [activeStepTimer, setActiveStepTimer] = useState(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(0);
  const [hasCooked, setHasCooked] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    let interval = null;
    if (activeStepTimer !== null && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && activeStepTimer !== null) {
      confetti({ particleCount: 50, spread: 60 });
      setActiveStepTimer(null);
    }
    return () => clearInterval(interval);
  }, [activeStepTimer, timerSecondsLeft]);

  const toggleIngredientCheck = (idx) => {
    setCheckedIngredients(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleStartTimer = (stepIdx, seconds) => {
    setActiveStepTimer(stepIdx);
    setTimerSecondsLeft(seconds);
  };

  const handleMarkCooked = () => {
    setHasCooked(true);
    onRecordCook(recipe.id);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  };

  const scaleAmount = (amt) => {
    if (!amt) return '';
    const scaled = (amt / 2) * servings;
    return Number.isInteger(scaled) ? scaled : scaled.toFixed(1);
  };

  const likes = recipe.likes || 120;
  const dislikes = recipe.dislikes || 2;
  const cookedCount = (recipe.cookedCount || 45) + (hasCooked ? 1 : 0);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border-0 sm:border border-slate-800 min-h-screen sm:min-h-0 sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col my-0 sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Mobile Back Bar Header */}
        <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Meals</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(recipe.id)}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-red-400 border border-slate-800 transition"
              title="Add to Favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition"
              title="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Header Banner */}
        <div className="relative h-56 sm:h-72 w-full">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
                {recipe.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 backdrop-blur-md text-slate-300 font-semibold text-[10px] border border-slate-700">
                🛒 {recipe.marketCategory}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-heading font-extrabold text-white leading-tight">
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Modal Body Scroll Area */}
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 flex-1 overflow-y-auto">
          
          {/* Reaction Bar (Like & Dislike Buttons) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-1">Rate Dish:</span>
              
              {/* Like Button */}
              <button
                onClick={() => onLike(recipe.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition border ${
                  userReaction === 'like'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-emerald-500 hover:text-emerald-400'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>👍 Like ({likes})</span>
              </button>

              {/* Dislike Button */}
              <button
                onClick={() => onDislike(recipe.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition border ${
                  userReaction === 'dislike'
                    ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20'
                    : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-rose-500 hover:text-rose-400'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>👎 Dislike ({dislikes})</span>
              </button>
            </div>

            {/* Cooked Counter Button */}
            <button
              onClick={handleMarkCooked}
              disabled={hasCooked}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition border ${
                hasCooked
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-amber-500 shadow-lg'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>{hasCooked ? 'Cooked Today! 🍳' : `I Cooked This! (${cookedCount})`}</span>
            </button>
          </div>

          {/* Chef Spotlight & External Video Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={recipe.chef.avatar}
                alt={recipe.chef.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500/50"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{recipe.chef.name}</h3>
                  <span className="text-xs text-amber-400 font-semibold">{recipe.chef.handle}</span>
                </div>
                <p className="text-[11px] text-slate-400">{recipe.chef.title} • {recipe.chef.slogan}</p>
              </div>
            </div>

            {recipe.videoLink && (
              <a
                href={recipe.videoLink}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition shadow-lg shadow-red-600/20"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch {recipe.chef.name}'s Video</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Total Time</p>
                <p className="text-xs font-extrabold text-white">{recipe.prepTime + recipe.cookTime} mins</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <Flame className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Calories</p>
                <p className="text-xs font-extrabold text-white">{recipe.calories} kcal</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 col-span-2 sm:col-span-1">
              <Utensils className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Difficulty</p>
                <p className="text-xs font-extrabold text-white">{recipe.difficulty}</p>
              </div>
            </div>
          </div>

          {/* Serving Scaler & Ingredients Checklist */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Ingredients</span>
                <span className="text-xs text-slate-400 font-normal">
                  ({checkedIngredients.length}/{recipe.ingredients.length})
                </span>
              </h3>

              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <Users className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
                <span className="text-[10px] font-bold text-slate-400 mr-1">Servings:</span>
                {[1, 2, 4, 8].map(s => (
                  <button
                    key={s}
                    onClick={() => setServings(s)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold transition ${
                      servings === s
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recipe.ingredients.map((ing, idx) => {
                const isChecked = checkedIngredients.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleIngredientCheck(idx)}
                    className={`flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition border ${
                      isChecked
                        ? 'bg-amber-500/10 border-amber-500/30 text-slate-400 line-through'
                        : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className={`mt-0.5 p-1 rounded-lg border ${
                      isChecked ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-700'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-amber-400 mr-1.5">
                        {scaleAmount(ing.amount)} {ing.unit}
                      </span>
                      <span>{ing.name}</span>
                      {ing.notes && (
                        <span className="block text-[10px] text-slate-500 mt-0.5">({ing.notes})</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Step-by-Step Instructions
            </h3>

            <div className="space-y-3">
              {recipe.instructions.map((step, idx) => {
                const isTimingThis = activeStepTimer === idx;
                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center">
                          {step.step}
                        </span>
                        <h4 className="font-bold text-white text-xs">{step.title}</h4>
                      </div>

                      {step.timerSeconds && (
                        <button
                          onClick={() => handleStartTimer(idx, step.timerSeconds)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold transition border ${
                            isTimingThis
                              ? 'bg-orange-500 text-white border-orange-500 animate-pulse'
                              : 'bg-slate-900 text-amber-400 border-slate-800 hover:border-amber-500/50'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>
                            {isTimingThis
                              ? `${Math.floor(timerSecondsLeft / 60)}:${('0' + (timerSecondsLeft % 60)).slice(-2)}`
                              : `${Math.round(step.timerSeconds / 60)}m timer`}
                          </span>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-7">
                      {step.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chef Pro Tip */}
          {recipe.chefTip && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-400">Chef Pro Tip:</p>
                <p className="text-xs text-slate-300 mt-0.5">{recipe.chefTip}</p>
              </div>
            </div>
          )}

        </div>

        {/* Sticky Bottom Close Button */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition border border-slate-700 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Close & Back to All Meals</span>
          </button>
        </div>

      </div>
    </div>
  );
}

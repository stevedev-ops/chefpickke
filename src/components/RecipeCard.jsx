import React from 'react';
import { ThumbsUp, ThumbsDown, Utensils, Clock, Flame, Play, ShoppingBag, Heart } from 'lucide-react';

export default function RecipeCard({
  recipe,
  onSelectRecipe,
  isFavorite,
  onToggleFavorite,
  onLike,
  onDislike,
  userReaction // 'like', 'dislike', or null
}) {
  const likes = recipe.likes || 120;
  const dislikes = recipe.dislikes || 2;
  const cookedCount = recipe.cookedCount || 45;

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition flex flex-col group relative">
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden cursor-pointer" onClick={() => onSelectRecipe(recipe)}>
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/70 backdrop-blur-md text-slate-300 hover:text-red-400 transition border border-slate-800"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Category badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider shadow-lg">
          {recipe.category}
        </span>

        {/* Video badge */}
        {recipe.videoLink && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 text-white font-bold text-[10px] backdrop-blur-md">
            <Play className="w-3 h-3 fill-white" />
            <span>{recipe.chef.name}'s Video</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2 cursor-pointer" onClick={() => onSelectRecipe(recipe)}>
          <h3 className="font-heading text-lg font-bold text-white group-hover:text-amber-400 transition line-clamp-1">
            {recipe.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {recipe.tagline}
          </p>
        </div>

        {/* Market Source & Cook Times */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-b border-slate-800/80 py-2.5">
          <div className="flex items-center gap-1 text-slate-300 font-medium">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[120px]">{recipe.marketCategory}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {recipe.cookTime}m
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              {recipe.calories} kcal
            </span>
          </div>
        </div>

        {/* Likes, Dislikes & Cooked Counter */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(recipe.id);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                userReaction === 'like'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{likes}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDislike(recipe.id);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                userReaction === 'dislike'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>{dislikes}</span>
            </button>
          </div>

          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <Utensils className="w-3 h-3 text-amber-400" />
            <span>Cooked {cookedCount}x</span>
          </span>
        </div>
      </div>
    </div>
  );
}

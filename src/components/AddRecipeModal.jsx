import React, { useState } from 'react';
import { ChefHat, X, Check, Link as LinkIcon, Sparkles } from 'lucide-react';

export default function AddRecipeModal({ onClose, onAddRecipe }) {
  const [formData, setFormData] = useState({
    title: '',
    chefName: '',
    videoLink: '',
    category: 'Swahili',
    marketCategory: 'Mama Mboga Specials',
    prepTime: 15,
    cookTime: 30,
    difficulty: 'Easy',
    ingredientsStr: '',
    instructionsStr: '',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    videoPlatform: 'YouTube'
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.chefName || !formData.videoLink) {
      alert("Please fill in the Dish Title, Chef Name, and Video Link!");
      return;
    }

    const rawIngredients = formData.ingredientsStr.split('\n').filter(i => i.trim().length > 0);
    const ingredients = rawIngredients.map(line => ({
      name: line.trim(),
      amount: 1,
      unit: "portion",
      notes: "Kenyan market sourced"
    }));

    const rawInstructions = formData.instructionsStr.split('\n').filter(i => i.trim().length > 0);
    const instructions = rawInstructions.map((line, idx) => ({
      step: idx + 1,
      title: `Step ${idx + 1}`,
      detail: line.trim(),
      timerSeconds: 300
    }));

    const newRecipe = {
      id: `chef-submit-${Date.now()}`,
      title: formData.title,
      tagline: `${formData.chefName}'s signature ${formData.category} dish.`,
      category: formData.category,
      categories: [formData.category, "Fast & Easy"],
      marketCategory: formData.marketCategory,
      prepTime: Number(formData.prepTime),
      cookTime: Number(formData.cookTime),
      difficulty: formData.difficulty,
      calories: 550,
      likes: 120,
      dislikes: 0,
      cookedCount: 45,
      image: formData.image,
      chef: {
        name: formData.chefName,
        handle: `@${formData.chefName.replace(/\s+/g, '').toLowerCase()}`,
        title: "Chef Partner",
        slogan: "Chef Partner Creator 🇰🇪",
        avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
        bio: "Official Chef Partner on ChefPick Kenya."
      },
      videoLink: formData.videoLink,
      videoPlatform: formData.videoPlatform,
      ingredients: ingredients.length > 0 ? ingredients : [{ name: "Kenyan Market Spices & Ingredients", amount: 1, unit: "pack" }],
      instructions: instructions.length > 0 ? instructions : [{ step: 1, title: "Prepare & Cook", detail: "Follow the chef video guide link for step by step prep.", timerSeconds: 300 }],
      nutrition: { protein: 34, carbs: 45, fat: 22, fiber: 4 },
      chefTip: "Watch the video guide link above for expert chef techniques!"
    };

    onAddRecipe(newRecipe);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
                <span>Chef Partner Recipe Submission Portal</span>
              </h3>
              <p className="text-xs text-amber-400 font-semibold">
                Submit your recipe & video guide to publish live on ChefPick Kenya 🇰🇪
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-extrabold text-white">Recipe Successfully Published! 🎉</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your recipe <strong className="text-amber-400">"{formData.title}"</strong> has been added to ChefPick Kenya!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20"
            >
              Done & View Recipe List
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Dish Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swahili Coconut Prawn Curry"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Chef / Creator Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dennis Ombachi / Chef Ali"
                  value={formData.chefName}
                  onChange={e => setFormData({ ...formData, chefName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Direct Video URL (YouTube / TikTok / Instagram) *</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or TikTok link"
                  value={formData.videoLink}
                  onChange={e => setFormData({ ...formData, videoLink: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-2.5 py-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
                >
                  <option value="Swahili">Swahili</option>
                  <option value="Gourmet">Gourmet</option>
                  <option value="Fast & Easy">Fast & Easy</option>
                  <option value="High Protein">High Protein</option>
                  <option value="Comfort Food">Comfort Food</option>
                  <option value="Mama Mboga Specials">Mama Mboga Specials</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Prep Time (mins)</label>
                <input
                  type="number"
                  value={formData.prepTime}
                  onChange={e => setFormData({ ...formData, prepTime: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Cook Time (mins)</label>
                <input
                  type="number"
                  value={formData.cookTime}
                  onChange={e => setFormData({ ...formData, cookTime: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Ingredients List (One per line)</label>
              <textarea
                rows={3}
                placeholder="500g Fresh Prawns\n1 cup Heavy Coconut Milk\n2 tbsp Ginger & Garlic Paste"
                value={formData.ingredientsStr}
                onChange={e => setFormData({ ...formData, ingredientsStr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Step-by-Step Instructions (One per line)</label>
              <textarea
                rows={3}
                placeholder="Sear prawns in oil for 2 mins\nSauté onions and garlic ginger paste\nSimmer in heavy coconut milk for 5 mins"
                value={formData.instructionsStr}
                onChange={e => setFormData({ ...formData, instructionsStr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20"
              >
                Publish Recipe to Platform 🚀
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

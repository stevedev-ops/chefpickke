import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Zap, WifiOff, Calendar, Sparkles, Check } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Auto open modal on visit if not recently dismissed
      const dismissedTime = localStorage.getItem('chefpick_pwa_dismissed_time');
      const now = Date.now();

      // Show popup if never dismissed or dismissed more than 24 hours ago
      if (!dismissedTime || (now - Number(dismissedTime) > 86400000)) {
        setTimeout(() => {
          setShowModal(true);
        }, 1200); // Smooth 1.2s delay after page loads
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Fallback check for mobile browsers that don't emit beforeinstallprompt immediately
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const dismissedTime = localStorage.getItem('chefpick_pwa_dismissed_time');
    const now = Date.now();

    if (!isStandalone && (!dismissedTime || (now - Number(dismissedTime) > 86400000))) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1800);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      }
      setDeferredPrompt(null);
      setShowModal(false);
    } else if (isIOS) {
      alert("To Install on iPhone/iPad:\n\n1. Tap the Share button 📤 in Safari\n2. Scroll down and tap 'Add to Home Screen' ➕");
      setShowModal(false);
    } else {
      alert("To Install on Android/Desktop:\n\n1. Tap your browser menu (3 dots ⋮)\n2. Select 'Install App' or 'Add to Home Screen' 📲");
      setShowModal(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('chefpick_pwa_dismissed_time', Date.now().toString());
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* App Icon Glow */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-amber-500 rounded-3xl blur-xl opacity-40 animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 border border-amber-400/40">
            🍲
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-2xl font-heading font-black text-white tracking-tight">
            Install ChefPick<span className="text-amber-500">KE</span> App
          </h3>
          <p className="text-xs text-slate-300 max-w-xs mx-auto">
            Get 1-tap home screen access & use all 86+ Kenyan recipes <strong>100% offline</strong>!
          </p>
        </div>

        {/* Feature Perks */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left space-y-2.5 text-xs">
          <div className="flex items-center gap-2.5 text-slate-200">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <WifiOff className="w-3.5 h-3.5" />
            </div>
            <span>Works <strong>100% Offline</strong> (Zero Data Bundle needed)</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-200">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span><strong>1-Click Meal Decider Spinner 🎲</strong> for daily meals</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-200">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span><strong>Monday–Sunday Meal Planner</strong> + Market Grocery List</span>
          </div>
        </div>

        {/* Install Action Button */}
        <div className="space-y-3 pt-1">
          <button
            onClick={handleInstallClick}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition transform active:scale-98"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Install App on Phone / PC 📲</span>
          </button>

          <button
            onClick={handleDismiss}
            className="text-xs text-slate-400 hover:text-slate-200 font-semibold transition"
          >
            Continue in Web Browser
          </button>
        </div>

      </div>
    </div>
  );
}

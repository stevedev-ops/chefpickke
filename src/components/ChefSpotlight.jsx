import React from 'react';
import { ExternalLink, Video } from 'lucide-react';

export default function ChefSpotlight() {
  const chefs = [
    {
      name: "Dennis Ombachi",
      handle: "@dennisombachi",
      title: "The Roaming Chef",
      slogan: "DONE! 💥",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBq-D5dGDsPYJFYx1B3QjYNV1qvsv6mUCeGMcYbYLeHw&s=10",
      bio: "Former Kenyan rugby international turned world-famous chef known for incredible sizzles, crispy wings, and garlic butter steaks.",
      link: "https://www.tiktok.com/@dennisombachi",
      platform: "TikTok & YouTube Shorts"
    },
    {
      name: "Chef Ali Mandhry",
      handle: "@chefalimandhry",
      title: "Kenya's Culinary Ambassador",
      slogan: "Lamu Coastal Magic 🌊",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIYKnJSWqGiJAEqm1fYl0R8GNgbnu_xTV3tAXdkVCPzTOeiDiPbn3FCP0W&s=10",
      bio: "Celebrity Swahili chef showcasing authentic island biryani, tamarind glazes, and coconut fish dishes.",
      link: "https://www.youtube.com/@ChefAliMandhry",
      platform: "YouTube Channel"
    },
    {
      name: "Kaluhi Adagala",
      handle: "@kaluhiskitchen",
      title: "Kaluhi's Kitchen",
      slogan: "Kenyan Comfort Cooking 🥑",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_pO-419bSG7pD0bxaizUMvFIPdLsBGodZiHbC6ckkoQ&s=10",
      bio: "Pioneer Kenyan food blogger crafting modern twists on staple home stews and coconut Kamande.",
      link: "https://www.kaluhiskitchen.com",
      platform: "Food Blog & Videos"
    },
    {
      name: "Chef Raphael",
      handle: "@chefraphael",
      title: "Chef Raphael's Kitchen",
      slogan: "Cooking Made Easy 🍲",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRedJImmImdIKoWWysg_GoV8AwvkDeXaNVuIZGjoWOw9g&s=10",
      bio: "Culinary instructor dedicated to helping home cooks master local beef karanga, matoke, and kachumbari.",
      link: "https://www.facebook.com/chefraphael",
      platform: "Facebook & YouTube"
    }
  ];

  return (
    <section className="my-16 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
            Top East African Creators
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
            Featured Chef Video Sources
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {chefs.map((chef, idx) => (
          <div key={idx} className="glass-panel border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-amber-500/40 transition">
            <div className="flex items-center gap-3">
              <img
                src={chef.avatar}
                alt={chef.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md"
              />
              <div>
                <h4 className="text-base font-extrabold text-white">{chef.name}</h4>
                <p className="text-xs text-amber-400 font-semibold">{chef.slogan}</p>
                <p className="text-[11px] text-slate-400">{chef.handle}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
              {chef.bio}
            </p>

            <a
              href={chef.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 hover:border-amber-500 hover:text-amber-400 transition"
            >
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400" />
                <span>{chef.platform}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

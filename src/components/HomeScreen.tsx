import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bell,
  Clock,
  Flame,
  Heart,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Utensils,
  X,
} from 'lucide-react';
import { MEALS } from '../data/mockData';
import { CartItem, MealCategory, MealItem, StudentProfile } from '../types';

interface HomeScreenProps {
  profile: StudentProfile;
  favorites: string[];
  cart: CartItem[];
  onSelectMeal: (meal: MealItem) => void;
  onQuickAddToCart: (meal: MealItem) => void;
  onToggleFavorite: (mealId: string) => void;
  onOpenCartCheckout: () => void;
}

const CATEGORIES: MealCategory[] = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  favorites,
  cart,
  onSelectMeal,
  onQuickAddToCart,
  onToggleFavorite,
  onOpenCartCheckout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [onlyHalal, setOnlyHalal] = useState(false);
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [under150, setUnder150] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const filteredMeals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MEALS.filter((meal) => {
      if (!q && selectedCategory !== 'All' && meal.category !== selectedCategory) {
        return false;
      }
      if (q) {
        const matchText = `${meal.name} ${meal.shortName} ${meal.description} ${meal.ingredients} ${meal.category}`.toLowerCase();
        if (!matchText.includes(q)) return false;
      }
      if (onlyHalal && !meal.isHalal) return false;
      if (onlyVeg && !meal.dietaryTags.includes('Vegetarian')) return false;
      if (under150 && meal.priceKgs > 150) return false;
      return true;
    });
  }, [searchQuery, selectedCategory, onlyHalal, onlyVeg, under150]);

  const cartTotalKgs = useMemo(
    () => cart.reduce((sum, item) => sum + item.lineTotalKgs, 0),
    [cart]
  );
  const cartTotalQty = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const featuredMeals = filteredMeals.filter((m) => m.featuredCard);
  const compactMeals = filteredMeals.filter((m) => !m.featuredCard);

  return (
    <div className="px-4 pt-3.5 pb-28 space-y-4">
      {/* Greeting Row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-extrabold tracking-tight text-[#16142A] leading-tight">
            Good morning, {profile.firstName}! ☀️
          </h2>
          <p className="text-[12.5px] font-medium text-[#6C6A82] mt-0.5">
            {profile.universityShort} • Cafeteria {profile.dormShort}
          </p>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Notifications"
            className="w-10 h-10 rounded-full bg-white border border-[#ECEAF6] shadow-2xs flex items-center justify-center text-[#16142A] hover:bg-[#F3F1FC] transition relative"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="w-2 h-2 rounded-full bg-[#F55A31] absolute top-2.5 right-2.5 ring-2 ring-white" />
          </button>

          {showNotifications ? (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#ECEAF6] shadow-xl p-3.5 z-40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-bold text-[#16142A]">
                  Cafeteria Alerts
                </span>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-[#6C6A82] hover:text-[#16142A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-[11.5px]">
                <div className="p-2.5 rounded-xl bg-[#F4F2FC]">
                  <p className="font-bold text-[#16142A]">Hot Beshbarmak Batch Ready</p>
                  <p className="text-[#6C6A82] mt-0.5">
                    Window #2, {profile.dormShort} • Only 14 portions remaining for 13:00 rush.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#E6F7EF]">
                  <p className="font-bold text-[#138A53]">Free Tea Welcome Bonus</p>
                  <p className="text-[#115E3B] mt-0.5">
                    Active on your next lunch pre-order today.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Cafeteria Availability Banner */}
      <div className="bg-[#ECE8FD] rounded-2xl px-3.5 py-3 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#3F32E5] text-white flex items-center justify-center shrink-0">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[12.5px] font-bold text-[#251E7A] truncate">
              Cafeteria open until 20:00
            </p>
            <p className="text-[11px] font-medium text-[#5A539B] truncate">
              Hot lunch ready in 10–15 mins
            </p>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-white text-[#16142A] text-[10.5px] font-bold flex items-center gap-1.5 shrink-0 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse-soft" />
          <span>Kitchen Live</span>
        </div>
      </div>

      {/* Search + Filter Row */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-[#8E8BA6] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meals or ingredients (e.g. Beshbarmak)"
              className="w-full bg-white border border-[#EAE7F6] focus:border-[#3F32E5] rounded-2xl pl-10 pr-8 py-3 text-[12.5px] font-medium text-[#16142A] placeholder:text-[#9693AC] outline-none shadow-2xs transition"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8BA6] hover:text-[#16142A]"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            aria-label="Filter meals"
            className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 transition shadow-2xs ${
              showFilters || onlyHalal || onlyVeg || under150
                ? 'bg-[#3F32E5] border-[#3F32E5] text-white'
                : 'bg-white border-[#EAE7F6] text-[#16142A]'
            }`}
          >
            <SlidersHorizontal className="w-4.5 h-4.5" />
          </button>
        </div>

        {showFilters ? (
          <div className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-2xl border border-[#ECEAF6]">
            <button
              type="button"
              onClick={() => setOnlyHalal((v) => !v)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition ${
                onlyHalal
                  ? 'bg-[#138A53] text-white'
                  : 'bg-[#F3F1FC] text-[#4A4863]'
              }`}
            >
              ✓ Halal Certified
            </button>
            <button
              type="button"
              onClick={() => setOnlyVeg((v) => !v)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition ${
                onlyVeg
                  ? 'bg-[#138A53] text-white'
                  : 'bg-[#F3F1FC] text-[#4A4863]'
              }`}
            >
              🌿 Vegetarian
            </button>
            <button
              type="button"
              onClick={() => setUnder150((v) => !v)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition ${
                under150
                  ? 'bg-[#3F32E5] text-white'
                  : 'bg-[#F3F1FC] text-[#4A4863]'
              }`}
            >
              ≤ 150 KGS
            </button>
          </div>
        ) : null}

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-bold flex items-center gap-1.5 transition ${
                  active
                    ? 'bg-[#3F32E5] text-white shadow-[0_4px_12px_rgba(63,50,229,0.28)]'
                    : 'bg-white border border-[#EAE7F6] text-[#4A4863] hover:border-[#C5BDF5]'
                }`}
              >
                <span>{cat}</span>
                {active && cat === 'Lunch' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F55A31]" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular with Students Card (hidden during specific search to focus results) */}
      {!searchQuery ? (
        <section>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[16px] font-extrabold text-[#16142A]">
                Popular with Students
              </h3>
              <Flame className="w-4 h-4 text-[#F55A31]" />
            </div>
            <span className="text-[11.5px] font-bold text-[#3F32E5]">
              Live Stats
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#ECEAF6] shadow-[0_4px_18px_rgba(34,28,70,0.04)] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex -space-x-2 shrink-0">
                  <span className="w-6 h-6 rounded-full bg-[#3F32E5] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    EI
                  </span>
                  <span className="w-6 h-6 rounded-full bg-[#F55A31] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    AT
                  </span>
                  <span className="w-6 h-6 rounded-full bg-[#138A53] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    NB
                  </span>
                </div>
                <p className="text-[11.5px] font-bold text-[#16142A] truncate">
                  <span className="text-[#F55A31]">84 orders</span> in {profile.dormShort} this noon!
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#FFEFE9] text-[#F55A31] text-[10px] font-bold shrink-0">
                Rushing Fast
              </span>
            </div>

            <div className="bg-[#F7F6FC] rounded-xl p-2.5">
              <p className="text-[11.5px] italic text-[#4A4863] leading-relaxed">
                <span className="text-[#F55A31] font-extrabold not-italic mr-1">❝</span>
                &ldquo;The Beshbarmak today is hot and tender! Grab it before 13:30 break ends.&rdquo;
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10.5px] font-semibold text-[#6C6A82]">
                  — Aibek, CS Year 3
                </span>
                <div className="flex items-center gap-0.5 text-[#F59E0B]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#F59E0B]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Today's Menu Section */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-[17px] font-extrabold text-[#16142A]">
              Today&apos;s Menu
            </h3>
            <p className="text-[11.5px] text-[#6C6A82]">
              Freshly cooked today at {profile.dormShort} kitchen
            </p>
          </div>
          <span className="text-[11px] font-bold text-[#F55A31]">
            Updated 11:30 AM
          </span>
        </div>

        {filteredMeals.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#ECEAF6] p-8 text-center">
            <Utensils className="w-8 h-8 text-[#9B97B8] mx-auto mb-2" />
            <p className="text-[14px] font-bold text-[#16142A]">No matching meals found</p>
            <p className="text-[12px] text-[#6C6A82] mt-1 mb-3">
              Try searching &ldquo;Beshbarmak&rdquo;, &ldquo;Manty&rdquo;, or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setOnlyHalal(false);
                setOnlyVeg(false);
                setUnder150(false);
              }}
              className="px-4 py-2 rounded-full bg-[#3F32E5] text-white text-[12px] font-bold"
            >
              Reset Menu Filters
            </button>
          </div>
        ) : null}

        {/* Featured Large Cards */}
        {featuredMeals.map((meal) => {
          const isFav = favorites.includes(meal.id);
          return (
            <article
              key={meal.id}
              onClick={() => onSelectMeal(meal)}
              className="bg-white rounded-3xl border border-[#ECEAF6] shadow-[0_4px_20px_rgba(34,28,70,0.05)] overflow-hidden cursor-pointer active:scale-[0.995] transition"
            >
              <div className="p-3 pb-0">
                <div className="relative rounded-2xl overflow-hidden h-[176px] bg-[#EFEBFB]">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {meal.topBadge ? (
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold text-white shadow-sm flex items-center gap-1 ${
                          meal.topBadge.variant === 'coral'
                            ? 'bg-[#D94322]'
                            : 'bg-[#3F32E5]'
                        }`}
                      >
                        {meal.topBadge.text}
                      </span>
                    ) : null}
                    {meal.secondaryBadge ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#138A53] text-white text-[10.5px] font-bold shadow-sm">
                        {meal.secondaryBadge.text}
                      </span>
                    ) : null}
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(meal.id);
                    }}
                    aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-sm active:scale-90 transition"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'fill-[#F55A31] text-[#F55A31]' : 'text-[#4A4863]'
                      }`}
                    />
                  </button>

                  {/* Bottom Rating Pill */}
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-bold text-[#16142A] flex items-center gap-1 shadow-sm tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    <span>{meal.rating.toFixed(1)}</span>
                    <span className="text-[#6C6A82] font-medium">({meal.reviewCount})</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 pt-3">
                <h4 className="text-[16px] font-extrabold text-[#16142A] leading-snug">
                  {meal.name}
                </h4>
                <p className="text-[12px] text-[#6C6A82] leading-relaxed mt-1">
                  {meal.description}
                </p>

                <div className="flex items-center gap-2 mt-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F3F1FC] text-[#4A4863] text-[10.5px] font-bold tabular-nums">
                    {meal.calories} kcal
                  </span>
                  {meal.availabilityType === 'warning' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFEFE9] text-[#D94322] text-[10.5px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F55A31]" />
                      {meal.availabilityLabel}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E6F7EF] text-[#138A53] text-[10.5px] font-bold">
                      {meal.availabilityLabel}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-1">
                  <div className="flex items-baseline gap-1 tabular-nums">
                    <span className="text-[20px] font-extrabold text-[#16142A]">
                      {meal.priceKgs}
                    </span>
                    <span className="text-[11px] font-extrabold text-[#16142A]">COM</span>
                    <span className="text-[11px] text-[#6C6A82] font-medium ml-1">
                      / {meal.priceKgs} KGS
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAddToCart(meal);
                    }}
                    className={`px-4 py-2 rounded-full text-white text-[12.5px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition ${
                      meal.ctaAccent === 'coral'
                        ? 'bg-[#F55A31] hover:bg-[#E14A23]'
                        : 'bg-[#3F32E5] hover:bg-[#3226C9]'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {/* Compact Horizontal Cards */}
        {compactMeals.map((meal) => {
          const isFav = favorites.includes(meal.id);
          return (
            <article
              key={meal.id}
              onClick={() => onSelectMeal(meal)}
              className="bg-white rounded-2xl border border-[#ECEAF6] shadow-[0_4px_16px_rgba(34,28,70,0.04)] p-3 flex items-center gap-3 cursor-pointer active:scale-[0.995] transition"
            >
              <div className="relative w-[90px] h-[90px] rounded-2xl overflow-hidden bg-[#EFEBFB] shrink-0">
                <img
                  src={meal.thumbImage}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-[#16142A] flex items-center gap-0.5 shadow-2xs tabular-nums">
                  <Star className="w-2.5 h-2.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <span>{meal.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-[14px] font-extrabold text-[#16142A] truncate">
                    {meal.name}
                  </h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {meal.secondaryBadge && meal.secondaryBadge.text !== 'Halal' ? (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold ${
                          meal.secondaryBadge.variant === 'green'
                            ? 'bg-[#E6F7EF] text-[#138A53]'
                            : 'bg-[#FFEFE9] text-[#D94322]'
                        }`}
                      >
                        {meal.secondaryBadge.text}
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(meal.id);
                      }}
                      aria-label="Toggle favorite"
                      className="p-0.5 text-[#8E8BA6] hover:text-[#F55A31]"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFav ? 'fill-[#F55A31] text-[#F55A31]' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <p className="text-[11.5px] text-[#6C6A82] truncate mt-0.5">
                  {meal.description}
                </p>

                <div className="flex items-center gap-2 mt-1.5 text-[10.5px]">
                  <span className="px-2 py-0.5 rounded-full bg-[#F3F1FC] text-[#4A4863] font-bold tabular-nums">
                    {meal.calories} kcal
                  </span>
                  <span className="text-[#6C6A82]">({meal.reviewCount} reviews)</span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-baseline gap-1 tabular-nums">
                    <span className="text-[16px] font-extrabold text-[#16142A]">
                      {meal.priceKgs}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#16142A]">COM</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAddToCart(meal);
                    }}
                    aria-label={`Add ${meal.name} to tray`}
                    className="w-8 h-8 rounded-full bg-[#3F32E5] hover:bg-[#3226C9] text-white flex items-center justify-center shadow-xs active:scale-90 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Floating Your Tray Bar */}
      {cart.length > 0 ? (
        <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[402px] z-20">
          <div className="bg-[#18162B] text-white rounded-2xl px-3.5 py-2.5 shadow-[0_12px_30px_rgba(22,20,42,0.32)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-10 h-10 rounded-xl bg-[#3F32E5] flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4.5 h-4.5 text-white" />
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F55A31] text-white text-[10px] font-extrabold flex items-center justify-center tabular-nums">
                  {cartTotalQty}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold leading-tight">Your Tray</p>
                <p className="text-[11px] text-[#B8B5D1] truncate tabular-nums">
                  {cartTotalKgs} сом • {profile.dormShort} Pickup
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenCartCheckout}
              className="px-3.5 py-2 rounded-xl bg-[#F55A31] hover:bg-[#E14A23] text-white text-[12px] font-bold flex items-center gap-1 shrink-0 active:scale-95 transition"
            >
              <span>View Tray</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

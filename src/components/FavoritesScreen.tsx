import React from 'react';
import { Heart, Plus, Sparkles, Star, Utensils } from 'lucide-react';
import { MEALS } from '../data/mockData';
import { MealItem, StudentProfile } from '../types';

interface FavoritesScreenProps {
  profile: StudentProfile;
  favorites: string[];
  onToggleFavorite: (mealId: string) => void;
  onSelectMeal: (meal: MealItem) => void;
  onQuickAddToCart: (meal: MealItem) => void;
  onBrowseMenu: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  profile,
  favorites,
  onToggleFavorite,
  onSelectMeal,
  onQuickAddToCart,
  onBrowseMenu,
}) => {
  const favoriteMeals = MEALS.filter((m) => favorites.includes(m.id));

  return (
    <div className="px-4 pt-3.5 pb-10 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-[22px] font-extrabold tracking-tight text-[#16142A]">
            Saved Favorites
          </h2>
          <p className="text-[12.5px] text-[#6C6A82]">
            Quick-order your go-to {profile.dormShort} cafeteria dishes
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#FFEFE9] text-[#F55A31] text-[11px] font-bold tabular-nums">
          {favoriteMeals.length} {favoriteMeals.length === 1 ? 'Dish' : 'Dishes'}
        </span>
      </div>

      {favoriteMeals.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#ECEAF6] p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0EC] text-[#F55A31] flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-[#16142A]">
              No favorite meals saved yet
            </p>
            <p className="text-[12px] text-[#6C6A82] mt-1">
              Tap the heart icon on any dish in Today&apos;s Menu or Weekly Plan to keep it here for 1-tap ordering.
            </p>
          </div>
          <button
            type="button"
            onClick={onBrowseMenu}
            className="px-5 py-2.5 rounded-full bg-[#3F32E5] text-white text-[12.5px] font-bold inline-flex items-center gap-1.5"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Browse Daily Menu</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {favoriteMeals.map((meal) => (
            <article
              key={meal.id}
              onClick={() => onSelectMeal(meal)}
              className="bg-white rounded-3xl border border-[#ECEAF6] shadow-[0_4px_18px_rgba(34,28,70,0.04)] p-3 flex items-center gap-3.5 cursor-pointer active:scale-[0.995] transition"
            >
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#EFEBFB] shrink-0">
                <img
                  src={meal.thumbImage}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-[#16142A] flex items-center gap-0.5 tabular-nums">
                  <Star className="w-2.5 h-2.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <span>{meal.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[14.5px] font-extrabold text-[#16142A] truncate">
                    {meal.shortName}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(meal.id);
                    }}
                    aria-label="Remove from favorites"
                    className="p-1 text-[#F55A31] shrink-0 active:scale-90 transition"
                  >
                    <Heart className="w-4.5 h-4.5 fill-[#F55A31]" />
                  </button>
                </div>

                <p className="text-[11.5px] text-[#6C6A82] line-clamp-2 mt-0.5">
                  {meal.description}
                </p>

                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-baseline gap-1 tabular-nums">
                    <span className="text-[16px] font-extrabold text-[#16142A]">
                      {meal.priceKgs}
                    </span>
                    <span className="text-[10px] font-bold text-[#6C6A82]">COM</span>
                    <span className="text-[10.5px] text-[#6C6A82] ml-1">
                      • {meal.calories} kcal
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAddToCart(meal);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#F55A31] hover:bg-[#E14A23] text-white text-[11.5px] font-bold flex items-center gap-1 active:scale-95 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="bg-[#ECE8FD] rounded-2xl p-3.5 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-[#3F32E5] shrink-0" />
        <p className="text-[11.5px] text-[#2B246D] leading-snug">
          <strong className="font-bold">Tip:</strong> Your saved favorites automatically sync with your Weekly Meal Plan and Dietary Safeguards.
        </p>
      </div>
    </div>
  );
};

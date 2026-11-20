import React, { useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  Flame,
  Info,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Store,
  UtensilsCrossed,
  Zap,
} from 'lucide-react';
import { AddonOption, CartItem, MealItem, StudentProfile } from '../types';
import { TopBar } from './TopBar';

interface FoodDetailsScreenProps {
  meal: MealItem;
  profile: StudentProfile;
  isFavorite: boolean;
  onBack: () => void;
  onAvatarClick: () => void;
  onToggleFavorite: () => void;
  onAddToTray: (item: CartItem) => void;
  onOrderNow: (item: CartItem) => void;
}

export const FoodDetailsScreen: React.FC<FoodDetailsScreenProps> = ({
  meal,
  profile,
  isFavorite,
  onBack,
  onAvatarClick,
  onToggleFavorite,
  onAddToTray,
  onOrderNow,
}) => {
  const [selectedPortionId, setSelectedPortionId] = useState(
    meal.portionSizes[0]?.id || 'standard'
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const selectedPortion = useMemo(
    () =>
      meal.portionSizes.find((p) => p.id === selectedPortionId) ||
      meal.portionSizes[0],
    [meal.portionSizes, selectedPortionId]
  );

  const selectedAddons: AddonOption[] = useMemo(
    () => meal.addons.filter((a) => selectedAddonIds.includes(a.id)),
    [meal.addons, selectedAddonIds]
  );

  const addonsTotal = useMemo(
    () => selectedAddons.reduce((sum, a) => sum + a.priceKgs, 0),
    [selectedAddons]
  );

  const unitTotalKgs = selectedPortion.priceKgs + addonsTotal;
  const subtotalKgs = unitTotalKgs * quantity;

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const buildCartItem = (): CartItem => ({
    id: `${meal.id}-${selectedPortion.id}-${selectedAddonIds.sort().join('_') || 'none'}`,
    mealId: meal.id,
    mealName: meal.shortName || meal.name,
    image: meal.thumbImage,
    portionId: selectedPortion.id,
    portionLabel: selectedPortion.label,
    basePriceKgs: selectedPortion.priceKgs,
    addons: selectedAddons,
    quantity,
    unitTotalKgs,
    lineTotalKgs: subtotalKgs,
  });

  const paymentMethodLabel =
    profile.defaultPayment === 'mbank'
      ? 'MBANK / Cash'
      : profile.defaultPayment === 'optima'
      ? 'Optima / Cash'
      : 'Cash at Counter';

  return (
    <div className="min-h-screen bg-[#F5F4FA] flex flex-col">
      <TopBar
        sectionLabel="Dish Details"
        profile={profile}
        onAvatarClick={onAvatarClick}
        showBack
        onBack={onBack}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />

      <div className="flex-1 px-4 pt-3.5 pb-32 space-y-4">
        {/* Hero Dish Photo */}
        <div className="relative rounded-3xl overflow-hidden h-[215px] bg-[#EFEBFB] shadow-sm">
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
            {meal.isHalal ? (
              <span className="px-2.5 py-1 rounded-full bg-white/95 text-[#138A53] text-[10.5px] font-bold flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 fill-[#138A53] text-white" />
                <span>100% Halal Verified</span>
              </span>
            ) : null}
            <span className="px-2.5 py-1 rounded-full bg-white/95 text-[#D94322] text-[10.5px] font-bold flex items-center gap-1 shadow-sm">
              <Flame className="w-3 h-3 fill-[#F55A31] text-[#F55A31]" />
              <span>Campus Favorite</span>
            </span>
          </div>

          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#16142A]/85 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1 tabular-nums">
            <Star className="w-3.5 h-3.5 fill-[#F55A31] text-[#F55A31]" />
            <span>{meal.rating.toFixed(1)}</span>
            <span className="text-white/75 font-medium">({meal.reviewCount})</span>
          </div>
        </div>

        {/* Title & Base Price */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight text-[#16142A] leading-tight">
              {meal.shortName}
            </h2>
            <p className="text-[12.5px] text-[#6C6A82] mt-1">{meal.subtitle}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-baseline justify-end gap-1 tabular-nums">
              <span className="text-[24px] font-extrabold text-[#3F32E5]">
                {selectedPortion.priceKgs}
              </span>
              <span className="text-[11px] font-extrabold text-[#4A4863]">COM</span>
            </div>
            <span className="text-[11px] font-bold text-[#138A53]">
              Student Special
            </span>
          </div>
        </div>

        {/* High Demand Alert */}
        <div className="bg-[#FFF2EE] border border-[#FFE0D6] rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F55A31] text-white flex items-center justify-center shrink-0">
            <Zap className="w-4.5 h-4.5 fill-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[12.5px] font-bold text-[#B93515] flex items-center gap-1.5">
              <span>High Demand Alert</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F55A31]" />
            </p>
            <p className="text-[11.5px] text-[#9A3A22]">
              {meal.portionsLeft
                ? `Only ${meal.portionsLeft} portions left for 13:00 lunch rush!`
                : 'Freshly prepared to order during lunch & dinner hours.'}
            </p>
          </div>
        </div>

        {/* Prep & Pickup Info Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white rounded-2xl border border-[#ECEAF6] p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F1EFFC] text-[#3F32E5] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10.5px] font-medium text-[#6C6A82]">Preparation</p>
              <p className="text-[12.5px] font-bold text-[#16142A] truncate">
                {meal.prepTime}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#ECEAF6] p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E6F7EF] text-[#138A53] flex items-center justify-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10.5px] font-medium text-[#6C6A82]">Pickup Spot</p>
              <p className="text-[12.5px] font-bold text-[#16142A] truncate">
                {meal.pickupSpot}
              </p>
            </div>
          </div>
        </div>

        {/* Kitchen Transparency */}
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-[#3F32E5]" />
            <h3 className="text-[15px] font-extrabold text-[#16142A]">
              Kitchen Transparency
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-[#ECEAF6] p-4 space-y-3.5">
            <div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-[#7A7891] mb-1">
                Authentic Ingredients
              </p>
              <p className="text-[12.5px] text-[#322F4A] leading-relaxed">
                {meal.ingredients}
              </p>
            </div>

            <div className="bg-[#F4F2FC] rounded-2xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11.5px] font-bold text-[#16142A]">
                  Nutritional Profile
                </span>
                <span className="text-[11.5px] font-extrabold text-[#3F32E5] tabular-nums">
                  {meal.calories} kcal
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white rounded-xl py-2 px-2 text-center">
                  <p className="text-[10px] text-[#6C6A82]">Protein</p>
                  <p className="text-[13px] font-extrabold text-[#138A53] tabular-nums">
                    {meal.protein}g
                  </p>
                </div>
                <div className="bg-white rounded-xl py-2 px-2 text-center">
                  <p className="text-[10px] text-[#6C6A82]">Carbs</p>
                  <p className="text-[13px] font-extrabold text-[#3F32E5] tabular-nums">
                    {meal.carbs}g
                  </p>
                </div>
                <div className="bg-white rounded-xl py-2 px-2 text-center">
                  <p className="text-[10px] text-[#6C6A82]">Fats</p>
                  <p className="text-[13px] font-extrabold text-[#D94322] tabular-nums">
                    {meal.fats}g
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11.5px] text-[#6C6A82]">
              <Info className="w-4 h-4 text-[#7A7891] shrink-0 mt-0.5" />
              <p>{meal.allergenNote}</p>
            </div>
          </div>
        </section>

        {/* Select Portion Size */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-extrabold text-[#16142A]">
              Select Portion Size
            </h3>
            <span className="text-[11px] font-bold text-[#3F32E5]">Required</span>
          </div>

          <div className="space-y-2">
            {meal.portionSizes.map((portion) => {
              const active = portion.id === selectedPortion.id;
              return (
                <button
                  key={portion.id}
                  type="button"
                  onClick={() => setSelectedPortionId(portion.id)}
                  className={`w-full text-left bg-white rounded-2xl p-3.5 border-2 flex items-center justify-between gap-3 transition ${
                    active
                      ? 'border-[#3F32E5] shadow-[0_4px_14px_rgba(63,50,229,0.1)]'
                      : 'border-[#ECEAF6] hover:border-[#D5CFF8]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        active
                          ? 'border-[#3F32E5] bg-[#EEECFD]'
                          : 'border-[#D4D1E6] bg-[#F5F4FA]'
                      }`}
                    >
                      {active ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3F32E5]" />
                      ) : null}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13.5px] font-bold text-[#16142A]">
                          {portion.label}
                        </span>
                        {portion.badge ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#FFEFE9] text-[#F55A31] text-[9.5px] font-bold">
                            {portion.badge}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[11.5px] text-[#6C6A82] mt-0.5">
                        {portion.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-[14px] font-extrabold text-[#16142A] shrink-0 tabular-nums">
                    {portion.priceKgs}{' '}
                    <span className="text-[10px] font-bold text-[#6C6A82]">COM</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Delicious Add-ons */}
        {meal.addons.length > 0 ? (
          <section className="space-y-2">
            <h3 className="text-[15px] font-extrabold text-[#16142A]">
              Delicious Add-ons
            </h3>
            <div className="space-y-2">
              {meal.addons.map((addon) => {
                const checked = selectedAddonIds.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`w-full text-left bg-white rounded-2xl p-3.5 border flex items-center justify-between gap-3 transition ${
                      checked
                        ? 'border-[#3F32E5] bg-[#FAF9FF]'
                        : 'border-[#ECEAF6]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                          checked
                            ? 'bg-[#3F32E5] border-[#3F32E5] text-white'
                            : 'bg-white border-[#C8C4DC]'
                        }`}
                      >
                        {checked ? <Check className="w-3.5 h-3.5" /> : null}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-bold text-[#16142A]">
                          {addon.label}
                        </p>
                        <p className="text-[11.5px] text-[#6C6A82] mt-0.5">
                          {addon.description}
                        </p>
                      </div>
                    </div>

                    <span className="text-[13px] font-extrabold text-[#3F32E5] shrink-0 tabular-nums">
                      +{addon.priceKgs}{' '}
                      <span className="text-[10px] font-bold">COM</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Quantity Card */}
        <div className="bg-white rounded-2xl border border-[#ECEAF6] p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[14px] font-bold text-[#16142A]">Quantity</p>
            <p className="text-[11.5px] text-[#6C6A82]">
              Standard cutlery included
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="w-8 h-8 rounded-full bg-[#F4F2FC] text-[#16142A] flex items-center justify-center hover:bg-[#E7E3FA] active:scale-90 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-5 text-center text-[15px] font-extrabold text-[#16142A] tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              aria-label="Increase quantity"
              className="w-8 h-8 rounded-full bg-[#3F32E5] text-white flex items-center justify-center hover:bg-[#3226C9] active:scale-90 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Checkout Bar */}
      <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#ECEAF6] px-4 py-3 shadow-[0_-6px_24px_rgba(22,20,42,0.06)]">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A7891]">
              Subtotal
            </p>
            <p className="text-[22px] font-extrabold text-[#16142A] leading-tight tabular-nums">
              {subtotalKgs}{' '}
              <span className="text-[13px] font-extrabold text-[#16142A]">KGS</span>
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E6F7EF] text-[#138A53] text-[10.5px] font-bold">
              <Zap className="w-3 h-3 fill-[#138A53]" />
              <span>Window Pickup Ready</span>
            </span>
            <p className="text-[10.5px] font-medium text-[#6C6A82] mt-0.5">
              MBANK, Optima or Cash
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onAddToTray(buildCartItem())}
            className="px-3.5 py-3.5 rounded-2xl bg-[#F3F1FC] hover:bg-[#E7E3FA] text-[#3F32E5] font-bold text-[13px] shrink-0 active:scale-95 transition"
          >
            + Tray
          </button>
          <button
            type="button"
            onClick={() => onOrderNow(buildCartItem())}
            className="flex-1 bg-[#F55A31] hover:bg-[#E14A23] active:scale-[0.99] text-white font-bold text-[14px] py-3.5 rounded-2xl shadow-[0_6px_18px_rgba(245,90,49,0.3)] flex items-center justify-center gap-2 transition"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            <span>Order Now • Pay via {paymentMethodLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

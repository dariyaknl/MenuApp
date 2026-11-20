import React, { useMemo, useState } from 'react';
import {
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  DoorClosed,
  Flame,
  GraduationCap,
  Heart,
  Leaf,
  Lock,
  Moon,
  PlusCircle,
  SlidersHorizontal,
  Sun,
  Sunrise,
  ThumbsUp,
  TrendingUp,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { MEALS } from '../data/mockData';
import {
  DayKey,
  MealItem,
  StudentProfile,
  WeeklyDayPlan,
} from '../types';

interface WeeklyMenuScreenProps {
  profile: StudentProfile;
  weeklyPlan: Record<DayKey, WeeklyDayPlan>;
  favorites: string[];
  onToggleFavorite: (mealId: string) => void;
  onUpdateDayPlan: (dayKey: DayKey, updated: WeeklyDayPlan) => void;
  onSaveDayPlan: (dayKey: DayKey) => void;
  onSelectMealDetails: (meal: MealItem) => void;
}

const DAY_KEYS: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PICKUP_STATIONS = [
  'Express Window B',
  'Main Hall Counter 1',
  'Window #2, Block B',
  'Floor 3 Drop',
];

export const WeeklyMenuScreen: React.FC<WeeklyMenuScreenProps> = ({
  profile,
  weeklyPlan,
  favorites,
  onToggleFavorite,
  onUpdateDayPlan,
  onSaveDayPlan,
  onSelectMealDetails,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayKey>('Wed');
  const [swapSlot, setSwapSlot] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('450');

  const dayPlan = weeklyPlan[selectedDay];

  const getMeal = (mealId: string): MealItem =>
    MEALS.find((m) => m.id === mealId) || MEALS[0];

  const breakfastMeal = getMeal(dayPlan.breakfast.mealId);
  const lunchMeal = getMeal(dayPlan.lunch.mealId);
  const dinnerMeal = getMeal(dayPlan.dinner.mealId);

  const { plannedCostKgs, plannedCount, plannedCalories, remainingKgs, percentUsed } =
    useMemo(() => {
      const slots = [
        { slot: dayPlan.breakfast, meal: breakfastMeal },
        { slot: dayPlan.lunch, meal: lunchMeal },
        { slot: dayPlan.dinner, meal: dinnerMeal },
      ];
      const active = slots.filter((s) => s.slot.planned);
      const cost = active.reduce((sum, s) => sum + s.meal.priceKgs, 0);
      const kcal = active.reduce((sum, s) => sum + s.meal.calories, 0);
      const limit = Math.max(100, dayPlan.dailyLimitKgs);
      const rem = limit - cost;
      const pct = Math.min(100, Math.round((cost / limit) * 100));
      return {
        plannedCostKgs: cost,
        plannedCount: active.length,
        plannedCalories: kcal,
        remainingKgs: rem,
        percentUsed: pct,
      };
    }, [dayPlan, breakfastMeal, lunchMeal, dinnerMeal]);

  const toggleSlotPlanned = (slotName: 'breakfast' | 'lunch' | 'dinner') => {
    const current = dayPlan[slotName];
    onUpdateDayPlan(selectedDay, {
      ...dayPlan,
      [slotName]: {
        ...current,
        planned: !current.planned,
      },
    });
  };

  const cycleStation = (slotName: 'breakfast' | 'lunch' | 'dinner') => {
    const current = dayPlan[slotName];
    const idx = PICKUP_STATIONS.indexOf(current.pickupStation);
    const nextStation = PICKUP_STATIONS[(idx + 1) % PICKUP_STATIONS.length];
    onUpdateDayPlan(selectedDay, {
      ...dayPlan,
      [slotName]: {
        ...current,
        pickupStation: nextStation,
      },
    });
  };

  const toggleDormDrop = () => {
    onUpdateDayPlan(selectedDay, {
      ...dayPlan,
      dinner: {
        ...dayPlan.dinner,
        dormDrop: !dayPlan.dinner.dormDrop,
        pickupStation: !dayPlan.dinner.dormDrop ? 'Floor 3 Drop' : 'Main Hall Counter 1',
      },
    });
  };

  const handleSwapMeal = (mealId: string) => {
    if (!swapSlot) return;
    onUpdateDayPlan(selectedDay, {
      ...dayPlan,
      [swapSlot]: {
        ...dayPlan[swapSlot],
        mealId,
        planned: true,
      },
    });
    setSwapSlot(null);
  };

  const handleSaveBudget = () => {
    const parsed = parseInt(budgetInput, 10);
    if (!Number.isNaN(parsed) && parsed >= 100 && parsed <= 2000) {
      onUpdateDayPlan(selectedDay, {
        ...dayPlan,
        dailyLimitKgs: parsed,
      });
    }
    setEditingBudget(false);
  };

  return (
    <div className="px-4 pt-3.5 pb-10 space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[22px] font-extrabold tracking-tight text-[#16142A]">
            Weekly Meal Plan
          </h2>
          <span className="px-2.5 py-1 rounded-full bg-[#ECE8FD] text-[#3F32E5] text-[10.5px] font-bold flex items-center gap-1 shrink-0">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>
              {profile.universityId.toUpperCase()} {profile.dormShort}
            </span>
          </span>
        </div>
        <p className="text-[12.5px] text-[#6C6A82] mt-0.5">
          Pre-order early to beat rush hours between lectures.
        </p>
      </div>

      {/* Social Proof Banner */}
      <div className="bg-gradient-to-r from-[#ECE8FD] via-[#F3EFFC] to-[#FDEEE8] rounded-2xl p-3.5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#3F32E5] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Users className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-extrabold text-[#3F32E5]">
            68% of Dorm {profile.dormShort}{' '}
            <span className="text-[#4A4863] font-semibold">• 142 students active</span>
          </p>
          <p className="text-[11px] text-[#4A4863] leading-snug mt-0.5">
            Pre-plan their meals ahead to skip the 15-minute lunchtime rush. Everyone grabs and goes!
          </p>
        </div>
      </div>

      {/* Month & Horizontal Day Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-extrabold text-[#16142A]">October 2024</h3>
          <span className="text-[11.5px] font-bold text-[#3F32E5] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Week 8</span>
          </span>
        </div>

        <div className="grid grid-cols-6 gap-1.5">
          {DAY_KEYS.map((key) => {
            const d = weeklyPlan[key];
            const active = selectedDay === key;
            const hasSavedMeals =
              d.reminderSet || d.breakfast.planned || d.lunch.planned || d.dinner.planned;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDay(key)}
                className={`rounded-2xl py-2.5 px-1 flex flex-col items-center justify-center transition border ${
                  active
                    ? 'bg-[#3F32E5] border-[#3F32E5] text-white shadow-[0_6px_16px_rgba(63,50,229,0.28)]'
                    : 'bg-white border-[#ECEAF6] text-[#16142A] hover:border-[#C5BDF5]'
                }`}
              >
                <span
                  className={`text-[10px] font-semibold ${
                    active ? 'text-white/80' : 'text-[#6C6A82]'
                  }`}
                >
                  {d.dayKey}
                </span>
                <span className="text-[15px] font-extrabold mt-0.5 tabular-nums">
                  {d.dateNum}
                </span>
                {d.isToday ? (
                  <span className="mt-1 px-1.5 py-0.5 rounded-full bg-[#F55A31] text-white text-[8.5px] font-bold leading-none">
                    Today
                  </span>
                ) : (
                  <span
                    className={`mt-1.5 w-1.5 h-1.5 rounded-full ${
                      hasSavedMeals
                        ? active
                          ? 'bg-white'
                          : 'bg-[#138A53]'
                        : 'bg-[#D5D2E4]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Budget Card */}
      <div className="bg-white rounded-3xl border border-[#ECEAF6] shadow-[0_4px_18px_rgba(34,28,70,0.04)] p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEECFD] text-[#3F32E5] flex items-center justify-center shrink-0">
              <Wallet className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[13.5px] font-extrabold text-[#16142A]">
                {dayPlan.dayName} Budget
              </p>
              {editingBudget ? (
                <div className="flex items-center gap-1 mt-0.5">
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="w-16 px-1.5 py-0.5 text-[11px] font-bold border border-[#3F32E5] rounded-md outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSaveBudget}
                    className="text-[10.5px] font-bold text-[#3F32E5]"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setBudgetInput(String(dayPlan.dailyLimitKgs));
                    setEditingBudget(true);
                  }}
                  className="text-[11px] text-[#6C6A82] hover:text-[#3F32E5] transition text-left"
                >
                  Daily limit: {dayPlan.dailyLimitKgs} сом (tap to edit)
                </button>
              )}
            </div>
          </div>

          <div className="text-right tabular-nums">
            <p className="text-[18px] font-extrabold text-[#3F32E5] leading-tight">
              {plannedCostKgs} <span className="text-[10px]">COM</span>
            </p>
            <p className="text-[10.5px] text-[#6C6A82]">
              {plannedCount} planned / {plannedCalories} kcal
            </p>
          </div>
        </div>

        <div className="h-2 w-full rounded-full bg-[#EFEBFB] overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              remainingKgs < 0 ? 'bg-[#F55A31]' : 'bg-[#3F32E5]'
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold tabular-nums">
          <span
            className={`flex items-center gap-1 ${
              remainingKgs >= 0 ? 'text-[#138A53]' : 'text-[#F55A31]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {remainingKgs >= 0
                ? `${remainingKgs} сом remaining`
                : `${Math.abs(remainingKgs)} сом over cap`}
            </span>
          </span>
          <span className="text-[#6C6A82] font-semibold">
            {percentUsed}% of daily cap
          </span>
        </div>
      </div>

      {/* Breakfast Slot */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sunrise className="w-4 h-4 text-[#F55A31]" />
            <h3 className="text-[15px] font-extrabold text-[#16142A]">Breakfast</h3>
            <span className="text-[11.5px] text-[#6C6A82]">(07:30 – 10:00)</span>
          </div>
          {dayPlan.breakfast.planned ? (
            <span className="px-2.5 py-0.5 rounded-full bg-[#E6F7EF] text-[#138A53] text-[10.5px] font-bold">
              ✓ Planned
            </span>
          ) : (
            <button
              type="button"
              onClick={() => toggleSlotPlanned('breakfast')}
              className="text-[11px] font-bold text-[#3F32E5]"
            >
              + Add to plan
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-[#ECEAF6] p-3.5 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={breakfastMeal.thumbImage}
              alt={breakfastMeal.shortName}
              onClick={() => onSelectMealDetails(breakfastMeal)}
              className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-[#EFEBFB] cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4
                  onClick={() => onSelectMealDetails(breakfastMeal)}
                  className="text-[14.5px] font-extrabold text-[#16142A] leading-snug cursor-pointer"
                >
                  {breakfastMeal.shortName}
                </h4>
                <button
                  type="button"
                  onClick={() => onToggleFavorite(breakfastMeal.id)}
                  aria-label="Toggle favorite"
                  className="shrink-0"
                >
                  <Heart
                    className={`w-4.5 h-4.5 ${
                      favorites.includes(breakfastMeal.id)
                        ? 'fill-[#D94322] text-[#D94322]'
                        : 'text-[#8E8BA6]'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11.5px] text-[#6C6A82] mt-0.5">
                with Hot Chai • {breakfastMeal.calories} kcal
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[15px] font-extrabold text-[#16142A] tabular-nums">
                  {breakfastMeal.priceKgs}{' '}
                  <span className="text-[10px] font-bold text-[#6C6A82]">COM</span>
                </span>
                <button
                  type="button"
                  onClick={() => toggleSlotPlanned('breakfast')}
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold flex items-center gap-1 transition ${
                    dayPlan.breakfast.planned
                      ? 'bg-[#EEECFD] text-[#3F32E5]'
                      : 'bg-[#F5F4FA] text-[#6C6A82]'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>{dayPlan.breakfast.pickupTime} Pickup</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#F6F5FA] rounded-xl px-3 py-2 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-[#4A4863] truncate">
              <span className="w-2 h-2 rounded-full bg-[#138A53] shrink-0" />
              <span className="truncate">
                Pickup station:{' '}
                <strong className="text-[#16142A]">
                  {dayPlan.breakfast.pickupStation}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setSwapSlot('breakfast')}
                className="font-bold text-[#6C6A82] hover:text-[#16142A]"
              >
                Swap
              </button>
              <button
                type="button"
                onClick={() => cycleStation('breakfast')}
                className="font-bold text-[#3F32E5]"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lunch Slot */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-[#F55A31]" />
            <h3 className="text-[15px] font-extrabold text-[#16142A]">Lunch</h3>
            <span className="text-[11.5px] text-[#6C6A82]">(12:00 – 15:00)</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#FFEFE9] text-[#D94322] text-[10.5px] font-bold">
            High Demand
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-[#ECEAF6] p-3.5 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={lunchMeal.thumbImage}
              alt={lunchMeal.shortName}
              onClick={() => onSelectMealDetails(lunchMeal)}
              className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-[#EFEBFB] cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4
                  onClick={() => onSelectMealDetails(lunchMeal)}
                  className="text-[14.5px] font-extrabold text-[#16142A] leading-snug cursor-pointer"
                >
                  {lunchMeal.shortName}
                </h4>
                <button
                  type="button"
                  onClick={() => onToggleFavorite(lunchMeal.id)}
                  aria-label="Toggle favorite"
                  className="shrink-0"
                >
                  <Heart
                    className={`w-4.5 h-4.5 ${
                      favorites.includes(lunchMeal.id)
                        ? 'fill-[#D94322] text-[#D94322]'
                        : 'text-[#8E8BA6]'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#6C6A82]">
                <span className="px-1.5 py-0.5 rounded-full bg-[#E6F7EF] text-[#138A53] text-[9.5px] font-bold">
                  Halal
                </span>
                <span>
                  {lunchMeal.calories} kcal • {dayPlan.lunch.pickupStation}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[15px] font-extrabold text-[#16142A] tabular-nums">
                  {lunchMeal.priceKgs}{' '}
                  <span className="text-[10px] font-bold text-[#6C6A82]">COM</span>
                </span>
                <span className="text-[11px] font-bold text-[#D94322] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-[#F55A31] text-[#F55A31]" />
                  <span>88 planned</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#F6F5FA] rounded-xl px-3 py-2 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-[#4A4863]">
              <ThumbsUp className="w-3.5 h-3.5 text-[#3F32E5]" />
              <span>{profile.dormShort} favorite choice today</span>
            </span>
            <span className="font-bold text-[#3F32E5]">
              {dayPlan.lunch.pickupTime} Slot Open
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleSlotPlanned('lunch')}
              className={`flex-1 py-3 rounded-2xl text-[13px] font-bold flex items-center justify-center gap-1.5 transition active:scale-[0.99] ${
                dayPlan.lunch.planned
                  ? 'bg-[#138A53] text-white shadow-sm'
                  : 'bg-[#3F32E5] hover:bg-[#3226C9] text-white shadow-[0_4px_14px_rgba(63,50,229,0.25)]'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>
                {dayPlan.lunch.planned
                  ? `Planned for ${dayPlan.lunch.pickupTime}`
                  : `Plan for ${dayPlan.lunch.pickupTime}`}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSwapSlot('lunch')}
              aria-label="Swap lunch dish"
              className="w-11 h-11 rounded-2xl bg-[#F4F2FC] text-[#16142A] flex items-center justify-center hover:bg-[#E7E3FA] transition"
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Dinner Slot */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Moon className="w-4 h-4 text-[#3F32E5]" />
            <h3 className="text-[15px] font-extrabold text-[#16142A]">Dinner</h3>
            <span className="text-[11.5px] text-[#6C6A82]">(18:00 – 20:30)</span>
          </div>
          <span className="text-[11px] font-medium text-[#6C6A82]">
            Dorm delivery available
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-[#ECEAF6] p-3.5 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={dinnerMeal.thumbImage}
              alt={dinnerMeal.shortName}
              onClick={() => onSelectMealDetails(dinnerMeal)}
              className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-[#EFEBFB] cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4
                  onClick={() => onSelectMealDetails(dinnerMeal)}
                  className="text-[14.5px] font-extrabold text-[#16142A] leading-snug cursor-pointer"
                >
                  {dinnerMeal.shortName}
                </h4>
                <button
                  type="button"
                  onClick={() => onToggleFavorite(dinnerMeal.id)}
                  aria-label="Toggle favorite"
                  className="shrink-0"
                >
                  <Heart
                    className={`w-4.5 h-4.5 ${
                      favorites.includes(dinnerMeal.id)
                        ? 'fill-[#D94322] text-[#D94322]'
                        : 'text-[#8E8BA6]'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11.5px] text-[#6C6A82] mt-0.5 truncate">
                {dinnerMeal.subtitle} • {dinnerMeal.calories} kcal
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[15px] font-extrabold text-[#16142A] tabular-nums">
                  {dinnerMeal.priceKgs}{' '}
                  <span className="text-[10px] font-bold text-[#6C6A82]">COM</span>
                </span>
                <span className="text-[11px] font-bold text-[#138A53] flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Halal Certified</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#F6F5FA] rounded-xl px-3 py-2 flex items-start gap-2 text-[11px] text-[#4A4863]">
            <TrendingUp className="w-3.5 h-3.5 text-[#F55A31] shrink-0 mt-0.5" />
            <span>
              Students in your dorm love this dinner after study hall.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleSlotPlanned('dinner')}
              className={`flex-1 py-3 rounded-2xl text-[13px] font-bold flex items-center justify-center gap-1.5 transition active:scale-[0.99] ${
                dayPlan.dinner.planned
                  ? 'bg-[#138A53] text-white shadow-sm'
                  : 'bg-[#3F32E5] hover:bg-[#3226C9] text-white shadow-[0_4px_14px_rgba(63,50,229,0.25)]'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>
                {dayPlan.dinner.planned ? 'Dinner Planned ✓' : 'Plan This Dinner'}
              </span>
            </button>
            <button
              type="button"
              onClick={toggleDormDrop}
              className={`px-3 py-3 rounded-2xl text-[11.5px] font-bold flex items-center gap-1.5 border transition ${
                dayPlan.dinner.dormDrop
                  ? 'bg-[#EEECFD] border-[#3F32E5] text-[#3F32E5]'
                  : 'bg-[#F4F2FC] border-transparent text-[#4A4863]'
              }`}
            >
              <DoorClosed className="w-3.5 h-3.5" />
              <span>Floor 3 Drop</span>
            </button>
            <button
              type="button"
              onClick={() => setSwapSlot('dinner')}
              aria-label="Swap dinner dish"
              className="w-10 h-11 rounded-2xl bg-[#F4F2FC] text-[#16142A] flex items-center justify-center hover:bg-[#E7E3FA] transition shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Save Plan & Set Reminders CTA */}
      <div className="pt-1 space-y-2">
        <button
          type="button"
          onClick={() => onSaveDayPlan(selectedDay)}
          className="w-full bg-[#3F32E5] hover:bg-[#3226C9] active:scale-[0.99] text-white font-bold text-[14.5px] py-3.5 px-5 rounded-2xl shadow-[0_6px_18px_rgba(63,50,229,0.28)] flex items-center justify-center gap-2 transition"
        >
          <Bell className="w-4.5 h-4.5 shrink-0" />
          <span>
            {dayPlan.reminderSet
              ? `${dayPlan.dayName} Plan Saved • Reminders Active ✓`
              : `Save ${dayPlan.dayName} Plan & Set Reminders`}
          </span>
        </button>
        <p className="text-[11px] text-[#6C6A82] text-center flex items-center justify-center gap-1">
          <Lock className="w-3 h-3 text-[#138A53]" />
          <span>You can freely modify pickup times up to 30 mins prior</span>
        </p>
      </div>

      {/* Meal Swap Modal */}
      {swapSlot ? (
        <div className="fixed inset-0 z-50 bg-[#16142A]/55 backdrop-blur-xs flex items-end justify-center">
          <div className="w-full max-w-[430px] bg-white rounded-t-3xl max-h-[75vh] flex flex-col overflow-hidden">
            <div className="px-4 py-3.5 border-b border-[#ECEAF6] flex items-center justify-between">
              <h3 className="text-[15px] font-extrabold text-[#16142A] capitalize">
                Choose {swapSlot} for {dayPlan.dayName}
              </h3>
              <button
                type="button"
                onClick={() => setSwapSlot(null)}
                className="w-8 h-8 rounded-full bg-[#F4F2FC] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-2.5 overflow-y-auto">
              {MEALS.map((meal) => (
                <button
                  key={meal.id}
                  type="button"
                  onClick={() => handleSwapMeal(meal.id)}
                  className="w-full text-left p-2.5 rounded-2xl border border-[#ECEAF6] hover:border-[#3F32E5] flex items-center gap-3 transition"
                >
                  <img
                    src={meal.thumbImage}
                    alt={meal.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-bold text-[#16142A] truncate">
                      {meal.shortName}
                    </p>
                    <p className="text-[11px] text-[#6C6A82] truncate">
                      {meal.category} • {meal.calories} kcal
                    </p>
                  </div>
                  <span className="text-[13.5px] font-extrabold text-[#3F32E5] tabular-nums shrink-0">
                    {meal.priceKgs} COM
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

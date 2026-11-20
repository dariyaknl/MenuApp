import React, { useMemo, useState } from 'react';
import {
  Banknote,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Croissant,
  Edit3,
  GraduationCap,
  Headphones,
  LogOut,
  MapPin,
  Plus,
  Scale,
  Shield,
  ShieldCheck,
  Soup,
  TrendingUp,
  Utensils,
  X,
} from 'lucide-react';
import { MEALS, UNIVERSITIES } from '../data/mockData';
import {
  DailySpendItem,
  MealItem,
  PaymentMethodId,
  StudentProfile,
} from '../types';

interface ProfileScreenProps {
  profile: StudentProfile;
  favorites: string[];
  dailySpending: DailySpendItem[];
  onUpdateProfile: (updates: Partial<StudentProfile>) => void;
  onToggleDietaryFilter: (tag: string) => void;
  onSelectPayment: (method: PaymentMethodId) => void;
  onToggleNotification: (key: 'mealReadyAlerts' | 'dailyLunchPing') => void;
  onReorderMeal: (meal: MealItem) => void;
  onOpenFavoritesTab: () => void;
  onLogout: () => void;
}

const DIETARY_OPTIONS = [
  'Halal Only',
  'No Peanuts',
  'Vegetarian',
  'Dairy-Free',
  'Gluten-Free',
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  favorites,
  dailySpending,
  onUpdateProfile,
  onToggleDietaryFilter,
  onSelectPayment,
  onToggleNotification,
  onReorderMeal,
  onOpenFavoritesTab,
  onLogout,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(profile.fullName);
  const [editUniId, setEditUniId] = useState(profile.universityId);
  const [editRoom, setEditRoom] = useState(profile.roomNumber);
  const [editCap, setEditCap] = useState(String(profile.weeklyCapKgs));
  const [infoModal, setInfoModal] = useState<'support' | 'terms' | null>(null);

  const totalWeeklySpent = useMemo(
    () => dailySpending.reduce((sum, d) => sum + d.amountKgs, 0),
    [dailySpending]
  );
  const weeklyPercent = Math.min(
    100,
    Math.round((totalWeeklySpent / Math.max(300, profile.weeklyCapKgs)) * 100)
  );
  const maxBar = Math.max(...dailySpending.map((d) => d.amountKgs), 300);
  const avgMealCost = Math.round(totalWeeklySpent / Math.max(1, dailySpending.length * 1.7));

  const savedMeals = useMemo(() => {
    const list = MEALS.filter((m) => favorites.includes(m.id));
    return list.length > 0 ? list.slice(0, 3) : MEALS.slice(0, 3);
  }, [favorites]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const uni = UNIVERSITIES.find((u) => u.id === editUniId) || UNIVERSITIES[0];
    const cleanName = editName.trim() || profile.fullName;
    const capVal = parseInt(editCap, 10);
    onUpdateProfile({
      fullName: cleanName,
      firstName: cleanName.split(' ')[0] || cleanName,
      universityId: uni.id,
      universityName: uni.name,
      universityShort: uni.shortName,
      roomNumber: editRoom.trim() || profile.roomNumber,
      weeklyCapKgs: !Number.isNaN(capVal) && capVal >= 500 ? capVal : profile.weeklyCapKgs,
    });
    setShowEditModal(false);
  };

  return (
    <div className="px-4 pt-3.5 pb-10 space-y-4">
      {/* Student Profile Hero Card */}
      <section className="bg-white rounded-3xl border border-[#ECEAF6] shadow-[0_6px_22px_rgba(34,28,70,0.05)] p-4 space-y-3.5">
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-[74px] h-[74px] rounded-full object-cover border-[3px] border-[#EAE6FA]"
            />
            <span className="w-6 h-6 rounded-full bg-[#138A53] text-white flex items-center justify-center absolute bottom-0 right-0 ring-2 ring-white">
              <GraduationCap className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-[19px] font-extrabold text-[#16142A] leading-tight truncate">
                {profile.fullName}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setEditName(profile.fullName);
                  setEditUniId(profile.universityId);
                  setEditRoom(profile.roomNumber);
                  setEditCap(String(profile.weeklyCapKgs));
                  setShowEditModal(true);
                }}
                aria-label="Edit student profile"
                className="w-8 h-8 rounded-full bg-[#F4F2FC] text-[#3F32E5] flex items-center justify-center hover:bg-[#E7E3FA] shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[12px] font-extrabold text-[#3F32E5] mt-0.5 tabular-nums">
              {profile.studentNumber}
            </p>
            <p className="text-[11.5px] text-[#6C6A82] mt-0.5 leading-snug">
              {profile.universityShort} • {profile.dormShort}, {profile.roomNumber}
            </p>
            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E6F7EF] text-[#138A53] text-[10.5px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Student Account</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#F6F5FA] rounded-2xl p-3">
            <p className="text-[10.5px] text-[#6C6A82] font-medium">Meal Card Plan</p>
            <div className="flex items-center gap-1.5 mt-1">
              <CreditCard className="w-4 h-4 text-[#3F32E5] shrink-0" />
              <span className="text-[13.5px] font-extrabold text-[#16142A] truncate">
                {profile.mealCardPlan}
              </span>
            </div>
          </div>
          <div className="bg-[#F6F5FA] rounded-2xl p-3">
            <p className="text-[10.5px] text-[#6C6A82] font-medium">Dorm Meal Spot</p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-[#F55A31] shrink-0" />
              <span className="text-[13.5px] font-extrabold text-[#16142A] truncate">
                {profile.dormMealSpot}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Spending Card */}
      <section className="bg-white rounded-3xl border border-[#ECEAF6] shadow-[0_4px_18px_rgba(34,28,70,0.04)] p-4 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEECFD] text-[#3F32E5] flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-[14.5px] font-extrabold text-[#16142A]">
                Weekly Spending
              </h3>
              <p className="text-[11px] text-[#6C6A82]">Budget Transparency</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#E6F7EF] text-[#138A53] text-[10.5px] font-bold tabular-nums">
            {weeklyPercent}% Used
          </span>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div className="flex items-baseline gap-1 tabular-nums">
              <span className="text-[22px] font-extrabold text-[#16142A]">
                {totalWeeklySpent.toLocaleString()}
              </span>
              <span className="text-[11px] font-extrabold text-[#16142A]">COM</span>
            </div>
            <span className="text-[11.5px] text-[#6C6A82] tabular-nums">
              Weekly Cap:{' '}
              <strong className="text-[#16142A] font-extrabold">
                {profile.weeklyCapKgs.toLocaleString()}
              </strong>{' '}
              KGS
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-[#EFEBFB] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#3F32E5] transition-all duration-300"
              style={{ width: `${weeklyPercent}%` }}
            />
          </div>
        </div>

        {/* 5-day Bar Chart */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {dailySpending.map((d) => {
            const isPeak = d.day === 'Tue';
            const heightPct = Math.max(22, Math.round((d.amountKgs / maxBar) * 100));
            return (
              <div key={d.day} className="flex flex-col items-center">
                <div className="w-full h-24 bg-[#F6F5FA] rounded-xl flex items-end p-1">
                  <div
                    className={`w-full rounded-lg transition-all ${
                      isPeak ? 'bg-[#3F32E5]' : 'bg-[#BDB6F2]'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span
                  className={`text-[11px] mt-1.5 font-bold ${
                    isPeak ? 'text-[#3F32E5]' : 'text-[#16142A]'
                  }`}
                >
                  {d.day}
                </span>
                <span
                  className={`text-[10px] tabular-nums ${
                    isPeak ? 'text-[#3F32E5] font-bold' : 'text-[#6C6A82]'
                  }`}
                >
                  {d.amountKgs}c
                </span>
              </div>
            );
          })}
        </div>

        <div className="bg-[#F6F5FA] rounded-2xl px-3.5 py-2.5 flex items-center justify-between">
          <span className="text-[11.5px] font-semibold text-[#4A4863] flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-[#138A53]" />
            <span>Average Daily Meal Cost</span>
          </span>
          <span className="text-[14px] font-extrabold text-[#16142A] tabular-nums">
            {avgMealCost} <span className="text-[10px] font-bold">COM/meal</span>
          </span>
        </div>
      </section>

      {/* Dietary & Allergen Safeguards */}
      <section className="bg-white rounded-3xl border border-[#ECEAF6] shadow-[0_4px_18px_rgba(34,28,70,0.04)] p-4 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FFEFE9] text-[#F55A31] flex items-center justify-center shrink-0">
            <Shield className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-[14.5px] font-extrabold text-[#16142A]">
              Dietary & Allergen Safeguards
            </h3>
            <p className="text-[11px] text-[#6C6A82]">Smart Cafeteria Filters</p>
          </div>
        </div>

        <p className="text-[12px] text-[#6C6A82] leading-relaxed">
          The cafeteria menu will auto-flag allergens and highlight dishes matching your diet.
        </p>

        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((tag) => {
            const active = profile.dietaryFilters.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleDietaryFilter(tag)}
                className={`px-3 py-1.5 rounded-full text-[11.5px] font-bold flex items-center gap-1.5 transition ${
                  active
                    ? 'bg-[#3F32E5] text-white shadow-xs'
                    : 'bg-[#F3F1FC] text-[#4A4863] hover:bg-[#E7E3FA]'
                }`}
              >
                {active ? (
                  tag === 'No Peanuts' ? (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-[#E6F7EF] rounded-2xl px-3.5 py-2.5 flex items-center gap-2 text-[11.5px] font-semibold text-[#138A53]">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Safe tray verification active for {profile.dormShort} counter</span>
        </div>
      </section>

      {/* Favorites & Payment Section */}
      <section className="space-y-3">
        <h3 className="text-[16px] font-extrabold text-[#16142A] px-0.5">
          Favorites & Payment
        </h3>

        {/* Saved Meals Card */}
        <div className="bg-white rounded-3xl border border-[#ECEAF6] p-4 space-y-2.5">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-[14px] font-extrabold text-[#16142A]">Saved Meals</h4>
            <button
              type="button"
              onClick={onOpenFavoritesTab}
              className="text-[11.5px] font-bold text-[#3F32E5]"
            >
              {favorites.length} Dishes
            </button>
          </div>

          {savedMeals.map((meal, idx) => {
            const iconBg =
              idx === 0
                ? 'bg-[#FFEFE9] text-[#F55A31]'
                : idx === 1
                ? 'bg-[#EEECFD] text-[#3F32E5]'
                : 'bg-[#E6F7EF] text-[#138A53]';
            return (
              <div
                key={meal.id}
                className="bg-[#F6F5FA] rounded-2xl p-2.5 flex items-center justify-between gap-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
                  >
                    {idx === 0 ? (
                      <Utensils className="w-4 h-4" />
                    ) : idx === 1 ? (
                      <Soup className="w-4 h-4" />
                    ) : (
                      <Croissant className="w-4 h-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-extrabold text-[#16142A] truncate">
                      {meal.shortName}
                    </p>
                    <p className="text-[10.5px] text-[#6C6A82] truncate">
                      {meal.priceKgs} сом • {meal.category}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onReorderMeal(meal)}
                  className="px-3 py-1.5 rounded-full bg-[#F55A31] hover:bg-[#E14A23] text-white text-[11px] font-bold shrink-0 active:scale-95 transition"
                >
                  Reorder
                </button>
              </div>
            );
          })}
        </div>

        {/* Payment Methods Card */}
        <div className="bg-white rounded-3xl border border-[#ECEAF6] p-4 space-y-2.5">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-[14px] font-extrabold text-[#16142A]">
              Payment Methods
            </h4>
            <span className="text-[11.5px] font-bold text-[#3F32E5]">Manage</span>
          </div>

          {[
            {
              id: 'mbank' as PaymentMethodId,
              title: 'MBank linked',
              sub: '•••• 4821 (Default)',
              badge: 'MB',
              badgeClass: 'bg-[#3F32E5] text-white',
            },
            {
              id: 'optima' as PaymentMethodId,
              title: 'Optima Bank',
              sub: 'Secondary wallet',
              badge: 'OP',
              badgeClass: 'bg-[#EFEBFB] text-[#4A4863]',
            },
            {
              id: 'cash' as PaymentMethodId,
              title: 'Cash at Counter',
              sub: 'Cafeteria pay-on-pickup',
              badge: <Banknote className="w-4 h-4" />,
              badgeClass: 'bg-[#138A53] text-white',
            },
          ].map((method) => {
            const active = profile.defaultPayment === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onSelectPayment(method.id)}
                className={`w-full rounded-2xl p-2.5 flex items-center justify-between border transition ${
                  active
                    ? 'bg-[#F4F2FC] border-[#3F32E5]/30'
                    : 'bg-[#F8F7FC] border-transparent hover:border-[#DCD7F4]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-extrabold ${method.badgeClass}`}
                  >
                    {method.badge}
                  </span>
                  <div className="text-left">
                    <p className="text-[12.5px] font-bold text-[#16142A]">
                      {method.title}
                    </p>
                    <p className="text-[10.5px] text-[#6C6A82]">{method.sub}</p>
                  </div>
                </div>
                {active ? (
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#3F32E5]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#8E8BA6]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Notifications Card */}
        <div className="bg-white rounded-3xl border border-[#ECEAF6] p-4 space-y-2.5">
          <h4 className="text-[14px] font-extrabold text-[#16142A] mb-1">
            Notifications
          </h4>

          <div className="bg-[#F6F5FA] rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4.5 h-4.5 text-[#3F32E5] shrink-0" />
              <div>
                <p className="text-[12.5px] font-bold text-[#16142A]">
                  Meal ready alerts
                </p>
                <p className="text-[10.5px] text-[#6C6A82]">
                  Live ping when tray is plated
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={profile.notifications.mealReadyAlerts}
              onClick={() => onToggleNotification('mealReadyAlerts')}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
                profile.notifications.mealReadyAlerts
                  ? 'bg-[#3F32E5]'
                  : 'bg-[#D3CFE8]'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  profile.notifications.mealReadyAlerts
                    ? 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="bg-[#F6F5FA] rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4.5 h-4.5 text-[#3F32E5] shrink-0" />
              <div>
                <p className="text-[12.5px] font-bold text-[#16142A]">
                  Daily 11:30 lunch ping
                </p>
                <p className="text-[10.5px] text-[#6C6A82]">
                  Daily preview before lines form
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={profile.notifications.dailyLunchPing}
              onClick={() => onToggleNotification('dailyLunchPing')}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
                profile.notifications.dailyLunchPing
                  ? 'bg-[#3F32E5]'
                  : 'bg-[#D3CFE8]'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  profile.notifications.dailyLunchPing
                    ? 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Support & Logout Card */}
        <div className="bg-white rounded-3xl border border-[#ECEAF6] overflow-hidden divide-y divide-[#F0EEF8]">
          <button
            type="button"
            onClick={() => setInfoModal('support')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF9FE] transition"
          >
            <span className="flex items-center gap-3 text-[13px] font-bold text-[#16142A]">
              <Headphones className="w-4.5 h-4.5 text-[#4A4863]" />
              <span>University Dorm Support</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#8E8BA6]" />
          </button>

          <button
            type="button"
            onClick={() => setInfoModal('terms')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF9FE] transition"
          >
            <span className="flex items-center gap-3 text-[13px] font-bold text-[#16142A]">
              <Scale className="w-4.5 h-4.5 text-[#4A4863]" />
              <span>Terms & Cafeteria Guidelines</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#8E8BA6]" />
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#FFF5F5] transition"
          >
            <span className="flex items-center gap-3 text-[13px] font-bold text-[#E11D48]">
              <LogOut className="w-4.5 h-4.5" />
              <span>Log Out of DormEats</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#E11D48]" />
          </button>
        </div>

        <p className="text-center text-[10.5px] text-[#8E8BA6] pt-1">
          DormEats {profile.universityId.toUpperCase()} Edition • v2.4.1 (Build 890)
        </p>
      </section>

      {/* Edit Student Profile Modal */}
      {showEditModal ? (
        <div className="fixed inset-0 z-50 bg-[#16142A]/55 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveProfile}
            className="w-full max-w-[380px] bg-white rounded-3xl p-5 space-y-3.5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-extrabold text-[#16142A]">
                Edit Student Profile
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full bg-[#F4F2FC] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11.5px] font-bold text-[#4A4863] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-[#F4F2FC] rounded-xl px-3 py-2.5 text-[13px] font-semibold outline-none focus:ring-2 focus:ring-[#3F32E5]"
              />
            </div>

            <div>
              <label className="block text-[11.5px] font-bold text-[#4A4863] mb-1">
                University
              </label>
              <select
                value={editUniId}
                onChange={(e) => setEditUniId(e.target.value)}
                className="w-full bg-[#F4F2FC] rounded-xl px-3 py-2.5 text-[13px] font-semibold outline-none"
              >
                {UNIVERSITIES.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11.5px] font-bold text-[#4A4863] mb-1">
                  Dorm Room
                </label>
                <input
                  type="text"
                  value={editRoom}
                  onChange={(e) => setEditRoom(e.target.value)}
                  className="w-full bg-[#F4F2FC] rounded-xl px-3 py-2.5 text-[13px] font-semibold outline-none"
                />
              </div>
              <div>
                <label className="block text-[11.5px] font-bold text-[#4A4863] mb-1">
                  Weekly Cap (KGS)
                </label>
                <input
                  type="number"
                  value={editCap}
                  onChange={(e) => setEditCap(e.target.value)}
                  className="w-full bg-[#F4F2FC] rounded-xl px-3 py-2.5 text-[13px] font-semibold outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#3F32E5] text-white font-bold text-[13.5px]"
            >
              Save Changes
            </button>
          </form>
        </div>
      ) : null}

      {/* Support / Guidelines Info Modal */}
      {infoModal ? (
        <div className="fixed inset-0 z-50 bg-[#16142A]/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[380px] bg-white rounded-3xl p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-extrabold text-[#16142A]">
                {infoModal === 'support'
                  ? 'University Dorm Support'
                  : 'Cafeteria Guidelines'}
              </h3>
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                className="w-8 h-8 rounded-full bg-[#F4F2FC] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {infoModal === 'support' ? (
              <p className="text-[12.5px] text-[#4A4863] leading-relaxed">
                {profile.dormitory} Dining Desk is open daily 07:30–20:00. For urgent tray or CampusPass+ inquiries, visit Window #1 or email dining@{profile.universityId}.edu.kg.
              </p>
            ) : (
              <p className="text-[12.5px] text-[#4A4863] leading-relaxed">
                All meals are prepared fresh daily with certified halal ingredients. Planned meals can be modified up to 30 minutes prior to pickup window. Bring your 4-digit code to skip the cashier queue.
              </p>
            )}
            <button
              type="button"
              onClick={() => setInfoModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#EEECFD] text-[#3F32E5] font-bold text-[13px]"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

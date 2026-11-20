import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { CheckoutModal } from './components/CheckoutModal';
import { FavoritesScreen } from './components/FavoritesScreen';
import { FoodDetailsScreen } from './components/FoodDetailsScreen';
import { HomeScreen } from './components/HomeScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { OrdersScreen } from './components/OrdersScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { TopBar } from './components/TopBar';
import { WeeklyMenuScreen } from './components/WeeklyMenuScreen';
import {
  CartItem,
  DayKey,
  DormEatsState,
  MealItem,
  NavTab,
  OrderRecord,
  OrderStatus,
  PaymentMethodId,
  StudentProfile,
  WeeklyDayPlan,
} from './types';
import { loadDormEatsState, saveDormEatsState } from './utils/storage';

const TAB_LABELS: Record<NavTab, string> = {
  home: 'Home',
  menu: 'Weekly Menu',
  orders: 'Orders',
  favorites: 'Favorites',
  profile: 'Profile',
};

export default function App() {
  const [state, setState] = useState<DormEatsState>(() => loadDormEatsState());
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedMeal, setSelectedMeal] = useState<MealItem | null>(null);
  const [checkoutPayload, setCheckoutPayload] = useState<{
    items: CartItem[];
    isTrayMode: boolean;
  } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    saveDormEatsState(state);
  }, [state]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const activeOrdersCount = useMemo(
    () => state.orders.filter((o) => o.status !== 'completed').length,
    [state.orders]
  );

  const handleCompleteVerification = (updates: Partial<StudentProfile>) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      profile: {
        ...prev.profile,
        ...updates,
      },
    }));
    setActiveTab('home');
    showToast(`Welcome, ${updates.firstName || state.profile.firstName}! Campus pass verified.`);
  };

  const handleToggleFavorite = (mealId: string) => {
    setState((prev) => {
      const exists = prev.favorites.includes(mealId);
      const nextFavs = exists
        ? prev.favorites.filter((id) => id !== mealId)
        : [...prev.favorites, mealId];
      showToast(exists ? 'Removed from favorites' : 'Saved to favorites ♥');
      return { ...prev, favorites: nextFavs };
    });
  };

  const addCartItem = (newItem: CartItem) => {
    setState((prev) => {
      const existingIdx = prev.cart.findIndex((c) => c.id === newItem.id);
      const nextCart = [...prev.cart];
      if (existingIdx >= 0) {
        const existing = nextCart[existingIdx];
        const qty = existing.quantity + newItem.quantity;
        nextCart[existingIdx] = {
          ...existing,
          quantity: qty,
          lineTotalKgs: existing.unitTotalKgs * qty,
        };
      } else {
        nextCart.push(newItem);
      }
      return { ...prev, cart: nextCart };
    });
    showToast(`Added ${newItem.mealName} to tray`);
  };

  const handleQuickAddMeal = (meal: MealItem) => {
    const portion = meal.portionSizes[0];
    addCartItem({
      id: `${meal.id}-${portion.id}-none`,
      mealId: meal.id,
      mealName: meal.name,
      image: meal.thumbImage,
      portionId: portion.id,
      portionLabel: portion.label,
      basePriceKgs: portion.priceKgs,
      addons: [],
      quantity: 1,
      unitTotalKgs: portion.priceKgs,
      lineTotalKgs: portion.priceKgs,
    });
  };

  const handleUpdateTrayQty = (cartItemId: string, delta: number) => {
    setState((prev) => {
      const nextCart = prev.cart
        .map((item) => {
          if (item.id !== cartItemId) return item;
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return null;
          return {
            ...item,
            quantity: nextQty,
            lineTotalKgs: item.unitTotalKgs * nextQty,
          };
        })
        .filter((x): x is CartItem => x !== null);
      if (checkoutPayload?.isTrayMode) {
        setCheckoutPayload({ items: nextCart, isTrayMode: true });
      }
      return { ...prev, cart: nextCart };
    });
  };

  const handleRemoveTrayItem = (cartItemId: string) => {
    setState((prev) => {
      const nextCart = prev.cart.filter((item) => item.id !== cartItemId);
      if (checkoutPayload?.isTrayMode) {
        setCheckoutPayload({ items: nextCart, isTrayMode: true });
      }
      return { ...prev, cart: nextCart };
    });
  };

  const handleConfirmOrder = ({
    items,
    paymentMethod,
    pickupWindow,
    includeWelcomeTea,
  }: {
    items: CartItem[];
    paymentMethod: PaymentMethodId;
    pickupWindow: string;
    includeWelcomeTea: boolean;
  }) => {
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const pickupCode = String(codeNum);
    const totalKgs = items.reduce((sum, i) => sum + i.lineTotalKgs, 0);
    const firstItem = items[0];
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const paymentLabel =
      paymentMethod === 'mbank'
        ? 'Paid via MBank QR'
        : paymentMethod === 'optima'
        ? 'Paid via Optima Bank'
        : 'Pay Cash at Counter';

    const title =
      items.length === 1
        ? firstItem.mealName
        : `${firstItem.mealName} + ${items.length - 1} more`;

    const subtitle =
      items.length === 1
        ? `${firstItem.portionLabel}${
            firstItem.addons.length > 0
              ? ` • ${firstItem.addons.map((a) => a.label).join(', ')}`
              : ''
          }`
        : `${items.reduce((s, i) => s + i.quantity, 0)} items • ${pickupWindow}`;

    const newOrder: OrderRecord = {
      id: `#DE-${pickupCode}`,
      pickupCode,
      items,
      title,
      subtitle,
      image: firstItem.image,
      totalKgs,
      paymentLabel,
      paymentMethod,
      pickupStation: `${state.profile.dormitory}, ${state.profile.dormMealSpot}`,
      estimatedReadyBy: pickupWindow.includes('ASAP') ? '12 mins' : pickupWindow,
      readyInMinutes: 10,
      placedTime: nowTime,
      dateLabel: 'Today',
      dayKey: 'Wed',
      status: 'placed',
      welcomeTeaApplied: includeWelcomeTea,
      timestamps: {
        placed: nowTime,
        ready: '~12 mins',
      },
    };

    setState((prev) => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      cart: checkoutPayload?.isTrayMode ? [] : prev.cart,
      dailySpending: prev.dailySpending.map((d) =>
        d.day === 'Wed' ? { ...d, amountKgs: d.amountKgs + totalKgs } : d
      ),
    }));

    setCheckoutPayload(null);
    setSelectedMeal(null);
    setActiveTab('orders');
    showToast(`Order ${newOrder.id} sent! Pickup code: ${pickupCode}`);
  };

  const handleAdvanceOrderStatus = (orderId: string) => {
    const flow: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'ready', 'completed'];
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((order) => {
        if (order.id !== orderId) return order;
        const idx = flow.indexOf(order.status);
        const nextStatus = flow[Math.min(flow.length - 1, idx + 1)];
        const nextTimestamps = { ...order.timestamps };
        if (nextStatus === 'confirmed') nextTimestamps.confirmed = nowTime;
        if (nextStatus === 'preparing') nextTimestamps.preparing = 'Now';
        if (nextStatus === 'ready') nextTimestamps.ready = nowTime;

        const msgMap: Record<OrderStatus, string> = {
          placed: 'Order placed',
          confirmed: `${order.id} confirmed by kitchen!`,
          preparing: `Chef Ulan is plating ${order.id}`,
          ready: `${order.id} is READY for pickup! Code: ${order.pickupCode}`,
          completed: `${order.id} marked picked up ✓`,
        };
        showToast(msgMap[nextStatus]);

        return {
          ...order,
          status: nextStatus,
          readyInMinutes:
            nextStatus === 'confirmed'
              ? 8
              : nextStatus === 'preparing'
              ? 4
              : 0,
          timestamps: nextTimestamps,
        };
      }),
    }));
  };

  const handleReorderOrder = (order: OrderRecord) => {
    order.items.forEach((item) => addCartItem(item));
    setCheckoutPayload({
      items: order.items,
      isTrayMode: false,
    });
  };

  const handleReorderMeal = (meal: MealItem) => {
    setSelectedMeal(meal);
  };

  const handleUpdateDayPlan = (dayKey: DayKey, updated: WeeklyDayPlan) => {
    setState((prev) => ({
      ...prev,
      weeklyPlan: {
        ...prev.weeklyPlan,
        [dayKey]: updated,
      },
    }));
  };

  const handleSaveDayPlan = (dayKey: DayKey) => {
    setState((prev) => ({
      ...prev,
      weeklyPlan: {
        ...prev.weeklyPlan,
        [dayKey]: {
          ...prev.weeklyPlan[dayKey],
          reminderSet: true,
        },
      },
    }));
    showToast(`${state.weeklyPlan[dayKey].dayName} meal plan & reminders saved!`);
  };

  const handleUpdateProfile = (updates: Partial<StudentProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...updates,
      },
    }));
    showToast('Student profile updated');
  };

  const handleToggleDietaryFilter = (tag: string) => {
    setState((prev) => {
      const exists = prev.profile.dietaryFilters.includes(tag);
      const next = exists
        ? prev.profile.dietaryFilters.filter((t) => t !== tag)
        : [...prev.profile.dietaryFilters, tag];
      return {
        ...prev,
        profile: {
          ...prev.profile,
          dietaryFilters: next,
        },
      };
    });
  };

  const handleSelectPayment = (method: PaymentMethodId) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        defaultPayment: method,
      },
    }));
    showToast('Default payment method updated');
  };

  const handleToggleNotification = (key: 'mealReadyAlerts' | 'dailyLunchPing') => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        notifications: {
          ...prev.profile.notifications,
          [key]: !prev.profile.notifications[key],
        },
      },
    }));
  };

  const handleLogout = () => {
    setSelectedMeal(null);
    setCheckoutPayload(null);
    setState((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
  };

  return (
    <div className="min-h-screen bg-[#ECEAF4] flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-[#F5F4FA] shadow-[0_0_50px_rgba(22,20,42,0.1)] flex flex-col relative">
        {!state.isAuthenticated ? (
          <OnboardingScreen
            initialProfile={state.profile}
            onCompleteVerification={handleCompleteVerification}
          />
        ) : selectedMeal ? (
          <FoodDetailsScreen
            meal={selectedMeal}
            profile={state.profile}
            isFavorite={state.favorites.includes(selectedMeal.id)}
            onBack={() => setSelectedMeal(null)}
            onAvatarClick={() => {
              setSelectedMeal(null);
              setActiveTab('profile');
            }}
            onToggleFavorite={() => handleToggleFavorite(selectedMeal.id)}
            onAddToTray={(item) => {
              addCartItem(item);
              setSelectedMeal(null);
            }}
            onOrderNow={(item) =>
              setCheckoutPayload({ items: [item], isTrayMode: false })
            }
          />
        ) : (
          <>
            <TopBar
              sectionLabel={TAB_LABELS[activeTab]}
              profile={state.profile}
              onAvatarClick={() => setActiveTab('profile')}
            />

            <main className="flex-1">
              {activeTab === 'home' ? (
                <HomeScreen
                  profile={state.profile}
                  favorites={state.favorites}
                  cart={state.cart}
                  onSelectMeal={(meal) => setSelectedMeal(meal)}
                  onQuickAddToCart={handleQuickAddMeal}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenCartCheckout={() =>
                    setCheckoutPayload({ items: state.cart, isTrayMode: true })
                  }
                />
              ) : null}

              {activeTab === 'menu' ? (
                <WeeklyMenuScreen
                  profile={state.profile}
                  weeklyPlan={state.weeklyPlan}
                  favorites={state.favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onUpdateDayPlan={handleUpdateDayPlan}
                  onSaveDayPlan={handleSaveDayPlan}
                  onSelectMealDetails={(meal) => setSelectedMeal(meal)}
                />
              ) : null}

              {activeTab === 'orders' ? (
                <OrdersScreen
                  profile={state.profile}
                  orders={state.orders}
                  onAdvanceOrderStatus={handleAdvanceOrderStatus}
                  onReorder={handleReorderOrder}
                />
              ) : null}

              {activeTab === 'favorites' ? (
                <FavoritesScreen
                  profile={state.profile}
                  favorites={state.favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectMeal={(meal) => setSelectedMeal(meal)}
                  onQuickAddToCart={handleQuickAddMeal}
                  onBrowseMenu={() => setActiveTab('home')}
                />
              ) : null}

              {activeTab === 'profile' ? (
                <ProfileScreen
                  profile={state.profile}
                  favorites={state.favorites}
                  dailySpending={state.dailySpending}
                  onUpdateProfile={handleUpdateProfile}
                  onToggleDietaryFilter={handleToggleDietaryFilter}
                  onSelectPayment={handleSelectPayment}
                  onToggleNotification={handleToggleNotification}
                  onReorderMeal={handleReorderMeal}
                  onOpenFavoritesTab={() => setActiveTab('favorites')}
                  onLogout={handleLogout}
                />
              ) : null}
            </main>

            <BottomNav
              activeTab={activeTab}
              onSelectTab={(tab) => setActiveTab(tab)}
              activeOrdersCount={activeOrdersCount}
              favoritesCount={state.favorites.length}
            />
          </>
        )}

        {/* Checkout / Tray Modal */}
        {checkoutPayload ? (
          <CheckoutModal
            items={checkoutPayload.isTrayMode ? state.cart : checkoutPayload.items}
            isTrayMode={checkoutPayload.isTrayMode}
            profile={state.profile}
            isFirstOrder={state.orders.length <= 3}
            onClose={() => setCheckoutPayload(null)}
            onUpdateQty={handleUpdateTrayQty}
            onRemoveItem={handleRemoveTrayItem}
            onConfirmOrder={handleConfirmOrder}
          />
        ) : null}

        {/* Floating Feedback Toast */}
        {toastMsg ? (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-max max-w-[360px] pointer-events-none">
            <div className="bg-[#16142A] text-white px-4 py-2.5 rounded-full shadow-xl text-[12px] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>{toastMsg}</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

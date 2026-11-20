import { INITIAL_STATE } from '../data/mockData';
import { DormEatsState } from '../types';

const STORAGE_KEY = 'dormeats_app_state_v1';

export function loadDormEatsState(): DormEatsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<DormEatsState>;
    return {
      isAuthenticated:
        typeof parsed.isAuthenticated === 'boolean'
          ? parsed.isAuthenticated
          : INITIAL_STATE.isAuthenticated,
      profile: {
        ...INITIAL_STATE.profile,
        ...(parsed.profile || {}),
        notifications: {
          ...INITIAL_STATE.profile.notifications,
          ...(parsed.profile?.notifications || {}),
        },
      },
      favorites: Array.isArray(parsed.favorites)
        ? parsed.favorites
        : INITIAL_STATE.favorites,
      cart: Array.isArray(parsed.cart) ? parsed.cart : INITIAL_STATE.cart,
      orders: Array.isArray(parsed.orders) ? parsed.orders : INITIAL_STATE.orders,
      weeklyPlan: parsed.weeklyPlan
        ? { ...INITIAL_STATE.weeklyPlan, ...parsed.weeklyPlan }
        : INITIAL_STATE.weeklyPlan,
      dailySpending: Array.isArray(parsed.dailySpending)
        ? parsed.dailySpending
        : INITIAL_STATE.dailySpending,
    };
  } catch {
    return INITIAL_STATE;
  }
}

export function saveDormEatsState(state: DormEatsState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

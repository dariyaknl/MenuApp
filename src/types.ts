export type NavTab = 'home' | 'menu' | 'orders' | 'favorites' | 'profile';

export type MealCategory = 'All' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export type PaymentMethodId = 'mbank' | 'optima' | 'cash';

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'ready' | 'completed';

export interface PortionOption {
  id: string;
  label: string;
  description: string;
  priceKgs: number;
  badge?: string;
}

export interface AddonOption {
  id: string;
  label: string;
  description: string;
  priceKgs: number;
}

export interface MealItem {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  description: string;
  category: Exclude<MealCategory, 'All'>;
  priceKgs: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  rating: number;
  reviewCount: number;
  image: string;
  thumbImage: string;
  topBadge?: {
    text: string;
    variant: 'coral' | 'indigo';
  };
  secondaryBadge?: {
    text: string;
    variant: 'green' | 'coral';
  };
  isHalal: boolean;
  allergens: string[];
  dietaryTags: string[];
  allergenNote: string;
  ingredients: string;
  prepTime: string;
  pickupSpot: string;
  portionsLeft?: number;
  availabilityLabel: string;
  availabilityType: 'warning' | 'available';
  portionSizes: PortionOption[];
  addons: AddonOption[];
  featuredCard: boolean;
  ctaAccent: 'coral' | 'indigo';
}

export interface CartItem {
  id: string;
  mealId: string;
  mealName: string;
  image: string;
  portionId: string;
  portionLabel: string;
  basePriceKgs: number;
  addons: AddonOption[];
  quantity: number;
  unitTotalKgs: number;
  lineTotalKgs: number;
}

export interface OrderRecord {
  id: string;
  pickupCode: string;
  items: CartItem[];
  title: string;
  subtitle: string;
  image: string;
  totalKgs: number;
  paymentLabel: string;
  paymentMethod: PaymentMethodId;
  pickupStation: string;
  estimatedReadyBy: string;
  readyInMinutes: number;
  placedTime: string;
  dateLabel: string;
  dayKey: DayKey;
  status: OrderStatus;
  welcomeTeaApplied?: boolean;
  timestamps: {
    placed?: string;
    confirmed?: string;
    preparing?: string;
    ready?: string;
  };
}

export type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export interface PlannedSlot {
  mealId: string;
  planned: boolean;
  pickupTime: string;
  pickupStation: string;
  dormDrop?: boolean;
}

export interface WeeklyDayPlan {
  dayKey: DayKey;
  dayName: string;
  dateNum: string;
  isToday?: boolean;
  dailyLimitKgs: number;
  breakfast: PlannedSlot;
  lunch: PlannedSlot;
  dinner: PlannedSlot;
  reminderSet: boolean;
}

export interface StudentProfile {
  fullName: string;
  firstName: string;
  universityId: string;
  universityName: string;
  universityShort: string;
  dormitory: string;
  dormShort: string;
  roomNumber: string;
  email: string;
  studentNumber: string;
  mealCardPlan: string;
  dormMealSpot: string;
  verified: boolean;
  weeklyCapKgs: number;
  dietaryFilters: string[];
  defaultPayment: PaymentMethodId;
  notifications: {
    mealReadyAlerts: boolean;
    dailyLunchPing: boolean;
  };
  avatarUrl: string;
}

export interface DailySpendItem {
  day: DayKey;
  amountKgs: number;
}

export interface DormEatsState {
  isAuthenticated: boolean;
  profile: StudentProfile;
  favorites: string[];
  cart: CartItem[];
  orders: OrderRecord[];
  weeklyPlan: Record<DayKey, WeeklyDayPlan>;
  dailySpending: DailySpendItem[];
}

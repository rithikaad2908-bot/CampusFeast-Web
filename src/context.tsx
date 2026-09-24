import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  CartItem,
  FoodItem,
  FoodRatingInfo,
  Order,
  OrderStatus,
  PageId,
  UserReview,
  UserProfile,
} from './types';
import { foodItems } from './data';

const STUDENT_DISCOUNT_RATE = 0.10; // 10% campus student discount

const defaultProfile: UserProfile = {
  name: 'Alex Student',
  email: 'alex.student@campus.edu',
  phone: '98765 43210',
  campus: 'Main Canteen',
  block: 'Ground Floor',
  savedLocations: ['Main Canteen — Ground Floor', 'Library Cafe — Reading Hall'],
};

const demoOrders: Order[] = [
  {
    id: 'CF-2401',
    items: [
      { food: foodItems.find((f) => f.id === 'chicken-roll')!, quantity: 2 },
      { food: foodItems.find((f) => f.id === 'cold-coffee')!, quantity: 1 },
    ],
    subtotal: 250,
    discount: 25,
    total: 225,
    studentName: 'Alex Student',
    studentEmail: 'alex.student@campus.edu',
    phone: '98765 43210',
    campus: 'Food Court',
    block: 'Block A',
    fulfillment: 'pickup',
    paymentMethod: 'upi',
    instructions: '',
    placedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    estimatedTime: 15,
    status: 'completed',
  },
  {
    id: 'CF-2398',
    items: [
      { food: foodItems.find((f) => f.id === 'masala-dosa')!, quantity: 1 },
      { food: foodItems.find((f) => f.id === 'samosa')!, quantity: 2 },
    ],
    subtotal: 110,
    discount: 11,
    total: 99,
    studentName: 'Alex Student',
    studentEmail: 'alex.student@campus.edu',
    phone: '98765 43210',
    campus: 'Main Canteen',
    block: 'Ground Floor',
    fulfillment: 'pickup',
    paymentMethod: 'cash',
    instructions: 'Extra sambar please',
    placedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    estimatedTime: 12,
    status: 'completed',
  },
];

interface AppContextValue {
  // Routing
  page: PageId;
  selectedFoodId: string | null;
  navigate: (page: PageId, foodId?: string | null) => void;

  // Campus selection
  selectedCampus: string;
  selectedBlock: string;
  setSelectedCampus: (campus: string) => void;
  setSelectedBlock: (block: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (food: FoodItem, quantity?: number) => void;
  removeFromCart: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  total: number;

  // Favorites
  favorites: string[];
  toggleFavorite: (foodId: string) => void;
  isFavorite: (foodId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'placedAt' | 'status'>) => Order;
  getOrder: (id: string) => Order | undefined;
  advanceOrderStatus: (id: string) => void;
  markOrderRated: (orderId: string) => void;
  recentlyOrderedFoodIds: string[];

  // User Reviews / Ratings
  userReviews: UserReview[];
  submitOrderRating: (orderId: string, author: string, rating: number, comment: string) => void;
  getFoodRatingInfo: (foodId: string) => FoodRatingInfo;
  getFoodUserReviews: (foodId: string) => UserReview[];
  isOrderRated: (orderId: string) => boolean;

  // Profile
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Derived data
  popularItems: FoodItem[];
  recommendedItems: FoodItem[];
}

const AppContext = createContext<AppContextValue | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore
  }
  return fallback;
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>('home');
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);

  const [selectedCampus, setSelectedCampus] = useState<string>(() =>
    loadFromStorage('cf_campus', 'Main Canteen')
  );
  const [selectedBlock, setSelectedBlock] = useState<string>(() =>
    loadFromStorage('cf_block', 'Ground Floor')
  );

  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage('cf_cart', []));
  const [favorites, setFavorites] = useState<string[]>(() => loadFromStorage('cf_favorites', []));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage('cf_orders', demoOrders));
  const [userReviews, setUserReviews] = useState<UserReview[]>(() => loadFromStorage('cf_user_reviews', []));
  const [profile, setProfile] = useState<UserProfile>(() =>
    loadFromStorage('cf_profile', defaultProfile)
  );

  // Persist state
  useEffect(() => saveToStorage('cf_campus', selectedCampus), [selectedCampus]);
  useEffect(() => saveToStorage('cf_block', selectedBlock), [selectedBlock]);
  useEffect(() => saveToStorage('cf_cart', cart), [cart]);
  useEffect(() => saveToStorage('cf_favorites', favorites), [favorites]);
  useEffect(() => saveToStorage('cf_orders', orders), [orders]);
  useEffect(() => saveToStorage('cf_user_reviews', userReviews), [userReviews]);
  useEffect(() => saveToStorage('cf_profile', profile), [profile]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, selectedFoodId]);

  const navigate = useCallback((newPage: PageId, foodId: string | null = null) => {
    if (foodId !== null) setSelectedFoodId(foodId);
    setPage(newPage);
  }, []);

  const addToCart = useCallback((food: FoodItem, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { food, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((foodId: string) => {
    setCart((prev) => prev.filter((item) => item.food.id !== foodId));
  }, []);

  const updateQuantity = useCallback((foodId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.food.id !== foodId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.food.id === foodId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((foodId: string) => {
    setFavorites((prev) =>
      prev.includes(foodId)
        ? prev.filter((id) => id !== foodId)
        : [...prev, foodId]
    );
  }, []);

  const isFavorite = useCallback((foodId: string) => favorites.includes(foodId), [favorites]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0),
    [cart]
  );
  const discount = useMemo(() => Math.round(subtotal * STUDENT_DISCOUNT_RATE), [subtotal]);
  const total = useMemo(() => subtotal - discount, [subtotal, discount]);

  const placeOrder = useCallback(
    (orderData: Omit<Order, 'id' | 'placedAt' | 'status'>) => {
      const id = `CF-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        ...orderData,
        id,
        placedAt: new Date().toISOString(),
        status: 'placed',
      };
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    },
    []
  );

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  const advanceOrderStatus = useCallback((id: string) => {
    const flow: Record<OrderStatus, OrderStatus> = {
      placed: 'preparing',
      preparing: 'ready',
      ready: 'completed',
      completed: 'completed',
    };
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: flow[o.status] } : o))
    );
  }, []);

  const markOrderRated = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, rated: true } : o))
    );
  }, []);

  const submitOrderRating = useCallback(
    (orderId: string, author: string, rating: number, comment: string) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      const newReviews: UserReview[] = order.items.map((item) => ({
        id: `ur-${orderId}-${item.food.id}-${Date.now()}`,
        orderId,
        author: author.trim() || 'You',
        rating,
        date: 'Just now',
        comment: comment.trim(),
      }));
      setUserReviews((prev) => [...prev, ...newReviews]);
      markOrderRated(orderId);
    },
    [orders, markOrderRated]
  );

  const getFoodRatingInfo = useCallback(
    (foodId: string): FoodRatingInfo => {
      const food = foodItems.find((f) => f.id === foodId);
      if (!food) return { rating: 0, ratingCount: 0 };

      const foodUserReviews = userReviews.filter((r) =>
        orders.some(
          (o) => o.id === r.orderId && o.items.some((i) => i.food.id === foodId)
        )
      );

      if (foodUserReviews.length === 0) {
        return { rating: food.rating, ratingCount: food.ratingCount };
      }

      const totalCount = food.ratingCount + foodUserReviews.length;
      const totalSum = food.rating * food.ratingCount + foodUserReviews.reduce((s, r) => s + r.rating, 0);
      return { rating: Math.round((totalSum / totalCount) * 10) / 10, ratingCount: totalCount };
    },
    [userReviews, orders]
  );

  const getFoodUserReviews = useCallback(
    (foodId: string): UserReview[] =>
      userReviews.filter((r) =>
        orders.some(
          (o) => o.id === r.orderId && o.items.some((i) => i.food.id === foodId)
        )
      ),
    [userReviews, orders]
  );

  const isOrderRated = useCallback(
    (orderId: string) => orders.find((o) => o.id === orderId)?.rated ?? false,
    [orders]
  );

  const recentlyOrderedFoodIds = useMemo(() => {
    const ids: string[] = [];
    for (const order of orders) {
      for (const item of order.items) {
        if (!ids.includes(item.food.id)) ids.push(item.food.id);
      }
    }
    return ids;
  }, [orders]);

  const popularItems = useMemo(() => foodItems.filter((f) => f.popular), []);
  const recommendedItems = useMemo(() => foodItems.filter((f) => f.recommended), []);

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  }, []);

  const value: AppContextValue = {
    page,
    selectedFoodId,
    navigate,
    selectedCampus,
    selectedBlock,
    setSelectedCampus,
    setSelectedBlock,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    subtotal,
    discount,
    total,
    favorites,
    toggleFavorite,
    isFavorite,
    orders,
    placeOrder,
    getOrder,
    advanceOrderStatus,
    markOrderRated,
    recentlyOrderedFoodIds,
    userReviews,
    submitOrderRating,
    getFoodRatingInfo,
    getFoodUserReviews,
    isOrderRated,
    profile,
    updateProfile,
    popularItems,
    recommendedItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
